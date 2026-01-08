import { type NextAuthOptions } from 'next-auth';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import prisma from '@/lib/prisma';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { verifyEthereumSignature, verifySolanaSignature } from './auth-utils';
import { serverEnv } from '@/env/server';

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: {  label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Please provide email and password');
        }
        const user = await prisma.user.findFirst({
          where: {
            email: credentials.email,
          },
        });

        if (!user || !user.hashedPassword) {
          throw new Error('No user found with this email.');
        }

        const isPasswordCorrect = await bcrypt.compare(credentials.password, user.hashedPassword);
        if (!isPasswordCorrect) {
          throw new Error('Incorrect password.');
        }
        return user;
      }
    }),
    CredentialsProvider({
      id: 'web3',
      name: 'Web3',
      credentials: {
        message: { label: 'Message', type: 'text' },
        signature: { label: 'Signature', type: 'text' },
        address: { label: 'Address', type: 'text' },
        chain: { label: 'Chain', type: 'text' },
        nonce: { label: 'Nonce', type: 'text' },
      },
      async authorize(credentials) {
        if (!credentials) return null;
        try {
          const { message, signature, address, chain, nonce } = credentials;
          let isValid = false;

          if (chain === 'ethereum') isValid = await verifyEthereumSignature(message, signature, nonce);
          else if (chain === 'solana') isValid = verifySolanaSignature(message, signature, address);

          if (isValid) {
            const account = await prisma.account.findUnique({
              where: {
                provider_providerAccountId: {
                  provider: chain,
                  providerAccountId: address,
                },
              },
              include: { user: true },
            });

            if (account) return account.user;

            // If no account, create a new user and account
            const newUser = await prisma.user.create({
              data: {
                name: `${address.substring(0, 4)}...${address.substring(address.length - 4)}`,
                walletAddress: address,
                accounts: {
                  create: {
                    provider: chain,
                    providerAccountId: address,
                    type: 'web3',
                  },
                },
              },
            });
            return newUser;
          }
          return null;
        } catch (error) {
          console.error('Web3 Auth Error:', error);
          return null;
        }
      },
    }),
    GoogleProvider({
      clientId: serverEnv.GOOGLE_CLIENT_ID,
      clientSecret: serverEnv.GOOGLE_CLIENT_SECRET,
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  cookies: {
    sessionToken: {
      name: `__Secure-next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        domain: serverEnv.NODE_ENV === 'production' ? '.made-in-haiphong.com' : undefined,
        secure: true
      }
    }
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (!user.id || !account) return false;

      const existingAccount = await prisma.account.findUnique({
        where: {
          provider_providerAccountId: {
            provider: account.provider,
            providerAccountId: account.providerAccountId,
          },
        },
      });

      if (existingAccount) {
        return true; // Account already exists, sign in is valid
      }

      // Link new account to an existing user if email matches
      if (profile?.email) {
        const existingUser = await prisma.user.findFirst({
          where: { email: profile.email },
        });

        if (existingUser) {
          await prisma.account.create({
            data: {
              userId: existingUser.id,
              provider: account.provider,
              providerAccountId: account.providerAccountId,
              type: account.type,
              access_token: account.access_token,
              expires_at: account.expires_at,
              token_type: account.token_type,
              scope: account.scope,
              id_token: account.id_token,
            },
          });
          return true;
        }
      }
      
      // This is a new user if no existing account or email match was found.
      // The Prisma adapter will handle creating the user and account.
      return true;
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
      }
      
      const dbUser = await prisma.user.findUnique({
        where: { id: token.id as string },
      });

      if (dbUser) {
        token.isAdmin = dbUser.isAdmin;
        token.loyaltyBalance = dbUser.loyaltyBalance;
        token.name = dbUser.name;
        token.picture = dbUser.image;
      }
      
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.isAdmin = token.isAdmin as boolean;
        session.user.loyaltyBalance = token.loyaltyBalance as number;
        session.user.name = token.name;
        session.user.image = token.picture;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
    error: '/login', 
  },
  secret: serverEnv.NEXTAUTH_SECRET,
  debug: serverEnv.NODE_ENV === 'development',
};

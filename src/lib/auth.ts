import { type NextAuthOptions } from 'next-auth';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import prisma from '@/lib/prisma';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { User } from '@prisma/client';

import { verifyEthereumSignature, verifySolanaSignature } from './auth-utils';

if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
  throw new Error('Missing Google OAuth environment variables');
}

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
        if (!credentials?.email || !credentials?.password) throw new Error('Please provide email and password');
        const user = await prisma.user.findUnique({ where: { email: credentials.email } });
        if (!user || !user.hashedPassword) throw new Error('No user found');
        const isPasswordCorrect = await bcrypt.compare(credentials.password, user.hashedPassword);
        if (!isPasswordCorrect) throw new Error('Incorrect password');
        return user;
      }
    }),
    // This is the new provider for Web3 wallets
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

          if (chain === 'ethereum') {
            isValid = await verifyEthereumSignature(message, signature, nonce);
          } else if (chain === 'solana') {
            isValid = verifySolanaSignature(message, signature, address);
          }

          if (isValid) {
            let user = await prisma.user.findUnique({ where: { walletAddress: address } });
            if (!user) {
              user = await prisma.user.create({
                data: {
                  walletAddress: address,
                  name: `${address.substring(0, 4)}...${address.substring(address.length - 4)}`,
                },
              });
            }
            return user;
          }
          return null;
        } catch (error) {
          console.error('Web3 Auth Error:', error);
          return null;
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  session: {
    strategy: 'jwt',
  },

  // THE FIX IS HERE: This is the definitive, production-ready cookie configuration.
  cookies: {
    sessionToken: {
      name: `__Secure-next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        // This is the crucial part. We conditionally set the domain.
        // For production, the cookie is valid for `.made-in-haiphong.com`,
        // which includes `www.made-in-haiphong.com`.
        // For development, we don't set a domain.
        domain: process.env.NODE_ENV === 'production' ? '.made-in-haiphong.com' : undefined,
        secure: true
      }
    }
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const dbUser = user as User;
        token.id = dbUser.id;
        token.isAdmin = dbUser.isAdmin;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.isAdmin = token.isAdmin as boolean;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
    error: '/login', 
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
};
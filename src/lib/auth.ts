// src/lib/auth.ts

import { type NextAuthOptions } from 'next-auth';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import prisma from '@/lib/prisma';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';

if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
  throw new Error('Missing Google OAuth environment variables');
}

export const authOptions: NextAuthOptions = {
  // The adapter is still used to create/link users in the DB from providers.
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
        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        });
        if (!user || !user.hashedPassword) {
          throw new Error('No user found');
        }
        const isPasswordCorrect = await bcrypt.compare(
          credentials.password,
          user.hashedPassword
        );
        if (!isPasswordCorrect) {
          throw new Error('Incorrect password');
        }
        // This authorize function is correct. It returns the user from the DB.
        return user;
      }
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],

  // THE FIX IS HERE: We are explicitly setting the session strategy to 'jwt'.
  // This unifies the session handling for all providers.
  session: {
    strategy: 'jwt',
  },

  // THE SECOND FIX: We define the `jwt` callback to add the user's ID
  // to the token, making it the single source of truth.
  callbacks: {
    // This callback is executed whenever a JWT is created or updated.
    async jwt({ token, user }) {
      // On the first sign-in (for any provider), the `user` object is passed in.
      if (user) {
        // We add the user's database ID to the token payload.
        token.id = user.id;
      }
      return token;
    },
    // This callback is executed whenever a session is checked.
    async session({ session, token }) {
      // We take the user ID from the token and add it to the session object.
      if (session.user) {
        session.user.id = token.id as string;
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
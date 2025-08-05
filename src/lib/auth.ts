// src/lib/auth.ts

import { type NextAuthOptions } from 'next-auth';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import prisma from '@/lib/prisma';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { User } from '@prisma/client'; // Import the User type from Prisma

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
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  // In src/lib/auth.ts, replace the entire `callbacks` block

callbacks: {
    // This is the simplified and correct JWT callback.
    // It ONLY runs with the `user` object on the initial sign-in,
    // which happens in a Node.js environment where the database is accessible.
    async jwt({ token, user }) {
      if (user) {
        // This is safe because `user` comes directly from the authorize function or OAuth profile
        const dbUser = user as User;
        token.id = dbUser.id;
        token.isAdmin = dbUser.isAdmin;
      }
      return token;
    },
    
    // The session callback remains the same. It runs on the serverless function
    // and correctly reads the data that was put into the token.
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
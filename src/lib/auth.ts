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
    async jwt({ token, user }) {
      // --- START OF AGGRESSIVE DIAGNOSTIC LOGGING ---
      console.log("--- JWT CALLBACK TRIGGERED ---");
      // Log the incoming user object to see if it even has the isAdmin field from the DB
      console.log("INCOMING 'user' OBJECT:", JSON.stringify(user, null, 2));
      console.log("INCOMING 'token' OBJECT:", JSON.stringify(token, null, 2));
      // --- END OF AGGRESSIVE DIAGNOSTIC LOGGING ---

      // This is the logic that's supposed to add isAdmin to the token
      if (user) {
        const dbUser = user as User;
        token.id = dbUser.id;
        token.isAdmin = dbUser.isAdmin;
      }

      // --- MORE LOGGING ---
      console.log("OUTGOING 'token' OBJECT:", JSON.stringify(token, null, 2));
      console.log("--------------------------");
      // --------------------
      
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
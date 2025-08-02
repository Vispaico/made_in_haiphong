// src/app/api/auth/[...nextauth]/route.ts

import NextAuth from 'next-auth';
import { authOptions } from '@/lib/auth'; // Import the configuration from its new, separate file

// This file's only job is to initialize NextAuth with the imported options
// and export the HTTP handlers for Next.js to use.
const handler = NextAuth(authOptions);

// This is the standard way to export the handlers for GET and POST requests.
export { handler as GET, handler as POST };
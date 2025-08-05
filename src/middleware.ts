// src/middleware.ts

import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

export async function middleware(req: NextRequest) {
  // Use getToken to read the JWT from the request. We pass the secret directly.
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  // --- LOGGING FOR DIAGNOSIS ---
  // This will show us exactly what the middleware sees.
  console.log('Middleware Token:', token);
  // -----------------------------

  const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/signup');
  const isDashboardPage = pathname.startsWith('/dashboard');
  const isAdminPage = pathname.startsWith('/admin');

  // If the user is not logged in (no token)
  if (!token) {
    // If they are trying to access a protected page, redirect to login
    if (isDashboardPage || isAdminPage) {
      return NextResponse.redirect(new URL('/login', req.url));
    }
    // Otherwise, allow them to continue (e.g., to the homepage)
    return NextResponse.next();
  }

  // If the user is logged in
  const isAdmin = token.isAdmin === true;

  // If they are trying to access an admin page but are not an admin, redirect
  if (isAdminPage && !isAdmin) {
    return NextResponse.redirect(new URL('/dashboard', req.url)); // Redirect to their own dashboard
  }

  // If they are logged in and try to visit the login/signup page, redirect to dashboard
  if (isAuthPage) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  // Otherwise, allow the request
  return NextResponse.next();
}

// This config ensures the middleware runs on all the specified paths.
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/admin/:path*',
    '/login',
    '/signup',
  ],
};
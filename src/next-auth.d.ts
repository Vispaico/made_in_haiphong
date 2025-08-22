// src/next-auth.d.ts

import 'next-auth';

// This file augments the default types from next-auth
declare module 'next-auth' {
  /**
   * Extends the built-in session.user type to include the 'id'.
   */
  interface Session {
    user: {
      id: string;
      isAdmin: boolean;
      loyaltyBalance: number;
    } & DefaultSession['user']; // Inherit the default properties (name, email, image)
  }

  /**
   * Extends the built-in user type.
   */
  interface User {
    id: string;
    isAdmin: boolean;
    loyaltyBalance: number;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    isAdmin: boolean;
    loyaltyBalance: number;
  }
}
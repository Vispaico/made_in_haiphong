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
    } & DefaultSession['user']; // Inherit the default properties (name, email, image)
  }

  /**
   * Extends the built-in user type.
   */
  interface User {
    id: string;
  }
}
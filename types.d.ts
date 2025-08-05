// types.d.ts

import 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      // THE FIX IS HERE: Add the new isAdmin property to the session user type
      isAdmin: boolean;
    } & DefaultSession['user'];
  }
}
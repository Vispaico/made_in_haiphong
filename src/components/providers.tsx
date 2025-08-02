// src/components/providers.tsx
'use client';

import { SessionProvider } from 'next-auth/react';

// This is a client-side wrapper that allows the SessionProvider
// to be used in our server-side root layout.
export default function Providers({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}
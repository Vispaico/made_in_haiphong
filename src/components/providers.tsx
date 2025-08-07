// src/components/providers.tsx
'use client';

import { SessionProvider } from 'next-auth/react';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    // THE FIX: We are adding two props to the SessionProvider.
    // `refetchInterval={0}` disables the default periodic polling.
    // `refetchOnWindowFocus={true}` is the key. It tells the provider to
    // check the session status every time the user clicks back to this tab.
    // This is a much more robust way to handle aggressive browser caching.
    <SessionProvider refetchInterval={0} refetchOnWindowFocus={true}>
      {children}
    </SessionProvider>
  );
}
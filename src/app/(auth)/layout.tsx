// src/app/(auth)/layout.tsx

import Link from 'next/link';
import { ShipWheel } from 'lucide-react';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="mb-8">
        <Link href="/" className="flex items-center gap-2 text-foreground">
          <ShipWheel className="h-7 w-7 text-primary" />
          <span className="font-heading text-xl font-bold">Made in Haiphong</span>
        </Link>
      </div>
      <div className="w-full max-w-md rounded-xl border border-secondary bg-secondary p-8 shadow-lg">
        {children}
      </div>
    </div>
  );
}
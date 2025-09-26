// src/components/admin/AdminHeader.tsx
'use client';

import Link from 'next/link';
import { Shield } from 'lucide-react';
import UserButton from '@/components/auth/UserButton';
import AdminMobileNav from './AdminMobileNav';

// This component is now simplified, as the main logic is in the layout.
// It primarily serves as a container for the right-aligned user button on desktop.
export default function AdminHeader() {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-secondary bg-background px-4 md:justify-end">
      {/* The mobile nav is now part of the layout and receives its links there */}
      <div className="md:hidden">
        {/* This space is intentionally left for the mobile nav trigger, which is in the layout */}
      </div>
      <div className="flex items-center gap-4">
        <UserButton />
      </div>
    </header>
  );
}

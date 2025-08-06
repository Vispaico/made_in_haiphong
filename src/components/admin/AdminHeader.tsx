// src/components/admin/AdminHeader.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, Shield } from 'lucide-react';
import AdminMobileNav from './AdminMobileNav';

export default function AdminHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-secondary bg-background/90 p-4 backdrop-blur-sm md:hidden">
        <div className="flex items-center justify-between">
          <Link href="/admin" className="flex items-center gap-2 text-red-500">
            <Shield className="h-6 w-6" />
            <span className="font-heading text-lg font-bold">Admin</span>
          </Link>
          <button onClick={() => setIsMenuOpen(true)}>
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </header>
      
      <AdminMobileNav isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </>
  );
}
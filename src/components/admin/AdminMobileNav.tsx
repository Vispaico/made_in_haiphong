// src/components/admin/AdminMobileNav.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, Shield } from 'lucide-react';

type NavLink = {
  href: string;
  label: string;
  icon: React.ElementType;
};

interface AdminMobileNavProps {
  navLinks: NavLink[];
}

export default function AdminMobileNav({ navLinks }: AdminMobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button onClick={() => setIsOpen(true)} className="p-2 text-foreground/80">
        <Menu className="h-6 w-6" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm">
          <div className="flex h-full flex-col p-6">
            <div className="mb-8 flex items-center justify-between">
              <Link href="/admin" onClick={() => setIsOpen(false)} className="flex items-center gap-2 text-red-500">
                <Shield className="h-6 w-6" />
                <span className="font-heading text-lg font-bold">Admin Panel</span>
              </Link>
              <button onClick={() => setIsOpen(false)} className="p-2">
                <X className="h-6 w-6" />
              </button>
            </div>
            <nav className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-4 rounded-lg p-3 text-lg font-medium text-foreground/80 hover:bg-secondary"
                >
                  <link.icon className="h-6 w-6" />
                  <span>{link.label}</span>
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}
    </div>
  );
}

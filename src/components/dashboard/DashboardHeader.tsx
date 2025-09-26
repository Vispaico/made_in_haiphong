// src/components/dashboard/DashboardHeader.tsx
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Session } from 'next-auth';
import UserButton from '@/components/auth/UserButton';

// This type is a simplified version of the nav link structure
type NavLink = {
  href: string;
  label: string;
  icon: string; // We'll just pass the name for simplicity
};

interface DashboardHeaderProps {
  session: Session | null;
  navLinks: NavLink[];
}

export default function DashboardHeader({ session, navLinks }: DashboardHeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-secondary bg-background px-4 md:hidden">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/MadeInHaiphong_logo.svg" alt="Logo" width={140} height={35} />
        </Link>
        <div className="flex items-center gap-2">
          <UserButton />
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="rounded-md p-2 text-foreground/80 hover:bg-secondary"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-background/95 backdrop-blur-sm md:hidden">
          <div className="flex h-full flex-col p-6">
            <div className="mb-8 flex items-center justify-between">
              <Link href="/" onClick={() => setIsMobileMenuOpen(false)}>
                <Image src="/MadeInHaiphong_logo.svg" alt="Logo" width={160} height={40} />
              </Link>
              <button onClick={() => setIsMobileMenuOpen(false)} className="p-2">
                <X className="h-6 w-6" />
              </button>
            </div>
            <nav className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="rounded-lg p-3 text-lg font-medium text-foreground/80 hover:bg-secondary"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}
    </>
  );
}

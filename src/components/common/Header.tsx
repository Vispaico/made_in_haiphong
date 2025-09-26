// src/components/common/Header.tsx
'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import UserButton from '@/components/auth/UserButton';
import { Search, MessageSquare } from 'lucide-react';

export default function Header() {
  const { status } = useSession();

  const navLinks = [
    { href: '/explore', label: 'Explore' },
    { href: '/marketplace', label: 'Marketplace' },
    { href: '/community', label: 'Community' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-secondary bg-background/90 backdrop-blur-sm">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        <Link href="/" className="flex flex-shrink-0 items-center">
          <Image
            src="/MadeInHaiphong_logo01.png"
            alt="Made in Haiphong Logo"
            width={140}
            height={40}
            className="h-10 w-auto"
          />
        </Link>

        <nav className="hidden items-center space-x-6 text-sm font-medium md:flex">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="text-foreground/80 transition-colors hover:text-foreground">
              {link.label}
            </Link>
          ))}
          <Link href="/host" className="text-foreground/80 transition-colors hover:text-foreground">
            For Business
          </Link>
        </nav>

        <div className="hidden items-center space-x-2 md:flex">
          {status === 'authenticated' ? (
            <>
              <Link 
                href="/dashboard/messages" 
                className="inline-flex h-10 w-10 items-center justify-center rounded-md text-foreground/70 transition-colors hover:bg-secondary hover:text-foreground" 
                aria-label="Messages"
              >
                <MessageSquare className="h-5 w-5" />
              </Link>
              <UserButton />
            </>
          ) : (
            <>
              <button className="inline-flex h-10 w-10 items-center justify-center rounded-md text-foreground/70 transition-colors hover:bg-secondary hover:text-foreground" aria-label="Search">
                <Search className="h-5 w-5" />
              </button>
              <Link href="/login" className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary/90">
                Log In
              </Link>
            </>
          )}
        </div>
        
        {/* The mobile menu button is removed, as mobile navigation is now handled by MobileBottomNav */}
      </div>
    </header>
  );
}
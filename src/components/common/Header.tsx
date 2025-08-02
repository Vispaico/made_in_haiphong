// src/components/common/Header.tsx
'use client';

import * as React from 'react';
import Link from 'next/link';
// We get the Session type for our prop definition
import { Session } from 'next-auth';
import { signOut } from 'next-auth/react';
import { ShipWheel, Search, X, Menu, UserCircle } from 'lucide-react';

// THE FIX: Define the props for the component, including the session
interface HeaderProps {
  session: Session | null;
}

// THE FIX: The component now receives the session directly as a prop.
export default function Header({ session }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  // We determine the user's status directly from the prop, not a hook.
  const isAuthenticated = !!session;

  const navLinks = [
    { href: '/explore', label: 'Explore' },
    { href: '/marketplace', label: 'Marketplace' },
    { href: '/stay', label: 'Stay' },
    { href: '/community', label: 'Community Feed' },
  ];

  const handleLogout = () => {
    signOut({ callbackUrl: '/' });
    setIsMenuOpen(false);
  }

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-secondary bg-background/90 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          
          <Link href="/" className="flex flex-shrink-0 items-center space-x-2" onClick={() => setIsMenuOpen(false)}>
            <ShipWheel className="h-6 w-6 text-primary" />
            <span className="font-heading font-bold text-foreground">Made in Haiphong</span>
          </Link>

          <nav className="hidden items-center space-x-6 text-sm font-medium md:flex">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="text-foreground/80 transition-colors hover:text-foreground">
                {link.label}
              </Link>
            ))}
          </nav>

          {/* --- DYNAMIC DESKTOP ACTIONS --- */}
          <div className="hidden items-center space-x-2 md:flex">
            {isAuthenticated ? (
              <>
                <Link href="/dashboard" className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-foreground/80 transition-colors hover:bg-secondary">
                  <UserCircle className="h-5 w-5" />
                  <span>{session.user?.name}</span>
                </Link>
                <button onClick={handleLogout} className="inline-flex h-10 items-center justify-center rounded-md bg-secondary px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary/80">
                  Log Out
                </button>
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

          <div className="flex items-center md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="inline-flex h-10 w-10 items-center justify-center rounded-md text-foreground/80" aria-label="Toggle menu">
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* --- DYNAMIC MOBILE MENU --- */}
      {isMenuOpen && (
        <div className="absolute top-16 left-0 z-40 w-full border-b border-secondary bg-background shadow-md md:hidden">
          <nav className="flex flex-col space-y-1 p-4">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="rounded-md px-3 py-2 text-base font-medium text-foreground/80 hover:bg-secondary hover:text-foreground" onClick={() => setIsMenuOpen(false)}>
                {link.label}
              </Link>
            ))}
            <div className="!mt-4 flex flex-col pt-2">
              {isAuthenticated ? (
                <>
                  <Link href="/dashboard" onClick={() => setIsMenuOpen(false)} className="rounded-md px-3 py-2 text-base font-medium text-foreground/80 hover:bg-secondary hover:text-foreground">
                    My Dashboard
                  </Link>
                  <button onClick={handleLogout} className="mt-1 rounded-md bg-accent px-3 py-2 text-left text-base font-medium text-white">
                    Log Out
                  </button>
                </>
              ) : (
                <Link href="/login" onClick={() => setIsMenuOpen(false)} className="inline-flex h-10 w-full items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-white">
                  Log In
                </Link>
              )}
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
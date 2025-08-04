// src/components/dashboard/DashboardHeader.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, ShipWheel } from 'lucide-react';
import MobileNav from './MobileNav';

export default function DashboardHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    // THE FIX: We use a React Fragment <> to return two sibling elements.
    <>
      {/* The header is now separate from the mobile nav */}
      <header className="sticky top-0 z-40 border-b border-secondary bg-background/90 p-4 backdrop-blur-sm md:hidden">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <ShipWheel className="h-6 w-6 text-primary" />
            <span className="font-heading text-lg font-bold">Haiphong</span>
          </Link>
          <button onClick={() => setIsMenuOpen(true)}>
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </header>
      
      {/* THE FIX: The MobileNav is now a sibling, not a child of the header. */}
      {/* It will no longer inherit any transparency. */}
      <MobileNav isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </>
  );
}
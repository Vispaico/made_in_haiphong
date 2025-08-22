// src/components/dashboard/DashboardHeader.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, ShipWheel } from 'lucide-react';
import MobileNavClient from './MobileNavClient';

// Define a type for the link objects
interface NavLink {
  href: string;
  label: string;
  icon: React.ElementType;
}

interface DashboardHeaderProps {
  navLinks: NavLink[];
}

export default function DashboardHeader({ navLinks }: DashboardHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
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
      
      <MobileNavClient 
        isOpen={isMenuOpen} 
        onClose={() => setIsMenuOpen(false)}
        navLinks={navLinks}
      />
    </>
  );
}

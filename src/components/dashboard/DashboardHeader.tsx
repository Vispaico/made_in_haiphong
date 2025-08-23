// src/components/dashboard/DashboardHeader.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, ShipWheel, X, PlusCircle, LayoutDashboard, User, MessageSquare, ShoppingBag, Star, Heart, Settings, Shield } from 'lucide-react';
import LogoutButton from './LogoutButton';

const iconMap = {
  LayoutDashboard,
  User,
  MessageSquare,
  ShoppingBag,
  Star,
  Heart,
  Settings,
  Shield
};

// Define a type for the link objects
interface NavLink {
  href: string;
  label: string;
  icon: string;
}

interface DashboardHeaderProps {
  navLinks: NavLink[];
}

export default function DashboardHeader({ navLinks }: DashboardHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const MobileNav = () => (
    <div className="fixed inset-0 z-50 bg-background md:hidden">
      <div className="flex h-full flex-col p-4">
        <div className="flex items-center justify-between">
          <span className="font-heading text-lg font-bold">Menu</span>
          <button onClick={() => setIsMenuOpen(false)}>
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <div className="my-6">
          <Link 
            href="/dashboard/listings/new"
            onClick={() => setIsMenuOpen(false)}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-accent px-4 py-2.5 font-bold text-white shadow-md"
          >
            <PlusCircle className="h-5 w-5" />
            <span>Create Listing</span>
          </Link>
        </div>

        <nav className="flex flex-grow flex-col space-y-2">
          {navLinks.map((link) => {
            const Icon = iconMap[link.icon as keyof typeof iconMap];
            return (
              <Link 
                key={link.href} 
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-3 rounded-md px-3 py-3 text-lg font-medium text-foreground/80 transition-colors hover:bg-secondary"
              >
                <Icon className="h-6 w-6" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto">
          <LogoutButton />
        </div>
      </div>
    </div>
  );

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
      
      {isMenuOpen && <MobileNav />}
    </>
  );
}
// src/components/dashboard/MobileNav.tsx
'use client';

import Link from 'next/link';
import { 
  LayoutDashboard, User, MessageSquare, ShoppingBag, 
  Heart, Star, Settings, X, PlusCircle
} from 'lucide-react';
import LogoutButton from './LogoutButton';

const dashboardNavLinks = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/profile', label: 'My Profile', icon: User },
  { href: '/dashboard/messages', label: 'Messages', icon: MessageSquare },
  { href: '/dashboard/listings', label: 'My Listings', icon: ShoppingBag },
  { href: '/dashboard/bookings', label: 'My Bookings', icon: Star },
  { href: '/dashboard/saved', label: 'Saved Items', icon: Heart },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
];

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileNav({ isOpen, onClose }: MobileNavProps) {
  if (!isOpen) {
    return null;
  }

  return (
    // THE FIX: Reverted to the themed 'bg-background'. It will now be fully opaque
    // because its parent is no longer transparent.
    <div className="fixed inset-0 z-50 bg-background md:hidden">
      <div className="flex h-full flex-col p-4">
        <div className="flex items-center justify-between">
          <span className="font-heading text-lg font-bold">Menu</span>
          <button onClick={onClose}>
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <div className="my-6">
          <Link 
            href="/dashboard/listings/new"
            onClick={onClose}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-accent px-4 py-2.5 font-bold text-white shadow-md"
          >
            <PlusCircle className="h-5 w-5" />
            <span>Create Listing</span>
          </Link>
        </div>

        <nav className="flex flex-grow flex-col space-y-2">
          {dashboardNavLinks.map((link) => (
            <Link 
              key={link.href} 
              href={link.href}
              onClick={onClose}
              className="flex items-center gap-3 rounded-md px-3 py-3 text-lg font-medium text-foreground/80 transition-colors hover:bg-secondary"
            >
              <link.icon className="h-6 w-6" />
              <span>{link.label}</span>
            </Link>
          ))}
        </nav>

        <div className="mt-auto">
          <LogoutButton />
        </div>
      </div>
    </div>
  );
}
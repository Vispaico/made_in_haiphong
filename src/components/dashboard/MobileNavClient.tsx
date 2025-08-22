// src/components/dashboard/MobileNavClient.tsx
'use client';

import Link from 'next/link';
import { X, PlusCircle } from 'lucide-react';
import LogoutButton from './LogoutButton';

// Define a type for the link objects
interface NavLink {
  href: string;
  label: string;
  icon: React.ElementType;
}

interface MobileNavClientProps {
  isOpen: boolean;
  onClose: () => void;
  navLinks: NavLink[];
}

export default function MobileNavClient({ isOpen, onClose, navLinks }: MobileNavClientProps) {
  if (!isOpen) {
    return null;
  }

  return (
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
          {navLinks.map((link) => (
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

// src/components/admin/AdminMobileNav.tsx
'use client';

import Link from 'next/link';
import { LayoutGrid, Users, Settings, Compass, X, LayoutList, Newspaper } from 'lucide-react';
import LogoutButton from '../dashboard/LogoutButton'; // We can reuse the same logout button

const adminNavLinks = [
  { href: '/admin', label: 'Manage Listings', icon: LayoutGrid },
  { href: '/admin/users', label: 'Manage Users', icon: Users },
  { href: '/admin/explore', label: 'Manage Explore', icon: Compass },
  { href: '/admin/categories', label: 'Manage Categories', icon: LayoutList },
  { href: '/admin/articles', label: 'Manage Articles', icon: Newspaper },
  { href: '/admin/settings', label: 'Admin Settings', icon: Settings },
];

interface AdminMobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminMobileNav({ isOpen, onClose }: AdminMobileNavProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 bg-background md:hidden">
      <div className="flex h-full flex-col p-4">
        <div className="flex items-center justify-between">
          <span className="font-heading text-lg font-bold text-red-500">Admin Menu</span>
          <button onClick={onClose}>
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <nav className="mt-8 flex flex-grow flex-col space-y-2">
          {adminNavLinks.map((link) => (
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
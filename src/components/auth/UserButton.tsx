// src/components/auth/UserButton.tsx
'use client';

import { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';
import { LayoutDashboard, UserCircle, LogOut, Gem } from 'lucide-react';

export default function UserButton() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  if (!session) {
    return null;
  }

  const { user } = session;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-full bg-secondary p-1 pr-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary/80 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background"
      >
        <Image
          src={user?.image || '/images/avatar-default.png'}
          alt={user?.name || 'User Avatar'}
          width={32}
          height={32}
          className="rounded-full"
        />
        <span className="hidden sm:inline">{user?.name}</span>
      </button>

      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-56 origin-top-right rounded-md bg-background shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="menu-button"
        >
          <div className="py-1" role="none">
            <div className="border-b border-secondary px-4 py-3">
              <p className="text-sm font-semibold text-foreground">{user?.name}</p>
              <p className="truncate text-sm text-foreground/70">{user?.email}</p>
            </div>
            <div className="py-1">
              <Link
                href="/dashboard"
                className="flex items-center px-4 py-2 text-sm text-foreground/80 hover:bg-secondary hover:text-foreground"
                role="menuitem"
                onClick={() => setIsOpen(false)}
              >
                <LayoutDashboard className="mr-3 h-5 w-5" />
                <span>Dashboard</span>
              </Link>
              <Link
                href="/dashboard/profile"
                className="flex items-center px-4 py-2 text-sm text-foreground/80 hover:bg-secondary hover:text-foreground"
                role="menuitem"
                onClick={() => setIsOpen(false)}
              >
                <UserCircle className="mr-3 h-5 w-5" />
                <span>Profile</span>
              </Link>
            </div>
            <div className="border-t border-secondary py-1">
              <div className="flex items-center justify-between px-4 py-2 text-sm">
                <span className="flex items-center text-foreground/80">
                  <Gem className="mr-3 h-5 w-5 text-primary" />
                  Loyalty Points
                </span>
                <span className="font-bold text-primary">{user?.loyaltyBalance ?? 0}</span>
              </div>
            </div>
            <div className="border-t border-secondary py-1">
              <button
                onClick={() => {
                  setIsOpen(false);
                  signOut({ callbackUrl: '/' });
                }}
                className="flex w-full items-center px-4 py-2 text-left text-sm text-red-500 hover:bg-secondary"
                role="menuitem"
              >
                <LogOut className="mr-3 h-5 w-5" />
                <span>Log Out</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

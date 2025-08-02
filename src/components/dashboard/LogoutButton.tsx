// src/components/dashboard/LogoutButton.tsx
'use client';

import { signOut } from 'next-auth/react';
import { LogOut } from 'lucide-react';

export default function LogoutButton() {
  const handleLogout = () => {
    signOut({ callbackUrl: '/' }); // Log out and redirect to homepage
  };

  return (
    <button 
      onClick={handleLogout} 
      className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-foreground/80 transition-colors hover:bg-secondary hover:text-foreground"
    >
      <LogOut className="h-5 w-5" />
      <span>Log Out</span>
    </button>
  );
}
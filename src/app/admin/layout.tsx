'use client';
// src/app/admin/layout.tsx
import Link from 'next/link';
import Image from 'next/image';
import { Shield, LayoutGrid, Users, Settings, Compass, LayoutList, Newspaper, Bell } from 'lucide-react';
import AdminMobileNav from '@/components/admin/AdminMobileNav';
import UserButton from '@/components/auth/UserButton';

const adminNavLinks = [
  { href: '/admin', label: 'Listings', icon: LayoutGrid },
  { href: '/admin/users', label: 'Users', icon: Users },
  { href: '/admin/explore', label: 'Explore', icon: Compass },
  { href: '/admin/categories', label: 'Categories', icon: LayoutList },
  { href: '/admin/articles', label: 'Articles', icon: Newspaper },
  { href: '/admin/announcements', label: 'Announcements', icon: Bell },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-secondary">
      {/* Desktop Sidebar */}
      <aside className="hidden w-72 flex-col border-r border-secondary bg-background p-6 md:flex">
        <div className="mb-8">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/MadeInHaiphong_logo.svg" alt="Logo" width={160} height={40} />
          </Link>
        </div>
        <div className="mb-8 flex items-center gap-2 rounded-lg bg-red-500/10 p-3">
            <Shield className="h-6 w-6 text-red-500" />
            <span className="font-heading text-lg font-bold text-red-500">Admin Panel</span>
        </div>

        <nav className="flex flex-grow flex-col space-y-2">
          {adminNavLinks.map((link) => (
            <Link 
              key={link.href} 
              href={link.href}
              className="flex items-center gap-4 rounded-md px-4 py-2 text-foreground/70 transition-colors hover:bg-secondary hover:text-foreground"
            >
              <link.icon className="h-6 w-6" />
              <span className="font-medium">{link.label}</span>
            </Link>
          ))}
        </nav>
      </aside>
      
      {/* Main Content Area */}
      <div className="flex flex-1 flex-col">
        {/* Mobile & Top Header */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-secondary bg-background px-4 md:justify-end">
          <AdminMobileNav navLinks={adminNavLinks} />
          <div className="flex items-center gap-4">
            <UserButton />
          </div>
        </header>
        
        <main className="flex-grow p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

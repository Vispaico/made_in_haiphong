// src/app/dashboard/layout.tsx

import Link from 'next/link';
import { 
  LayoutDashboard, User, MessageSquare, ShoppingBag, 
  Heart, Star, Settings, ShipWheel, PlusCircle, Zap
} from 'lucide-react';
import LogoutButton from '@/components/dashboard/LogoutButton';
import DashboardHeader from '@/components/dashboard/DashboardHeader';

const dashboardNavLinks = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/profile', label: 'My Profile', icon: User },
  { href: '/dashboard/messages', label: 'Messages', icon: MessageSquare },
  { href: '/dashboard/listings', label: 'My Listings', icon: ShoppingBag },
  { href: '/dashboard/bookings', label: 'My Bookings', icon: Star },
  { href: '/dashboard/saved', label: 'Saved Items', icon: Heart },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-secondary">
      <aside className="hidden w-64 flex-col border-r border-secondary bg-background p-4 md:flex">
        <div className="mb-8">
          <Link href="/" className="flex items-center gap-2 text-foreground">
            <ShipWheel className="h-6 w-6 text-primary" />
            <span className="font-heading text-lg font-bold">Made in Haiphong</span>
          </Link>
        </div>
        
        <div className="mb-6">
          <Link 
            href="/dashboard/listings/new"
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-accent px-4 py-2.5 font-bold text-white shadow-md transition-transform hover:scale-105"
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
              className="flex items-center gap-3 rounded-md px-3 py-2 text-foreground/80 transition-colors hover:bg-secondary hover:text-foreground"
            >
              <link.icon className="h-5 w-5" />
              <span>{link.label}</span>
            </Link>
          ))}
        </nav>

        {/* THE FIX: Added a new, distinct "Upgrade" link at the bottom */}
        <div className="mt-auto flex flex-col space-y-2 border-t border-secondary pt-4">
          <Link 
            href="/dashboard/upgrade"
            className="flex items-center gap-3 rounded-md bg-yellow-500/10 px-3 py-2 text-yellow-600 transition-colors hover:bg-yellow-500/20"
          >
            <Zap className="h-5 w-5" />
            <span className="font-semibold">Upgrade to Premium</span>
          </Link>
          <LogoutButton />
        </div>
      </aside>

      <div className="flex flex-1 flex-col">
        <DashboardHeader />
        <main className="flex-grow p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
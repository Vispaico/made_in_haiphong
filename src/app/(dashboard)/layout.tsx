// src/app/(dashboard)/layout.tsx

import Link from 'next/link';
import { 
  LayoutDashboard, User, MessageSquare, ShoppingBag, 
  Heart, Star, Settings, LogOut, ShipWheel
} from 'lucide-react';

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
      {/* Sidebar Navigation */}
      <aside className="hidden w-64 flex-col border-r border-secondary bg-background p-4 md:flex">
        <div className="mb-8">
          <Link href="/" className="flex items-center gap-2 text-foreground">
            <ShipWheel className="h-6 w-6 text-primary" />
            <span className="font-heading text-lg font-bold">Haiphong</span>
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
        <div>
          <button className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-foreground/80 transition-colors hover:bg-secondary hover:text-foreground">
            <LogOut className="h-5 w-5" />
            <span>Log Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-grow p-4 md:p-8">
        {/* We would have a mobile header here for non-desktop screens */}
        {children}
      </div>
    </div>
  );
}
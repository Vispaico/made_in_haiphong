// src/app/dashboard/layout.tsx
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import Link from 'next/link';
import Image from 'next/image';
import { 
  LayoutDashboard, User, MessageSquare, ShoppingBag, 
  Heart, Star, Settings, Shield, PlusCircle, Zap, Gem
} from 'lucide-react';
import LogoutButton from '@/components/dashboard/LogoutButton';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import UserButton from '@/components/auth/UserButton';

const iconMap = {
  LayoutDashboard,
  User,
  MessageSquare,
  ShoppingBag,
  Star,
  Heart,
  Settings,
  Shield,
  Gem,
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  const isAdmin = session?.user?.isAdmin || false;

  const dashboardNavLinks = [
    { href: '/dashboard', label: 'Dashboard', icon: 'LayoutDashboard' },
    { href: '/dashboard/profile', label: 'My Profile', icon: 'User' },
    { href: '/dashboard/messages', label: 'Messages', icon: 'MessageSquare' },
    { href: '/dashboard/listings', label: 'My Listings', icon: 'ShoppingBag' },
    { href: '/dashboard/bookings', label: 'My Bookings', icon: 'Star' },
    { href: '/dashboard/saved', label: 'Saved Items', icon: 'Heart' },
    { href: '/dashboard/loyalty', label: 'Loyalty Points', icon: 'Gem' },
  ];

  if (isAdmin) {
    dashboardNavLinks.push({ href: '/admin', label: 'Admin Panel', icon: 'Shield' });
  }

  return (
    <div className="flex min-h-screen bg-secondary">
      {/* Desktop Sidebar */}
      <aside className="hidden w-72 flex-col border-r border-secondary bg-background p-6 md:flex">
        <div className="mb-8">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/MadeInHaiphong_logo.svg" alt="Logo" width={160} height={40} />
          </Link>
        </div>
        
        <div className="mb-8">
          <Link 
            href="/dashboard/listings/new"
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 font-bold text-white shadow-lg transition-transform hover:bg-primary/90 hover:scale-105"
          >
            <PlusCircle className="h-5 w-5" />
            <span>Create New Listing</span>
          </Link>
        </div>

        <nav className="flex flex-grow flex-col space-y-2">
          {dashboardNavLinks.map((link) => {
            const Icon = iconMap[link.icon as keyof typeof iconMap];
            return (
              <Link 
                key={link.href} 
                href={link.href}
                className="flex items-center gap-4 rounded-md px-4 py-2 text-foreground/70 transition-colors hover:bg-secondary hover:text-foreground"
              >
                <Icon className="h-6 w-6" />
                <span className="font-medium">{link.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto flex flex-col space-y-4 border-t border-secondary pt-6">
          <Link 
            href="/dashboard/settings"
            className="flex items-center gap-4 rounded-md px-4 py-2 text-foreground/70 transition-colors hover:bg-secondary hover:text-foreground"
          >
            <Settings className="h-6 w-6" />
            <span className="font-medium">Settings</span>
          </Link>
          <LogoutButton />
        </div>
      </aside>

      {/* Mobile Header & Main Content */}
      <div className="flex flex-1 flex-col">
        <DashboardHeader session={session} navLinks={dashboardNavLinks} />
        <main className="flex-grow p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

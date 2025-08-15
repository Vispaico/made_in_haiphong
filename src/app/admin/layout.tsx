import Link from 'next/link';
import { Shield, LayoutGrid, Users, Settings, Compass, LayoutList, Newspaper } from 'lucide-react';
import AdminHeader from '@/components/admin/AdminHeader';

const adminNavLinks = [
  { href: '/admin', label: 'Manage Listings', icon: LayoutGrid },
  { href: '/admin/users', label: 'Manage Users', icon: Users },
  { href: '/admin/explore', label: 'Manage Explore', icon: Compass },
  { href: '/admin/categories', label: 'Manage Categories', icon: LayoutList },
  { href: '/admin/articles', label: 'Manage Articles', icon: Newspaper },
  { href: '/admin/settings', label: 'Admin Settings', icon: Settings },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-secondary">
      {/* --- Desktop Sidebar --- */}
      <aside className="hidden w-64 flex-col border-r border-secondary bg-background p-4 md:flex">
        <div className="mb-8">
          <Link href="/admin" className="flex items-center gap-2 text-red-500">
            <Shield className="h-6 w-6" />
            <span className="font-heading text-lg font-bold">Admin Panel</span>
          </Link>
        </div>
        <nav className="flex flex-grow flex-col space-y-2">
          {adminNavLinks.map((link) => (
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
      </aside>
      
      {/* --- Main Content Area --- */}
      <div className="flex flex-1 flex-col">
        <AdminHeader />
        
        <main className="flex-grow p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
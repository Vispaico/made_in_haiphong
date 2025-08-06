// src/app/admin/settings/page.tsx

import { LayoutList, Bell } from 'lucide-react';
import Link from 'next/link';

export default function AdminSettingsPage() {
  return (
    <div>
      <h1 className="font-heading text-3xl font-bold text-foreground">Admin Settings</h1>
      <p className="mt-2 text-lg text-foreground/70">Manage global settings for the application.</p>

      <div className="mt-8 max-w-2xl space-y-8">
        {/* Site Announcements Section */}
        <div className="rounded-lg border border-secondary bg-background p-6">
          <div className="flex items-center gap-3">
            <Bell className="h-5 w-5 text-foreground/80" />
            <h2 className="font-heading text-xl font-semibold">Site Announcements</h2>
          </div>
          <p className="mt-2 text-sm text-foreground/70">
            Create and manage site-wide announcements or banners.
          </p>
          {/* THE FIX: This is now a real link */}
          <Link href="/admin/announcements" className="mt-4 inline-block rounded-md bg-secondary px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-secondary/80">
            Manage Announcements
          </Link>
        </div>
        
        {/* Content Categories Section */}
        <div className="rounded-lg border border-secondary bg-background p-6">
          <div className="flex items-center gap-3">
            <LayoutList className="h-5 w-5 text-foreground/80" />
            <h2 className="font-heading text-xl font-semibold">Content Categories</h2>
          </div>
          <p className="mt-2 text-sm text-foreground/70">
            Manage the categories available in the Marketplace and Explore sections.
          </p>
          <Link href="/admin/categories" className="mt-4 inline-block rounded-md bg-secondary px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-secondary/80">
            Manage Categories
          </Link>
        </div>
      </div>
    </div>
  );
}
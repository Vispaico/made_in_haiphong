// src/app/(dashboard)/dashboard/page.tsx

import { Bell, MessageSquare, Star } from 'lucide-react';

export default function DashboardPage() {
  // In a real app, this data would be fetched for the logged-in user.
  const user = { name: "Niels" };

  return (
    <div>
      <h1 className="font-heading text-3xl font-bold text-foreground">Welcome back, {user.name}!</h1>
      <p className="mt-2 text-lg text-foreground/70">Here&apos;s a summary of your activity.</p>
      
      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* Summary Card: New Messages */}
        <div className="rounded-xl border border-secondary bg-background p-6">
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-primary/10 p-3 text-primary">
              <MessageSquare className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-foreground/70">New Messages</p>
              <p className="text-2xl font-bold text-foreground">3</p>
            </div>
          </div>
        </div>

        {/* Summary Card: New Bookings */}
        <div className="rounded-xl border border-secondary bg-background p-6">
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-accent/10 p-3 text-accent">
              <Star className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-foreground/70">New Booking Confirmations</p>
              <p className="text-2xl font-bold text-foreground">1</p>
            </div>
          </div>
        </div>

        {/* Summary Card: Notifications */}
        <div className="rounded-xl border border-secondary bg-background p-6">
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-yellow-500/10 p-3 text-yellow-500">
              <Bell className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-foreground/70">General Notifications</p>
              <p className="text-2xl font-bold text-foreground">5</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-10">
        <h2 className="font-heading text-2xl font-bold text-foreground">Recent Activity</h2>
        <div className="mt-4 rounded-xl border border-secondary bg-background p-6">
           {/* Activity items would be listed here */}
           <p className="text-foreground/60">Your recent activity feed is empty.</p>
        </div>
      </div>
    </div>
  );
}
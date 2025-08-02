// src/app/dashboard/page.tsx

import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Bell, MessageSquare, Star } from 'lucide-react';

export default async function DashboardPage() {
  // Fetch the current user's session on the server
  const session = await getServerSession(authOptions);

  // If there is no session, the user should not be here. Redirect them.
  if (!session?.user) {
    redirect('/login');
  }

  // Use the user's actual name from the session object
  const user = session.user;

  return (
    <div>
      {/* The greeting is now dynamic and uses the user's real name */}
      <h1 className="font-heading text-3xl font-bold text-foreground">Welcome back, {user.name}!</h1>
      <p className="mt-2 text-lg text-foreground/70">Here&apos;s a summary of your activity.</p>
      
      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* These cards are still placeholders, but the greeting is now dynamic */}
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
           <p className="text-foreground/60">Your recent activity feed is empty.</p>
        </div>
      </div>
    </div>
  );
}
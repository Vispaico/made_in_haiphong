// src/app/dashboard/page.tsx

import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Bell, MessageSquare, Star } from 'lucide-react';

export default async function DashboardPage() {
  // Fetch the current user's session on the server
  const session = await getServerSession(authOptions);

  // --- THIS IS THE CRITICAL LOG WE NEED TO ADD ---
  console.log("--- DASHBOARD PAGE LOAD --- Session retrieved on server:", session);
  // ---------------------------------------------

  // If there is no session, the user should not be here. Redirect them.
  if (!session?.user) {
    redirect('/login');
  }

  // The rest of your code remains the same.
  const user = session.user;

  return (
    <div>
      <h1 className="font-heading text-3xl font-bold text-foreground">Welcome back, {user.name}!</h1>
      <p className="mt-2 text-lg text-foreground/70">Here is a summary of your activity.</p>
      
      {/* ... The rest of your JSX remains untouched ... */}
      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
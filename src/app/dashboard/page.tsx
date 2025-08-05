// src/app/dashboard/page.tsx

import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
// THE FIX: The unused 'Bell' icon has been removed and 'Heart' has been added.
import { MessageSquare, Star, Heart } from 'lucide-react';
import Link from 'next/link';

// Helper component for the summary cards to reduce repetition
function SummaryCard({ icon, title, value, href }: { icon: React.ReactNode; title: string; value: number; href: string }) {
  return (
    <Link href={href} className="block rounded-xl border border-secondary bg-background p-6 transition-transform hover:-translate-y-1">
      <div className="flex items-center gap-4">
        {icon}
        <div>
          <p className="text-sm text-foreground/70">{title}</p>
          <p className="text-2xl font-bold text-foreground">{value}</p>
        </div>
      </div>
    </Link>
  );
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect('/login');
  }

  const userId = session.user.id;

  const conversationsCount = await prisma.conversation.count({
    where: {
      participants: { some: { id: userId } },
    },
  });

  const pendingBookingsCount = await prisma.booking.count({
    where: {
      listing: { authorId: userId },
      status: 'PENDING',
    },
  });

  const savedListingsCount = await prisma.savedListing.count({ where: { userId } });
  const savedPostsCount = await prisma.savedPost.count({ where: { userId } });
  const totalSavedCount = savedListingsCount + savedPostsCount;
  
  const user = session.user;

  return (
    <div>
      <h1 className="font-heading text-3xl font-bold text-foreground">Welcome back, {user.name}!</h1>
      <p className="mt-2 text-lg text-foreground/70">Here’s a summary of your activity.</p>
      
      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <SummaryCard 
          href="/dashboard/messages"
          title="Total Conversations" 
          value={conversationsCount}
          icon={<div className="rounded-full bg-primary/10 p-3 text-primary"><MessageSquare className="h-6 w-6" /></div>}
        />
        <SummaryCard 
          href="/dashboard/bookings"
          title="Pending Booking Requests" 
          value={pendingBookingsCount}
          icon={<div className="rounded-full bg-accent/10 p-3 text-accent"><Star className="h-6 w-6" /></div>}
        />
        <SummaryCard 
          href="/dashboard/saved"
          title="Total Saved Items" 
          value={totalSavedCount}
          icon={<div className="rounded-full bg-yellow-500/10 p-3 text-yellow-500"><Heart className="h-6 w-6" /></div>}
        />
      </div>

      <div className="mt-10">
        <h2 className="font-heading text-2xl font-bold text-foreground">Recent Activity</h2>
        <div className="mt-4 rounded-xl border border-secondary bg-background p-6">
           <p className="text-foreground/60">Your recent activity feed is empty. (Coming Soon)</p>
        </div>
      </div>
    </div>
  );
}
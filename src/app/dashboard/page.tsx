// src/app/dashboard/page.tsx
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import { MessageSquare, Star, Heart, ArrowRight, UserPlus, MessageCircle } from 'lucide-react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { Activity } from '@prisma/client'; // Import the type for safety

function SummaryCard({ icon, title, value, href, cta }: { icon: React.ReactNode; title: string; value: number; href: string; cta: string }) {
  return (
    <Link href={href} className="group block rounded-xl border border-secondary bg-background p-6 shadow-sm transition-all duration-300 hover:border-primary/50 hover:shadow-md hover:-translate-y-1">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          {icon}
          <div>
            <p className="text-sm text-foreground/70">{title}</p>
            <p className="text-3xl font-bold text-foreground">{value}</p>
          </div>
        </div>
        <ArrowRight className="h-5 w-5 text-foreground/30 transition-transform group-hover:translate-x-1" />
      </div>
      <p className="mt-4 text-xs text-primary/80 font-semibold group-hover:text-primary">{cta}</p>
    </Link>
  );
}

// A helper type for our activity with the initiator's name
type ActivityWithInitiator = Activity & {
  initiator: { name: string | null } | null;
};

async function ActivityFeed() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return null;

  const activities: ActivityWithInitiator[] = await prisma.activity.findMany({
    where: { userId: session.user.id },
    take: 5,
    orderBy: { createdAt: 'desc' },
    include: {
      initiator: { select: { name: true } },
    },
  });

  if (activities.length === 0) {
    return <p className="text-foreground/60">Your recent activity feed is empty.</p>;
  }
  
  const renderActivity = (activity: ActivityWithInitiator) => {
    const initiatorName = activity.initiator?.name || 'Someone';
    switch (activity.type) {
      case 'NEW_BOOKING_REQUEST':
        return <><UserPlus className="h-4 w-4 text-accent" /> <p><span className="font-semibold">{initiatorName}</span> requested to book one of your listings.</p></>;
      case 'BOOKING_CONFIRMED':
        return <><Star className="h-4 w-4 text-green-500" /> <p><span className="font-semibold">{initiatorName}</span> confirmed your booking request.</p></>;
      case 'BOOKING_CANCELLED':
        return <><Star className="h-4 w-4 text-red-500" /> <p><span className="font-semibold">{initiatorName}</span> cancelled a booking request.</p></>;
      case 'NEW_COMMENT':
        return <><MessageCircle className="h-4 w-4 text-primary" /> <p><span className="font-semibold">{initiatorName}</span> commented on your post.</p></>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      {activities.map(activity => (
        <Link key={activity.id} href={activity.link || '#'} className="flex items-center gap-3 rounded-lg p-2 hover:bg-secondary">
          <div className="flex items-center gap-2 text-sm">
            {renderActivity(activity)}
          </div>
          <span className="ml-auto text-xs text-foreground/60 flex-shrink-0">{formatDistanceToNow(activity.createdAt, { addSuffix: true })}</span>
        </Link>
      ))}
    </div>
  );
}


export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect('/login');

  const userId = session.user.id;

  const conversationsCount = await prisma.conversation.count({ where: { participants: { some: { id: userId } } } });
  const pendingBookingsCount = await prisma.booking.count({ where: { listing: { authorId: userId }, status: 'PENDING' } });
  const savedListingsCount = await prisma.savedListing.count({ where: { userId } });
  const savedPostsCount = await prisma.savedPost.count({ where: { userId } });
  const totalSavedCount = savedListingsCount + savedPostsCount;
  
  const user = session.user;

  return (
    <div>
      <h1 className="font-heading text-3xl font-bold text-foreground">Welcome back, {user.name}!</h1>
      <p className="mt-2 text-lg text-foreground/70">Here’s a summary of your activity.</p>
      
      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <SummaryCard href="/dashboard/messages" title="Total Conversations" value={conversationsCount} cta="View all messages" icon={<div className="rounded-full bg-primary/10 p-3 text-primary"><MessageSquare className="h-6 w-6" /></div>}/>
        <SummaryCard href="/dashboard/bookings" title="Pending Booking Requests" value={pendingBookingsCount} cta="Manage your bookings" icon={<div className="rounded-full bg-accent/10 p-3 text-accent"><Star className="h-6 w-6" /></div>}/>
        <SummaryCard href="/dashboard/saved" title="Total Saved Items" value={totalSavedCount} cta="View your saved items" icon={<div className="rounded-full bg-yellow-500/10 p-3 text-yellow-500"><Heart className="h-6 w-6" /></div>}/>
      </div>

      <div className="mt-10">
        <h2 className="font-heading text-2xl font-bold text-foreground">Recent Activity</h2>
        <div className="mt-4 rounded-xl border border-secondary bg-background p-6">
           <ActivityFeed />
        </div>
      </div>
    </div>
  );
}

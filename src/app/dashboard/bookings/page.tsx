// src/app/dashboard/bookings/page.tsx

import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { redirect } from 'next/navigation';
import Image from 'next/image';
import { format } from 'date-fns';
import { BookingStatus } from '@prisma/client';
import BookingActions from '@/components/dashboard/BookingActions'; // Import the new component

// A helper function to get the correct styling for each status
const getStatusStyles = (status: BookingStatus) => {
  switch (status) {
    case 'CONFIRMED':
      return 'bg-green-500/10 text-green-700';
    case 'CANCELLED':
      return 'bg-red-500/10 text-red-500';
    case 'PENDING':
    default:
      return 'bg-yellow-500/10 text-yellow-600';
  }
};

export default async function MyBookingsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect('/login');
  }

  const outgoingBookings = await prisma.booking.findMany({
    where: { userId: session.user.id },
    include: {
      listing: { select: { title: true, imageUrls: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  const incomingBookings = await prisma.booking.findMany({
    where: {
      listing: { authorId: session.user.id },
    },
    include: {
      listing: { select: { title: true } },
      user: { select: { name: true, image: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div>
      <h1 className="font-heading text-3xl font-bold text-foreground">My Bookings</h1>
      <p className="mt-2 text-lg text-foreground/70">Manage your trips and booking requests.</p>
      
      <div className="mt-8">
        <h2 className="font-heading text-2xl font-semibold text-foreground">Trips You&apos;ve Booked</h2>
        <div className="mt-4 space-y-4">
          {outgoingBookings.length > 0 ? (
            outgoingBookings.map(booking => (
              <div key={booking.id} className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-secondary bg-background p-4">
                <div className="flex items-center gap-4">
                  <Image src={booking.listing.imageUrls[0] || '/images/placeholder.png'} alt={booking.listing.title} width={80} height={60} className="aspect-video rounded-md object-cover" />
                  <div className="flex-1">
                    <p className="font-semibold">{booking.listing.title}</p>
                    <p className="text-sm text-foreground/70">
                      {format(new Date(booking.startDate), 'MMM d, yyyy')} - {format(new Date(booking.endDate), 'MMM d, yyyy')}
                    </p>
                  </div>
                </div>
                {/* THE FIX: Use the helper function for dynamic status styles */}
                <div className={`rounded-full px-3 py-1 text-sm font-medium ${getStatusStyles(booking.status)}`}>
                  {booking.status}
                </div>
              </div>
            ))
          ) : (
            <p className="text-foreground/70">You haven&apos;t booked any trips yet.</p>
          )}
        </div>
      </div>

      <div className="mt-12">
        <h2 className="font-heading text-2xl font-semibold text-foreground">Requests for Your Listings</h2>
        <div className="mt-4 space-y-4">
          {incomingBookings.length > 0 ? (
            incomingBookings.map(booking => (
              <div key={booking.id} className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-secondary bg-background p-4">
                <div className="flex items-center gap-4">
                  <Image src={booking.user.image || '/images/avatar-default.png'} alt={booking.user.name || 'User'} width={40} height={40} className="rounded-full" />
                  <div>
                    <p className="font-semibold">{booking.user.name} requested to book {booking.listing.title}</p>
                    <p className="text-sm text-foreground/70">
                      {format(new Date(booking.startDate), 'MMM d, yyyy')} - {format(new Date(booking.endDate), 'MMM d, yyyy')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`rounded-full px-3 py-1 text-sm font-medium ${getStatusStyles(booking.status)}`}>
                    {booking.status}
                  </div>
                  {/* THE FIX: Conditionally render the action buttons only if the booking is PENDING */}
                  {booking.status === 'PENDING' && (
                    <BookingActions bookingId={booking.id} />
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="text-foreground/70">You haven&apos;t received any booking requests yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
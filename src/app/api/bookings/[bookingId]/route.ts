// src/app/api/bookings/[bookingId]/route.ts

import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { BookingStatus } from '@prisma/client';

type BookingRouteContext = {
  params: Promise<{ bookingId: string }>;
};

export async function PATCH(
  req: Request,
  { params }: BookingRouteContext
) {
  const { bookingId } = await params;
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const { status } = await req.json();
    const userId = session.user.id;

    if (!status || !Object.values(BookingStatus).includes(status)) {
      return new NextResponse('Bad Request: Invalid status', { status: 400 });
    }

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        listing: {
          select: { authorId: true },
        },
      },
    });

    if (!booking) {
      return new NextResponse('Not Found: Booking not found', { status: 404 });
    }

    if (booking.listing.authorId !== userId) {
      return new NextResponse('Forbidden: You do not own this listing', { status: 403 });
    }

    const updatedBooking = await prisma.booking.update({
      where: { id: bookingId },
      data: {
        status: status,
      },
    });

    // Create an activity log for the user if the booking is confirmed or cancelled
    if (updatedBooking.status === 'CONFIRMED' || updatedBooking.status === 'CANCELLED') {
      await prisma.activity.create({
        data: {
          type: updatedBooking.status === 'CONFIRMED' ? 'BOOKING_CONFIRMED' : 'BOOKING_CANCELLED',
          userId: booking.userId, // The notification is FOR the user who made the booking
          initiatorId: userId,    // The notification is FROM the host
          link: `/dashboard/bookings`,
        },
      });
    }

    return NextResponse.json(updatedBooking);
  } catch (error) {
    console.error("Error updating booking:", error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
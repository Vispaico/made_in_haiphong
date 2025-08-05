// src/app/api/bookings/[bookingId]/route.ts

import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { BookingStatus } from '@prisma/client';

export async function PATCH(
  req: Request,
  { params }: { params: { bookingId: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const { status } = await req.json();
    const { bookingId } = params;
    const userId = session.user.id;

    // 1. Validate the incoming status
    if (!status || !Object.values(BookingStatus).includes(status)) {
      return new NextResponse('Bad Request: Invalid status', { status: 400 });
    }

    // 2. Find the booking and the associated listing
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

    // 3. Security Check: Ensure the current user is the owner of the listing being booked
    if (booking.listing.authorId !== userId) {
      return new NextResponse('Forbidden: You do not own this listing', { status: 403 });
    }

    // 4. Update the booking with the new status
    const updatedBooking = await prisma.booking.update({
      where: { id: bookingId },
      data: {
        status: status,
      },
    });

    return NextResponse.json(updatedBooking);
  } catch (error) {
    console.error("Error updating booking:", error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
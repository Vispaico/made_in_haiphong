// src/app/api/bookings/route.ts

import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { bookingRequestSchema } from '@/lib/validators';
import { logger } from '@/lib/logger';

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const parsed = bookingRequestSchema.safeParse(await req.json());

  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid booking payload', details: parsed.error.flatten() }, { status: 400 });
  }

  const { listingId, startDate, endDate } = parsed.data;
  const userId = session.user.id;

  try {
    const listing = await prisma.listing.findUnique({
      where: { id: listingId },
    });

    if (!listing) {
      return new NextResponse('Not Found: Listing not found', { status: 404 });
    }

    if (listing.authorId === userId) {
      return new NextResponse('Bad Request: You cannot book your own listing', { status: 400 });
    }

    const overlappingBooking = await prisma.booking.findFirst({
      where: {
        listingId,
        status: { in: ['PENDING', 'CONFIRMED'] },
        NOT: [
          { endDate: { lte: startDate } },
          { startDate: { gte: endDate } },
        ],
      },
    });

    if (overlappingBooking) {
      return new NextResponse('Selected dates are no longer available.', { status: 409 });
    }
    
    const newBooking = await prisma.booking.create({
      data: {
        startDate,
        endDate,
        userId: userId,
        listingId: listingId,
        status: 'PENDING',
      },
    });

    // Create an activity log for the listing owner
    await prisma.activity.create({
      data: {
        type: 'NEW_BOOKING_REQUEST',
        userId: listing.authorId,      // The notification is FOR the listing owner
        initiatorId: userId,          // The notification is FROM the user who booked
        link: `/dashboard/bookings`,
      },
    });

    return NextResponse.json(newBooking, { status: 201 });
  } catch (error) {
    logger.error({ error }, 'Error creating booking');
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
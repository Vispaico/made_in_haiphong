// src/app/api/bookings/route.ts

import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const { listingId, startDate, endDate } = await req.json();
    const userId = session.user.id;

    // 1. Validate the input data
    if (!listingId || !startDate || !endDate) {
      return new NextResponse('Bad Request: Missing required fields', { status: 400 });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start >= end) {
      return new NextResponse('Bad Request: End date must be after start date', { status: 400 });
    }

    // 2. Fetch the listing to ensure it exists and the user is not booking their own listing
    const listing = await prisma.listing.findUnique({
      where: { id: listingId },
    });

    if (!listing) {
      return new NextResponse('Not Found: Listing not found', { status: 404 });
    }

    if (listing.authorId === userId) {
      return new NextResponse('Bad Request: You cannot book your own listing', { status: 400 });
    }

    // 3. (Future enhancement) Check for booking conflicts:
    //    Here, you would query existing bookings for this listing to see if the
    //    requested dates overlap with any confirmed bookings. For now, we'll skip this.
    
    // 4. Create the new booking with a PENDING status
    const newBooking = await prisma.booking.create({
      data: {
        startDate: start,
        endDate: end,
        userId: userId,
        listingId: listingId,
        status: 'PENDING', // All new requests are pending approval by the host
      },
    });

    return NextResponse.json(newBooking, { status: 201 });
  } catch (error) {
    console.error("Error creating booking:", error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
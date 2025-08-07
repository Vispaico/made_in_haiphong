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

    if (!listingId || !startDate || !endDate) {
      return new NextResponse('Bad Request: Missing required fields', { status: 400 });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start >= end) {
      return new NextResponse('Bad Request: End date must be after start date', { status: 400 });
    }

    const listing = await prisma.listing.findUnique({
      where: { id: listingId },
    });

    if (!listing) {
      return new NextResponse('Not Found: Listing not found', { status: 404 });
    }

    if (listing.authorId === userId) {
      return new NextResponse('Bad Request: You cannot book your own listing', { status: 400 });
    }
    
    const newBooking = await prisma.booking.create({
      data: {
        startDate: start,
        endDate: end,
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
    console.error("Error creating booking:", error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
// src/app/api/listings/[listingId]/bookings/route.ts

import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

// GET handler to fetch all confirmed booking dates for a listing
export async function GET(
  req: Request,
  { params }: { params: { listingId: string } }
) {
  try {
    const bookings = await prisma.booking.findMany({
      where: {
        listingId: params.listingId,
        status: 'CONFIRMED', // Only fetch confirmed bookings
      },
      select: {
        startDate: true,
        endDate: true,
      },
    });

    // We format the data into the `DateRange` format that react-day-picker expects
    const disabledDateRanges = bookings.map(booking => ({
      from: booking.startDate,
      to: booking.endDate,
    }));

    return NextResponse.json(disabledDateRanges);
  } catch (error) {
    console.error("Error fetching booked dates:", error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
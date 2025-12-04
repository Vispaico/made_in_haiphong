// src/app/api/listings/[listingId]/route.ts

import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

type ListingRouteContext = {
  params: Promise<{ listingId: string }>;
};

// GET handler to fetch a single listing
export async function GET(
  req: Request,
  { params }: ListingRouteContext
) {
  const { listingId } = await params;
  try {
    const listing = await prisma.listing.findUnique({
      where: { id: listingId },
    });

    if (!listing) {
      return new NextResponse('Not Found', { status: 404 });
    }

    return NextResponse.json(listing);
  } catch (error) {
    console.error("Error fetching listing:", error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: ListingRouteContext
) {
  const { listingId } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const listing = await prisma.listing.findUnique({ where: { id: listingId } });
    if (!listing || listing.authorId !== session.user.id) {
      return new NextResponse('Forbidden', { status: 403 });
    }

    const body = await req.json();
    // THE FIX: Expect latitude and longitude
    const { title, description, category, price, imageUrls, maxGuests, bedrooms, latitude, longitude } = body;

    const updatedListing = await prisma.listing.update({
      where: { id: listingId },
      data: {
        title, description, category,
        price: parseFloat(price),
        imageUrls,
        maxGuests: maxGuests ? parseInt(maxGuests) : null,
        bedrooms: bedrooms ? parseInt(bedrooms) : null,
        // THE FIX: Add the new fields to the update operation
        latitude: latitude ? parseFloat(latitude) : null,
        longitude: longitude ? parseFloat(longitude) : null,
      },
    });
    return NextResponse.json(updatedListing);
  } catch (error) {
    console.error("Error updating listing:", error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

// DELETE handler remains the same
export async function DELETE(
  req: Request,
  { params }: ListingRouteContext
) {
  const { listingId } = await params;
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const listing = await prisma.listing.findUnique({
      where: { id: listingId },
    });

    if (!listing || listing.authorId !== session.user.id) {
      return new NextResponse('Forbidden', { status: 403 });
    }

    await prisma.listing.delete({
      where: { id: listingId },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Error deleting listing:", error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
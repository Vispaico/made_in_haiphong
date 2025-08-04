// src/app/api/listings/[listingId]/route.ts

import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

// GET handler to fetch a single listing
export async function GET(
  req: Request,
  { params }: { params: { listingId: string } }
) {
  try {
    const listing = await prisma.listing.findUnique({
      where: { id: params.listingId },
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

// PATCH handler to update a listing
export async function PATCH(
  req: Request,
  { params }: { params: { listingId: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const listing = await prisma.listing.findUnique({
      where: { id: params.listingId },
    });

    if (!listing || listing.authorId !== session.user.id) {
      return new NextResponse('Forbidden', { status: 403 });
    }

    const body = await req.json();
    const { title, description, category, price, imageUrls } = body;

    const updatedListing = await prisma.listing.update({
      where: { id: params.listingId },
      data: {
        title,
        description,
        category,
        price: parseFloat(price),
        imageUrls,
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
  { params }: { params: { listingId: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const listing = await prisma.listing.findUnique({
      where: { id: params.listingId },
    });

    if (!listing || listing.authorId !== session.user.id) {
      return new NextResponse('Forbidden', { status: 403 });
    }

    await prisma.listing.delete({
      where: { id: params.listingId },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Error deleting listing:", error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
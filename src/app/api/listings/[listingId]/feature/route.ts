// src/app/api/listings/[listingId]/feature/route.ts

import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function PATCH(
  req: Request,
  { params }: { params: { listingId: string } }
) {
  const session = await getServerSession(authOptions);

  // 1. Authenticate the user
  if (!session?.user?.id) {
    return new NextResponse('Unauthorized', { status: 401 });
  }
  
  const userId = session.user.id;

  try {
    // 2. Security Check: Fetch the user from the DB to verify their subscription status
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (user?.subscriptionStatus !== 'PREMIUM') {
      return new NextResponse('Forbidden: Premium subscription required', { status: 403 });
    }

    // 3. Find the listing to ensure it exists and is owned by the user
    const listingToFeature = await prisma.listing.findUnique({
      where: { id: params.listingId },
    });

    if (!listingToFeature || listingToFeature.authorId !== userId) {
      return new NextResponse('Forbidden: You do not own this listing', { status: 403 });
    }

    // 4. Get the desired `isFeatured` status from the request body
    const { isFeatured } = await req.json();
    if (typeof isFeatured !== 'boolean') {
      return new NextResponse('Bad Request: isFeatured must be a boolean', { status: 400 });
    }

    // 5. Update the listing
    const updatedListing = await prisma.listing.update({
      where: { id: params.listingId },
      data: { isFeatured },
    });

    return NextResponse.json(updatedListing);
  } catch (error) {
    console.error("Error updating feature status:", error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
// src/app/api/listings/route.ts

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
    const body = await req.json();
    // THE FIX: Expect latitude and longitude in the request body
    const { title, description, category, price, imageUrls, maxGuests, bedrooms, latitude, longitude } = body;

    if (!title || !description || !category || !price) {
      return new NextResponse('Bad Request: Missing required fields', { status: 400 });
    }

    const newListing = await prisma.listing.create({
      data: {
        title, description, category,
        price: parseFloat(price),
        imageUrls: imageUrls || [],
        maxGuests: maxGuests ? parseInt(maxGuests) : null,
        bedrooms: bedrooms ? parseInt(bedrooms) : null,
        // THE FIX: Add the new fields to the create operation
        latitude: latitude ? parseFloat(latitude) : null,
        longitude: longitude ? parseFloat(longitude) : null,
        authorId: session.user.id,
      },
    });
    return NextResponse.json(newListing, { status: 201 });
  } catch (error) {
    console.error("Error creating listing:", error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
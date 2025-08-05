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
    // THE FIX: Expect `maxGuests` and `bedrooms` in the request body
    const body = await req.json();
    const { title, description, category, price, imageUrls, maxGuests, bedrooms } = body;

    if (!title || !description || !category || !price) {
      return new NextResponse('Bad Request: Missing required fields', { status: 400 });
    }

    const newListing = await prisma.listing.create({
      data: {
        title,
        description,
        category,
        price: parseFloat(price),
        imageUrls: imageUrls || [],
        // THE FIX: Add the new fields to the create operation
        maxGuests: maxGuests ? parseInt(maxGuests) : null,
        bedrooms: bedrooms ? parseInt(bedrooms) : null,
        authorId: session.user.id,
      },
    });

    return NextResponse.json(newListing, { status: 201 });
  } catch (error) {
    console.error("Error creating listing:", error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
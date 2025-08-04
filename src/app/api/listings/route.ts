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
    // THE FIX IS HERE: We now expect 'imageUrls' (an array).
    const { title, description, category, price, imageUrls } = await req.json();

    if (!title || !description || !category || !price) {
      return new NextResponse('Bad Request: Missing required fields', { status: 400 });
    }

    const newListing = await prisma.listing.create({
      data: {
        title,
        description,
        category,
        price: parseFloat(price),
        // THE FIX IS HERE: We save the array of URLs.
        imageUrls: imageUrls || [],
        authorId: session.user.id,
      },
    });

    return NextResponse.json(newListing, { status: 201 });
  } catch (error) {
    console.error("Error creating listing:", error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
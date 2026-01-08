// src/app/api/listings/route.ts

import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { listingBodySchema } from '@/lib/validators';
import { logger } from '@/lib/logger';

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const parsed = listingBodySchema.safeParse(await req.json());

  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid listing payload', details: parsed.error.flatten() }, { status: 400 });
  }

  const { title, description, category, price, imageUrls, maxGuests, bedrooms, latitude, longitude } = parsed.data;

  try {
    const newListing = await prisma.listing.create({
      data: {
        title,
        description,
        category,
        price,
        imageUrls,
        maxGuests: maxGuests ?? null,
        bedrooms: bedrooms ?? null,
        latitude: latitude ?? null,
        longitude: longitude ?? null,
        authorId: session.user.id,
      },
    });
    return NextResponse.json(newListing, { status: 201 });
  } catch (error) {
    logger.error({ error }, 'Error creating listing');
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
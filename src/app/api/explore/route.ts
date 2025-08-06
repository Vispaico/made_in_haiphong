// src/app/api/explore/route.ts

import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

// GET handler remains the same
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.isAdmin) {
    return new NextResponse('Unauthorized', { status: 401 });
  }
  try {
    const entries = await prisma.exploreEntry.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(entries);
  } catch (error) {
    console.error("Error fetching explore entries:", error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

// POST handler is updated
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.isAdmin) {
    return new NextResponse('Unauthorized', { status: 401 });
  }
  try {
    // THE FIX: Expect latitude and longitude
    const { title, description, body: contentBody, category, imageUrls, address, latitude, longitude } = await req.json();

    if (!title || !description || !contentBody || !category) {
      return new NextResponse('Bad Request: Missing required fields', { status: 400 });
    }

    const newEntry = await prisma.exploreEntry.create({
      data: {
        title, description,
        body: contentBody,
        category,
        imageUrls: imageUrls || [],
        address,
        // THE FIX: Add new fields
        latitude: latitude ? parseFloat(latitude) : null,
        longitude: longitude ? parseFloat(longitude) : null,
      },
    });
    return NextResponse.json(newEntry, { status: 201 });
  } catch (error) {
    console.error("Error creating explore entry:", error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
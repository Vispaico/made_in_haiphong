// src/app/api/explore/route.ts

import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

// GET handler to fetch all explore entries for the admin panel
export async function GET() {
  const session = await getServerSession(authOptions);

  // Security check: Only admins can access this data
  if (!session?.user?.isAdmin) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const entries = await prisma.exploreEntry.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
    return NextResponse.json(entries);
  } catch (error) {
    console.error("Error fetching explore entries:", error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

// POST handler for an admin to create a new explore entry
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.isAdmin) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const body = await req.json();
    const { title, description, body: contentBody, category, imageUrls, address } = body;

    // Basic validation
    if (!title || !description || !contentBody || !category) {
      return new NextResponse('Bad Request: Missing required fields', { status: 400 });
    }

    const newEntry = await prisma.exploreEntry.create({
      data: {
        title,
        description,
        body: contentBody,
        category,
        imageUrls: imageUrls || [],
        address,
      },
    });

    return NextResponse.json(newEntry, { status: 201 });
  } catch (error) {
    console.error("Error creating explore entry:", error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
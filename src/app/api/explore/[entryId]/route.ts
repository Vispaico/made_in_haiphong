// src/app/api/explore/[entryId]/route.ts

import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

type ExploreEntryRouteContext = {
  params: Promise<{ entryId: string }>;
};

// GET handler to fetch a single explore entry for the edit page
export async function GET(
  _req: Request, // Use _req as it's not directly used
  { params }: ExploreEntryRouteContext
) {
  const { entryId } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user?.isAdmin) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const entry = await prisma.exploreEntry.findUnique({
      where: { id: entryId }, // params is used here
    });
    if (!entry) {
      return new NextResponse('Not Found', { status: 404 });
    }
    return NextResponse.json(entry);
  } catch (error) {
    console.error("Error fetching entry:", error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

// PATCH handler to update an explore entry
export async function PATCH(
  req: Request,
  { params }: ExploreEntryRouteContext
) {
  const { entryId } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user?.isAdmin) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const body = await req.json(); // req is used here
    const { title, description, body: contentBody, category, imageUrls, address, latitude, longitude } = body;

    const updatedEntry = await prisma.exploreEntry.update({
      where: { id: entryId }, // params is used here
      data: {
        title, description,
        body: contentBody,
        category, imageUrls, address,
        latitude: latitude ? parseFloat(latitude) : null,
        longitude: longitude ? parseFloat(longitude) : null,
      },
    });
    return NextResponse.json(updatedEntry);
  } catch (error) {
    console.error("Error updating explore entry:", error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

// DELETE handler to remove an explore entry
export async function DELETE(
  _req: Request, // Use _req as it's not directly used
  { params }: ExploreEntryRouteContext
) {
  const { entryId } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user?.isAdmin) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    await prisma.exploreEntry.delete({
      where: { id: entryId }, // params is used here
    });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Error deleting entry:", error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
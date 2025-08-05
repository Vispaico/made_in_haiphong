// src/app/api/explore/[entryId]/route.ts

import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

// GET handler to fetch a single explore entry for the edit page
export async function GET(
  req: Request,
  { params }: { params: { entryId: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.isAdmin) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const entry = await prisma.exploreEntry.findUnique({
      where: { id: params.entryId },
    });
    if (!entry) {
      return new NextResponse('Not Found', { status: 404 });
    }
    return NextResponse.json(entry);
  } catch (error) {
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

// PATCH handler to update an explore entry
export async function PATCH(
  req: Request,
  { params }: { params: { entryId: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.isAdmin) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const body = await req.json();
    const { title, description, body: contentBody, category, imageUrls, address } = body;

    const updatedEntry = await prisma.exploreEntry.update({
      where: { id: params.entryId },
      data: {
        title,
        description,
        body: contentBody,
        category,
        imageUrls,
        address,
      },
    });
    return NextResponse.json(updatedEntry);
  } catch (error) {
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

// DELETE handler to remove an explore entry
export async function DELETE(
  req: Request,
  { params }: { params: { entryId: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.isAdmin) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    await prisma.exploreEntry.delete({
      where: { id: params.entryId },
    });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
// src/app/api/save/route.ts

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
    const { itemId, itemType } = await req.json();
    const userId = session.user.id;

    if (!itemId || !itemType || !['post', 'listing'].includes(itemType)) {
      return new NextResponse('Bad Request: Invalid item details', { status: 400 });
    }

    if (itemType === 'post') {
      const existingSave = await prisma.savedPost.findUnique({
        where: { userId_postId: { userId, postId: itemId } },
      });

      if (existingSave) {
        await prisma.savedPost.delete({ where: { id: existingSave.id } });
        return NextResponse.json({ message: 'Unsaved' });
      } else {
        await prisma.savedPost.create({ data: { userId, postId: itemId } });
        return NextResponse.json({ message: 'Saved' }, { status: 201 });
      }
    }

    if (itemType === 'listing') {
      const existingSave = await prisma.savedListing.findUnique({
        where: { userId_listingId: { userId, listingId: itemId } },
      });

      if (existingSave) {
        await prisma.savedListing.delete({ where: { id: existingSave.id } });
        return NextResponse.json({ message: 'Unsaved' });
      } else {
        await prisma.savedListing.create({ data: { userId, listingId: itemId } });
        return NextResponse.json({ message: 'Saved' }, { status: 201 });
      }
    }

    // This should not be reached, but it's good practice for type safety
    return new NextResponse('Bad Request: Invalid item type', { status: 400 });

  } catch (error) {
    console.error("Error handling save:", error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
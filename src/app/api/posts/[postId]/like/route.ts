// src/app/api/posts/[postId]/like/route.ts

import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(
  req: Request,
  { params }: { params: { postId: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return new NextResponse('Unauthorized', { status: 401 });
  }
  
  const userId = session.user.id;
  const postId = params.postId;

  try {
    // Check if the user has already liked this post
    const existingLike = await prisma.like.findUnique({
      where: {
        userId_postId: { userId, postId },
      },
    });

    if (existingLike) {
      // If a like exists, delete it (unlike)
      await prisma.like.delete({
        where: { id: existingLike.id },
      });
      return NextResponse.json({ message: 'Unliked' });
    } else {
      // If no like exists, create one (like)
      await prisma.like.create({
        data: { userId, postId },
      });
      return NextResponse.json({ message: 'Liked' }, { status: 201 });
    }
  } catch (error) {
    console.error("Error handling like:", error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
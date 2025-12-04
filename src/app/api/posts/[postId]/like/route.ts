// src/app/api/posts/[postId]/like/route.ts

import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth'; // <-- THE FINAL CORRECTED IMPORT PATH
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

type PostLikeRouteContext = {
  params: Promise<{ postId: string }>;
};

export async function POST(
  req: Request,
  { params }: PostLikeRouteContext
) {
  const { postId } = await params;
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return new NextResponse('Unauthorized', { status: 401 });
  }
  
  const userId = session.user.id;

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
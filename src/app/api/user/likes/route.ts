// src/app/api/user/likes/route.ts

import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    // Return an empty array if the user is not logged in
    return NextResponse.json([]);
  }

  try {
    const userLikes = await prisma.like.findMany({
      where: {
        userId: session.user.id,
      },
      select: {
        postId: true, // We only need the ID of the post they liked
      },
    });

    // Return just an array of the post IDs
    return NextResponse.json(userLikes.map(like => like.postId));
  } catch (error) {
    console.error("Error fetching user likes:", error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
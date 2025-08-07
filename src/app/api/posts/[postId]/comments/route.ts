// src/app/api/posts/[postId]/comments/route.ts

import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
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

  try {
    const { text } = await req.json();

    if (!text || typeof text !== 'string' || text.length < 1) {
      return new NextResponse('Bad Request: Invalid comment text', { status: 400 });
    }

    const post = await prisma.post.findUnique({
      where: { id: params.postId },
      select: { authorId: true }
    });

    if (!post) {
      return new NextResponse('Not Found: Post not found', { status: 404 });
    }

    const newComment = await prisma.comment.create({
      data: {
        text: text,
        authorId: session.user.id,
        postId: params.postId,
      },
    });

    // Only create an activity if the commenter is not the post author
    if (post.authorId !== session.user.id) {
      await prisma.activity.create({
        data: {
          type: 'NEW_COMMENT',
          userId: post.authorId,        // The notification is FOR the post author
          initiatorId: session.user.id, // The notification is FROM the commenter
          link: `/community/${params.postId}`,
        },
      });
    }

    return NextResponse.json(newComment, { status: 201 });
  } catch (error) {
    console.error("Error creating comment:", error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
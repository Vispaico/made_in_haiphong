// src/app/api/posts/[postId]/route.ts

import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

// This new PATCH handler will update a post
export async function PATCH(
  req: Request,
  { params }: { params: { postId: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const post = await prisma.post.findUnique({
      where: { id: params.postId },
    });

    // Security check: ensure the user owns this post
    if (!post || post.authorId !== session.user.id) {
      return new NextResponse('Forbidden', { status: 403 });
    }

    const { content, imageUrls } = await req.json();

    const updatedPost = await prisma.post.update({
      where: { id: params.postId },
      data: {
        content,
        imageUrls,
      },
    });

    return NextResponse.json(updatedPost);
  } catch (error) {
    console.error("Error updating post:", error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

// Your existing DELETE handler remains unchanged
export async function DELETE(
  req: Request,
  { params }: { params: { postId: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const postId = params.postId;
    const userId = session.user.id;

    const post = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post || post.authorId !== userId) {
      return new NextResponse('Forbidden', { status: 403 });
    }

    await prisma.post.delete({
      where: { id: postId },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Error deleting post:", error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
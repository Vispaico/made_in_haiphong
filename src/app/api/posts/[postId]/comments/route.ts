// src/app/api/posts/[postId]/comments/route.ts

import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth'; // <-- THE CORRECTED IMPORT PATH
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

    const newComment = await prisma.comment.create({
      data: {
        text: text,
        authorId: session.user.id,
        postId: params.postId,
      },
    });

    return NextResponse.json(newComment, { status: 201 });
  } catch (error) {
    console.error("Error creating comment:", error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
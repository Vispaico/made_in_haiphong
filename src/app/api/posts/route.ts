// src/app/api/posts/route.ts

import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route'; // We'll need to export this
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  // 1. Check if the user is authenticated
  if (!session?.user?.id) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const { content } = await req.json();

  // 2. Validate the input
  if (!content || typeof content !== 'string' || content.length < 1) {
    return new NextResponse('Bad Request: Invalid content', { status: 400 });
  }

  try {
    // 3. Create the post in the database
    const newPost = await prisma.post.create({
      data: {
        content: content,
        authorId: session.user.id,
      },
    });
    return NextResponse.json(newPost, { status: 201 });
  } catch (error) {
    console.error("Error creating post:", error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
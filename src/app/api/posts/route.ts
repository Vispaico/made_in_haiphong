// src/app/api/posts/route.ts

import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

// This is the new function for GET requests.
export async function GET() {
  try {
    const posts = await prisma.post.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
      },
    });
    return NextResponse.json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

// This is your existing function for POST requests. It remains unchanged.
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const { content } = await req.json();

  if (!content || typeof content !== 'string' || content.length < 1) {
    return new NextResponse('Bad Request: Invalid content', { status: 400 });
  }

  try {
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
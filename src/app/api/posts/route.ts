// src/app/api/posts/route.ts

import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { postBodySchema } from '@/lib/validators';
import { logger } from '@/lib/logger';

// The GET handler remains the same
export async function GET() {
  try {
    const posts = await prisma.post.findMany({
      where: { status: 'APPROVED' },
      orderBy: { createdAt: 'desc' },
      include: {
        author: { select: { id: true, name: true, image: true } },
        _count: { select: { likes: true, comments: true } },
      },
    });
    return NextResponse.json(posts);
  } catch (error) {
    logger.error({ error }, 'Error fetching posts');
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

// The POST handler is updated for multiple images
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const parsed = postBodySchema.safeParse(await req.json());

  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid post payload', details: parsed.error.flatten() }, { status: 400 });
  }

  const { content, imageUrls } = parsed.data;

  try {
    const newPost = await prisma.post.create({
      data: {
        content,
        imageUrls,
        authorId: session.user.id,
        status: 'PENDING',
      },
    });
    return NextResponse.json({ ...newPost, message: 'Post submitted for review' }, { status: 201 });
  } catch (error) {
    logger.error({ error }, 'Error creating post');
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
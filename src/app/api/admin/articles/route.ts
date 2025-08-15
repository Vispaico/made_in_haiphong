// src/app/api/admin/articles/route.ts
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import db from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.isAdmin) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const body = await req.json();
    const { title, slug, content, featuredImage, metaTitle, metaDescription, published } = body;

    if (!title || !slug || !content) {
      return new NextResponse('Bad Request: Missing required fields', { status: 400 });
    }

    const article = await db.article.create({
      data: {
        title,
        slug,
        content,
        featuredImage,
        metaTitle,
        metaDescription,
        published,
        authorId: session.user.id,
      },
    });

    return NextResponse.json(article, { status: 201 });
  } catch (error) {
    console.error("Error creating article:", error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
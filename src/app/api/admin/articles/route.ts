// src/app/api/admin/articles/route.ts
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

// GET handler to fetch all articles
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.isAdmin) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const articles = await prisma.article.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(articles);
  } catch (error) {
    console.error("Error fetching articles:", error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

// POST handler to create a new article
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.isAdmin) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const { title, slug, featuredImage, content, metaTitle, metaDescription, published } = await req.json();

    console.log("Session:", session);
    console.log("Request body:", { title, slug, featuredImage, content, metaTitle, metaDescription, published });

    if (!title || !slug || !content) {
      return new NextResponse('Bad Request: Title, slug, and content are required', { status: 400 });
    }

    const newArticle = await prisma.article.create({
      data: {
        title,
        slug,
        featuredImage,
        content,
        metaTitle,
        metaDescription,
        published,
        authorId: session.user.id,
      },
    });

    console.log("New article created:", newArticle);

    return NextResponse.json(newArticle, { status: 201 });
  } catch (error) {
    console.error("Error creating article:", error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

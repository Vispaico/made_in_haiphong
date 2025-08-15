// src/app/api/admin/articles/[articleId]/route.ts
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

// GET handler to fetch a single article by ID
export async function GET(req: Request, { params }: { params: { articleId: string } }) {
  try {
    const article = await prisma.article.findUnique({
      where: { id: params.articleId },
    });
    if (!article) {
      return new NextResponse('Not Found', { status: 404 });
    }
    return NextResponse.json(article);
  } catch (error) {
    console.error("Error fetching article:", error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

// PUT handler to update an article
export async function PUT(req: Request, { params }: { params: { articleId: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.isAdmin) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const { title, slug, featuredImage, content, metaTitle, metaDescription, published } = await req.json();

    if (!title || !slug || !content) {
      return new NextResponse('Bad Request: Title, slug, and content are required', { status: 400 });
    }

    const updatedArticle = await prisma.article.update({
      where: { id: params.articleId },
      data: {
        title,
        slug,
        featuredImage,
        content,
        metaTitle,
        metaDescription,
        published,
      },
    });

    return NextResponse.json(updatedArticle);
  } catch (error) {
    console.error("Error updating article:", error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

// DELETE handler to delete an article
export async function DELETE(req: Request, { params }: { params: { articleId: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.isAdmin) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    await prisma.article.delete({
      where: { id: params.articleId },
    });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Error deleting article:", error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

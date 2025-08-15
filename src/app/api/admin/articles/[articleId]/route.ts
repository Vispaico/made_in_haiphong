// src/app/api/admin/articles/[articleId]/route.ts
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import db from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function PUT(
  req: Request,
  { params }: { params: { articleId: string } }
) {
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

    const article = await db.article.update({
      where: { id: params.articleId },
      data: {
        title,
        slug,
        content,
        featuredImage,
        metaTitle,
        metaDescription,
        published,
      },
    });

    return NextResponse.json(article);
  } catch (error) {
    console.error("Error updating article:", error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { articleId: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.isAdmin) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    await db.article.delete({
      where: { id: params.articleId },
    });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Error deleting article:", error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
// src/app/api/admin/articles/[articleId]/route.ts
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import db from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

type ArticleRouteContext = {
  params: Promise<{ articleId: string }>;
};

export async function PUT(
  req: Request,
  { params }: ArticleRouteContext
) {
  const { articleId } = await params;
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
      where: { id: articleId },
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

    revalidatePath('/articles');
    revalidatePath(`/articles/${article.slug}`);
    revalidatePath('/admin/articles');

    return NextResponse.json(article);
  } catch (error) {
    console.error("Error updating article:", error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: ArticleRouteContext
) {
  const { articleId } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user?.isAdmin) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const article = await db.article.delete({
      where: { id: articleId },
    });
    
    revalidatePath('/articles');
    revalidatePath(`/articles/${article.slug}`);
    revalidatePath('/admin/articles');
    
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Error deleting article:", error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
// src/app/api/admin/categories/[categoryId]/route.ts

import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

type CategoryRouteContext = {
  params: Promise<{ categoryId: string }>;
};

// PATCH handler to update a category
export async function PATCH(
  req: Request,
  { params }: CategoryRouteContext
) {
  const { categoryId } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user?.isAdmin) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const { name, slug, type } = await req.json();
    const updatedCategory = await prisma.category.update({
      where: { id: categoryId },
      data: { name, slug, type },
    });
    return NextResponse.json(updatedCategory);
  } catch (error) {
    console.error("Error updating category:", error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

// DELETE handler to remove a category
export async function DELETE(
  req: Request,
  { params }: CategoryRouteContext
) {
  const { categoryId } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user?.isAdmin) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    await prisma.category.delete({
      where: { id: categoryId },
    });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Error deleting category:", error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
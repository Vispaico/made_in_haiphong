import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { z } from 'zod';

type RouteContext = {
  params: Promise<{ postId: string }>;
};

const bodySchema = z.object({
  status: z.enum(['APPROVED', 'REJECTED']),
});

export async function PATCH(req: Request, { params }: RouteContext) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.isAdmin) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const { postId } = await params;
  const parsed = bodySchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid status', details: parsed.error.flatten() }, { status: 400 });
  }

  try {
    const updated = await prisma.post.update({
      where: { id: postId },
      data: { status: parsed.data.status },
    });

    return NextResponse.json(updated);
  } catch (error) {
    return new NextResponse('Post not found', { status: 404 });
  }
}

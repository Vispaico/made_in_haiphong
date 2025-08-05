// src/app/api/admin/users/[userId]/route.ts

import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function PATCH(
  req: Request,
  { params }: { params: { userId: string } }
) {
  const session = await getServerSession(authOptions);

  // 1. Authenticate and authorize the user: Must be an admin
  if (!session?.user?.id || session.user.isAdmin !== true) {
    return new NextResponse('Unauthorized: Admin access required', { status: 401 });
  }

  try {
    const targetUserId = params.userId;
    const { isAdmin } = await req.json();

    // 2. Validate input: `isAdmin` must be a boolean
    if (typeof isAdmin !== 'boolean') {
      return new NextResponse('Bad Request: isAdmin must be a boolean', { status: 400 });
    }

    // 3. Prevent an admin from revoking their own admin status
    if (targetUserId === session.user.id) {
      return new NextResponse('Forbidden: Cannot change your own admin status', { status: 403 });
    }

    // 4. Update the user's isAdmin status in the database
    const updatedUser = await prisma.user.update({
      where: { id: targetUserId },
      data: { isAdmin: isAdmin },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Error updating user role:", error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
// src/app/api/admin/users/[userId]/route.ts

import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { SubscriptionStatus } from '@prisma/client';

type UserRouteContext = {
  params: Promise<{ userId: string }>;
};

export async function PATCH(
  req: Request,
  { params }: UserRouteContext
) {
  const { userId } = await params;
  const session = await getServerSession(authOptions);

  if (!session?.user?.id || session.user.isAdmin !== true) {
    return new NextResponse('Unauthorized: Admin access required', { status: 401 });
  }

  try {
    const targetUserId = userId;
    const body = await req.json();
    const { isAdmin, subscriptionStatus } = body;

    const dataToUpdate: { isAdmin?: boolean; subscriptionStatus?: SubscriptionStatus } = {};

    if (typeof isAdmin === 'boolean') {
      if (targetUserId === session.user.id) {
        return new NextResponse('Forbidden: Cannot change your own admin status', { status: 403 });
      }
      dataToUpdate.isAdmin = isAdmin;
    }
    
    if (subscriptionStatus && Object.values(SubscriptionStatus).includes(subscriptionStatus)) {
      dataToUpdate.subscriptionStatus = subscriptionStatus;
    }

    if (Object.keys(dataToUpdate).length === 0) {
      return new NextResponse('Bad Request: No valid fields to update', { status: 400 });
    }

    const updatedUser = await prisma.user.update({
      where: { id: targetUserId },
      data: dataToUpdate,
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
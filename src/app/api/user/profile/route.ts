// src/app/api/user/profile/route.ts

import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const { name, image } = await req.json();

    // Basic validation
    if (typeof name !== 'string') {
      return new NextResponse('Bad Request: Invalid name', { status: 400 });
    }

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name: name,
        // Only update the image if a new one was provided
        ...(image && { image: image }),
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Error updating profile:", error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
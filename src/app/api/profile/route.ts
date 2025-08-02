// src/app/api/profile/route.ts

import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

// We use PATCH because we are partially updating the user resource
export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);

  // 1. Check for a valid session and user ID
  if (!session?.user?.id) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const { name, image } = await req.json();

    // 2. Validate the input (name must be a non-empty string)
    if (typeof name !== 'string' || name.length < 1) {
      return NextResponse.json(
        { message: 'Invalid name provided.' },
        { status: 400 }
      );
    }
    
    // 3. Update the user in the database
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name: name,
        image: image || null, // Allow updating or clearing the image URL
      },
    });

    return NextResponse.json(updatedUser);

  } catch (error) {
    console.error("PROFILE UPDATE ERROR:", error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
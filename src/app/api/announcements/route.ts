// src/app/api/admin/announcements/route.ts

import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

// GET handler to fetch all announcements
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.isAdmin) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const announcements = await prisma.announcement.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(announcements);
  } catch (error) {
    console.error("Error fetching announcements:", error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

// POST handler to create a new announcement
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.isAdmin) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const { message, isActive } = await req.json();

    if (!message) {
      return new NextResponse('Bad Request: Message is required', { status: 400 });
    }

    const newAnnouncement = await prisma.announcement.create({
      data: { message, isActive },
    });

    return NextResponse.json(newAnnouncement, { status: 201 });
  } catch (error) {
    console.error("Error creating announcement:", error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
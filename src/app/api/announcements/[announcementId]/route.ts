// src/app/api/admin/announcements/[announcementId]/route.ts

import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

type AnnouncementRouteContext = {
  params: Promise<{ announcementId: string }>;
};

// PATCH handler to update an announcement (e.g., change its message or active status)
export async function PATCH(
  req: Request,
  { params }: AnnouncementRouteContext
) {
  const { announcementId } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user?.isAdmin) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const { message, isActive } = await req.json();
    const updatedAnnouncement = await prisma.announcement.update({
      where: { id: announcementId },
      data: { message, isActive },
    });
    return NextResponse.json(updatedAnnouncement);
  } catch (error) {
    console.error("Error updating announcement:", error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

// DELETE handler to remove an announcement
export async function DELETE(
  req: Request,
  { params }: AnnouncementRouteContext
) {
  const { announcementId } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user?.isAdmin) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    await prisma.announcement.delete({
      where: { id: announcementId },
    });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Error deleting announcement:", error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
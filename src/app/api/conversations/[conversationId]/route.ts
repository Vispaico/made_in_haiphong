// src/app/api/conversations/[conversationId]/route.ts

import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(
  req: Request,
  { params }: { params: { conversationId: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const { body } = await req.json();
    const { conversationId } = params;
    const userId = session.user.id;

    if (!body || typeof body !== 'string' || body.trim().length === 0) {
      return new NextResponse('Bad Request: Message body cannot be empty', { status: 400 });
    }

    // Security check: ensure the current user is a participant of the conversation
    const conversation = await prisma.conversation.findUnique({
      where: {
        id: conversationId,
        participants: {
          some: { id: userId },
        },
      },
    });

    if (!conversation) {
      return new NextResponse('Forbidden', { status: 403 });
    }

    const newMessage = await prisma.message.create({
      data: {
        body: body,
        conversationId: conversationId,
        senderId: userId,
      },
    });

    return NextResponse.json(newMessage, { status: 201 });
  } catch (error) {
    console.error("Error sending message:", error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
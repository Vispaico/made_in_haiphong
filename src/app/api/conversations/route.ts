// src/app/api/conversations/route.ts

import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

// GET handler to fetch all conversations for the current user
export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const conversations = await prisma.conversation.findMany({
      where: {
        participants: {
          some: {
            id: session.user.id,
          },
        },
      },
      include: {
        participants: {
          select: { id: true, name: true, image: true },
        },
        messages: {
          orderBy: {
            createdAt: 'desc',
          },
          take: 1, // Include only the most recent message for preview
        },
      },
      orderBy: {
        messages: {
          _count: 'desc', // A trick to order by the most recently updated conversation
        },
      },
    });

    return NextResponse.json(conversations);
  } catch (error) {
    console.error("Error fetching conversations:", error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

// POST handler to start a new conversation
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const { recipientId } = await req.json();
    const currentUserId = session.user.id;

    if (!recipientId) {
      return new NextResponse('Bad Request: recipientId is required', { status: 400 });
    }

    // Check if a conversation between these two users already exists
    const existingConversation = await prisma.conversation.findFirst({
      where: {
        AND: [
          { participants: { some: { id: currentUserId } } },
          { participants: { some: { id: recipientId } } },
        ],
      },
    });

    if (existingConversation) {
      return NextResponse.json(existingConversation);
    }

    // If no conversation exists, create a new one
    const newConversation = await prisma.conversation.create({
      data: {
        participants: {
          connect: [
            { id: currentUserId },
            { id: recipientId },
          ],
        },
      },
    });

    return NextResponse.json(newConversation, { status: 201 });
  } catch (error) {
    console.error("Error creating conversation:", error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
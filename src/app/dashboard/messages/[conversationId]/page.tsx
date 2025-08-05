// src/app/dashboard/messages/[conversationId]/page.tsx

import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { notFound, redirect } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import ChatInput from '@/components/dashboard/ChatInput';
import MessageList from '@/components/dashboard/MessageList'; // We will create a new client component for the messages

export default async function ConversationPage({ params }: { params: { conversationId: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect('/login');
  }

  const conversation = await prisma.conversation.findUnique({
    where: {
      id: params.conversationId,
      participants: {
        some: { id: session.user.id },
      },
    },
    include: {
      participants: {
        select: { id: true, name: true, image: true },
      },
      messages: {
        orderBy: { createdAt: 'asc' }, // Still fetch oldest first
        include: {
          sender: { select: { id: true, name: true, image: true } },
        },
      },
    },
  });

  if (!conversation) {
    notFound();
  }

  const otherParticipant = conversation.participants.find(p => p.id !== session.user!.id);
  const currentUserId = session.user.id;

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col">
      {/* Header for the chat window */}
      <div className="flex items-center gap-3 border-b border-secondary p-4 flex-shrink-0 bg-background">
        <Link href="/dashboard/messages" className="md:hidden rounded-full p-1 hover:bg-secondary">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        </Link>
        <Image 
          src={otherParticipant?.image || '/images/avatar-default.png'}
          alt={otherParticipant?.name || 'User'}
          width={40} height={40} className="rounded-full"
        />
        <h2 className="font-semibold">{otherParticipant?.name}</h2>
      </div>

      {/* THE FIX: We delegate the message rendering to a new client component */}
      {/* This allows us to handle auto-scrolling on the client side */}
      <MessageList initialMessages={conversation.messages} currentUserId={currentUserId} />

      {/* Chat Input Area */}
      <div className="p-4 border-t border-secondary flex-shrink-0 bg-background">
        <ChatInput conversationId={conversation.id} />
      </div>
    </div>
  );
}
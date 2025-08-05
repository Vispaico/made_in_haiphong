// src/app/dashboard/messages/[conversationId]/page.tsx

import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { notFound, redirect } from 'next/navigation';
import Image from 'next/image';
import ChatInput from '@/components/dashboard/ChatInput'; // We will create this next
import Link from 'next/link';

export default async function ConversationPage({ params }: { params: { conversationId: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect('/login');
  }

  const conversation = await prisma.conversation.findUnique({
    where: {
      id: params.conversationId,
      // Security check to ensure the current user is part of this conversation
      participants: {
        some: { id: session.user.id },
      },
    },
    include: {
      participants: {
        select: { id: true, name: true, image: true },
      },
      messages: {
        orderBy: { createdAt: 'asc' }, // Show oldest messages first
        include: {
          sender: { select: { name: true, image: true } },
        },
      },
    },
  });

  if (!conversation) {
    notFound();
  }

  const otherParticipant = conversation.participants.find(p => p.id !== session.user!.id);

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col">
      {/* Header for the chat window */}
      <div className="flex items-center gap-3 border-b border-secondary p-4 flex-shrink-0">
        <Link href="/dashboard/messages">
            &larr; Back
        </Link>
        <Image 
          src={otherParticipant?.image || '/images/avatar-default.png'}
          alt={otherParticipant?.name || 'User'}
          width={40} height={40} className="rounded-full"
        />
        <h2 className="font-semibold">{otherParticipant?.name}</h2>
      </div>

      {/* Message Area */}
      <div className="flex-grow overflow-y-auto p-4 space-y-4">
        {conversation.messages.map(message => (
          <div
            key={message.id}
            className={`flex items-end gap-2 ${message.senderId === session.user!.id ? 'justify-end' : 'justify-start'}`}
          >
            {/* Show avatar for received messages */}
            {message.senderId !== session.user!.id && (
              <Image src={message.sender.image || '/images/avatar-default.png'} alt={message.sender.name || 'Sender'} width={32} height={32} className="rounded-full" />
            )}
            {/* Chat Bubble */}
            <div
              className={`max-w-xs rounded-lg px-3 py-2 lg:max-w-md ${
                message.senderId === session.user!.id
                  ? 'bg-primary text-white'
                  : 'bg-secondary'
              }`}
            >
              <p className="whitespace-pre-wrap text-sm">{message.body}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Chat Input Area */}
      <div className="p-4 border-t border-secondary flex-shrink-0">
        <ChatInput conversationId={conversation.id} />
      </div>
    </div>
  );
}
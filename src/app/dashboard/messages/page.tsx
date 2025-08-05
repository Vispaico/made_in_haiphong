// src/app/dashboard/messages/page.tsx

import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { formatDistanceToNow } from 'date-fns'; // For showing "X minutes ago"

// We define a more specific type for our conversations for type safety
type ConversationWithDetails = {
  id: string;
  createdAt: Date;
  participants: {
    id: string;
    name: string | null;
    image: string | null;
  }[];
  messages: {
    id: string;
    body: string;
    createdAt: Date;
  }[];
};

export default async function MessagesPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect('/login');
  }

  // Fetch all conversations for the current user directly from the database
  const conversations: ConversationWithDetails[] = await prisma.conversation.findMany({
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
        take: 1, // Include only the most recent message for a preview
      },
    },
    orderBy: {
      messages: {
        _count: 'desc', // This is a trick to order conversations by the most recently active
      },
    },
  });

  return (
    <div className="h-[calc(100vh-4rem)] flex"> {/* Full height container */}
      {/* Left Column: Conversation List */}
      <div className="w-1/3 border-r border-secondary">
        <div className="p-4 border-b border-secondary">
          <h1 className="font-heading text-2xl font-bold">Messages</h1>
        </div>
        <div className="overflow-y-auto">
          {conversations.length > 0 ? (
            <ul>
              {conversations.map((convo) => {
                // Find the other participant in the conversation
                const otherParticipant = convo.participants.find(p => p.id !== session.user!.id);
                const lastMessage = convo.messages[0];

                return (
                  <li key={convo.id} className="border-b border-secondary">
                    <Link href={`/dashboard/messages/${convo.id}`} className="block p-4 hover:bg-secondary">
                      <div className="flex items-center gap-3">
                        <Image
                          src={otherParticipant?.image || '/images/avatar-default.png'}
                          alt={otherParticipant?.name || 'User'}
                          width={48}
                          height={48}
                          className="rounded-full"
                        />
                        <div className="flex-1 overflow-hidden">
                          <div className="flex justify-between">
                            <p className="font-semibold truncate">{otherParticipant?.name}</p>
                            {lastMessage && (
                              <p className="text-xs text-foreground/60 flex-shrink-0">
                                {formatDistanceToNow(new Date(lastMessage.createdAt), { addSuffix: true })}
                              </p>
                            )}
                          </div>
                          <p className="text-sm text-foreground/70 truncate">
                            {lastMessage?.body || 'No messages yet.'}
                          </p>
                        </div>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="p-4 text-foreground/70">You have no active conversations.</p>
          )}
        </div>
      </div>

      {/* Right Column: Active Chat Window (Placeholder) */}
      <div className="w-2/3 flex items-center justify-center">
        <div className="text-center">
          <h2 className="font-heading text-xl text-foreground">Select a conversation</h2>
          <p className="text-foreground/60">Choose a conversation from the left to start chatting.</p>
        </div>
      </div>
    </div>
  );
}
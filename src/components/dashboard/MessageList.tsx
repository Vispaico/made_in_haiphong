// src/components/dashboard/MessageList.tsx
'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { Message, User } from '@prisma/client';

// Define a more specific type for our messages
type MessageWithSender = Message & {
  sender: {
    name: string | null;
    image: string | null;
  };
};

interface MessageListProps {
  initialMessages: MessageWithSender[];
  currentUserId: string;
}

export default function MessageList({ initialMessages, currentUserId }: MessageListProps) {
  // A ref to the container div of the messages
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // This effect will run once when the component loads
  useEffect(() => {
    // Instantly scroll to the bottom to show the latest message
    messagesEndRef.current?.scrollIntoView({ behavior: 'auto' });
  }, [initialMessages]); // Re-run if the messages change (e.g., after a refresh)

  return (
    <div className="flex-grow overflow-y-auto p-4 space-y-4">
      {initialMessages.map(message => (
        <div
          key={message.id}
          className={`flex items-end gap-2 ${message.senderId === currentUserId ? 'justify-end' : 'justify-start'}`}
        >
          {message.senderId !== currentUserId && (
            <Image src={message.sender.image || '/images/avatar-default.png'} alt={message.sender.name || 'Sender'} width={32} height={32} className="rounded-full self-start"/>
          )}
          <div
            className={`max-w-xs rounded-lg px-3 py-2 lg:max-w-md ${
              message.senderId === currentUserId
                ? 'bg-primary text-white'
                : 'bg-secondary'
            }`}
          >
            <p className="whitespace-pre-wrap text-sm">{message.body}</p>
          </div>
        </div>
      ))}
      {/* An empty div at the end of the list that we can scroll to */}
      <div ref={messagesEndRef} />
    </div>
  );
}
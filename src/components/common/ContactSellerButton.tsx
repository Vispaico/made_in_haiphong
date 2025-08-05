// src/components/common/ContactSellerButton.tsx
'use client';

import { useRouter } from 'next/navigation';
import { MessageSquare } from 'lucide-react';
import { useState } from 'react';

interface ContactSellerButtonProps {
  sellerId: string;
  // THE FIX: We now accept a simple string, which is safe to pass from server to client.
  currentUserId?: string | null;
}

export default function ContactSellerButton({ sellerId, currentUserId }: ContactSellerButtonProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // THE FIX: The check is now simple and reliable.
  // Don't render if the user isn't logged in (no ID) or if they are the seller.
  if (!currentUserId || currentUserId === sellerId) {
    return null;
  }

  const handleClick = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recipientId: sellerId }),
      });
      if (!response.ok) throw new Error('Failed to start conversation.');
      const conversation = await response.json();
      router.push(`/dashboard/messages/${conversation.id}`);
    } catch (error) {
      console.error(error);
      alert('Could not start a conversation. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-accent px-4 py-3 font-semibold text-white transition-colors hover:bg-accent/90 disabled:opacity-50"
    >
      <MessageSquare className="h-5 w-5" />
      <span>{isLoading ? 'Starting Chat...' : 'Contact Seller'}</span>
    </button>
  );
}
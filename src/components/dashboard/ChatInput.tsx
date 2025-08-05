// src/components/dashboard/ChatInput.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Send } from 'lucide-react';

export default function ChatInput({ conversationId }: { conversationId: string }) {
  const [body, setBody] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!body.trim()) return;

    const response = await fetch(`/api/conversations/${conversationId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ body }),
    });

    if (response.ok) {
      setBody('');
      router.refresh();
    } else {
      alert('Failed to send message.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      <input
        type="text"
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="Type a message..."
        className="flex-grow rounded-full border border-secondary bg-background/50 px-4 py-2 text-foreground focus:ring-2 focus:ring-primary"
      />
      <button
        type="submit"
        disabled={!body.trim()}
        className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-accent text-white transition-colors hover:bg-accent/90 disabled:cursor-not-allowed disabled:bg-accent/50"
      >
        <Send className="h-5 w-5" />
      </button>
    </form>
  );
}
// src/components/ui/ChatInterface.tsx
'use client';

import { useChat } from '@ai-sdk/react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Send } from 'lucide-react';

export function ChatInterface() {
  const { messages, input, handleInputChange, handleSubmit } = useChat();

  return (
    <div className="flex flex-col h-[calc(100vh-10rem)] w-full max-w-3xl mx-auto bg-secondary rounded-lg shadow-md">
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-foreground/60">
            <p>Welcome to the AI Travel Assistant!</p>
            <p>How can I help you plan your trip to Haiphong?</p>
          </div>
        )}
        {messages.map(m => (
          <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-lg p-3 rounded-lg ${m.role === 'user' ? 'bg-primary text-background' : 'bg-background text-foreground'}`}>
              <p className="font-semibold capitalize">{m.role}</p>
              <p>{m.content}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-foreground/10 p-4">
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <Input
            value={input}
            onChange={handleInputChange}
            placeholder="Ask about flights, hotels, or restaurants..."
            className="flex-1"
          />
          <Button type="submit" variant="accent" size="icon">
            <Send className="h-5 w-5" />
          </Button>
        </form>
      </div>
    </div>
  );
}

// src/app/assistant/page.tsx
import { ChatInterface } from '@/components/ui/ChatInterface';

export default function AssistantPage() {
  return (
    <div className="bg-background min-h-screen py-12">
      <main className="container mx-auto max-w-4xl px-4">
        <h1 className="font-heading text-4xl font-bold text-foreground mb-8 text-center">
          AI Travel Assistant
        </h1>
        <ChatInterface />
      </main>
    </div>
  );
}

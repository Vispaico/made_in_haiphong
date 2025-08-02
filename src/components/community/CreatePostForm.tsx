// src/components/community/CreatePostForm.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CreatePostForm() {
  const [content, setContent] = useState('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const response = await fetch('/api/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content }),
    });

    if (response.ok) {
      setContent(''); // Clear the form
      router.refresh(); // Refresh the page to show the new post
    } else {
      setError('Failed to create post. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-12 rounded-xl border border-secondary bg-background p-6 shadow-sm">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full rounded-md border border-secondary bg-secondary p-2.5 text-foreground placeholder-foreground/50 focus:ring-2 focus:ring-primary"
        rows={3}
        placeholder="What's on your mind?"
        required
      />
      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
      <div className="mt-4 flex justify-end">
        <button 
          type="submit" 
          disabled={!content.trim()}
          className="rounded-lg bg-accent px-6 py-2.5 font-bold text-white shadow-md transition-colors hover:bg-accent/90 disabled:cursor-not-allowed disabled:bg-accent/50"
        >
          Post
        </button>
      </div>
    </form>
  );
}
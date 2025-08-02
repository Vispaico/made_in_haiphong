// src/components/community/CommentForm.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

interface CommentFormProps {
  postId: string;
}

export default function CommentForm({ postId }: CommentFormProps) {
  const { data: session, status } = useSession();
  const [text, setText] = useState('');
  const router = useRouter();

  // If the user is not logged in, don't show the form.
  if (status !== 'authenticated') {
    return <p className="mt-4 text-foreground/70">Please <a href="/login" className="underline text-primary">log in</a> to leave a comment.</p>;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    const response = await fetch(`/api/posts/${postId}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });

    if (response.ok) {
      setText(''); // Clear the form
      router.refresh(); // Refresh the page to show the new comment instantly
    } else {
      alert('Failed to post comment. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="w-full rounded-md border border-secondary bg-secondary p-2.5 text-foreground placeholder-foreground/50 focus:ring-2 focus:ring-primary"
        rows={3}
        placeholder="Write a comment..."
        required
      />
      <div className="mt-2 flex justify-end">
        <button
          type="submit"
          disabled={!text.trim()}
          className="rounded-lg bg-primary px-5 py-2 font-semibold text-white transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:bg-primary/50"
        >
          Post Comment
        </button>
      </div>
    </form>
  );
}
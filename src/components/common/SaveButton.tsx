// src/components/common/SaveButton.tsx
'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Bookmark } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface SaveButtonProps {
  itemId: string;
  itemType: 'post' | 'listing';
  isInitiallySaved: boolean;
}

export default function SaveButton({ itemId, itemType, isInitiallySaved }: SaveButtonProps) {
  const { status } = useSession();
  const router = useRouter();
  const [isSaved, setIsSaved] = useState(isInitiallySaved);

  const handleSave = async () => {
    // 1. Redirect to login if user is not authenticated
    if (status !== 'authenticated') {
      router.push('/login');
      return;
    }

    // 2. Optimistic UI Update: Instantly change the button's appearance
    setIsSaved(!isSaved);

    // 3. Send the request to the server in the background
    try {
      const response = await fetch('/api/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId, itemType }),
      });

      if (!response.ok) {
        // If the server fails, revert the optimistic update
        setIsSaved(!isSaved);
        alert('Failed to save. Please try again.');
      }
      // On success, we don't need to do anything, as the UI is already updated.
    } catch (error) {
      // Also revert on network error
      setIsSaved(!isSaved);
      alert('An error occurred. Please try again.');
    }
  };

  return (
    <button
      onClick={handleSave}
      className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-secondary px-4 py-3 font-semibold text-foreground transition-colors hover:bg-secondary/80"
    >
      <Bookmark 
        className={`h-4 w-4 ${isSaved ? 'text-primary' : ''}`}
        fill={isSaved ? 'currentColor' : 'none'}
      />
      <span>{isSaved ? 'Saved' : 'Save'}</span>
    </button>
  );
}
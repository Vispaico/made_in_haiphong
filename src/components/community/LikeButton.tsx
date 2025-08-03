// src/components/community/LikeButton.tsx
'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Heart } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface LikeButtonProps {
  postId: string;
  initialLikes: number;
  isInitiallyLiked: boolean;
}

export default function LikeButton({ postId, initialLikes, isInitiallyLiked }: LikeButtonProps) {
  // THE FIX IS HERE: We are no longer creating the unused 'session' variable.
  // We only destructure 'status', which is the only property we actually use.
  const { status } = useSession();
  const router = useRouter();
  
  const [likeCount, setLikeCount] = useState(initialLikes);
  const [isLiked, setIsLiked] = useState(isInitiallyLiked);

  const handleLike = async () => {
    if (status !== 'authenticated') {
      router.push('/login'); // Redirect to login if not authenticated
      return;
    }

    // Optimistic UI update
    setIsLiked(!isLiked);
    setLikeCount(likeCount + (!isLiked ? 1 : -1));

    await fetch(`/api/posts/${postId}/like`, { method: 'POST' });
  };

  return (
    <button onClick={handleLike} className="flex items-center gap-1.5 transition-colors hover:text-accent">
      <Heart 
        className={`h-5 w-5 ${isLiked ? 'text-accent' : 'text-foreground/70'}`}
        fill={isLiked ? 'currentColor' : 'none'}
      />
      <span className="text-sm text-foreground/70">{likeCount} Likes</span>
    </button>
  );
}
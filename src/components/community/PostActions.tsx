// src/components/community/PostActions.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2, Edit } from 'lucide-react';
import Link from 'next/link';

interface PostActionsProps {
  postId: string;
}

export default function PostActions({ postId }: PostActionsProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    const confirmed = window.confirm('Are you sure you want to delete this post?');
    if (!confirmed) return;

    setIsDeleting(true);
    const response = await fetch(`/api/posts/${postId}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      // Refresh the current route to show that the post has been removed
      router.refresh();
    } else {
      alert('Failed to delete post. Please try again.');
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Link 
        href={`/community/${postId}/edit`} // The future edit page
        className="flex items-center gap-1 rounded-md bg-secondary px-2 py-1 text-sm text-foreground transition-colors hover:bg-secondary/80"
      >
        <Edit className="h-4 w-4" />
        <span>Edit</span>
      </Link>
      <button
        onClick={handleDelete}
        disabled={isDeleting}
        className="flex items-center gap-1 rounded-md bg-red-500/10 px-2 py-1 text-sm text-red-500 transition-colors hover:bg-red-500 hover:text-white disabled:opacity-50"
      >
        <Trash2 className="h-4 w-4" />
        <span>{isDeleting ? 'Deleting...' : 'Delete'}</span>
      </button>
    </div>
  );
}
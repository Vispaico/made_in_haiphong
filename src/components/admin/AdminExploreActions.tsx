// src/components/admin/AdminExploreActions.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2, Edit } from 'lucide-react';
import Link from 'next/link';

export default function AdminExploreActions({ entryId }: { entryId: string }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    const confirmed = window.confirm('Are you sure you want to delete this explore entry?');
    if (!confirmed) return;

    setIsDeleting(true);
    const response = await fetch(`/api/explore/${entryId}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      router.refresh();
    } else {
      alert('Failed to delete entry.');
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex items-center justify-end gap-2">
      <Link 
        href={`/admin/explore/${entryId}/edit`}
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
// src/components/admin/AdminListingActions.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2 } from 'lucide-react';

export default function AdminListingActions({ listingId }: { listingId: string }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    const confirmed = window.confirm('Are you sure you want to delete this listing? This action cannot be undone by the user.');
    if (!confirmed) return;

    setIsDeleting(true);
    const response = await fetch(`/api/listings/${listingId}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      router.refresh();
    } else {
      alert('Failed to delete listing.');
      setIsDeleting(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="flex items-center gap-1 rounded-md bg-red-500/10 px-2 py-1 text-sm text-red-500 transition-colors hover:bg-red-500 hover:text-white disabled:opacity-50"
    >
      <Trash2 className="h-4 w-4" />
      <span>{isDeleting ? 'Deleting...' : 'Delete'}</span>
    </button>
  );
}
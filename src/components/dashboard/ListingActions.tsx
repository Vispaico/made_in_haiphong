// src/components/dashboard/ListingActions.tsx
'use client';

import { useRouter } from 'next/navigation';
import { Trash2, Edit } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

interface ListingActionsProps {
  listingId: string;
}

export default function ListingActions({ listingId }: ListingActionsProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    // A simple confirmation dialog to prevent accidental deletion
    const confirmed = window.confirm('Are you sure you want to delete this listing? This action cannot be undone.');
    
    if (!confirmed) {
      return;
    }

    setIsDeleting(true);

    const response = await fetch(`/api/listings/${listingId}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      // Refresh the page to show the updated list of listings
      router.refresh();
    } else {
      alert('Failed to delete listing. Please try again.');
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Link 
        href={`/dashboard/listings/${listingId}/edit`} // The future edit page
        className="flex items-center gap-1 rounded-md bg-secondary px-2 py-1 text-sm text-foreground transition-colors hover:bg-secondary/80"
      >
        <Edit className="h-4 w-4" />
        <span>Edit</span>
      </Link>
      <button
        onClick={handleDelete}
        disabled={isDeleting}
        className="flex items-center gap-1 rounded-md bg-red-500/10 px-2 py-1 text-sm text-red-500 transition-colors hover:bg-red-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
      >
        <Trash2 className="h-4 w-4" />
        <span>{isDeleting ? 'Deleting...' : 'Delete'}</span>
      </button>
    </div>
  );
}
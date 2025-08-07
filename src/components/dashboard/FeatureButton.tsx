// src/components/dashboard/FeatureButton.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Star } from 'lucide-react';

interface FeatureButtonProps {
  listingId: string;
  isFeatured: boolean;
}

export default function FeatureButton({ listingId, isFeatured }: FeatureButtonProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleToggleFeature = async () => {
    setIsLoading(true);

    const response = await fetch(`/api/listings/${listingId}/feature`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isFeatured: !isFeatured }), // Send the opposite of the current status
    });

    if (response.ok) {
      router.refresh(); // Refresh to show the new status
    } else {
      alert('Failed to update feature status. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggleFeature}
      disabled={isLoading}
      className={`flex w-full items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-semibold transition-colors disabled:opacity-50
        ${isFeatured 
          ? 'bg-yellow-500/10 text-yellow-600 hover:bg-yellow-500/20'
          : 'bg-secondary text-foreground hover:bg-secondary/80'
        }
      `}
    >
      <Star className={`h-4 w-4 ${isFeatured ? 'fill-current' : ''}`} />
      <span>{isLoading ? 'Updating...' : (isFeatured ? 'Featured' : 'Feature Listing')}</span>
    </button>
  );
}
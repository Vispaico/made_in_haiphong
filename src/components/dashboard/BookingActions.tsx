// src/components/dashboard/BookingActions.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { BookingStatus } from '@prisma/client';

interface BookingActionsProps {
  bookingId: string;
}

export default function BookingActions({ bookingId }: BookingActionsProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdateStatus = async (status: BookingStatus) => {
    setIsLoading(true);

    const response = await fetch(`/api/bookings/${bookingId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });

    if (response.ok) {
      router.refresh(); // Refresh the page to show the updated status
    } else {
      alert(`Failed to ${status.toLowerCase()} booking. Please try again.`);
      setIsLoading(false);
    }
    // We don't setIsloading(false) on success because the page will be refreshing
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => handleUpdateStatus(BookingStatus.CONFIRMED)}
        disabled={isLoading}
        className="rounded-md bg-green-500/10 px-3 py-1 text-sm font-semibold text-green-700 transition-colors hover:bg-green-500 hover:text-white disabled:opacity-50"
      >
        {isLoading ? '...' : 'Approve'}
      </button>
      <button
        onClick={() => handleUpdateStatus(BookingStatus.CANCELLED)}
        disabled={isLoading}
        className="rounded-md bg-red-500/10 px-3 py-1 text-sm font-semibold text-red-500 transition-colors hover:bg-red-500 hover:text-white disabled:opacity-50"
      >
        {isLoading ? '...' : 'Deny'}
      </button>
    </div>
  );
}
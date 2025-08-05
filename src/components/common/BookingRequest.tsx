// src/components/common/BookingRequest.tsx
'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { DayPicker, type DateRange } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
// THE FIX: The unused 'format' import has been removed.
import { differenceInDays } from 'date-fns';

interface BookingRequestProps {
  listingId: string;
  pricePerNight: number;
}

export default function BookingRequest({ listingId, pricePerNight }: BookingRequestProps) {
  const { status } = useSession();
  const router = useRouter();
  
  const [range, setRange] = useState<DateRange | undefined>();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleDateSelect = (selectedRange: DateRange | undefined) => {
    setRange(selectedRange);
  };

  const nights = range?.from && range?.to ? differenceInDays(range.to, range.from) : 0;
  const totalCost = nights * pricePerNight;

  const handleSubmit = async () => {
    if (status !== 'authenticated') {
      router.push('/login');
      return;
    }
    if (!range?.from || !range?.to) {
      setError('Please select a start and end date.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const response = await fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        listingId,
        startDate: range.from,
        endDate: range.to,
      }),
    });

    if (response.ok) {
      router.push('/dashboard/bookings?status=success');
    } else {
      const errorData = await response.text();
      setError(errorData || 'Failed to submit booking request. Please try again.');
    }
    setIsSubmitting(false);
  };

  return (
    <div className="space-y-4">
      <DayPicker
        mode="range"
        selected={range}
        onSelect={handleDateSelect}
        numberOfMonths={1}
        disabled={{ before: new Date() }}
        className="border border-secondary rounded-lg bg-background"
        classNames={{
          day_selected: 'bg-primary text-white hover:bg-primary/90 focus:bg-primary/90',
          day_today: 'text-accent',
        }}
      />
      {nights > 0 && (
        <div className="p-4 rounded-lg bg-secondary space-y-2">
          <div className="flex justify-between">
            <p>{new Intl.NumberFormat('vi-VN').format(pricePerNight)} VND x {nights} nights</p>
            <p>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalCost)}</p>
          </div>
          <div className="font-bold text-lg flex justify-between">
            <p>Total</p>
            <p>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalCost)}</p>
          </div>
        </div>
      )}
      
      {error && <p className="text-sm text-red-500">{error}</p>}

      <button
        onClick={handleSubmit}
        disabled={isSubmitting || nights <= 0}
        className="w-full rounded-lg bg-accent py-3 font-semibold text-white transition-colors hover:bg-accent/90 disabled:cursor-not-allowed disabled:bg-accent/50"
      >
        {isSubmitting ? 'Submitting...' : 'Request to Book'}
      </button>
    </div>
  );
}
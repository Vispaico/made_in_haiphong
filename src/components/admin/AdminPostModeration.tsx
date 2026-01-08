'use client';

import { useTransition, useState } from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

type Props = {
  postId: string;
  currentStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
};

export default function AdminPostModeration({ postId, currentStatus }: Props) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const updateStatus = (status: 'APPROVED' | 'REJECTED') => {
    startTransition(async () => {
      setError(null);
      const response = await fetch(`/api/admin/posts/${postId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        setError('Failed to update post status');
        return;
      }
      router.refresh();
    });
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        type="button"
        onClick={() => updateStatus('APPROVED')}
        disabled={isPending || currentStatus === 'APPROVED'}
        className="inline-flex items-center gap-1 rounded-lg bg-emerald-500/10 px-4 py-2 text-sm font-semibold text-emerald-600 transition-colors hover:bg-emerald-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
      >
        <CheckCircle2 className="h-4 w-4" /> Approve
      </button>
      <button
        type="button"
        onClick={() => updateStatus('REJECTED')}
        disabled={isPending || currentStatus === 'REJECTED'}
        className="inline-flex items-center gap-1 rounded-lg bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-600 transition-colors hover:bg-red-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
      >
        <XCircle className="h-4 w-4" /> Reject
      </button>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}

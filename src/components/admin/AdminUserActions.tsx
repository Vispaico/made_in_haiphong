// src/components/admin/AdminUserActions.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, SubscriptionStatus } from '@prisma/client';

// The component now accepts the full user object to get the subscription status
interface AdminUserActionsProps {
  user: Pick<User, 'id' | 'isAdmin' | 'subscriptionStatus'>;
}

export default function AdminUserActions({ user }: AdminUserActionsProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdate = async (updateData: { isAdmin?: boolean; subscriptionStatus?: SubscriptionStatus }) => {
    const action = updateData.isAdmin !== undefined 
      ? (updateData.isAdmin ? 'grant admin to' : 'revoke admin from') 
      : (updateData.subscriptionStatus === 'PREMIUM' ? 'upgrade' : 'downgrade');
    
    const confirmed = window.confirm(`Are you sure you want to ${action} this user?`);
    if (!confirmed) return;

    setIsLoading(true);

    const response = await fetch(`/api/admin/users/${user.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updateData),
    });

    if (response.ok) {
      router.refresh();
    } else {
      alert(`Failed to ${action} user. Please try again.`);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      {/* Admin Role Toggle */}
      {user.isAdmin ? (
        <button onClick={() => handleUpdate({ isAdmin: false })} disabled={isLoading} className="rounded-md bg-red-500/10 px-3 py-1 text-sm font-semibold text-red-500 hover:bg-red-500 hover:text-white disabled:opacity-50">
          Revoke Admin
        </button>
      ) : (
        <button onClick={() => handleUpdate({ isAdmin: true })} disabled={isLoading} className="rounded-md bg-yellow-500/10 px-3 py-1 text-sm font-semibold text-yellow-600 hover:bg-yellow-500 hover:text-white disabled:opacity-50">
          Grant Admin
        </button>
      )}

      {/* Subscription Status Toggle */}
      {user.subscriptionStatus === 'PREMIUM' ? (
        <button onClick={() => handleUpdate({ subscriptionStatus: SubscriptionStatus.FREE })} disabled={isLoading} className="rounded-md bg-secondary px-3 py-1 text-sm font-semibold text-foreground hover:bg-secondary/80 disabled:opacity-50">
          Downgrade
        </button>
      ) : (
        <button onClick={() => handleUpdate({ subscriptionStatus: SubscriptionStatus.PREMIUM })} disabled={isLoading} className="rounded-md bg-primary/10 px-3 py-1 text-sm font-semibold text-primary hover:bg-primary hover:text-white disabled:opacity-50">
          Upgrade
        </button>
      )}
    </div>
  );
}
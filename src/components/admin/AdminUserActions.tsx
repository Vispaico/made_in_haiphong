// src/components/admin/AdminUserActions.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { User } from '@prisma/client'; // Import User type

interface AdminUserActionsProps {
  user: Pick<User, 'id' | 'isAdmin'>; // We only need these fields from the user
}

export default function AdminUserActions({ user }: AdminUserActionsProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdateRole = async (newIsAdminStatus: boolean) => {
    // Confirmation dialog
    const action = newIsAdminStatus ? 'grant admin to' : 'revoke admin from';
    const confirmed = window.confirm(`Are you sure you want to ${action} ${user.id}?`);
    if (!confirmed) return;

    setIsLoading(true);

    const response = await fetch(`/api/admin/users/${user.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isAdmin: newIsAdminStatus }),
    });

    if (response.ok) {
      router.refresh(); // Refresh the page to show the updated role
    } else {
      alert(`Failed to ${action} user. Please try again.`);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      {user.isAdmin ? (
        <button
          onClick={() => handleUpdateRole(false)}
          disabled={isLoading}
          className="rounded-md bg-red-500/10 px-3 py-1 text-sm font-semibold text-red-500 transition-colors hover:bg-red-500 hover:text-white disabled:opacity-50"
        >
          {isLoading ? '...' : 'Revoke Admin'}
        </button>
      ) : (
        <button
          onClick={() => handleUpdateRole(true)}
          disabled={isLoading}
          className="rounded-md bg-green-500/10 px-3 py-1 text-sm font-semibold text-green-700 transition-colors hover:bg-green-500 hover:text-white disabled:opacity-50"
        >
          {isLoading ? '...' : 'Grant Admin'}
        </button>
      )}
    </div>
  );
}
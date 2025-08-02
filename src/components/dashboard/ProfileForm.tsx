// src/components/dashboard/ProfileForm.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { User } from '@prisma/client'; // Import the User type from Prisma

// This component receives the user object as a prop
export default function ProfileForm({ user }: { user: User }) {
  const router = useRouter();
  const [name, setName] = useState(user.name || '');
  const [image, setImage] = useState(user.image || '');
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(null);

    const response = await fetch('/api/profile', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, image }),
    });

    if (response.ok) {
      setStatus({ type: 'success', message: 'Profile updated successfully!' });
      // Refresh the page and session data
      router.refresh(); 
    } else {
      setStatus({ type: 'error', message: 'Failed to update profile.' });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 rounded-xl border border-secondary bg-background p-8">
      {/* Form Status Message */}
      {status && (
        <div className={`rounded-md p-3 text-sm ${status.type === 'success' ? 'bg-green-500/10 text-green-700' : 'bg-red-500/10 text-red-500'}`}>
          {status.message}
        </div>
      )}

      {/* Name Field */}
      <div className="space-y-2">
        <label htmlFor="name" className="text-sm font-medium">Display Name</label>
        <p className="text-xs text-foreground/60">This is the name that will be shown to other users.</p>
        <input 
          id="name" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          className="w-full rounded-md border border-secondary bg-secondary/50 p-2.5 text-foreground focus:ring-2 focus:ring-primary"
          required
        />
      </div>

      {/* Image URL Field */}
      <div className="space-y-2">
        <label htmlFor="image" className="text-sm font-medium">Profile Picture URL</label>
        <p className="text-xs text-foreground/60">For now, please provide a URL to an image.</p>
        <input 
          id="image" 
          value={image} 
          onChange={(e) => setImage(e.target.value)} 
          className="w-full rounded-md border border-secondary bg-secondary/50 p-2.5 text-foreground focus:ring-2 focus:ring-primary"
        />
      </div>

      <div className="flex justify-end">
        <button type="submit" className="rounded-lg bg-primary px-6 py-2.5 font-bold text-white transition-colors hover:bg-primary/90">
          Save Changes
        </button>
      </div>
    </form>
  );
}
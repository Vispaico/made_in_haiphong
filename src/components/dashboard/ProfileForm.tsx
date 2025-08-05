// src/components/dashboard/ProfileForm.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { User } from '@prisma/client';
import ImageUploader from '@/components/common/ImageUploader'; // Import the uploader
import Image from 'next/image'; // Import the Next.js Image component

export default function ProfileForm({ user }: { user: User }) {
  const router = useRouter();
  const [name, setName] = useState(user.name || '');
  // THE FIX: The 'image' state now holds a single URL, consistent with the uploader
  const [image, setImage] = useState<string | null>(user.image);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus(null);

    // THE FIX: The API endpoint was incorrect in your version. It should be `/api/user/profile`.
    const response = await fetch('/api/user/profile', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, image }),
    });

    if (response.ok) {
      setStatus({ type: 'success', message: 'Profile updated successfully!' });
      router.refresh(); 
    } else {
      setStatus({ type: 'error', message: 'Failed to update profile.' });
    }
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 rounded-xl border border-secondary bg-background p-8 max-w-xl">
      {status && (
        <div className={`rounded-md p-3 text-sm ${status.type === 'success' ? 'bg-green-500/10 text-green-700' : 'bg-red-500/10 text-red-500'}`}>
          {status.message}
        </div>
      )}

      <div className="space-y-2">
        <label className="text-sm font-medium">Profile Picture</label>
        <div className="flex items-center gap-4">
          <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-full">
            <Image 
              src={image || '/images/avatar-default.png'} 
              alt="Current profile picture" 
              fill 
              className="object-cover"
            />
          </div>
          <div className="w-full">
            {/* THE FIX: The text input is replaced by our reusable ImageUploader */}
            <ImageUploader
              onUploadComplete={(urls) => setImage(urls[0])} // We take the first (and only) image URL
              onUploadRemove={() => setImage(null)}
              initialImageUrls={image ? [image] : []}
            />
          </div>
        </div>
      </div>

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
      
      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium">Email</label>
        <input
          id="email"
          value={user.email || ''}
          type="email"
          disabled
          className="w-full cursor-not-allowed rounded-md border border-secondary bg-secondary/50 p-2.5 text-foreground/70"
        />
      </div>

      <div className="flex justify-end">
        <button type="submit" disabled={isSubmitting} className="rounded-lg bg-primary px-6 py-2.5 font-bold text-white transition-colors hover:bg-primary/90 disabled:opacity-50">
          {isSubmitting ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </form>
  );
}
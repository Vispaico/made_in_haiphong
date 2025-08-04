// src/components/community/CreatePostForm.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ImageUploader from '@/components/common/ImageUploader';

export default function CreatePostForm() {
  const [content, setContent] = useState('');
  // THE FIX: State now holds an array of URLs.
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsSubmitting(true);
    setError(null);

    const response = await fetch('/api/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      // THE FIX: Send the array of URLs to the API.
      body: JSON.stringify({ content, imageUrls }),
    });

    if (response.ok) {
      setContent('');
      setImageUrls([]); // Clear the image URLs array
      router.refresh();
    } else {
      setError('Failed to create post. Please try again.');
    }
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="mb-12 rounded-xl border border-secondary bg-background p-6 shadow-sm">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full rounded-md border border-secondary bg-secondary p-2.5 text-foreground placeholder-foreground/50 focus:ring-2 focus:ring-primary"
        rows={3}
        placeholder="What's on your mind?"
        required
      />
      
      <div className="mt-4">
        {/* THE FIX: The props now handle arrays of URLs. */}
        <ImageUploader 
          onUploadComplete={(urls) => setImageUrls(urls)}
          onUploadRemove={(removedUrl) => {
            setImageUrls(currentUrls => currentUrls.filter(url => url !== removedUrl));
          }}
        />
      </div>

      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
      <div className="mt-4 flex justify-end">
        <button 
          type="submit" 
          disabled={!content.trim() || isSubmitting}
          className="rounded-lg bg-accent px-6 py-2.5 font-bold text-white shadow-md transition-colors hover:bg-accent/90 disabled:cursor-not-allowed disabled:bg-accent/50"
        >
          {isSubmitting ? 'Posting...' : 'Post'}
        </button>
      </div>
    </form>
  );
}
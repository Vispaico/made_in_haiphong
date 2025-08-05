// src/components/community/EditPostForm.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Post } from '@prisma/client';
import ImageUploader from '@/components/common/ImageUploader';

interface EditPostFormProps {
  post: Post;
}

export default function EditPostForm({ post }: EditPostFormProps) {
  const router = useRouter();
  // Pre-fill the form state with the existing post data
  const [content, setContent] = useState(post.content);
  const [imageUrls, setImageUrls] = useState<string[]>(post.imageUrls);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const response = await fetch(`/api/posts/${post.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content, imageUrls }),
    });

    if (response.ok) {
      // Redirect back to the main community feed on success
      router.push('/community');
      router.refresh(); // Important to ensure the feed shows updated data
    } else {
      setError('Failed to update post. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-8 rounded-xl border border-secondary bg-background p-6 shadow-sm">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full rounded-md border border-secondary bg-secondary p-2.5 text-foreground placeholder-foreground/50 focus:ring-2 focus:ring-primary"
        rows={5}
        required
      />
      
      <div className="mt-4">
        <ImageUploader 
          initialImageUrls={imageUrls}
          onUploadComplete={(urls) => setImageUrls(urls)}
          onUploadRemove={(removedUrl) => {
            setImageUrls(currentUrls => currentUrls.filter(url => url !== removedUrl));
          }}
        />
      </div>

      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
      
      <div className="mt-4 flex justify-end gap-4">
        <button type="button" onClick={() => router.back()} className="rounded-lg bg-secondary px-6 py-2.5 font-bold text-foreground transition-colors hover:bg-secondary/80">
          Cancel
        </button>
        <button 
          type="submit" 
          disabled={!content.trim() || isSubmitting}
          className="rounded-lg bg-accent px-6 py-2.5 font-bold text-white shadow-md transition-colors hover:bg-accent/90 disabled:cursor-not-allowed disabled:bg-accent/50"
        >
          {isSubmitting ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </form>
  );
}
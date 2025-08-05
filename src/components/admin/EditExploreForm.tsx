// src/components/admin/EditExploreForm.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ExploreEntry } from '@prisma/client';
import ImageUploader from '@/components/common/ImageUploader';

interface EditExploreFormProps {
  entry: ExploreEntry;
}

export default function EditExploreForm({ entry }: EditExploreFormProps) {
  const router = useRouter();
  // Pre-fill the form state with the existing data
  const [title, setTitle] = useState(entry.title);
  const [description, setDescription] = useState(entry.description);
  const [body, setBody] = useState(entry.body);
  const [category, setCategory] = useState(entry.category);
  const [imageUrls, setImageUrls] = useState<string[]>(entry.imageUrls);
  const [address, setAddress] = useState(entry.address || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const response = await fetch(`/api/explore/${entry.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description, body, category, imageUrls, address }),
    });

    if (response.ok) {
      router.push('/admin/explore');
      router.refresh();
    } else {
      setError('Failed to update entry. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-8 max-w-2xl space-y-6">
      <div className="space-y-2">
        <label htmlFor="category" className="text-sm font-medium">Category</label>
        <select id="category" value={category} onChange={(e) => setCategory(e.target.value)} className="w-full rounded-md border border-secondary bg-background/50 p-2.5">
          <option value="food-and-drink">Food & Drink</option>
          <option value="sights-and-culture">Sights & Culture</option>
          <option value="city-essentials">City Essentials</option>
        </select>
      </div>
      <div className="space-y-2">
        <label htmlFor="title" className="text-sm font-medium">Title</label>
        <input id="title" value={title} onChange={(e) => setTitle(e.target.value)} type="text" required className="w-full rounded-md border border-secondary bg-background/50 p-2.5" />
      </div>
      <div className="space-y-2">
        <label htmlFor="address" className="text-sm font-medium">Address (Optional)</label>
        <input id="address" value={address} onChange={(e) => setAddress(e.target.value)} type="text" className="w-full rounded-md border border-secondary bg-background/50 p-2.5" />
      </div>
      <div className="space-y-2">
        <label htmlFor="description" className="text-sm font-medium">Short Description</label>
        <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} required rows={3} className="w-full rounded-md border border-secondary bg-background/50 p-2.5" />
      </div>
      <div className="space-y-2">
        <label htmlFor="body" className="text-sm font-medium">Main Content</label>
        <textarea id="body" value={body} onChange={(e) => setBody(e.target.value)} required rows={10} className="w-full rounded-md border border-secondary bg-background/50 p-2.5" />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Images</label>
        <ImageUploader 
          initialImageUrls={imageUrls}
          onUploadComplete={(urls) => setImageUrls(urls)}
          onUploadRemove={(url) => setImageUrls(urls => urls.filter(u => u !== url))}
        />
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
      <div className="flex justify-end gap-4">
        <button type="button" onClick={() => router.back()} className="rounded-lg bg-secondary px-8 py-3 font-bold text-foreground transition-colors hover:bg-secondary/80">
          Cancel
        </button>
        <button type="submit" disabled={isSubmitting} className="rounded-lg bg-accent px-8 py-3 font-bold text-white shadow-md disabled:bg-accent/50">
          {isSubmitting ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </form>
  );
}
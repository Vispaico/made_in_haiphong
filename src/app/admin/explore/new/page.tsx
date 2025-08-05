// src/app/admin/explore/new/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ImageUploader from '@/components/common/ImageUploader';

export default function NewExploreEntryPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [body, setBody] = useState(''); // For the full content
  const [category, setCategory] = useState('food-and-drink');
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [address, setAddress] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const response = await fetch('/api/explore', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description, body, category, imageUrls, address }),
    });

    if (response.ok) {
      router.push('/admin/explore');
      router.refresh();
    } else {
      setError('Failed to create entry. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h1 className="font-heading text-3xl font-bold text-foreground">Create New Explore Entry</h1>
      <p className="mt-2 text-lg text-foreground/70">Fill out the details for your new curated content.</p>

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
          <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} required rows={3} className="w-full rounded-md border border-secondary bg-background/50 p-2.5" placeholder="A short summary for the card view."/>
        </div>
        <div className="space-y-2">
          <label htmlFor="body" className="text-sm font-medium">Main Content</label>
          <textarea id="body" value={body} onChange={(e) => setBody(e.target.value)} required rows={10} className="w-full rounded-md border border-secondary bg-background/50 p-2.5" placeholder="The full article or content for the detail page."/>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Images</label>
          <ImageUploader 
            onUploadComplete={(urls) => setImageUrls(urls)}
            onUploadRemove={(url) => setImageUrls(urls => urls.filter(u => u !== url))}
          />
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
        <div className="flex justify-end">
          <button type="submit" disabled={isSubmitting} className="rounded-lg bg-accent px-8 py-3 font-bold text-white shadow-md disabled:bg-accent/50">
            {isSubmitting ? 'Creating...' : 'Create Entry'}
          </button>
        </div>
      </form>
    </div>
  );
}
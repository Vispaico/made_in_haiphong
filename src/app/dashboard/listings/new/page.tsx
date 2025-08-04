// src/app/dashboard/listings/new/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ImageUploader from '@/components/common/ImageUploader';

export default function NewListingPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('rentals');
  // THE FIX: State now holds an array of URLs.
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const response = await fetch('/api/listings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      // THE FIX: Send the array of URLs to the API.
      body: JSON.stringify({ title, description, category, price, imageUrls }),
    });

    if (response.ok) {
      router.push('/dashboard/listings');
      router.refresh();
    } else {
      setError('Failed to create listing. Please check your inputs and try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h1 className="font-heading text-3xl font-bold text-foreground">Create a New Listing</h1>
      <p className="mt-2 text-lg text-foreground/70">Fill out the details below. You can add multiple images.</p>

      <form onSubmit={handleSubmit} className="mt-8 max-w-2xl space-y-6">
        <div className="space-y-2">
          <label htmlFor="category" className="text-sm font-medium">Category</label>
          <select id="category" value={category} onChange={(e) => setCategory(e.target.value)} className="w-full rounded-md border border-secondary bg-background/50 p-2.5 text-foreground focus:ring-2 focus:ring-primary">
            <option value="rentals">Rentals</option>
            <option value="for-sale">For Sale</option>
            <option value="services">Services</option>
            <option value="accommodation">Accommodation</option>
          </select>
        </div>
        <div className="space-y-2">
          <label htmlFor="title" className="text-sm font-medium">Listing Title</label>
          <input id="title" value={title} onChange={(e) => setTitle(e.target.value)} type="text" required className="w-full rounded-md border border-secondary bg-background/50 p-2.5 text-foreground focus:ring-2 focus:ring-primary" placeholder="e.g., Honda Wave Motorbike for Rent"/>
        </div>
        <div className="space-y-2">
          <label htmlFor="description" className="text-sm font-medium">Description</label>
          <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} required rows={5} className="w-full rounded-md border border-secondary bg-background/50 p-2.5 text-foreground focus:ring-2 focus:ring-primary" placeholder="Describe your item or service in detail."/>
        </div>
        <div className="space-y-2">
          <label htmlFor="price" className="text-sm font-medium">Price (in VND)</label>
          <input id="price" value={price} onChange={(e) => setPrice(e.target.value)} type="number" required className="w-full rounded-md border border-secondary bg-background/50 p-2.5 text-foreground focus:ring-2 focus:ring-primary" placeholder="e.g., 150000"/>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Listing Images</label>
          {/* THE FIX: The props now handle arrays of URLs. */}
          <ImageUploader 
            onUploadComplete={(urls) => setImageUrls(urls)}
            onUploadRemove={(removedUrl) => {
              setImageUrls(currentUrls => currentUrls.filter(url => url !== removedUrl));
            }}
          />
        </div>

        {error && <p className="rounded-md bg-red-500/10 p-3 text-sm text-red-500">{error}</p>}

        <div className="flex justify-end">
          <button type="submit" disabled={isSubmitting} className="rounded-lg bg-accent px-8 py-3 font-bold text-white shadow-md transition-colors hover:bg-accent/90 disabled:cursor-not-allowed disabled:bg-accent/50">
            {isSubmitting ? 'Creating...' : 'Create Listing'}
          </button>
        </div>
      </form>
    </div>
  );
}
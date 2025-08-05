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
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  // THE FIX: Add state for the new accommodation fields
  const [maxGuests, setMaxGuests] = useState('');
  const [bedrooms, setBedrooms] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const response = await fetch('/api/listings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      // THE FIX: Send the new fields to the API
      body: JSON.stringify({ title, description, category, price, imageUrls, maxGuests, bedrooms }),
    });

    if (response.ok) {
      router.push('/dashboard/listings');
      router.refresh();
    } else {
      setError('Failed to create listing. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h1 className="font-heading text-3xl font-bold text-foreground">Create a New Listing</h1>
      <p className="mt-2 text-lg text-foreground/70">Fill out the details below.</p>
      <form onSubmit={handleSubmit} className="mt-8 max-w-2xl space-y-6">
        <div className="space-y-2">
          <label htmlFor="category" className="text-sm font-medium">Category</label>
          <select id="category" value={category} onChange={(e) => setCategory(e.target.value)} className="w-full rounded-md border border-secondary bg-background/50 p-2.5 text-foreground focus:ring-2 focus:ring-primary">
            <option value="rentals">Marketplace: Rentals</option>
            <option value="for-sale">Marketplace: For Sale</option>
            <option value="services">Marketplace: Services</option>
            <option value="accommodation">Stay: Accommodation</option>
          </select>
        </div>

        {/* THE FIX: Conditionally render these fields only if the category is 'accommodation' */}
        {category === 'accommodation' && (
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="maxGuests" className="text-sm font-medium">Max Guests</label>
              <input id="maxGuests" value={maxGuests} onChange={(e) => setMaxGuests(e.target.value)} type="number" className="w-full rounded-md border border-secondary bg-background/50 p-2.5 text-foreground focus:ring-2 focus:ring-primary" placeholder="e.g., 4"/>
            </div>
            <div className="space-y-2">
              <label htmlFor="bedrooms" className="text-sm font-medium">Bedrooms</label>
              <input id="bedrooms" value={bedrooms} onChange={(e) => setBedrooms(e.target.value)} type="number" className="w-full rounded-md border border-secondary bg-background/50 p-2.5 text-foreground focus:ring-2 focus:ring-primary" placeholder="e.g., 2"/>
            </div>
          </div>
        )}

        <div className="space-y-2">
          <label htmlFor="title" className="text-sm font-medium">Title</label>
          <input id="title" value={title} onChange={(e) => setTitle(e.target.value)} type="text" required className="w-full rounded-md border border-secondary bg-background/50 p-2.5 text-foreground" />
        </div>
        <div className="space-y-2">
          <label htmlFor="description" className="text-sm font-medium">Description</label>
          <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} required rows={5} className="w-full rounded-md border border-secondary bg-background/50 p-2.5 text-foreground" />
        </div>
        <div className="space-y-2">
          <label htmlFor="price" className="text-sm font-medium">Price (VND){category === 'accommodation' && ' / night'}</label>
          <input id="price" value={price} onChange={(e) => setPrice(e.target.value)} type="number" required className="w-full rounded-md border border-secondary bg-background/50 p-2.5 text-foreground" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Images</label>
          <ImageUploader onUploadComplete={(urls) => setImageUrls(urls)} onUploadRemove={(url) => setImageUrls(urls => urls.filter(u => u !== url))} />
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
        <div className="flex justify-end">
          <button type="submit" disabled={isSubmitting} className="rounded-lg bg-accent px-8 py-3 font-bold text-white shadow-md disabled:bg-accent/50">
            {isSubmitting ? 'Creating...' : 'Create Listing'}
          </button>
        </div>
      </form>
    </div>
  );
}
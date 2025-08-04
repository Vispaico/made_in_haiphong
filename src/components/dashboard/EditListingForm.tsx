// src/components/dashboard/EditListingForm.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Listing } from '@prisma/client';
import ImageUploader from '@/components/common/ImageUploader';

interface EditListingFormProps {
  listing: Listing;
}

export default function EditListingForm({ listing }: EditListingFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState(listing.title);
  const [description, setDescription] = useState(listing.description);
  const [price, setPrice] = useState(listing.price.toString());
  const [category, setCategory] = useState(listing.category);
  const [imageUrls, setImageUrls] = useState<string[]>(listing.imageUrls);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const response = await fetch(`/api/listings/${listing.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description, category, price, imageUrls }),
    });

    if (response.ok) {
      router.push('/dashboard/listings');
      router.refresh();
    } else {
      setError('Failed to update listing. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
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
        <input id="title" value={title} onChange={(e) => setTitle(e.target.value)} type="text" required className="w-full rounded-md border border-secondary bg-background/50 p-2.5 text-foreground focus:ring-2 focus:ring-primary" />
      </div>

      <div className="space-y-2">
        <label htmlFor="description" className="text-sm font-medium">Description</label>
        <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} required rows={5} className="w-full rounded-md border border-secondary bg-background/50 p-2.5 text-foreground focus:ring-2 focus:ring-primary" />
      </div>

      <div className="space-y-2">
        <label htmlFor="price" className="text-sm font-medium">Price (in VND)</label>
        <input id="price" value={price} onChange={(e) => setPrice(e.target.value)} type="number" required className="w-full rounded-md border border-secondary bg-background/50 p-2.5 text-foreground focus:ring-2 focus:ring-primary" />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Listing Images</label>
        {/* THE FIX IS HERE: We pass the existing `imageUrls` to the new prop. */}
        {/* The onUploadComplete logic is also simplified to just set the new, full array. */}
        <ImageUploader 
          initialImageUrls={imageUrls}
          onUploadComplete={(urls) => setImageUrls(urls)}
          onUploadRemove={(removedUrl) => {
            setImageUrls(currentUrls => currentUrls.filter(url => url !== removedUrl));
          }}
        />
      </div>

      {error && <p className="rounded-md bg-red-500/10 p-3 text-sm text-red-500">{error}</p>}

      <div className="flex justify-end gap-4">
        <button type="button" onClick={() => router.back()} className="rounded-lg bg-secondary px-8 py-3 font-bold text-foreground transition-colors hover:bg-secondary/80">
          Cancel
        </button>
        <button type="submit" disabled={isSubmitting} className="rounded-lg bg-accent px-8 py-3 font-bold text-white shadow-md transition-colors hover:bg-accent/90 disabled:cursor-not-allowed disabled:bg-accent/50">
          {isSubmitting ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </form>
  );
}
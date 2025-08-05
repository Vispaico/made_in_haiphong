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
  // THE FIX: Add state for the new fields, pre-filled with existing data or empty strings
  const [maxGuests, setMaxGuests] = useState(listing.maxGuests?.toString() || '');
  const [bedrooms, setBedrooms] = useState(listing.bedrooms?.toString() || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const response = await fetch(`/api/listings/${listing.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      // THE FIX: Send the new fields to the API
      body: JSON.stringify({ title, description, category, price, imageUrls, maxGuests, bedrooms }),
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
        <select id="category" value={category} onChange={(e) => setCategory(e.target.value)} className="w-full rounded-md border border-secondary bg-background/50 p-2.5 text-foreground">
          <option value="rentals">Marketplace: Rentals</option>
          <option value="for-sale">Marketplace: For Sale</option>
          <option value="services">Marketplace: Services</option>
          <option value="accommodation">Stay: Accommodation</option>
        </select>
      </div>

      {/* THE FIX: Conditionally render the accommodation fields */}
      {category === 'accommodation' && (
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="maxGuests" className="text-sm font-medium">Max Guests</label>
            <input id="maxGuests" value={maxGuests} onChange={(e) => setMaxGuests(e.target.value)} type="number" className="w-full rounded-md border border-secondary bg-background/50 p-2.5 text-foreground"/>
          </div>
          <div className="space-y-2">
            <label htmlFor="bedrooms" className="text-sm font-medium">Bedrooms</label>
            <input id="bedrooms" value={bedrooms} onChange={(e) => setBedrooms(e.target.value)} type="number" className="w-full rounded-md border border-secondary bg-background/50 p-2.5 text-foreground"/>
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
        <ImageUploader initialImageUrls={imageUrls} onUploadComplete={(urls) => setImageUrls(urls)} onUploadRemove={(url) => setImageUrls(urls => urls.filter(u => u !== url))} />
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
      <div className="flex justify-end gap-4">
        <button type="button" onClick={() => router.back()} className="rounded-lg bg-secondary px-8 py-3 font-bold text-foreground hover:bg-secondary/80">Cancel</button>
        <button type="submit" disabled={isSubmitting} className="rounded-lg bg-accent px-8 py-3 font-bold text-white shadow-md disabled:bg-accent/50">
          {isSubmitting ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </form>
  );
}
// src/app/dashboard/listings/new/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ImageUploader from '@/components/common/ImageUploader';
import { Category } from '@prisma/client';
import LocationPicker from '@/components/common/LocationPicker'; // Import the new component

export default function NewListingPage() {
  const router = useRouter();
  // ... (all existing state variables remain the same)
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [maxGuests, setMaxGuests] = useState('');
  const [bedrooms, setBedrooms] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [marketplaceCategories, setMarketplaceCategories] = useState<Category[]>([]);
  
  // THE FIX: Add state for latitude and longitude
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);

  useEffect(() => {
    // ... (existing useEffect remains the same)
    const fetchCategories = async () => {
      const response = await fetch('/api/admin/categories');
      if (response.ok) {
        const allCategories: Category[] = await response.json();
        const filtered = allCategories.filter(cat => cat.type === 'MARKETPLACE');
        setMarketplaceCategories(filtered);
        if (filtered.length > 0) setCategory(filtered[0].slug);
      }
    };
    fetchCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const response = await fetch('/api/listings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      // THE FIX: Send the new location fields to the API
      body: JSON.stringify({ title, description, category, price, imageUrls, maxGuests, bedrooms, latitude, longitude }),
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
        {/* ... (category, accommodation fields, title, description, price, and images sections remain the same) ... */}
        
        {/* THE FIX: Add the new LocationPicker component to the form */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Location (Optional)</label>
          <p className="text-xs text-foreground/60">Click on the map to place a pin for your listing&apos;s location.</p>
          <LocationPicker 
            onLocationSelect={(lat, lng) => {
              setLatitude(lat);
              setLongitude(lng);
            }}
          />
        </div>

        {/* --- All other form fields remain below --- */}
        <div className="space-y-2">
          <label htmlFor="category" className="text-sm font-medium">Category</label>
          <select id="category" value={category} onChange={(e) => setCategory(e.target.value)} className="w-full rounded-md border border-secondary bg-background/50 p-2.5">
            {marketplaceCategories.map(cat => ( <option key={cat.id} value={cat.slug}>{cat.name}</option>))}
          </select>
        </div>
        {category === 'accommodation' && (
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="maxGuests" className="text-sm font-medium">Max Guests</label>
              <input id="maxGuests" value={maxGuests} onChange={(e) => setMaxGuests(e.target.value)} type="number" className="w-full rounded-md border border-secondary bg-background/50 p-2.5"/>
            </div>
            <div className="space-y-2">
              <label htmlFor="bedrooms" className="text-sm font-medium">Bedrooms</label>
              <input id="bedrooms" value={bedrooms} onChange={(e) => setBedrooms(e.target.value)} type="number" className="w-full rounded-md border border-secondary bg-background/50 p-2.5"/>
            </div>
          </div>
        )}
        <div className="space-y-2">
          <label htmlFor="title" className="text-sm font-medium">Title</label>
          <input id="title" value={title} onChange={(e) => setTitle(e.target.value)} type="text" required className="w-full rounded-md border border-secondary bg-background/50 p-2.5"/>
        </div>
        <div className="space-y-2">
          <label htmlFor="description" className="text-sm font-medium">Description</label>
          <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} required rows={5} className="w-full rounded-md border border-secondary bg-background/50 p-2.5"/>
        </div>
        <div className="space-y-2">
          <label htmlFor="price" className="text-sm font-medium">Price (VND){category === 'accommodation' && ' / night'}</label>
          <input id="price" value={price} onChange={(e) => setPrice(e.target.value)} type="number" required className="w-full rounded-md border border-secondary bg-background/50 p-2.5"/>
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
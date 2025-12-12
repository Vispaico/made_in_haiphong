// src/components/dashboard/ListingForm.tsx
'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import ImageUploader from '@/components/common/ImageUploader';
import { Category } from '@prisma/client';
import dynamic from 'next/dynamic';
import { ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';

const STEPS = [
  { id: 1, title: 'Category & Details' },
  { id: 2, title: 'Location' },
  { id: 3, title: 'Images & Price' },
  { id: 4, title: 'Review & Submit' },
];

export default function ListingForm() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [maxGuests, setMaxGuests] = useState('');
  const [bedrooms, setBedrooms] = useState('');
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  
  // UI State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [marketplaceCategories, setMarketplaceCategories] = useState<Category[]>([]);

  const LocationPicker = useMemo(() => dynamic(
    () => import('@/components/common/LocationPicker'),
    { ssr: false, loading: () => <div className="h-64 w-full rounded-lg bg-secondary animate-pulse" /> }
  ), []);

  useEffect(() => {
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

  const handleNext = () => setCurrentStep(prev => Math.min(prev + 1, STEPS.length));
  const handleBack = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep !== STEPS.length) return;

    setIsSubmitting(true);
    setError(null);

    const response = await fetch('/api/listings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
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
    <div className="mx-auto max-w-4xl">
      {/* Stepper */}
      <div className="mb-8 flex items-center justify-center space-x-4">
        {STEPS.map(step => (
          <div key={step.id} className="flex items-center">
            <div className={`flex h-8 w-8 items-center justify-center rounded-full ${currentStep >= step.id ? 'bg-primary text-white' : 'bg-secondary text-foreground/50'}`}>
              {currentStep > step.id ? <CheckCircle size={16} /> : step.id}
            </div>
            <span className={`ml-2 font-medium ${currentStep >= step.id ? 'text-foreground' : 'text-foreground/50'}`}>{step.title}</span>
            {step.id < STEPS.length && <div className="ml-4 h-0.5 w-16 bg-secondary" />}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="rounded-xl border border-secondary bg-background p-8 shadow-lg">
        {/* Step 1: Category & Details */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <h2 className="font-heading text-2xl font-bold">Category & Details</h2>
            <div className="space-y-2"><label htmlFor="category" className="text-sm font-medium">Category</label><select id="category" value={category} onChange={(e) => setCategory(e.target.value)} className="w-full rounded-md border border-border bg-secondary p-2.5">{marketplaceCategories.map(cat => ( <option key={cat.id} value={cat.slug}>{cat.name}</option>))}</select></div>
            {category === 'accommodation' && (<div className="grid grid-cols-2 gap-4"><div className="space-y-2"><label htmlFor="maxGuests" className="text-sm font-medium">Max Guests</label><input id="maxGuests" value={maxGuests} onChange={(e) => setMaxGuests(e.target.value)} type="number" className="w-full rounded-md border border-border bg-secondary p-2.5"/></div><div className="space-y-2"><label htmlFor="bedrooms" className="text-sm font-medium">Bedrooms</label><input id="bedrooms" value={bedrooms} onChange={(e) => setBedrooms(e.target.value)} type="number" className="w-full rounded-md border border-border bg-secondary p-2.5"/></div></div>)}
            <div className="space-y-2"><label htmlFor="title" className="text-sm font-medium">Title</label><input id="title" value={title} onChange={(e) => setTitle(e.target.value)} type="text" required className="w-full rounded-md border border-border bg-secondary p-2.5"/></div>
            <div className="space-y-2"><label htmlFor="description" className="text-sm font-medium">Description</label><textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} required rows={5} className="w-full rounded-md border border-border bg-secondary p-2.5"/></div>
          </div>
        )}

        {/* Step 2: Location */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <h2 className="font-heading text-2xl font-bold">Location</h2>
            <p className="text-sm text-foreground/60">Click on the map to place a pin for your listing&apos;s location. This is optional but highly recommended.</p>
            <LocationPicker onLocationSelect={(lat, lng) => { setLatitude(lat); setLongitude(lng); }} />
          </div>
        )}

        {/* Step 3: Images & Price */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <h2 className="font-heading text-2xl font-bold">Images & Price</h2>
            <div className="space-y-2"><label className="text-sm font-medium">Images</label><ImageUploader onUploadComplete={(urls) => setImageUrls(urls)} onUploadRemove={(url) => setImageUrls(urls => urls.filter(u => u !== url))} /></div>
            <div className="space-y-2"><label htmlFor="price" className="text-sm font-medium">Price (VND){category === 'accommodation' && ' / night'}</label><input id="price" value={price} onChange={(e) => setPrice(e.target.value)} type="number" required className="w-full rounded-md border border-border bg-secondary p-2.5"/></div>
          </div>
        )}

        {/* Step 4: Review & Submit */}
        {currentStep === 4 && (
          <div className="space-y-4">
            <h2 className="font-heading text-2xl font-bold">Review & Submit</h2>
            <p>You&rsquo;re about to post the following listing. Please review the details before submitting.</p>
            <div className="rounded-lg bg-secondary p-4 space-y-2">
              <p><strong>Title:</strong> {title}</p>
              <p><strong>Category:</strong> {category}</p>
              <p><strong>Price:</strong> {price} VND</p>
              <p><strong>Images:</strong> {imageUrls.length} uploaded</p>
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>
        )}

        {/* Navigation */}
        <div className="mt-8 flex justify-between">
          <button type="button" onClick={handleBack} disabled={currentStep === 1} className="flex items-center gap-2 rounded-lg bg-secondary px-6 py-3 font-bold text-foreground disabled:opacity-50">
            <ArrowLeft size={16} /> Back
          </button>
          {currentStep < STEPS.length ? (
            <button type="button" onClick={handleNext} className="flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-bold text-white">
              Next <ArrowRight size={16} />
            </button>
          ) : (
            <button type="submit" disabled={isSubmitting} className="rounded-lg bg-accent px-8 py-3 font-bold text-white shadow-md disabled:bg-accent/50">
              {isSubmitting ? 'Submitting...' : 'Submit Listing'}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

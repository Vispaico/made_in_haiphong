// src/app/(main)/marketplace/[category]/page.tsx

import Card from '@/components/ui/Card';
import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { cache } from 'react';

const categoryInfo: { [key: string]: { name: string; description: string } } = {
  'rentals': { name: 'Rentals', description: 'Find the perfect item to rent for your trip or project.' },
  'for-sale': { name: 'For Sale', description: 'Browse new and used goods from sellers across Haiphong.' },
  'services': { name: 'Services', description: 'Hire talented locals for tours, transport, and more.' },
  'accommodation': { name: 'Accommodation', description: 'Find the perfect place to stay during your trip.' },
};

const getListingsByCategory = cache(async (category: string) => {
  const listings = await prisma.listing.findMany({
    where: { category },
    // THE FIX: Order by featured status first, then by creation date.
    orderBy: [
      { isFeatured: 'desc' },
      { createdAt: 'desc' },
    ],
  });
  return listings;
});

type MarketplaceCategoryPageProps = {
  params: Promise<{ category: string }>;
};

export default async function MarketplaceCategoryPage({ params }: MarketplaceCategoryPageProps) {
  const { category: categoryParam } = await params;
  const category = categoryInfo[categoryParam];
  if (!category) notFound();

  const listings = await getListingsByCategory(categoryParam);

  return (
    <div className="bg-background py-16">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-left">
          <p className="font-semibold text-primary">Marketplace</p>
          <h1 className="font-heading text-4xl font-bold text-foreground">{category.name}</h1>
          <p className="mx-auto mt-2 max-w-2xl text-lg text-foreground/80">{category.description}</p>
        </div>
        <div className="mt-16">
          {listings.length > 0 ? (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {listings.map((listing) => (
                <Card
                  key={listing.id}
                  href={`/marketplace/${listing.category}/${listing.id}`}
                  title={listing.title}
                  description={`${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(listing.price)}`}
                  imageUrls={listing.imageUrls}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-lg border-2 border-dashed border-secondary py-12 text-center">
              <h2 className="font-heading text-2xl font-bold text-foreground">No Listings Yet</h2>
              <p className="mt-2 text-foreground/70">There are currently no listings for "{category.name}".</p>
              <Link href="/dashboard/listings/new" className="mt-4 inline-block text-primary hover:underline">
                Be the first to create one!
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
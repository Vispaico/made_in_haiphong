// src/app/(main)/stay/page.tsx

import Card from '@/components/ui/Card';
import prisma from '@/lib/prisma';
import Link from 'next/link';
import { cache } from 'react';

export const revalidate = 60;

const getAccommodations = cache(async () => {
  const accommodations = await prisma.listing.findMany({
    where: { category: 'accommodation' },
    // THE FIX: Order by featured status first, then by creation date.
    orderBy: [
      { isFeatured: 'desc' },
      { createdAt: 'desc' },
    ],
  });
  return accommodations;
});

export default async function StayPage() {
  const accommodations = await getAccommodations();

  return (
    <div className="bg-background py-16">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="font-heading text-4xl font-bold text-foreground">Find Your Place to Stay</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-foreground/80">From luxury villas to cozy apartments, find the perfect accommodation for your trip.</p>
        </div>
        <div className="mt-16">
          {accommodations.length > 0 ? (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {accommodations.map((listing) => (
                <Card
                  key={listing.id}
                  href={`/stay/${listing.id}`}
                  title={listing.title}
                  description={`${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(listing.price)} / night`}
                  imageUrls={listing.imageUrls}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-lg border-2 border-dashed border-secondary py-12 text-center">
              <h2 className="font-heading text-2xl font-bold text-foreground">No Accommodations Available Yet</h2>
              <p className="mt-2 text-foreground/70">Check back soon for places to stay in Haiphong.</p>
              <Link href="/dashboard/listings/new" className="mt-4 inline-block text-primary hover:underline">
                Are you a host? List your place now!
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
// src/app/(main)/marketplace/[category]/[listingId]/page.tsx

import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { Tag, User, MessageSquare } from 'lucide-react';
import ImageCarousel from '@/components/common/ImageCarousel';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import SaveButton from '@/components/common/SaveButton'; // Import the new component

export default async function MarketplaceDetailPage({ params }: { params: { listingId: string } }) {
  const session = await getServerSession(authOptions);
  
  const listing = await prisma.listing.findUnique({
    where: { id: params.listingId },
    include: {
      author: { select: { name: true, image: true } },
      // THE FIX: Include the savedBy relation to check if the current user has saved this item
      savedBy: {
        where: { userId: session?.user?.id },
        select: { userId: true },
      },
    },
  });

  if (!listing) {
    notFound();
  }

  // THE FIX: Determine if the item is saved by checking if the savedBy array is not empty
  const isInitiallySaved = listing.savedBy.length > 0;

  return (
    <div className="bg-secondary">
      <div className="container mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <ImageCarousel images={listing.imageUrls} />
        <div className="mt-8 grid grid-cols-1 gap-12 md:grid-cols-3">
          <div className="md:col-span-2">
            <h1 className="font-heading text-4xl font-bold text-foreground">{listing.title}</h1>
            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-foreground/80">
              <div className="flex items-center gap-1.5">
                <User className="h-5 w-5" />
                <span>Seller: {listing.author.name}</span>
              </div>
            </div>
            <div className="mt-8">
              <h2 className="font-heading text-2xl font-bold text-foreground">About this item</h2>
              <p className="prose prose-lg mt-4 max-w-none text-foreground/80">{listing.description}</p>
            </div>
          </div>
          <div className="md:col-span-1">
            <div className="sticky top-28 rounded-lg border border-secondary bg-background p-6 shadow-lg">
              <div className="flex items-center gap-2">
                <Tag className="h-6 w-6 text-primary" />
                <p className="text-3xl font-bold text-foreground">
                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(listing.price)}
                </p>
              </div>
              <button className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-accent px-4 py-3 font-semibold text-white transition-colors hover:bg-accent/90">
                <MessageSquare className="h-5 w-5" />
                Contact Seller
              </button>
              {/* THE FIX: Replace the old button with our new dynamic SaveButton */}
              <SaveButton 
                itemId={listing.id}
                itemType="listing"
                isInitiallySaved={isInitiallySaved}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
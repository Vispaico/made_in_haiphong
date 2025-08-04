// src/app/(main)/stay/[listingId]/page.tsx

import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { Bookmark, Star, Users, Home } from 'lucide-react';
import ImageCarousel from '@/components/common/ImageCarousel'; // THE FIX: Import the new carousel component

export default async function StayDetailPage({ params }: { params: { listingId: string } }) {
  const accommodation = await prisma.listing.findUnique({
    where: {
      id: params.listingId,
      category: 'accommodation',
    },
    include: {
      author: {
        select: { name: true, image: true },
      },
    },
  });

  if (!accommodation) {
    notFound();
  }

  return (
    <div className="bg-secondary">
      <div className="container mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        {/* THE FIX: The broken ImageGallery has been replaced with the new ImageCarousel */}
        <ImageCarousel images={accommodation.imageUrls} />

        <div className="mt-8 grid grid-cols-1 gap-12 md:grid-cols-3">
          <div className="md:col-span-2">
            <h1 className="font-heading text-4xl font-bold text-foreground">{accommodation.title}</h1>
            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-foreground/80">
              <div className="flex items-center gap-1.5">
                <Star className="h-5 w-5 text-yellow-400" fill="currentColor" />
                <span className="font-semibold">4.9</span>
                <span className="text-foreground/60">(85 reviews)</span>
              </div>
            </div>
             <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-foreground/80">
                <div className="flex items-center gap-1.5">
                    <Users className="h-5 w-5" />
                    <span>8 Guests</span>
                </div>
                 <span className="text-foreground/30">•</span>
                 <div className="flex items-center gap-1.5">
                    <Home className="h-5 w-5" />
                    <span>4 Bedrooms</span>
                </div>
            </div>

            <div className="mt-8">
              <h2 className="font-heading text-2xl font-bold text-foreground">About this accommodation</h2>
              <p className="prose prose-lg mt-4 max-w-none text-foreground/80">
                {accommodation.description}
              </p>
            </div>
          </div>

          <div className="md:col-span-1">
            <div className="sticky top-28 rounded-lg border border-secondary bg-background p-6 shadow-lg">
              <p className="text-2xl font-bold text-foreground">
                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(accommodation.price)}
                <span className="text-base font-normal text-foreground/70"> / night</span>
              </p>
              <button className="mt-6 inline-flex w-full items-center justify-center rounded-lg bg-accent px-4 py-3 font-semibold text-white transition-colors hover:bg-accent/90">
                Request to Book
              </button>
               <button className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-secondary px-4 py-3 font-semibold text-foreground transition-colors hover:bg-secondary/80">
                <Bookmark className="h-4 w-4" />
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
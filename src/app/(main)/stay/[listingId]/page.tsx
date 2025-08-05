// src/app/(main)/stay/[listingId]/page.tsx

import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { Star, Users, Home } from 'lucide-react';
import ImageCarousel from '@/components/common/ImageCarousel';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import SaveButton from '@/components/common/SaveButton';
import ContactSellerButton from '@/components/common/ContactSellerButton';
import BookingRequest from '@/components/common/BookingRequest'; // Import the new component

export default async function StayDetailPage({ params }: { params: { listingId: string } }) {
  const session = await getServerSession(authOptions);

  const accommodation = await prisma.listing.findUnique({
    where: {
      id: params.listingId,
      category: 'accommodation',
    },
    include: {
      author: { select: { id: true, name: true, image: true } },
      savedBy: {
        where: { userId: session?.user?.id },
        select: { userId: true },
      },
    },
  });

  if (!accommodation) notFound();
  
  const isInitiallySaved = accommodation.savedBy.length > 0;

  return (
    <div className="bg-secondary">
      <div className="container mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <ImageCarousel images={accommodation.imageUrls} />
        <div className="mt-8 grid grid-cols-1 gap-12 md:grid-cols-3">
          <div className="md:col-span-2">
            <h1 className="font-heading text-4xl font-bold text-foreground">{accommodation.title}</h1>
            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-foreground/80">
              <div className="flex items-center gap-1.5">
                <Star className="h-5 w-5 text-yellow-400" fill="currentColor" />
                <span className="font-semibold">4.9</span> <span className="text-foreground/60">(85 reviews)</span>
              </div>
            </div>
            {(accommodation.maxGuests || accommodation.bedrooms) && (
              <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-foreground/80">
                {accommodation.maxGuests && (<div className="flex items-center gap-1.5"><Users className="h-5 w-5" /><span>{accommodation.maxGuests} Guests</span></div>)}
                {accommodation.maxGuests && accommodation.bedrooms && (<span className="text-foreground/30">•</span>)}
                {accommodation.bedrooms && (<div className="flex items-center gap-1.5"><Home className="h-5 w-5" /><span>{accommodation.bedrooms} Bedrooms</span></div>)}
              </div>
            )}
            <div className="mt-8">
              <h2 className="font-heading text-2xl font-bold text-foreground">About this accommodation</h2>
              <p className="prose prose-lg mt-4 max-w-none text-foreground/80">{accommodation.description}</p>
            </div>
          </div>
          <div className="md:col-span-1">
            <div className="sticky top-28 rounded-lg border border-secondary bg-background p-6 shadow-lg">
              {/* THE FIX: The buttons are replaced with our new BookingRequest widget */}
              <BookingRequest 
                listingId={accommodation.id}
                pricePerNight={accommodation.price}
              />
              <div className="mt-4 border-t border-secondary pt-4">
                <ContactSellerButton sellerId={accommodation.authorId} currentUserId={session?.user?.id} />
                <SaveButton itemId={accommodation.id} itemType="listing" isInitiallySaved={isInitiallySaved} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
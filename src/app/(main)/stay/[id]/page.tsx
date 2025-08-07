// src/app/(main)/stay/[id]/page.tsx

import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { Star, Users, Home, ShieldCheck } from 'lucide-react'; // Import ShieldCheck
import ImageCarousel from '@/components/common/ImageCarousel';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import SaveButton from '@/components/common/SaveButton';
import ContactSellerButton from '@/components/common/ContactSellerButton';
import BookingRequest from '@/components/common/BookingRequest';
import Image from 'next/image'; // Import Image for the host avatar

export default async function StayDetailPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  
  const accommodation = await prisma.listing.findUnique({
    where: {
      id: params.id,
      category: 'accommodation',
    },
    include: {
      // THE FIX: Fetch `emailVerified` for the "Verified Host" badge
      author: { select: { id: true, name: true, image: true, emailVerified: true } },
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
        <div className="mt-8 grid grid-cols-1 gap-x-12 gap-y-8 md:grid-cols-3">
          <div className="md:col-span-2">
            <h1 className="font-heading text-3xl font-bold text-foreground sm:text-4xl">{accommodation.title}</h1>
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
            
            {/* THE FIX: Added a dedicated, visually distinct host section */}
            <div className="mt-8 flex items-center gap-4 rounded-lg border border-secondary bg-background p-4">
              <Image src={accommodation.author.image || '/images/avatar-default.png'} alt={accommodation.author.name || 'Host'} width={56} height={56} className="h-14 w-14 rounded-full object-cover"/>
              <div>
                <p className="text-sm text-foreground/80">Hosted by</p>
                <p className="font-semibold text-foreground">{accommodation.author.name}</p>
                {accommodation.author.emailVerified && (
                  <div className="flex items-center gap-1 text-xs text-green-600">
                    <ShieldCheck className="h-4 w-4" />
                    <span>Verified Host</span>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-8 border-t border-secondary pt-8">
              <h2 className="font-heading text-2xl font-bold text-foreground">About this accommodation</h2>
              <p className="prose prose-lg mt-4 max-w-none text-foreground/80">{accommodation.description}</p>
            </div>
          </div>
          <div className="md-col-span-1">
            <div className="sticky top-28 rounded-lg border border-secondary bg-background p-6 shadow-lg">
              <BookingRequest 
                listingId={accommodation.id}
                pricePerNight={accommodation.price}
              />
              <div className="mt-4 border-t border-secondary pt-4 space-y-2">
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
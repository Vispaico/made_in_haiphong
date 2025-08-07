// src/app/(main)/marketplace/[category]/[id]/page.tsx

import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { Tag, ShieldCheck } from 'lucide-react';
import ImageCarousel from '@/components/common/ImageCarousel';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import SaveButton from '@/components/common/SaveButton';
import ContactSellerButton from '@/components/common/ContactSellerButton';
import Image from 'next/image';

// THE FIX: Add Incremental Static Regeneration to cache this page.
export const revalidate = 60; // Revalidate every 60 seconds

export default async function MarketplaceDetailPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  
  const listing = await prisma.listing.findUnique({
    where: { id: params.id },
    include: {
      author: { select: { id: true, name: true, image: true, emailVerified: true } },
      savedBy: { where: { userId: session?.user?.id }, select: { userId: true } },
    },
  });

  if (!listing) notFound();
  
  const isInitiallySaved = listing.savedBy.length > 0;

  return (
    <div className="bg-secondary">
      <div className="container mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <ImageCarousel images={listing.imageUrls} />
        <div className="mt-8 grid grid-cols-1 gap-x-12 gap-y-8 md:grid-cols-3">
          <div className="md:col-span-2">
            <h1 className="font-heading text-3xl font-bold text-foreground sm:text-4xl">{listing.title}</h1>
            
            <div className="mt-6 flex items-center gap-4 rounded-lg border border-secondary bg-background p-4">
              <Image src={listing.author.image || '/images/avatar-default.png'} alt={listing.author.name || 'Seller'} width={56} height={56} className="h-14 w-14 rounded-full object-cover"/>
              <div>
                <p className="text-sm text-foreground/80">Sold by</p>
                <p className="font-semibold text-foreground">{listing.author.name}</p>
                {listing.author.emailVerified && (
                  <div className="flex items-center gap-1 text-xs text-green-600">
                    <ShieldCheck className="h-4 w-4" />
                    <span>Verified Seller</span>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-8 border-t border-secondary pt-8">
              <h2 className="font-heading text-2xl font-bold text-foreground">About this item</h2>
              <div className="prose prose-lg mt-4 max-w-none text-foreground/80">
                {listing.description}
              </div>
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
              
              <div className="mt-6 space-y-2">
                <ContactSellerButton sellerId={listing.authorId} currentUserId={session?.user?.id} />
                <SaveButton itemId={listing.id} itemType="listing" isInitiallySaved={isInitiallySaved} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
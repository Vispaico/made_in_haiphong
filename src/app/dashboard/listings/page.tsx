// src/app/dashboard/listings/page.tsx
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { redirect } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import ListingActions from '@/components/dashboard/ListingActions';
import FeatureButton from '@/components/dashboard/FeatureButton'; // Import the new component
import { Camera, Star } from 'lucide-react';

export default async function MyListingsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect('/login');
  }

  // THE FIX: Fetch the full user object to get their subscription status
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user) { // Should not happen if a session exists
    redirect('/login');
  }

  const myListings = await prisma.listing.findMany({
    where: { authorId: user.id },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-3xl font-bold text-foreground">My Listings</h1>
          <p className="mt-2 text-lg text-foreground/70">View, edit, or delete your marketplace items.</p>
        </div>
        <Link href="/dashboard/listings/new" className="rounded-lg bg-accent px-5 py-2.5 font-bold text-white shadow-md">
          Create New
        </Link>
      </div>
      <div className="mt-8">
        {myListings.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {myListings.map((listing) => (
              <div key={listing.id} className="flex flex-col rounded-lg border border-secondary bg-background shadow-md">
                <div className="relative aspect-video">
                  <Image 
                    src={listing.imageUrls[0] || '/images/placeholder.png'} 
                    alt={listing.title} 
                    fill 
                    className="object-cover"
                  />
                  {listing.imageUrls.length > 1 && (
                    <div className="absolute top-2 right-2 flex items-center gap-1 rounded-full bg-black/60 px-2 py-1 text-xs text-white">
                      <Camera className="h-3 w-3" />
                      <span>{listing.imageUrls.length}</span>
                    </div>
                  )}
                  {/* THE FIX: Add a prominent badge if the listing is featured */}
                  {listing.isFeatured && (
                    <div className="absolute top-2 left-2 flex items-center gap-1 rounded-full bg-yellow-500 px-2 py-1 text-xs font-bold text-white">
                      <Star className="h-3 w-3" />
                      <span>Featured</span>
                    </div>
                  )}
                </div>
                <div className="flex flex-grow flex-col p-4">
                  <h3 className="flex-grow font-heading font-semibold">{listing.title}</h3>
                  <p className="mt-1 text-sm text-primary">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(listing.price)}</p>
                </div>
                <div className="flex items-center justify-between gap-2 border-t border-secondary p-2">
                  <ListingActions listingId={listing.id} />
                  {/* THE FIX: Conditionally render the FeatureButton if the user is PREMIUM */}
                  {user.subscriptionStatus === 'PREMIUM' && (
                    <FeatureButton listingId={listing.id} isFeatured={listing.isFeatured} />
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-lg border-2 border-dashed border-secondary py-12 text-center">
            <p className="font-semibold text-foreground">You haven't created any listings yet.</p>
            <Link href="/dashboard/listings/new" className="mt-4 inline-block text-primary hover:underline">
              Create your first listing now!
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
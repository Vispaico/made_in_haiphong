// src/app/admin/page.tsx

import prisma from '@/lib/prisma';
import Image from 'next/image';
import { format } from 'date-fns';
import AdminListingActions from '@/components/admin/AdminListingActions';
import Link from 'next/link';

export default async function AdminManageListingsPage() {
  const allListings = await prisma.listing.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      author: {
        select: { name: true, email: true },
      },
    },
  });

  return (
    <div>
      <h1 className="font-heading text-3xl font-bold text-foreground">Manage All Listings</h1>
      <p className="mt-2 text-lg text-foreground/70">View, edit, or delete any listing on the platform.</p>
      
      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {allListings.map((listing) => (
          <div key={listing.id} className="rounded-xl border border-secondary bg-background shadow-md overflow-hidden">
            <div className="relative h-48 w-full">
              <Image 
                src={listing.imageUrls[0] || '/images/placeholder.png'} 
                alt={listing.title} 
                fill 
                className="object-cover"
              />
            </div>
            <div className="p-4">
              <h3 className="font-heading text-xl font-bold truncate">{listing.title}</h3>
              <p className="text-sm text-foreground/70 capitalize">{listing.category}</p>
              
              <div className="mt-4 border-t border-secondary pt-4">
                <p className="text-sm font-semibold">Author: {listing.author.name}</p>
                <p className="text-xs text-foreground/60">{listing.author.email}</p>
                <p className="text-xs text-foreground/60 mt-1">Posted: {format(new Date(listing.createdAt), 'MMM d, yyyy')}</p>
              </div>

              <div className="mt-4 flex justify-end gap-2">
                <Link href={`/listings/${listing.id}`} className="rounded-md bg-secondary px-3 py-1.5 text-sm font-medium text-foreground/80 hover:bg-secondary/80">
                  View
                </Link>
                <AdminListingActions listingId={listing.id} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

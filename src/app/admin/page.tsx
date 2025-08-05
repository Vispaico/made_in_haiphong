// src/app/admin/page.tsx

import prisma from '@/lib/prisma';
import Image from 'next/image';
import { format } from 'date-fns';
import AdminListingActions from '@/components/admin/AdminListingActions';

export default async function AdminManageListingsPage() {
  // Fetch ALL listings from the database, including author details
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
      <p className="mt-2 text-lg text-foreground/70">View and delete any listing on the platform.</p>
      
      <div className="mt-8 overflow-x-auto rounded-lg border border-secondary bg-background">
        <table className="min-w-full divide-y divide-secondary">
          <thead className="bg-secondary">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-foreground/80">Listing</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-foreground/80">Author</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-foreground/80">Created</th>
              <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-secondary">
            {allListings.map((listing) => (
              <tr key={listing.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <Image src={listing.imageUrls[0] || '/images/placeholder.png'} alt={listing.title} width={40} height={30} className="aspect-video rounded-md object-cover" />
                    <div>
                      <div className="font-semibold">{listing.title}</div>
                      <div className="text-sm text-foreground/70">{listing.category}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="font-medium">{listing.author.name}</div>
                  <div className="text-sm text-foreground/70">{listing.author.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground/70">
                  {format(new Date(listing.createdAt), 'MMM d, yyyy')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  {/* We will put the delete button here */}
                  <AdminListingActions listingId={listing.id} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
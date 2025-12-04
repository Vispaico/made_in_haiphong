// src/app/dashboard/listings/[listingId]/edit/page.tsx

import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { notFound, redirect } from 'next/navigation';
import EditListingForm from '@/components/dashboard/EditListingForm';

// This is a Server Component that fetches the data for the form.
type EditListingPageProps = {
  params: Promise<{ listingId: string }>;
};

export default async function EditListingPage({ params }: EditListingPageProps) {
  const { listingId } = await params;
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect('/login');
  }

  const listing = await prisma.listing.findUnique({
    where: {
      id: listingId,
      // Security check: ensure the user owns this listing
      authorId: session.user.id,
    },
  });

  // If no listing is found (or the user doesn't own it), show a 404 page
  if (!listing) {
    notFound();
  }

  return (
    <div>
      <h1 className="font-heading text-3xl font-bold text-foreground">Edit Listing</h1>
      <p className="mt-2 text-lg text-foreground/70">Update the details for your listing below.</p>
      
      {/* We pass the fetched listing data down to the client component form */}
      <EditListingForm listing={listing} />
    </div>
  );
}
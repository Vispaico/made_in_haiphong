// src/app/dashboard/saved/page.tsx

import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { redirect } from 'next/navigation';
import Card from '@/components/ui/Card';
import Link from 'next/link';

export default async function SavedPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect('/login');
  }

  // Fetch saved listings, including the full listing details
  const savedListings = await prisma.savedListing.findMany({
    where: { userId: session.user.id },
    include: {
      listing: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  // Fetch saved posts, including the full post details
  const savedPosts = await prisma.savedPost.findMany({
    where: { userId: session.user.id },
    include: {
      post: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div>
      <h1 className="font-heading text-3xl font-bold text-foreground">Saved Items</h1>
      <p className="mt-2 text-lg text-foreground/70">All the listings and posts you&apos;ve saved for later.</p>

      {/* --- Section for Saved Listings --- */}
      <div className="mt-8">
        <h2 className="font-heading text-2xl font-semibold text-foreground">Saved Listings</h2>
        {savedListings.length > 0 ? (
          <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {savedListings.map(({ listing }) => (
              <Card
                key={listing.id}
                href={`/marketplace/${listing.category}/${listing.id}`}
                title={listing.title}
                description={new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(listing.price)}
                imageUrls={listing.imageUrls}
              />
            ))}
          </div>
        ) : (
          <p className="mt-4 text-foreground/70">You haven&apos;t saved any listings yet.</p>
        )}
      </div>
      
      {/* --- Section for Saved Posts --- */}
      <div className="mt-12">
        <h2 className="font-heading text-2xl font-semibold text-foreground">Saved Posts</h2>
        {savedPosts.length > 0 ? (
          <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {savedPosts.map(({ post }) => (
              <Card
                key={post.id}
                href={`/community/${post.id}`}
                title="Community Post"
                description={post.content.substring(0, 100) + '...'}
                imageUrls={post.imageUrls}
              />
            ))}
          </div>
        ) : (
          <p className="mt-4 text-foreground/70">You haven&apos;t saved any posts yet.</p>
        )}
      </div>

      {(savedListings.length === 0 && savedPosts.length === 0) && (
        <div className="mt-12 rounded-lg border-2 border-dashed border-secondary py-12 text-center">
            <p className="font-semibold text-foreground">Your saved items will appear here.</p>
            <Link href="/explore" className="mt-4 inline-block text-primary hover:underline">
              Explore the city and save items you like!
            </Link>
          </div>
      )}
    </div>
  );
}
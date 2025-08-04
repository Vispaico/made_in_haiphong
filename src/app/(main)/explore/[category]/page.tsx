// src/app/(main)/explore/[category]/page.tsx

import Card from '@/components/ui/Card';
import prisma from '@/lib/prisma'; // Import the Prisma client
import { notFound } from 'next/navigation';

// A map for user-friendly category names and descriptions
const categoryInfo: { [key: string]: { name: string; description: string } } = {
  'food-and-drink': { name: 'Food & Drink', description: 'Discover the taste of Haiphong.' },
  'sights-and-culture': { name: 'Sights & Culture', description: 'Explore historic landmarks and beautiful islands.' },
  'city-essentials': { name: 'City Essentials', description: 'Find everything you need in the city.' },
};

export default async function CategoryPage({ params }: { params: { category: string } }) {
  const category = categoryInfo[params.category];

  // If the category from the URL is not valid, show a 404 page
  if (!category) {
    notFound();
  }

  // NOTE: This assumes you have an administrative way to add listings
  // to the database with these categories. For now, it might be empty.
  const listings = await prisma.listing.findMany({
    where: {
      category: params.category,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return (
    <div className="bg-background py-16">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-left">
          <p className="font-semibold text-primary">Explore</p>
          <h1 className="font-heading text-4xl font-bold text-foreground">{category.name}</h1>
          <p className="mt-2 text-lg text-foreground/80">{category.description}</p>
        </div>

        <div className="mt-16">
          {listings.length > 0 ? (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {listings.map((listing) => (
                <Card
                  key={listing.id}
                  href={`/explore/${listing.category}/${listing.id}`} // We'll need to create this detail page later
                  title={listing.title}
                  description={`${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(listing.price)}`}
                  // THE FIX: The Card component now receives the correct `imageUrls` prop.
                  imageUrls={listing.imageUrls}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-lg border-2 border-dashed border-secondary py-12 text-center">
              <h2 className="font-heading text-2xl font-bold text-foreground">Coming Soon</h2>
              <p className="mt-2 text-foreground/70">
                Content for {category.name} is being curated and will appear here soon.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
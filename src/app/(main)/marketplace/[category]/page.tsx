// src/app/(main)/marketplace/[category]/page.tsx

import Card from '@/components/ui/Card';
import { notFound } from 'next/navigation';

// --- Sample Data for Marketplace Categories ---
// In a real app, this would come from a database query based on the category.
const marketplaceData = {
  'rentals': {
    name: 'Rentals',
    description: 'Find the perfect item to rent for your trip or project.',
    items: [
      { href: "/marketplace/rentals/honda-wave-alpha", title: "Honda Wave Alpha", description: "Perfect for city cruising. 150,000 VND/day.", imageUrl: "/images/rent-1.jpg" },
      { href: "/marketplace/rentals/canon-eos-r", title: "Canon EOS R Camera", description: "Capture your trip in stunning detail. 500,000 VND/day.", imageUrl: "/images/rent-2.jpg" }, // Add image
      { href: "/marketplace/rentals/inflatable-sup", title: "Inflatable Paddleboard", description: "Explore the bay at your own pace. 300,000 VND/day.", imageUrl: "/images/rent-3.jpg" }, // Add image
    ]
  },
  'for-sale': {
    name: 'For Sale',
    description: 'Browse new and used goods from sellers across Haiphong.',
    items: [] // We can add sample items here later
  },
  'services': {
    name: 'Services',
    description: 'Hire talented locals for tours, transport, and more.',
    items: [] // We can add sample items here later
  },
};
// --- End Sample Data ---


export default async function MarketplaceCategoryPage({ params }: { params: { category: string } }) {
  const categoryKey = params.category as keyof typeof marketplaceData;
  const category = marketplaceData[categoryKey];

  // If the URL doesn't match a valid category, show a 404 page
  if (!category) {
    notFound();
  }

  return (
    <div className="bg-background py-16">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-left">
          <p className="font-semibold text-primary">Marketplace</p>
          <h1 className="font-heading text-4xl font-bold text-foreground">{category.name}</h1>
          <p className="mx-auto mt-2 max-w-2xl text-lg text-foreground/80">
            {category.description}
          </p>
        </div>

        {/* Listings Grid */}
        <div className="mt-16">
          {category.items.length > 0 ? (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {category.items.map((item) => (
                <Card key={item.href} {...item} />
              ))}
            </div>
          ) : (
            // Placeholder for empty categories
            <div className="text-center py-16 border-2 border-dashed border-secondary rounded-lg">
              <h2 className="font-heading text-2xl font-bold text-foreground">Coming Soon!</h2>
              <p className="mt-2 text-foreground/70">
                Listings for {category.name} will appear here as they are added.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
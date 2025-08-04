// src/app/(main)/marketplace/page.tsx

import Card from '@/components/ui/Card';

// The data is confirmed to be correct, using 'imageUrls' as an array.
const marketplaceCategories = [
  {
    href: '/marketplace/rentals',
    title: 'Rentals',
    description: 'Rent motorbikes, cars, cameras, and more from locals.',
    imageUrls: ['/images/market-rentals.jpg'],
  },
  {
    href: '/marketplace/for-sale',
    title: 'For Sale',
    description: 'Buy second-hand goods and new products from local vendors.',
    imageUrls: ['/images/market-for-sale.jpg'],
  },
  {
    href: '/marketplace/services',
    title: 'Services',
    description: 'Hire local guides, chauffeurs, photographers, and other professionals.',
    imageUrls: ['/images/market-services.jpg'],
  },
];

export default function MarketplacePage() {
  return (
    <div className="bg-secondary py-16">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="font-heading text-4xl font-bold text-foreground">The Marketplace</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-foreground/80">
            Rent, buy, or sell goods and services within the Haiphong community.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {marketplaceCategories.map((category) => (
            // THE FIX IS HERE: We are now passing each prop explicitly
            // instead of using the spread operator. This is safer.
            <Card 
              key={category.href}
              href={category.href}
              title={category.title}
              description={category.description}
              imageUrls={category.imageUrls}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
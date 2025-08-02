// src/app/(main)/stay/page.tsx

import Card from '@/components/ui/Card';

// Sample data for accommodation listings
const stayListings = [
  {
    href: '/stay/seaside-villa-lan-ha',
    title: 'Seaside Villa in Lan Ha',
    description: 'A beautiful villa with direct beach access. Sleeps 8. From $250/night.',
    imageUrl: '/images/stay-1.jpg', 
  },
  {
    href: '/stay/city-center-apartment',
    title: 'Modern City Center Apartment',
    description: 'A stylish 2-bedroom apartment perfect for exploring the city. From $70/night.',
    imageUrl: '/images/stay-2.jpg', // You will need to add a representative image
  },
  {
    href: '/stay/cat-ba-bungalow',
    title: 'Rustic Bungalow on Cat Ba',
    description: 'Escape to nature in this charming bungalow. From $55/night.',
    imageUrl: '/images/stay-3.jpg', // You will need to add a representative image
  },
  {
    href: '/stay/boutique-hotel-vieux',
    title: 'Boutique Hotel "Vieux Port"',
    description: 'Experience comfort and elegance in the heart of the old port area. From $120/night.',
    imageUrl: '/images/stay-4.jpg', // You will need to add a representative image
  },
];

export default function StayPage() {
  return (
    <div className="bg-background py-16">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="font-heading text-4xl font-bold text-foreground">Find Your Place to Stay</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-foreground/80">
            From luxury villas to cozy apartments, find the perfect accommodation for your trip.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {stayListings.map((listing) => (
            <Card key={listing.href} {...listing} />
          ))}
        </div>
      </div>
    </div>
  );
}
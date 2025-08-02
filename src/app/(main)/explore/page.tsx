// src/app/(main)/explore/page.tsx

import Card from '@/components/ui/Card';

const exploreCategories = [
  { href: '/explore/food-and-drink', title: 'Food & Drink', description: 'Discover the taste of Haiphong, from restaurants to street food.', imageUrl: '/images/explore-food.jpg' },
  { href: '/explore/sights-and-culture', title: 'Sights & Culture', description: 'Explore historic landmarks, beautiful islands like Cat Ba, and more.', imageUrl: '/images/explore-sights.jpg'},
  { href: '/explore/city-essentials', title: 'City Essentials', description: 'Find everything you need, from transport to hospitals.', imageUrl: '/images/explore-essentials.jpg'},
];

export default function ExplorePage() {
  return (
    <div className="bg-secondary py-16">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="font-heading text-4xl font-bold text-foreground">Explore Haiphong</h1>
        </div>
        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {exploreCategories.map((category) => (
            // FIX: Ensured this also uses the clean spread syntax without duplicates.
            <Card key={category.href} {...category} />
          ))}
        </div>
      </div>
    </div>
  );
}
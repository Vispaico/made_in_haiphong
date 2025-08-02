// src/app/(main)/explore/[category]/[slug]/page.tsx

import { MapPin, Star, Bookmark } from 'lucide-react';
import Image from 'next/image';

// --- Sample Data (to be replaced by a database call for the specific slug) ---
const detailData = {
  name: "Cat Ba Island",
  rating: 4.8,
  reviews: 120,
  address: "Cát Bà, Cát Hải, Haiphong",
  imageUrl: "/images/sight-1.jpg",
  description: "Cat Ba Island is the largest island in Lan Ha Bay and is a paradise for nature lovers. Known for its rugged cliffs, pristine beaches, and the lush Cat Ba National Park, it offers a wide range of activities. Visitors can go hiking, kayaking, rock climbing, or simply relax on one of its many sandy shores. The island is also a crucial biosphere reserve, home to the critically endangered Cat Ba langur."
};
// --- End Sample Data ---

export default async function DetailPage({ params }: { params: { slug: string } }) {
  // In a real app, you would use params.slug to fetch data from your database.
  const placeName = params.slug.replace(/-/g, ' ');

  return (
    <div className="bg-secondary">
      <div className="container mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Image Gallery */}
        <div className="relative h-96 w-full overflow-hidden rounded-lg bg-background/10">
          <Image
            src={detailData.imageUrl}
            alt={detailData.name}
            fill
            className="object-cover"
            priority
          />
        </div>

        <div className="mt-8 grid grid-cols-1 gap-12 md:grid-cols-3">
          {/* Main Content */}
          <div className="md:col-span-2">
            <h1 className="font-heading text-4xl font-bold capitalize text-foreground">{placeName}</h1>
            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-foreground/80">
              <div className="flex items-center gap-1.5">
                <Star className="h-5 w-5 text-yellow-400" fill="currentColor" />
                <span className="font-semibold">{detailData.rating}</span>
                <span className="text-foreground/60">({detailData.reviews} reviews)</span>
              </div>
              <span className="text-foreground/30">•</span>
              <div className="flex items-center gap-1.5">
                <MapPin className="h-5 w-5" />
                <span>{detailData.address}</span>
              </div>
            </div>

            <div className="mt-8">
              <h2 className="font-heading text-2xl font-bold text-foreground">About this place</h2>
              <p className="prose prose-lg mt-4 max-w-none text-foreground/80">
                {detailData.description}
              </p>
            </div>
          </div>

          {/* Sidebar / Action Panel */}
          <div className="md:col-span-1">
            <div className="sticky top-28 rounded-lg border border-secondary bg-background p-6 shadow-lg">
              <h3 className="font-heading text-xl font-bold text-foreground">Plan Your Visit</h3>
              <button className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-accent px-4 py-2.5 font-semibold text-white transition-colors hover:bg-accent/90">
                <Bookmark className="h-4 w-4" />
                Save to Favorites
              </button>
              {/* Other actions like "Get Directions" or "Check Availability" can go here */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
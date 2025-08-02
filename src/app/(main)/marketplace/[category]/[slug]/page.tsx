// src/app/(main)/marketplace/[category]/[slug]/page.tsx

import { MapPin, Tag, User, Bookmark, MessageSquare } from 'lucide-react';
import Image from 'next/image';

// Sample Data (In a real app, you'd fetch this based on both category and slug)
const itemDetails = {
  name: "Honda Wave Alpha",
  price: "3,500,000 VND",
  seller: "Minh's Motorbikes",
  location: "Ngo Quyen District, Haiphong",
  condition: "Used - Good",
  imageUrl: "/images/rent-1.jpg",
  description: "A reliable Honda Wave Alpha, perfect for navigating the city. This bike has been well-maintained and regularly serviced. It's a 2019 model with approximately 25,000 km. Great fuel efficiency and easy to handle for all riders. Blue card (registration) included. Price is negotiable."
};

// THE FIX IS HERE: The params object now expects both 'category' and 'slug'.
export default async function MarketplaceDetailPage({ params }: { params: { category: string; slug: string } }) {
  // We can now use both params if needed for fetching data. For now, we only use slug for the title.
  const itemName = params.slug.replace(/-/g, ' ');

  return (
    <div className="bg-secondary">
      <div className="container mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Image */}
        <div className="relative h-96 w-full overflow-hidden rounded-lg bg-background/10 md:h-[500px]">
          <Image
            src={itemDetails.imageUrl}
            alt={itemDetails.name}
            fill
            className="object-cover"
            priority
          />
        </div>

        <div className="mt-8 grid grid-cols-1 gap-12 md:grid-cols-3">
          {/* Main Content */}
          <div className="md:col-span-2">
            <h1 className="font-heading text-4xl font-bold capitalize text-foreground">{itemName}</h1>
            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-foreground/80">
              <div className="flex items-center gap-1.5">
                <User className="h-5 w-5" />
                <span>Seller: {itemDetails.seller}</span>
              </div>
              <span className="text-foreground/30">•</span>
              <div className="flex items-center gap-1.5">
                <MapPin className="h-5 w-5" />
                <span>{itemDetails.location}</span>
              </div>
            </div>

            <div className="mt-8">
              <h2 className="font-heading text-2xl font-bold text-foreground">About this item</h2>
               <p className="mt-2 text-sm font-semibold text-primary">{itemDetails.condition}</p>
              <p className="prose prose-lg mt-4 max-w-none text-foreground/80">
                {itemDetails.description}
              </p>
            </div>
          </div>

          {/* Sidebar / Action Panel */}
          <div className="md:col-span-1">
            <div className="sticky top-28 rounded-lg border border-secondary bg-background p-6 shadow-lg">
              <div className="flex items-center gap-2">
                <Tag className="h-6 w-6 text-primary" />
                <p className="text-3xl font-bold text-foreground">
                  {itemDetails.price}
                </p>
              </div>
              <button className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-accent px-4 py-3 font-semibold text-white transition-colors hover:bg-accent/90">
                <MessageSquare className="h-5 w-5" />
                Contact Seller
              </button>
               <button className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-secondary px-4 py-3 font-semibold text-foreground transition-colors hover:bg-secondary/80">
                <Bookmark className="h-4 w-4" />
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
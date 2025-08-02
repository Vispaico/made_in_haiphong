// src/app/(main)/stay/[slug]/page.tsx

import { MapPin, Star, Bookmark, Users, Home } from 'lucide-react';
import Image from 'next/image';

// Sample Data (In a real app, you'd fetch this based on the slug)
const accommodationDetails = {
  name: "Seaside Villa in Lan Ha",
  rating: 4.9,
  reviews: 85,
  address: "Lan Ha Bay, Cát Hải, Haiphong",
  imageUrl: "/images/stay-1.jpg",
  pricePerNight: 250,
  maxGuests: 8,
  bedrooms: 4,
  description: "Experience ultimate luxury and tranquility in this stunning seaside villa. With panoramic views of Lan Ha Bay, a private infinity pool, and direct beach access, it's the perfect getaway for families or groups. The villa features four spacious bedrooms, a fully equipped kitchen, and a large outdoor terrace for dining and relaxation."
};

export default async function StayDetailPage({ params }: { params: { slug: string } }) {
  const placeName = params.slug.replace(/-/g, ' ');

  return (
    <div className="bg-secondary">
      <div className="container mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Image Gallery */}
        <div className="relative h-96 w-full overflow-hidden rounded-lg bg-background/10 md:h-[500px]">
          <Image
            src={accommodationDetails.imageUrl}
            alt={accommodationDetails.name}
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
                <span className="font-semibold">{accommodationDetails.rating}</span>
                <span className="text-foreground/60">({accommodationDetails.reviews} reviews)</span>
              </div>
              <span className="text-foreground/30">•</span>
              <div className="flex items-center gap-1.5">
                <MapPin className="h-5 w-5" />
                <span>{accommodationDetails.address}</span>
              </div>
            </div>
             <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-foreground/80">
                <div className="flex items-center gap-1.5">
                    <Users className="h-5 w-5" />
                    <span>{accommodationDetails.maxGuests} Guests</span>
                </div>
                 <span className="text-foreground/30">•</span>
                 <div className="flex items-center gap-1.5">
                    <Home className="h-5 w-5" />
                    <span>{accommodationDetails.bedrooms} Bedrooms</span>
                </div>
            </div>

            <div className="mt-8">
              <h2 className="font-heading text-2xl font-bold text-foreground">About this accommodation</h2>
              <p className="prose prose-lg mt-4 max-w-none text-foreground/80">
                {accommodationDetails.description}
              </p>
            </div>
          </div>

          {/* Sidebar / Action Panel */}
          <div className="md:col-span-1">
            <div className="sticky top-28 rounded-lg border border-secondary bg-background p-6 shadow-lg">
              <p className="text-2xl font-bold text-foreground">
                ${accommodationDetails.pricePerNight}{' '}
                <span className="text-base font-normal text-foreground/70">/ night</span>
              </p>
              <button className="mt-6 inline-flex w-full items-center justify-center rounded-lg bg-accent px-4 py-3 font-semibold text-white transition-colors hover:bg-accent/90">
                Request to Book
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
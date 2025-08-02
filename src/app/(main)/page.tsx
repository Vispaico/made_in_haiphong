// src/app/(main)/page.tsx

import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { Utensils, Building, Bike, BedDouble, Search } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import Card from '@/components/ui/Card';

// Data for Cards
const sampleListings = [
  { href: "/explore/food-and-drink/banh-da-cua", title: "Bánh đa cua", description: "Famous crab noodle soup.", imageUrl: "/images/food-1.jpg" },
  { href: "/stay/seaside-villa", title: "Seaside Villa", description: "Stunning view of Lan Ha Bay.", imageUrl: "/images/stay-1.jpg" },
  { href: "/marketplace/rentals/honda-wave", title: "Honda Wave Bike", description: "Reliable and easy to ride.", imageUrl: "/images/rent-1.jpg" },
];

const categoryLinks = [
  { href: '/explore/food-and-drink', label: 'Eat', icon: Utensils },
  { href: '/explore/sights-and-culture', label: 'See', icon: Building },
  { href: '/marketplace/rentals', label: 'Rent', icon: Bike },
  { href: '/stay', label: 'Stay', icon: BedDouble },
];

// The component is now async to allow for server-side data fetching
export default async function HomePage() {
  // Fetch the user's session on the server
  const session = await getServerSession(authOptions);

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative flex h-[60vh] w-full items-center justify-center">
        <Image src="/images/haiphong-hero-background.jpg" alt="Haiphong Cityscape" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 flex flex-col items-center p-4 text-center text-white">
          <h1 className="font-heading text-4xl font-bold md:text-6xl">Haiphong in Your Pocket</h1>
          <p className="mt-2 max-w-2xl text-lg md:text-xl">Discover, Shop, Connect.</p>
          <div className="mt-8 flex w-full max-w-xl items-center">
            <input type="search" placeholder="Search for food, motorbikes, or places..." className="w-full rounded-l-md border-0 bg-white/90 p-3 text-zinc-900 placeholder-zinc-500 focus:ring-2 focus:ring-accent focus:ring-inset"/>
            <button className="flex items-center justify-center rounded-r-md bg-accent p-3 text-white transition-colors hover:bg-accent/90">
              <Search className="h-6 w-6" />
            </button>
          </div>
        </div>
      </section>

      {/* Category Quick-Nav */}
      <section className="container mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-6 text-center md:grid-cols-4">
          {categoryLinks.map((link) => (
            <Link href={link.href} key={link.href} className="group">
              <div className="rounded-xl bg-secondary p-6 shadow transition-transform hover:-translate-y-1">
                <link.icon className="mx-auto h-12 w-12 text-primary" />
                <h3 className="mt-4 font-heading font-bold text-foreground">{link.label}</h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Listings Section */}
      <section className="bg-secondary py-20">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-12 font-heading text-center text-3xl font-bold text-foreground">Featured This Week</h2>
          <div className="grid gap-8 md:grid-cols-3">
            {sampleListings.map((item) => (
              <Card key={item.href} {...item} />
            ))}
          </div>
        </div>
      </section>
      
      {/* Conditionally Rendered Call to Action Section */}
      {/* This will only be rendered if the user is NOT logged in */}
      {!session && (
        <section className="container mx-auto max-w-7xl px-4 py-20 text-center sm:px-6 lg:px-8">
            <h2 className="font-heading text-3xl font-bold text-foreground">Join the Community</h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-foreground/80">
              Share your favorite finds, offer services, or list a place to stay. Become a part of Haiphong&apos;s story.
            </p>
            <div className="mt-8">
              <Link href="/signup" className="inline-block rounded-lg bg-accent px-8 py-3 font-bold text-white shadow-md transition-transform hover:scale-105">
                Sign Up Now
              </Link>
            </div>
        </section>
      )}
    </div>
  );
}
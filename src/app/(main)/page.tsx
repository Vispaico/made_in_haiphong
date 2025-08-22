// src/app/(main)/page.tsx

import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { Utensils, Building, Bike, BedDouble, Search } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import Card from '@/components/ui/Card';

import { FloatingItem } from '@/components/common/FloatingItem';
import { Ufo } from '@/components/common/Ufo';

// THE FIX IS HERE: The hrefs now point to valid category pages, removing the 404 errors.
const sampleListings = [
  { href: "/explore/food-and-drink", title: "Bánh đa cua", description: "Famous crab noodle soup.", imageUrls: ["/images/food-1.jpg"] },
  { href: "/stay", title: "Seaside Villa", description: "Stunning view of Lan Ha Bay.", imageUrls: ["/images/stay-1.jpg"] },
  { href: "/marketplace/rentals", title: "Honda Wave Bike", description: "Reliable and easy to ride.", imageUrls: ["/images/rent-1.jpg"] },
];

const categoryLinks = [
  { href: '/explore/food-and-drink', label: 'Eat', icon: Utensils },
  { href: '/explore/sights-and-culture', label: 'See', icon: Building },
  { href: '/marketplace/rentals', label: 'Rent', icon: Bike },
  { href: '/stay', label: 'Stay', icon: BedDouble },
];

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  return (
    <div className="flex flex-col">
      <section className="relative flex h-[60vh] w-full items-center justify-center overflow-hidden">
        <Image 
          src="https://images.unsplash.com/photo-1688193662553-dd1ed64a77fd?q=80&w=3131&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
          alt="Haiphong Cityscape" 
          fill 
          className="object-cover" 
          priority 
        />
        <FloatingItem duration={30} xRange={[-200, 200]} yRange={[-50, 50]} className="absolute top-[20%] left-[50%] transform -translate-x-1/2">
          <Ufo />
        </FloatingItem>
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative z-10 flex flex-col items-center p-4 text-center text-white">
          <h1 className="font-heading text-4xl font-bold md:text-6xl">Haiphong in Your Pocket</h1>
          <p className="mt-2 max-w-2xl text-lg md:text-xl">Discover, Shop, Connect.</p>
          <div className="mt-8 w-full max-w-2xl rounded-lg bg-black/30 p-4 backdrop-blur-sm">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <input 
                type="text" 
                placeholder="I'm looking for..." 
                className="w-full rounded-md border-0 bg-white/90 p-3 text-foreground placeholder-zinc-500 focus:ring-2 focus:ring-accent focus:ring-inset"
              />
              <input 
                type="text" 
                placeholder="in..." 
                className="w-full rounded-md border-0 bg-white/90 p-3 text-foreground placeholder-zinc-500 focus:ring-2 focus:ring-accent focus:ring-inset"
              />
              <button className="flex w-full items-center justify-center rounded-md bg-accent p-3 text-white transition-colors hover:bg-accent/90 md:col-span-3 lg:md:col-span-1">
                <Search className="h-6 w-6 mr-2" />
                Search
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-6 text-center md:grid-cols-4">
          {categoryLinks.map((link) => (
            <Link href={link.href} key={link.href} className="group block rounded-xl bg-secondary p-6 shadow transition-transform duration-300 ease-in-out hover:-translate-y-2 hover:shadow-lg">
              <link.icon className="mx-auto h-12 w-12 text-primary transition-colors group-hover:text-accent" />
              <h3 className="mt-4 font-heading font-bold text-foreground">{link.label}</h3>
            </Link>
          ))}
        </div>
      </section>

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
    </div>
  );
}
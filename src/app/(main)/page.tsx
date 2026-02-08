// src/app/(main)/page.tsx


import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { Utensils, Building, BedDouble, ShoppingCart } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import Card from '@/components/ui/Card';
import prisma from '@/lib/prisma';
import GlobalSearch from '@/components/search/GlobalSearch';

const categoryLinks = [
  { href: '/explore/food-and-drink', label: 'Eat', icon: Utensils, imageUrl: '/images/explore-food.jpg' },
  { href: '/explore/sights-and-culture', label: 'See', icon: Building, imageUrl: '/images/explore-sights.jpg' },
  { href: '/stay', label: 'Stay', icon: BedDouble, imageUrl: '/images/stay-2.jpg' },
  { href: '/marketplace', label: 'Shop', icon: ShoppingCart, imageUrl: '/images/market-for-sale.jpg' },
];

async function getFeaturedListings() {
  try {
    const listings = await prisma.listing.findMany({
      where: { isFeatured: true },
      take: 3,
      orderBy: { updatedAt: 'desc' },
    });
    return listings.map((l) => ({
      href: `/marketplace/${l.category ?? 'all'}/${l.id}`,
      title: l.title,
      description: l.description,
      imageUrls: l.imageUrls ?? [],
      price: l.price,
    }));
  } catch (error) {
    console.warn('Failed to load featured listings', error);
    return [];
  }
}

async function getAnnouncements() {
  try {
    return await prisma.announcement.findMany({ where: { isActive: true }, take: 3, orderBy: { createdAt: 'desc' } });
  } catch (error) {
    console.warn('Failed to load announcements', error);
    return [];
  }
}

async function getCommunityPosts() {
  try {
    return await prisma.post.findMany({ where: { status: 'APPROVED' }, take: 3, orderBy: { createdAt: 'desc' } });
  } catch (error) {
    console.warn('Failed to load posts', error);
    return [];
  }
}

export default async function HomePage() {
  const session = await getServerSession(authOptions);
  const [featured, announcements, posts] = await Promise.all([
    getFeaturedListings(),
    getAnnouncements(),
    getCommunityPosts(),
  ]);

  const fallbackListings = [
    { href: "/explore/food-and-drink", title: "Bánh đa cua", description: "Famous crab noodle soup.", imageUrls: ["/images/food-1.jpg"] },
    { href: "/stay", title: "Seaside Villa", description: "Stunning view of Lan Ha Bay.", imageUrls: ["/images/stay-1.jpg"] },
    { href: "/marketplace/rentals", title: "Honda Wave Bike", description: "Reliable and easy to ride.", imageUrls: ["/images/rent-1.jpg"] },
  ];

  return (
    <div className="flex flex-col">
      <section className="relative flex h-[60vh] w-full items-center justify-center overflow-hidden">
        <Image 
          src="/images/haiphong-hero-background.jpg"
          alt="Haiphong Cityscape" 
          fill 
          className="object-cover" 
          priority 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="relative z-10 flex flex-col items-center p-4 text-center text-white">
          <h1 className="font-heading text-4xl font-bold md:text-6xl">{session ? `Welcome back, ${session.user?.name}!` : 'Haiphong in Your Pocket'}</h1>
          <p className="mt-2 max-w-2xl text-lg md:text-xl">{session ? 'Your personal guide to the Port City.' : 'Discover the heart of the Port City.'}</p>
          <div className="mt-8 w-full max-w-2xl">
            <GlobalSearch />
          </div>
        </div>
      </section>

      <section className="container mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="mb-12 font-heading text-center text-3xl font-bold text-foreground">Explore Haiphong</h2>
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {categoryLinks.map((link) => (
            <Link href={link.href} key={link.href} className="group relative block h-48 overflow-hidden rounded-xl shadow-lg transition-transform duration-300 ease-in-out hover:-translate-y-2 hover:shadow-xl">
              <Image
                src={link.imageUrl}
                alt={link.label}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/40" />
              <div className="relative flex h-full flex-col items-center justify-center text-white">
                <link.icon className="h-12 w-12" />
                <h3 className="mt-4 font-heading text-2xl font-bold">{link.label}</h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-secondary py-20">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-12 font-heading text-center text-3xl font-bold text-foreground">Featured This Week</h2>
          <div className="grid gap-8 md:grid-cols-3">
            {(featured.length ? featured : fallbackListings).map((item) => (
              <Card key={item.href} {...item} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="mb-4 font-heading text-3xl font-bold text-foreground">Happening Now</h2>
          <p className="mb-8 text-foreground/80">Local events and upcoming gatherings.</p>
          {announcements.length ? (
            <div className="grid gap-4 text-left md:grid-cols-3">
              {announcements.map((a) => (
                <div key={a.id} className="rounded-lg border border-secondary bg-secondary/60 p-4 shadow-sm">
                  <p className="text-sm text-foreground/70">{new Date(a.createdAt).toLocaleDateString()}</p>
                  <p className="mt-2 text-foreground">{a.message}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex justify-center items-center bg-secondary rounded-lg h-48">
              <p className="text-foreground/60">Event listings coming soon!</p>
            </div>
          )}
        </div>
      </section>

      <section className="bg-secondary py-20">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="mb-4 font-heading text-3xl font-bold text-foreground">From the Community</h2>
          <p className="mb-8 text-foreground/80">The latest posts and tips from locals.</p>
          {posts.length ? (
            <div className="grid gap-4 md:grid-cols-3 text-left">
              {posts.map((p) => (
                <Link key={p.id} href={`/community/${p.id}`} className="rounded-lg border border-secondary bg-background p-4 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                  <p className="text-sm text-foreground/60">{new Date(p.createdAt).toLocaleDateString()}</p>
                  <p className="mt-2 line-clamp-3 text-foreground">{p.content}</p>
                </Link>
              ))}
            </div>
          ) : (
            <div className="flex justify-center items-center bg-background rounded-lg h-48">
              <p className="text-foreground/60">Community feed coming soon!</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

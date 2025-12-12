// src/app/(main)/marketplace/page.tsx
import Link from 'next/link';
import Image from 'next/image';
import { Search, Tag, Wrench, Car } from 'lucide-react';
import Card from '@/components/ui/Card';
import prisma from '@/lib/prisma';

export const revalidate = 60;

const iconByType = (slug: string) => {
  if (slug.includes('sale')) return Tag;
  if (slug.includes('service')) return Wrench;
  return Car;
};

const imageByType = (slug: string) => {
  if (slug.includes('sale')) return '/images/market-for-sale.jpg';
  if (slug.includes('service')) return '/images/market-services.jpg';
  return '/images/market-rentals.jpg';
};

export default async function MarketplacePage() {
  const [categories, featured] = await Promise.all([
    prisma.category.findMany({ where: { type: 'MARKETPLACE' }, orderBy: { name: 'asc' } }),
    prisma.listing.findMany({
      orderBy: [{ isFeatured: 'desc' }, { createdAt: 'desc' }],
      take: 6,
    }),
  ]);

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative flex h-[40vh] w-full items-center justify-center bg-secondary">
        <div className="container mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="font-heading text-4xl font-bold md:text-5xl">The Marketplace</h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-foreground/80">
            The heart of commerce in Haiphong. Buy, sell, and rent with the community.
          </p>
          <div className="mt-8 w-full max-w-xl mx-auto">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search the marketplace..." 
                className="w-full rounded-full border-0 bg-background p-4 pr-16 text-lg shadow-md focus:ring-2 focus:ring-accent focus:ring-inset"
              />
              <button className="absolute top-1/2 right-2 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-accent text-white transition-colors hover:bg-accent/90">
                <Search className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Category Links */}
      <section className="container mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 text-center md:grid-cols-3">
          {categories.map((category) => {
            const Icon = iconByType(category.slug);
            const imageUrl = imageByType(category.slug);
            return (
              <Link href={`/marketplace/${category.slug}`} key={category.id} className="group block">
              <div className="relative mx-auto flex h-32 w-32 items-center justify-center rounded-full bg-secondary shadow-lg transition-transform duration-300 ease-in-out group-hover:scale-105">
                  <Image src={imageUrl} alt={category.name} fill className="object-cover rounded-full opacity-20" />
                  <Icon className="relative h-16 w-16 text-primary transition-colors group-hover:text-accent" />
              </div>
                <h3 className="mt-6 font-heading text-2xl font-bold text-foreground">{category.name}</h3>
            </Link>
          );})}
        </div>
      </section>

      {/* Featured Items Section */}
      <section className="bg-secondary py-20">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <h2 className="font-heading text-3xl font-bold text-foreground">Featured Items</h2>
            <Link href="/marketplace/all" className="text-primary font-semibold hover:underline">
              View All
            </Link>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {featured.map((item) => (
              <Card
                key={item.id}
                href={`/marketplace/${item.category}/${item.id}`}
                title={item.title}
                description={item.description.slice(0, 80)}
                imageUrls={item.imageUrls}
                price={item.price}
              />
            ))}
            {!featured.length && (
              <p className="text-foreground/70">No marketplace items yet. Be the first to list something!</p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

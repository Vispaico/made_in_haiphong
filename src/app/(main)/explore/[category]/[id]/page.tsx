// src/app/(main)/explore/[category]/[id]/page.tsx

import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import ImageCarousel from '@/components/common/ImageCarousel';
import Map from '@/components/common/Map';
import { MapPin } from 'lucide-react';

// THE FIX: Add Incremental Static Regeneration
export const revalidate = 60;

type ExploreDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ExploreDetailPage({ params }: ExploreDetailPageProps) {
  const { id } = await params;
  const entry = await prisma.exploreEntry.findUnique({ where: { id } });

  if (!entry) notFound();
  
  const location: [number, number] | null = entry.latitude && entry.longitude ? [entry.latitude, entry.longitude] : null;

  return (
    <div className="bg-secondary">
      <div className="container mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <ImageCarousel images={entry.imageUrls} />
        <div className="mt-8 grid grid-cols-1 gap-12 md:grid-cols-3">
          <div className="md:col-span-2">
            <h1 className="font-heading text-4xl font-bold text-foreground">{entry.title}</h1>
            {entry.address && (<div className="mt-3 flex items-center gap-1.5 text-foreground/80"><MapPin className="h-5 w-5" /><span>{entry.address}</span></div>)}
            <div className="mt-8">
              <h2 className="font-heading text-2xl font-bold text-foreground">About this Place</h2>
              <div className="prose prose-lg mt-4 max-w-none text-foreground/80" dangerouslySetInnerHTML={{ __html: entry.body.replace(/\n/g, '<br />') }} />
            </div>
            {location && (<div className="mt-8"><h2 className="font-heading text-2xl font-bold text-foreground">Location on Map</h2><div className="mt-4 h-80 w-full rounded-lg overflow-hidden"><Map location={location} /></div></div>)}
          </div>
          <div className="md:col-span-1">
            <div className="sticky top-28 rounded-lg border border-secondary bg-background p-6 shadow-lg"><h3 className="font-heading text-xl font-bold text-foreground">Explore More</h3><p className="mt-2 text-foreground/70">Find other interesting places in Haiphong.</p></div>
          </div>
        </div>
      </div>
    </div>
  );
}
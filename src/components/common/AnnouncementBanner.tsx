// src/components/common/AnnouncementBanner.tsx

import prisma from '@/lib/prisma';
import { Megaphone } from 'lucide-react';
import { unstable_cache as cache } from 'next/cache';

// This function fetches the announcement and is cached.
const getCachedAnnouncement = cache(
  async () => {
    const announcement = await prisma.announcement.findFirst({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
    });
    return announcement;
  },
  ['active-announcement'], // A unique key for this cache entry
  { revalidate: 60 } // Revalidate the cache every 60 seconds
);

export default async function AnnouncementBanner() {
  const announcement = await getCachedAnnouncement();

  if (!announcement) {
    return null;
  }

  return (
    <div className="relative bg-primary px-4 py-3 text-white">
      <div className="container mx-auto flex max-w-7xl items-center justify-center text-center text-sm font-medium">
        <Megaphone className="mr-3 h-5 w-5 flex-shrink-0" />
        <p>{announcement.message}</p>
      </div>
    </div>
  );
}
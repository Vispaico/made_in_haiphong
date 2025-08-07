// src/components/common/AnnouncementBanner.tsx

import prisma from '@/lib/prisma';
// THE FIX: The unused 'X' icon has been removed.
import { Megaphone } from 'lucide-react';

// This is a Server Component, so it can fetch data directly.
export default async function AnnouncementBanner() {
  // Find the most recent announcement that is currently active.
  const announcement = await prisma.announcement.findFirst({
    where: {
      isActive: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  // If no active announcement is found, render nothing.
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
import prisma from '@/lib/prisma';
import ExploreClient from '@/components/explore/ExploreClient';

export const revalidate = 60;

export default async function ExplorePage() {
  const listings = await prisma.listing.findMany({
    where: {
      latitude: { not: null },
      longitude: { not: null },
    },
    orderBy: [{ isFeatured: 'desc' }, { createdAt: 'desc' }],
    take: 40,
  });

  return (
    <ExploreClient
      listings={listings.map((listing) => ({
        ...listing,
        address: listing.description.split('\n')[0] || 'Haiphong, Vietnam',
      }))}
    />
  );
}

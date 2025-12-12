import prisma from '@/lib/prisma';
import { BookingStatus, Listing } from '@prisma/client';
import type { Session } from 'next-auth';

type DateRange = { from: Date; to: Date };

const parseDate = (value: string, label: string) => {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.valueOf())) throw new Error(`${label} is invalid. Use YYYY-MM-DD.`);
  return parsed;
};

const hasConflict = async (listingId: string, range: DateRange) => {
  const overlap = await prisma.booking.findFirst({
    where: {
      listingId,
      status: { in: [BookingStatus.PENDING, BookingStatus.CONFIRMED] },
      NOT: [
        { endDate: { lte: range.from } },
        { startDate: { gte: range.to } },
      ],
    },
  });
  return Boolean(overlap);
};

const findAccommodation = async (location: string) => {
  return prisma.listing.findFirst({
    where: {
      category: 'accommodation',
      OR: [
        { title: { contains: location, mode: 'insensitive' } },
        { description: { contains: location, mode: 'insensitive' } },
      ],
    },
    orderBy: { createdAt: 'desc' },
  });
};

const formatListingSummary = (listing: Listing) => ({
  id: listing.id,
  title: listing.title,
  address: listing.description.slice(0, 120),
  price: listing.price,
  image: listing.imageUrls[0] ?? null,
});

export const createTravelSDK = (session: Session | null) => {
  const requireSession = () => {
    if (!session?.user?.id) throw new Error('Please sign in to continue.');
    return session.user.id;
  };

  return {
    searchTransport: async ({ destination, date }: { destination: string; date: string }) => {
      const listings = await prisma.listing.findMany({
        where: {
          category: { in: ['transport', 'rentals', 'services'] },
          OR: [
            { title: { contains: destination, mode: 'insensitive' } },
            { description: { contains: destination, mode: 'insensitive' } },
          ],
        },
        orderBy: { createdAt: 'desc' },
        take: 5,
      });

      return {
        status: listings.length ? 'success' : 'no_results',
        requestedDate: date,
        results: listings.map((listing) => ({
          provider: listing.title,
          price: listing.price,
          summary: listing.description.slice(0, 140),
          link: `/marketplace/${listing.category}/${listing.id}`,
        })),
      };
    },

    bookAccommodation: async ({ location, checkIn, checkOut }: { location: string; checkIn: string; checkOut: string }) => {
      const userId = requireSession();
      const range = { from: parseDate(checkIn, 'Check-in date'), to: parseDate(checkOut, 'Check-out date') };
      if (range.from >= range.to) throw new Error('Check-out date must be after check-in date.');

      const listing = await findAccommodation(location);
      if (!listing) throw new Error('No accommodation matches that location yet.');

      const conflict = await hasConflict(listing.id, range);
      if (conflict) throw new Error('Those dates are no longer available. Try new dates or another stay.');

      const booking = await prisma.booking.create({
        data: {
          listingId: listing.id,
          userId,
          startDate: range.from,
          endDate: range.to,
          status: BookingStatus.PENDING,
        },
        include: { listing: { select: { authorId: true } } },
      });

      await prisma.activity.create({
        data: {
          type: 'NEW_BOOKING_REQUEST',
          userId: booking.listing.authorId,
          initiatorId: userId,
          link: `/dashboard/bookings/${booking.id}`,
        },
      });

      return {
        status: 'success',
        bookingId: booking.id,
        listing: formatListingSummary(listing),
        message: 'Request submitted. Hosts will confirm shortly.',
      };
    },

    findDining: async ({ cuisine, area }: { cuisine: string; area: string }) => {
      const entries = await prisma.exploreEntry.findMany({
        where: {
          category: 'food-and-drink',
          AND: [
            { title: { contains: cuisine, mode: 'insensitive' } },
            { address: { contains: area, mode: 'insensitive' } },
          ],
        },
        orderBy: { createdAt: 'desc' },
        take: 5,
      });

      return {
        status: entries.length ? 'success' : 'no_results',
        recommendations: entries.map((entry) => ({
          name: entry.title,
          address: entry.address,
          highlight: entry.description.slice(0, 160),
          link: `/explore/food-and-drink/${entry.id}`,
        })),
        fallback: entries.length ? null : 'No curated dining spots match that search yet. Try a broader area or different cuisine.',
      };
    },
  };
};

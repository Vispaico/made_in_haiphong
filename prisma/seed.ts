// prisma/seed.ts
import { PrismaClient, CategoryType, PostStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function upsertSeedUser() {
  const testEmail = 'test@example.com';

  let user = await prisma.user.findFirst({
    where: {
      accounts: {
        some: {
          provider: 'credentials',
          providerAccountId: testEmail,
        },
      },
    },
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        name: 'Test User',
        email: testEmail,
        loyaltyBalance: 120,
        accounts: {
          create: {
            provider: 'credentials',
            providerAccountId: testEmail,
            type: 'email',
          },
        },
      },
    });
    console.log(`Created new seed user: ${user.name} (${user.id})`);
  }

  return user;
}

async function seedCategories() {
  const categories = [
    { name: 'Rentals', slug: 'rentals', type: CategoryType.MARKETPLACE },
    { name: 'For Sale', slug: 'for-sale', type: CategoryType.MARKETPLACE },
    { name: 'Services', slug: 'services', type: CategoryType.MARKETPLACE },
    { name: 'Food & Drink', slug: 'food-and-drink', type: CategoryType.EXPLORE },
    { name: 'Sights & Culture', slug: 'sights-and-culture', type: CategoryType.EXPLORE },
    { name: 'Nightlife', slug: 'nightlife', type: CategoryType.EXPLORE },
  ];

  await Promise.all(
    categories.map((category) =>
      prisma.category.upsert({
        where: { slug: category.slug },
        update: category,
        create: category,
      })
    )
  );

  console.log('✅ Categories ready');
}

async function seedListings(userId: string) {
  const listings = [
    {
      title: 'Lan Ha Bay View Villa',
      description:
        'Wake up to panoramic views of Lan Ha Bay in this airy three-bedroom villa. Includes complimentary breakfast and private boat charter options.',
      category: 'rentals',
      price: 3200000,
      imageUrls: ['/images/stay-1.jpg', '/images/stay-2.jpg'],
      maxGuests: 6,
      bedrooms: 3,
      latitude: 20.8443,
      longitude: 106.9996,
      isFeatured: true,
    },
    {
      title: 'Old Quarter Coffee Cart Franchise',
      description:
        'Turnkey Vietnamese coffee cart with POS, supplier relationships, and branding. Perfect for Ngo Quyen foot traffic.',
      category: 'for-sale',
      price: 45000000,
      imageUrls: ['/images/market-for-sale.jpg'],
      isFeatured: true,
    },
    {
      title: 'Guided Cat Ba Photography Tour',
      description:
        'Sunrise-to-sunset photography tour covering floating villages, Cannon Fort, and secret beaches. Includes drone footage add-on.',
      category: 'services',
      price: 1200000,
      imageUrls: ['/images/explore-sights.jpg'],
    },
  ];

  for (const listing of listings) {
    const existing = await prisma.listing.findFirst({ where: { title: listing.title } });
    if (!existing) {
      await prisma.listing.create({
        data: {
          ...listing,
          authorId: userId,
        },
      });
    }
  }

  console.log('✅ Listings ready');
}

async function seedExploreEntries() {
  const entries = [
    {
      title: 'Hai Phong Old Quarter Food Crawl',
      description: 'Five iconic stops for bánh đa cua, nem cua bể, and Hải Phòng coffee.',
      body: 'Map out a full evening tasting through Tam Bạc with curated vendors vetted by locals.',
      imageUrls: ['/images/explore-food.jpg'],
      category: 'food-and-drink',
      address: 'Tam Bạc Walking Street',
      latitude: 20.8614,
      longitude: 106.6800,
    },
    {
      title: 'Sunset at Do Son Peninsula',
      description: 'Hidden viewpoints for golden hour with kitesurfers and fishing fleets.',
      body: 'Rent a scooter and follow the coastal road to Area II for the best vantage.',
      imageUrls: ['/images/explore-sights.jpg'],
      category: 'sights-and-culture',
      address: 'Đồ Sơn District',
      latitude: 20.7142,
      longitude: 106.7932,
    },
  ];

  for (const entry of entries) {
    const existing = await prisma.exploreEntry.findFirst({ where: { title: entry.title } });
    if (!existing) {
      await prisma.exploreEntry.create({ data: entry });
    }
  }

  console.log('✅ Explore entries ready');
}

async function seedPosts(userId: string) {
  const posts = [
    {
      content:
        "Just had the most amazing Bánh đa cua at a stall near the Opera House. The broth was incredible! Highly recommend finding it if you're in the area.",
      imageUrls: [],
      status: PostStatus.APPROVED,
    },
    {
      content:
        'Tip for anyone visiting Cat Ba: rent a motorbike to explore the island yourself! Hidden beaches are everywhere.',
      imageUrls: ['/images/community-post-1.jpg'],
      status: PostStatus.APPROVED,
    },
  ];

  for (const post of posts) {
    const exists = await prisma.post.findFirst({ where: { content: post.content } });
    if (!exists) {
      await prisma.post.create({
        data: {
          ...post,
          authorId: userId,
        },
      });
    }
  }

  console.log('✅ Community posts ready');
}

async function seedArticles(userId: string) {
  const articles = [
    {
      title: '48 Hours in Haiphong: Insider Edition',
      slug: '48-hours-in-haiphong',
      featuredImage: '/images/articles-hero.jpg',
      content: 'Plan sunrise pho, port rides, and rooftop bars with this fast-track guide.',
      published: true,
      authorId: userId,
    },
  ];

  for (const article of articles) {
    await prisma.article.upsert({
      where: { slug: article.slug },
      update: article,
      create: article,
    });
  }

  console.log('✅ Articles ready');
}

async function seedLoyaltyTransactions(userId: string) {
  const transactions = [
    { points: 50, reason: 'Booking confirmed', sourceType: 'BOOKING' },
    { points: 20, reason: 'Community spotlight bonus', sourceType: 'COMMUNITY' },
  ];

  for (const tx of transactions) {
    await prisma.loyaltyTransaction.create({
      data: {
        userId,
        ...tx,
      },
    });
  }

  console.log('✅ Loyalty transactions ready');
}

async function seedAnnouncements() {
  const message = '🎉 Welcome to Made in Haiphong v2 – stay tuned for loyalty drops every Friday!';
  const exists = await prisma.announcement.findFirst({ where: { message } });
  if (!exists) {
    await prisma.announcement.create({ data: { message } });
  }
  console.log('✅ Announcement ready');
}

async function main() {
  const user = await upsertSeedUser();
  await seedCategories();
  await seedListings(user.id);
  await seedExploreEntries();
  await seedPosts(user.id);
  await seedArticles(user.id);
  await seedLoyaltyTransactions(user.id);
  await seedAnnouncements();
  console.log('✨ Database seeded successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

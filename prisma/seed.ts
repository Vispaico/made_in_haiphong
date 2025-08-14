// prisma/seed.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: {},
    create: {
      name: 'Test User',
      email: 'test@example.com',
    },
  });

  console.log(`Seeding posts for user: ${user.name} (${user.id})`);

  // Create sample posts
  await prisma.post.create({
    data: {
      content: "Just had the most amazing Bánh đa cua at a stall near the Opera House. The broth was incredible! Highly recommend finding it if you're in the area.",
      // No image for this post, imageUrls will default to an empty array []
      authorId: user.id,
    },
  });

  await prisma.post.create({
    data: {
      content: "Tip for anyone visiting Cat Ba: rent a motorbike to explore the island yourself! It's much cheaper than a tour and you can find so many hidden beaches. The road through the national park is breathtaking.",
      // THE FIX IS HERE: Changed 'imageUrl' to 'imageUrls' and provided an array.
      imageUrls: ['/images/community-post-1.jpg'],
      authorId: user.id,
    },
  });

  console.log('Database has been seeded.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

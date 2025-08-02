// prisma/seed.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Find a user to be the author of the posts.
  // We'll try to find the user created via Google login.
  // If not found, we'll create a new one.
  let user = await prisma.user.findFirst();
  if (!user) {
    user = await prisma.user.create({
      data: {
        name: 'Test User',
        email: 'test@example.com',
      },
    });
  }
  
  console.log(`Seeding posts for user: ${user.name} (${user.id})`);

  // Create sample posts
  await prisma.post.create({
    data: {
      content: "Just had the most amazing Bánh đa cua at a stall near the Opera House. The broth was incredible! Highly recommend finding it if you're in the area.",
      authorId: user.id,
    },
  });

  await prisma.post.create({
    data: {
      content: "Tip for anyone visiting Cat Ba: rent a motorbike to explore the island yourself! It's much cheaper than a tour and you can find so many hidden beaches. The road through the national park is breathtaking.",
      imageUrl: '/images/community-post-1.jpg',
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
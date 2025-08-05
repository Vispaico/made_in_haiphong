// src/app/(main)/community/page.tsx

import prisma from '@/lib/prisma';
import CommunityFeedClient from '@/components/community/CommunityFeedClient';

export const revalidate = 60;

async function getPosts() {
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      // THE FIX: Added `id` to the author select
      author: { select: { id: true, name: true, image: true } },
      _count: {
        select: { comments: true, likes: true },
      },
    },
  });
  return posts;
}

export default async function CommunityPage() {
  const posts = await getPosts();

  return (
    <div className="bg-secondary py-12">
      <div className="container mx-auto max-w-2xl px-4">
        <div className="text-center mb-12">
          <h1 className="font-heading text-4xl font-bold text-foreground">Community Feed</h1>
          <p className="mx-auto mt-2 max-w-2xl text-lg text-foreground/80">
            See tips, tricks, and stories from locals and travelers.
          </p>
        </div>
        
        <CommunityFeedClient initialPosts={posts} />
      </div>
    </div>
  );
}
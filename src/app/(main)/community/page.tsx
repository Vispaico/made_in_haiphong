// src/app/(main)/community/page.tsx

import prisma from '@/lib/prisma';
import CommunityFeedClient from '@/components/community/CommunityFeedClient';

// This line enables Incremental Static Regeneration.
// It tells Vercel to cache this page and rebuild it at most once every 60 seconds.
export const revalidate = 60;

// This is a simplified function to get only the public post data.
async function getPosts() {
  console.log("--- FETCHING STATIC POSTS FROM DATABASE (CACHE MISS / REVALIDATION) ---");
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      author: { select: { name: true, image: true } },
      _count: {
        select: { comments: true, likes: true },
      },
    },
  });
  return posts;
}

export default async function CommunityPage() {
  // This page now ONLY fetches the static, public data.
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
        
        {/* We pass the static data to our new client component, which handles all user interactions */}
        <CommunityFeedClient initialPosts={posts} />
      </div>
    </div>
  );
}
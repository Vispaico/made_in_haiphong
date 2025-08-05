// src/app/(main)/community/page.tsx

import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import Image from 'next/image';
import Link from 'next/link';
import { MessageSquare } from 'lucide-react';
import prisma from '@/lib/prisma';
import CreatePostForm from '@/components/community/CreatePostForm';
import LikeButton from '@/components/community/LikeButton';
import { cache } from 'react'; // THE FIX: Import the 'cache' function from React

// THE FIX: Create a cached function to get all public post data.
// This function's result will be cached and shared across all users.
const getPosts = cache(async () => {
  console.log("--- FETCHING POSTS FROM DATABASE (CACHE MISS) ---");
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
});

export default async function CommunityPage() {
  const session = await getServerSession(authOptions);
  
  // 1. Fetch the cached, public post data. This will be very fast.
  const posts = await getPosts();

  // 2. If the user is logged in, fetch their specific likes. This is a small, separate query.
  const userLikes = session?.user?.id ? await prisma.like.findMany({
    where: {
      userId: session.user.id,
      // Only fetch likes for the posts that are currently being displayed
      postId: { in: posts.map(p => p.id) },
    },
    select: {
      postId: true,
    },
  }) : [];

  // Create a quick lookup set for checking if a post is liked by the current user
  const likedPostIds = new Set(userLikes.map(like => like.postId));

  return (
    <div className="bg-secondary py-12">
      <div className="container mx-auto max-w-2xl px-4">
        <div className="text-center mb-12">
          <h1 className="font-heading text-4xl font-bold text-foreground">Community Feed</h1>
          <p className="mx-auto mt-2 max-w-2xl text-lg text-foreground/80">
            See tips, tricks, and stories from locals and travelers.
          </p>
        </div>
        
        {session?.user && <CreatePostForm />}
        
        <div className="space-y-8">
          {posts.map((post) => (
            <div key={post.id} className="rounded-xl border border-secondary bg-background p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <Image src={post.author.image || '/images/avatar-default.png'} alt={post.author.name || 'User'} width={40} height={40} className="rounded-full"/>
                <span className="font-semibold text-foreground">{post.author.name}</span>
              </div>
              <p className="mt-4 whitespace-pre-wrap text-foreground/90">{post.content}</p>
              
              {post.imageUrls && post.imageUrls.length > 0 && (
                <div className="relative mt-4 aspect-video w-full overflow-hidden rounded-lg">
                  <Image 
                    src={post.imageUrls[0]} 
                    alt="Community post image" 
                    fill 
                    className="object-cover" 
                  />
                </div>
              )}
              
              <div className="mt-4 flex items-center gap-6 border-t border-secondary pt-4">
                {/* THE FIX: The `isInitiallyLiked` prop is now determined by our separate, dynamic query */}
                <LikeButton 
                  postId={post.id}
                  initialLikes={post._count.likes}
                  isInitiallyLiked={likedPostIds.has(post.id)}
                />
                <Link href={`/community/${post.id}`} className="flex items-center gap-1.5 transition-colors hover:text-primary">
                  <MessageSquare className="h-5 w-5 text-foreground/70" />
                  <span className="text-sm text-foreground/70">{post._count.comments} Comments</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
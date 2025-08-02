// src/app/(main)/community/page.tsx

import Image from 'next/image';
import Link from 'next/link';
import { Heart, MessageSquare } from 'lucide-react';

// Sample data for community posts
const communityPosts = [
  {
    id: 'post-1',
    author: 'Sarah L.',
    authorAvatar: '/images/avatar-1.jpg', // Add avatar images
    content: "Just had the most amazing Bánh đa cua at a stall near the Opera House. The broth was incredible! Highly recommend finding it if you're in the area.",
    likes: 42,
    comments: 8,
  },
  {
    id: 'post-2',
    author: 'Anh Tuan',
    authorAvatar: '/images/avatar-2.jpg', // Add avatar images
    content: "Tip for anyone visiting Cat Ba: rent a motorbike to explore the island yourself! It's much cheaper than a tour and you can find so many hidden beaches. The road through the national park is breathtaking.",
    imageUrl: '/images/community-post-1.jpg', // Add post images
    likes: 112,
    comments: 19,
  },
];

export default function CommunityPage() {
  return (
    <div className="bg-secondary py-12">
      <div className="container mx-auto max-w-2xl px-4">
        {/* Header and "Create Post" button */}
        <div className="text-center">
          <h1 className="font-heading text-4xl font-bold text-foreground">Community Feed</h1>
          <p className="mx-auto mt-2 max-w-2xl text-lg text-foreground/80">
            See tips, tricks, and stories from locals and travelers.
          </p>
          <div className="mt-6">
            <button className="rounded-lg bg-accent px-6 py-2.5 font-bold text-white shadow-md transition-transform hover:scale-105">
              Create a Post
            </button>
          </div>
        </div>

        {/* Feed Container */}
        <div className="mt-12 space-y-8">
          {communityPosts.map((post) => (
            <div key={post.id} className="rounded-xl border border-secondary bg-background p-6 shadow-sm">
              {/* Post Header */}
              <div className="flex items-center gap-3">
                <Image 
                  src={post.authorAvatar} 
                  alt={post.author} 
                  width={40} 
                  height={40} 
                  className="rounded-full"
                />
                <span className="font-semibold text-foreground">{post.author}</span>
              </div>

              {/* Post Content */}
              <p className="mt-4 text-foreground/90">{post.content}</p>

              {/* Optional Post Image */}
              {post.imageUrl && (
                <div className="relative mt-4 aspect-video w-full overflow-hidden rounded-lg">
                  <Image src={post.imageUrl} alt="Community post image" fill className="object-cover" />
                </div>
              )}

              {/* Post Footer (Likes & Comments) */}
              <div className="mt-4 flex items-center gap-6 border-t border-secondary pt-4 text-sm text-foreground/70">
                <button className="flex items-center gap-1.5 transition-colors hover:text-accent">
                  <Heart className="h-5 w-5" />
                  <span>{post.likes} Likes</span>
                </button>
                <Link href={`/community/${post.id}`} className="flex items-center gap-1.5 transition-colors hover:text-primary">
                  <MessageSquare className="h-5 w-5" />
                  <span>{post.comments} Comments</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
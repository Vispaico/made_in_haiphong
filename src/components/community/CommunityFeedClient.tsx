// src/components/community/CommunityFeedClient.tsx
'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Post as PostType } from '@prisma/client'; // Import the real Post type
import Image from 'next/image';
import Link from 'next/link';
import { MessageSquare } from 'lucide-react';
import CreatePostForm from './CreatePostForm';
import LikeButton from './LikeButton';

// Define a more complete type for our posts, including the relations
type PostWithRelations = PostType & {
  author: { name: string | null; image: string | null };
  _count: { comments: number; likes: number };
};

interface CommunityFeedClientProps {
  initialPosts: PostWithRelations[];
}

export default function CommunityFeedClient({ initialPosts }: CommunityFeedClientProps) {
  const { data: session } = useSession();
  const [likedPostIds, setLikedPostIds] = useState<Set<string>>(new Set());

  // This effect runs on the client after the page loads
  useEffect(() => {
    // If the user is logged in, fetch their specific likes
    if (session?.user?.id) {
      const fetchLikes = async () => {
        try {
          const res = await fetch('/api/user/likes');
          const likedIds: string[] = await res.json();
          setLikedPostIds(new Set(likedIds));
        } catch (error) {
          console.error("Failed to fetch user likes", error);
        }
      };
      fetchLikes();
    }
  }, [session]); // Re-run if the session changes

  return (
    <>
      {/* The CreatePostForm is now rendered on the client, based on the session */}
      {session?.user && <CreatePostForm />}
      
      <div className="space-y-8">
        {initialPosts.map((post) => (
          <div key={post.id} className="rounded-xl border border-secondary bg-background p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <Image src={post.author.image || '/images/avatar-default.png'} alt={post.author.name || 'User'} width={40} height={40} className="rounded-full"/>
              <span className="font-semibold text-foreground">{post.author.name}</span>
            </div>
            <p className="mt-4 whitespace-pre-wrap text-foreground/90">{post.content}</p>
            
            {post.imageUrls && post.imageUrls.length > 0 && (
              <div className="relative mt-4 aspect-video w-full overflow-hidden rounded-lg">
                <Image src={post.imageUrls[0]} alt="Community post image" fill className="object-cover" />
              </div>
            )}
            
            <div className="mt-4 flex items-center gap-6 border-t border-secondary pt-4">
              <LikeButton 
                postId={post.id}
                initialLikes={post._count.likes}
                // The liked status is now determined by our dynamic client-side state
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
    </>
  );
}
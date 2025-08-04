// src/app/(main)/community/page.tsx

import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import Image from 'next/image';
import Link from 'next/link';
import { MessageSquare } from 'lucide-react';
import prisma from '@/lib/prisma';
import CreatePostForm from '@/components/community/CreatePostForm';
import LikeButton from '@/components/community/LikeButton';

export default async function CommunityPage() {
  const session = await getServerSession(authOptions);
  
  // The Prisma query remains the same, as it already fetches all necessary data.
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      author: { select: { name: true, image: true } },
      likes: {
        where: {
          userId: session?.user?.id,
        },
        select: { userId: true },
      },
      _count: {
        select: { comments: true, likes: true },
      },
    },
  });

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
              
              {/* THE FIX IS HERE: We now check the `imageUrls` array. */}
              {/* If the array has images, we display the FIRST one as a preview. */}
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
                <LikeButton 
                  postId={post.id}
                  initialLikes={post._count.likes}
                  isInitiallyLiked={post.likes.length > 0}
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
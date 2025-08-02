// src/app/(main)/community/[post_id]/page.tsx

import Image from 'next/image';
import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import CommentForm from '@/components/community/CommentForm';
import LikeButton from '@/components/community/LikeButton';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export default async function PostDetailPage({ params }: { params: { post_id: string } }) {
  const session = await getServerSession(authOptions);

  const post = await prisma.post.findUnique({
    where: { id: params.post_id },
    include: {
      author: { select: { name: true, image: true } },
      comments: {
        orderBy: { createdAt: 'asc' },
        include: {
          author: { select: { name: true, image: true } },
        },
      },
      likes: {
        where: { userId: session?.user?.id },
        select: { userId: true },
      },
      _count: {
        select: { likes: true },
      },
    },
  });

  if (!post) {
    notFound();
  }

  return (
    <div className="bg-background py-12">
      <div className="container mx-auto max-w-2xl px-4">
        <div className="rounded-xl border border-secondary bg-background p-6">
          <div className="flex items-center gap-3">
            <Image src={post.author.image || '/images/avatar-default.png'} alt={post.author.name || 'User'} width={40} height={40} className="rounded-full"/>
            <span className="font-semibold text-foreground">{post.author.name}</span>
          </div>
          <p className="mt-4 whitespace-pre-wrap text-lg text-foreground/90">{post.content}</p>
          {post.imageUrl && (
            <div className="relative mt-4 aspect-video w-full overflow-hidden rounded-lg">
              <Image src={post.imageUrl} alt="Community post image" fill className="object-cover" />
            </div>
          )}
          <div className="mt-4 flex items-center gap-4 border-t border-secondary pt-4">
            <LikeButton
              postId={post.id}
              initialLikes={post._count.likes}
              isInitiallyLiked={post.likes.length > 0}
            />
          </div>
        </div>
        <div className="mt-10">
          <h2 className="font-heading text-2xl font-bold text-foreground">Comments ({post.comments.length})</h2>
          <CommentForm postId={post.id} />
          <div className="mt-6 space-y-6">
            {post.comments.map((comment) => (
              <div key={comment.id} className="flex items-start gap-3">
                <Image src={comment.author.image || '/images/avatar-default.png'} alt={comment.author.name || 'User'} width={36} height={36} className="rounded-full"/>
                <div className="flex-1 rounded-lg bg-secondary p-3">
                  <p className="font-semibold text-foreground">{comment.author.name}</p>
                  <p className="whitespace-pre-wrap text-foreground/80">{comment.text}</p>
                </div>
              </div>
            ))}
            {post.comments.length === 0 && (
                <p className="text-foreground/60">No comments yet. Be the first!</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
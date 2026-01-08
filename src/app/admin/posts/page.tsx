import prisma from '@/lib/prisma';
import AdminPostModeration from '@/components/admin/AdminPostModeration';
import Image from 'next/image';
import { formatDistanceToNow } from 'date-fns';

export default async function AdminPostsPage() {
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      author: { select: { name: true, image: true } },
    },
  });

  if (!posts.length) {
    return <p className="text-foreground/60">No community posts yet.</p>;
  }

  return (
    <div>
      <h1 className="font-heading text-3xl font-bold text-foreground">Community Moderation</h1>
      <p className="mt-2 text-lg text-foreground/70">Approve or reject community submissions.</p>

      <div className="mt-8 space-y-6">
        {posts.map((post) => (
          <div key={post.id} className="rounded-xl border border-secondary bg-background p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <Image src={post.author.image || '/images/avatar-default.png'} alt={post.author.name || 'User'} width={48} height={48} className="rounded-full" />
              <div>
                <p className="font-semibold">{post.author.name || 'Community Member'}</p>
                <p className="text-sm text-foreground/60">{formatDistanceToNow(post.createdAt, { addSuffix: true })}</p>
              </div>
              <span className="ml-auto rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide bg-secondary text-foreground/70">{post.status}</span>
            </div>

            <p className="mt-4 whitespace-pre-wrap text-foreground/90">{post.content}</p>

            {post.imageUrls?.length ? (
              <div className="mt-4 grid grid-cols-2 gap-4">
                {post.imageUrls.map((url) => (
                  <div key={url} className="relative h-40 overflow-hidden rounded-lg">
                    <Image src={url} alt="Post media" fill className="object-cover" />
                  </div>
                ))}
              </div>
            ) : null}

            <div className="mt-4">
              <AdminPostModeration postId={post.id} currentStatus={post.status} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

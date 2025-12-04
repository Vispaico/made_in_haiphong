// src/app/(main)/community/[post_id]/edit/page.tsx

import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { notFound, redirect } from 'next/navigation';
import EditPostForm from '@/components/community/EditPostForm';

// This Server Component fetches the post data
type EditPostPageProps = {
  params: Promise<{ post_id: string }>;
};

export default async function EditPostPage({ params }: EditPostPageProps) {
  const { post_id } = await params;
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect('/login');
  }

  const post = await prisma.post.findUnique({
    where: {
      id: post_id,
      // Security check: ensure the current user is the author
      authorId: session.user.id,
    },
  });

  if (!post) {
    notFound();
  }

  return (
    <div className="bg-secondary py-12">
      <div className="container mx-auto max-w-2xl px-4">
        <h1 className="font-heading text-3xl font-bold text-foreground">Edit Post</h1>
        <p className="mt-2 text-lg text-foreground/70">Update the details for your post below.</p>
        
        {/* Pass the post data down to the client form */}
        <EditPostForm post={post} />
      </div>
    </div>
  );
}
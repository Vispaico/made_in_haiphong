// src/app/(main)/community/page.tsx
import prisma from '@/lib/prisma';
import CommunityFeedClient from '@/components/community/CommunityFeedClient';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import Link from 'next/link';
import Image from 'next/image';
import { PlusCircle, Hash, Award } from 'lucide-react';

export const revalidate = 60;

async function getPosts() {
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: 'desc' },
    take: 20, // Limit the number of posts on initial load
    include: {
      author: { select: { id: true, name: true, image: true } },
      _count: {
        select: { comments: true, likes: true },
      },
    },
  });
  return posts;
}

// Mock data for sidebar widgets
const trendingTags = ["#haiphongfood", "#catba", "#hiddengems", "#nightlife", "#coffee"];
const topContributors = [
  { id: '1', name: 'An Nguyen', image: '/images/avatar-default.png' },
  { id: '2', name: 'Bao Tran', image: '/images/avatar-default.png' },
  { id: '3', name: 'Chi Pham', image: '/images/avatar-default.png' },
];

export default async function CommunityPage() {
  const posts = await getPosts();
  const session = await getServerSession(authOptions);

  return (
    <div className="bg-secondary py-12">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="text-center mb-12">
          <h1 className="font-heading text-4xl font-bold text-foreground">Community Hub</h1>
          <p className="mx-auto mt-2 max-w-2xl text-lg text-foreground/80">
            Connect, share, and discover with the Haiphong community.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {session?.user && (
              <div className="mb-8 rounded-xl border border-secondary bg-background p-6 shadow-sm">
                <h2 className="font-heading text-xl font-bold mb-4">Share your story</h2>
                <p className="text-foreground/80 mb-4">Have a tip, a question, or a story to share? Post it here for the community to see.</p>
                {/* This will be replaced by a modal trigger in a future step */}
                <Link href="/community/new" className="inline-flex items-center justify-center gap-2 rounded-lg bg-accent px-4 py-2.5 font-bold text-white shadow-md transition-transform hover:scale-105">
                  <PlusCircle className="h-5 w-5" />
                  <span>Create Post</span>
                </Link>
              </div>
            )}
            <CommunityFeedClient initialPosts={posts} />
          </div>

          {/* Sidebar */}
          <aside className="space-y-8">
            <div className="rounded-xl border border-secondary bg-background p-6 shadow-sm">
              <h3 className="font-heading text-lg font-bold mb-4 flex items-center gap-2">
                <Hash className="h-5 w-5 text-primary" />
                Trending Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {trendingTags.map(tag => (
                  <Link key={tag} href={`/community/tags/${tag.slice(1)}`} className="rounded-full bg-secondary px-3 py-1 text-sm text-foreground/80 hover:bg-primary hover:text-white">
                    {tag}
                  </Link>
                ))}
              </div>
            </div>
            <div className="rounded-xl border border-secondary bg-background p-6 shadow-sm">
              <h3 className="font-heading text-lg font-bold mb-4 flex items-center gap-2">
                <Award className="h-5 w-5 text-primary" />
                Top Contributors
              </h3>
              <ul className="space-y-3">
                {topContributors.map(user => (
                  <li key={user.id} className="flex items-center gap-3">
                    <Image src={user.image} alt={user.name} width={40} height={40} className="rounded-full object-cover" />
                    <span className="font-semibold">{user.name}</span>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

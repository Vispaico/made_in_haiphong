// src/app/(main)/community/[post_id]/page.tsx

import Image from 'next/image';
import { Heart } from 'lucide-react';

// Sample data (in a real app, you'd fetch the post and its comments)
const postData = {
    id: 'post-2',
    author: 'Anh Tuan',
    authorAvatar: '/images/avatar-2.jpg',
    content: "Tip for anyone visiting Cat Ba: rent a motorbike to explore the island yourself! It's much cheaper than a tour and you can find so many hidden beaches. The road through the national park is breathtaking.",
    imageUrl: '/images/community-post-1.jpg',
    likes: 112,
};

const comments = [
    { author: 'Laura', authorAvatar: '/images/avatar-3.jpg', text: "Totally agree! Did this last month and it was the highlight of my trip." },
    { author: 'Niels', authorAvatar: '/images/avatar-4.jpg', text: "Good advice! Any specific rental shop you'd recommend?" },
];

// THE FIX IS HERE: We destructure an empty object `{}` from the props,
// which means no variables are created, while still keeping the TypeScript type definition.
export default async function PostDetailPage({}: { params: { post_id: string } }) {
  return (
    <div className="bg-background py-12">
      <div className="container mx-auto max-w-2xl px-4">
        {/* Main Post */}
        <div className="rounded-xl border border-secondary bg-background p-6">
            <div className="flex items-center gap-3">
              <Image src={postData.authorAvatar} alt={postData.author} width={40} height={40} className="rounded-full"/>
              <span className="font-semibold text-foreground">{postData.author}</span>
            </div>
            <p className="mt-4 text-lg text-foreground/90">{postData.content}</p>
            {postData.imageUrl && (
              <div className="relative mt-4 aspect-video w-full overflow-hidden rounded-lg">
                <Image src={postData.imageUrl} alt="Community post image" fill className="object-cover" />
              </div>
            )}
            <div className="mt-4 flex items-center gap-4 border-t border-secondary pt-4 text-sm text-foreground/70">
              <button className="flex items-center gap-1.5 font-bold text-accent">
                <Heart className="h-5 w-5 text-accent" fill="currentColor"/>
                <span>{postData.likes} Likes</span>
              </button>
            </div>
        </div>

        {/* Comments Section */}
        <div className="mt-10">
            <h2 className="font-heading text-2xl font-bold text-foreground">Comments</h2>
            {/* Form to Add a Comment */}
            <div className="mt-4">
                <textarea className="w-full rounded-md border border-secondary bg-secondary p-2.5 text-foreground placeholder-foreground/50 focus:ring-2 focus:ring-primary" rows={3} placeholder="Write a comment..."></textarea>
                <button className="mt-2 rounded-lg bg-primary px-5 py-2 font-semibold text-white transition-colors hover:bg-primary/90">
                    Post Comment
                </button>
            </div>

            {/* List of Comments */}
            <div className="mt-6 space-y-6">
                {comments.map((comment, index) => (
                    <div key={index} className="flex items-start gap-3">
                        <Image src={comment.authorAvatar} alt={comment.author} width={36} height={36} className="rounded-full"/>
                        <div className="flex-1 rounded-lg bg-secondary p-3">
                            <p className="font-semibold text-foreground">{comment.author}</p>
                            <p className="text-foreground/80">{comment.text}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
}
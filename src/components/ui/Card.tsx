// src/components/ui/Card.tsx

import Image from 'next/image';
import Link from 'next/link';
import { Camera } from 'lucide-react';

interface CardProps {
  href: string;
  imageUrls: string[];
  title: string;
  description: string;
}

export default function Card({ href, imageUrls, title, description }: CardProps) {
  const previewImage = imageUrls && imageUrls.length > 0 ? imageUrls[0] : '/images/placeholder.png';
  const imageCount = imageUrls ? imageUrls.length : 0;

  return (
    <Link href={href} className="group block">
      {/* THE FIX: Added a border color transition for a more noticeable hover effect */}
      <div className="overflow-hidden rounded-xl border border-secondary bg-background shadow-lg transition-all duration-300 group-hover:shadow-xl group-hover:border-primary/50">
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image 
            src={previewImage} 
            alt={title} 
            fill 
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 30vw"
          />
          {imageCount > 1 && (
            <div className="absolute top-2 right-2 flex items-center gap-1 rounded-full bg-black/60 px-2 py-1 text-xs text-white backdrop-blur-sm">
              <Camera className="h-3 w-3" />
              <span>{imageCount}</span>
            </div>
          )}
        </div>
        {/* THE FIX: Added responsive padding (p-4 on mobile, p-6 on larger screens) */}
        <div className="p-4 sm:p-6">
          {/* THE FIX: Improved visual hierarchy. Title is larger and description is smaller and more subtle. */}
          <h3 className="font-heading text-lg font-bold leading-tight text-foreground sm:text-xl">{title}</h3>
          <p className="mt-2 text-sm text-foreground/70">{description}</p>
        </div>
      </div>
    </Link>
  );
}
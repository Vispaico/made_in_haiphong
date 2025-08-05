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
      <div className="overflow-hidden rounded-xl border border-secondary bg-background shadow-lg transition-shadow duration-300 group-hover:shadow-xl">
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image 
            src={previewImage} 
            alt={title} 
            fill 
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            // THE FIX IS HERE: Add the `sizes` prop for responsive image optimization.
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {imageCount > 1 && (
            <div className="absolute top-2 right-2 flex items-center gap-1 rounded-full bg-black/60 px-2 py-1 text-xs text-white">
              <Camera className="h-3 w-3" />
              <span>{imageCount}</span>
            </div>
          )}
        </div>
        <div className="p-6">
          <h3 className="font-heading text-xl font-bold text-foreground">{title}</h3>
          <p className="mt-2 text-base text-foreground/80">{description}</p>
        </div>
      </div>
    </Link>
  );
}
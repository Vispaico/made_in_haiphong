// src/components/common/ImageCarousel.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';

interface ImageCarouselProps {
  images: string[];
}

export default function ImageCarousel({ images }: ImageCarouselProps) {
  const hasImages = Boolean(images?.length);
  const initialImage = hasImages ? images[0] : '/images/placeholder.png';
  const [activeImage, setActiveImage] = useState(initialImage);

  if (!hasImages) {
    return (
      <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-secondary">
        <Image src={activeImage} alt="No image available" fill className="object-cover" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {/* Main Image Display */}
      <div className="relative aspect-video w-full overflow-hidden rounded-lg">
        <Image src={activeImage} alt="Main listing image" fill className="object-cover transition-opacity duration-300" />
      </div>

      {/* Thumbnails - only show if there is more than one image */}
      {images.length > 1 && (
        <div className="grid grid-cols-5 gap-2">
          {images.map((url) => (
            <button
              key={url}
              onClick={() => setActiveImage(url)}
              className={`relative aspect-square overflow-hidden rounded-md transition-all duration-200
                ${activeImage === url ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' : 'hover:opacity-80'}
              `}
            >
              <Image src={url} alt="Image thumbnail" fill className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
// src/components/common/ListingCard.tsx
import Link from 'next/link';
import Image from 'next/image';
import { BedDouble, Bath, Star } from 'lucide-react';

// This is a simplified card for map popups and list views.
export default function ListingCard({ listing }: { listing: any }) {
  return (
    <div className="w-64">
      <Link href={`/listings/${listing.id}`} className="group block">
        <div className="relative h-40 w-full overflow-hidden rounded-lg">
          <Image
            src={listing.imageUrls?.[0] || '/images/stay-placeholder.jpg'}
            alt={listing.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-110"
          />
        </div>
        <div className="mt-2">
          <h3 className="font-heading text-lg font-bold truncate">{listing.title}</h3>
          <p className="text-sm text-foreground/80 truncate">{listing.address}</p>
          <div className="mt-2 flex items-center justify-between">
            <p className="font-bold text-primary">${listing.price} / night</p>
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 text-yellow-500" />
              <span className="text-sm font-bold">4.8</span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}

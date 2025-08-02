import Image from 'next/image';
import Link from 'next/link';

interface CardProps {
  href: string;
  imageUrl: string;
  title: string;
  description: string;
}

export default function Card({ href, imageUrl, title, description }: CardProps) {
  return (
    <Link href={href} className="group block">
      <div className="overflow-hidden rounded-xl border border-secondary bg-background shadow-lg transition-shadow duration-300 group-hover:shadow-xl">
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image 
            src={imageUrl} 
            alt={title} 
            fill 
            className="object-cover transition-transform duration-300 group-hover:scale-105" 
          />
        </div>
        <div className="p-6">
          <h3 className="font-heading text-xl font-bold text-foreground">{title}</h3>
          <p className="mt-2 text-base text-foreground/80">{description}</p>
        </div>
      </div>
    </Link>
  );
}
// src/app/(main)/explore/[category]/page.tsx

import Card from '@/components/ui/Card';
import { notFound } from 'next/navigation';

const listingsData = {
  'food-and-drink': {
    name: 'Food & Drink',
    items: [
      { href: "/explore/food-and-drink/banh-da-cua", title: "Bánh Đa Cua Bà Cụ", description: "The most authentic crab noodle soup.", imageUrl: "/images/food-1.jpg" },
      { href: "/explore/food-and-drink/nem-cua-be", title: "Nem Cua Bể Chợ Cố Đạo", description: "Famous crispy crab spring rolls.", imageUrl: "/images/food-2.jpg" },
    ]
  },
  'sights-and-culture': {
    name: 'Sights & Culture',
    items: [
      { href: "/explore/sights-and-culture/cat-ba-island", title: "Cat Ba Island", description: "Pristine beaches and lush national parks.", imageUrl: "/images/sight-1.jpg" },
      { href: "/explore/sights-and-culture/opera-house", title: "Haiphong Opera House", description: "Stunning French colonial architecture.", imageUrl: "/images/sight-2.jpg" },
    ]
  },
};

export default async function CategoryPage({ params }: { params: { category: string } }) {
  const categoryKey = params.category as keyof typeof listingsData;
  const category = listingsData[categoryKey];

  if (!category) {
    notFound();
  }

  return (
    <div className="bg-background py-16">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="font-heading text-4xl font-bold text-foreground">{category.name}</h1>
        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {category.items.map((item) => (
            // FIX: Removed the duplicate 'href' prop. The spread handles it.
            <Card key={item.href} {...item} />
          ))}
        </div>
      </div>
    </div>
  );
}
// src/app/articles/page.tsx
import prisma from '@/lib/prisma';
import Link from 'next/link';
import Image from 'next/image';

async function getPublishedArticles() {
  const articles = await prisma.article.findMany({
    where: { published: true },
    orderBy: { createdAt: 'desc' },
  });
  return articles;
}

export default async function ArticlesPage() {
  const articles = await getPublishedArticles();

  return (
    <div className="bg-white py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="font-heading text-4xl font-bold text-foreground">Articles</h1>
          <p className="mx-auto mt-2 max-w-2xl text-lg text-foreground/80">
            Read our latest stories and articles.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article) => (
            <Link key={article.id} href={`/articles/${article.slug}`}>
              <div className="bg-background rounded-lg shadow-md overflow-hidden transform transition-transform hover:scale-105">
                {article.featuredImage && (
                  <div className="relative h-48 w-full">
                    <Image src={article.featuredImage} alt={article.title} layout="fill" objectFit="cover" />
                  </div>
                )}
                <div className="p-6">
                  <h2 className="font-heading text-xl font-bold text-foreground mb-2">{article.title}</h2>
                  <p className="text-foreground/70 line-clamp-3">{article.metaDescription}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

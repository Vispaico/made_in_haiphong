// src/app/articles/[slug]/page.tsx
import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { format } from 'date-fns';

async function getArticle(slug: string) {
  const article = await prisma.article.findUnique({
    where: { slug, published: true },
  });
  return article;
}

type ArticlePageProps = {
  params: Promise<{ slug: string }>;
};

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = await getArticle(slug);

  if (!article) {
    notFound();
  }

  return (
    <div className="bg-background py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="font-heading text-4xl font-bold text-gray-900 mb-4">{article.title}</h1>
          <div className="flex items-center text-gray-600 mb-4">
            <span>{format(new Date(article.createdAt), 'MMM d, yyyy')}</span>
          </div>
          {article.featuredImage && (
            <div className="relative h-96 w-full mb-8 rounded-lg overflow-hidden">
              <Image src={article.featuredImage} alt={article.title} layout="fill" objectFit="cover" />
            </div>
          )}
          <div className="prose prose-lg max-w-none text-gray-800" dangerouslySetInnerHTML={{ __html: article.content }} />
        </div>
      </div>
    </div>
  );
}
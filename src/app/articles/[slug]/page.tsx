// src/app/articles/[slug]/page.tsx
import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

interface ArticlePageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const article = await prisma.article.findUnique({
    where: {
      slug: params.slug,
      published: true,
    },
  });

  if (!article) {
    return {};
  }

  return {
    title: article.metaTitle || article.title,
    description: article.metaDescription,
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const article = await prisma.article.findUnique({
    where: {
      slug: params.slug,
      published: true,
    },
  });

  if (!article) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <article>
        <h1 className="text-4xl font-bold mb-4">{article.title}</h1>
        {article.featuredImage && (
          <img
            src={article.featuredImage}
            alt={article.title}
            className="w-full h-auto object-cover rounded-lg mb-8"
          />
        )}
        <div
          className="prose lg:prose-xl max-w-none"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />
      </article>
    </div>
  );
}

// src/app/admin/articles/[articleId]/page.tsx
import prisma from '@/lib/prisma';
import ArticleForm from '@/components/admin/ArticleForm';
import { notFound } from 'next/navigation';

interface EditArticlePageProps {
  params: {
    articleId: string;
  };
}

export default async function EditArticlePage({ params }: EditArticlePageProps) {
  const article = await prisma.article.findUnique({
    where: {
      id: params.articleId,
    },
  });

  if (!article) {
    notFound();
  }

  return (
    <div>
      <h1 className="font-heading text-3xl font-bold text-foreground">Edit Article</h1>
      <p className="mt-2 text-lg text-foreground/70">Update the form below to edit the article.</p>
      <div className="mt-8">
        <ArticleForm article={article} />
      </div>
    </div>
  );
}

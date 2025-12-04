// src/app/admin/articles/[articleId]/page.tsx
import { notFound } from 'next/navigation';
import db from '@/lib/prisma';
import ArticleForm from '@/components/admin/ArticleForm';

type EditArticlePageProps = {
  params: Promise<{ articleId: string }>;
};

export default async function EditArticlePage({ params }: EditArticlePageProps) {
  const { articleId } = await params;
  const article = await db.article.findUnique({
    where: {
      id: articleId,
    },
  });

  if (!article) {
    notFound();
  }

  return (
    <div>
      <h1 className="font-heading text-3xl font-bold text-foreground">Edit Article</h1>
      <p className="mt-2 text-lg text-foreground/70">Update the details of your article below.</p>
      <div className="mt-8">
        <ArticleForm article={article} />
      </div>
    </div>
  );
}

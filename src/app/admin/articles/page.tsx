// src/app/admin/articles/page.tsx
import prisma from '@/lib/prisma';
import ArticleClient from '@/components/admin/ArticleClient';

export default async function AdminManageArticlesPage() {
  const articles = await prisma.article.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  });

  return (
    <div>
      <h1 className="font-heading text-3xl font-bold text-foreground">Manage Articles</h1>
      <p className="mt-2 text-lg text-foreground/70">Create, edit, and delete articles/stories.</p>
      
      <div className="mt-8">
        <ArticleClient initialArticles={articles} />
      </div>
    </div>
  );
}

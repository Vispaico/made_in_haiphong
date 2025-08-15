// src/app/admin/articles/[articleId]/page.tsx
import prisma from '@/lib/prisma';
import ArticleForm from '@/components/admin/ArticleForm';

async function getArticle(articleId: string) {
  const article = await prisma.article.findUnique({
    where: { id: articleId },
  });
  return article;
}

export default async function AdminEditArticlePage({ params }: { params: { articleId: string } }) {
  const article = await getArticle(params.articleId);

  if (!article) {
    return <div>Article not found.</div>;
  }

  return (
    <div>
      <h1 className="font-heading text-3xl font-bold text-foreground">Edit Article</h1>
      <p className="mt-2 text-lg text-foreground/70">Modify the details of the article.</p>
      
      <div className="mt-8">
        <ArticleForm article={article} />
      </div>
    </div>
  );
}
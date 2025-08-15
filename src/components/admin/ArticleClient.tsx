// src/components/admin/ArticleClient.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Article } from '@prisma/client';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/Button';

export default function ArticleClient({ initialArticles }: { initialArticles: Article[] }) {
  const router = useRouter();
  const [articles, setArticles] = useState<Article[]>(initialArticles);

  const handleDelete = async (e: React.MouseEvent<HTMLButtonElement>, articleId: string) => {
    e.preventDefault();
    console.log('handleDelete called for articleId:', articleId);
    if (window.confirm('Are you sure you want to delete this article?')) {
      const response = await fetch(`/api/admin/articles/${articleId}`, { method: 'DELETE' });
      if (response.ok) {
        setArticles(articles.filter((article) => article.id !== articleId));
        router.refresh();
      } else {
        alert('Failed to delete article.');
      }
    }
  };

  return (
    <>
      <div className="flex justify-end mb-4">
        <Button onClick={() => router.push('/admin/articles/new')}>
          <PlusCircle className="mr-2 h-5 w-5" />
          Create Article
        </Button>
      </div>

      <div className="overflow-x-auto rounded-lg border border-secondary bg-background">
        <table className="min-w-full divide-y divide-secondary">
          <thead className="bg-secondary">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-foreground/80">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-foreground/80">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-foreground/80">Created</th>
              <th className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-secondary">
            {articles.map((article) => (
              <tr key={article.id}>
                <td className="px-6 py-4 max-w-lg truncate">{article.title}</td>
                <td className="px-6 py-4">
                  {article.published ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Published
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      Draft
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground/70">{format(new Date(article.createdAt), 'MMM d, yyyy')}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" onClick={() => router.push(`/admin/articles/${article.id}`)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={(e) => handleDelete(e, article.id)}>
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

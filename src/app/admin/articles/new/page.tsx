// src/app/admin/articles/new/page.tsx
import ArticleForm from '@/components/admin/ArticleForm';

export default function NewArticlePage() {
  return (
    <div>
      <h1 className="font-heading text-3xl font-bold text-foreground">Create New Article</h1>
      <p className="mt-2 text-lg text-foreground/70">Fill out the form below to create a new article.</p>
      <div className="mt-8">
        <ArticleForm />
      </div>
    </div>
  );
}

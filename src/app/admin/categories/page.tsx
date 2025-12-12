// src/app/admin/categories/page.tsx

import prisma from '@/lib/prisma';
import CategoryClient from '@/components/admin/CategoryClient'; // We will create this next

export default async function AdminManageCategoriesPage() {
  // Fetch all categories from the database on the server
  const categories = await prisma.category.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  });

  return (
    <div>
      <h1 className="font-heading text-3xl font-bold text-foreground">Manage Categories</h1>
      <p className="mt-2 text-lg text-foreground/70">Add, edit, or delete the categories for the &ldquo;Explore&rdquo; and &ldquo;Marketplace&rdquo; sections.</p>
      
      {/* We pass the server-fetched data to our interactive client component */}
      <div className="mt-8">
        <CategoryClient initialCategories={categories} />
      </div>
    </div>
  );
}
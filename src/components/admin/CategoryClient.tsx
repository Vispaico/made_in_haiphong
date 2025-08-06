// src/components/admin/CategoryClient.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Category, CategoryType } from '@prisma/client';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';

// Define a type for our form data
type CategoryFormData = {
  name: string;
  slug: string;
  type: CategoryType;
};

// This is our main client component
export default function CategoryClient({ initialCategories }: { initialCategories: Category[] }) {
  const router = useRouter();
  const [categories, setCategories] = useState(initialCategories);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState<CategoryFormData>({ name: '', slug: '', type: 'MARKETPLACE' });

  const openModalForCreate = () => {
    setEditingCategory(null);
    setFormData({ name: '', slug: '', type: 'MARKETPLACE' });
    setIsModalOpen(true);
  };
  
  const openModalForEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({ name: category.name, slug: category.slug, type: category.type });
    setIsModalOpen(true);
  };
  
  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
  };
  
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const url = editingCategory ? `/api/admin/categories/${editingCategory.id}` : '/api/admin/categories';
    const method = editingCategory ? 'PATCH' : 'POST';

    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      router.refresh(); // Refresh the server component to get the new list
      closeModal();
    } else {
      alert(`Failed to ${editingCategory ? 'update' : 'create'} category.`);
    }
    setIsSubmitting(false);
  };

  const handleDelete = async (categoryId: string) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      const response = await fetch(`/api/admin/categories/${categoryId}`, { method: 'DELETE' });
      if (response.ok) {
        router.refresh();
      } else {
        alert('Failed to delete category.');
      }
    }
  };

  return (
    <>
      <div className="flex justify-end mb-4">
        <button onClick={openModalForCreate} className="flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 font-bold text-white shadow-md">
          <PlusCircle className="h-5 w-5" />
          <span>Create Category</span>
        </button>
      </div>

      <div className="overflow-x-auto rounded-lg border border-secondary bg-background">
        <table className="min-w-full divide-y divide-secondary">
          {/* Table Head */}
          <thead className="bg-secondary">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-foreground/80">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-foreground/80">Slug</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-foreground/80">Type</th>
              <th className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
            </tr>
          </thead>
          {/* Table Body */}
          <tbody className="divide-y divide-secondary">
            {categories.map((cat) => (
              <tr key={cat.id}>
                <td className="px-6 py-4 whitespace-nowrap font-semibold">{cat.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground/70">{cat.slug}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={`rounded-full px-2 py-1 text-xs font-medium ${cat.type === 'EXPLORE' ? 'bg-blue-500/10 text-blue-600' : 'bg-green-500/10 text-green-700'}`}>
                    {cat.type}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => openModalForEdit(cat)} className="text-primary hover:underline"><Edit className="h-4 w-4" /></button>
                    <button onClick={() => handleDelete(cat.id)} className="text-red-500 hover:underline"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal for Create/Edit Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="w-full max-w-md rounded-lg bg-background p-6 shadow-xl">
            <h2 className="font-heading text-2xl font-bold">{editingCategory ? 'Edit Category' : 'Create New Category'}</h2>
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium">Name</label>
                <input type="text" name="name" id="name" value={formData.name} onChange={handleFormChange} required className="mt-1 block w-full rounded-md border-secondary bg-secondary/50 p-2"/>
              </div>
              <div>
                <label htmlFor="slug" className="block text-sm font-medium">Slug</label>
                <input type="text" name="slug" id="slug" value={formData.slug} onChange={handleFormChange} required className="mt-1 block w-full rounded-md border-secondary bg-secondary/50 p-2"/>
              </div>
              <div>
                <label htmlFor="type" className="block text-sm font-medium">Type</label>
                <select name="type" id="type" value={formData.type} onChange={handleFormChange} className="mt-1 block w-full rounded-md border-secondary bg-secondary/50 p-2">
                  <option value="MARKETPLACE">Marketplace</option>
                  <option value="EXPLORE">Explore</option>
                </select>
              </div>
              <div className="flex justify-end gap-4 pt-4">
                <button type="button" onClick={closeModal} className="rounded-lg bg-secondary px-6 py-2 font-bold text-foreground">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="rounded-lg bg-accent px-6 py-2 font-bold text-white disabled:opacity-50">
                  {isSubmitting ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
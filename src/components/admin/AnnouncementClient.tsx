// src/components/admin/AnnouncementClient.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Announcement } from '@prisma/client';
import { PlusCircle, Edit, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';
import { format } from 'date-fns';

type AnnouncementFormData = {
  message: string;
  isActive: boolean;
};

export default function AnnouncementClient({ initialAnnouncements }: { initialAnnouncements: Announcement[] }) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
  const [formData, setFormData] = useState<AnnouncementFormData>({ message: '', isActive: true });

  const openModalForCreate = () => {
    setEditingAnnouncement(null);
    setFormData({ message: '', isActive: true });
    setIsModalOpen(true);
  };
  
  const openModalForEdit = (announcement: Announcement) => {
    setEditingAnnouncement(announcement);
    setFormData({ message: announcement.message, isActive: announcement.isActive });
    setIsModalOpen(true);
  };
  
  const closeModal = () => setIsModalOpen(false);
  
  const handleFormChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const url = editingAnnouncement ? `/api/admin/announcements/${editingAnnouncement.id}` : '/api/admin/announcements';
    const method = editingAnnouncement ? 'PATCH' : 'POST';

    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      router.refresh();
      closeModal();
    } else {
      alert(`Failed to ${editingAnnouncement ? 'update' : 'create'} announcement.`);
    }
    setIsSubmitting(false);
  };

  const handleDelete = async (announcementId: string) => {
    if (window.confirm('Are you sure you want to delete this announcement?')) {
      const response = await fetch(`/api/admin/announcements/${announcementId}`, { method: 'DELETE' });
      if (response.ok) router.refresh();
      else alert('Failed to delete announcement.');
    }
  };
  
  const handleToggleActive = async (announcement: Announcement) => {
      const response = await fetch(`/api/admin/announcements/${announcement.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...announcement, isActive: !announcement.isActive }),
    });
    if (response.ok) router.refresh();
    else alert('Failed to toggle status.');
  }

  return (
    <>
      <div className="flex justify-end mb-4">
        <button onClick={openModalForCreate} className="flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 font-bold text-white shadow-md">
          <PlusCircle className="h-5 w-5" />
          <span>Create Announcement</span>
        </button>
      </div>

      <div className="overflow-x-auto rounded-lg border border-secondary bg-background">
        <table className="min-w-full divide-y divide-secondary">
          <thead className="bg-secondary">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-foreground/80">Message</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-foreground/80">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-foreground/80">Created</th>
              <th className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-secondary">
            {initialAnnouncements.map((ann) => (
              <tr key={ann.id}>
                <td className="px-6 py-4 max-w-lg truncate">{ann.message}</td>
                <td className="px-6 py-4">
                  <button onClick={() => handleToggleActive(ann)}>
                    {ann.isActive ? <ToggleRight className="h-6 w-6 text-green-500" /> : <ToggleLeft className="h-6 w-6 text-foreground/50" />}
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground/70">{format(new Date(ann.createdAt), 'MMM d, yyyy')}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => openModalForEdit(ann)} className="text-primary hover:underline"><Edit className="h-4 w-4" /></button>
                    <button onClick={() => handleDelete(ann.id)} className="text-red-500 hover:underline"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="w-full max-w-md rounded-lg bg-background p-6 shadow-xl">
            <h2 className="font-heading text-2xl font-bold">{editingAnnouncement ? 'Edit Announcement' : 'Create New Announcement'}</h2>
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label htmlFor="message" className="block text-sm font-medium">Message</label>
                <textarea name="message" id="message" value={formData.message} onChange={handleFormChange} required rows={4} className="mt-1 block w-full rounded-md border-secondary bg-secondary/50 p-2"/>
              </div>
              <div className="flex items-center">
                <input type="checkbox" name="isActive" id="isActive" checked={formData.isActive} onChange={handleFormChange} className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"/>
                <label htmlFor="isActive" className="ml-2 block text-sm">Show this announcement on the site</label>
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
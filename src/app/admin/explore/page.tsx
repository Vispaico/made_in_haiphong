// src/app/admin/explore/page.tsx

import prisma from '@/lib/prisma';
import Image from 'next/image';
import { format } from 'date-fns';
import Link from 'next/link';
import { PlusCircle } from 'lucide-react';
import AdminExploreActions from '@/components/admin/AdminExploreActions'; // Import the new component

export default async function AdminManageExplorePage() {
  const allEntries = await prisma.exploreEntry.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-3xl font-bold text-foreground">Manage Explore Content</h1>
          <p className="mt-2 text-lg text-foreground/70">Create, edit, and delete curated content for the &quot;Explor&quot; section.</p>
        </div>
        <Link href="/admin/explore/new" className="flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 font-bold text-white shadow-md">
          <PlusCircle className="h-5 w-5" />
          <span>Create New Entry</span>
        </Link>
      </div>
      
      <div className="mt-8 overflow-x-auto rounded-lg border border-secondary bg-background">
        <table className="min-w-full divide-y divide-secondary">
          <thead className="bg-secondary">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-foreground/80">Entry</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-foreground/80">Category</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-foreground/80">Created</th>
              <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-secondary">
            {allEntries.map((entry) => (
              <tr key={entry.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <Image src={entry.imageUrls[0] || '/images/placeholder.png'} alt={entry.title} width={40} height={30} className="aspect-video rounded-md object-cover" />
                    <div className="font-semibold">{entry.title}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground/70">
                  {entry.category}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground/70">
                  {format(new Date(entry.createdAt), 'MMM d, yyyy')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  {/* THE FIX: Render the action buttons for each entry */}
                  <AdminExploreActions entryId={entry.id} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
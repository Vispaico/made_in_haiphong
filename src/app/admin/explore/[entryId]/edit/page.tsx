// src/app/admin/explore/[entryId]/edit/page.tsx

import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import EditExploreForm from '@/components/admin/EditExploreForm';

// This is the Server Component that fetches the data for the form.
export default async function EditExploreEntryPage({ params }: { params: { entryId: string } }) {
  const entry = await prisma.exploreEntry.findUnique({
    where: {
      id: params.entryId,
    },
  });

  if (!entry) {
    notFound();
  }

  return (
    <div>
      <h1 className="font-heading text-3xl font-bold text-foreground">Edit Explore Entry</h1>
      <p className="mt-2 text-lg text-foreground/70">Update the details for this curated content.</p>
      
      {/* We pass the fetched entry data down to the client component form */}
      <EditExploreForm entry={entry} />
    </div>
  );
}
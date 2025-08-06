// src/app/admin/announcements/page.tsx

import prisma from '@/lib/prisma';
import AnnouncementClient from '@/components/admin/AnnouncementClient'; // We will create this next

export default async function AdminManageAnnouncementsPage() {
  const announcements = await prisma.announcement.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  });

  return (
    <div>
      <h1 className="font-heading text-3xl font-bold text-foreground">Manage Announcements</h1>
      <p className="mt-2 text-lg text-foreground/70">Create, edit, and activate site-wide announcement banners.</p>
      
      <div className="mt-8">
        <AnnouncementClient initialAnnouncements={announcements} />
      </div>
    </div>
  );
}
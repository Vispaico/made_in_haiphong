// src/app/(main)/layout.tsx

import Header from '@/components/common/Header';
import NewFooter from '@/components/common/NewFooter';
import AnnouncementBanner from '@/components/common/AnnouncementBanner';
import MobileBottomNav from '@/components/common/MobileBottomNav';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <AnnouncementBanner />
      
      <Header />
      
      <main className="flex-grow pb-16 md:pb-0">
        {children}
      </main>
      
      <NewFooter />
      <MobileBottomNav />
    </div>
  );
}
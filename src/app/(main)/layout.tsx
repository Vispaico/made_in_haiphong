// src/app/(main)/layout.tsx

import Header from '@/components/common/Header'; // THE FIX: Import the correct, existing Header component
import NewFooter from '@/components/common/NewFooter';
import AnnouncementBanner from '@/components/common/AnnouncementBanner';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <AnnouncementBanner />
      
      {/* THE FIX: Use the correct Header component */}
      <Header />
      
      <main className="flex-grow">
        {children}
      </main>
      <NewFooter />
    </div>
  );
}
// src/app/(main)/layout.tsx

// THE FIX: We now import the new ServerHeader.
import ServerHeader from '@/components/common/ServerHeader';
import Footer from '@/components/common/Footer';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      {/* And we use it here. */}
      <ServerHeader />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
}
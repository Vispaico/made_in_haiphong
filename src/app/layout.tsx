// src/app/layout.tsx

import './globals.css';
import Providers from '@/components/providers'; // Import our new component

export const metadata = {
  title: 'Made in Haiphong',
  description: 'Vispaico',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {/* THE FIX IS HERE: The closing tag is now correct. */}
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
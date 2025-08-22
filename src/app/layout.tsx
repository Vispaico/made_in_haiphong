// src/app/layout.tsx

import './globals.css';
import Providers from '@/components/providers';
import { AppProviders } from '@/providers/AppProviders';

export const metadata = {
  title: 'Made in Haiphong',
  description: 'Haiphong in Your Pocket',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <AppProviders>
            {children}
          </AppProviders>
        </Providers>
      </body>
    </html>
  );
}
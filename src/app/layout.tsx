// src/app/layout.tsx

import './globals.css';
import { Inter } from 'next/font/google'; // Example, adjust if you use a different font loader

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
// You might add Poppins here too if you load it via next/font

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
    // It's good practice to apply the font variable here
    <html lang="en" className={inter.variable}>
      <body>{children}</body>
    </html>
  );
}
// src/components/common/NewFooter.tsx
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { Facebook, Twitter, Instagram } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function NewFooter() {
  const { data: session, status } = useSession();

  const footerLinks = {
    'Company': [
      { href: '/about', label: 'About Us' },
      { href: '/contact', label: 'Contact' },
      { href: '/host', label: 'Become a Host' },
    ],
    'Support': [
      { href: '/faq', label: 'FAQ' },
      { href: '/terms', label: 'Terms of Service' },
      { href: '/privacy', label: 'Privacy Policy' },
    ],
  };

  const socialLinks = [
    { href: 'https://facebook.com', icon: <Facebook className="h-6 w-6" /> },
    { href: 'https://twitter.com', icon: <Twitter className="h-6 w-6" /> },
    { href: 'https://instagram.com', icon: <Instagram className="h-6 w-6" /> },
  ];

  return (
    <footer className="border-t border-secondary bg-background">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        {status !== 'authenticated' && (
          <div className="mb-12 rounded-lg bg-secondary p-8 text-center">
            <h2 className="text-2xl font-bold text-foreground">Join Our Community</h2>
            <p className="mt-2 text-foreground/80">
              Sign up to list your property, sell in the marketplace, and connect with others.
            </p>
            <div className="mt-6 flex justify-center gap-4">
              <Link href="/signup">
                <Button size="lg">Sign Up</Button>
              </Link>
              <Link href="/host">
                <Button size="lg" variant="outline">
                  Become a Host
                </Button>
              </Link>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and site description */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center">
              <Image
                src="/MadeInHaiphong_logo01.png"
                alt="Made in Haiphong Logo"
                width={180}
                height={50}
                className="h-12 w-auto"
              />
            </Link>
            <p className="mt-4 text-foreground/70">
              Your guide to exploring the best of Haiphong.
            </p>
          </div>

          {/* Footer Links */}
          <div className="md:col-span-2 grid grid-cols-2 gap-8">
            {Object.entries(footerLinks).map(([title, links]) => (
              <div key={title}>
                <h3 className="font-semibold text-foreground">{title}</h3>
                <ul className="mt-4 space-y-2">
                  {links.map((link) => (
                    <li key={link.href}>
                      <Link href={link.href} className="text-foreground/70 hover:text-foreground">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Social Media */}
          <div>
            <h3 className="font-semibold text-foreground">Follow Us</h3>
            <div className="mt-4 flex space-x-4">
              {socialLinks.map((link) => (
                <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer" className="text-foreground/70 hover:text-foreground">
                  {link.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-secondary pt-8 text-center text-foreground/60">
          <p>&copy; {new Date().getFullYear()} Made in Haiphong. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

// src/components/common/NewFooter.tsx
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { Facebook, Twitter, Instagram } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useState } from 'react';
import LaserBorder from './LaserBorder';

export default function NewFooter() {
  const { status } = useSession();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterFax, setNewsletterFax] = useState(''); // Honeypot
  const [newsletterStatus, setNewsletterStatus] = useState('');

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setNewsletterStatus('sending');

    if (newsletterFax) {
      setNewsletterStatus('success');
      return;
    }

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: newsletterEmail }),
      });

      const data = await response.json();
      if (response.ok) {
        setNewsletterStatus('success');
        setNewsletterEmail('');
      } else {
        setNewsletterStatus(data.error || 'An error occurred.');
      }
    } catch {
      setNewsletterStatus('An error occurred.');
    }
  };

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
          <div className="mb-12 space-y-12">
            <div className="p-8 text-center">
              <h2 className="font-heading text-3xl font-bold text-foreground">Join our Family</h2>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-foreground/80">
                Share your favorite finds, offer services, or list a place to stay. Become a part of Haiphong&apos;s story.
              </p>
              <div className="mt-8 flex justify-center gap-4">
                <Link href="/signup" className="inline-block rounded-lg bg-accent px-8 py-3 font-bold text-white shadow-md transition-transform hover:scale-105">
                  Sign Up Now
                </Link>
                <Link href="/host" className="inline-block rounded-lg bg-background px-8 py-3 font-bold text-foreground shadow-md transition-transform hover:scale-105 border border-accent">
                  Become a Host
                </Link>
              </div>
            </div>

            <LaserBorder>
              <div className="p-8 text-center">
                <h3 className="font-heading text-3xl font-bold text-foreground">Get Insider News</h3>
                <p className="mx-auto mt-4 max-w-2xl text-lg text-foreground/80">
                  Subscribe to our newsletter for the latest stories, local discounts, travel warnings, and regulation updates in Haiphong.
                </p>
                <form onSubmit={handleNewsletterSubmit} className="mt-8 mx-auto max-w-md">
                  <div className="flex flex-col sm:flex-row items-center gap-2">
                    <Input
                      type="email"
                      placeholder="Your email"
                      className="bg-background w-full border-accent"
                      value={newsletterEmail}
                      onChange={(e) => setNewsletterEmail(e.target.value)}
                      required
                    />
                    <Button
                      type="submit"
                      variant="accent"
                      className="w-full sm:w-auto"
                      disabled={newsletterStatus === 'sending'}
                    >
                      {newsletterStatus === 'sending' ? '...' : 'Subscribe'}
                    </Button>
                  </div>
                  <input
                    type="text"
                    name="fax"
                    value={newsletterFax}
                    onChange={(e) => setNewsletterFax(e.target.value)}
                    tabIndex={-1}
                    autoComplete="off"
                    className="hidden"
                  />
                  {newsletterStatus && newsletterStatus !== 'sending' && (
                    <p className={`mt-4 text-sm ${newsletterStatus === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                      {newsletterStatus === 'success' ? 'Thank you for subscribing!' : newsletterStatus}
                    </p>
                  )}
                </form>
              </div>
            </LaserBorder>
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
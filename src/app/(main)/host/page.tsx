import React from 'react';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

const BecomeAHostPage = () => {
  return (
    <div className="bg-background min-h-screen py-12">
      <main className="container mx-auto max-w-4xl px-4">
        <div className="bg-secondary rounded-lg shadow-md p-8 text-center">
          <h1 className="font-heading text-4xl font-bold text-foreground mb-6">Become a Host with Made in Haiphong</h1>
          <p className="text-xl text-foreground/80 mb-8">
            Share your space and passion for Haiphong with travelers from around the world.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
            <div className="p-6 border border-foreground/10 rounded-lg">
              <h3 className="text-2xl font-semibold text-foreground mb-3">Earn an Income</h3>
              <p className="text-foreground/80">Turn your extra space into a source of income and reach a global audience of travelers.</p>
            </div>
            <div className="p-6 border border-foreground/10 rounded-lg">
              <h3 className="text-2xl font-semibold text-foreground mb-3">Showcase Haiphong</h3>
              <p className="text-foreground/80">Be a local ambassador for our beautiful city and share your favorite spots with your guests.</p>
            </div>
            <div className="p-6 border border-foreground/10 rounded-lg">
              <h3 className="text-2xl font-semibold text-foreground mb-3">Flexible & Secure</h3>
              <p className="text-foreground/80">You control your availability, prices, and house rules. We provide the platform and support.</p>
            </div>
          </div>
          <p className="text-lg text-foreground/80 mb-8">
            Whether you have a spare room, an entire apartment, or a unique local experience to offer, Made in Haiphong is the perfect platform to connect with an audience that is eager to explore the real Haiphong.
          </p>
          <Link href="/dashboard/listings">
            <Button size="lg" variant="accent">
              Get Started
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default BecomeAHostPage;
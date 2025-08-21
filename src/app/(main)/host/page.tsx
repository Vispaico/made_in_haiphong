
import React from 'react';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

const BecomeAHostPage = () => {
  return (
    <div className="bg-gray-50 min-h-screen">
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8 text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-6">Become a Host with Made in Haiphong</h1>
          <p className="text-xl text-gray-600 mb-8">
            Share your space and passion for Haiphong with travelers from around the world.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
            <div className="p-6 border border-gray-200 rounded-lg">
              <h3 className="text-2xl font-semibold text-gray-700 mb-3">Earn an Income</h3>
              <p className="text-gray-600">Turn your extra space into a source of income and reach a global audience of travelers.</p>
            </div>
            <div className="p-6 border border-gray-200 rounded-lg">
              <h3 className="text-2xl font-semibold text-gray-700 mb-3">Showcase Haiphong</h3>
              <p className="text-gray-600">Be a local ambassador for our beautiful city and share your favorite spots with your guests.</p>
            </div>
            <div className="p-6 border border-gray-200 rounded-lg">
              <h3 className="text-2xl font-semibold text-gray-700 mb-3">Flexible & Secure</h3>
              <p className="text-gray-600">You control your availability, prices, and house rules. We provide the platform and support.</p>
            </div>
          </div>
          <p className="text-lg text-gray-600 mb-8">
            Whether you have a spare room, an entire apartment, or a unique local experience to offer, Made in Haiphong is the perfect platform to connect with an audience that is eager to explore the real Haiphong.
          </p>
          <Link href="/dashboard/listings">
            <Button size="lg">
              Get Started
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default BecomeAHostPage;


import React from 'react';

const AboutUsPage = () => {
  return (
    <div className="bg-gray-50 min-h-screen">
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-6 text-center">About Made in Haiphong</h1>
          <p className="text-lg text-gray-600 mb-6">
            Welcome to Made in Haiphong, your digital gateway to the vibrant heart of Vietnam's port city. Our mission is to showcase the very best of Haiphong, from its bustling streets and rich cultural heritage to its breathtaking landscapes and, most importantly, its remarkable people.
          </p>
          <p className="text-lg text-gray-600 mb-6">
            We believe that Haiphong is more than just a destination; it's an experience. It's the taste of freshly caught seafood, the hum of motorbikes in the city, the warmth of a smile from a local artisan, and the serene beauty of Cat Ba Island. We are passionate about sharing these authentic experiences with the world.
          </p>
          <p className="text-lg text-gray-600 mb-6">
            Our platform was born from a deep love for this city and a desire to connect travelers, expatriates, and locals alike. We aim to:
          </p>
          <ul className="list-disc list-inside text-lg text-gray-600 mb-6 space-y-2">
            <li><span className="font-semibold">Promote Local Businesses:</span> From street food vendors to boutique hotels, we want to shine a light on the local entrepreneurs who make Haiphong unique.</li>
            <li><span className="font-semibold">Foster Community:</span> Our community forums and marketplace are designed to be a space for connection, sharing, and support.</li>
            <li><span className="font-semibold">Provide Authentic Insights:</span> We go beyond the typical tourist guides to offer genuine recommendations and stories from those who know the city best.</li>
            <li><span className="font-semibold">Support Sustainable Tourism:</span> We encourage responsible travel that respects the local culture and environment.</li>
          </ul>
          <p className="text-lg text-gray-600 mb-6">
            Whether you're planning your first visit, looking for your next favorite restaurant, or seeking to connect with fellow Haiphong enthusiasts, Made in Haiphong is here to be your trusted companion.
          </p>
          <p className="text-lg text-gray-600 font-semibold text-center">
            Join us in celebrating the spirit of Haiphong – a city of resilience, innovation, and endless charm.
          </p>
        </div>
      </main>
    </div>
  );
};

export default AboutUsPage;

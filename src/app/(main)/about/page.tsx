import React from 'react';

const AboutUsPage = () => {
  return (
    <div className="bg-background min-h-screen py-12">
      <main className="container mx-auto max-w-4xl px-4">
        <div className="bg-secondary rounded-lg shadow-md p-8">
          <h1 className="font-heading text-4xl font-bold text-foreground mb-6 text-center">About Made in Haiphong</h1>
          <div className="space-y-6 text-lg text-foreground/80">
            <p>
              Welcome to Made in Haiphong, your digital gateway to the vibrant heart of Vietnam&rsquo;s port city. Our mission is to showcase the very best of Haiphong, from its bustling streets and rich cultural heritage to its breathtaking landscapes and, most importantly, its remarkable people.
            </p>
            <p>
              We believe that Haiphong is more than just a destination; it&rsquo;s an experience. It&rsquo;s the taste of freshly caught seafood, the hum of motorbikes in the city, the warmth of a smile from a local artisan, and the serene beauty of Cat Ba Island. We are passionate about sharing these authentic experiences with the world.
            </p>
            <p>
              Our platform was born from a deep love for this city and a desire to connect travelers, expatriates, and locals alike. We aim to:
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li><span className="font-semibold text-foreground">Promote Local Businesses:</span> From street food vendors to boutique hotels, we want to shine a light on the local entrepreneurs who make Haiphong unique.</li>
              <li><span className="font-semibold text-foreground">Foster Community:</span> Our community forums and marketplace are designed to be a space for connection, sharing, and support.</li>
              <li><span className="font-semibold text-foreground">Provide Authentic Insights:</span> We go beyond the typical tourist guides to offer genuine recommendations and stories from those who know the city best.</li>
              <li><span className="font-semibold text-foreground">Support Sustainable Tourism:</span> We encourage responsible travel that respects the local culture and environment.</li>
            </ul>
            <p>
              Whether you&rsquo;re planning your first visit, looking for your next favorite restaurant, or seeking to connect with fellow Haiphong enthusiasts, Made in Haiphong is here to be your trusted companion.
            </p>
            <p className="font-semibold text-foreground text-center">
              Join us in celebrating the spirit of Haiphong – a city of resilience, innovation, and endless charm.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AboutUsPage;
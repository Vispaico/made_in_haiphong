// src/app/(main)/explore/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Map from '@/components/common/Map';
import ListingCard from '@/components/common/ListingCard';
import { Search, Map as MapIcon, List } from 'lucide-react';

// Dummy location for Haiphong center
const HAIPHONG_LOCATION: [number, number] = [20.844, 106.688];

export default function ExplorePage() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('map'); // 'map' or 'list'

  useEffect(() => {
    const fetchListings = async () => {
      try {
        // In a real app, you'd fetch from your API route
        // const response = await fetch('/api/listings');
        // const data = await response.json();
        // For now, we use mock data with coordinates
        const mockData = [
          { id: 1, title: 'Modern Apartment in City Center', address: '123 Le Hong Phong, Ngo Quyen', price: 75, imageUrls: ['/images/stay-1.jpg'], latitude: 20.845, longitude: 106.689 },
          { id: 2, title: 'Banh Da Cua Ba Cu', address: '48 Lach Tray, Ngo Quyen', price: 2, imageUrls: ['/images/food-1.jpg'], latitude: 20.842, longitude: 106.685 },
          { id: 3, title: 'Cat Ba Island Resort', address: 'Cat Co 1, Cat Ba Island', price: 120, imageUrls: ['/images/stay-3.jpg'], latitude: 20.727, longitude: 107.048 },
        ];
        setListings(mockData as any);
      } catch (error) {
        console.error("Failed to fetch listings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col">
      {/* Header with Filters and View Toggle */}
      <div className="flex-shrink-0 border-b border-secondary bg-background p-4">
        <div className="container mx-auto max-w-7xl">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="Search by keyword..."
                className="w-full rounded-full border-border bg-secondary p-3 pl-10"
              />
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-foreground/50" />
            </div>
            <div className="flex items-center gap-2">
              <button className="flex-1 rounded-full border border-border p-3 text-sm md:flex-none">Category</button>
              <button className="flex-1 rounded-full border border-border p-3 text-sm md:flex-none">Price</button>
              <button className="flex-1 rounded-full border border-border p-3 text-sm md:flex-none">More Filters</button>
            </div>
            <div className="hidden items-center rounded-full bg-secondary p-1 md:flex">
              <button onClick={() => setView('map')} className={`rounded-full p-2 ${view === 'map' ? 'bg-primary text-white' : ''}`}>
                <MapIcon className="h-5 w-5" />
              </button>
              <button onClick={() => setView('list')} className={`rounded-full p-2 ${view === 'list' ? 'bg-primary text-white' : ''}`}>
                <List className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow overflow-hidden">
        {loading ? (
          <div className="flex h-full items-center justify-center">
            <p>Loading listings...</p>
          </div>
        ) : (
          <div className="flex h-full">
            {/* Map View */}
            <div className={`h-full w-full ${view === 'list' ? 'hidden' : ''} md:w-2/3`}>
              <Map location={HAIPHONG_LOCATION} listings={listings} />
            </div>
            
            {/* Listings Panel */}
            <div className={`h-full overflow-y-auto p-4 ${view === 'map' ? 'hidden' : ''} md:block md:w-1/3 md:border-l md:border-secondary`}>
              <h2 className="mb-4 font-heading text-2xl font-bold">
                {listings.length} Results
              </h2>
              <div className="grid grid-cols-1 gap-4">
                {listings.map((listing: any) => (
                  <ListingCard key={listing.id} listing={listing} />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

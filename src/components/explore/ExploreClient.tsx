'use client';

import { useMemo, useState } from 'react';
import Map from '@/components/common/Map';
import ListingCard from '@/components/common/ListingCard';
import { Search, Map as MapIcon, List } from 'lucide-react';
import type { Listing } from '@prisma/client';

const HAIPHONG_LOCATION: [number, number] = [20.844, 106.688];

type ExploreListing = Listing & { address: string };

export default function ExploreClient({ listings }: { listings: ExploreListing[] }) {
  const [view, setView] = useState<'map' | 'list'>('map');
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    if (!query.trim()) return listings;
    const keyword = query.trim().toLowerCase();
    return listings.filter((listing) =>
      [listing.title, listing.description, listing.address, listing.category]
        .filter(Boolean)
        .some((field) => field!.toLowerCase().includes(keyword)),
    );
  }, [listings, query]);

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col">
      <div className="flex-shrink-0 border-b border-secondary bg-background p-4">
        <div className="container mx-auto max-w-7xl">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="relative flex-grow">
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                type="text"
                placeholder="Search by keyword or district..."
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

      <div className="flex-grow overflow-hidden">
        <div className="flex h-full">
          <div className={`h-full w-full ${view === 'list' ? 'hidden' : ''} md:w-2/3`}>
            <Map location={HAIPHONG_LOCATION} listings={filtered} />
          </div>
          <div className={`h-full overflow-y-auto p-4 ${view === 'map' ? 'hidden' : ''} md:block md:w-1/3 md:border-l md:border-secondary`}>
            <h2 className="mb-4 font-heading text-2xl font-bold">{filtered.length} results</h2>
            <div className="grid grid-cols-1 gap-4">
              {filtered.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
            {!filtered.length && (
              <p className="text-sm text-foreground/60">No places match that search yet. Try different keywords.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

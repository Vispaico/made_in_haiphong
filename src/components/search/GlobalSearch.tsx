'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Search } from 'lucide-react';

type Hit = {
  id: string;
  title: string;
  snippet?: string;
  type: string;
  image?: string;
  href: string;
};

export default function GlobalSearch() {
  const [query, setQuery] = useState('');
  const [hits, setHits] = useState<Hit[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const controller = useRef<AbortController | null>(null);

  const debounceMs = 250;

  const doSearch = useMemo(
    () =>
      async (q: string) => {
        if (!q.trim()) {
          setHits([]);
          setError(null);
          return;
        }
        controller.current?.abort();
        controller.current = new AbortController();
        setLoading(true);
        setError(null);
        try {
          const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`, {
            signal: controller.current.signal,
          });
          if (!res.ok) throw new Error('Search failed');
          const data = await res.json();
          setHits(data.hits || []);
        } catch (err: any) {
          if (err?.name === 'AbortError') return;
          setError('Search unavailable right now');
          setHits([]);
        } finally {
          setLoading(false);
        }
      },
    []
  );

  useEffect(() => {
    const t = setTimeout(() => doSearch(query), debounceMs);
    return () => clearTimeout(t);
  }, [query, doSearch]);

  return (
    <div className="w-full">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search listings, articles, explore, community..."
          className="w-full rounded-full border-0 bg-white/90 p-4 pr-16 text-lg text-foreground placeholder-zinc-500 shadow-lg focus:ring-2 focus:ring-accent focus:ring-inset"
        />
        <button className="absolute top-1/2 right-2 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-accent text-white transition-colors hover:bg-accent/90">
          <Search className="h-6 w-6" />
        </button>
      </div>
      {(loading || hits.length > 0 || error) && (
        <div className="mt-3 rounded-2xl border border-secondary bg-background/90 p-3 shadow-lg backdrop-blur">
          {loading && <p className="text-sm text-foreground/70">Searching...</p>}
          {error && <p className="text-sm text-red-600">{error}</p>}
          {!loading && !error && hits.length === 0 && query.trim().length > 2 && (
            <p className="text-sm text-foreground/60">No results found.</p>
          )}
          <div className="flex flex-col divide-y divide-secondary/60">
            {hits.map((hit) => (
              <a key={hit.id} href={hit.href} className="flex items-start gap-3 py-2 hover:text-primary">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-xs font-semibold uppercase text-foreground/70">
                  {hit.type.slice(0, 2)}
                </div>
                <div>
                  <p className="font-semibold text-foreground">{hit.title}</p>
                  {hit.snippet && <p className="text-sm text-foreground/70">{hit.snippet}</p>}
                </div>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

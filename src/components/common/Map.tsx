// src/components/common/Map.tsx
'use client';

import dynamic from 'next/dynamic';
import { useMemo } from 'react';

// This wrapper component now accepts listings and passes them down.
export default function Map({ location, listings }: { location: [number, number], listings?: any[] }) {
  const MapDisplay = useMemo(() => dynamic(
    () => import('@/components/common/MapDisplay'),
    { 
      loading: () => <div className="h-full w-full bg-secondary animate-pulse rounded-lg" />,
      ssr: false
    }
  ), []);
  
  // Pass both location and listings to the display component
  return <MapDisplay location={location} listings={listings} />;
}
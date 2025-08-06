// src/components/common/Map.tsx
'use client';

import dynamic from 'next/dynamic';
import { useMemo } from 'react';

// This is a wrapper component that will dynamically import the actual Map component.
// This is the standard way to use Leaflet with Next.js App Router to avoid SSR issues.
export default function Map({ location }: { location: [number, number] }) {
  const MapDisplay = useMemo(() => dynamic(
    () => import('@/components/common/MapDisplay'),
    { 
      loading: () => <div className="h-full w-full bg-secondary animate-pulse rounded-lg" />,
      ssr: false // This is the crucial part - we disable Server-Side Rendering for the map.
    }
  ), [location]);
  
  return <MapDisplay location={location} />;
}
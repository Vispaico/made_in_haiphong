// src/components/common/MapDisplay.tsx
'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import ListingCard from './ListingCard'; // Import the new card

// Leaflet's default icons can be broken in React, so we fix them here.
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
    iconUrl: icon.src,
    shadowUrl: iconShadow.src,
    iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

// The component now accepts a center location and an array of listings
export default function MapDisplay({ location, listings }: { location: [number, number], listings?: any[] }) {
  return (
    <MapContainer 
      center={location} 
      zoom={12} 
      scrollWheelZoom={false} 
      className="h-full w-full rounded-lg z-0"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {/* If listings are provided, map over them and create a Marker for each */}
      {listings && listings.map(listing => (
        listing.latitude && listing.longitude && (
          <Marker key={listing.id} position={[listing.latitude, listing.longitude]}>
            <Popup>
              {/* The popup now contains our compact ListingCard */}
              <ListingCard listing={listing} />
            </Popup>
          </Marker>
        )
      ))}
    </MapContainer>
  );
}
// src/components/common/MapDisplay.tsx
'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Leaflet's default icons can be broken in React, so we fix them here.
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

// THE FIX: Changed 'let' to 'const' as the variable is never reassigned.
const DefaultIcon = L.icon({
    iconUrl: icon.src,
    shadowUrl: iconShadow.src,
    iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;


export default function MapDisplay({ location }: { location: [number, number] }) {
  return (
    <MapContainer 
      center={location} 
      zoom={14} 
      scrollWheelZoom={false} 
      className="h-full w-full rounded-lg z-0"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={location}>
        <Popup>
          Location.
        </Popup>
      </Marker>
    </MapContainer>
  );
}
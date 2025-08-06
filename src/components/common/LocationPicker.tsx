// src/components/common/LocationPicker.tsx
'use client';

import { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Re-use the same icon fix
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
    iconUrl: icon.src,
    shadowUrl: iconShadow.src,
    iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

// This is the default center for the map if no initial location is provided (Haiphong's approximate center)
const defaultCenter: [number, number] = [20.8465, 106.683];

interface LocationPickerProps {
  onLocationSelect: (lat: number, lng: number) => void;
  initialLocation?: [number, number] | null;
}

// A helper component to handle map click events
function MapClickHandler({ setPosition }: { setPosition: (pos: L.LatLng) => void }) {
  useMapEvents({
    click(e) {
      setPosition(e.latlng);
    },
  });
  return null;
}

export default function LocationPicker({ onLocationSelect, initialLocation }: LocationPickerProps) {
  // The state holds the current position of the marker
  const [position, setPosition] = useState<L.LatLng | null>(
    initialLocation ? L.latLng(initialLocation[0], initialLocation[1]) : null
  );

  // This function is called by the MapClickHandler and also updates the parent form
  const handleSetPosition = (pos: L.LatLng) => {
    setPosition(pos);
    onLocationSelect(pos.lat, pos.lng);
  };

  return (
    <div className="h-64 w-full rounded-lg overflow-hidden">
      <MapContainer
        center={initialLocation || defaultCenter}
        zoom={13}
        scrollWheelZoom={false}
        className="h-full w-full z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapClickHandler setPosition={handleSetPosition} />
        {/* If a position has been selected, show a marker there */}
        {position && <Marker position={position}></Marker>}
      </MapContainer>
    </div>
  );
}
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Polygon, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icon
delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: '/leaflet/images/marker-icon-2x.png',
  iconUrl: '/leaflet/images/marker-icon.png',
  shadowUrl: '/leaflet/images/marker-shadow.png',
});

interface BoundaryDrawMapProps {
  initialCenter?: { lat: number; lng: number };
  centerLocation?: { lat: number; lng: number } | null;
  boundary: Array<{ lat: number; lng: number }>;
  onBoundaryChange: (boundary: Array<{ lat: number; lng: number }>) => void;
  height?: string;
}

// Component to handle map clicks for drawing boundary
function BoundaryDrawer({
  boundary,
  onBoundaryChange,
}: {
  boundary: Array<{ lat: number; lng: number }>;
  onBoundaryChange: (boundary: Array<{ lat: number; lng: number }>) => void;
}) {
  useMapEvents({
    click(e) {
      // Add point to boundary
      const newBoundary = [...boundary, { lat: e.latlng.lat, lng: e.latlng.lng }];
      onBoundaryChange(newBoundary);
    },
  });

  return (
    <>
      {/* Show markers for each boundary point */}
      {boundary.map((point, index) => (
        <Marker key={index} position={[point.lat, point.lng]} />
      ))}

      {/* Show polygon if we have at least 3 points */}
      {boundary.length >= 3 && (
        <Polygon
          positions={boundary.map((p) => [p.lat, p.lng])}
          pathOptions={{
            color: '#22c55e',
            fillColor: '#22c55e',
            fillOpacity: 0.2,
            weight: 2,
          }}
        />
      )}
    </>
  );
}

export const BoundaryDrawMap: React.FC<BoundaryDrawMapProps> = ({
  initialCenter = { lat: 34.7466, lng: 113.6253 },
  centerLocation,
  boundary,
  onBoundaryChange,
  height = '500px',
}) => {
  const [mapCenter, setMapCenter] = useState<[number, number]>([
    initialCenter.lat,
    initialCenter.lng,
  ]);

  // Update map center when centerLocation changes
  useEffect(() => {
    if (centerLocation) {
      setMapCenter([centerLocation.lat, centerLocation.lng]);
    }
  }, [centerLocation]);

  return (
    <div
      style={{ height, width: '100%' }}
      className="rounded-lg overflow-hidden border border-gray-300"
    >
      <MapContainer
        center={mapCenter}
        zoom={15}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Show center marker if location is selected */}
        {centerLocation && (
          <Marker position={[centerLocation.lat, centerLocation.lng]} />
        )}

        <BoundaryDrawer boundary={boundary} onBoundaryChange={onBoundaryChange} />
      </MapContainer>
    </div>
  );
};

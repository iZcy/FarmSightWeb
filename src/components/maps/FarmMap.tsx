import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polygon } from 'react-leaflet';
import L from 'leaflet';
import type { Farm } from '../../types';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icon in React-Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: '/leaflet/images/marker-icon-2x.png',
  iconUrl: '/leaflet/images/marker-icon.png',
  shadowUrl: '/leaflet/images/marker-shadow.png',
});

interface FarmMapProps {
  farm: Farm;
  height?: string;
  showBoundary?: boolean;
}

export const FarmMap: React.FC<FarmMapProps> = ({
  farm,
  height = '400px',
  showBoundary = true,
}) => {
  return (
    <div style={{ height, width: '100%' }} className="rounded-lg overflow-hidden">
      <MapContainer
        center={[farm.location.lat, farm.location.lng]}
        zoom={15}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Marker position={[farm.location.lat, farm.location.lng]}>
          <Popup>
            <div className="p-2">
              <h3 className="font-semibold text-gray-900">{farm.name}</h3>
              <p className="text-sm text-gray-600">{farm.cropType}</p>
              <p className="text-sm text-gray-600">{farm.area} hectares</p>
            </div>
          </Popup>
        </Marker>

        {showBoundary && farm.boundary && farm.boundary.length > 0 && (
          <Polygon
            positions={farm.boundary.map(point => [point.lat, point.lng])}
            pathOptions={{
              color: '#22c55e',
              fillColor: '#22c55e',
              fillOpacity: 0.2,
              weight: 2,
            }}
          />
        )}
      </MapContainer>
    </div>
  );
};

interface MultiFarmMapProps {
  farms: Farm[];
  height?: string;
  onFarmClick?: (farmId: string) => void;
}

export const MultiFarmMap: React.FC<MultiFarmMapProps> = ({
  farms,
  height = '500px',
  onFarmClick,
}) => {
  if (farms.length === 0) {
    return (
      <div
        style={{ height }}
        className="flex items-center justify-center bg-gray-100 rounded-lg"
      >
        <p className="text-gray-500">No farms to display</p>
      </div>
    );
  }

  // Calculate center point of all farms
  const centerLat = farms.reduce((sum, farm) => sum + farm.location.lat, 0) / farms.length;
  const centerLng = farms.reduce((sum, farm) => sum + farm.location.lng, 0) / farms.length;

  return (
    <div style={{ height, width: '100%' }} className="rounded-lg overflow-hidden">
      <MapContainer
        center={[centerLat, centerLng]}
        zoom={12}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {farms.map((farm) => (
          <React.Fragment key={farm.id}>
            <Marker
              position={[farm.location.lat, farm.location.lng]}
              eventHandlers={{
                click: () => onFarmClick?.(farm.id),
              }}
            >
              <Popup>
                <div className="p-2">
                  <h3 className="font-semibold text-gray-900">{farm.name}</h3>
                  <p className="text-sm text-gray-600">{farm.cropType}</p>
                  <p className="text-sm text-gray-600">{farm.area} hectares</p>
                </div>
              </Popup>
            </Marker>

            {farm.boundary && farm.boundary.length > 0 && (
              <Polygon
                positions={farm.boundary.map(point => [point.lat, point.lng])}
                pathOptions={{
                  color: '#0ea5e9',
                  fillColor: '#0ea5e9',
                  fillOpacity: 0.15,
                  weight: 2,
                }}
                eventHandlers={{
                  click: () => onFarmClick?.(farm.id),
                }}
              />
            )}
          </React.Fragment>
        ))}
      </MapContainer>
    </div>
  );
};

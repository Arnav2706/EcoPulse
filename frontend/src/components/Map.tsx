"use client";
import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Circle, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons in Leaflet with Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const CITIES: any = {
  "Visakhapatnam": [17.6868, 83.2185],
  "New Delhi": [28.6139, 77.2090],
  "Almaty": [43.2220, 76.8512],
  "Mumbai": [19.0760, 72.8777],
  "London": [51.5074, -0.1278]
};

function MapUpdater({ city }: { city: string }) {
  const map = useMap();
  useEffect(() => {
    const coords = CITIES[city] || CITIES["Visakhapatnam"];
    map.flyTo(coords, 11, { duration: 2.0 });
  }, [city, map]);
  return null;
}

export default function Map({ aqi = 50, city = "Visakhapatnam" }: { aqi?: number, city?: string }) {
  const [mounted, setMounted] = useState(false);
  const position: [number, number] = CITIES[city] || CITIES["Visakhapatnam"];

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-full h-full bg-black/50 animate-pulse rounded-xl flex items-center justify-center text-gray-500 font-mono text-sm border border-white/10">Initializing Geospatial Link...</div>;
  }

  const getMarkerColor = (aqi: number) => {
    if (aqi > 150) return '#ef4444'; // Red
    if (aqi > 100) return '#eab308'; // Yellow
    return '#10b981'; // Green
  };

  return (
    <div className="w-full h-full rounded-xl overflow-hidden border border-white/10 relative z-0 shadow-[0_0_30px_rgba(0,255,255,0.1)]">
      <MapContainer 
        center={position} 
        zoom={11} 
        style={{ height: '100%', width: '100%', background: '#0a0a0a' }}
        zoomControl={false}
      >
        <MapUpdater city={city} />
        {/* CARTO Dark Matter Tiles for the neon aesthetic without API keys */}
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />
        
        {/* Main Hotspot Marker using Circle so it scales with zoom (radius in meters) */}
        <Circle 
          center={position}
          radius={aqi > 150 ? 15000 : aqi > 100 ? 10000 : 5000}
          pathOptions={{ 
            color: getMarkerColor(aqi), 
            fillColor: getMarkerColor(aqi), 
            fillOpacity: 0.3,
            weight: 2
          }}
        >
          <Popup className="custom-popup">
            <div className="bg-black/90 p-2 text-white font-mono text-xs border border-[var(--color-neon-cyan)] rounded">
              <strong className="text-[var(--color-neon-cyan)]">GEO-NODE: {city.toUpperCase()}</strong><br />
              Status: {aqi > 150 ? 'CRITICAL' : 'STABLE'}<br />
              Local AQI: {Math.round(aqi)}
            </div>
          </Popup>
        </Circle>
      </MapContainer>
    </div>
  );
};

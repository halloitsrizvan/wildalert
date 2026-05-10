"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";

// Dynamic imports for Leaflet components
const MapContainer = dynamic(() => import("react-leaflet").then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then(mod => mod.TileLayer), { ssr: false });
const Polygon = dynamic(() => import("react-leaflet").then(mod => mod.Polygon), { ssr: false });
const Marker = dynamic(() => import("react-leaflet").then(mod => mod.Marker), { ssr: false });

interface CommunityViewMapProps {
  polygonData: any;
  riskLevel: string;
}

export default function CommunityViewMap({ polygonData, riskLevel }: CommunityViewMapProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient || !polygonData) return <div className="w-full h-full bg-white/5 animate-pulse rounded-2xl" />;

  // GeoJSON coordinates are [lng, lat], Leaflet Polygon expects [lat, lng]
  const leafletCoordinates = polygonData.coordinates[0].map((coord: [number, number]) => [coord[1], coord[0]]);
  
  // Calculate center
  const center: [number, number] = [leafletCoordinates[0][0], leafletCoordinates[0][1]];

  const riskColor = 
    riskLevel === 'critical' ? "#ef4444" : 
    riskLevel === 'high' ? "#f59e0b" : 
    riskLevel === 'medium' ? "#3b82f6" : "#22c55e";

  return (
    <div className="w-full h-full rounded-2xl overflow-hidden border border-white/10 shadow-2xl relative">
      <MapContainer 
        center={center} 
        zoom={12} 
        className="w-full h-full z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        <Polygon
          positions={leafletCoordinates}
          pathOptions={{
            color: riskColor,
            fillColor: riskColor,
            fillOpacity: 0.2,
            weight: 3,
            dashArray: '5, 10'
          }}
        />
      </MapContainer>
      <div className="absolute bottom-6 left-6 z-10 glass-dark p-4 rounded-xl border border-white/10">
        <div className="text-[10px] uppercase font-black text-white mb-2 tracking-widest">Operational Boundary</div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground font-bold">
           <div className="w-3 h-3 rounded-full" style={{ backgroundColor: riskColor }} />
           Active Geo-Fence Unit
        </div>
      </div>
    </div>
  );
}

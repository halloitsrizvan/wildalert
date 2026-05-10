"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const Polygon = dynamic(
  () => import("react-leaflet").then((mod) => mod.Polygon),
  { ssr: false }
);
const Circle = dynamic(
  () => import("react-leaflet").then((mod) => mod.Circle),
  { ssr: false }
);
const Tooltip = dynamic(
  () => import("react-leaflet").then((mod) => mod.Tooltip),
  { ssr: false }
);

interface SpatialMapProps {
  center: [number, number];
}

export default function SpatialAnalysisMap({ center }: SpatialMapProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  // Mock Corridor Polygons (Coordinates relative to center)
  const corridor1: [number, number][] = [
    [center[0] + 0.01, center[1] - 0.01],
    [center[0] + 0.015, center[1] + 0.005],
    [center[0] + 0.005, center[1] + 0.01],
    [center[0] - 0.005, center[1] - 0.005],
  ];

  const corridor2: [number, number][] = [
    [center[0] - 0.01, center[1] + 0.01],
    [center[0] - 0.02, center[1] + 0.02],
    [center[0] - 0.025, center[1] + 0.015],
    [center[0] - 0.015, center[1] + 0.005],
  ];

  // High Risk Zones
  const riskZones = [
    { pos: [center[0] + 0.008, center[1] + 0.002] as [number, number], radius: 300, name: "Village Boundary A" },
    { pos: [center[0] - 0.012, center[1] + 0.012] as [number, number], radius: 500, name: "Watering Hole Sector 4" },
    { pos: [center[0] + 0.002, center[1] - 0.015] as [number, number], radius: 400, name: "Crop Raid Zone" },
  ];

  return (
    <div className="w-full h-full min-h-[600px] rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl relative">
      <MapContainer
        center={center}
        zoom={14}
        scrollWheelZoom={false}
        className="w-full h-full grayscale-[0.8] contrast-[1.2]"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />

        {/* Elephant Corridors */}
        <Polygon 
          positions={corridor1} 
          pathOptions={{ 
            fillColor: '#3b82f6', 
            fillOpacity: 0.2, 
            color: '#3b82f6', 
            weight: 2,
            dashArray: '5, 10'
          }}
        >
          <Tooltip permanent direction="center" className="bg-transparent border-none shadow-none text-[8px] font-black uppercase text-primary tracking-[0.3em]">
            Primary Corridor Alpha
          </Tooltip>
        </Polygon>

        <Polygon 
          positions={corridor2} 
          pathOptions={{ 
            fillColor: '#3b82f6', 
            fillOpacity: 0.15, 
            color: '#3b82f6', 
            weight: 2,
            dashArray: '5, 10'
          }}
        >
          <Tooltip permanent direction="center" className="bg-transparent border-none shadow-none text-[8px] font-black uppercase text-primary tracking-[0.3em]">
            Secondary Migration Path
          </Tooltip>
        </Polygon>

        {/* High Risk Circles */}
        {riskZones.map((zone, i) => (
          <Circle
            key={i}
            center={zone.pos}
            radius={zone.radius}
            pathOptions={{
              fillColor: '#ef4444',
              fillOpacity: 0.3,
              color: '#ef4444',
              weight: 1,
              className: 'animate-pulse'
            }}
          >
            <Tooltip direction="top" className="bg-zinc-900 border-red-500/30 text-red-500 text-[8px] font-black uppercase px-2 py-1 rounded">
               HIGH RISK: {zone.name}
            </Tooltip>
          </Circle>
        ))}

        {/* Sector Center Marker */}
        <Circle 
          center={center} 
          radius={50} 
          pathOptions={{ fillColor: 'white', fillOpacity: 1, color: 'white', weight: 4 }} 
        />
      </MapContainer>
      
      {/* Overlay Legend */}
      <div className="absolute bottom-8 left-8 z-[1000] space-y-2 pointer-events-none">
         <div className="flex items-center gap-3 bg-black/60 backdrop-blur-xl px-4 py-2 rounded-xl border border-white/10">
            <div className="w-3 h-3 bg-red-500/40 rounded-full border border-red-500" />
            <span className="text-[9px] font-black uppercase text-white tracking-widest">High Conflict Zone</span>
         </div>
         <div className="flex items-center gap-3 bg-black/60 backdrop-blur-xl px-4 py-2 rounded-xl border border-white/10">
            <div className="w-5 h-1 border-t-2 border-dashed border-primary" />
            <span className="text-[9px] font-black uppercase text-white tracking-widest">Elephant Transit Corridor</span>
         </div>
      </div>
    </div>
  );
}

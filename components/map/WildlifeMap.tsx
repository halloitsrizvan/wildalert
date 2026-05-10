"use client";

import { useEffect, useState, Fragment } from "react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import { WildlifeReport, Village, Ranger, Community } from "@/types";
import { getCommunities } from "@/lib/communities";

// Dynamic import for Leaflet components to avoid SSR issues
const MapContainer = dynamic(() => import("react-leaflet").then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import("react-leaflet").then(mod => mod.Marker), { ssr: false });
const Popup = dynamic(() => import("react-leaflet").then(mod => mod.Popup), { ssr: false });
const Circle = dynamic(() => import("react-leaflet").then(mod => mod.Circle), { ssr: false });
const Polyline = dynamic(() => import("react-leaflet").then(mod => mod.Polyline), { ssr: false });
const Polygon = dynamic(() => import("react-leaflet").then(mod => mod.Polygon), { ssr: false });

interface WildlifeMapProps {
  reports?: WildlifeReport[];
  villages?: Village[];
  rangers?: Ranger[];
  center?: [number, number];
  zoom?: number;
}

export default function WildlifeMap({
  reports = [],
  villages = [],
  rangers = [],
  center = [10.5276, 76.2144], // Thrissur, Kerala center
  zoom = 8
}: WildlifeMapProps) {
  const [L, setL] = useState<any>(null);

  useEffect(() => {
    // Import leaflet only on client side
    import("leaflet").then((leaflet) => {
      setL(leaflet.default);
      
      // Fix marker icons
      // @ts-ignore
      delete leaflet.default.Icon.Default.prototype._getIconUrl;
      leaflet.default.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
      });
    });
  }, []);

  if (!L) return (
    <div className="w-full h-full bg-card flex items-center justify-center border border-white/5 rounded-2xl">
      <div className="text-muted-foreground animate-pulse">Loading GIS Intelligence...</div>
    </div>
  );

  return (
    <div className="w-full h-full rounded-2xl overflow-hidden border border-white/5 shadow-2xl relative">
      <MapContainer 
        center={center} 
        zoom={zoom} 
        className="w-full h-full z-0"
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />

        {/* Community Boundaries */}
        {communities.map((community) => {
          if (!community.polygonCoordinates) return null;
          const leafletCoordinates = community.polygonCoordinates.coordinates[0].map((coord: [number, number]) => [coord[1], coord[0]]);
          const riskColor = 
            community.riskLevel === 'critical' ? "#ef4444" : 
            community.riskLevel === 'high' ? "#f59e0b" : 
            community.riskLevel === 'medium' ? "#3b82f6" : "#22c55e";

          return (
            <Polygon
              key={community.id}
              positions={leafletCoordinates}
              pathOptions={{
                color: riskColor,
                fillColor: riskColor,
                fillOpacity: 0.15,
                weight: 2,
                dashArray: '3, 6'
              }}
            >
              <Popup>
                <div className="p-2">
                  <h3 className="font-bold text-primary">{community.name}</h3>
                  <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">{community.riskLevel} Risk Network</p>
                </div>
              </Popup>
            </Polygon>
          );
        })}

        {/* Wildlife Reports Markers */}
        {reports.map((report) => (
          <Fragment key={report.id}>
            <Marker position={[report.location.lat, report.location.lng]}>
              <Popup className="custom-popup">
                <div className="p-2 min-w-[200px]">
                  <h3 className="font-bold text-lg mb-1">{report.animalType} Sighting</h3>
                  <p className="text-xs text-muted-foreground mb-2">{report.location.name}</p>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${
                      report.severity === 'critical' ? 'bg-red-500/20 text-red-500' : 'bg-amber-500/20 text-amber-500'
                    }`}>
                      {report.severity}
                    </span>
                    <span className="text-[10px] text-muted-foreground">2 mins ago</span>
                  </div>
                  <p className="text-sm">{report.description}</p>
                </div>
              </Popup>
            </Marker>
            {report.severity === 'critical' && (
              <Circle 
                center={[report.location.lat, report.location.lng]} 
                radius={2000} 
                pathOptions={{ color: 'red', fillColor: 'red', fillOpacity: 0.1, weight: 1 }} 
              />
            )}
          </Fragment>
        ))}

        {/* Village Markers */}
        {villages.map((village) => (
          <Marker 
            key={village.id} 
            position={[village.location.lat, village.location.lng]}
          >
            <Popup>
              <div className="p-1">
                <h3 className="font-bold">{village.name} Village</h3>
                <p className="text-xs">Risk Level: {village.riskLevel}</p>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Ranger Markers */}
        {rangers.map((ranger) => (
          <Marker 
            key={ranger.id} 
            position={[ranger.location.lat, ranger.location.lng]}
          >
            <Popup>
              <div className="p-1">
                <h3 className="font-bold">{ranger.name}</h3>
                <p className="text-xs">{ranger.rank}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Map Legend */}
      <div className="absolute bottom-6 right-6 z-10 glass-dark p-4 rounded-xl border-white/10 text-xs space-y-2 pointer-events-none">
        <div className="font-bold text-white mb-2 uppercase tracking-widest text-[10px]">Intelligence Legend</div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <div className="w-3 h-3 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]" />
          Critical Alert
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <div className="w-3 h-3 rounded-full bg-amber-500" />
          High Risk Sighting
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <div className="w-3 h-3 rounded-full bg-blue-500" />
          Ranger Unit
        </div>
      </div>
    </div>
  );
}

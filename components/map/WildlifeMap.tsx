"use client";

import { useEffect, useState, Fragment } from "react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import { WildlifeReport, Village, Ranger, Community, Alert } from "@/types";
import { getCommunities } from "@/lib/communities";
import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { AlertTriangle, MapPin } from "lucide-react";

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
  alerts?: Alert[];
  center?: [number, number];
  zoom?: number;
}

export default function WildlifeMap({
  reports = [],
  villages = [],
  rangers = [],
  alerts = [],
  center = [10.5276, 76.2144], // Thrissur, Kerala center
  zoom = 8
}: WildlifeMapProps) {
  const [L, setL] = useState<any>(null);
  const [communities, setCommunities] = useState<Community[]>([]);

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

    // Fetch communities for boundaries
    async function fetch() {
      try {
        const data = await getCommunities();
        setCommunities(data);
      } catch (err) {
        console.error("Failed to fetch communities for map", err);
      }
    }
    fetch();
  }, []);

  if (!L) return (
    <div className="w-full h-full bg-card flex items-center justify-center border border-white/5 rounded-2xl">
      <div className="text-white animate-pulse uppercase font-black tracking-widest text-[10px]">Loading GIS Intelligence...</div>
    </div>
  );

  // Helper component to handle map re-centering and size invalidation
  const MapViewHandler = () => {
    const { useMap } = require("react-leaflet");
    const map = useMap();
    
    useEffect(() => {
      // Small delay to ensure container is fully rendered
      const timer = setTimeout(() => {
        map.invalidateSize();
      }, 100);
      
      map.setView(center, zoom);
      
      // Also handle window resizes
      const handleResize = () => map.invalidateSize();
      window.addEventListener('resize', handleResize);
      
      return () => {
        clearTimeout(timer);
        window.removeEventListener('resize', handleResize);
      };
    }, [map, center, zoom]);
    
    return null;
  };

  // Component to show user's current location pulse
  const UserLocationMarker = () => {
    const [pos, setPos] = useState<[number, number] | null>(null);
    useEffect(() => {
      if (typeof window !== "undefined" && "geolocation" in navigator) {
        const watchId = navigator.geolocation.watchPosition(
          (p) => setPos([p.coords.latitude, p.coords.longitude]),
          () => {},
          { enableHighAccuracy: true }
        );
        return () => navigator.geolocation.clearWatch(watchId);
      }
    }, []);

    if (!pos) return null;
    return (
      <Fragment>
        <Circle 
          center={pos} 
          radius={50} 
          pathOptions={{ color: '#3b82f6', fillColor: '#3b82f6', fillOpacity: 0.8, weight: 2 }} 
        />
        <Circle 
          center={pos} 
          radius={400} 
          pathOptions={{ color: '#3b82f6', fillColor: '#3b82f6', fillOpacity: 0.1, weight: 1, dashArray: '5, 10' }} 
          className="animate-pulse"
        />
      </Fragment>
    );
  };

  return (
    <div className="w-full h-full rounded-2xl overflow-hidden border border-white/5 shadow-2xl relative">
      <MapContainer 
        center={center} 
        zoom={zoom} 
        className="w-full h-full z-0"
        scrollWheelZoom={true}
      >
        <MapViewHandler />
        <UserLocationMarker />
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
                  <p className="text-[10px] text-white uppercase font-bold tracking-widest">{community.riskLevel} Risk Network</p>
                </div>
              </Popup>
            </Polygon>
          );
        })}

        {/* Wildlife Reports Markers */}
        {reports.map((report) => (
          <Fragment key={report.id}>
            <Marker position={[report.location.lat, report.location.lng]}>
              <Popup>
                <div className="p-3 min-w-[200px] bg-zinc-950 text-white rounded-xl">
                  <h3 className="font-black text-lg mb-1 uppercase tracking-tight">{report.animalType} Sighting</h3>
                  <div className="flex items-center gap-2 mb-3">
                    <Badge className={cn(
                      "text-[9px] font-black uppercase px-1.5 py-0.5",
                      report.severity === 'critical' ? 'bg-red-500' : 'bg-amber-500'
                    )}>
                      {report.severity} RISK
                    </Badge>
                    <span className="text-[9px] text-white/40 font-bold uppercase">
                      {report.timestamp ? formatDistanceToNow(report.timestamp.toDate()) + " ago" : "Just now"}
                    </span>
                  </div>
                  <p className="text-xs text-white/70 mb-4 leading-relaxed italic">"{report.description}"</p>
                  
                  <div className="flex items-center justify-between gap-4 pt-3 border-t border-white/10">
                    <div className="text-[10px] text-primary font-black uppercase tracking-widest flex items-center gap-2">
                      <MapPin className="w-3 h-3" />
                      {report.location.name}
                    </div>
                    <a 
                      href={`https://www.google.com/maps?q=${report.location.lat},${report.location.lng}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-[9px] font-black uppercase text-white bg-primary px-2 py-1 rounded hover:bg-primary/80 transition-colors no-underline"
                    >
                      NAVIGATE
                    </a>
                  </div>
                </div>
              </Popup>
            </Marker>
            {report.severity === 'critical' && (
              <Circle 
                center={[report.location.lat, report.location.lng]} 
                radius={1500} 
                pathOptions={{ color: '#ef4444', fillColor: '#ef4444', fillOpacity: 0.05, weight: 1, dashArray: '5, 10' }} 
              />
            )}
          </Fragment>
        ))}

        {/* Emergency Alert Dots */}
        {(alerts || []).map((alert) => {
          if (!alert.location) return null;
          return (
            <Fragment key={alert.id}>
              <Marker 
                position={[alert.location.lat, alert.location.lng]}
                icon={L.divIcon({
                  className: 'custom-div-icon',
                  html: `<div class="w-4 h-4 bg-red-500 rounded-full border-2 border-white animate-ping"></div>`,
                  iconSize: [16, 16],
                  iconAnchor: [8, 8]
                })}
              >
                <Popup>
                  <div className="p-3 bg-red-950 text-white rounded-xl border border-red-500/30">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="w-4 h-4 text-red-500" />
                      <span className="text-[10px] font-black uppercase text-red-500">Emergency Broadcast</span>
                    </div>
                    <h3 className="font-black text-sm uppercase mb-1">{alert.title}</h3>
                    <p className="text-xs text-red-200/70 mb-4">{alert.message}</p>
                    <a 
                      href={`https://www.google.com/maps?q=${alert.location.lat},${alert.location.lng}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-block text-[9px] font-black uppercase text-white bg-red-600 px-3 py-1.5 rounded hover:bg-red-700 transition-colors no-underline"
                    >
                      OPEN IN GOOGLE MAPS
                    </a>
                  </div>
                </Popup>
              </Marker>
              <Circle 
                center={[alert.location.lat, alert.location.lng]} 
                radius={2500} 
                pathOptions={{ 
                  color: '#ef4444', 
                  fillColor: '#ef4444', 
                  fillOpacity: 0.1, 
                  weight: 2,
                  dashArray: '10, 10'
                }} 
              />
            </Fragment>
          );
        })}
      </MapContainer>

      {/* Map Legend */}
      <div className="absolute bottom-6 right-6 z-10 glass-dark p-4 rounded-xl border-white/10 text-xs space-y-2 pointer-events-none">
        <div className="font-bold text-white mb-2 uppercase tracking-widest text-[10px]">Intelligence Legend</div>
        <div className="flex items-center gap-2 text-white">
          <div className="w-3 h-3 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]" />
          Critical Alert
        </div>
        <div className="flex items-center gap-2 text-white">
          <div className="w-3 h-3 rounded-full bg-amber-500" />
          High Risk Sighting
        </div>
        <div className="flex items-center gap-2 text-white">
          <div className="w-3 h-3 rounded-full bg-blue-500" />
          Ranger Unit
        </div>
      </div>
    </div>
  );
}

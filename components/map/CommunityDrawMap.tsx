"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";

// Dynamic imports for Leaflet components
const MapContainer = dynamic(() => import("react-leaflet").then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then(mod => mod.TileLayer), { ssr: false });
const FeatureGroup = dynamic(() => import("react-leaflet").then(mod => mod.FeatureGroup), { ssr: false });
const EditControl = dynamic(() => import("react-leaflet-draw").then(mod => mod.EditControl), { ssr: false });

interface CommunityDrawMapProps {
  onPolygonCreated: (geojson: any) => void;
  center?: [number, number];
}

export default function CommunityDrawMap({ onPolygonCreated, center = [10.8505, 76.2711] }: CommunityDrawMapProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // Fix leaflet icons
    import("leaflet").then((L) => {
      // @ts-ignore
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
      });
    });
  }, []);

  if (!isClient) return <div className="w-full h-[400px] bg-white/5 animate-pulse rounded-xl" />;

  const _onCreated = (e: any) => {
    const { layerType, layer } = e;
    if (layerType === "polygon") {
      const geojson = layer.toGeoJSON();
      onPolygonCreated(geojson.geometry);
    }
  };

  return (
    <div className="w-full h-[500px] rounded-2xl overflow-hidden border border-white/10 shadow-2xl relative">
      <MapContainer 
        center={center} 
        zoom={10} 
        className="w-full h-full z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        <FeatureGroup>
          <EditControl
            position="topright"
            onCreated={_onCreated}
            draw={{
              rectangle: false,
              circle: false,
              polyline: false,
              circlemarker: false,
              marker: false,
              polygon: {
                allowIntersection: false,
                drawError: {
                  color: "#e1e1e1",
                  message: "<strong>Oh snap!<strong> you can't draw that!"
                },
                shapeOptions: {
                  color: "#22c55e",
                  fillColor: "#22c55e",
                  fillOpacity: 0.2
                }
              }
            }}
          />
        </FeatureGroup>
      </MapContainer>
      <div className="absolute bottom-4 left-4 z-10 glass-dark p-3 rounded-lg border border-white/10 text-[10px] text-white uppercase font-bold">
        Draw a polygon to define community boundaries
      </div>
    </div>
  );
}

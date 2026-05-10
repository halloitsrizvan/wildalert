"use client";

import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useState, useEffect } from "react";

// Fix for default marker icon
const DefaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

interface ReportLocationMapProps {
  onLocationSet: (coords: [number, number]) => void;
}

function MapInteraction({ onLocationSet, userLocation }: ReportLocationMapProps & { userLocation: [number, number] | null }) {
  const [marker, setMarker] = useState<[number, number] | null>(null);

  const map = useMapEvents({
    click(e) {
      const coords: [number, number] = [e.latlng.lat, e.latlng.lng];
      setMarker(coords);
      onLocationSet(coords);
    },
  });

  // Re-center map when user location is found
  useEffect(() => {
    if (userLocation) {
      map.setView(userLocation, 15);
    }
  }, [userLocation, map]);

  return marker ? <Marker position={marker} /> : null;
}

export default function ReportLocationMap({ onLocationSet }: ReportLocationMapProps) {
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && "geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords: [number, number] = [position.coords.latitude, position.coords.longitude];
          setUserLocation(coords);
          // Set initial marker to current location
          onLocationSet(coords);
        },
        (error) => {
          console.warn("[GIS] Location access for reporting denied.", error);
        },
        { enableHighAccuracy: true }
      );
    }
  }, []);

  return (
    <MapContainer
      center={userLocation || [10.8505, 76.2711]} // Use location or Kerala center
      zoom={userLocation ? 15 : 7}
      style={{ height: "100%", width: "100%" }}
      className="z-0"
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
      />
      <MapInteraction onLocationSet={onLocationSet} userLocation={userLocation} />
    </MapContainer>
  );
}

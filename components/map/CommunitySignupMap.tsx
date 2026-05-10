"use client";

import { MapContainer, TileLayer, Marker, Circle, useMapEvents } from "react-leaflet";
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

interface CommunitySignupMapProps {
  onCircleSet: (data: { center: [number, number]; radius: number }) => void;
}

function MapInteraction({ onCircleSet, userLocation }: CommunitySignupMapProps & { userLocation: [number, number] | null }) {
  const [center, setCenter] = useState<[number, number] | null>(null);
  const [radiusPoint, setRadiusPoint] = useState<[number, number] | null>(null);
  const [radius, setRadius] = useState(0);

  const map = useMapEvents({
    click(e) {
      if (!center) {
        const coords: [number, number] = [e.latlng.lat, e.latlng.lng];
        setCenter(coords);
      } else if (!radiusPoint) {
        const coords: [number, number] = [e.latlng.lat, e.latlng.lng];
        setRadiusPoint(coords);
        
        // Calculate distance for radius
        const dist = map.distance(center, coords);
        setRadius(dist);
        onCircleSet({ center, radius: dist });
      } else {
        // Reset and start over
        const coords: [number, number] = [e.latlng.lat, e.latlng.lng];
        setCenter(coords);
        setRadiusPoint(null);
        setRadius(0);
      }
    },
  });

  // Re-center map when user location is found
  useEffect(() => {
    if (userLocation) {
      map.setView(userLocation, 13);
    }
  }, [userLocation, map]);

  return (
    <>
      {center && <Marker position={center} />}
      {radiusPoint && <Marker position={radiusPoint} />}
      {center && radius > 0 && (
        <Circle 
          center={center} 
          radius={radius} 
          pathOptions={{ 
            color: '#22c55e', 
            fillColor: '#22c55e', 
            fillOpacity: 0.2,
            dashArray: '5, 10',
            weight: 3
          }} 
        />
      )}
    </>
  );
}

export default function CommunitySignupMap({ onCircleSet }: CommunitySignupMapProps) {
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && "geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude]);
        },
        (error) => {
          let message = "Unknown Geolocation Error";
          switch(error.code) {
            case error.PERMISSION_DENIED:
              message = "User denied Geolocation access.";
              break;
            case error.POSITION_UNAVAILABLE:
              message = "Location information is unavailable.";
              break;
            case error.TIMEOUT:
              message = "The request to get user location timed out.";
              break;
          }
          console.warn(`[GIS] ${message}`, error);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    }
  }, []);

  return (
    <MapContainer
      center={userLocation || [10.8505, 76.2711]} // Use location or Kerala center
      zoom={userLocation ? 13 : 7}
      style={{ height: "100%", width: "100%" }}
      className="z-0"
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
      />
      <MapInteraction onCircleSet={onCircleSet} userLocation={userLocation} />
    </MapContainer>
  );
}

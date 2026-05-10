"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Community } from "@/types";
import { findCommunityByPoint } from "@/lib/communities";

interface CommunityContextType {
  currentCommunity: Community | null;
  loading: boolean;
  userLocation: { lat: number; lng: number } | null;
  detectCommunity: () => Promise<void>;
}

const CommunityContext = createContext<CommunityContextType | undefined>(undefined);

export function CommunityProvider({ children }: { children: React.ReactNode }) {
  const [currentCommunity, setCurrentCommunity] = useState<Community | null>(null);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  const detectCommunity = async () => {
    if (!navigator.geolocation) {
      console.warn("Geolocation is not supported by this browser.");
      setLoading(false);
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ lat: latitude, lng: longitude });
        
        try {
          const community = await findCommunityByPoint(latitude, longitude);
          setCurrentCommunity(community);
        } catch (error) {
          console.error("Error detecting community polygon:", error);
        } finally {
          setLoading(false);
        }
      },
      (error) => {
        let errorMessage = "Unknown geolocation error";
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Location access denied by user.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information unavailable.";
            break;
          case error.TIMEOUT:
            errorMessage = "Location request timed out.";
            break;
        }
        console.warn(`Geo-Fencing Status: ${errorMessage}. Operating in global mode.`);
        setLoading(false);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  useEffect(() => {
    detectCommunity();
  }, []);

  return (
    <CommunityContext.Provider value={{ currentCommunity, loading, userLocation, detectCommunity }}>
      {children}
    </CommunityContext.Provider>
  );
}

export function useCommunity() {
  const context = useContext(CommunityContext);
  if (context === undefined) {
    throw new Error("useCommunity must be used within a CommunityProvider");
  }
  return context;
}

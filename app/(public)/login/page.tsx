"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useCommunity } from "@/hooks/useCommunity";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Shield, Users, MapPin, ChevronRight, Activity, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export default function LoginPage() {
  const { login } = useAuth();
  const { currentCommunity, loading: geoLoading } = useCommunity();
  const router = useRouter();

  const handleAdminLogin = () => {
    login('community_admin');
    router.push("/communities/create");
  };

  const handleCitizenLogin = () => {
    if (currentCommunity) {
      login('citizen', currentCommunity.id);
      router.push("/map");
    } else {
      alert("No community network detected at your location. Please contact your local forest range office.");
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Admin Path */}
        <Card className="bg-card border-white/5 group hover:border-primary/50 transition-all cursor-pointer overflow-hidden relative" onClick={handleAdminLogin}>
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
            <Shield className="w-32 h-32 text-primary" />
          </div>
          <CardHeader className="p-8">
            <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center mb-6">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <CardTitle className="text-3xl font-black uppercase tracking-tighter text-white">Network Authority</CardTitle>
            <CardDescription className="text-white/50">
              Establish a new geo-fenced wildlife intelligence network for your district.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8 pt-0">
             <ul className="space-y-3 mb-8">
                {["Define Community Boundaries", "Configure Risk Parameters", "Manage Alert Protocols"].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-xs text-white/70">
                    <div className="w-1 h-1 rounded-full bg-primary" />
                    {item}
                  </li>
                ))}
             </ul>
             <Button className="w-full h-14 bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-widest">
               Initialize Network
               <ArrowRight className="ml-2 w-5 h-5" />
             </Button>
          </CardContent>
        </Card>

        {/* Citizen Path */}
        <Card 
          className={cn(
            "bg-card border-white/5 group transition-all overflow-hidden relative",
            currentCommunity ? "hover:border-blue-500 cursor-pointer" : "opacity-80 grayscale"
          )}
          onClick={currentCommunity ? handleCitizenLogin : undefined}
        >
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
            <Users className="w-32 h-32 text-blue-500" />
          </div>
          <CardHeader className="p-8">
            <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center mb-6">
              <Users className="w-6 h-6 text-blue-500" />
            </div>
            <CardTitle className="text-3xl font-black uppercase tracking-tighter text-white">Citizen Entry</CardTitle>
            <CardDescription className="text-white/50">
              Join your local wildlife safety network to receive real-time emergency alerts.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8 pt-0">
             {geoLoading ? (
               <div className="h-14 flex items-center justify-center gap-3 bg-white/5 rounded-xl border border-white/10">
                 <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                 <span className="text-xs font-bold uppercase tracking-widest text-white/50">Detecting Location...</span>
               </div>
             ) : currentCommunity ? (
               <div className="space-y-6">
                 <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-between">
                    <div>
                      <div className="text-[10px] text-blue-500 uppercase font-black tracking-[0.2em]">Network Detected</div>
                      <div className="text-lg font-bold text-white">{currentCommunity.name}</div>
                    </div>
                    <MapPin className="w-6 h-6 text-blue-500 animate-bounce" />
                 </div>
                 <Button className="w-full h-14 bg-blue-500 hover:bg-blue-600 text-white font-black uppercase tracking-widest">
                   Enter Intelligence Network
                   <ArrowRight className="ml-2 w-5 h-5" />
                 </Button>
               </div>
             ) : (
               <div className="space-y-6">
                 <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                    <div className="text-[10px] text-red-500 uppercase font-black tracking-[0.2em] mb-1">No Network Detected</div>
                    <div className="text-xs text-white/70 leading-relaxed">
                      You are currently outside any established geo-fenced safety zones.
                    </div>
                 </div>
                 <Button variant="outline" className="w-full h-14 border-white/10 text-white/50 font-black uppercase tracking-widest cursor-not-allowed">
                   No Network Available
                 </Button>
               </div>
             )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

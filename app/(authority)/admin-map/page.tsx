"use client";

import WildlifeMap from "@/components/map/WildlifeMap";
import { MOCK_REPORTS, MOCK_VILLAGES, MOCK_RANGERS } from "@/data/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, MapPin, Shield, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

export default function LiveMapPage() {
  return (
    <div className="h-[calc(100vh-120px)] flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
            <MapPin className="w-8 h-8 text-primary" />
            Live Wildlife Intelligence
          </h1>
          <p className="text-white">Interactive GIS monitoring for Kerala Forest Divisions.</p>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline" className="bg-primary/10 border-primary/20 text-primary px-3 py-1">
            <Activity className="w-3 h-3 mr-2" />
            Live Feed: Active
          </Badge>
          <Badge variant="outline" className="bg-amber-500/10 border-amber-500/20 text-amber-500 px-3 py-1">
            <AlertTriangle className="w-3 h-3 mr-2" />
            High Risk: 3 Zones
          </Badge>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6 min-h-0">
        {/* Map View */}
        <div className="lg:col-span-3 h-full">
          <WildlifeMap 
            reports={MOCK_REPORTS} 
            villages={MOCK_VILLAGES} 
            rangers={MOCK_RANGERS} 
          />
        </div>

        {/* Sidebar Info */}
        <div className="lg:col-span-1 flex flex-col gap-6 overflow-y-auto pr-2">
          <Card className="bg-card border-white/5">
            <CardHeader>
              <CardTitle className="text-sm font-bold text-white uppercase tracking-wider">Active Operations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {MOCK_RANGERS.map((ranger) => (
                <div key={ranger.id} className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/5">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white">{ranger.name}</div>
                    <div className="text-xs text-white">{ranger.rank} • Active</div>
                  </div>
                  <div className="ml-auto w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="bg-card border-white/5">
            <CardHeader>
              <CardTitle className="text-sm font-bold text-white uppercase tracking-wider">Hotspot Analytics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { label: "Wayanad Zone", value: "85", color: "bg-red-500" },
                { label: "Palakkad Gap", value: "62", color: "bg-amber-500" },
                { label: "Periyar Basin", value: "45", color: "bg-blue-500" },
              ].map((zone, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-white">{zone.label}</span>
                    <span className="text-white font-bold">{zone.value}% Risk</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <div 
                      className={cn("h-full rounded-full transition-all duration-1000", zone.color)} 
                      style={{ width: `${zone.value}%` }} 
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <div className="p-4 rounded-xl bg-primary/10 border border-primary/20">
            <h4 className="text-sm font-bold text-primary mb-1">Intelligence Update</h4>
            <p className="text-xs text-primary/80 leading-relaxed">
              Elephant corridor movement detected in sector 4B. Rangers deployed for intercept.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import WildlifeMap from "@/components/map/WildlifeMap";
import { MOCK_REPORTS, MOCK_VILLAGES, MOCK_ALERTS } from "@/data/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, MapPin, Activity, ChevronRight, Filter, Shield, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function PublicLiveMap() {
  const [activeTab, setActiveTab] = useState<'alerts' | 'info'>('alerts');

  return (
    <div className="h-screen flex flex-col bg-black overflow-hidden">
      <Navbar />
      
      <div className="flex-1 relative flex overflow-hidden pt-16">
        {/* Fullscreen Map Background */}
        <div className="absolute inset-0 z-0">
          <WildlifeMap 
            reports={MOCK_REPORTS} 
            villages={MOCK_VILLAGES} 
            zoom={9}
          />
        </div>

        {/* Floating Sidebar - Right */}
        <div className="absolute top-6 right-6 bottom-6 w-96 z-10 flex flex-col gap-4 pointer-events-none">
          {/* Risk Indicator Widget */}
          <Card className="glass-dark border-white/10 pointer-events-auto">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center animate-pulse">
                  <Activity className="w-5 h-5 text-red-500" />
                </div>
                <div>
                  <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest leading-none mb-1">State Risk Index</div>
                  <div className="text-xl font-bold text-white leading-none">HIGH <span className="text-red-500">84%</span></div>
                </div>
              </div>
              <Button size="icon" variant="ghost" className="text-muted-foreground hover:text-white">
                <Info className="w-4 h-4" />
              </Button>
            </CardContent>
          </Card>

          {/* Intelligence Tabs */}
          <div className="flex-1 flex flex-col min-h-0 pointer-events-auto">
            <div className="flex bg-black/40 backdrop-blur-xl border border-white/10 rounded-t-xl p-1">
              <button 
                onClick={() => setActiveTab('alerts')}
                className={cn(
                  "flex-1 py-2 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all",
                  activeTab === 'alerts' ? "bg-primary text-white" : "text-muted-foreground hover:text-white"
                )}
              >
                Live Alerts
              </button>
              <button 
                onClick={() => setActiveTab('info')}
                className={cn(
                  "flex-1 py-2 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all",
                  activeTab === 'info' ? "bg-primary text-white" : "text-muted-foreground hover:text-white"
                )}
              >
                GIS Info
              </button>
            </div>
            
            <div className="flex-1 glass-dark border-t-0 border-white/10 rounded-b-xl overflow-hidden flex flex-col">
              <div className="p-4 border-b border-white/5 flex items-center justify-between">
                <h3 className="text-xs font-bold text-white uppercase tracking-widest">Intelligence Feed</h3>
                <Badge variant="outline" className="text-[10px] bg-primary/10 border-primary/20 text-primary">Realtime</Badge>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {MOCK_ALERTS.map((alert) => (
                  <div key={alert.id} className="p-4 rounded-xl bg-white/5 border border-white/5 hover:border-primary/30 transition-all cursor-pointer group">
                    <div className="flex items-center justify-between mb-2">
                      <Badge className={cn(
                        alert.type === 'danger' ? "bg-red-500/20 text-red-500 border-red-500/20" : "bg-amber-500/20 text-amber-500 border-amber-500/20"
                      )}>
                        {alert.type.toUpperCase()}
                      </Badge>
                      <span className="text-[10px] text-muted-foreground uppercase">2m ago</span>
                    </div>
                    <h4 className="text-sm font-bold text-white group-hover:text-primary transition-colors">{alert.title}</h4>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{alert.message}</p>
                    <div className="flex items-center gap-2 mt-3 pt-3 border-t border-white/5">
                      <MapPin className="w-3 h-3 text-primary" />
                      <span className="text-[10px] text-muted-foreground">Sector 4, Attappady</span>
                      <ChevronRight className="w-3 h-3 ml-auto text-primary" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Floating Controls - Left */}
        <div className="absolute top-6 left-6 z-10 flex flex-col gap-2 pointer-events-none">
          {[
            { icon: Filter, label: "Layers" },
            { icon: Shield, label: "Rangers" },
            { icon: Activity, label: "Hotspots" },
          ].map((item, i) => (
            <Button key={i} size="icon" className="glass-dark border-white/10 text-white pointer-events-auto hover:bg-primary/20">
              <item.icon className="w-5 h-5" />
            </Button>
          ))}
        </div>

        {/* Mobile Report Shortcut */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 lg:hidden">
          <Button size="lg" className="bg-primary text-white rounded-full shadow-2xl glow-green px-8">
            <AlertTriangle className="mr-2 w-5 h-5" />
            REPORT SIGHTING
          </Button>
        </div>
      </div>
    </div>
  );
}

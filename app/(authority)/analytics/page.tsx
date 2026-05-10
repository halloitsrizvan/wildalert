"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { db } from "@/lib/firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Activity, TrendingUp, AlertTriangle, Shield, Clock, Map as MapIcon, ChevronRight, BarChart3, PieChart, Zap } from "lucide-react";
import { motion } from "framer-motion";
import SpatialAnalysisMap from "@/components/analytics/SpatialAnalysisMap";

export default function RiskAnalyticsPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [sectorCenter, setSectorCenter] = useState<[number, number]>([10.8505, 76.2711]); // Fallback: Kerala

  useEffect(() => {
    // Simulated loading delay for high-precision calculation
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white p-6 space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
           <div className="w-12 h-12 rounded-2xl bg-amber-500/20 flex items-center justify-center border border-amber-500/20">
              <Zap className="w-6 h-6 text-amber-500" />
           </div>
           <div>
              <h1 className="text-3xl font-black uppercase tracking-tighter">Predictive Analytics</h1>
              <p className="text-[10px] text-white/40 font-black uppercase tracking-widest">Advanced Sector Threat Modeling & Heatmaps</p>
           </div>
        </div>
        <div className="flex items-center gap-2">
           <div className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest text-white/60">Live Signal Matrix</span>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Risk Breakdown */}
        <Card className="lg:col-span-1 bg-zinc-950 border-white/5 rounded-[2.5rem] overflow-hidden">
          <CardHeader className="bg-white/5 border-b border-white/10 p-8">
             <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center gap-3 text-white">
                <BarChart3 className="w-4 h-4 text-primary" />
                Sector Risk Profile
             </CardTitle>
          </CardHeader>
          <CardContent className="p-8 space-y-8">
             <div className="space-y-6">
                {[
                  { label: "Apex Predatory Activity", score: 82, color: "bg-red-500", risk: "CRITICAL" },
                  { label: "Corridor Encroachment", score: 65, color: "bg-amber-500", risk: "HIGH" },
                  { label: "Village Boundary Proximity", score: 48, color: "bg-primary", risk: "MODERATE" },
                  { label: "Human-Wildlife Conflict Index", score: 24, color: "bg-green-500", risk: "LOW" },
                ].map((item, i) => (
                  <div key={i} className="space-y-3">
                    <div className="flex justify-between items-end">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">{item.label}</span>
                        <span className={cn("text-xs font-black mt-1", item.score > 70 ? "text-red-500" : "text-white")}>{item.risk}</span>
                      </div>
                      <span className="text-2xl font-black text-white">{item.score}%</span>
                    </div>
                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${item.score}%` }}
                        transition={{ delay: i * 0.1, duration: 1 }}
                        className={cn("h-full rounded-full", item.color)}
                      />
                    </div>
                  </div>
                ))}
             </div>

             <div className="pt-8 border-t border-white/5 space-y-4">
                <div className="flex items-center justify-between">
                   <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Overall Sector Health</span>
                   <Badge className="bg-primary text-white font-black text-[10px] uppercase">OPERATIONAL</Badge>
                </div>
                <div className="p-6 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-between">
                   <div className="flex flex-col">
                      <span className="text-2xl font-black text-white">4.2</span>
                      <span className="text-[9px] text-white/40 font-bold uppercase">Average Risk Rating</span>
                   </div>
                   <TrendingUp className="w-8 h-8 text-primary opacity-20" />
                </div>
             </div>
          </CardContent>
        </Card>

        {/* Tactical GIS Visualization */}
        <Card className="lg:col-span-2 bg-zinc-950 border-white/5 rounded-[2.5rem] overflow-hidden relative group">
           <CardHeader className="absolute top-0 left-0 right-0 z-[1000] p-8 pointer-events-none">
              <div className="flex justify-between items-start">
                 <div className="bg-black/60 backdrop-blur-xl p-6 rounded-3xl border border-white/10 pointer-events-auto">
                    <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center gap-3 text-white">
                      <MapIcon className="w-4 h-4 text-primary" />
                      Tactical Spatial Intelligence
                    </CardTitle>
                    <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest mt-1">Live Simulation: Corridors & Conflict Nodes</p>
                    
                    <div className="mt-4 flex items-center gap-4">
                       <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                          <span className="text-[9px] font-black text-white/60 uppercase">GIS Stream Active</span>
                       </div>
                       <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                          <span className="text-[9px] font-black text-white/60 uppercase">Corridor Matrix Sync</span>
                       </div>
                    </div>
                 </div>
                 <div className="flex flex-col gap-2 pointer-events-auto">
                    <Badge className="bg-red-500/80 backdrop-blur-md text-white font-black uppercase text-[10px] px-3 py-1.5 border border-white/10">ALERT: Corridor Encroachment Detected</Badge>
                    <Badge className="bg-primary/80 backdrop-blur-md text-white font-black uppercase text-[10px] px-3 py-1.5 border border-white/10">Sector Alpha: Nominal Movement</Badge>
                 </div>
              </div>
           </CardHeader>
           
           <div className="w-full aspect-square bg-zinc-900 relative">
              <SpatialAnalysisMap center={sectorCenter} />
           </div>

           <div className="absolute bottom-8 left-8 right-8 flex gap-4 z-[1000]">
              <div className="flex-1 bg-black/60 backdrop-blur-xl p-6 rounded-[2rem] border border-white/10 flex items-center justify-between">
                 <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                       <Clock className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                       <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Peak Activity Hour</p>
                       <p className="text-lg font-black text-white uppercase tracking-tight">18:00 - 21:00</p>
                    </div>
                 </div>
                 <ChevronRight className="w-5 h-5 text-white/20" />
              </div>
              <div className="flex-1 bg-black/60 backdrop-blur-xl p-6 rounded-[2rem] border border-white/10 flex items-center justify-between">
                 <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
                       <PieChart className="w-5 h-5 text-amber-500" />
                    </div>
                    <div>
                       <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Primary Species</p>
                       <p className="text-lg font-black text-white uppercase tracking-tight">Wild Elephant</p>
                    </div>
                 </div>
                 <ChevronRight className="w-5 h-5 text-white/20" />
              </div>
           </div>
        </Card>
      </div>

      <style jsx>{`
        @keyframes scan {
          0% { top: 0; }
          100% { top: 100%; }
        }
      `}</style>
    </div>
  );
}

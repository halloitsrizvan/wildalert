"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Clock, MapPin, Shield, ChevronRight, Activity, Filter, Bell, Radio } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { db } from "@/lib/firebase";
import { collection, query, where, onSnapshot, orderBy, limit } from "firebase/firestore";
import { WildlifeReport, Alert } from "@/types";
import { formatDistanceToNow } from "date-fns";
import MiniPreviewMap from "@/components/map/MiniPreviewMap";

export default function PublicAlertFeed() {
  const { user } = useAuth();
  const [reports, setReports] = useState<WildlifeReport[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.communityId) {
      setLoading(false);
      return;
    }

    // Live Reports Feed
    const reportsQuery = query(
      collection(db, "reports"),
      where("communityId", "==", user.communityId),
      limit(20)
    );

    const unsubReports = onSnapshot(reportsQuery, (snapshot) => {
      const data = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() } as WildlifeReport))
        .sort((a, b) => (b.timestamp?.seconds || 0) - (a.timestamp?.seconds || 0));
      setReports(data);
    });

    // Live Emergency Alerts Feed
    const alertsQuery = query(
      collection(db, "alerts"),
      where("communityId", "==", user.communityId),
      limit(5)
    );

    const unsubAlerts = onSnapshot(alertsQuery, (snapshot) => {
      const data = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() } as Alert))
        .sort((a, b) => (b.timestamp?.seconds || 0) - (a.timestamp?.seconds || 0));
      setAlerts(data);
      setLoading(false);
    });

    return () => {
      unsubReports();
      unsubAlerts();
    };
  }, [user?.communityId]);

  const latestAlert = alerts[0];

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Top Sector Banner */}
      {user && (
        <div className="bg-primary/10 border-b border-primary/20 backdrop-blur-md sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
               <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30">
                  <Radio className="w-5 h-5 text-primary animate-pulse" />
               </div>
               <div>
                  <h2 className="text-sm font-black uppercase tracking-tighter">Sector Intelligence Active</h2>
                  <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Connected to Node: {user.communityId}</p>
               </div>
            </div>
            <div className="flex items-center gap-6">
               <div className="hidden md:flex flex-col items-end">
                  <span className="text-[10px] font-bold text-white/40 uppercase">Active Units</span>
                  <span className="text-sm font-black">128 Rangers</span>
               </div>
               <Link href="/map">
                  <Button size="sm" className="bg-primary text-white text-[10px] font-black uppercase">Launch GIS Map</Button>
               </Link>
            </div>
          </div>
        </div>
      )}
      
      {/* Critical Emergency Banner */}
      {latestAlert && (
        <section className="pt-8 bg-gradient-to-b from-red-500/10 to-transparent">
          <div className="container mx-auto px-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-6 p-8 rounded-3xl bg-red-500/10 border border-red-500/20 backdrop-blur-xl"
            >
              <div className="w-16 h-16 rounded-2xl bg-red-500 flex items-center justify-center animate-pulse shadow-[0_0_30px_rgba(239,68,68,0.4)]">
                <Bell className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                   <Badge className="bg-red-500 text-[10px] font-black uppercase">Critical Broadcast</Badge>
                   <span className="text-[10px] font-bold text-red-400 uppercase tracking-widest">
                     {latestAlert.timestamp ? formatDistanceToNow(latestAlert.timestamp.toDate()) + " ago" : "LIVE"}
                   </span>
                </div>
                <h2 className="text-xl md:text-3xl font-black text-white tracking-tighter uppercase">{latestAlert.title}</h2>
                <p className="text-red-400/80 font-bold text-sm leading-relaxed">{latestAlert.message}</p>
              </div>
              <Button className="hidden md:flex bg-red-500 hover:bg-red-600 text-white font-black px-10 h-14 rounded-2xl">
                RESPOND
              </Button>
            </motion.div>
          </div>
        </section>
      )}

      <div className="flex-1 container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          
          {/* Main Intelligence Feed */}
          <div className="lg:col-span-2 space-y-12">
            <div className="flex items-center justify-between border-b border-white/5 pb-8">
              <div className="flex items-center gap-4">
                 <Activity className="w-10 h-10 text-primary" />
                 <div>
                    <h1 className="text-4xl font-black text-white tracking-tighter uppercase">Live Intel Feed</h1>
                    <p className="text-[10px] text-white/40 font-black uppercase tracking-[0.4em]">Real-time field reports</p>
                 </div>
              </div>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                 <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                 <span className="text-[10px] font-black uppercase tracking-widest text-white/20">Syncing Intelligence Nodes...</span>
              </div>
            ) : reports.length === 0 ? (
              <div className="py-32 text-center bg-white/[0.02] border border-dashed border-white/10 rounded-[3rem]">
                 <Shield className="w-16 h-16 text-white/10 mb-6 mx-auto" />
                 <h3 className="text-xl font-black text-white/40 uppercase tracking-tighter">No Recent Sightings</h3>
                 <p className="text-[10px] text-white/20 font-black uppercase tracking-widest">Your sector is currently clear of reported activity.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {reports.map((report, i) => (
                  <motion.div 
                    key={report.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Card className="bg-zinc-950 border-white/5 overflow-hidden hover:border-primary/30 transition-all duration-500 rounded-[2rem] group">
                      <CardContent className="p-0">
                        <div className="flex flex-col md:flex-row">
                          <div className="w-full md:w-64 h-64 bg-zinc-900 relative overflow-hidden shrink-0">
                             <MiniPreviewMap 
                               lat={report.location.lat} 
                               lng={report.location.lng} 
                               severity={report.severity}
                             />
                             <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
                                <Badge className={cn(
                                  "text-[9px] font-black uppercase shadow-xl",
                                  report.severity === 'critical' ? "bg-red-500" : report.severity === 'high' ? "bg-amber-500" : "bg-blue-500"
                                )}>
                                  {report.severity} RISK
                                </Badge>
                                {report.status === 'verified' && (
                                  <Badge className="bg-primary text-white text-[9px] font-black uppercase shadow-xl border border-white/20">VERIFIED</Badge>
                                )}
                             </div>
                             <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/60 to-transparent pointer-events-none" />
                          </div>
                          
                          <div className="flex-1 p-8 space-y-6 flex flex-col justify-center">
                            <div className="flex items-center justify-between">
                              <h3 className="text-2xl font-black text-white uppercase tracking-tight">
                                {report.animalType} Sighting
                              </h3>
                              <div className="flex items-center gap-2 text-white/30 text-[10px] font-black uppercase">
                                <Clock className="w-3 h-3" />
                                {report.timestamp ? formatDistanceToNow(report.timestamp.toDate()) + " ago" : "Just now"}
                              </div>
                            </div>
                            
                            <p className="text-sm text-white/60 line-clamp-2 leading-relaxed font-medium italic">
                              "{report.description || "No situational detail provided."}"
                            </p>
                            
                            <div className="flex flex-wrap items-center gap-8 pt-4 border-t border-white/5">
                              <div className="flex items-center gap-3">
                                <MapPin className="w-4 h-4 text-primary" />
                                <span className="text-[10px] text-white font-black uppercase tracking-widest">{report.location.name}</span>
                              </div>
                              <div className="flex items-center gap-3">
                                <Shield className="w-4 h-4 text-primary" />
                                <span className="text-[10px] text-white font-black uppercase tracking-widest">
                                  {report.status === 'responding' ? "Rangers Responding" : "Monitored"}
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="hidden md:flex p-6 items-center justify-center border-l border-white/5 bg-white/[0.02] group-hover:bg-primary/5 transition-colors">
                            <ChevronRight className="w-6 h-6 text-white/20 group-hover:text-primary transition-colors" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Side Intelligence Panel */}
          <div className="space-y-12">
            <Card className="bg-zinc-950 border-white/5 rounded-[2.5rem] sticky top-32 overflow-hidden">
              <div className="p-8 space-y-8">
                 <div className="space-y-2">
                    <h4 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
                      <Activity className="w-4 h-4 text-primary" />
                      Sector Risk Profile
                    </h4>
                    <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Real-time threat indices</p>
                 </div>

                <div className="space-y-8">
                  {[
                    { label: "Corridor Alpha", score: 92, risk: "CRITICAL" },
                    { label: "Village Boundary", score: 65, risk: "ELEVATED" },
                    { label: "River Crossing", score: 42, risk: "MODERATE" },
                    { label: "West Patrol Zone", score: 18, risk: "NOMINAL" },
                  ].map((item, i) => (
                    <div key={i} className="space-y-3">
                      <div className="flex justify-between items-end">
                        <span className="text-[10px] font-black text-white uppercase tracking-widest">{item.label}</span>
                        <span className={cn(
                          "text-[9px] font-black",
                          item.score > 80 ? "text-red-500" : item.score > 50 ? "text-amber-500" : "text-primary"
                        )}>{item.risk}</span>
                      </div>
                      <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${item.score}%` }}
                          className={cn(
                            "h-full rounded-full",
                            item.score > 80 ? "bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]" : item.score > 50 ? "bg-amber-500" : "bg-primary"
                          )}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-8 border-t border-white/5">
                   <div className="p-6 rounded-3xl bg-primary/5 border border-primary/20 space-y-3">
                      <div className="flex items-center gap-2 text-primary">
                         <Shield className="w-4 h-4" />
                         <span className="text-[10px] font-black uppercase tracking-widest">Command Protocol</span>
                      </div>
                      <p className="text-[10px] text-white/60 leading-relaxed font-bold uppercase tracking-tight">
                        Surveillance drones active in Sector 4. Citizens are advised to remain within 100m of main transit routes after sunset.
                      </p>
                   </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

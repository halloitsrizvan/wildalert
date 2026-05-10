"use client";

import WildlifeMap from "@/components/map/WildlifeMap";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, MapPin, Activity, ChevronRight, Filter, Shield, Info, Radio, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { db } from "@/lib/firebase";
import { collection, query, where, onSnapshot, limit } from "firebase/firestore";
import { WildlifeReport, Alert } from "@/types";
import { formatDistanceToNow } from "date-fns";

export default function PublicLiveMap() {
  const [activeTab, setActiveTab] = useState<'alerts' | 'info'>('alerts');
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [mapCenter, setMapCenter] = useState<[number, number]>([10.5276, 76.2144]);
  const [mapZoom, setMapZoom] = useState(11);
  const [locating, setLocating] = useState(true);
  
  const [reports, setReports] = useState<WildlifeReport[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!user?.communityId) return;

    // Real-time Reports
    const reportsQuery = query(
      collection(db, "reports"),
      where("communityId", "==", user.communityId),
      limit(50)
    );
    const unsubReports = onSnapshot(reportsQuery, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as WildlifeReport));
      setReports(data);
    });

    // Real-time Alerts
    const alertsQuery = query(
      collection(db, "alerts"),
      where("communityId", "==", user.communityId),
      limit(10)
    );
    const unsubAlerts = onSnapshot(alertsQuery, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Alert));
      setAlerts(data);
    });

    return () => {
      unsubReports();
      unsubAlerts();
    };
  }, [user?.communityId]);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setMapCenter([position.coords.latitude, position.coords.longitude]);
          setLocating(false);
          setMapZoom(13);
        },
        (error) => {
          console.warn(`[GIS] Location access denied or timed out.`, error);
          setLocating(false);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else {
      setLocating(false);
    }
  }, []);

  if (authLoading || !user) return <div className="h-screen bg-black flex flex-col items-center justify-center text-primary uppercase font-black tracking-[0.4em] animate-pulse">
    <Shield className="w-12 h-12 mb-4" />
    Syncing GIS Stream...
  </div>;

  return (
    <div className="h-screen flex flex-col bg-black overflow-hidden -mt-16">
      <div className="flex-1 relative flex overflow-hidden pt-16">
        {/* Fullscreen Map Background */}
        <div className="absolute inset-0 z-0">
          <WildlifeMap 
            reports={reports} 
            alerts={alerts}
            center={mapCenter}
            zoom={mapZoom}
          />
        </div>

        {/* Floating Sidebar - Right */}
        <div className="absolute top-6 right-6 bottom-6 w-96 z-10 flex flex-col gap-4 pointer-events-none">
          {/* Risk Indicator Widget */}
          <Card className="glass-dark border-white/10 pointer-events-auto rounded-[2rem] overflow-hidden">
            <CardContent className="p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-red-500/20 flex items-center justify-center animate-pulse">
                  <Activity className="w-6 h-6 text-red-500" />
                </div>
                <div>
                  <div className="text-[10px] text-white/40 uppercase font-black tracking-widest leading-none mb-2">Live Risk Index</div>
                  <div className="text-2xl font-black text-white leading-none">HIGH <span className="text-red-500">84%</span></div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                 <span className="text-[10px] font-black text-red-500 uppercase tracking-widest">Active</span>
              </div>
            </CardContent>
          </Card>

          {/* Intelligence Tabs */}
          <div className="flex-1 flex flex-col min-h-0 pointer-events-auto">
            <div className="flex bg-black/40 backdrop-blur-xl border border-white/10 rounded-t-[2rem] p-2">
              <button 
                onClick={() => setActiveTab('alerts')}
                className={cn(
                  "flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all",
                  activeTab === 'alerts' ? "bg-white text-black" : "text-white/40 hover:text-white"
                )}
              >
                Live Feed
              </button>
              <button 
                onClick={() => setActiveTab('info')}
                className={cn(
                  "flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all",
                  activeTab === 'info' ? "bg-white text-black" : "text-white/40 hover:text-white"
                )}
              >
                GIS Analysis
              </button>
            </div>
            
            <div className="flex-1 glass-dark border-t-0 border-white/10 rounded-b-[2rem] overflow-hidden flex flex-col">
              <div className="p-6 border-b border-white/5 flex items-center justify-between">
                <h3 className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Situational Intel</h3>
                <Badge className="bg-primary text-white text-[9px] font-black uppercase px-2 py-0.5">Live Node</Badge>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {alerts.length === 0 && reports.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center opacity-20 text-center px-8">
                     <Radio className="w-12 h-12 mb-4" />
                     <p className="text-[10px] font-black uppercase tracking-widest">Sector currently quiet. No active intelligence signals.</p>
                  </div>
                ) : (
                  <>
                    {alerts.map((alert) => (
                      <div key={alert.id} className="p-5 rounded-2xl bg-red-500/10 border border-red-500/20 hover:border-red-500/40 transition-all cursor-pointer group relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-16 h-16 bg-red-500/5 rounded-full blur-xl" />
                        <div className="flex items-center justify-between mb-3 relative z-10">
                          <Badge className="bg-red-500 text-[8px] font-black uppercase tracking-widest">
                            {alert.type}
                          </Badge>
                          <span className="text-[9px] text-white/40 font-bold uppercase">
                            {alert.timestamp ? formatDistanceToNow(alert.timestamp.toDate()) + " ago" : "Just now"}
                          </span>
                        </div>
                        <h4 className="text-sm font-black text-white uppercase tracking-tight mb-1">{alert.title}</h4>
                        <p className="text-[10px] text-red-200/60 leading-relaxed font-medium">{alert.message}</p>
                        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-white/5">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-3 h-3 text-red-500" />
                            <span className="text-[10px] text-white/60 font-bold uppercase tracking-widest">Sector 4 Node</span>
                          </div>
                                {alert.location && (
                                  <a 
                                    href={`https://www.google.com/maps?q=${alert.location.lat},${alert.location.lng}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="ml-auto text-[9px] font-black uppercase text-red-500 hover:text-red-400 flex items-center gap-1"
                                  >
                                    Navigate <ExternalLink className="w-2.5 h-2.5" />
                                  </a>
                                )}
                        </div>
                      </div>
                    ))}
                    {reports.map((report) => (
                      <div key={report.id} className="p-5 rounded-2xl bg-white/5 border border-white/5 hover:border-primary/30 transition-all cursor-pointer group">
                        <div className="flex items-center justify-between mb-3">
                          <Badge variant="outline" className={cn(
                            "text-[8px] font-black uppercase tracking-widest",
                            report.severity === 'critical' ? "border-red-500 text-red-500" : "border-amber-500 text-amber-500"
                          )}>
                            {report.severity} sighting
                          </Badge>
                          <span className="text-[9px] text-white/40 font-bold uppercase">
                             {report.timestamp ? formatDistanceToNow(report.timestamp.toDate()) + " ago" : "Just now"}
                          </span>
                        </div>
                        <h4 className="text-sm font-black text-white uppercase tracking-tight group-hover:text-primary transition-colors">{report.animalType}</h4>
                        <p className="text-[10px] text-white/40 mt-1 line-clamp-2 font-medium italic">"{report.description}"</p>
                        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-white/5">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-3 h-3 text-primary" />
                            <span className="text-[10px] text-white font-black uppercase tracking-widest">{report.location.name}</span>
                          </div>
                          <a 
                            href={`https://www.google.com/maps?q=${report.location.lat},${report.location.lng}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ml-auto text-[9px] font-black uppercase text-primary hover:text-primary/80 flex items-center gap-1"
                          >
                            NAVIGATE <ChevronRight className="w-3 h-3" />
                          </a>
                        </div>
                      </div>
                    ))}
                  </>
                )}
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

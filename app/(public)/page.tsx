"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Shield, Map, Zap, Activity, ChevronRight, AlertTriangle, Clock, Radio, MapPin, ExternalLink } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { db } from "@/lib/firebase";
import { collection, query, where, orderBy, limit, onSnapshot } from "firebase/firestore";
import { Alert, WildlifeReport } from "@/types";
import { formatDistanceToNow } from "date-fns";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [feedItems, setFeedItems] = useState<(Alert | WildlifeReport)[]>([]);
  const [loadingAlerts, setLoadingAlerts] = useState(true);

  useEffect(() => {
    if (!user?.communityId) {
      setLoadingAlerts(false);
      return;
    }

    // Live Feed: Combine Alerts and Reports
    const alertsQuery = query(
      collection(db, "alerts"),
      where("communityId", "==", user.communityId),
      limit(2)
    );

    const reportsQuery = query(
      collection(db, "reports"),
      where("communityId", "==", user.communityId),
      limit(4)
    );

    let currentAlerts: Alert[] = [];
    let currentReports: WildlifeReport[] = [];

    const updateFeed = () => {
      const merged = [...currentAlerts, ...currentReports]
        .sort((a, b) => (b.timestamp?.seconds || 0) - (a.timestamp?.seconds || 0))
        .slice(0, 4);
      setFeedItems(merged);
      setLoadingAlerts(false);
    };

    const unsubAlerts = onSnapshot(alertsQuery, (snapshot) => {
      currentAlerts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), type: 'alert' } as any));
      updateFeed();
    });

    const unsubReports = onSnapshot(reportsQuery, (snapshot) => {
      currentReports = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), type: 'report' } as any));
      updateFeed();
    });

    return () => {
      unsubAlerts();
      unsubReports();
    };
  }, [user?.communityId]);

  return (
    <main className="relative min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden -mt-8">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/hero-bg.png"
            alt="Kerala Forest"
            fill
            className="object-cover opacity-60"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black" />
        </div>

        <div className="container mx-auto px-4 relative z-10 text-center pt-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 border border-primary/30 text-primary text-xs font-bold uppercase tracking-widest mb-6 animate-pulse">
            <Activity className="w-3 h-3" />
            Live Intelligence Active
          </div>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-6 tracking-tight leading-[0.9]">
            WILDLIFE <span className="text-primary">INTELLIGENCE</span> <br />
            & MONITORING
          </h1>
          <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
            Advanced GIS platform for Kerala forest-border communities. 
            Tracking corridors, predicting risks, and protecting lives.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-20">
            <Link href="/map">
              <Button size="lg" className="h-16 px-10 text-lg bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-tight rounded-2xl shadow-[0_10px_40px_rgba(34,197,94,0.3)] border-none">
                Command Center
                <ChevronRight className="ml-2 w-6 h-6" />
              </Button>
            </Link>
            <Link href="/report">
              <Button size="lg" variant="outline" className="h-16 px-10 text-lg border-white/20 text-white backdrop-blur-md rounded-2xl font-black uppercase tracking-tight hover:bg-transparent hover:text-white">
                <AlertTriangle className="mr-1 w-6 h-6 text-amber-500" />
                Submit Alert
              </Button>
            </Link> 
          </div>

          {/* Floating Stats - Lowered to prevent overlap */}
          <div className="flex items-center justify-center gap-12 text-white/40">
             <div className="flex flex-col items-center">
                <span className="text-[10px] font-black uppercase tracking-widest mb-2 text-primary/60">Active Corridors</span>
                <span className="text-3xl font-black text-white">128</span>
             </div>
             <div className="w-px h-12 bg-white/10" />
             <div className="flex flex-col items-center">
                <span className="text-[10px] font-black uppercase tracking-widest mb-2 text-primary/60">Ranger Units</span>
                <span className="text-3xl font-black text-white">24</span>
             </div>
             <div className="w-px h-12 bg-white/10" />
             <div className="flex flex-col items-center">
                <span className="text-[10px] font-black uppercase tracking-widest mb-2 text-primary/60">System Health</span>
                <span className="text-3xl font-black text-white uppercase">Nominal</span>
             </div>
          </div>
        </div>
      </section>

      {/* Logged-In Alerts & Reports Section */}
      {user && (
        <section className="py-16 bg-black border-y border-white/5 relative overflow-hidden">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-12">
               <div className="flex items-center gap-5">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                    <Radio className="w-6 h-6 text-primary animate-pulse" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Community Intelligence</h2>
                    <p className="text-[10px] text-white/40 font-black uppercase tracking-widest">Active nodes in your sector</p>
                  </div>
               </div>
               <Link href="/alerts">
                  <Button variant="outline" className="hidden md:flex border-primary/30 text-white text-[10px] font-black uppercase tracking-widest hover:bg-white rounded-xl px-6 h-12">
                    Access Intelligence Database →
                  </Button>
               </Link>
            </div>

            {loadingAlerts ? (
              <div className="h-48 flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            ) : feedItems.length === 0 ? (
              <div className="bg-zinc-950 border border-white/5 rounded-[2.5rem] p-20 text-center">
                <Shield className="w-16 h-16 text-white/10 mb-6 mx-auto" />
                <p className="text-white/40 font-black uppercase text-sm tracking-[0.3em] mb-10">Sector Nominal. No signals detected.</p>
                <Link href="/report">
                   <Button className="bg-white text-black font-black uppercase text-[10px] tracking-widest px-10 h-14 rounded-2xl hover:scale-105 transition-transform">
                      Submit Field Intel
                   </Button>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {feedItems.map((item: any) => (
                  <div 
                    key={item.id}
                    onClick={() => router.push('/map')}
                    className="group relative p-8 rounded-[2rem] bg-zinc-950 border border-white/5 hover:border-primary/40 transition-all duration-500 flex flex-col h-full cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-6">
                      <Badge variant="outline" className={cn(
                        "text-[9px] font-black uppercase tracking-[0.1em] px-2.5 py-1 rounded-lg",
                        item.type === 'alert' 
                          ? (item.type === 'danger' ? "border-red-500 text-red-500" : "border-amber-500 text-amber-500")
                          : "border-primary text-white"
                      )}>
                        {item.type === 'alert' ? item.type : 'Sighting'}
                      </Badge>
                      <div className="flex items-center gap-2 text-[10px] font-bold text-white/30 uppercase tracking-tighter">
                        <Clock className="w-3.5 h-3.5" />
                        {item.timestamp ? formatDistanceToNow(item.timestamp.toDate()) : "now"}
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <h4 className="text-lg font-black text-white uppercase tracking-tight leading-tight mb-2">
                        {item.type === 'alert' ? item.title : item.animalType}
                      </h4>
                      <div className="flex items-center justify-between gap-2 mb-4">
                         <div className="flex items-center gap-2 text-[10px] font-black text-white/40 uppercase tracking-widest">
                            <MapPin className="w-3 h-3 text-primary/60" />
                            {item.location?.name || "Sector Area"}
                         </div>
                         {item.location?.lat && (
                           <a 
                             href={`https://www.google.com/maps?q=${item.location.lat},${item.location.lng}`}
                             target="_blank"
                             rel="noopener noreferrer"
                             onClick={(e) => e.stopPropagation()}
                             className="flex items-center gap-1.5 text-[9px] font-black text-primary hover:text-white transition-colors uppercase tracking-widest bg-primary/10 px-2 py-1 rounded-md"
                           >
                             Navigate <ExternalLink className="w-2.5 h-2.5" />
                           </a>
                         )}
                      </div>
                      <p className="text-[11px] text-white/60 font-medium leading-relaxed italic line-clamp-3">
                        "{item.type === 'alert' ? item.message : (item.description || "Field intelligence reported.")}"
                      </p>
                    </div>

                    <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                       <span className="text-[10px] font-black text-primary uppercase tracking-widest">Tactical Analysis</span>
                       <ChevronRight className="w-4 h-4 text-primary" />
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {/* Mobile Button Link */}
            <div className="mt-8 md:hidden text-center">
               <Link href="/alerts">
                  <Button variant="link" className="text-primary text-[10px] font-black uppercase tracking-widest">
                    Access Intelligence Database →
                  </Button>
               </Link>
            </div>
          </div>
        </section>
      )}

      {/* Features Section */}
      <section className="py-24 bg-black relative">
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
             <h2 className="text-3xl md:text-5xl font-black text-white mb-4 uppercase tracking-tighter">Precision Monitoring</h2>
             <p className="text-white/40 font-black uppercase tracking-[0.2em] text-[10px]">Cutting-edge technology for human-wildlife coexistence.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "GIS Tracking",
                description: "Live interactive maps with animal movement patterns and corridor visualization.",
                icon: Map,
              },
              {
                title: "Emergency Network",
                description: "Instant village-wide notifications via SMS and app alerts during intrusions.",
                icon: AlertTriangle,
              },
              {
                title: "Risk Analysis",
                description: "AI-driven risk assessment based on seasonal migration and environmental data.",
                icon: Activity,
              },
            ].map((feature, i) => (
              <div key={i} className="group p-10 rounded-[2.5rem] bg-zinc-950 border border-white/5 hover:border-primary/30 transition-all duration-500">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-8 group-hover:bg-primary group-hover:scale-110 transition-all duration-500">
                  <feature.icon className="w-7 h-7 text-primary group-hover:text-white" />
                </div>
                <h3 className="text-xl font-black text-white mb-4 uppercase tracking-tighter">{feature.title}</h3>
                <p className="text-sm text-white/40 leading-relaxed font-medium">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 border-t border-white/5 bg-black">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-8">
            <Shield className="w-8 h-8 text-primary" />
            <span className="text-2xl font-black tracking-tighter text-white uppercase">Wild Alert</span>
          </div>
          <p className="text-[10px] text-white/20 uppercase font-black tracking-[0.4em] max-w-md mx-auto mb-10 leading-loose">
            Specialized intelligence platform for the Western Ghats. Dedicated to wildlife preservation and community safety.
          </p>
          <div className="text-[9px] font-black text-white/10 uppercase tracking-widest">
            © 2026 Kerala Forest Intelligence Division &bull; SECURE NODE 71
          </div>
        </div>
      </footer>
    </main>
  );
}

function Badge({ children, variant = "outline", className }: { children: React.ReactNode, variant?: string, className?: string }) {
  return (
    <span className={cn("px-2 py-0.5 rounded text-[8px] font-bold border", className)}>
      {children}
    </span>
  );
}

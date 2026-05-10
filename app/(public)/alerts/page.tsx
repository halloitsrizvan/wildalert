"use client";

import { MOCK_ALERTS, MOCK_REPORTS } from "@/data/mockData";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Clock, MapPin, Shield, ChevronRight, Activity, Filter, Bell } from "lucide-react";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import Link from "next/link";
import { useCommunity } from "@/hooks/useCommunity";

export default function PublicAlertFeed() {
  const { currentCommunity, loading: geoLoading } = useCommunity();

  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Community Detection Banner */}
      {!geoLoading && currentCommunity && (
        <div className="bg-primary/20 border-b border-primary/20">
          <div className="container mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">
                Protected Zone Detected: {currentCommunity.name}
              </span>
            </div>
            <Link href={`/communities/${currentCommunity.id}`}>
              <Button variant="ghost" size="sm" className="text-[10px] font-bold uppercase tracking-widest text-primary hover:bg-primary/10">
                Network Intelligence <ChevronRight className="w-3 h-3 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      )}
      
      {/* Emergency Banner Section */}
      <section className={cn("pb-8 bg-gradient-to-b from-red-500/10 to-transparent", currentCommunity ? "pt-8" : "pt-8")}>
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-6 p-6 rounded-2xl bg-red-500/10 border border-red-500/20 backdrop-blur-md"
          >
            <div className="w-16 h-16 rounded-full bg-red-500 flex items-center justify-center animate-pulse">
              <Bell className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl md:text-2xl font-black text-white tracking-tight uppercase">CRITICAL ALERT: ELEPHANT MOVEMENT</h2>
              <p className="text-red-400 font-bold text-sm">Sector 4 Corridor crossing active. Avoid village outskirts until 06:00 AM.</p>
            </div>
            <Button className="hidden md:flex bg-red-500 hover:bg-red-600 text-white font-bold px-8">
              VIEW PROTOCOL
            </Button>
          </motion.div>
        </div>
      </section>

      <div className="flex-1 container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Feed Column */}
          <div className="lg:col-span-2 space-y-8">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-black text-white tracking-tighter uppercase flex items-center gap-3">
                <Activity className="w-8 h-8 text-primary" />
                Live Feed
              </h1>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="border-white/10 text-white gap-2">
                  <Filter className="w-4 h-4" />
                  Filter
                </Button>
                <Button variant="outline" size="sm" className="border-white/10 text-white gap-2">
                  Latest First
                </Button>
              </div>
            </div>

            <div className="space-y-6">
              {MOCK_REPORTS.map((report, i) => (
                <motion.div 
                  key={report.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="group relative"
                >
                  <Card className="bg-card border-white/5 overflow-hidden group-hover:border-primary/50 transition-all">
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-primary" />
                    <CardContent className="p-0">
                      <div className="flex flex-col md:flex-row h-full">
                        {/* Image Placeholder */}
                        <div className="w-full md:w-64 h-48 bg-zinc-900 relative">
                           <div className="absolute inset-0 flex items-center justify-center opacity-20">
                             <AlertTriangle className="w-12 h-12" />
                           </div>
                           <Badge className="absolute top-4 left-4 bg-primary text-white">VERIFIED</Badge>
                        </div>
                        
                        <div className="flex-1 p-6 space-y-4">
                          <div className="flex items-center justify-between">
                            <Badge variant="outline" className={cn(
                              "text-[10px] uppercase font-bold",
                              report.severity === 'critical' ? "border-red-500 text-red-500" : "border-amber-500 text-amber-500"
                            )}>
                              {report.severity} DANGER
                            </Badge>
                            <div className="flex items-center gap-2 text-muted-foreground text-xs font-medium">
                              <Clock className="w-3 h-3" />
                              12:45 PM
                            </div>
                          </div>
                          
                          <div>
                            <h3 className="text-xl font-bold text-white mb-2">{report.animalType} Sighting</h3>
                            <p className="text-sm text-white/60 line-clamp-2 leading-relaxed">
                              {report.description}
                            </p>
                          </div>
                          
                          <div className="flex items-center gap-6 pt-4 border-t border-white/5">
                            <div className="flex items-center gap-2 text-xs">
                              <MapPin className="w-4 h-4 text-primary" />
                              <span className="text-white font-medium">{report.location.name}</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs">
                              <Shield className="w-4 h-4 text-primary" />
                              <span className="text-white font-medium">Ranger Response Active</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="p-4 flex items-center justify-center md:border-l border-white/5 bg-white/2 group-hover:bg-primary/5 transition-colors">
                          <ChevronRight className="w-6 h-6 text-white/20 group-hover:text-primary transition-colors" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Activity Column */}
          <div className="space-y-8">
            <Card className="bg-card border-white/5 sticky top-24">
              <CardHeader>
                <CardTitle className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">
                  <Activity className="w-4 h-4 text-primary" />
                  Corridor Activity
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {[
                  { label: "Palakkad Corridor", risk: "Critical", score: 92 },
                  { label: "Wayanad Sector B", risk: "High", score: 78 },
                  { label: "Munnar Tea Estate", risk: "Moderate", score: 45 },
                  { label: "Attappady Gap", risk: "Low", score: 24 },
                ].map((item, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground font-medium">{item.label}</span>
                      <span className={cn(
                        "font-bold",
                        item.score > 80 ? "text-red-500" : item.score > 50 ? "text-amber-500" : "text-primary"
                      )}>{item.risk}</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${item.score}%` }}
                        className={cn(
                          "h-full rounded-full shadow-[0_0_8px_rgba(var(--color))]",
                          item.score > 80 ? "bg-red-500" : item.score > 50 ? "bg-amber-500" : "bg-primary"
                        )}
                      />
                    </div>
                  </div>
                ))}

                <div className="pt-6 border-t border-white/5">
                  <div className="p-4 rounded-xl bg-primary/10 border border-primary/20 space-y-2">
                     <div className="flex items-center gap-2">
                       <Shield className="w-4 h-4 text-primary" />
                       <span className="text-xs font-bold text-primary uppercase">Ranger Note</span>
                     </div>
                     <p className="text-xs text-primary/80 leading-relaxed">
                       Corridor surveillance drones are active in the northern district. Maintain standard caution protocols.
                     </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

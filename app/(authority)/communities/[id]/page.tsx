"use client";

import { useEffect, useState, use } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Shield, 
  Map as MapIcon, 
  Users, 
  AlertTriangle, 
  ChevronLeft, 
  Activity, 
  ArrowUpRight, 
  Settings,
  Bell,
  Clock,
  Zap
} from "lucide-react";
import Link from "next/link";
import { getCommunityById } from "@/lib/communities";
import { Community } from "@/types";
import { cn } from "@/lib/utils";
import CommunityViewMap from "@/components/map/CommunityViewMap";
import { Badge } from "@/components/ui/badge";

export default function CommunityDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [community, setCommunity] = useState<Community | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await getCommunityById(id);
        setCommunity(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  if (loading) return (
    <div className="h-screen bg-black flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!community) return (
    <div className="h-screen bg-black flex flex-col items-center justify-center text-white space-y-4">
      <h2 className="text-2xl font-bold">Intelligence Node Not Found</h2>
      <Link href="/communities">
        <Button variant="outline">Back to Networks</Button>
      </Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/5 p-6 rounded-2xl border border-white/5">
        <div className="flex items-center gap-6">
          <Link href="/communities">
            <Button variant="ghost" size="icon" className="hover:bg-white/10">
              <ChevronLeft className="w-6 h-6" />
            </Button>
          </Link>
          <div className="space-y-1">
            <div className="flex items-center gap-3">
               <h1 className="text-4xl font-black uppercase tracking-tighter">{community.name}</h1>
               <Badge className={cn(
                 "uppercase text-[10px]",
                 community.riskLevel === 'critical' ? "bg-red-500" : "bg-primary"
               )}>{community.riskLevel} Risk Unit</Badge>
            </div>
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              <Shield className="w-3 h-3" />
              Intelligence District: {community.district} • Node ID: {id.slice(0, 8)}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="border-white/10 hover:bg-white/5">
            <Settings className="w-4 h-4 mr-2" />
            Configure
          </Button>
          <Button size="sm" className="bg-primary hover:bg-primary/90 text-white">
            <Zap className="w-4 h-4 mr-2" />
            Active Scan
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Map */}
        <div className="lg:col-span-2 space-y-6">
          <div className="h-[600px]">
            <CommunityViewMap polygonData={community.polygonCoordinates} riskLevel={community.riskLevel} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <Card className="bg-card border-white/5">
               <CardHeader>
                 <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Area Intelligence</CardTitle>
               </CardHeader>
               <CardContent className="space-y-4">
                 <p className="text-sm leading-relaxed text-white/80">{community.description}</p>
                 <div className="flex flex-wrap gap-2 pt-4">
                   {["Elephant Corridor", "Buffer Zone", "Dense Forest", "Village Edge"].map((tag, i) => (
                     <Badge key={i} variant="outline" className="text-[10px] uppercase border-white/10">{tag}</Badge>
                   ))}
                 </div>
               </CardContent>
             </Card>

             <Card className="bg-card border-white/5">
               <CardHeader>
                 <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Network Nodes (Villages)</CardTitle>
               </CardHeader>
               <CardContent className="space-y-3">
                 {["Attappady Sector 1", "Silent Valley Border", "Sector 4 Junction"].map((v, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/5">
                      <span className="text-sm font-medium">{v}</span>
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    </div>
                 ))}
               </CardContent>
             </Card>
          </div>
        </div>

        {/* Right Column - Stats & Alerts */}
        <div className="space-y-6">
          <Card className="bg-card border-white/5">
            <CardHeader>
              <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Live Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                 <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                   <div className="text-[10px] text-muted-foreground uppercase font-bold mb-1">Members</div>
                   <div className="text-xl font-black">{community.memberCount}</div>
                 </div>
                 <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                   <div className="text-[10px] text-muted-foreground uppercase font-bold mb-1">Alerts/mo</div>
                   <div className="text-xl font-black">24</div>
                 </div>
                 <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                   <div className="text-[10px] text-muted-foreground uppercase font-bold mb-1">Avg Risk</div>
                   <div className="text-xl font-black">82%</div>
                 </div>
                 <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                   <div className="text-[10px] text-muted-foreground uppercase font-bold mb-1">Uptime</div>
                   <div className="text-xl font-black">99.9%</div>
                 </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-white/5">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Recent Intelligence</CardTitle>
              <Bell className="w-4 h-4 text-primary" />
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { title: "Elephant Movement", time: "2h ago", severity: "high" },
                { title: "Boundary Breach", time: "5h ago", severity: "medium" },
                { title: "Ranger Checkpoint", time: "12h ago", severity: "low" },
              ].map((alert, i) => (
                <div key={i} className="group cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "w-1 h-10 rounded-full",
                      alert.severity === 'high' ? "bg-red-500" : alert.severity === 'medium' ? "bg-amber-500" : "bg-primary"
                    )} />
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <h4 className="text-sm font-bold group-hover:text-primary transition-colors">{alert.title}</h4>
                        <span className="text-[10px] text-muted-foreground">{alert.time}</span>
                      </div>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">Sector 4 Intelligence Node</p>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-white/20 group-hover:text-primary" />
                  </div>
                </div>
              ))}
              <Button variant="ghost" className="w-full text-[10px] uppercase font-black text-muted-foreground hover:text-white pt-4">
                View Intelligence History
              </Button>
            </CardContent>
          </Card>

          {/* AI Risk Score Visualization */}
          <Card className="bg-card border-white/5 overflow-hidden">
            <CardHeader>
              <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">AI Risk Matrix</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
               <div className="relative h-24 flex items-center justify-center">
                 <div className="absolute inset-0 border-4 border-white/5 rounded-full" />
                 <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-[spin_3s_linear_infinite]" />
                 <div className="text-center">
                    <div className="text-3xl font-black">84</div>
                    <div className="text-[8px] uppercase font-bold text-primary">Critical Index</div>
                 </div>
               </div>
               <div className="space-y-2">
                 <div className="flex justify-between text-[10px] font-bold uppercase">
                   <span className="text-muted-foreground">Historical Pattern</span>
                   <span className="text-white">High Match</span>
                 </div>
                 <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                   <div className="h-full w-4/5 bg-primary" />
                 </div>
               </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

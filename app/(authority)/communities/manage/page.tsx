"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Shield, Map as MapIcon, Users, AlertTriangle, Plus, ChevronRight, Activity } from "lucide-react";
import Link from "next/link";
import { getCommunities } from "@/lib/communities";
import { Community } from "@/types";
import { cn } from "@/lib/utils";

export default function CommunitiesPage() {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await getCommunities();
        setCommunities(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black tracking-tighter uppercase">Community Intelligence Networks</h1>
            <p className="text-white font-medium">Managing decentralized geo-fenced safety zones across Kerala.</p>
          </div>
          <Link href="/communities/create">
            <Button className="bg-primary hover:bg-primary/90 text-white font-bold h-12 px-8 glow-green uppercase tracking-widest text-xs">
              <Plus className="mr-2 w-5 h-5" />
              Initialize New Network
            </Button>
          </Link>
        </div>

        {/* Global Analytics Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: "Active Networks", value: communities.length, icon: Shield },
            { label: "Protected Citizens", value: "14.2k", icon: Users },
            { label: "High Risk Zones", value: communities.filter(c => c.riskLevel === 'high' || c.riskLevel === 'critical').length, icon: AlertTriangle },
            { label: "Avg Response Time", value: "4.2m", icon: Activity },
          ].map((stat, i) => (
            <div key={i} className="glass-dark p-4 rounded-xl border-white/5 space-y-1">
              <div className="flex items-center gap-2 text-white">
                <stat.icon className="w-3 h-3" />
                <span className="text-[10px] font-bold uppercase tracking-widest">{stat.label}</span>
              </div>
              <div className="text-2xl font-black text-white">{stat.value}</div>
            </div>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-64 bg-white/5 animate-pulse rounded-2xl border border-white/5" />
            ))}
          </div>
        ) : communities.length === 0 ? (
          <Card className="bg-card border-white/5 py-12 text-center border-dashed">
            <CardContent className="space-y-4">
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto">
                <MapIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white">No Active Networks</h3>
              <p className="text-white text-sm max-w-sm mx-auto">
                Start by establishing the first community boundary to activate geo-fenced intelligence.
              </p>
              <Link href="/communities/create">
                <Button variant="outline" className="border-white/10 text-white">Create Community</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {communities.map((community) => (
              <Link key={community.id} href={`/communities/${community.id}`}>
                <Card className="bg-card border-white/5 group hover:border-primary/40 transition-all overflow-hidden relative">
                  <div className={cn(
                    "absolute top-0 left-0 w-full h-1",
                    community.riskLevel === 'critical' ? "bg-red-500 shadow-[0_0_10px_red]" : 
                    community.riskLevel === 'high' ? "bg-amber-500" : 
                    community.riskLevel === 'medium' ? "bg-blue-500" : "bg-green-500"
                  )} />
                  <CardHeader>
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-primary">{community.district}</span>
                      <div className="flex items-center gap-2">
                        <Users className="w-3 h-3 text-white" />
                        <span className="text-[10px] text-white font-bold">{community.memberCount} Members</span>
                      </div>
                    </div>
                    <CardTitle className="text-xl font-black tracking-tight text-white group-hover:text-primary transition-colors">
                      {community.name}
                    </CardTitle>
                    <CardDescription className="text-xs line-clamp-2">
                      {community.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between pt-4 border-t border-white/5">
                      <div className="space-y-1">
                        <div className="text-[10px] uppercase font-bold text-white">Risk Level</div>
                        <div className={cn(
                          "text-xs font-black uppercase",
                          community.riskLevel === 'critical' ? "text-red-500" : 
                          community.riskLevel === 'high' ? "text-amber-500" : "text-white"
                        )}>{community.riskLevel}</div>
                      </div>
                      <div className="space-y-1 text-right">
                        <div className="text-[10px] uppercase font-bold text-white">Active Alerts</div>
                        <div className="text-xs font-black text-white">{community.activeAlerts} Reports</div>
                      </div>
                    </div>
                    <Button variant="ghost" className="w-full justify-between text-xs font-bold uppercase tracking-widest group-hover:bg-primary group-hover:text-white transition-all">
                      Intelligence Detail
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

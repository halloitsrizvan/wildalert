"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Activity, Users, Home, AlertTriangle, ShieldCheck } from "lucide-react";
import { MOCK_VILLAGES } from "@/data/mockData";
import { cn } from "@/lib/utils";

export default function VillageMonitoringPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
            <Activity className="w-8 h-8 text-primary" />
            Village Monitoring System
          </h1>
          <p className="text-white">Real-time safety and intrusion monitoring for forest-border settlements.</p>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-card border-white/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold text-white uppercase tracking-widest">Total Population At Risk</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-white">9,700+</div>
            <p className="text-xs text-white mt-1 flex items-center gap-1">
              <Users className="w-3 h-3" />
              Across 3 primary sectors
            </p>
          </CardContent>
        </Card>
        <Card className="bg-card border-white/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold text-white uppercase tracking-widest">System Health</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-primary">OPTIMAL</div>
            <p className="text-xs text-white mt-1 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" />
              All sensors online
            </p>
          </CardContent>
        </Card>
        <Card className="bg-card border-white/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold text-white uppercase tracking-widest">Intrusion Buffer</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-amber-500">2.4 KM</div>
            <p className="text-xs text-white mt-1 flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" />
              Nearest herd detected
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Villages List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {MOCK_VILLAGES.map((village) => (
          <Card key={village.id} className="bg-card border-white/5 overflow-hidden flex flex-col md:flex-row">
            <div className={cn(
              "w-2 md:w-3 h-full",
              village.riskLevel === 'high' ? "bg-red-500 glow-red" : 
              village.riskLevel === 'medium' ? "bg-amber-500" : "bg-primary"
            )} />
            <div className="flex-1 p-6 flex flex-col gap-6">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                    <Home className="w-5 h-5 text-white" />
                    {village.name}
                  </h3>
                  <div className="flex items-center gap-3 text-xs text-white">
                    <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {village.population} pop.</span>
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> Sector {village.id.slice(1)}</span>
                  </div>
                </div>
                <Badge variant={village.riskLevel === 'high' ? 'destructive' : 'outline'} className={cn(
                  village.riskLevel === 'medium' ? "border-amber-500 text-amber-500" : ""
                )}>
                  {village.riskLevel.toUpperCase()} RISK
                </Badge>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-white uppercase tracking-widest">Village Fortification</span>
                    <span className="text-white font-bold">84%</span>
                  </div>
                  <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full w-[84%]" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="p-3 rounded-lg bg-white/5 border border-white/5">
                    <div className="text-[10px] text-white uppercase tracking-widest mb-1">Last Alert</div>
                    <div className="text-xs text-white font-medium">3 days ago</div>
                  </div>
                  <div className="p-3 rounded-lg bg-white/5 border border-white/5">
                    <div className="text-[10px] text-white uppercase tracking-widest mb-1">Ranger Support</div>
                    <div className="text-xs text-white font-medium">1.2 KM distance</div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <Button variant="outline" className="flex-1 border-white/5 bg-white/5 hover:bg-white/10 text-white">Full Status</Button>
                <Button variant="outline" className="flex-1 border-white/5 bg-white/5 hover:bg-white/10 text-white">Sensor Log</Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

const MapPin = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
);

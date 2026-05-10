"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Shield, Phone, MapPin, Activity, UserCheck, Search } from "lucide-react";
import { MOCK_RANGERS } from "@/data/mockData";
import { Input } from "@/components/ui/input";

export default function RangersOperationsPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
            <Shield className="w-8 h-8 text-primary" />
            Ranger Operations
          </h1>
          <p className="text-white">Coordination and status monitoring of field units across all divisions.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="border-white/10 bg-card">Deploy Unit</Button>
          <Button className="bg-primary hover:bg-primary/90 text-white">Radio Check</Button>
        </div>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white" />
          <Input placeholder="Search units by name, rank or sector..." className="bg-card border-white/5 pl-10" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {MOCK_RANGERS.map((ranger) => (
          <Card key={ranger.id} className="bg-card border-white/5 overflow-hidden group hover:border-primary/20 transition-all">
            <div className="h-24 bg-gradient-to-br from-primary/20 to-black/40 relative">
              <div className="absolute -bottom-6 left-6 w-16 h-16 rounded-2xl bg-black border-2 border-primary/20 flex items-center justify-center shadow-xl">
                <Shield className="w-8 h-8 text-primary" />
              </div>
            </div>
            <CardContent className="pt-8 pb-6 px-6 space-y-4">
              <div>
                <h3 className="text-lg font-bold text-white">{ranger.name}</h3>
                <p className="text-xs text-white font-medium uppercase tracking-wider">{ranger.rank}</p>
              </div>

              <div className="flex items-center justify-between py-2 border-y border-white/5">
                <div className="flex items-center gap-2">
                  <div className={cn(
                    "w-2 h-2 rounded-full",
                    ranger.status === 'active' || ranger.status === 'on-duty' ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" : "bg-muted"
                  )} />
                  <span className="text-xs text-white capitalize">{ranger.status}</span>
                </div>
                <Badge variant="outline" className="text-[10px] bg-primary/5">Sector 4A</Badge>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3 text-xs text-white">
                  <MapPin className="w-4 h-4 text-primary" />
                  {ranger.location.lat.toFixed(4)}, {ranger.location.lng.toFixed(4)}
                </div>
                <div className="flex items-center gap-3 text-xs text-white">
                  <Activity className="w-4 h-4 text-primary" />
                  Last heartbeat: 2m ago
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Button variant="outline" size="sm" className="flex-1 border-white/5 hover:bg-white/5">
                  <Phone className="mr-2 w-3 h-3" />
                  Contact
                </Button>
                <Button variant="outline" size="sm" className="flex-1 border-white/5 hover:bg-white/5">
                  Track
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Add Unit UI placeholder */}
        <div className="border-2 border-dashed border-white/5 rounded-xl flex flex-col items-center justify-center p-8 gap-4 hover:bg-white/5 transition-all cursor-pointer min-h-[300px]">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <UserCheck className="w-6 h-6 text-primary" />
          </div>
          <div className="text-center">
            <h4 className="text-white font-bold">Register New Unit</h4>
            <p className="text-xs text-white">Add field personnel to the platform</p>
          </div>
        </div>
      </div>
    </div>
  );
}

const cn = (...inputs: any[]) => inputs.filter(Boolean).join(' ');

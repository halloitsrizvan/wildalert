import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, MapPin, Clock, Shield, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { MOCK_REPORTS } from "@/data/mockData";

export default function IncidentDetailsPage({ params }: { params: { id: string } }) {
  const incident = MOCK_REPORTS.find(r => r.id === params.id) || MOCK_REPORTS[0];

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Button nativeButton={false} variant="ghost" size="icon" render={<Link href="/admin" />} className="text-muted-foreground hover:text-white">
          <ChevronLeft className="w-6 h-6" />
        </Button>
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-white tracking-tight">Incident #{incident.id}</h1>
            <Badge variant={incident.severity === 'critical' ? 'destructive' : 'outline'}>
              {incident.severity.toUpperCase()}
            </Badge>
          </div>
          <p className="text-muted-foreground">Detailed intelligence report for {incident.animalType} sighting.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Main Info */}
          <Card className="bg-card border-white/5">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-white">Situation Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                <div className="space-y-1">
                  <div className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Animal Type</div>
                  <div className="text-white font-medium">{incident.animalType}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Time Reported</div>
                  <div className="text-white font-medium flex items-center gap-2">
                    <Clock className="w-3 h-3 text-primary" />
                    10:45 AM
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Reported By</div>
                  <div className="text-white font-medium">{incident.reportedBy}</div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Description</div>
                <p className="text-sm text-muted-foreground leading-relaxed bg-white/5 p-4 rounded-xl border border-white/5">
                  {incident.description}
                </p>
              </div>

              <div className="flex items-center gap-4 pt-4 border-t border-white/5">
                <Button className="bg-primary hover:bg-primary/90 text-white">Verify Incident</Button>
                <Button variant="outline" className="border-white/10 hover:bg-white/5">Dispatch Ranger</Button>
              </div>
            </CardContent>
          </Card>

          {/* Visual Evidence Placeholder */}
          <Card className="bg-card border-white/5">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-white">Visual Intelligence</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-video bg-black/40 rounded-xl border-2 border-dashed border-white/5 flex flex-col items-center justify-center gap-3 text-muted-foreground">
                <AlertTriangle className="w-12 h-12 opacity-20" />
                <span>No media attached to this report</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
          {/* Location Context */}
          <Card className="bg-card border-white/5 overflow-hidden">
            <div className="h-40 bg-white/5 relative flex items-center justify-center overflow-hidden">
              <MapPin className="w-12 h-12 text-primary/20 absolute" />
              <div className="z-10 text-xs text-muted-foreground font-mono bg-black/60 px-3 py-1 rounded-full border border-white/10">
                {incident.location.lat.toFixed(4)}, {incident.location.lng.toFixed(4)}
              </div>
            </div>
            <CardContent className="p-6 space-y-4">
              <h3 className="font-bold text-white flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                {incident.location.name}
              </div>
              <p className="text-xs text-muted-foreground">
                This location is within 2.5km of Attappady village sector 4.
              </p>
              <div className="pt-2">
                <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20">Critical Zone B</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Operational Log */}
          <Card className="bg-card border-white/5">
            <CardHeader>
              <CardTitle className="text-sm font-bold text-white uppercase tracking-wider">Operational Log</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { time: "10:45", msg: "Report received via app" },
                { time: "10:47", msg: "Visual verification pending" },
                { time: "10:50", msg: "Alert broadcasted to Sector 4" },
              ].map((log, i) => (
                <div key={i} className="flex gap-3 text-xs">
                  <span className="text-primary font-bold">{log.time}</span>
                  <span className="text-muted-foreground">{log.msg}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

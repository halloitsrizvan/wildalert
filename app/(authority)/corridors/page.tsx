"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Wind, Map as MapIcon, Activity, AlertTriangle, ChevronRight } from "lucide-react";
import { MOCK_CORRIDORS } from "@/data/mockData";
import { cn } from "@/lib/utils";

export default function CorridorIntelligencePage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
          <Wind className="w-8 h-8 text-primary" />
          Corridor Intelligence
        </h1>
        <p className="text-white">Monitoring animal migration paths and ecological corridors.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Active Corridors List */}
        <div className="lg:col-span-1 space-y-6">
          {MOCK_CORRIDORS.map((corridor) => (
            <Card key={corridor.id} className="bg-card border-white/5 cursor-pointer hover:border-primary/30 transition-all group">
              <CardHeader className="p-4 pb-2">
                <div className="flex justify-between items-start">
                  <Badge variant="outline" className="bg-primary/10 border-primary/20 text-primary">Active</Badge>
                  <span className="text-xs text-white">ID: {corridor.id}</span>
                </div>
                <CardTitle className="text-lg font-bold text-white mt-2 group-hover:text-primary transition-colors">
                  {corridor.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0 space-y-4">
                <div className="flex items-center gap-2 text-xs text-white">
                  <MapIcon className="w-3 h-3" />
                  {corridor.path.length} waypoints monitored
                </div>
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-white uppercase tracking-widest">Risk Index</span>
                    <span className="text-white font-bold">{corridor.riskIndex}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <div 
                      className={cn(
                        "h-full rounded-full",
                        corridor.riskIndex > 70 ? "bg-red-500" : "bg-primary"
                      )} 
                      style={{ width: `${corridor.riskIndex}%` }} 
                    />
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {corridor.animalTypes.map(type => (
                    <Badge key={type} className="bg-white/5 border-white/10 text-[10px]">{type}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Intelligence View */}
        <Card className="lg:col-span-2 bg-card border-white/5 overflow-hidden flex flex-col">
          <CardHeader className="border-b border-white/5">
            <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" />
              Path Activity Analysis
            </CardTitle>
            <CardDescription className="text-white">Real-time movement heatmaps and sensor data from Wayanad-Nilgiri corridor.</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 p-0 relative min-h-[400px]">
            {/* Visual Placeholder for Path Intelligence */}
            <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center gap-4 text-center p-8">
              <div className="w-20 h-20 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
              <div>
                <h3 className="text-white font-bold text-lg">Generating Path Projection</h3>
                <p className="text-white text-sm max-w-xs mx-auto">
                  Processing satellite imagery and acoustic sensor data for movement prediction.
                </p>
              </div>
            </div>

            {/* Simulated Data Feed */}
            <div className="absolute bottom-6 left-6 right-6 grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Sensors Active", value: "142/150" },
                { label: "Movement Detected", value: "High" },
                { label: "Last Trigger", value: "4m ago" },
                { label: "Zone Health", value: "Optimal" },
              ].map((stat, i) => (
                <div key={i} className="glass-dark p-3 rounded-lg border-white/5">
                  <div className="text-[10px] text-white uppercase tracking-wider">{stat.label}</div>
                  <div className="text-sm font-bold text-white">{stat.value}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="bg-card border-white/5">
          <CardHeader>
            <CardTitle className="text-white">Corridor Obstruction Report</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { title: "Railway Fence Damage", location: "Sector 7A", status: "Critical" },
              { title: "New Construction Alert", location: "Edge of Zone 3", status: "Warning" },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
                <div>
                  <div className="text-sm font-bold text-white">{item.title}</div>
                  <div className="text-xs text-white">{item.location}</div>
                </div>
                <Badge variant={item.status === 'Critical' ? 'destructive' : 'outline'}>{item.status}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="bg-card border-white/5">
          <CardHeader>
            <CardTitle className="text-white">Conservation Operations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-white">Active conservation projects to restore fragmented corridors.</p>
            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="text-white font-medium">Zone 4 Reforestation</span>
                <span className="text-primary">65% Complete</span>
              </div>
              <div className="h-2 w-full bg-white/5 rounded-full">
                <div className="h-full bg-primary rounded-full w-[65%]" />
              </div>
            </div>
            <Button variant="ghost" className="w-full text-xs text-primary hover:bg-primary/10">
              View All Projects <ChevronRight className="ml-1 w-3 h-3" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

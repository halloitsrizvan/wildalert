"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertTriangle, Bell, Search, Filter, Megaphone, ShieldAlert } from "lucide-react";
import { MOCK_ALERTS } from "@/data/mockData";
import { cn } from "@/lib/utils";

export default function AlertsCenterPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
            <Bell className="w-8 h-8 text-primary" />
            Emergency Alerts Center
          </h1>
          <p className="text-muted-foreground">Monitor and broadcast emergency notifications to village nodes.</p>
        </div>
        <Button className="bg-destructive hover:bg-destructive/90 text-white h-12 px-6 glow-red">
          <Megaphone className="mr-2 w-5 h-5" />
          Broadcast Emergency
        </Button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search alerts by village or type..." className="bg-card border-white/5 pl-10" />
        </div>
        <Button variant="outline" className="border-white/5 bg-card">
          <Filter className="mr-2 w-4 h-4" />
          Filter
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOCK_ALERTS.map((alert) => (
          <Card key={alert.id} className="bg-card border-white/5 group hover:border-primary/20 transition-all">
            <div className={cn(
              "h-1 w-full",
              alert.type === 'danger' ? "bg-destructive glow-red" : "bg-amber-500"
            )} />
            <CardHeader>
              <div className="flex justify-between items-start mb-2">
                <Badge variant={alert.type === 'danger' ? 'destructive' : 'outline'} className={cn(
                  alert.type === 'warning' ? "border-amber-500 text-amber-500" : ""
                )}>
                  {alert.type.toUpperCase()}
                </Badge>
                <span className="text-[10px] text-muted-foreground uppercase font-bold">12 mins ago</span>
              </div>
              <CardTitle className="text-lg font-bold text-white group-hover:text-primary transition-colors">
                {alert.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground leading-relaxed">
                {alert.message}
              </p>
              <div className="flex items-center gap-2 pt-4 border-t border-white/5">
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
                  <ShieldAlert className="w-4 h-4 text-primary" />
                </div>
                <div className="text-xs">
                  <div className="text-white font-medium">Broadcasted to 450 users</div>
                  <div className="text-muted-foreground">Delivery rate: 98.4%</div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1 border-white/5 hover:bg-white/5">Details</Button>
                <Button variant="outline" size="sm" className="flex-1 border-white/5 hover:bg-white/5">Resolve</Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Add Sighting Card (UI placeholder) */}
        <div className="border-2 border-dashed border-white/5 rounded-xl flex flex-col items-center justify-center p-8 gap-4 hover:bg-white/5 transition-all cursor-pointer">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Bell className="w-6 h-6 text-primary" />
          </div>
          <div className="text-center">
            <h4 className="text-white font-bold">New Notification</h4>
            <p className="text-xs text-muted-foreground">Manually trigger an alert</p>
          </div>
        </div>
      </div>
    </div>
  );
}

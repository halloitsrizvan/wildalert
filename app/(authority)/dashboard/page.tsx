"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { StatCard } from "@/components/authority/dashboard/StatCard";
import { AlertTriangle, Shield, Map as MapIcon, Users, Activity, TrendingUp, Clock, RefreshCw } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { db } from "@/lib/firebase";
import { collection, query, where, onSnapshot, orderBy, limit, doc, getDoc } from "firebase/firestore";
import { WildlifeReport, Alert, Community } from "@/types";
import { formatDistanceToNow } from "date-fns";

export default function AdminDashboard() {
  const { user } = useAuth();
  const [community, setCommunity] = useState<Community | null>(null);
  const [reports, setReports] = useState<WildlifeReport[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [realMemberCount, setRealMemberCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.communityId) return;

    // 1. Fetch Community Info
    const fetchCommunity = async () => {
      const commSnap = await getDoc(doc(db, "communities", user.communityId!));
      if (commSnap.exists()) {
        setCommunity({ id: commSnap.id, ...commSnap.data() } as Community);
      }
    };
    fetchCommunity();

    // 2. Listen for Reports in this community
    const reportsQuery = query(
      collection(db, "reports"),
      where("communityId", "==", user.communityId),
      limit(20)
    );

    const unsubReports = onSnapshot(reportsQuery, (snapshot) => {
      const data = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() } as WildlifeReport))
        .sort((a, b) => (b.timestamp?.seconds || 0) - (a.timestamp?.seconds || 0))
        .slice(0, 5);
      setReports(data);
    });

    // 3. Listen for Alerts in this community
    const alertsQuery = query(
      collection(db, "alerts"),
      where("communityId", "==", user.communityId),
      limit(20)
    );

    const unsubAlerts = onSnapshot(alertsQuery, (snapshot) => {
      const data = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() } as Alert))
        .sort((a, b) => (b.timestamp?.seconds || 0) - (a.timestamp?.seconds || 0))
        .slice(0, 4);
      setAlerts(data);
    });

    // 4. Live count of members (Citizens)
    const membersQuery = query(
      collection(db, "users"),
      where("communityId", "==", user.communityId),
      where("role", "==", "user")
    );

    const unsubMembers = onSnapshot(membersQuery, (snapshot) => {
      setRealMemberCount(snapshot.size);
      setLoading(false);
    });

    return () => {
      unsubReports();
      unsubAlerts();
      unsubMembers();
    };
  }, [user?.communityId]);

  if (loading && !community) {
    return (
      <div className="h-full flex items-center justify-center">
        <RefreshCw className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tighter uppercase">
            Command Center: <span className="text-primary">{community?.name || "Initializing..."}</span>
          </h1>
          <p className="text-white/60 font-medium uppercase tracking-[0.2em] text-[10px] mt-2">Operational Wildlife Intelligence Unit</p>
        </div>
        <div className="text-right">
          <Badge variant="outline" className="bg-primary/10 border-primary/30 text-primary px-3 py-1 text-[10px] uppercase font-black tracking-widest">
            Level {community?.riskLevel || "Low"} Risk Node
          </Badge>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Incident Feed" 
          value={reports.length} 
          change="Last 24 hours" 
          trend={reports.length > 3 ? "up" : "neutral"} 
          icon={AlertTriangle} 
        />
        <StatCard 
          title="Active Alerts" 
          value={community?.activeAlerts || 0} 
          change="Broadcasted now" 
          trend="neutral" 
          icon={Shield} 
        />
        <StatCard 
          title="Member Base" 
          value={realMemberCount} 
          change="Registered citizens" 
          trend="up" 
          icon={Users} 
        />
        <StatCard 
          title="Sector Index" 
          value={`${community?.riskLevel.toUpperCase()}`} 
          change="Calculated daily" 
          trend="neutral" 
          icon={Activity} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Reports Table */}
        <Card className="lg:col-span-2 bg-zinc-950/50 border-white/5 backdrop-blur-sm overflow-hidden">
          <CardHeader className="border-b border-white/5 bg-white/5 px-8 py-6">
            <CardTitle className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-3">
              <TrendingUp className="w-4 h-4 text-primary" />
              Live Activity Stream
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {reports.length === 0 ? (
              <div className="p-20 text-center text-white/20 uppercase font-black text-xs tracking-widest">
                No active sightings reported in this sector.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="border-white/5 hover:bg-transparent bg-white/5">
                    <TableHead className="text-white font-black uppercase text-[10px] tracking-widest px-8">Animal</TableHead>
                    <TableHead className="text-white font-black uppercase text-[10px] tracking-widest">Location</TableHead>
                    <TableHead className="text-white font-black uppercase text-[10px] tracking-widest">Severity</TableHead>
                    <TableHead className="text-white font-black uppercase text-[10px] tracking-widest">Status</TableHead>
                    <TableHead className="text-white font-black uppercase text-[10px] tracking-widest text-right px-8">Observed</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reports.map((report) => (
                    <TableRow key={report.id} className="border-white/5 hover:bg-white/5 transition-colors group">
                      <TableCell className="font-bold text-white px-8 uppercase text-xs">{report.animalType}</TableCell>
                      <TableCell className="text-white/60 text-xs">{report.location.name}</TableCell>
                      <TableCell>
                        <Badge variant={report.severity === 'critical' ? 'destructive' : 'outline'} className={cn(
                          "text-[10px] uppercase font-black tracking-tighter",
                          report.severity === 'high' ? 'border-amber-500 text-amber-500' : 
                          report.severity === 'medium' ? 'border-blue-500 text-blue-500' : ''
                        )}>
                          {report.severity}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className={cn(
                            "w-1.5 h-1.5 rounded-full shadow-[0_0_8px_rgba(255,255,255,0.2)]",
                            report.status === 'verified' ? "bg-green-500" : 
                            report.status === 'pending' ? "bg-amber-500 animate-pulse" : "bg-blue-500"
                          )} />
                          <span className="text-[10px] uppercase font-black text-white/40 group-hover:text-white transition-colors">{report.status}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-white/40 text-[10px] font-black uppercase text-right px-8">
                        {report.timestamp ? formatDistanceToNow(report.timestamp.toDate()) + " ago" : "Just now"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Live Alerts Feed */}
        <Card className="bg-zinc-950/50 border-white/5 backdrop-blur-sm h-fit">
          <CardHeader className="border-b border-white/5 bg-white/5 px-6 py-6">
            <CardTitle className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-3">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              Emergency Broadcasts
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            {alerts.length === 0 ? (
              <div className="py-12 text-center text-white/20 uppercase font-black text-xs tracking-widest">
                System clear. No active alerts.
              </div>
            ) : (
              alerts.map((alert) => (
                <div key={alert.id} className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-3 group hover:border-primary/30 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className={cn(
                      "text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded",
                      alert.type === 'danger' ? "bg-red-500/20 text-red-500 border border-red-500/20" : "bg-amber-500/20 text-amber-500 border border-amber-500/20"
                    )}>
                      {alert.type}
                    </span>
                    <div className="flex items-center gap-1.5 text-[9px] font-black text-white/40 uppercase">
                      <Clock className="w-3 h-3" />
                      {alert.timestamp ? formatDistanceToNow(alert.timestamp.toDate()) + " ago" : "Just now"}
                    </div>
                  </div>
                  <h4 className="text-xs font-black text-white group-hover:text-primary transition-colors uppercase tracking-tight">{alert.title}</h4>
                  <p className="text-[11px] text-white/60 leading-relaxed font-medium">{alert.message}</p>
                </div>
              ))
            )}
            <button className="w-full py-4 mt-2 text-[10px] font-black text-primary hover:text-primary/80 transition-all uppercase tracking-[0.2em] border border-primary/10 rounded-xl hover:bg-primary/5">
              History Database
            </button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

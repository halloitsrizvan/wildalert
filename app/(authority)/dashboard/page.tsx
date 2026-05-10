"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { StatCard } from "@/components/authority/dashboard/StatCard";
import { AlertTriangle, Shield, Map as MapIcon, Users, Activity, TrendingUp, Clock, RefreshCw, Phone, MessageSquare, CheckCircle, Radio, X, Plus } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { db } from "@/lib/firebase";
import { collection, query, where, onSnapshot, orderBy, limit, doc, getDoc, updateDoc } from "firebase/firestore";
import { WildlifeReport, Alert, Community } from "@/types";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AdminDashboard() {
  const { user } = useAuth();
  const [community, setCommunity] = useState<Community | null>(null);
  const [reports, setReports] = useState<WildlifeReport[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [realMemberCount, setRealMemberCount] = useState(0);
  const [citizenNumbers, setCitizenNumbers] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Simulation State
  const [isSimulating, setIsSimulating] = useState(false);
  const [simLogs, setSimLogs] = useState<string[]>([]);
  const [simProgress, setSimProgress] = useState(0);

  const triggerSimulation = (report: WildlifeReport) => {
    setIsSimulating(true);
    setSimProgress(0);
    setSimLogs([`[SYSTEM] Initializing Command Protocol for ${report.animalType} at ${report.location.name}...`]);
    
    const initialSteps = [
      "Connecting to Community Secure Gateway...",
      `Fetching ${realMemberCount} registered citizen nodes...`,
      "Generating encrypted WhatsApp emergency templates...",
      "DISPATCHING BULK WHATSAPP: [WildAlert] EMERGENCY! Wildlife detected in your area.",
      "WhatsApp Dispatch: 100% COMPLETE",
      "Activating Automated Voice Call System...",
    ];

    const finalSteps = [
      "UPDATING LOCAL AUTHORITIES: Ranger Unit 4 dispatched.",
      "PROTOCOL COMPLETE: Sector notified successfully."
    ];

    let currentDelay = 0;
    const totalSteps = initialSteps.length + citizenNumbers.length + finalSteps.length;

    // Run Initial Steps
    initialSteps.forEach((step, index) => {
      currentDelay = (index + 1) * 800;
      setTimeout(() => {
        setSimLogs(prev => [...prev, `[LOG] ${step}`]);
        setSimProgress(((index + 1) / totalSteps) * 100);
      }, currentDelay);
    });

    // Run Calling Steps for actual numbers
    const callStartTime = initialSteps.length * 800;
    citizenNumbers.forEach((num, index) => {
      setTimeout(() => {
        setSimLogs(prev => [...prev, `[CALL] Dialing ${num || "+91 XXXXX XXXXX"}... CONNECTED`]);
        setSimProgress(((initialSteps.length + index + 1) / totalSteps) * 100);
      }, callStartTime + (index * 600));
    });

    // Run Final Steps
    const finalStartTime = callStartTime + (citizenNumbers.length * 600) + 800;
    finalSteps.forEach((step, index) => {
      setTimeout(() => {
        setSimLogs(prev => [...prev, `[LOG] ${step}`]);
        setSimProgress(((initialSteps.length + citizenNumbers.length + index + 1) / totalSteps) * 100);
        if (index === finalSteps.length - 1) {
          setTimeout(() => {
            setIsSimulating(false);
            setSimLogs([]);
          }, 3000);
        }
      }, finalStartTime + (index * 800));
    });
  };

  const handleStatusUpdate = async (reportId: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'pending' ? 'verified' : currentStatus === 'verified' ? 'resolved' : 'pending';
    try {
      await updateDoc(doc(db, "reports", reportId), {
        status: nextStatus
      });
    } catch (err) {
      console.error("Status update failed", err);
    }
  };

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
      const numbers = snapshot.docs.map(doc => doc.data().phoneNumber).filter(Boolean);
      setCitizenNumbers(numbers);
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
        <div className="flex items-center gap-4">
          <Link href="/report">
            <Button className="bg-white text-black font-black uppercase text-[10px] tracking-widest px-6 h-11 rounded-xl hover:scale-105 transition-transform flex gap-2">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
              Submit Field Intel
            </Button>
          </Link>
          <Badge variant="outline" className="bg-primary/10 border-primary/30 text-primary px-3 py-1 text-[10px] uppercase font-black tracking-widest h-11 flex items-center">
            Level {community?.riskLevel || "Low"} Risk Node
          </Badge>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link href="/reports/manage" className="block transition-transform hover:scale-[1.02]">
          <StatCard 
            title="Incident Feed" 
            value={reports.length} 
            change="Last 24 hours" 
            trend={reports.length > 3 ? "up" : "neutral"} 
            icon={AlertTriangle} 
          />
        </Link>
        <Link href="/alerts/manage" className="block transition-transform hover:scale-[1.02]">
          <StatCard 
            title="Active Alerts" 
            value={community?.activeAlerts || 0} 
            change="Broadcasted now" 
            trend="neutral" 
            icon={Shield} 
          />
        </Link>
        <Link href="/members" className="block transition-transform hover:scale-[1.02]">
          <StatCard 
            title="Member Base" 
            value={realMemberCount} 
            change="Registered citizens" 
            trend="up" 
            icon={Users} 
          />
        </Link>
        <Link href="/analytics" className="block transition-transform hover:scale-[1.02]">
          <StatCard 
            title="Sector Index" 
            value={`${community?.riskLevel.toUpperCase()}`} 
            change="Calculated daily" 
            trend="neutral" 
            icon={Activity} 
          />
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Reports Table */}
        <Card className="lg:col-span-2 bg-zinc-950/50 border-white/5 backdrop-blur-sm overflow-hidden">
          <CardHeader className="border-b border-white/5 bg-white/5 px-8 py-6 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-3">
              <TrendingUp className="w-4 h-4 text-primary" />
              Live Activity Stream
            </CardTitle>
            <Link href="/report">
              <Button className="h-10 px-6 bg-white text-black text-[10px] font-black uppercase tracking-widest rounded-xl hover:scale-105 transition-all flex gap-2">
                <Plus className="w-3.5 h-3.5" />
                Add Sighting
              </Button>
            </Link>
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
                    <TableHead className="text-white font-black uppercase text-[10px] tracking-widest">Animal</TableHead>
                    <TableHead className="text-white font-black uppercase text-[10px] tracking-widest">Location</TableHead>
                    <TableHead className="text-white font-black uppercase text-[10px] tracking-widest">Severity</TableHead>
                    <TableHead className="text-white font-black uppercase text-[10px] tracking-widest">Status</TableHead>
                    <TableHead className="text-white font-black uppercase text-[10px] tracking-widest">Actions</TableHead>
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
                      <TableCell>
                        <div className="flex items-center gap-2  group-hover:opacity-100 transition-opacity">
                           <Button 
                            size="sm" 
                            variant="ghost" 
                            className="h-8 px-2 text-primary hover:bg-primary/10"
                            onClick={() => handleStatusUpdate(report.id, report.status)}
                            title="Cycle Status"
                           >
                             <RefreshCw className="w-4 h-4" />
                           </Button>
                           <Button 
                            size="sm" 
                            className="h-8 px-3 bg-red-500 hover:bg-red-600 text-white text-[9px] font-black uppercase tracking-widest gap-2"
                            onClick={() => triggerSimulation(report)}
                           >
                             <Radio className="w-3.5 h-3.5" />
                             Alert
                           </Button>
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
            <Link href="/reports/manage" className="block w-full">
              <button className="w-full py-4 mt-2 text-[10px] font-black text-primary hover:text-primary/80 transition-all uppercase tracking-[0.2em] border border-primary/10 rounded-xl hover:bg-primary/5">
                History Database
              </button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Command Protocol Simulation Overlay */}
      {isSimulating && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
           <div className="w-full max-w-2xl bg-zinc-950 border border-white/10 rounded-[2.5rem] overflow-hidden shadow-[0_0_100px_rgba(239,68,68,0.2)]">
              <div className="p-8 border-b border-white/10 bg-white/5 flex items-center justify-between">
                 <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-2xl bg-red-500/20 flex items-center justify-center animate-pulse">
                       <Radio className="w-6 h-6 text-red-500" />
                    </div>
                    <div>
                       <h3 className="text-sm font-black text-white uppercase tracking-[0.2em]">Community Command Protocol</h3>
                       <p className="text-[10px] text-red-500 font-bold uppercase tracking-widest animate-pulse">Emergency Broadcast in Progress...</p>
                    </div>
                 </div>
                 <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-white/20 hover:text-white"
                  onClick={() => setIsSimulating(false)}
                 >
                   <X className="w-5 h-5" />
                 </Button>
              </div>

              <div className="p-8 space-y-6">
                 {/* Progress Bar */}
                 <div className="space-y-3">
                    <div className="flex justify-between items-end">
                       <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Signal Saturation</span>
                       <span className="text-xl font-black text-white">{Math.round(simProgress)}%</span>
                    </div>
                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                       <div 
                        className="h-full bg-red-500 transition-all duration-500 shadow-[0_0_15px_rgba(239,68,68,0.5)]"
                        style={{ width: `${simProgress}%` }}
                       />
                    </div>
                 </div>

                 {/* Console Logs */}
                 <div className="h-64 bg-black/50 rounded-2xl border border-white/5 p-6 font-mono text-[10px] space-y-2 overflow-y-auto">
                    {simLogs.map((log, i) => (
                      <div key={i} className={cn(
                        "flex gap-3",
                        log.startsWith('[SYSTEM]') ? "text-primary" : "text-white/40"
                      )}>
                        <span className="opacity-20">[{new Date().toLocaleTimeString([], { hour12: false })}]</span>
                        <span className="font-bold">{log}</span>
                      </div>
                    ))}
                    {simProgress < 100 && (
                      <div className="flex gap-2 text-white animate-pulse">
                         <span className="opacity-20">_</span>
                         <span>Injecting Tactical Data...</span>
                      </div>
                    )}
                 </div>

                 <div className="flex gap-4">
                    <div className="flex-1 p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center gap-4">
                       <MessageSquare className="w-5 h-5 text-green-500" />
                       <div>
                          <p className="text-[10px] font-black text-white uppercase">WhatsApp Meta</p>
                          <p className="text-[9px] text-white/40 font-bold">API STATUS: CONNECTED</p>
                       </div>
                    </div>
                    <div className="flex-1 p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center gap-4">
                       <Phone className="w-5 h-5 text-blue-500" />
                       <div>
                          <p className="text-[10px] font-black text-white uppercase">Voice Bridge</p>
                          <p className="text-[9px] text-white/40 font-bold">TRUNKS: ACTIVE</p>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}

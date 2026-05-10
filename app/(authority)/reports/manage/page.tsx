"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { db } from "@/lib/firebase";
import { collection, query, where, onSnapshot, orderBy, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { WildlifeReport } from "@/types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { Search, Filter, Trash2, CheckCircle, Clock, MapPin, Shield, Activity, ChevronRight, Download } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Input } from "@/components/ui/input";

export default function IntelligenceReportsPage() {
  const { user } = useAuth();
  const [reports, setReports] = useState<WildlifeReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  useEffect(() => {
    if (!user?.communityId) return;

    const q = query(
      collection(db, "reports"),
      where("communityId", "==", user.communityId),
      orderBy("timestamp", "desc")
    );

    const unsub = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as WildlifeReport));
      setReports(data);
      setLoading(false);
    });

    return () => unsub();
  }, [user?.communityId]);

  const filteredReports = reports.filter(r => {
    const matchesSearch = r.animalType.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         r.location.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || r.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleStatusUpdate = async (reportId: string, newStatus: string) => {
    try {
      await updateDoc(doc(db, "reports", reportId), { status: newStatus });
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-6 space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
           <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center">
              <Shield className="w-6 h-6 text-primary" />
           </div>
           <div>
              <h1 className="text-3xl font-black uppercase tracking-tighter">Intelligence Ledger</h1>
              <p className="text-[10px] text-white/40 font-black uppercase tracking-widest">Sector Historical Incident Database</p>
           </div>
        </div>
        <div className="flex items-center gap-3">
           <Button variant="outline" className="bg-white/5 border-white/10 text-white font-black text-[10px] uppercase tracking-widest h-12 rounded-xl gap-2">
              <Download className="w-4 h-4" />
              Export Data
           </Button>
        </div>
      </div>

      {/* Control Bar */}
      <div className="flex flex-col md:flex-row gap-4">
         <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
            <Input 
              placeholder="Search by animal or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-zinc-950 border-white/5 pl-12 h-14 rounded-2xl text-sm font-bold placeholder:text-white/20"
            />
         </div>
         <div className="flex gap-2">
            {['all', 'pending', 'verified', 'resolved'].map((s) => (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                className={cn(
                  "px-6 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all h-14",
                  filterStatus === s 
                    ? "bg-primary border-primary text-white" 
                    : "bg-zinc-950 border-white/5 text-white/40 hover:text-white"
                )}
              >
                {s}
              </button>
            ))}
         </div>
      </div>

      {/* Main Content */}
      <Card className="bg-zinc-950 border-white/5 rounded-[2.5rem] overflow-hidden">
        <CardContent className="p-0">
          {loading ? (
            <div className="p-32 flex flex-col items-center justify-center gap-4">
               <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
               <span className="text-[10px] font-black uppercase text-white/20 tracking-widest">Syncing Sector Intel...</span>
            </div>
          ) : filteredReports.length === 0 ? (
            <div className="p-32 text-center space-y-6">
               <Activity className="w-16 h-16 text-white/5 mx-auto" />
               <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em]">No matching signals in registry.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-white/5 bg-white/5 hover:bg-white/5">
                  <TableHead className="text-white font-black uppercase text-[10px] tracking-widest px-8 h-16">Intelligence Node</TableHead>
                  <TableHead className="text-white font-black uppercase text-[10px] tracking-widest">Sector Location</TableHead>
                  <TableHead className="text-white font-black uppercase text-[10px] tracking-widest">Severity</TableHead>
                  <TableHead className="text-white font-black uppercase text-[10px] tracking-widest">Status</TableHead>
                  <TableHead className="text-white font-black uppercase text-[10px] tracking-widest">Operational Actions</TableHead>
                  <TableHead className="text-white font-black uppercase text-[10px] tracking-widest text-right px-8">Observed</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReports.map((report) => (
                  <TableRow key={report.id} className="border-white/5 hover:bg-white/[0.02] transition-colors group">
                    <TableCell className="px-8">
                       <div className="flex flex-col">
                          <span className="text-sm font-black text-white uppercase">{report.animalType}</span>
                          <span className="text-[9px] text-white/40 font-bold uppercase tracking-tighter">REF: {report.id.slice(0,8)}</span>
                       </div>
                    </TableCell>
                    <TableCell>
                       <div className="flex items-center gap-2">
                          <MapPin className="w-3.5 h-3.5 text-primary/60" />
                          <span className="text-xs text-white font-medium">{report.location.name}</span>
                       </div>
                    </TableCell>
                    <TableCell>
                       <Badge variant="outline" className={cn(
                          "text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg",
                          report.severity === 'critical' ? "border-red-500 text-red-500" : report.severity === 'high' ? "border-amber-500 text-amber-500" : "border-primary text-primary"
                       )}>
                          {report.severity}
                       </Badge>
                    </TableCell>
                    <TableCell>
                       <div className="flex items-center gap-2">
                          <div className={cn(
                            "w-1.5 h-1.5 rounded-full shadow-lg",
                            report.status === 'verified' ? "bg-green-500" : report.status === 'pending' ? "bg-amber-500 animate-pulse" : "bg-blue-500"
                          )} />
                          <span className="text-[10px] font-black text-white/40 uppercase">{report.status}</span>
                       </div>
                    </TableCell>
                    <TableCell>
                       <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          {report.status !== 'verified' && (
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              className="h-9 px-3 text-green-500 hover:bg-green-500/10 text-[9px] font-black uppercase tracking-widest rounded-xl"
                              onClick={() => handleStatusUpdate(report.id, 'verified')}
                            >
                               Verify
                            </Button>
                          )}
                          {report.status !== 'resolved' && (
                            <Button 
                              size="sm" 
                              className="h-9 px-3 bg-primary/20 text-primary hover:bg-primary/30 text-[9px] font-black uppercase tracking-widest rounded-xl"
                              onClick={() => handleStatusUpdate(report.id, 'resolved')}
                            >
                               Resolve
                            </Button>
                          )}
                          <Button size="sm" variant="ghost" className="h-9 w-9 p-0 text-white/20 hover:text-red-500">
                             <Trash2 className="w-4 h-4" />
                          </Button>
                       </div>
                    </TableCell>
                    <TableCell className="text-right px-8">
                       <div className="flex flex-col items-end">
                          <span className="text-[10px] font-black text-white/60 uppercase">
                             {report.timestamp ? formatDistanceToNow(report.timestamp.toDate()) + " ago" : "LIVE"}
                          </span>
                          <span className="text-[9px] text-white/20 font-bold uppercase tracking-tighter">
                             {report.timestamp?.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                       </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

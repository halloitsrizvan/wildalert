"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { db } from "@/lib/firebase";
import { collection, query, where, onSnapshot, addDoc, serverTimestamp, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { Alert, Community } from "@/types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { AlertTriangle, MapPin, Send, Trash2, CheckCircle, Radio, Clock, Shield } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import ReportLocationMap from "@/components/map/ReportLocationMap";

export default function AlertManagementPage() {
  const { user } = useAuth();
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState<{ message: string, type: 'success' | 'error' } | null>(null);

  // Auto-clear notification
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // Form State
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [type, setType] = useState<'danger' | 'warning' | 'info'>('warning');
  const [location, setLocation] = useState<[number, number] | null>(null);

  useEffect(() => {
    if (!user?.communityId) return;

    const q = query(
      collection(db, "alerts"),
      where("communityId", "==", user.communityId)
    );

    const unsub = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Alert));
      setAlerts(data.sort((a, b) => (b.timestamp?.seconds || 0) - (a.timestamp?.seconds || 0)));
      setLoading(false);
    });

    return () => unsub();
  }, [user?.communityId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.communityId || !location) {
      setNotification({
        message: "Tactical location not specified on GIS map.",
        type: 'error'
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, "alerts"), {
        title,
        message,
        type,
        communityId: user.communityId,
        location: {
          lat: location[0],
          lng: location[1]
        },
        timestamp: serverTimestamp(),
        createdBy: user.uid
      });

      // Clear form
      setTitle("");
      setMessage("");
      setLocation(null);
      setNotification({
        message: "SIGNAL DISPATCHED: Emergency broadcast is now live.",
        type: 'success'
      });
    } catch (err) {
      console.error("Failed to broadcast alert", err);
      setNotification({
        message: "BROADCAST ERROR: Communication link failed.",
        type: 'error'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResolve = async (alertId: string) => {
    try {
      await deleteDoc(doc(db, "alerts", alertId));
      setNotification({
        message: "SIGNAL RESOLVED: Alert retracted from sector.",
        type: 'success'
      });
    } catch (err) {
      console.error("Failed to resolve alert", err);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-6 space-y-8 animate-in fade-in duration-500 relative">
      {/* Tactical Notification Banner */}
      {notification && (
        <div className={cn(
          "fixed top-6 right-6 z-[100] p-4 rounded-2xl border backdrop-blur-xl shadow-2xl animate-in slide-in-from-right duration-300 flex items-center gap-3 min-w-[300px]",
          notification.type === 'success' ? "bg-primary/20 border-primary/30 text-primary" : "bg-red-500/20 border-red-500/30 text-red-500"
        )}>
           {notification.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
           <span className="text-[10px] font-black uppercase tracking-widest">{notification.message}</span>
        </div>
      )}
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
           <div className="w-12 h-12 rounded-2xl bg-red-500/20 flex items-center justify-center">
              <Radio className="w-6 h-6 text-red-500 animate-pulse" />
           </div>
           <div>
              <h1 className="text-3xl font-black uppercase tracking-tighter">Signal Management</h1>
              <p className="text-[10px] text-white/40 font-black uppercase tracking-widest">Community Emergency Broadcast Protocol</p>
           </div>
        </div>
        <div className="flex items-center gap-3 bg-white/5 p-2 rounded-2xl border border-white/5">
           <Badge className="bg-red-500 text-white text-[10px] font-black uppercase">{alerts.length} Active Signals</Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Composer Form */}
        <Card className="lg:col-span-1 bg-zinc-950 border-white/5 rounded-[2.5rem] overflow-hidden">
          <CardHeader className="bg-white/5 border-b border-white/10 px-8 py-6">
            <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center gap-3">
              <Send className="w-4 h-4 text-primary" />
              Signal Composer
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8 space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-white/40 uppercase tracking-widest">Signal Headline</label>
                <Input 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., TUSKER SPOTTED IN SECTOR 4"
                  className="bg-white/5 border-white/10 rounded-xl h-12 text-white font-bold"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-white/40 uppercase tracking-widest">Broadcast Message</label>
                <Textarea 
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Provide tactical instructions for citizens..."
                  className="bg-white/5 border-white/10 rounded-xl min-h-[100px] text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                 {(['danger', 'warning', 'info'] as const).map((t) => (
                   <button
                    key={t}
                    type="button"
                    onClick={() => setType(t)}
                    className={cn(
                      "py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border",
                      type === t 
                        ? (t === 'danger' ? "bg-red-500 border-red-500 text-white" : t === 'warning' ? "bg-amber-500 border-amber-500 text-black" : "bg-primary border-primary text-white")
                        : "bg-white/5 border-white/10 text-white/40 hover:text-white"
                    )}
                   >
                     {t}
                   </button>
                 ))}
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-white/40 uppercase tracking-widest flex justify-between">
                  Target Location
                  <span className={cn("font-bold", location ? "text-primary" : "text-red-500")}>
                    {location ? "LOCK ACQUIRED" : "NOT SET"}
                  </span>
                </label>
                <div className="h-64 rounded-2xl overflow-hidden border border-white/10 relative">
                  <ReportLocationMap onLocationSet={setLocation} />
                  {!location && (
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center pointer-events-none z-10">
                       <p className="text-[9px] font-black text-white uppercase tracking-widest bg-black/80 px-3 py-2 rounded-lg">Tap map to pinpoint signal</p>
                    </div>
                  )}
                </div>
              </div>

              <Button 
                type="submit" 
                disabled={isSubmitting || !location}
                className="w-full h-14 rounded-2xl bg-white text-black font-black uppercase tracking-widest hover:scale-[1.02] transition-transform flex gap-3"
              >
                <Radio className={cn("w-4 h-4", isSubmitting && "animate-ping")} />
                {isSubmitting ? "Broadcasting..." : "Initialize Signal"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Signal Ledger */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between px-4">
             <h2 className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
               <Shield className="w-4 h-4 text-white/40" />
               Live Signal Ledger
             </h2>
          </div>

          <div className="space-y-4">
            {loading ? (
              <div className="h-48 flex items-center justify-center">
                 <Radio className="w-8 h-8 text-white/10 animate-ping" />
              </div>
            ) : alerts.length === 0 ? (
              <div className="p-20 text-center bg-white/[0.02] border border-dashed border-white/10 rounded-[3rem]">
                <Clock className="w-12 h-12 text-white/10 mb-4 mx-auto" />
                <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">No active signals in sector registry.</p>
              </div>
            ) : (
              alerts.map((alert) => (
                <Card key={alert.id} className="bg-zinc-950 border-white/5 rounded-[2rem] overflow-hidden group hover:border-primary/30 transition-all duration-500">
                  <CardContent className="p-0">
                    <div className="flex flex-col md:flex-row">
                      <div className="p-8 flex-1 space-y-4">
                        <div className="flex items-center justify-between">
                          <Badge className={cn(
                            "text-[9px] font-black uppercase tracking-widest px-2.5 py-1",
                            alert.type === 'danger' ? "bg-red-500 text-white" : alert.type === 'warning' ? "bg-amber-500 text-black" : "bg-primary text-white"
                          )}>
                            {alert.type} SIGNAL
                          </Badge>
                          <span className="text-[10px] font-black text-white/20 uppercase">
                            {alert.timestamp ? formatDistanceToNow(alert.timestamp.toDate()) + " ago" : "LIVE"}
                          </span>
                        </div>
                        <h3 className="text-xl font-black text-white uppercase tracking-tight">{alert.title}</h3>
                        <p className="text-xs text-white/60 leading-relaxed font-medium">{alert.message}</p>
                        
                        <div className="flex items-center gap-6 pt-4 border-t border-white/5">
                           <div className="flex items-center gap-2">
                              <MapPin className="w-3.5 h-3.5 text-primary" />
                              <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">
                                {alert.location?.lat.toFixed(4)}, {alert.location?.lng.toFixed(4)}
                              </span>
                           </div>
                        </div>
                      </div>
                      <div className="bg-white/5 border-l border-white/10 p-6 flex flex-col gap-3 justify-center min-w-[140px]">
                         <Button 
                          onClick={() => handleResolve(alert.id)}
                          className="w-full bg-primary text-white font-black text-[10px] uppercase tracking-widest h-11 rounded-xl gap-2 shadow-lg shadow-primary/20"
                         >
                           <CheckCircle className="w-3.5 h-3.5" />
                           Resolve
                         </Button>
                         <Button 
                          variant="ghost"
                          onClick={() => handleResolve(alert.id)} // For now same as resolve
                          className="w-full text-white/40 hover:text-red-500 text-[10px] font-black uppercase h-11 rounded-xl transition-colors"
                         >
                           <Trash2 className="w-3.5 h-3.5" />
                         </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

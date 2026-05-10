"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { db } from "@/lib/firebase";
import { collection, query, where, onSnapshot, orderBy, doc, setDoc, updateDoc, increment } from "firebase/firestore";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { Search, Users, MapPin, Phone, MessageSquare, Shield, Clock, Mail, ChevronRight, Activity, Plus, UserPlus, X, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface Citizen {
  id: string;
  name: string;
  email: string;
  phoneNumber?: string;
  locationName?: string;
  role: string;
  communityId: string;
}

export default function CitizenDatabasePage() {
  const { user } = useAuth();
  const [citizens, setCitizens] = useState<Citizen[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isProvisioning, setIsProvisioning] = useState(false);

  // Form State
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newPassword, setNewPassword] = useState("welcome123");

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.communityId) return;

    setIsProvisioning(true);
    try {
      const newUserId = Math.random().toString(36).substring(2, 15);
      const profile = {
        uid: newUserId,
        name: newName,
        email: newEmail,
        phoneNumber: newPhone,
        role: 'user',
        communityId: user.communityId,
        createdAt: Date.now(),
        status: 'active'
      };

      await setDoc(doc(db, "users", newUserId), profile);
      
      const communityRef = doc(db, "communities", user.communityId);
      await updateDoc(communityRef, {
        memberCount: increment(1)
      });

      setIsAddDialogOpen(false);
      setNewName("");
      setNewEmail("");
      setNewPhone("");
    } catch (err) {
      console.error("Failed to provision node", err);
    } finally {
      setIsProvisioning(false);
    }
  };

  useEffect(() => {
    if (!user?.communityId) return;

    const q = query(
      collection(db, "users"),
      where("communityId", "==", user.communityId),
      where("role", "==", "user")
    );

    const unsub = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Citizen));
      setCitizens(data);
      setLoading(false);
    });

    return () => unsub();
  }, [user?.communityId]);

  const filteredCitizens = citizens.filter(c => 
    c.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.locationName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-black text-white p-6 space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
           <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center">
              <Users className="w-6 h-6 text-primary" />
           </div>
           <div>
              <h1 className="text-3xl font-black uppercase tracking-tighter">Sector Citizens</h1>
              <p className="text-[10px] text-white/40 font-black uppercase tracking-widest">Active Community Demographic Database</p>
           </div>
        </div>
        <div className="flex items-center gap-6 pr-4">
           <div className="flex flex-col items-end">
              <span className="text-xl font-black text-white">{citizens.length}</span>
              <span className="text-[10px] text-white/20 font-black uppercase tracking-widest">Registered Nodes</span>
           </div>
           <div className="h-10 w-px bg-white/10" />
           
           <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
             <DialogTrigger render={
               <Button className="bg-white text-black font-black uppercase text-[10px] tracking-widest px-6 h-12 rounded-xl hover:scale-105 transition-transform flex gap-2">
                 <UserPlus className="w-4 h-4" />
                 Add Member
               </Button>
             } />
             <DialogContent className="bg-zinc-950 border-white/10 rounded-[2.5rem] p-10 max-w-md">
               <DialogHeader className="mb-6">
                 <DialogTitle className="text-xl font-black uppercase tracking-tighter text-white flex items-center gap-3">
                   <Shield className="w-6 h-6 text-primary" />
                   Provision New Node
                 </DialogTitle>
                 <p className="text-[10px] text-white/40 font-black uppercase tracking-widest mt-2">Administrative Sector Enrollment</p>
               </DialogHeader>

               <form onSubmit={handleAddMember} className="space-y-6">
                 <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase text-white/40 tracking-widest px-1">Citizen Full Name</label>
                   <Input 
                    required
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="Enter full name"
                    className="bg-black border-white/10 h-14 rounded-xl text-white font-bold"
                   />
                 </div>
                 <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase text-white/40 tracking-widest px-1">Network Email</label>
                   <Input 
                    required
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="citizen@network.com"
                    className="bg-black border-white/10 h-14 rounded-xl text-white font-bold"
                   />
                 </div>
                 <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase text-white/40 tracking-widest px-1">Contact Signal (Phone)</label>
                   <Input 
                    required
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    placeholder="+91 XXXXX XXXXX"
                    className="bg-black border-white/10 h-14 rounded-xl text-white font-bold"
                   />
                 </div>

                 <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                    <p className="text-[9px] text-white/40 font-bold uppercase leading-relaxed">
                       PROVISIONING NOTE: New nodes are initialized with the default access key: <span className="text-primary">welcome123</span>. Citizens should update this upon first synchronization.
                    </p>
                 </div>

                 <Button 
                  type="submit" 
                  disabled={isProvisioning}
                  className="w-full h-14 bg-primary text-white font-black uppercase tracking-widest rounded-xl shadow-[0_0_20px_rgba(34,197,94,0.2)]"
                 >
                   {isProvisioning ? (
                     <Loader2 className="w-5 h-5 animate-spin" />
                   ) : (
                     "Activate Node"
                   )}
                 </Button>
               </form>
             </DialogContent>
           </Dialog>
        </div>
      </div>

      {/* Control Bar */}
      <div className="flex gap-4">
         <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
            <Input 
              placeholder="Search citizens by name, email or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-zinc-950 border-white/5 pl-12 h-14 rounded-2xl text-sm font-bold placeholder:text-white/20"
            />
         </div>
      </div>

      {/* Main Content */}
      <Card className="bg-zinc-950 border-white/5 rounded-[2.5rem] overflow-hidden">
        <CardContent className="p-0">
          {loading ? (
            <div className="p-32 flex flex-col items-center justify-center gap-4">
               <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
               <span className="text-[10px] font-black uppercase text-white/20 tracking-widest">Syncing Citizen Nodes...</span>
            </div>
          ) : filteredCitizens.length === 0 ? (
            <div className="p-32 text-center space-y-6">
               <Shield className="w-16 h-16 text-white/5 mx-auto" />
               <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em]">No registered nodes found in this sector.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-white/5 bg-white/5 hover:bg-white/5">
                  <TableHead className="text-white font-black uppercase text-[10px] tracking-widest px-8 h-16">Citizen Identity</TableHead>
                  <TableHead className="text-white font-black uppercase text-[10px] tracking-widest">Sector Node</TableHead>
                  <TableHead className="text-white font-black uppercase text-[10px] tracking-widest">Contact Signal</TableHead>
                  <TableHead className="text-white font-black uppercase text-[10px] tracking-widest">Security Status</TableHead>
                  <TableHead className="text-white font-black uppercase text-[10px] tracking-widest">Direct Comms</TableHead>
                  <TableHead className="text-white font-black uppercase text-[10px] tracking-widest text-right px-8">Audit</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCitizens.map((citizen) => (
                  <TableRow key={citizen.id} className="border-white/5 hover:bg-white/[0.02] transition-colors group">
                    <TableCell className="px-8">
                       <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-xs font-black">
                             {citizen.name?.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex flex-col">
                             <span className="text-sm font-black text-white uppercase">{citizen.name || "Anonymous Node"}</span>
                             <span className="text-[10px] text-white/40 font-bold tracking-tight">{citizen.email}</span>
                          </div>
                       </div>
                    </TableCell>
                    <TableCell>
                       <div className="flex items-center gap-2">
                          <MapPin className="w-3.5 h-3.5 text-primary/60" />
                          <span className="text-[10px] text-white font-black uppercase tracking-widest">{citizen.locationName || "Mobile Node"}</span>
                       </div>
                    </TableCell>
                    <TableCell>
                       <div className="flex items-center gap-2">
                          <Phone className="w-3.5 h-3.5 text-white/20" />
                          <span className="text-xs text-white/60 font-medium">{citizen.phoneNumber || "No voice bridge"}</span>
                       </div>
                    </TableCell>
                    <TableCell>
                       <Badge variant="outline" className="border-green-500/30 text-green-500 bg-green-500/5 text-[9px] font-black uppercase px-2.5 py-1">
                          ACTIVE NODE
                       </Badge>
                    </TableCell>
                    <TableCell>
                       <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button size="sm" variant="ghost" className="h-9 w-9 p-0 text-white/40 hover:text-primary">
                             <MessageSquare className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="ghost" className="h-9 w-9 p-0 text-white/40 hover:text-primary">
                             <Mail className="w-4 h-4" />
                          </Button>
                       </div>
                    </TableCell>
                    <TableCell className="text-right px-8">
                       <Button size="sm" variant="ghost" className="h-9 px-4 text-[9px] font-black uppercase tracking-widest text-white/20 hover:text-white hover:bg-white/5 rounded-xl">
                          View Node
                       </Button>
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

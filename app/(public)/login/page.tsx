"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useCommunity } from "@/hooks/useCommunity";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Users, Mail, Lock, User, ArrowRight, MapPin, ChevronDown } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { getCommunities } from "@/lib/communities";
import { Community } from "@/types";

export default function LoginPage() {
  const { signIn, signUp, user } = useAuth();
  const router = useRouter();
  
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [role, setRole] = useState<'user' | 'community_authority'>('user');
  
  // Form States
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [selectedCommunityId, setSelectedCommunityId] = useState("");
  const [communities, setCommunities] = useState<Community[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch available communities for citizen selection
    async function fetchCommunities() {
      try {
        const data = await getCommunities();
        setCommunities(data);
      } catch (err) {
        console.error("Failed to fetch communities", err);
      }
    }
    fetchCommunities();
  }, []);

  useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (mode === 'signup' && role === 'user' && !selectedCommunityId) {
      setError("Please select your community area.");
      return;
    }

    setLoading(true);
    try {
      if (mode === 'login') {
        await signIn(email, password);
      } else {
        await signUp(email, password, role, { 
          name,
          communityId: role === 'user' ? selectedCommunityId : null,
          createdAt: Date.now()
        });
      }
    } catch (err: any) {
      setError(err.message || "Action failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
      {/* Brand Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10 text-center"
      >
        <Link href="/" className="flex items-center gap-3 justify-center mb-4">
          <div className="p-3 bg-primary/20 rounded-2xl border border-primary/20 shadow-[0_0_20px_rgba(34,197,94,0.2)]">
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <span className="text-4xl font-black text-white uppercase tracking-tighter">
            WILD<span className="text-primary">ALERT</span>
          </span>
        </Link>
        <div className="h-px w-12 bg-primary/50 mx-auto mb-4" />
        <p className="text-white font-black uppercase tracking-[0.4em] text-[10px]">Western Ghats Intelligence</p>
      </motion.div>

      <Card className="w-full max-w-md bg-zinc-900 border border-white/10 overflow-hidden shadow-2xl relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />
        
        <CardContent className="p-10 pt-12">
          {/* Main Mode Toggle */}
          <div className="flex justify-center mb-10">
            <div className="flex p-1 bg-black rounded-xl border border-white/10 w-full">
              <button 
                onClick={() => setMode('login')}
                className={cn(
                  "flex-1 py-3 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all relative z-10",
                  mode === 'login' ? "text-white" : "text-white/40 hover:text-white"
                )}
              >
                Sign In
                {mode === 'login' && (
                  <motion.div layoutId="mode-bg" className="absolute inset-0 bg-white/10 rounded-lg -z-10 shadow-inner" />
                )}
              </button>
              <button 
                onClick={() => setMode('signup')}
                className={cn(
                  "flex-1 py-3 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all relative z-10",
                  mode === 'signup' ? "text-white" : "text-white/40 hover:text-white"
                )}
              >
                Register
                {mode === 'signup' && (
                  <motion.div layoutId="mode-bg" className="absolute inset-0 bg-white/10 rounded-lg -z-10 shadow-inner" />
                )}
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-8">
              {/* Role Selector */}
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase text-white/40 tracking-[0.2em] block text-center">Select Role</label>
                <div className="flex p-1 bg-black rounded-xl border border-white/10">
                  <button 
                    type="button"
                    onClick={() => setRole('user')}
                    className={cn(
                      "flex-1 py-3 rounded-lg text-[10px] font-black uppercase flex items-center justify-center gap-2 transition-all",
                      role === 'user' ? "bg-primary text-white shadow-[0_0_15px_rgba(34,197,94,0.3)]" : "text-white/40 hover:text-white"
                    )}
                  >
                    <Users className="w-4 h-4" /> Citizen
                  </button>
                  <button 
                    type="button"
                    onClick={() => setRole('community_authority')}
                    className={cn(
                      "flex-1 py-3 rounded-lg text-[10px] font-black uppercase flex items-center justify-center gap-2 transition-all",
                      role === 'community_authority' ? "bg-primary text-white shadow-[0_0_15px_rgba(34,197,94,0.3)]" : "text-white/40 hover:text-white"
                    )}
                  >
                    <Shield className="w-4 h-4" /> Authority
                  </button>
                </div>
              </div>

              {/* Input Fields */}
              <div className="space-y-6">
                {mode === 'signup' && (
                  <div className="space-y-3">
                    <div className="flex justify-between items-end px-1">
                      <label className="text-[10px] font-black uppercase text-white tracking-widest">{role === 'user' ? "Your Full Name" : "Regional Sector Name"}</label>
                      <User className="w-3 h-3 text-primary" />
                    </div>
                    <input 
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-black border border-white/10 rounded-xl h-16 px-8 text-white placeholder:text-white/10 focus:outline-none focus:border-primary transition-all font-bold"
                      placeholder={role === 'user' ? "Enter name" : "e.g. Munnar South"}
                    />
                  </div>
                )}

                {/* Community Selection for Citizens */}
                {mode === 'signup' && role === 'user' && (
                  <div className="space-y-3">
                    <div className="flex justify-between items-end px-1">
                      <label className="text-[10px] font-black uppercase text-white tracking-widest">Select Your Community</label>
                      <MapPin className="w-3 h-3 text-primary" />
                    </div>
                    <div className="relative">
                      <select 
                        required
                        value={selectedCommunityId}
                        onChange={(e) => setSelectedCommunityId(e.target.value)}
                        className="w-full bg-black border border-white/10 rounded-xl h-16 px-8 text-white focus:outline-none focus:border-primary transition-all font-bold appearance-none cursor-pointer"
                      >
                        <option value="" disabled className="bg-zinc-900">Choose your area...</option>
                        {communities.map((c) => (
                          <option key={c.id} value={c.id} className="bg-zinc-900">
                            {c.name} ({c.district})
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none" />
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  <div className="flex justify-between items-end px-1">
                    <label className="text-[10px] font-black uppercase text-white tracking-widest">Network Email</label>
                    <Mail className="w-3 h-3 text-primary" />
                  </div>
                  <input 
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-black border border-white/10 rounded-xl h-16 px-8 text-white placeholder:text-white/10 focus:outline-none focus:border-primary transition-all font-bold"
                    placeholder="your@network.id"
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-end px-1">
                    <label className="text-[10px] font-black uppercase text-white tracking-widest">Access Key</label>
                    <Lock className="w-3 h-3 text-primary" />
                  </div>
                  <input 
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-black border border-white/10 rounded-xl h-16 px-8 text-white placeholder:text-white/10 focus:outline-none focus:border-primary transition-all font-bold"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>

            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-[10px] text-red-500 font-black uppercase text-center tracking-wider">
                {error}
              </div>
            )}

            <Button 
              type="submit" 
              disabled={loading}
              className="w-full h-16 bg-primary text-white font-black uppercase tracking-[0.2em] hover:bg-primary/90 shadow-[0_8px_30px_rgba(34,197,94,0.3)] transition-all active:scale-[0.98]"
            >
              {loading ? (
                <div className="w-6 h-6 border-3 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  {mode === 'login' ? "Authorize Access" : "Activate Node"}
                  <ArrowRight className="ml-3 w-5 h-5" />
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
      
      <div className="mt-12 flex flex-col items-center gap-4">
        <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.5em]">
          Operational Command &bull; 2026
        </p>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useCommunity } from "@/hooks/useCommunity";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Users, Mail, Lock, User, ArrowRight, MapPin } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";

const CommunitySignupMap = dynamic(() => import("@/components/map/CommunitySignupMap"), { ssr: false });

export default function LoginPage() {
  const { signIn, signUp, user } = useAuth();
  const { currentCommunity, loading: geoLoading } = useCommunity();
  const router = useRouter();
  
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [role, setRole] = useState<'user' | 'community_authority'>('user');
  
  // Form States
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [signupStep, setSignupStep] = useState(1);
  const [boundary, setBoundary] = useState<any>(null);

  useEffect(() => {
    if (user) {
      if (user.role === 'community_authority') router.push("/dashboard");
      else router.push("/map");
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (mode === 'signup' && role === 'community_authority' && signupStep === 1) {
      setSignupStep(2);
      return;
    }

    setLoading(true);
    try {
      if (mode === 'login') {
        await signIn(email, password);
      } else {
        await signUp(email, password, role, { 
          name: name || (role === 'community_authority' ? "Authority" : "Citizen"),
          communityId: currentCommunity?.id || null,
          boundary
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
          {/* Main Mode Toggle - Centered Alignment */}
          <div className="flex justify-center mb-10">
            <div className="flex p-1 bg-black rounded-xl border border-white/10 w-full">
              <button 
                onClick={() => { setMode('login'); setSignupStep(1); }}
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
            <AnimatePresence mode="wait">
              {signupStep === 1 ? (
                <motion.div
                  key="form-fields"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-8"
                >
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
                  <div className="space-y-8">
                    {mode === 'signup' && (
                      <div className="space-y-4">
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

                    <div className="space-y-4">
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

                    <div className="space-y-4">
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
                </motion.div>
              ) : (
                <motion.div
                  key="map-step"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="space-y-6"
                >
                  <div className="text-center">
                    <h3 className="text-[10px] font-black uppercase text-white tracking-[0.2em] mb-2">GIS Geofencing</h3>
                    <p className="text-[10px] text-white/40 leading-relaxed uppercase">Set center & perimeter radius markers.</p>
                  </div>
                  <div className="h-72 bg-black rounded-2xl overflow-hidden border border-white/10 shadow-inner">
                    <CommunitySignupMap onCircleSet={setBoundary} />
                  </div>
                  <button 
                    type="button"
                    onClick={() => setSignupStep(1)}
                    className="text-[10px] font-black uppercase text-white/40 hover:text-white transition-colors block mx-auto underline underline-offset-4 decoration-primary"
                  >
                    Modify Credentials
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-[10px] text-red-500 font-black uppercase text-center tracking-wider">
                {error}
              </div>
            )}

            <Button 
              type="submit" 
              disabled={loading || (signupStep === 2 && !boundary)}
              className="w-full h-16 bg-primary text-white font-black uppercase tracking-[0.2em] hover:bg-primary/90 shadow-[0_8px_30px_rgba(34,197,94,0.3)] transition-all active:scale-[0.98]"
            >
              {loading ? (
                <div className="w-6 h-6 border-3 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  {mode === 'login' ? "Authorize Access" : signupStep === 1 && role === 'community_authority' ? "Proceed to GIS" : "Activate Node"}
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

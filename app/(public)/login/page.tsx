"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useCommunity } from "@/hooks/useCommunity";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Shield, Users, MapPin, ChevronRight, Activity, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export default function LoginPage() {
  const { login } = useAuth();
  const { currentCommunity, loading: geoLoading } = useCommunity();
  const router = useRouter();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [role, setRole] = useState<'user' | 'community_authority' | null>(null);

  const handleAdminLogin = () => {
    login('community_authority');
    router.push("/dashboard");
  };

  const handleCitizenLogin = () => {
    if (currentCommunity) {
      login('user', currentCommunity.id);
      router.push("/map");
    } else {
      alert("No community network detected at your location. Please contact your local forest range office.");
    }
  };

  if (mode === 'signup' && role === 'community_authority') {
    return <CommunitySignupFlow onBack={() => setRole(null)} />;
  }

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
      <div className="mb-8 text-center">
        <Link href="/" className="flex items-center gap-2 justify-center mb-6">
          <div className="p-3 bg-primary/20 rounded-xl">
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <span className="text-3xl font-black tracking-tight text-white uppercase">
            WILD<span className="text-primary">ALERT</span>
          </span>
        </Link>
        <div className="flex bg-white/5 p-1 rounded-lg border border-white/10 w-fit mx-auto">
          <button 
            onClick={() => setMode('login')}
            className={cn(
              "px-6 py-2 rounded-md text-xs font-bold uppercase tracking-widest transition-all",
              mode === 'login' ? "bg-primary text-white" : "text-white hover:text-white"
            )}
          >
            Access System
          </button>
          <button 
            onClick={() => setMode('signup')}
            className={cn(
              "px-6 py-2 rounded-md text-xs font-bold uppercase tracking-widest transition-all",
              mode === 'signup' ? "bg-primary text-white" : "text-white hover:text-white"
            )}
          >
            Join Network
          </button>
        </div>
      </div>

      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Admin/Authority Path */}
        <Card 
          className="bg-card border-white/5 group hover:border-primary/50 transition-all cursor-pointer overflow-hidden relative" 
          onClick={() => {
            if (mode === 'login') handleAdminLogin();
            else setRole('community_authority');
          }}
        >
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
            <Shield className="w-32 h-32 text-primary" />
          </div>
          <CardHeader className="p-8">
            <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center mb-6">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <CardTitle className="text-3xl font-black uppercase tracking-tighter text-white">
              {mode === 'login' ? "Authority Login" : "Establish Node"}
            </CardTitle>
            <CardDescription className="text-white">
              {mode === 'login' 
                ? "Secure access for forest range officers and community authorities." 
                : "Initialize a new geo-fenced intelligence network for your sector."}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8 pt-0">
             <ul className="space-y-3 mb-8">
                {["Regional GIS Control", "Boundary Calibration", "Emergency Dispatch"].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-xs text-white">
                    <div className="w-1 h-1 rounded-full bg-primary" />
                    {item}
                  </li>
                ))}
             </ul>
             <Button className="w-full h-14 bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-widest">
               {mode === 'login' ? "Enter Command Center" : "Initialize Authority"}
               <ArrowRight className="ml-2 w-5 h-5" />
             </Button>
          </CardContent>
        </Card>

        {/* Citizen/User Path */}
        <Card 
          className={cn(
            "bg-card border-white/5 group transition-all overflow-hidden relative",
            (mode === 'login' && !currentCommunity) ? "opacity-50 grayscale cursor-not-allowed" : "hover:border-blue-500 cursor-pointer"
          )}
          onClick={() => {
            if (mode === 'login') handleCitizenLogin();
            else {
              login('user');
              router.push("/map");
            }
          }}
        >
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
            <Users className="w-32 h-32 text-blue-500" />
          </div>
          <CardHeader className="p-8">
            <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center mb-6">
              <Users className="w-6 h-6 text-blue-500" />
            </div>
            <CardTitle className="text-3xl font-black uppercase tracking-tighter text-white">
              {mode === 'login' ? "Citizen Access" : "Join Community"}
            </CardTitle>
            <CardDescription className="text-white">
              {mode === 'login'
                ? "Access localized wildlife intelligence for your connected zone."
                : "Register to receive localized safety alerts and report sightings."}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8 pt-0">
             {mode === 'login' && (
               geoLoading ? (
                 <div className="h-14 flex items-center justify-center gap-3 bg-white/5 rounded-xl border border-white/10">
                   <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                 </div>
               ) : currentCommunity ? (
                 <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 mb-8">
                   <div className="text-[10px] text-blue-500 uppercase font-black tracking-[0.2em]">Active Zone</div>
                   <div className="text-sm font-bold text-white">{currentCommunity.name}</div>
                 </div>
               ) : (
                 <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 mb-8">
                   <div className="text-[10px] text-red-500 uppercase font-black tracking-[0.2em]">Disconnected</div>
                   <div className="text-xs text-white">Move to a protected zone to access localized feed.</div>
                 </div>
               )
             )}
             <Button 
               disabled={mode === 'login' && !currentCommunity}
               className={cn(
                 "w-full h-14 font-black uppercase tracking-widest",
                 mode === 'login' ? "bg-blue-500 hover:bg-blue-600 text-white" : "bg-white/10 hover:bg-white/20 text-white"
               )}
             >
               {mode === 'login' ? "Connect to Network" : "Begin Registration"}
               <ArrowRight className="ml-2 w-5 h-5" />
             </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function CommunitySignupFlow({ onBack }: { onBack: () => void }) {
  const [step, setStep] = useState(1);
  const [placeName, setPlaceName] = useState("");
  const [circleData, setCircleData] = useState<any>(null);
  const { login } = useAuth();
  const router = useRouter();

  const handleFinish = async () => {
    login('community_authority');
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl bg-card border-white/10 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-3 h-[600px]">
          <div className="bg-zinc-900 p-8 border-r border-white/5 flex flex-col justify-between">
            <div>
              <button onClick={onBack} className="text-primary text-xs font-bold uppercase flex items-center gap-2 mb-8 hover:opacity-80">
                <ArrowRight className="w-4 h-4 rotate-180" /> Back
              </button>
              <h2 className="text-2xl font-black text-white uppercase tracking-tighter leading-none mb-4">Establish Intelligence Node</h2>
              <p className="text-white text-sm leading-relaxed">
                Define your geographical sector to start broadcasting localized wildlife alerts.
              </p>
            </div>
            
            <div className="space-y-4">
              <div className={cn("p-4 rounded-xl border transition-all", step === 1 ? "bg-primary/10 border-primary" : "bg-white/5 border-transparent opacity-50")}>
                <div className="text-[10px] font-black uppercase text-primary mb-1">Step 01</div>
                <div className="text-xs font-bold text-white">Network Identity</div>
              </div>
              <div className={cn("p-4 rounded-xl border transition-all", step === 2 ? "bg-primary/10 border-primary" : "bg-white/5 border-transparent opacity-50")}>
                <div className="text-[10px] font-black uppercase text-primary mb-1">Step 02</div>
                <div className="text-xs font-bold text-white">Boundary Calibration</div>
              </div>
            </div>
          </div>

          <div className="md:col-span-2 p-8 flex flex-col h-full">
            {step === 1 ? (
              <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-white/30">Sector Name</label>
                  <input 
                    value={placeName}
                    onChange={(e) => setPlaceName(e.target.value)}
                    placeholder="e.g. Attappady Northern Range"
                    className="w-full bg-white/5 border border-white/10 rounded-xl h-14 px-6 text-white focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
                <Button 
                  disabled={!placeName}
                  onClick={() => setStep(2)}
                  className="w-full h-14 bg-primary text-white font-black uppercase tracking-widest"
                >
                  Confirm Identity
                </Button>
              </div>
            ) : (
              <div className="flex-1 flex flex-col h-full">
                 <div className="mb-4">
                   <h3 className="text-sm font-bold text-white uppercase">Calibrate Operational Zone</h3>
                   <p className="text-[10px] text-white">Select your center point and define the safety radius.</p>
                 </div>
                 <div className="flex-1 bg-zinc-900 rounded-2xl overflow-hidden border border-white/5 mb-6">
                    <CommunitySignupMap onCircleSet={setCircleData} />
                 </div>
                 <Button 
                   disabled={!circleData}
                   onClick={handleFinish}
                   className="w-full h-14 bg-primary text-white font-black uppercase tracking-widest"
                 >
                   Activate Intelligence Node
                 </Button>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}

import dynamic from "next/dynamic";
const CommunitySignupMap = dynamic(() => import("@/components/map/CommunitySignupMap"), { ssr: false });

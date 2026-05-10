"use client";

import { AuthoritySidebar } from "@/components/authority/AuthoritySidebar";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Bell, Search, Command, ShieldCheck } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function AuthorityLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || user.role !== 'community_authority')) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading || !user || user.role !== 'community_authority') {
    return (
      <div className="h-screen bg-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <span className="text-[10px] font-black uppercase text-primary tracking-widest">Verifying Authority...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-black text-white">
      <AuthoritySidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Dashboard Top Header */}
        <header className="h-16 border-b border-white/5 flex items-center justify-between px-8 bg-zinc-950/50 backdrop-blur-md">
           <div className="flex items-center gap-4 flex-1 max-w-md">
              <div className="relative w-full">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                 <Input 
                   placeholder="Search intelligence database..." 
                   className="bg-white/5 border-white/5 h-9 pl-10 text-xs text-white"
                 />
                 <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-[10px] text-white/20 border border-white/5 px-1.5 py-0.5 rounded">
                    <Command className="w-2 h-2" />
                    <span>K</span>
                 </div>
              </div>
           </div>

           <div className="flex items-center gap-6">
              <div className="flex items-center gap-3 pr-6 border-r border-white/5">
                 <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                 <span className="text-[10px] font-bold uppercase tracking-widest text-white/50">GIS Engine Active</span>
              </div>
              <button className="relative p-2 text-white/50 hover:text-white transition-colors">
                 <Bell className="w-5 h-5" />
                 <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full border-2 border-black" />
              </button>
              <div className="flex items-center gap-3">
                 <div className="text-right">
                    <div className="text-xs font-bold text-white uppercase tracking-tighter">Authority Node</div>
                    <div className="text-[10px] text-primary font-black uppercase">Verified Ranger</div>
                 </div>
                 <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center border border-primary/20">
                    <ShieldCheck className="w-6 h-6 text-primary" />
                 </div>
              </div>
           </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-[radial-gradient(circle_at_50%_50%,rgba(24,24,27,1)_0%,rgba(0,0,0,1)_100%)] p-8">
           {children}
        </main>
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Map as MapIcon, 
  AlertTriangle, 
  Users, 
  FileText, 
  BarChart3, 
  Settings,
  Shield,
  ChevronRight,
  LogOut
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

const menuItems = [
  { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { name: "Manage Communities", href: "/communities/manage", icon: MapIcon },
  { name: "Alert Operations", href: "/alerts/manage", icon: AlertTriangle },
  { name: "Intelligence Reports", href: "/reports/manage", icon: FileText },
  { name: "Citizen Database", href: "/members", icon: Users },
  { name: "Risk Analytics", href: "/analytics", icon: BarChart3 },
];

export function AuthoritySidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();

  return (
    <aside className="w-64 bg-zinc-950 border-r border-white/5 flex flex-col h-full sticky top-0">
      <div className="p-6">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="p-2 bg-primary/20 rounded-lg group-hover:bg-primary/30 transition-colors">
            <Shield className="w-5 h-5 text-primary" />
          </div>
          <span className="text-lg font-bold tracking-tight text-white uppercase">
            WILD<span className="text-primary">ALERT</span>
          </span>
        </Link>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1">
        <div className="text-[10px] font-black uppercase text-white/30 tracking-[0.2em] mb-4 px-3">
          Command Center
        </div>
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center justify-between px-3 py-2.5 rounded-lg transition-all group",
                isActive 
                  ? "bg-primary/10 text-primary border border-primary/20" 
                  : "text-white hover:text-white hover:bg-white/5"
              )}
            >
              <div className="flex items-center gap-3">
                <item.icon className={cn("w-4 h-4", isActive ? "text-primary" : "text-white/30 group-hover:text-white")} />
                <span className="text-xs font-bold uppercase tracking-widest">{item.name}</span>
              </div>
              {isActive && <ChevronRight className="w-3 h-3" />}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/5">
        <div className="bg-white/5 rounded-xl p-4 mb-4">
           <div className="text-[10px] text-white/30 uppercase font-black mb-1">Active Sector</div>
           <div className="text-xs font-bold text-white">Kerala Northern Range</div>
        </div>
        <Button 
          variant="ghost" 
          onClick={logout}
          className="w-full justify-start text-red-400 hover:text-red-500 hover:bg-red-500/10 gap-3"
        >
          <LogOut className="w-4 h-4" />
          <span className="text-xs font-bold uppercase tracking-widest">Terminate Session</span>
        </Button>
      </div>
    </aside>
  );
}

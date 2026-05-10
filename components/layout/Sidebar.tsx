"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Map, 
  AlertTriangle, 
  Shield, 
  BarChart3, 
  Wind, 
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Activity
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const menuItems = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Live Map", href: "/map", icon: Map },
  { name: "Alerts Center", href: "/alerts", icon: AlertTriangle },
  { name: "Corridors", href: "/corridors", icon: Wind },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
  { name: "Rangers", href: "/rangers", icon: Shield },
  { name: "Village Monitor", href: "/villages", icon: Activity },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div 
      className={cn(
        "relative h-screen bg-card border-r border-white/5 transition-all duration-300 flex flex-col",
        isCollapsed ? "w-20" : "w-64"
      )}
    >
      {/* Sidebar Header */}
      <div className="p-6 flex items-center justify-between">
        {!isCollapsed && (
          <Link href="/" className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-primary" />
            <span className="text-lg font-bold tracking-tight text-white uppercase">
              Wild<span className="text-primary">Alert</span>
            </span>
          </Link>
        )}
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="text-muted-foreground hover:text-white"
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </Button>
      </div>

      {/* Menu Items */}
      <div className="flex-1 px-3 space-y-1 mt-4">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-3 rounded-lg transition-all group",
                isActive 
                  ? "bg-primary/20 text-primary border border-primary/20" 
                  : "text-muted-foreground hover:text-white hover:bg-white/5"
              )}
            >
              <item.icon className={cn("w-5 h-5", isActive ? "text-primary" : "group-hover:text-white")} />
              {!isCollapsed && <span className="font-medium">{item.name}</span>}
              {!isCollapsed && isActive && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary glow-green" />
              )}
            </Link>
          );
        })}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-white/5 space-y-1">
        <Link
          href="/settings"
          className="flex items-center gap-3 px-3 py-3 rounded-lg text-muted-foreground hover:text-white hover:bg-white/5"
        >
          <Settings className="w-5 h-5" />
          {!isCollapsed && <span className="font-medium">Settings</span>}
        </Link>
        <button
          className="w-full flex items-center gap-3 px-3 py-3 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/5"
        >
          <LogOut className="w-5 h-5" />
          {!isCollapsed && <span className="font-medium">Logout</span>}
        </button>
      </div>
    </div>
  );
}

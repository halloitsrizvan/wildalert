"use client";

import Link from "next/link";
import { Shield, Map, Activity, BarChart3, AlertTriangle, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";

const navItems = [
  { name: "Live Map", href: "/map", icon: Map },
  { name: "Alert Feed", href: "/alerts", icon: Activity },
  { name: "Communities", href: "/communities", icon: Shield },
];

export function PublicNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();

  const publicNavItems = [
    { name: "Live Map", href: "/map", icon: Map },
    { name: "Alert Feed", href: "/alerts", icon: Activity },
    { name: "Intelligence", href: "/#features", icon: Shield },
    ...(user?.role === 'community_authority' ? [{ name: "Command Center", href: "/dashboard", icon: BarChart3 }] : []),
  ];

  return (
    <nav className="fixed top-0 w-full z-50 border-b border-white/10 bg-black/50 backdrop-blur-xl">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="p-2 bg-primary/20 rounded-lg group-hover:bg-primary/30 transition-colors">
            <Shield className="w-6 h-6 text-primary" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">
            WILD<span className="text-primary">ALERT</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {publicNavItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-sm font-medium text-white/70 hover:text-white transition-colors flex items-center gap-2"
            >
              <item.icon className="w-4 h-4" />
              {item.name}
            </Link>
          ))}
          
          {user ? (
            <div className="flex items-center gap-4">
              <div className="flex flex-col items-end">
                <span className="text-[10px] font-black uppercase text-primary tracking-widest">{user.role.replace('_', ' ')}</span>
                <span className="text-xs font-bold text-white">ID: {user.id.slice(0, 5)}</span>
              </div>
              <Button size="sm" variant="outline" onClick={logout} className="border-white/10 hover:bg-white/5 text-white">
                Logout
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Button nativeButton={false} variant="outline" render={<Link href="/login" />} className="border-primary/50 hover:bg-primary/10 text-primary">
                Network Entry
              </Button>
              <Button nativeButton={false} render={<Link href="/login" />} className="bg-primary hover:bg-primary/90 text-white glow-green">
                Join System
              </Button>
            </div>
          )}
        </div>

        {/* Mobile Nav */}
        <div className="md:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger render={<Button variant="ghost" size="icon" />}>
              <Menu className="w-6 h-6" />
            </SheetTrigger>
            <SheetContent side="right" className="bg-black/95 border-white/10 text-white">
              <div className="flex flex-col gap-6 mt-12">
                {publicNavItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className="text-lg font-medium flex items-center gap-3 text-white/80 hover:text-white"
                  >
                    <item.icon className="w-5 h-5" />
                    {item.name}
                  </Link>
                ))}
                <div className="flex flex-col gap-3 pt-6 border-t border-white/10">
                  <Button nativeButton={false} variant="outline" render={<Link href="/login" />} onClick={() => setIsOpen(false)} className="w-full border-primary/50 text-primary">
                    Admin Login
                  </Button>
                  <Button nativeButton={false} render={<Link href="/report" />} onClick={() => setIsOpen(false)} className="w-full bg-primary hover:bg-primary/90 text-white">
                    Report Sighting
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}

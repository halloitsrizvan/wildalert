"use client";


import { PublicNavbar } from "@/components/public/PublicNavbar";
import { Shield, Mail, Phone, MapPin, Globe, MessageSquare, Send } from "lucide-react";
import Link from "next/link";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen bg-black">
      <PublicNavbar />
      <main className="flex-1 pt-16">
        {children}
      </main>
      
      {/* Immersive Footer */}
      <footer className="bg-zinc-950 border-t border-white/5 py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="space-y-6">
              <Link href="/" className="flex items-center gap-2 group">
                <div className="p-2 bg-primary/20 rounded-lg">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <span className="text-xl font-bold tracking-tight text-white uppercase">
                  WILD<span className="text-primary">ALERT</span>
                </span>
              </Link>
              <p className="text-sm text-white/50 leading-relaxed">
                Kerala's first decentralized wildlife emergency intelligence network. Empowering communities through real-time GIS technology.
              </p>
              <div className="flex gap-4">
                {[Send, MessageSquare, Globe].map((Icon, i) => (
                  <Link key={i} href="#" className="p-2 rounded-full bg-white/5 text-white/50 hover:text-primary hover:bg-primary/10 transition-all">
                    <Icon className="w-4 h-4" />
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-widest mb-6">Intelligence Nodes</h4>
              <ul className="space-y-3">
                {["Live Wildlife Map", "Active Alert Feed", "Corridor Analytics", "Ranger Response"].map((item, i) => (
                  <li key={i}>
                    <Link href="#" className="text-sm text-white/40 hover:text-white transition-colors">{item}</Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-widest mb-6">Resources</h4>
              <ul className="space-y-3">
                {["Safety Protocols", "Community Guidelines", "API Documentation", "System Status"].map((item, i) => (
                  <li key={i}>
                    <Link href="#" className="text-sm text-white/40 hover:text-white transition-colors">{item}</Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-6">
              <h4 className="text-sm font-bold text-white uppercase tracking-widest mb-6">Command Center</h4>
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-sm text-white/40">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span>Attappady Range, Palakkad</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-white/40">
                  <Phone className="w-4 h-4 text-primary" />
                  <span>+91 1800 425 4733</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-white/40">
                  <Mail className="w-4 h-4 text-primary" />
                  <span>emergency@wildalert.gov.in</span>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-16 pt-8 border-t border-white/5 text-center">
            <p className="text-[10px] text-white/20 uppercase font-bold tracking-widest">
              © 2024 Wild Alert Network • Intelligence for an Ecological Future
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

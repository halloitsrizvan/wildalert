import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Shield, Map, Zap, Activity, ChevronRight, AlertTriangle } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function LandingPage() {
  return (
    <main className="relative min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/hero-bg.png"
            alt="Kerala Forest"
            fill
            className="object-cover opacity-60"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black" />
        </div>

        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 border border-primary/30 text-primary text-xs font-bold uppercase tracking-widest mb-6 animate-pulse">
            <Activity className="w-3 h-3" />
            Live Intelligence Active
          </div>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-6 tracking-tight leading-[0.9]">
            WILDLIFE <span className="text-primary">INTELLIGENCE</span> <br />
            & MONITORING
          </h1>
          <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-10 leading-relaxed">
            Advanced GIS platform for Kerala forest-border communities. 
            Tracking corridors, predicting risks, and protecting lives through real-time data.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button nativeButton={false} size="lg" render={<Link href="/map" />} className="h-14 px-8 text-lg bg-primary hover:bg-primary/90 text-white glow-green">
              Enter Command Center
              <ChevronRight className="ml-2 w-5 h-5" />
            </Button>
            <Button nativeButton={false} size="lg" variant="outline" render={<Link href="/report" />} className="h-14 px-8 text-lg border-white/20 hover:bg-white/5 text-white backdrop-blur-sm">
              <AlertTriangle className="mr-2 w-5 h-5 text-amber-500" />
              Emergency Report
            </Button>
          </div>
        </div>

        {/* Floating Stats */}
        <div className="absolute bottom-10 left-0 w-full z-10">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Active Corridors", value: "12", icon: Map },
                { label: "Ranger Units", value: "48", icon: Shield },
                { label: "Daily Sightings", value: "156", icon: Activity },
                { label: "Safety Rating", value: "94%", icon: Zap },
              ].map((stat, i) => (
                <div key={i} className="glass-dark p-4 rounded-xl border-white/5">
                  <div className="flex items-center gap-3 mb-1">
                    <stat.icon className="w-4 h-4 text-primary" />
                    <span className="text-xs text-muted-foreground uppercase tracking-wider">{stat.label}</span>
                  </div>
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-black">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Precision Monitoring</h2>
            <p className="text-white/70">Cutting-edge technology for human-wildlife coexistence.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Real-time GIS Tracking",
                description: "Live interactive maps with animal movement patterns and corridor visualization.",
                icon: Map,
              },
              {
                title: "Emergency Alert System",
                description: "Instant village-wide notifications via SMS and app alerts during intrusions.",
                icon: AlertTriangle,
              },
              {
                title: "Predictive Analytics",
                description: "AI-driven risk assessment based on seasonal migration and environmental data.",
                icon: Activity,
              },
            ].map((feature, i) => (
              <div key={i} className="group p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-primary/50 transition-all duration-300">
                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-white/80 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-12 border-t border-white/10 bg-black">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Shield className="w-6 h-6 text-primary" />
            <span className="text-xl font-bold tracking-tight text-white uppercase">
              Wild Alert
            </span>
          </div>
          <p className="text-sm text-white/70 mb-8 max-w-md mx-auto">
            A specialized intelligence platform dedicated to the preservation of Kerala's wildlife and the safety of its forest communities.
          </p>
          <div className="text-xs text-muted-foreground/50">
            © 2026 Wild Alert Platform. Kerala Forest Intelligence Division.
          </div>
        </div>
      </footer>
    </main>
  );
}

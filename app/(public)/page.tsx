import { Button } from "@/components/ui/button";
import { Shield, Map, Zap, Activity, ChevronRight, AlertTriangle } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

export default function LandingPage() {
  return (
    <main className="relative min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden -mt-16">
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
      <section className="py-24 bg-black relative">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10 pointer-events-none" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Precision Monitoring</h2>
            <p className="text-white/70 max-w-xl mx-auto">Cutting-edge technology for human-wildlife coexistence in the Western Ghats.</p>
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
              <div key={i} className="group p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-primary/50 transition-all duration-300 backdrop-blur-sm">
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

      {/* How It Works */}
      <section className="py-24 bg-zinc-950 border-y border-white/5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-white mb-4 uppercase tracking-tighter">Mission Protocol</h2>
            <p className="text-white/50">Our streamlined approach to human-wildlife conflict resolution.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            {/* Connector Line (Desktop) */}
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent -translate-y-1/2" />
            
            {[
              { 
                step: "01", 
                title: "Report Sighting", 
                desc: "Villagers or sensors detect wildlife and submit intelligence via the mobile-first dashboard.",
                icon: AlertTriangle 
              },
              { 
                step: "02", 
                title: "Analyze Risk", 
                desc: "AI models and forest rangers verify the sighting and predict movement patterns.",
                icon: Activity 
              },
              { 
                step: "03", 
                title: "Alert Community", 
                desc: "Instant notifications are broadcasted to high-risk zones and ranger units are deployed.",
                icon: Shield 
              },
            ].map((item, i) => (
              <div key={i} className="relative z-10 text-center space-y-6 group">
                <div className="w-20 h-20 rounded-full bg-black border-2 border-primary/20 flex items-center justify-center mx-auto group-hover:border-primary transition-all duration-500 shadow-[0_0_20px_rgba(34,197,94,0.1)]">
                  <span className="text-2xl font-black text-primary">{item.step}</span>
                </div>
                <h3 className="text-xl font-bold text-white uppercase tracking-tighter">{item.title}</h3>
                <p className="text-sm text-white/50 leading-relaxed px-4">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Corridor Preview & Alert Feed */}
      <section className="py-24 bg-zinc-950">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Alert Preview */}
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Live Alert Feed</h2>
                <p className="text-white/60">Real-time intelligence from the forest floor.</p>
              </div>
              
              <div className="space-y-4">
                {[
                  { animal: "Elephant Herd", location: "Attappady Sector 4", time: "2 mins ago", severity: "critical" },
                  { animal: "Leopard Spotted", location: "Munnar North Corridor", time: "15 mins ago", severity: "high" },
                  { animal: "Wild Boar Entry", location: "Wayanad Border Village", time: "1 hour ago", severity: "medium" },
                ].map((alert, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:border-primary/30 transition-all group">
                    <div className={cn(
                      "w-12 h-12 rounded-full flex items-center justify-center animate-pulse",
                      alert.severity === 'critical' ? "bg-red-500/20 text-red-500" : "bg-amber-500/20 text-amber-500"
                    )}>
                      <AlertTriangle className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-white font-bold">{alert.animal}</h4>
                        <span className="text-[10px] text-muted-foreground uppercase">{alert.time}</span>
                      </div>
                      <p className="text-xs text-white/50">{alert.location}</p>
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <ChevronRight className="w-5 h-5 text-primary" />
                    </div>
                  </div>
                ))}
              </div>
              
              <Link href="/alerts">
                <Button variant="link" className="text-primary p-0 h-auto font-bold uppercase tracking-widest text-xs">
                  View full intelligence feed →
                </Button>
              </Link>
            </div>

            {/* Corridor Preview Visualization */}
            <div className="relative aspect-square rounded-3xl overflow-hidden border border-white/10 bg-black/40 group">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-transparent to-transparent opacity-50" />
              <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center">
                <div className="w-full h-full relative border-2 border-dashed border-primary/20 rounded-2xl flex items-center justify-center overflow-hidden">
                  {/* Decorative Map Elements */}
                  <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
                  <div className="z-10">
                    <Map className="w-24 h-24 text-primary/40 mb-4 mx-auto" />
                    <h3 className="text-xl font-bold text-white mb-2 uppercase tracking-tighter">Kerala Corridor Index</h3>
                    <p className="text-sm text-white/50 mb-6">Monitoring 42 active elephant corridors</p>
                    <Link href="/map">
                      <Button size="sm" className="bg-primary text-white">Explore Map</Button>
                    </Link>
                  </div>
                  
                  {/* Glowing Points */}
                  <div className="absolute top-1/4 left-1/3 w-2 h-2 bg-primary rounded-full animate-ping" />
                  <div className="absolute bottom-1/3 right-1/4 w-2 h-2 bg-red-500 rounded-full animate-ping" />
                  <div className="absolute top-1/2 right-1/2 w-2 h-2 bg-amber-500 rounded-full animate-ping shadow-[0_0_10px_orange]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Storytelling Section */}
      <section className="py-24 bg-black overflow-hidden relative">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-16 items-center">
            <div className="md:w-1/2">
              <div className="relative">
                <div className="absolute -left-4 -top-4 w-24 h-24 border-t-2 border-l-2 border-primary/50" />
                <h2 className="text-4xl md:text-6xl font-black text-white leading-tight mb-8">
                  THE SILENT <br />
                  <span className="text-primary italic">FRONTIER</span>
                </h2>
              </div>
              <p className="text-lg text-white/70 leading-relaxed mb-8">
                Every year, hundreds of lives are impacted by human-wildlife conflict in the border villages of Kerala. Our mission is to bridge the gap between forest intelligence and community safety using real-time GIS technology.
              </p>
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <div className="text-3xl font-bold text-primary mb-1">100%</div>
                  <div className="text-xs text-white/40 uppercase font-bold tracking-widest">Village Coverage</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary mb-1">5s</div>
                  <div className="text-xs text-white/40 uppercase font-bold tracking-widest">Alert Latency</div>
                </div>
              </div>
            </div>
            <div className="md:w-1/2 relative">
               <div className="aspect-video bg-zinc-900 rounded-2xl overflow-hidden border border-white/10 relative shadow-2xl">
                 <Image 
                   src="https://images.unsplash.com/photo-1589123053646-4e8c3397982e?q=80&w=2070&auto=format&fit=crop" 
                   alt="Wildlife Story"
                   fill
                   className="object-cover grayscale hover:grayscale-0 transition-all duration-700 opacity-50"
                 />
                 <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                 <div className="absolute bottom-6 left-6 right-6">
                   <div className="flex items-center gap-3">
                     <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                       <Shield className="w-5 h-5 text-primary" />
                     </div>
                     <span className="text-white font-bold text-sm">Kerala Forest Intelligence</span>
                   </div>
                 </div>
               </div>
               <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
            </div>
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

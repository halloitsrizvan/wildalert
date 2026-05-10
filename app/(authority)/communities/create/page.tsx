"use client";

import { useState } from "react";
import { PublicNavbar } from "@/components/public/PublicNavbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Shield, Map as MapIcon, ChevronLeft, Save, AlertTriangle } from "lucide-react";
import Link from "next/link";
import CommunityDrawMap from "@/components/map/CommunityDrawMap";
import { createCommunity } from "@/lib/communities";
import { useRouter } from "next/navigation";

export default function CreateCommunityPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    district: "",
    description: "",
    riskLevel: "medium" as const,
  });
  const [polygon, setPolygon] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!polygon) {
      alert("Please draw the community boundary on the map.");
      return;
    }

    setIsSubmitting(true);
    try {
      await createCommunity({
        ...formData,
        polygonCoordinates: polygon,
        createdBy: "admin-1", // Mock current user
        admins: ["admin-1"],
        villages: [],
        notificationSettings: {
          sms: true,
          push: true,
          emergencyOnly: false,
        }
      });
      alert("Community network established successfully.");
      router.push("/communities");
    } catch (error) {
      console.error(error);
      alert("Failed to create community network.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
          <Link href="/communities">
            <Button variant="ghost" size="icon" className="text-white hover:text-white">
              <ChevronLeft className="w-6 h-6" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-black tracking-tighter uppercase">Initialize Community Network</h1>
            <p className="text-white text-sm font-medium">Define geo-fenced boundaries for localized wildlife intelligence.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <Card className="bg-card border-white/5">
              <CardHeader>
                <CardTitle className="text-sm font-bold uppercase tracking-widest flex items-center gap-2">
                  <Shield className="w-4 h-4 text-primary" />
                  Network Identity
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold text-white">Community Name</label>
                  <Input 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="e.g. Attappady Forest Range" 
                    className="bg-white/5 border-white/5 text-white"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold text-white">District</label>
                  <Select onValueChange={(v: string | null) => v && setFormData({...formData, district: v})} required>
                    <SelectTrigger className="bg-white/5 border-white/5 text-white">
                      <SelectValue placeholder="Select district" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-white/10 text-white">
                      <SelectItem value="palakkad">Palakkad</SelectItem>
                      <SelectItem value="wayanad">Wayanad</SelectItem>
                      <SelectItem value="idukki">Idukki</SelectItem>
                      <SelectItem value="thrissur">Thrissur</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold text-white">Risk Assessment</label>
                  <Select onValueChange={(v: string | null) => v && setFormData({...formData, riskLevel: v as any})} defaultValue={formData.riskLevel}>
                    <SelectTrigger className="bg-white/5 border-white/5 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-white/10 text-white">
                      <SelectItem value="low">Low Risk</SelectItem>
                      <SelectItem value="medium">Medium Risk</SelectItem>
                      <SelectItem value="high">High Risk</SelectItem>
                      <SelectItem value="critical">Critical Zone</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold text-white">Intelligence Description</label>
                  <Textarea 
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Describe the ecological terrain and primary wildlife patterns..." 
                    className="bg-white/5 border-white/5 text-white min-h-[100px]"
                    required
                  />
                </div>
              </CardContent>
            </Card>

            <Button 
              type="submit" 
              className="w-full h-14 bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-widest glow-green"
              disabled={isSubmitting}
            >
              <Save className="mr-2 w-5 h-5" />
              {isSubmitting ? "Establishing..." : "Establish Network"}
            </Button>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-card border-white/5 overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-sm font-bold uppercase tracking-widest flex items-center gap-2">
                    <MapIcon className="w-4 h-4 text-primary" />
                    Boundary Mapping
                  </CardTitle>
                  <CardDescription className="text-[10px]">Draw the polygon to define the geo-fenced operations area.</CardDescription>
                </div>
                {polygon && (
                  <Badge className="bg-primary/20 text-primary border-primary/20">Boundary Defined</Badge>
                )}
              </CardHeader>
              <CardContent className="p-0">
                <CommunityDrawMap onPolygonCreated={setPolygon} />
              </CardContent>
            </Card>

            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-4">
              <AlertTriangle className="w-6 h-6 text-amber-500 shrink-0" />
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-amber-500 uppercase tracking-widest">Geo-Fence Notice</h4>
                <p className="text-[10px] text-amber-500/70 leading-relaxed">
                  The defined boundary will determine which citizens receive automated emergency alerts. Ensure the polygon accurately covers the inhabited buffer zones and wildlife corridors.
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
  );
}

function Badge({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest border ${className}`}>
      {children}
    </span>
  );
}

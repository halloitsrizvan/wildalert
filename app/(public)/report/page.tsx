"use client";

import { useState, useEffect, useRef } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AlertTriangle, MapPin, Camera, Shield, Mic, Square, Trash2, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { db, storage } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const ReportLocationMap = dynamic(() => import("../../../components/map/ReportLocationMap"), { ssr: false });

const reportSchema = z.object({
  animalType: z.string().min(2, "Animal type is required"),
  locationName: z.string().min(5, "Location description is required"),
  severity: z.string(),
  description: z.string().max(500).optional(),
});

export default function ReportPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  // State for location coordinates
  const [coords, setCoords] = useState<[number, number] | null>(null);

  // Voice Recording States
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const form = useForm<z.infer<typeof reportSchema>>({
    resolver: zodResolver(reportSchema),
    defaultValues: {
      animalType: "",
      locationName: "",
      severity: "medium",
      description: "",
    },
  });

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      const chunks: BlobPart[] = [];
      mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/ogg; codecs=opus' });
        setAudioBlob(blob);
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingDuration(0);
      timerRef.current = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);
    } catch (err) {
      console.error("Failed to start recording:", err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const deleteRecording = () => {
    setAudioBlob(null);
    setRecordingDuration(0);
  };

  async function onSubmit(values: z.infer<typeof reportSchema>) {
    if (!coords) {
      alert("Please pinpoint the detection zone on the map.");
      return;
    }

    try {
      const reportData = {
        ...values,
        location: {
          lat: coords[0],
          lng: coords[1],
          name: values.locationName
        },
        communityId: user?.communityId || null,
        reportedBy: user?.uid,
        reportedByName: user?.name,
        status: 'pending',
        timestamp: serverTimestamp(),
        hasAudio: !!audioBlob
      };

      await addDoc(collection(db, "reports"), reportData);
      
      const targetPath = user?.role === 'community_authority' ? '/dashboard' : '/';
      router.push(targetPath);
      
      alert("Intelligence submitted successfully. Command units notified.");
    } catch (err) {
      console.error("Submission failed:", err);
      alert("Failed to submit intelligence. Please check connection.");
    }
  }

  if (authLoading || !user) return <div className="h-screen bg-black flex flex-col items-center justify-center text-primary uppercase font-black tracking-[0.4em] animate-pulse">
    <Shield className="w-12 h-12 mb-4" />
    Syncing Intelligence...
  </div>;

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <div className="flex-1 container mx-auto px-4 py-12 flex items-center justify-center">
        <Card className="w-full max-w-4xl bg-zinc-950 border border-white/5 overflow-hidden shadow-2xl relative">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary via-amber-500 to-red-500" />

          <CardHeader className="space-y-4 p-10 bg-white/5">
            <div className="flex items-center gap-6">
              <div className="p-4 bg-primary/20 rounded-2xl border border-primary/20 shadow-[0_0_20px_rgba(34,197,94,0.2)]">
                <AlertTriangle className="w-10 h-10 text-primary" />
              </div>
              <div>
                <CardTitle className="text-4xl font-black text-white tracking-tighter uppercase">Intelligence Submission</CardTitle>
                <CardDescription className="text-white/60 font-black uppercase tracking-[0.2em] text-[10px] mt-1">
                  Direct Line: Kerala Forest Operational Command
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-10 pt-12">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-12">
                {/* Animal Selector */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between px-1">
                    <FormLabel className="text-[10px] font-black uppercase text-white tracking-widest">Identify Target Species</FormLabel>
                    <Shield className="w-3 h-3 text-primary" />
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { id: 'elephant', label: 'Elephant', icon: '🐘' },
                      { id: 'tiger', label: 'Tiger/Leopard', icon: '🐅' },
                      { id: 'boar', label: 'Wild Boar', icon: '🐗' },
                      { id: 'bear', label: 'Sloth Bear', icon: '🐻' },
                    ].map((animal) => (
                      <button
                        key={animal.id}
                        type="button"
                        onClick={() => form.setValue('animalType', animal.id)}
                        className={cn(
                          "flex flex-col items-center justify-center p-8 rounded-3xl border-2 transition-all group relative",
                          form.watch('animalType') === animal.id
                            ? "bg-primary border-primary text-white shadow-[0_10px_30px_rgba(34,197,94,0.4)]"
                            : "bg-black border-white/10 text-white hover:border-white/30"
                        )}
                      >
                        <span className="text-4xl mb-4 group-hover:scale-110 transition-transform">{animal.icon}</span>
                        <span className="text-[10px] font-black uppercase tracking-tight">{animal.label}</span>
                        {form.watch('animalType') === animal.id && (
                          <div className="absolute top-3 right-3 bg-white text-primary rounded-full p-0.5">
                            <CheckCircle2 className="w-4 h-4" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                  {/* GIS Detection Zone */}
                  <div className="space-y-6">
                    <div className="flex justify-between items-end px-1">
                      <label className="text-[10px] font-black uppercase text-white tracking-widest">Detection Zone (GIS)</label>
                      <MapPin className="w-3 h-3 text-primary" />
                    </div>
                    <div className="h-72 bg-black rounded-3xl overflow-hidden border border-white/10 shadow-inner group">
                      <ReportLocationMap onLocationSet={setCoords} />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase text-white tracking-widest">Local Landmark / Name</label>
                      <input
                        {...form.register("locationName")}
                        className="w-full bg-black border border-white/10 rounded-xl h-16 px-8 text-white placeholder:text-white/10 focus:outline-none focus:border-primary transition-all font-bold"
                        placeholder="e.g. Near West Gate, Riverbed Area"
                      />
                    </div>
                  </div>

                  <div className="space-y-8">
                    {/* Risk Level */}
                    <div className="space-y-4">
                      <label className="text-[10px] font-black uppercase text-white tracking-widest block">Risk Assessment</label>
                      <div className="grid grid-cols-2 gap-4">
                        {[
                          { id: 'low', label: 'Routine', color: 'bg-green-500' },
                          { id: 'medium', label: 'Watch', color: 'bg-blue-500' },
                          { id: 'high', label: 'Threat', color: 'bg-amber-500' },
                          { id: 'critical', label: 'Combat', color: 'bg-red-500' },
                        ].map((level) => (
                          <button
                            key={level.id}
                            type="button"
                            onClick={() => form.setValue('severity', level.id)}
                            className={cn(
                              "flex items-center gap-4 p-5 rounded-2xl border transition-all relative overflow-hidden",
                              form.watch('severity') === level.id
                                ? "bg-white/10 border-white/20"
                                : "bg-black border-white/5 opacity-40 hover:opacity-100"
                            )}
                          >
                            <div className={cn("w-2 h-2 rounded-full", level.color)} />
                            <span className="text-[10px] font-black text-white uppercase tracking-widest">{level.label}</span>
                            {form.watch('severity') === level.id && <div className="absolute right-0 top-0 bottom-0 w-1 bg-white" />}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Sit-Rep */}
                    <div className="space-y-4">
                      <label className="text-[10px] font-black uppercase text-white tracking-widest block">Situation Intelligence</label>
                      <Textarea
                        {...form.register("description")}
                        placeholder="Herd size, heading, observed behavior..."
                        className="bg-black border-white/10 min-h-[140px] text-white resize-none p-6 rounded-3xl focus:border-primary transition-all font-medium"
                      />
                    </div>
                  </div>
                </div>

                {/* Intelligence Media & Audio */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-white/5">
                  {/* Optional Media */}
                  <div className="p-8 rounded-3xl border-2 border-dashed border-white/10 bg-black flex flex-col items-center justify-center gap-4 cursor-pointer hover:bg-white/5 transition-all group">
                    <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <Camera className="w-10 h-10 text-white group-hover:text-primary transition-colors" />
                    </div>
                    <div className="text-center">
                      <span className="block text-white font-black uppercase text-xs tracking-widest mb-1">Visual Intel (Optional)</span>
                      <span className="text-[9px] text-white/30 uppercase font-black tracking-widest">Image / Video Upload</span>
                    </div>
                  </div>

                  {/* Audio Intel */}
                  <div className={cn(
                    "p-8 rounded-3xl border border-white/10 transition-all flex flex-col items-center justify-center gap-4",
                    isRecording ? "bg-red-500/10 border-red-500/30" : "bg-black"
                  )}>
                    {!audioBlob ? (
                      <>
                        <button
                          type="button"
                          onClick={isRecording ? stopRecording : startRecording}
                          className={cn(
                            "w-20 h-20 rounded-full flex items-center justify-center transition-all animate-in zoom-in duration-300 shadow-xl",
                            isRecording ? "bg-red-500 scale-110 shadow-red-500/40" : "bg-primary shadow-primary/40"
                          )}
                        >
                          {isRecording ? <Square className="w-8 h-8 text-white" /> : <Mic className="w-8 h-8 text-white" />}
                        </button>
                        <div className="text-center">
                          <span className="block text-white font-black uppercase text-xs tracking-widest mb-1">
                            {isRecording ? `Recording... ${recordingDuration}s` : "Audio Intel"}
                          </span>
                          <span className="text-[9px] text-white/30 uppercase font-black tracking-widest">Voice Note Evidence</span>
                        </div>
                      </>
                    ) : (
                      <div className="w-full flex items-center gap-4 p-4 bg-white/5 rounded-2xl">
                        <div className="p-3 bg-primary/20 rounded-full">
                          <Mic className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <span className="text-[10px] font-black text-white uppercase tracking-widest">Audio Intelligence Captured</span>
                        </div>
                        <button onClick={deleteRecording} className="p-3 text-red-500 hover:bg-red-500/10 rounded-xl transition-colors">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-4">
                  <Button type="submit" className="w-full h-24 bg-primary hover:bg-primary/90 text-white text-2xl font-black uppercase tracking-widest glow-green shadow-[0_10px_40px_rgba(34,197,94,0.4)] rounded-3xl">
                    <Shield className="mr-4 w-8 h-8" />
                    SUBMIT TO COMMAND
                  </Button>
                  <p className="mt-6 text-[10px] text-white/20 text-center uppercase font-black tracking-[0.4em]">
                    Active Transmission &bull; SECURE LINE &bull; 2026
                  </p>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

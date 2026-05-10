"use client";

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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AlertTriangle, MapPin, Camera, Shield } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { cn } from "@/lib/utils";

const reportSchema = z.object({
  animalType: z.string().min(2, "Animal type is required"),
  location: z.string().min(5, "Precise location is required"),
  severity: z.string(),
  description: z.string().max(500),
  contact: z.string().optional(),
});

export default function ReportPage() {
  const form = useForm<z.infer<typeof reportSchema>>({
    resolver: zodResolver(reportSchema),
    defaultValues: {
      animalType: "",
      location: "",
      severity: "medium",
      description: "",
      contact: "",
    },
  });

  function onSubmit(values: z.infer<typeof reportSchema>) {
    console.log(values);
    alert("Report submitted successfully to the Command Center.");
  }

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <Navbar />
      
      <div className="flex-1 container mx-auto px-4 py-24 flex items-center justify-center">
        <Card className="w-full max-w-3xl bg-card border-white/5 overflow-hidden shadow-2xl relative">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary via-amber-500 to-red-500" />
          
          <CardHeader className="space-y-2 p-8">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-2xl border border-primary/20">
                <AlertTriangle className="w-8 h-8 text-primary" />
              </div>
              <div>
                <CardTitle className="text-3xl font-black text-white tracking-tighter uppercase">Intelligence Submission</CardTitle>
                <CardDescription className="text-white/50 font-medium">
                  Direct intelligence line to Kerala Forest Authorities. Immediate response active.
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-8 pt-0">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                {/* Animal Selector Grid */}
                <div className="space-y-4">
                  <FormLabel className="text-white font-bold uppercase tracking-widest text-xs">Target Species</FormLabel>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { id: 'elephant', label: 'Elephant', icon: '🐘' },
                      { id: 'tiger', label: 'Tiger/Leopard', icon: '🐅' },
                      { id: 'boar', label: 'Wild Boar', icon: '🐗' },
                      { id: 'other', label: 'Other', icon: '❓' },
                    ].map((animal) => (
                      <button
                        key={animal.id}
                        type="button"
                        onClick={() => form.setValue('animalType', animal.id)}
                        className={cn(
                          "flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all group",
                          form.watch('animalType') === animal.id 
                            ? "bg-primary/20 border-primary text-white shadow-[0_0_20px_rgba(34,197,94,0.2)]" 
                            : "bg-white/5 border-white/5 text-white/40 hover:border-white/20 hover:text-white"
                        )}
                      >
                        <span className="text-4xl mb-3 group-hover:scale-110 transition-transform">{animal.icon}</span>
                        <span className="text-xs font-bold uppercase tracking-tight">{animal.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Location System */}
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white font-bold uppercase tracking-widest text-xs">Detection Zone</FormLabel>
                          <FormControl>
                            <div className="space-y-3">
                              <div className="relative">
                                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary" />
                                <Input placeholder="Pinpoint location or landmark..." {...field} className="bg-white/5 border-white/10 h-14 pl-12 text-white text-lg font-medium" />
                              </div>
                              <div className="aspect-video bg-zinc-900 rounded-2xl border border-white/5 flex flex-col items-center justify-center gap-3 relative overflow-hidden group cursor-crosshair">
                                 <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] opacity-20" />
                                 <MapPin className="w-8 h-8 text-primary/40 group-hover:scale-110 transition-transform" />
                                 <span className="text-[10px] text-white/30 uppercase font-bold">Interactive Map Preview</span>
                                 <div className="absolute bottom-3 left-3 bg-black/60 px-2 py-1 rounded text-[8px] text-white/50 font-mono border border-white/10">GPS READY: 10.5276, 76.2144</div>
                              </div>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="space-y-8">
                    {/* Severity Selector */}
                    <FormField
                      control={form.control}
                      name="severity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white font-bold uppercase tracking-widest text-xs">Risk Assessment</FormLabel>
                          <div className="grid grid-cols-2 gap-3">
                            {[
                              { id: 'low', label: 'Low', color: 'bg-green-500' },
                              { id: 'medium', label: 'Medium', color: 'bg-blue-500' },
                              { id: 'high', label: 'High', color: 'bg-amber-500' },
                              { id: 'critical', label: 'Critical', color: 'bg-red-500' },
                            ].map((level) => (
                              <button
                                key={level.id}
                                type="button"
                                onClick={() => field.onChange(level.id)}
                                className={cn(
                                  "flex items-center gap-3 p-3 rounded-xl border transition-all",
                                  field.value === level.id 
                                    ? "bg-white/10 border-white/20 ring-1 ring-white/20" 
                                    : "bg-white/2 border-white/5 opacity-50 hover:opacity-100"
                                )}
                              >
                                <div className={cn("w-3 h-3 rounded-full", level.color)} />
                                <span className="text-xs font-bold text-white uppercase tracking-widest">{level.label}</span>
                              </button>
                            ))}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Description */}
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white font-bold uppercase tracking-widest text-xs">Situation Intelligence</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Animal count, behavior, direction..." 
                              className="bg-white/5 border-white/10 min-h-[140px] text-white resize-none p-4" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Media Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="p-8 rounded-3xl border-2 border-dashed border-white/5 bg-white/2 flex flex-col items-center justify-center gap-4 cursor-pointer hover:bg-white/5 transition-all group">
                    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <Camera className="w-8 h-8 text-white/40 group-hover:text-primary transition-colors" />
                    </div>
                    <div className="text-center">
                      <span className="block text-white font-bold">Attach Intelligence Media</span>
                      <span className="text-[10px] text-white/30 uppercase font-bold tracking-widest">Photos / Video / Audio</span>
                    </div>
                  </div>

                  <div className="flex flex-col justify-end gap-4">
                    <Button type="submit" className="h-16 bg-primary hover:bg-primary/90 text-white text-xl font-black uppercase tracking-tighter glow-green">
                      <Shield className="mr-3 w-6 h-6" />
                      SUBMIT TO COMMAND
                    </Button>
                    <p className="text-[10px] text-white/30 text-center uppercase font-bold">
                      By submitting, you verify that this report is accurate to the best of your knowledge.
                    </p>
                  </div>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

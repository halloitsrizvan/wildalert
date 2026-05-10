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
        <Card className="w-full max-w-2xl bg-card border-white/5 overflow-hidden">
          <div className="h-2 bg-primary w-full glow-green" />
          <CardHeader className="space-y-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-primary/10 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-primary" />
              </div>
              <CardTitle className="text-2xl font-bold text-white">Emergency Wildlife Report</CardTitle>
            </div>
            <CardDescription className="text-muted-foreground">
              Direct intelligence line to Kerala Forest Authorities. Please provide accurate details.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="animalType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Animal Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-white/5 border-white/10 text-white">
                              <SelectValue placeholder="Select animal" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-card border-white/10 text-white">
                            <SelectItem value="elephant">Elephant</SelectItem>
                            <SelectItem value="tiger">Tiger</SelectItem>
                            <SelectItem value="leopard">Leopard</SelectItem>
                            <SelectItem value="wild_boar">Wild Boar</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="severity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Severity Level</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-white/5 border-white/10 text-white">
                              <SelectValue placeholder="Select severity" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-card border-white/10 text-white">
                            <SelectItem value="low">Low (Far from village)</SelectItem>
                            <SelectItem value="medium">Medium (Near corridors)</SelectItem>
                            <SelectItem value="high">High (In village outskirts)</SelectItem>
                            <SelectItem value="critical">Critical (Immediate danger)</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Exact Location / Landmark</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                          <Input placeholder="e.g. Near Attappady Sector 4 bridge" {...field} className="bg-white/5 border-white/10 pl-10 text-white" />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Situation Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe the animal behavior, number of animals, and current direction of movement..." 
                          className="bg-white/5 border-white/10 min-h-[120px] text-white" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="p-4 rounded-xl border border-dashed border-white/10 bg-white/5 flex flex-col items-center justify-center gap-3 cursor-pointer hover:bg-white/10 transition-colors">
                  <Camera className="w-8 h-8 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground text-center">
                    Upload visual evidence (Photos/Video) <br />
                    <span className="text-xs">Max file size 20MB</span>
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Button type="submit" className="flex-1 bg-primary hover:bg-primary/90 text-white h-12 text-lg glow-green">
                    <Shield className="mr-2 w-5 h-5" />
                    Submit Intelligence Report
                  </Button>
                  <Button type="button" variant="outline" className="border-white/10 text-white hover:bg-white/5 h-12">
                    Cancel
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

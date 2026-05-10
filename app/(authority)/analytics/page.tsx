"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  AreaChart, 
  Area,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { BarChart3, TrendingUp, Activity, Map as MapIcon } from "lucide-react";

const sightingData = [
  { name: "Jan", elephants: 45, tigers: 12, leopards: 18 },
  { name: "Feb", elephants: 52, tigers: 15, leopards: 22 },
  { name: "Mar", elephants: 61, tigers: 10, leopards: 25 },
  { name: "Apr", elephants: 78, tigers: 18, leopards: 30 },
  { name: "May", elephants: 92, tigers: 22, leopards: 35 },
  { name: "Jun", elephants: 85, tigers: 25, leopards: 28 },
];

const animalDistribution = [
  { name: "Elephants", value: 450, color: "hsl(150, 80%, 35%)" },
  { name: "Tigers", value: 120, color: "hsl(45, 90%, 50%)" },
  { name: "Leopards", value: 200, color: "hsl(170, 60%, 45%)" },
  { name: "Bison", value: 300, color: "hsl(190, 80%, 50%)" },
];

export default function AnalyticsPage() {
  return (
    <div className="space-y-8 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
            <BarChart3 className="w-8 h-8 text-primary" />
            Wildlife Intelligence Analytics
          </h1>
          <p className="text-white">Statistical patterns and predictive modeling for wildlife movement.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Sightings Trend */}
        <Card className="bg-card border-white/5">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Monthly Sighting Trends
            </CardTitle>
            <CardDescription className="text-white">Analysis of wildlife sightings across primary forest sectors.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sightingData}>
                <defs>
                  <linearGradient id="colorEle" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(150, 80%, 35%)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(150, 80%, 35%)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  stroke="#666" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false} 
                />
                <YAxis 
                  stroke="#666" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false} 
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#0a0a0a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px" }}
                  itemStyle={{ color: "#fff" }}
                />
                <Area 
                  type="monotone" 
                  dataKey="elephants" 
                  stroke="hsl(150, 80%, 35%)" 
                  fillOpacity={1} 
                  fill="url(#colorEle)" 
                  strokeWidth={3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Population Distribution */}
        <Card className="bg-card border-white/5">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" />
              Animal Species Distribution
            </CardTitle>
            <CardDescription className="text-white">Percentage share of primary wildlife in monitoring zones.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={animalDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={110}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {animalDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: "#0a0a0a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px" }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-3xl font-black text-white">1,070</span>
              <span className="text-[10px] text-white uppercase tracking-widest">Total Monitored</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-3 bg-card border-white/5">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-white">Zone Wise Risk Analysis</CardTitle>
          </CardHeader>
          <CardContent className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sightingData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  stroke="#666" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false} 
                />
                <YAxis 
                  stroke="#666" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false} 
                />
                <Tooltip 
                  cursor={{ fill: "rgba(255,255,255,0.05)" }}
                  contentStyle={{ backgroundColor: "#0a0a0a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px" }}
                />
                <Bar dataKey="elephants" fill="hsl(150, 80%, 35%)" radius={[4, 4, 0, 0]} barSize={20} />
                <Bar dataKey="tigers" fill="hsl(45, 90%, 50%)" radius={[4, 4, 0, 0]} barSize={20} />
                <Bar dataKey="leopards" fill="hsl(170, 60%, 45%)" radius={[4, 4, 0, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

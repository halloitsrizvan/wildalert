import { StatCard } from "@/components/authority/dashboard/StatCard";
import { AlertTriangle, Shield, Map as MapIcon, Users, Activity, TrendingUp } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { MOCK_REPORTS, MOCK_ALERTS } from "@/data/mockData";
import { cn } from "@/lib/utils";

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Command Center</h1>
        <p className="text-white">Real-time wildlife intelligence and operational status.</p>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Active Reports" 
          value={MOCK_REPORTS.length} 
          change="+12% from yesterday" 
          trend="up" 
          icon={AlertTriangle} 
        />
        <StatCard 
          title="Rangers On Duty" 
          value="24" 
          change="3 units responding" 
          trend="neutral" 
          icon={Shield} 
        />
        <StatCard 
          title="Risk Index" 
          value="78/100" 
          change="+5pts increase" 
          trend="up" 
          icon={Activity} 
        />
        <StatCard 
          title="Protected Area" 
          value="1,450 km²" 
          icon={MapIcon} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Reports Table */}
        <Card className="lg:col-span-2 bg-card border-white/5">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Recent Wildlife Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-white/5 hover:bg-transparent">
                  <TableHead className="text-white uppercase text-xs">Animal</TableHead>
                  <TableHead className="text-white uppercase text-xs">Location</TableHead>
                  <TableHead className="text-white uppercase text-xs">Severity</TableHead>
                  <TableHead className="text-white uppercase text-xs">Status</TableHead>
                  <TableHead className="text-white uppercase text-xs">Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {MOCK_REPORTS.map((report) => (
                  <TableRow key={report.id} className="border-white/5 hover:bg-white/5 transition-colors">
                    <TableCell className="font-medium text-white">{report.animalType}</TableCell>
                    <TableCell className="text-white">{report.location.name}</TableCell>
                    <TableCell>
                      <Badge variant={report.severity === 'critical' ? 'destructive' : 'outline'} className={cn(
                        report.severity === 'high' ? 'border-amber-500 text-amber-500' : 
                        report.severity === 'medium' ? 'border-blue-500 text-blue-500' : ''
                      )}>
                        {report.severity}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className={cn(
                          "w-2 h-2 rounded-full",
                          report.status === 'verified' ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" : 
                          report.status === 'pending' ? "bg-amber-500 animate-pulse" : "bg-blue-500"
                        )} />
                        <span className="text-xs capitalize text-white">{report.status}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-white text-xs">
                      2 mins ago
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Live Alerts Feed */}
        <Card className="bg-card border-white/5">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              Emergency Feed
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {MOCK_ALERTS.map((alert) => (
              <div key={alert.id} className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-2 group hover:border-primary/30 transition-colors">
                <div className="flex items-center justify-between">
                  <span className={cn(
                    "text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded",
                    alert.type === 'danger' ? "bg-red-500/20 text-red-500" : "bg-amber-500/20 text-amber-500"
                  )}>
                    {alert.type}
                  </span>
                  <span className="text-[10px] text-white">14:20 PM</span>
                </div>
                <h4 className="text-sm font-bold text-white group-hover:text-primary transition-colors">{alert.title}</h4>
                <p className="text-xs text-white line-clamp-2">{alert.message}</p>
              </div>
            ))}
            <button className="w-full py-2 text-xs font-bold text-primary hover:text-primary/80 transition-colors uppercase tracking-widest">
              View All Alerts
            </button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}



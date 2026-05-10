import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  trend?: "up" | "down" | "neutral";
  icon: LucideIcon;
  className?: string;
}

export function StatCard({ title, value, change, trend, icon: Icon, className }: StatCardProps) {
  return (
    <Card className={cn("bg-card border-white/5 hover:border-primary/20 transition-all", className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Icon className="w-5 h-5 text-primary" />
          </div>
          {change && (
            <span className={cn(
              "text-xs font-medium px-2 py-0.5 rounded-full",
              trend === "up" ? "bg-green-500/10 text-green-500" : 
              trend === "down" ? "bg-red-500/10 text-red-500" : 
              "bg-blue-500/10 text-blue-500"
            )}>
              {change}
            </span>
          )}
        </div>
        <div>
          <p className="text-sm text-white uppercase tracking-wider mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-white">{value}</h3>
        </div>
      </CardContent>
    </Card>
  );
}

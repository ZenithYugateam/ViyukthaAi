import { Card } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface AnalyticsCardProps {
  title: string;
  value: string | number;
  change: number;
  icon: React.ReactNode;
  gradient?: boolean;
}

export const AnalyticsCard = ({ title, value, change, icon, gradient }: AnalyticsCardProps) => {
  const isPositive = change >= 0;

  return (
    <Card className={cn(
      "p-6 card-shadow hover:card-shadow-hover transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 cursor-pointer",
      gradient && "gradient-primary text-white"
    )}>
      <div className="flex items-start justify-between mb-4">
        <div className={cn(
          "w-12 h-12 rounded-xl flex items-center justify-center",
          gradient ? "bg-white/20" : "bg-primary/10"
        )}>
          <div className={gradient ? "text-white" : "text-primary"}>
            {icon}
          </div>
        </div>
        <div className={cn(
          "flex items-center gap-1 text-sm font-medium px-2 py-1 rounded-lg",
          isPositive 
            ? gradient ? "bg-white/20 text-white" : "bg-green-100 text-green-700"
            : gradient ? "bg-white/20 text-white" : "bg-red-100 text-red-700"
        )}>
          {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
          {Math.abs(change)}%
        </div>
      </div>
      
      <div>
        <h3 className={cn(
          "text-sm font-medium mb-1",
          gradient ? "text-white/80" : "text-muted-foreground"
        )}>
          {title}
        </h3>
        <p className={cn(
          "text-3xl font-bold",
          gradient ? "text-white" : "text-foreground"
        )}>
          {value}
        </p>
      </div>
    </Card>
  );
};

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Users, Target, Award, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

const metrics = [
  { label: "Applications Sent", value: 24, change: 12, trend: "up", icon: <Target className="w-6 h-6" /> },
  { label: "Interview Success", value: "68%", change: 8, trend: "up", icon: <Award className="w-6 h-6" /> },
  { label: "Profile Views", value: 156, change: 23, trend: "up", icon: <Users className="w-6 h-6" /> },
  { label: "Response Rate", value: "45%", change: -5, trend: "down", icon: <Calendar className="w-6 h-6" /> },
];

const monthlyData = [
  { month: "Jan", applications: 12, interviews: 5, offers: 1 },
  { month: "Feb", applications: 18, interviews: 8, offers: 2 },
  { month: "Mar", applications: 24, interviews: 10, offers: 3 },
];

const topSkills = [
  { skill: "React.js", jobs: 45, trend: "up" },
  { skill: "TypeScript", jobs: 38, trend: "up" },
  { skill: "Node.js", jobs: 32, trend: "up" },
  { skill: "Python", jobs: 28, trend: "down" },
  { skill: "AWS", jobs: 25, trend: "up" },
];

const Reports = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Performance Reports</h1>
        <p className="text-muted-foreground mt-2">Track your job search progress and analytics</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric) => (
          <Card key={metric.label} className="p-6 card-shadow hover:card-shadow-hover transition-smooth">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                {metric.icon}
              </div>
              <div className={cn(
                "flex items-center gap-1 text-sm font-medium px-2 py-1 rounded-lg",
                metric.trend === "up" 
                  ? "bg-green-100 text-green-700" 
                  : "bg-red-100 text-red-700"
              )}>
                {metric.trend === "up" ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                {Math.abs(metric.change)}%
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">{metric.label}</p>
              <p className="text-3xl font-bold text-foreground">{metric.value}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Monthly Progress */}
      <Card className="p-6 card-shadow">
        <h3 className="text-xl font-semibold text-foreground mb-6">Monthly Progress</h3>
        <div className="space-y-4">
          {monthlyData.map((data) => (
            <div key={data.month} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">{data.month} 2024</span>
                <span className="text-sm text-muted-foreground">
                  {data.applications} Apps • {data.interviews} Interviews • {data.offers} Offers
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="h-2 rounded-full bg-primary" style={{ width: `${(data.applications / 30) * 100}%` }}></div>
                <div className="h-2 rounded-full bg-accent" style={{ width: `${(data.interviews / 15) * 100}%` }}></div>
                <div className="h-2 rounded-full bg-green-500" style={{ width: `${(data.offers / 5) * 100}%` }}></div>
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-6 mt-6 pt-6 border-t border-border">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-primary"></div>
            <span className="text-sm text-muted-foreground">Applications</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-accent"></div>
            <span className="text-sm text-muted-foreground">Interviews</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-sm text-muted-foreground">Offers</span>
          </div>
        </div>
      </Card>

      {/* Top Skills in Demand */}
      <Card className="p-6 card-shadow">
        <h3 className="text-xl font-semibold text-foreground mb-4">Top Skills in Demand</h3>
        <div className="space-y-3">
          {topSkills.map((item, index) => (
            <div key={item.skill} className="flex items-center justify-between p-3 rounded-lg hover:bg-secondary/50 transition-smooth">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <span className="text-sm font-bold text-primary">{index + 1}</span>
                </div>
                <div>
                  <p className="font-medium text-foreground">{item.skill}</p>
                  <p className="text-sm text-muted-foreground">{item.jobs} matching jobs</p>
                </div>
              </div>
              <Badge variant={item.trend === "up" ? "default" : "secondary"}>
                {item.trend === "up" ? "↑ Trending" : "↓ Declining"}
              </Badge>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default Reports;

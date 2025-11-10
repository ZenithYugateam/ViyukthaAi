import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, Users, TrendingUp, Clock, CheckCircle, XCircle } from "lucide-react";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

// Mock data for analytics
const applicationsData = [
  { date: "Jan", applications: 45, interviews: 23, offers: 8 },
  { date: "Feb", applications: 52, interviews: 28, offers: 12 },
  { date: "Mar", applications: 68, interviews: 35, offers: 15 },
  { date: "Apr", applications: 71, interviews: 40, offers: 18 },
  { date: "May", applications: 83, interviews: 45, offers: 22 },
  { date: "Jun", applications: 95, interviews: 52, offers: 25 },
];

const conversionData = [
  { stage: "Applied", count: 414, rate: 100 },
  { stage: "Viewed", count: 320, rate: 77 },
  { stage: "Interviewed", count: 223, rate: 54 },
  { stage: "Offered", count: 100, rate: 24 },
  { stage: "Accepted", count: 82, rate: 20 },
];

export default function CompanyDashboard() {
  const [dateRange, setDateRange] = useState("30d");

  const stats = [
    {
      title: "Active Jobs",
      value: "12",
      change: "+2 this month",
      icon: Briefcase,
      color: "text-blue-600",
    },
    {
      title: "Total Applications",
      value: "414",
      change: "+23% from last month",
      icon: Users,
      color: "text-green-600",
    },
    {
      title: "Interview Scheduled",
      value: "223",
      change: "54% conversion",
      icon: Clock,
      color: "text-purple-600",
    },
    {
      title: "Offers Extended",
      value: "100",
      change: "82 accepted",
      icon: CheckCircle,
      color: "text-emerald-600",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Company Dashboard</h1>
        <p className="text-muted-foreground">
          Track your recruitment performance and manage your hiring pipeline
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Applications Over Time */}
        <Card>
          <CardHeader>
            <CardTitle>Applications Over Time</CardTitle>
            <CardDescription>Monthly application trends and interview pipeline</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={applicationsData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="date" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="applications" stroke="hsl(var(--primary))" strokeWidth={2} name="Applications" />
                <Line type="monotone" dataKey="interviews" stroke="hsl(var(--secondary))" strokeWidth={2} name="Interviews" />
                <Line type="monotone" dataKey="offers" stroke="hsl(var(--accent))" strokeWidth={2} name="Offers" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Conversion Funnel */}
        <Card>
          <CardHeader>
            <CardTitle>Conversion Funnel</CardTitle>
            <CardDescription>From application to hire conversion rates</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={conversionData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis type="number" className="text-xs" />
                <YAxis dataKey="stage" type="category" className="text-xs" width={80} />
                <Tooltip />
                <Bar dataKey="count" fill="hsl(var(--primary))" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest actions across your job postings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { action: "New application", job: "Senior Frontend Engineer", candidate: "Sarah Johnson", time: "5 minutes ago", type: "new" },
              { action: "Interview completed", job: "Backend Developer", candidate: "Michael Chen", time: "1 hour ago", type: "interview" },
              { action: "Offer accepted", job: "Product Designer", candidate: "Emily Davis", time: "3 hours ago", type: "accepted" },
              { action: "Application rejected", job: "DevOps Engineer", candidate: "James Wilson", time: "5 hours ago", type: "rejected" },
              { action: "Job published", job: "Data Scientist", candidate: null, time: "1 day ago", type: "published" },
            ].map((activity, idx) => (
              <div key={idx} className="flex items-center gap-4 pb-4 last:pb-0 border-b last:border-0">
                <div className={`p-2 rounded-full ${
                  activity.type === "new" ? "bg-blue-100 text-blue-600" :
                  activity.type === "interview" ? "bg-purple-100 text-purple-600" :
                  activity.type === "accepted" ? "bg-green-100 text-green-600" :
                  activity.type === "rejected" ? "bg-red-100 text-red-600" :
                  "bg-gray-100 text-gray-600"
                }`}>
                  {activity.type === "accepted" ? <CheckCircle className="h-4 w-4" /> :
                   activity.type === "rejected" ? <XCircle className="h-4 w-4" /> :
                   <TrendingUp className="h-4 w-4" />}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{activity.action}</p>
                  <p className="text-xs text-muted-foreground">
                    {activity.job} {activity.candidate && `• ${activity.candidate}`}
                  </p>
                </div>
                <span className="text-xs text-muted-foreground">{activity.time}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

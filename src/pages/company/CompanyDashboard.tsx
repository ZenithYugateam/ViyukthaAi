import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Briefcase, Users, TrendingUp, Clock, CheckCircle, XCircle, FileText } from "lucide-react";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

// Mock data (kept internal to avoid clutter). Replace with API later.
const mockJobs = [
  { id: "1", title: "React Developer", status: "active", createdAt: "2025-01-11" },
  { id: "2", title: "React Assessment", status: "active", createdAt: "2025-01-11" },
  { id: "3", title: "Flutter Developer", status: "active", createdAt: "2025-01-11" },
  { id: "4", title: "Data Scientist", status: "closed", createdAt: "2025-01-05" },
];

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
  const [dateRange] = useState("30d");

  // Derived metrics similar to the reference UI
  const jobMetrics = {
    active: mockJobs.filter(j => j.status === "active").length,
    total: mockJobs.length,
    closed: mockJobs.filter(j => j.status === "closed").length,
  };

  const mcqMetrics = { active: 4, total: 5, closed: 1 }; // placeholder
  const interviewMetrics = { active: 4, total: 5, closed: 1 }; // placeholder

  const recentActivities = [
    { title: "React Developer", detail: "Experience: 0-2 years • Hybrid", type: "Job post", date: "11 Jan 2023" },
    { title: "React Assessment", detail: "No.of questions: 30 • cut off: 60%", type: "MCQ test", date: "11 Jan 2023" },
    { title: "Flutter Developer", detail: "Experience: 0-2 years • Hybrid", type: "Job post", date: "11 Jan 2023" },
    { title: "Interview name", detail: "Type: AI based interview • Level: Medium", type: "Interview", date: "11 Jan 2023" },
  ];

  return (
    <div className="space-y-8">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-xl p-6 md:p-8"
           style={{
             background: "linear-gradient(90deg, #ff7a00 0%, #ffb347 100%)",
           }}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-white">Streamline Your Hiring Process</h2>
            <p className="text-white/90 mt-2 max-w-xl text-sm md:text-base">
              Create job posts, conduct interviews, and hire top talent directly from your portal.
            </p>
          </div>
          <div className="flex md:justify-end items-start md:items-center">
            <Link to="/company/jobs/new">
              <Button className="bg-white text-orange-600 hover:bg-white/90">
                Create new
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Metric Cards (3-up) */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* Job posts */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Job posts</CardTitle>
              <Briefcase className="h-4 w-4 text-orange-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between text-sm">
              <Link to="/company/jobs" className="text-primary hover:underline">Active jobs</Link>
              <span className="text-2xl font-bold">{jobMetrics.active}</span>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4 text-sm text-muted-foreground">
              <div className="flex items-center justify-between">
                <span>Total jobs</span>
                <span>{jobMetrics.total}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Closed jobs</span>
                <span>{jobMetrics.closed}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* MCQ test */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">MCQ test</CardTitle>
              <FileText className="h-4 w-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between text-sm">
              <span className="text-primary">Active Tests</span>
              <span className="text-2xl font-bold">{mcqMetrics.active}</span>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4 text-sm text-muted-foreground">
              <div className="flex items-center justify-between">
                <span>Total tests</span>
                <span>{mcqMetrics.total}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Closed tests</span>
                <span>{mcqMetrics.closed}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Interviews */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Interviews</CardTitle>
              <Clock className="h-4 w-4 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between text-sm">
              <span className="text-primary">Active interviews</span>
              <span className="text-2xl font-bold">{interviewMetrics.active}</span>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4 text-sm text-muted-foreground">
              <div className="flex items-center justify-between">
                <span>Total interviews</span>
                <span>{interviewMetrics.total}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Closed interviews</span>
                <span>{interviewMetrics.closed}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent activity</CardTitle>
          <CardDescription>Latest actions across your workspace</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border">
            <div className="grid grid-cols-12 px-4 py-3 text-xs font-medium text-muted-foreground border-b">
              <div className="col-span-6">activity info</div>
              <div className="col-span-3">Activity type</div>
              <div className="col-span-3 text-right">created on</div>
            </div>
            <div className="divide-y">
              {recentActivities.map((item, idx) => (
                <div key={idx} className="grid grid-cols-12 items-center px-4 py-4">
                  <div className="col-span-6">
                    <p className="font-medium">{item.title}</p>
                    <p className="text-xs text-muted-foreground">{item.detail}</p>
                  </div>
                  <div className="col-span-3">
                    <Badge variant="secondary" className="text-xs">{item.type}</Badge>
                  </div>
                  <div className="col-span-3 text-right text-xs text-muted-foreground">{item.date}</div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Keep charts available below for extended insights */}
      <div className="grid gap-4 lg:grid-cols-2">
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
    </div>
  );
}

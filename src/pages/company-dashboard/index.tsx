import React from "react";

import Sidebar from "@/components/company-dashboard/Sidebar";
import TopNav from "@/components/company-dashboard/TopNav";
import { PageTransition } from "@/components/company-dashboard/PageTransition";
import { summary } from "@/data/companyDashboard";
import { mockData } from "@/data/mock-company-dashboard";
import { motion } from "framer-motion";
import { Briefcase, MessageSquare, Bot, LineChart, Plus, TrendingUp, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const CompanyDashboardIndex: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [jobs, setJobs] = React.useState(() => mockData.getJobs());

  React.useEffect(() => {
    // Refresh jobs when component mounts or when returning to page
    const refreshJobs = () => {
      const allJobs = mockData.getJobs();
      // Sort by updatedAt descending (newest first)
      const sortedJobs = [...allJobs].sort((a, b) => {
        const dateA = new Date(a.updatedAt).getTime();
        const dateB = new Date(b.updatedAt).getTime();
        return dateB - dateA;
      });
      setJobs(sortedJobs);
    };
    refreshJobs(); // Refresh immediately on mount
    window.addEventListener("focus", refreshJobs);
    return () => window.removeEventListener("focus", refreshJobs);
  }, []);

  React.useEffect(() => {
    // Refresh jobs whenever location changes to this page
    if (location.pathname === "/company-dashboard") {
      const allJobs = mockData.getJobs();
      // Sort by updatedAt descending (newest first)
      const sortedJobs = [...allJobs].sort((a, b) => {
        const dateA = new Date(a.updatedAt).getTime();
        const dateB = new Date(b.updatedAt).getTime();
        return dateB - dateA;
      });
      setJobs(sortedJobs);
    }
  }, [location.pathname]);

  // Sort jobs by updatedAt descending (newest first) for display
  const sortedJobs = React.useMemo(() => {
    return [...jobs].sort((a, b) => {
      const dateA = new Date(a.updatedAt).getTime();
      const dateB = new Date(b.updatedAt).getTime();
      return dateB - dateA;
    });
  }, [jobs]);

  const recentJobs = sortedJobs.slice(0, 4);
  
  // Calculate live stats (use sortedJobs for consistency)
  const openJobs = sortedJobs.filter(j => j.status === "Open").length;
  const closedJobs = sortedJobs.filter(j => j.status === "Closed").length;
  const totalApplicants = sortedJobs.reduce((sum, j) => sum + j.applicants, 0);

  const iconMap: Record<string, React.ReactNode> = {
    totalJobs: <Briefcase className="h-5 w-5 text-blue-600" />,
    activeInterviews: <MessageSquare className="h-5 w-5 text-emerald-600" />,
    applications: <Briefcase className="h-5 w-5 text-violet-600" />,
    aiInsights: <Bot className="h-5 w-5 text-orange-600" />,
  };

  return (
    <PageTransition>
      <div className="flex min-h-screen bg-background">
        <Sidebar />
        <div className="flex flex-1 flex-col">
          <TopNav />
          <main className="p-4 md:p-6 space-y-6">
          {/* Live Job Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <motion.div
              initial={{ y: 12, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0, duration: 0.35, ease: "easeOut" }}
            >
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Total Jobs</p>
                      <h3 className="text-3xl font-bold">{sortedJobs.length}</h3>
                    </div>
                    <Briefcase className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div
              initial={{ y: 12, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.05, duration: 0.35, ease: "easeOut" }}
            >
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Open Positions</p>
                      <h3 className="text-3xl font-bold text-emerald-600">{openJobs}</h3>
                    </div>
                    <TrendingUp className="h-8 w-8 text-emerald-600" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div
              initial={{ y: 12, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.35, ease: "easeOut" }}
            >
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Total Applicants</p>
                      <h3 className="text-3xl font-bold text-violet-600">{totalApplicants}</h3>
                    </div>
                    <Users className="h-8 w-8 text-violet-600" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div
              initial={{ y: 12, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.15, duration: 0.35, ease: "easeOut" }}
            >
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Closed Jobs</p>
                      <h3 className="text-3xl font-bold text-gray-600">{closedJobs}</h3>
                    </div>
                    <Briefcase className="h-8 w-8 text-gray-600" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {summary.map((item, idx) => (
              <motion.div
                key={item.key}
                initial={{ y: 12, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: idx * 0.05, duration: 0.35, ease: "easeOut" }}
              >
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {iconMap[item.key] ?? <LineChart className="h-5 w-5" />}
                        <span className="text-sm text-muted-foreground">{item.label}</span>
                      </div>
                      <span className="text-xs font-medium text-muted-foreground">{item.delta}</span>
                    </div>
                    <div className="mt-3 text-3xl font-semibold tracking-tight">{item.value}</div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
            <Card className="xl:col-span-2">
              <CardHeader className="py-3 px-4">
                <CardTitle className="text-sm">Recent Jobs</CardTitle>
              </CardHeader>
              <CardContent className="px-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="px-4">Job ID</TableHead>
                      <TableHead className="px-4">Title</TableHead>
                      <TableHead className="px-4">Department</TableHead>
                      <TableHead className="px-4">Status</TableHead>
                      <TableHead className="px-4 text-right">Applicants</TableHead>
                      <TableHead className="px-4 text-right">Updated</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentJobs.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="h-64">
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex flex-col items-center justify-center gap-4"
                          >
                            <Briefcase className="h-12 w-12 text-muted-foreground" />
                            <div className="text-center">
                              <h3 className="text-lg font-semibold mb-1">No jobs yet</h3>
                              <p className="text-sm text-muted-foreground mb-4">
                                Create your first job posting to get started
                              </p>
                              <Button onClick={() => navigate("/company-dashboard/post-job")}>
                                <Plus className="h-4 w-4 mr-2" />
                                Post a Job
                              </Button>
                            </div>
                          </motion.div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      recentJobs.map((row) => (
                      <TableRow key={row.id}>
                        <TableCell className="px-4 text-foreground/90 whitespace-nowrap">{row.id}</TableCell>
                        <TableCell className="px-4 whitespace-nowrap">{row.title}</TableCell>
                        <TableCell className="px-4 text-muted-foreground whitespace-nowrap">{row.department}</TableCell>
                        <TableCell className="px-4 whitespace-nowrap">
                          <span
                            className={
                              "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium " +
                              (row.status === "Open"
                                ? "bg-emerald-100 text-emerald-700"
                                : row.status === "Paused"
                                ? "bg-amber-100 text-amber-700"
                                : "bg-zinc-200 text-zinc-700")
                            }
                          >
                            {row.status}
                          </span>
                        </TableCell>
                        <TableCell className="px-4 text-right whitespace-nowrap">{row.applicants}</TableCell>
                        <TableCell className="px-4 text-right text-muted-foreground whitespace-nowrap">{row.updatedAt}</TableCell>
                      </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="py-3 px-4 flex flex-row items-center justify-between">
                <CardTitle className="text-sm">Pipeline Overview</CardTitle>
                <LineChart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="h-64 rounded-lg border border-dashed flex items-center justify-center text-sm text-muted-foreground">
                  Line chart placeholder
                </div>
              </CardContent>
            </Card>
          </div>
          </main>
        </div>
      </div>
    </PageTransition>
  );
};

export default CompanyDashboardIndex;

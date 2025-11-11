export const companyInfo = {
  name: "Acme Corp",
};

export const summary = [
  { key: "totalJobs", label: "Total Jobs", value: 24, delta: "+3" },
  { key: "activeInterviews", label: "Active Interviews", value: 12, delta: "+2" },
  { key: "applications", label: "Applications", value: 187, delta: "+18" },
  { key: "aiInsights", label: "AI Insights", value: 8, delta: "+1" }
];

export type RecentJob = {
  id: string;
  title: string;
  department: string;
  status: "Open" | "Paused" | "Closed";
  applicants: number;
  updatedAt: string;
};

export const recentJobs: RecentJob[] = [
  { id: "JOB-1012", title: "Frontend Engineer", department: "Engineering", status: "Open", applicants: 42, updatedAt: "2025-11-02" },
  { id: "JOB-1013", title: "Backend Engineer", department: "Engineering", status: "Open", applicants: 31, updatedAt: "2025-11-01" },
  { id: "JOB-1014", title: "Product Designer", department: "Design", status: "Paused", applicants: 18, updatedAt: "2025-10-29" },
  { id: "JOB-1015", title: "Data Analyst", department: "Analytics", status: "Open", applicants: 25, updatedAt: "2025-10-28" }
];

export const notifications = 3;

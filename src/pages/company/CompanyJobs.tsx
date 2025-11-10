import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Plus, MoreVertical, Search, Users, Calendar, MapPin, Briefcase } from "lucide-react";

// Mock jobs data
const mockJobs = [
  {
    id: "1",
    title: "Senior Frontend Engineer",
    department: "Engineering",
    location: "Remote",
    employmentType: "Full-time",
    status: "active",
    deadline: "2025-12-15T23:59:59Z",
    applicantsCount: 48,
    createdAt: "2025-10-01T10:00:00Z",
  },
  {
    id: "2",
    title: "Product Designer",
    department: "Design",
    location: "Hybrid - New York",
    employmentType: "Full-time",
    status: "active",
    deadline: "2025-11-30T23:59:59Z",
    applicantsCount: 35,
    createdAt: "2025-10-05T14:30:00Z",
  },
  {
    id: "3",
    title: "Backend Developer",
    department: "Engineering",
    location: "Onsite - San Francisco",
    employmentType: "Full-time",
    status: "active",
    deadline: "2025-12-01T23:59:59Z",
    applicantsCount: 62,
    createdAt: "2025-09-20T09:00:00Z",
  },
  {
    id: "4",
    title: "Marketing Manager",
    department: "Marketing",
    location: "Remote",
    employmentType: "Full-time",
    status: "draft",
    deadline: "2025-12-20T23:59:59Z",
    applicantsCount: 0,
    createdAt: "2025-11-08T11:00:00Z",
  },
  {
    id: "5",
    title: "Data Scientist",
    department: "Data",
    location: "Hybrid - Boston",
    employmentType: "Full-time",
    status: "expired",
    deadline: "2025-10-31T23:59:59Z",
    applicantsCount: 28,
    createdAt: "2025-09-01T08:00:00Z",
  },
];

export default function CompanyJobs() {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"table" | "cards">("table");

  const getStatusBadge = (status: string) => {
    const variants = {
      active: "default",
      draft: "secondary",
      expired: "destructive",
    } as const;
    
    return (
      <Badge variant={variants[status as keyof typeof variants] || "secondary"}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getTimeUntilDeadline = (deadline: string) => {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const diff = deadlineDate.getTime() - now.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days < 0) return "Expired";
    if (days === 0) return "Today";
    if (days === 1) return "1 day";
    return `${days} days`;
  };

  const filteredJobs = mockJobs.filter(job =>
    job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Jobs</h1>
          <p className="text-muted-foreground">Manage your job postings and track applications</p>
        </div>
        <Link to="/company/jobs/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Post New Job
          </Button>
        </Link>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search jobs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Jobs Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Job Postings</CardTitle>
          <CardDescription>{filteredJobs.length} total jobs</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Job Title</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Deadline</TableHead>
                <TableHead className="text-right">Applicants</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredJobs.map((job) => (
                <TableRow key={job.id}>
                  <TableCell className="font-medium">{job.title}</TableCell>
                  <TableCell>{job.department}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm">
                      <MapPin className="h-3 w-3" />
                      {job.location}
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(job.status)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm">
                      <Calendar className="h-3 w-3" />
                      {getTimeUntilDeadline(job.deadline)}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Link 
                      to={`/company/jobs/${job.id}/applicants`}
                      className="flex items-center justify-end gap-1 text-sm hover:underline"
                    >
                      <Users className="h-3 w-3" />
                      {job.applicantsCount}
                    </Link>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link to={`/company/jobs/${job.id}/edit`}>Edit Job</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link to={`/company/jobs/${job.id}/applicants`}>View Applicants</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>Duplicate</DropdownMenuItem>
                        {job.status === "expired" && (
                          <DropdownMenuItem>Repost</DropdownMenuItem>
                        )}
                        <DropdownMenuItem className="text-destructive">
                          Archive
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

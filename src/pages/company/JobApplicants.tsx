import { useState } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Search, Filter, Download, Mail, Users, TrendingUp, CheckCircle, XCircle, FileText, Star } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock applicants data
const mockApplicants = [
  {
    id: "1",
    name: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    phone: "+1 (555) 123-4567",
    avatarUrl: "/placeholder.svg",
    status: "interviewing",
    submittedAt: "2025-11-01T10:30:00Z",
    score: 92,
    resumeUrl: "#",
    coverLetter: "I am excited to apply for this position...",
    aiResult: {
      overallScore: 92,
      confidence: 0.87,
      sections: [
        { name: "Problem Solving", score: 32 },
        { name: "System Design", score: 30 },
        { name: "Communication", score: 30 },
      ],
      strengths: ["Strong technical foundation", "Clear communication", "Relevant experience"],
      areasToImprove: ["Could expand on leadership examples", "More specific metrics needed"],
      transcript: "Q: Tell me about your experience with React...\nA: I have 5 years of experience...",
      rawExplanation: "Candidate demonstrates strong technical skills..."
    }
  },
  {
    id: "2",
    name: "Michael Chen",
    email: "michael.chen@email.com",
    phone: "+1 (555) 234-5678",
    avatarUrl: "/placeholder.svg",
    status: "applied",
    submittedAt: "2025-11-02T14:20:00Z",
    score: 85,
    resumeUrl: "#",
    coverLetter: "With 8 years of experience in frontend development...",
    aiResult: {
      overallScore: 85,
      confidence: 0.82,
      sections: [
        { name: "Problem Solving", score: 28 },
        { name: "System Design", score: 29 },
        { name: "Communication", score: 28 },
      ],
      strengths: ["Solid technical background", "Good problem-solving approach"],
      areasToImprove: ["Communication could be more concise", "Need more concrete examples"],
      transcript: "Q: Describe a challenging project...\nA: One of the most challenging...",
      rawExplanation: "Candidate shows good potential..."
    }
  },
  {
    id: "3",
    name: "Emily Davis",
    email: "emily.davis@email.com",
    phone: "+1 (555) 345-6789",
    avatarUrl: "/placeholder.svg",
    status: "accepted",
    submittedAt: "2025-10-28T09:15:00Z",
    score: 95,
    resumeUrl: "#",
    coverLetter: "I am thrilled about this opportunity...",
    aiResult: {
      overallScore: 95,
      confidence: 0.91,
      sections: [
        { name: "Problem Solving", score: 33 },
        { name: "System Design", score: 32 },
        { name: "Communication", score: 30 },
      ],
      strengths: ["Exceptional technical skills", "Excellent communication", "Strong leadership"],
      areasToImprove: ["None significant"],
      transcript: "Q: Walk me through your approach...\nA: I would start by...",
      rawExplanation: "Outstanding candidate with all required qualifications..."
    }
  },
  {
    id: "4",
    name: "James Wilson",
    email: "james.wilson@email.com",
    phone: "+1 (555) 456-7890",
    avatarUrl: "/placeholder.svg",
    status: "rejected",
    submittedAt: "2025-10-25T16:45:00Z",
    score: 65,
    resumeUrl: "#",
    coverLetter: "I would like to apply for this role...",
    aiResult: {
      overallScore: 65,
      confidence: 0.75,
      sections: [
        { name: "Problem Solving", score: 22 },
        { name: "System Design", score: 21 },
        { name: "Communication", score: 22 },
      ],
      strengths: ["Eager to learn", "Good attitude"],
      areasToImprove: ["Lack of relevant experience", "Technical depth needed", "More preparation required"],
      transcript: "Q: Explain your understanding of...\nA: I think it's...",
      rawExplanation: "Candidate needs more experience and preparation..."
    }
  },
];

export default function JobApplicants() {
  const { jobId } = useParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedApplicant, setSelectedApplicant] = useState<typeof mockApplicants[0] | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const getStatusBadge = (status: string) => {
    const variants = {
      applied: { variant: "secondary" as const, label: "Applied", className: "" },
      interviewing: { variant: "default" as const, label: "Interviewing", className: "" },
      accepted: { variant: "default" as const, label: "Accepted", className: "bg-green-600" },
      rejected: { variant: "destructive" as const, label: "Rejected", className: "" },
    };
    
    const config = variants[status as keyof typeof variants] || variants.applied;
    
    return (
      <Badge variant={config.variant} className={config.className}>
        {config.label}
      </Badge>
    );
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return "text-green-600";
    if (score >= 70) return "text-blue-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const filteredApplicants = mockApplicants.filter(applicant => {
    const matchesSearch = applicant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         applicant.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || applicant.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: mockApplicants.length,
    applied: mockApplicants.filter(a => a.status === "applied").length,
    interviewing: mockApplicants.filter(a => a.status === "interviewing").length,
    accepted: mockApplicants.filter(a => a.status === "accepted").length,
    rejected: mockApplicants.filter(a => a.status === "rejected").length,
  };

  const openApplicantDetail = (applicant: typeof mockApplicants[0]) => {
    setSelectedApplicant(applicant);
    setIsDrawerOpen(true);
  };

  const handleStatusChange = (newStatus: string) => {
    console.log("Changing status to:", newStatus);
    setIsDrawerOpen(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Applicants - Senior Frontend Engineer</h1>
        <p className="text-muted-foreground">Review and manage candidate applications</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Applied</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.applied}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Interviewing</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.interviewing}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Accepted</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.accepted}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Rejected</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Actions */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>All Applicants</CardTitle>
              <CardDescription>{filteredApplicants.length} candidates</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Export CSV
              </Button>
              <Button variant="outline" size="sm">
                <Mail className="mr-2 h-4 w-4" />
                Bulk Message
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="applied">Applied</SelectItem>
                <SelectItem value="interviewing">Interviewing</SelectItem>
                <SelectItem value="accepted">Accepted</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Candidate</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Applied</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredApplicants.map((applicant) => (
                <TableRow
                  key={applicant.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => openApplicantDetail(applicant)}
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={applicant.avatarUrl} />
                        <AvatarFallback>{applicant.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{applicant.name}</p>
                        <p className="text-sm text-muted-foreground">{applicant.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(applicant.status)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className={`text-lg font-bold ${getScoreColor(applicant.score)}`}>
                        {applicant.score}
                      </span>
                      <span className="text-xs text-muted-foreground">/100</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(applicant.submittedAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Applicant Detail Drawer */}
      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <DrawerContent className="max-h-[90vh]">
          <DrawerHeader className="border-b">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={selectedApplicant?.avatarUrl} />
                  <AvatarFallback>
                    {selectedApplicant?.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <DrawerTitle className="text-2xl">{selectedApplicant?.name}</DrawerTitle>
                  <p className="text-sm text-muted-foreground">{selectedApplicant?.email}</p>
                  <p className="text-sm text-muted-foreground">{selectedApplicant?.phone}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="default"
                  className="bg-green-600 hover:bg-green-700"
                  onClick={() => handleStatusChange("accepted")}
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Accept
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleStatusChange("rejected")}
                >
                  <XCircle className="mr-2 h-4 w-4" />
                  Reject
                </Button>
              </div>
            </div>
          </DrawerHeader>

          <div className="p-6 overflow-y-auto">
            <Tabs defaultValue="ai-result" className="space-y-6">
              <TabsList>
                <TabsTrigger value="ai-result">AI Interview Result</TabsTrigger>
                <TabsTrigger value="application">Application</TabsTrigger>
                <TabsTrigger value="activity">Activity</TabsTrigger>
              </TabsList>

              <TabsContent value="ai-result" className="space-y-6">
                {/* AI Result Summary */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>AI Interview Assessment</CardTitle>
                      <Badge variant="secondary" className="gap-1">
                        <Star className="h-3 w-3" />
                        AI-Generated
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Overall Score */}
                    <div className="text-center p-6 bg-muted rounded-lg">
                      <p className="text-sm font-medium text-muted-foreground mb-2">Overall Score</p>
                      <p className={`text-5xl font-bold ${getScoreColor(selectedApplicant?.aiResult?.overallScore || 0)}`}>
                        {selectedApplicant?.aiResult?.overallScore}
                      </p>
                      <p className="text-sm text-muted-foreground mt-2">
                        Confidence: {((selectedApplicant?.aiResult?.confidence || 0) * 100).toFixed(0)}%
                      </p>
                    </div>

                    {/* Score Breakdown */}
                    <div>
                      <h4 className="font-semibold mb-4">Score Breakdown</h4>
                      <div className="space-y-3">
                        {selectedApplicant?.aiResult?.sections.map((section) => (
                          <div key={section.name}>
                            <div className="flex justify-between mb-1">
                              <span className="text-sm font-medium">{section.name}</span>
                              <span className="text-sm text-muted-foreground">{section.score}/33</span>
                            </div>
                            <Progress value={(section.score / 33) * 100} />
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Strengths */}
                    <div>
                      <h4 className="font-semibold mb-2 flex items-center gap-2 text-green-600">
                        <CheckCircle className="h-4 w-4" />
                        Strengths
                      </h4>
                      <ul className="list-disc list-inside space-y-1">
                        {selectedApplicant?.aiResult?.strengths.map((strength, idx) => (
                          <li key={idx} className="text-sm">{strength}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Areas to Improve */}
                    <div>
                      <h4 className="font-semibold mb-2 flex items-center gap-2 text-yellow-600">
                        <TrendingUp className="h-4 w-4" />
                        Areas to Improve
                      </h4>
                      <ul className="list-disc list-inside space-y-1">
                        {selectedApplicant?.aiResult?.areasToImprove.map((area, idx) => (
                          <li key={idx} className="text-sm">{area}</li>
                        ))}
                      </ul>
                    </div>

                    <Separator />

                    {/* Transcript */}
                    <div>
                      <h4 className="font-semibold mb-2">Interview Transcript</h4>
                      <div className="bg-muted p-4 rounded-lg">
                        <pre className="text-sm whitespace-pre-wrap font-mono">
                          {selectedApplicant?.aiResult?.transcript}
                        </pre>
                      </div>
                    </div>

                    {/* AI Explanation */}
                    <div>
                      <details>
                        <summary className="cursor-pointer font-semibold text-sm text-muted-foreground">
                          View AI Reasoning
                        </summary>
                        <p className="text-sm mt-2 text-muted-foreground">
                          {selectedApplicant?.aiResult?.rawExplanation}
                        </p>
                      </details>
                    </div>

                    <div className="bg-yellow-50 dark:bg-yellow-950 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
                      <p className="text-sm text-yellow-800 dark:text-yellow-200">
                        ⚠️ AI scores are suggestions only. Always conduct human review before making final decisions.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="application" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Application Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Resume</h4>
                      <Button variant="outline" size="sm">
                        <FileText className="mr-2 h-4 w-4" />
                        View Resume
                      </Button>
                    </div>

                    <Separator />

                    <div>
                      <h4 className="font-semibold mb-2">Cover Letter</h4>
                      <p className="text-sm text-muted-foreground">
                        {selectedApplicant?.coverLetter}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="activity">
                <Card>
                  <CardHeader>
                    <CardTitle>Activity Timeline</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex gap-4">
                        <div className="w-2 bg-primary rounded-full"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">Application submitted</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(selectedApplicant?.submittedAt || "").toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-4">
                        <div className="w-2 bg-blue-500 rounded-full"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">AI interview completed</p>
                          <p className="text-xs text-muted-foreground">Score: {selectedApplicant?.score}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
}

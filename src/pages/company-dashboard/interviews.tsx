import React from "react";
import Sidebar from "@/components/company-dashboard/Sidebar";
import TopNav from "@/components/company-dashboard/TopNav";
import { PageTransition } from "@/components/company-dashboard/PageTransition";
import { mockData, Interview } from "@/data/mock-company-dashboard";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import {
  Download,
  FileText,
  Calendar,
  CheckSquare,
  Square,
  ArrowLeft,
  X
} from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { scheduleSystem } from "@/data/schedules";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const InterviewsPage: React.FC = () => {
  const navigate = useNavigate();
  const [interviews, setInterviews] = React.useState(() => mockData.getInterviews());
  const [filter, setFilter] = React.useState<"All" | "Ongoing" | "Completed" | "Scheduled">("All");
  const [selectedInterview, setSelectedInterview] = React.useState<Interview | null>(null);
  const [selectedCandidates, setSelectedCandidates] = React.useState<Set<string>>(new Set());
  const [showScheduleModal, setShowScheduleModal] = React.useState(false);
  const [currentPage, setCurrentPage] = React.useState(1);
  const candidatesPerPage = 5;

  React.useEffect(() => {
     // Refresh interviews when component mounts
    const refreshInterviews = () => setInterviews(mockData.getInterviews());
    window.addEventListener("focus", refreshInterviews);
    return () => window.removeEventListener("focus", refreshInterviews);
  }, []);

  const filtered = React.useMemo(
    () => (filter === "All" ? interviews : interviews.filter((i) => i.status === filter)),
    [filter, interviews],
  );

  const handleDownloadReport = (interviewId: string) => {
    toast.success(`Report for ${interviewId} downloaded successfully!`);
  };

  const toggleCandidateSelection = (interviewId: string) => {
    setSelectedCandidates(prev => {
      const newSet = new Set(prev);
      if (newSet.has(interviewId)) {
        newSet.delete(interviewId);
      } else {
        newSet.add(interviewId);
      }
      return newSet;
    });
  };

  const toggleSelectAll = () => {
    if (selectedCandidates.size === filtered.length) {
      setSelectedCandidates(new Set());
    } else {
      setSelectedCandidates(new Set(filtered.map(i => i.id)));
    }
  };

  const handleScheduleSelected = () => {
    if (selectedCandidates.size === 0) {
      toast.error("Please select at least one candidate");
      return;
    }
    setShowScheduleModal(true);
  };

  return (
    <PageTransition>
      <div className="flex min-h-screen bg-background">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <TopNav />
          <main className="p-4 md:p-6 space-y-4 relative">
            <AnimatePresence mode="wait">
              {!selectedInterview ? (
                <motion.div
                  key="list-view"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Header */}
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h1 className="text-2xl font-semibold">Interviews</h1>
                      {selectedCandidates.size > 0 && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {selectedCandidates.size} candidate
                          {selectedCandidates.size > 1 ? "s" : ""} selected
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {selectedCandidates.size > 0 && (
                        <Button onClick={handleScheduleSelected}>
                          <Calendar className="h-4 w-4 mr-2" />
                          Schedule Interview ({selectedCandidates.size})
                        </Button>
                      )}
                      <Select value={filter} onValueChange={(v) => setFilter(v as typeof filter)}>
                        <SelectTrigger className="w-48">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="All">All</SelectItem>
                          <SelectItem value="Ongoing">Ongoing</SelectItem>
                          <SelectItem value="Completed">Completed</SelectItem>
                          <SelectItem value="Scheduled">Scheduled</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Slim Table */}
                  <Card className="shadow-none border border-border">
                    <CardContent className="p-0">
                      <Table>
                        <TableHeader>
                          <TableRow className="h-8">
                            <TableHead className="w-10 p-2"></TableHead>
                            <TableHead className="text-xs font-medium">Job Title</TableHead>
                            <TableHead className="text-xs font-medium">Candidates</TableHead>
                            <TableHead className="text-xs font-medium">Date</TableHead>
                            <TableHead className="text-xs font-medium">Status</TableHead>
                            <TableHead className="text-right text-xs font-medium">Action</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filtered.length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={6} className="h-40 text-center text-sm text-muted-foreground">
                                No interviews found
                              </TableCell>
                            </TableRow>
                          ) : (
                            filtered.map((interview) => (
                              <TableRow key={interview.id} className="h-10 hover:bg-muted/30">
                                <TableCell className="p-2">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => toggleCandidateSelection(interview.id)}
                                    className="h-8 w-8 p-0"
                                  >
                                    {selectedCandidates.has(interview.id) ? (
                                      <CheckSquare className="h-4 w-4 text-primary" />
                                    ) : (
                                      <Square className="h-4 w-4" />
                                    )}
                                  </Button>
                                </TableCell>
                                <TableCell className="text-sm">{interview.jobTitle}</TableCell>
                                <TableCell className="text-sm">{interview.candidates}</TableCell>
                                <TableCell className="text-xs text-muted-foreground">{interview.date}</TableCell>
                                <TableCell>
                                  <span
                                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${
                                      interview.status === "Completed"
                                        ? "bg-emerald-100 text-emerald-700"
                                        : interview.status === "Ongoing"
                                        ? "bg-blue-100 text-blue-700"
                                        : "bg-amber-100 text-amber-700"
                                    }`}
                                  >
                                    {interview.status}
                                  </span>
                                </TableCell>
                                <TableCell className="text-right">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-7 px-2 text-xs"
                                    onClick={() => setSelectedInterview(interview)}
                                  >
                                    View
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))
                          )}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </motion.div>
              ) : (
                // DETAIL VIEW
                <motion.div
                  key="detail-view"
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Button
                        variant="default"
                        size="icon"
                        className="rounded-full bg-primary text-white hover:bg-primary/90"
                        onClick={() => setSelectedInterview(null)}
                      >
                        <ArrowLeft className="h-4 w-4" />
                      </Button>
                      <div>
                        <h2 className="text-lg font-semibold">{selectedInterview.jobTitle}</h2>
                        <p className="text-xs text-muted-foreground">
                          {selectedInterview.candidates} candidates • {selectedInterview.date}
                        </p>
                      </div>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 px-3 text-xs"
                      onClick={() => handleDownloadReport(selectedInterview.id)}
                    >
                      <Download className="h-3.5 w-3.5 mr-2" />
                      Download Report
                    </Button>
                  </div>

                  {/* Candidates with Pagination */}
                  <div className="overflow-hidden rounded-md border border-border">
                    {(() => {
                      const totalCandidates = selectedInterview.candidateList.length;
                      const totalPages = Math.ceil(totalCandidates / candidatesPerPage);
                      const startIndex = (currentPage - 1) * candidatesPerPage;
                      const endIndex = startIndex + candidatesPerPage;
                      const visibleCandidates = selectedInterview.candidateList.slice(startIndex, endIndex);

                      return (
                        <>
                          {visibleCandidates.map((candidate, index) => (
                            <div
                              key={candidate.id}
                              className={`grid grid-cols-12 items-center px-4 py-3 border-b last:border-0 transition-all hover:bg-muted/40 ${
                                index % 2 === 1 ? "bg-muted/20" : "bg-background"
                              }`}
                            >
                              <div className="col-span-4 flex flex-col">
                                <span className="font-medium text-sm">{candidate.name}</span>
                                <span className="text-xs text-muted-foreground">{candidate.email}</span>
                              </div>

                              <div className="col-span-2">
                                <span
                                  className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${
                                    candidate.status === "Passed"
                                      ? "bg-emerald-100 text-emerald-700"
                                      : candidate.status === "Failed"
                                      ? "bg-red-100 text-red-700"
                                      : "bg-amber-100 text-amber-700"
                                  }`}
                                >
                                  {candidate.status}
                                </span>
                              </div>

                              <div className="col-span-4 text-xs text-muted-foreground line-clamp-2 leading-snug max-h-[2.4em]">
                                {candidate.aiRemarks}
                              </div>

                              <div className="col-span-2 flex justify-end items-center gap-3">
                                <div className="text-right">
                                  <div className="text-base font-semibold">{candidate.score}</div>
                                  <div className="text-[10px] text-muted-foreground">Score</div>
                                </div>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="h-7 px-2 text-[11px]"
                                  onClick={() =>
                                    navigate(
                                      `/company-dashboard/candidate/RPT-00${
                                        selectedInterview.candidateList.indexOf(candidate) + 1
                                      }`
                                    )
                                  }
                                >
                                  <FileText className="h-3.5 w-3.5 mr-1" />
                                  View
                                </Button>
                              </div>
                            </div>
                          ))}

                          {/* Pagination Footer */}
                          <div className="flex items-center justify-between px-4 py-3 bg-muted/10 border-t border-border text-xs text-muted-foreground">
                            <span>
                              Showing {startIndex + 1}–
                              {endIndex > totalCandidates ? totalCandidates : endIndex} of {totalCandidates} candidates
                            </span>

                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-7 px-3 text-xs"
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                              >
                                Previous
                              </Button>

                              <div className="flex items-center gap-1">
                                {Array.from({ length: totalPages }, (_, i) => (
                                  <button
                                    key={i}
                                    onClick={() => setCurrentPage(i + 1)}
                                    className={`h-7 w-7 rounded-md text-xs font-medium transition ${
                                      currentPage === i + 1
                                        ? "bg-primary text-white"
                                        : "text-muted-foreground hover:bg-muted/40"
                                    }`}
                                  >
                                    {i + 1}
                                  </button>
                                ))}
                              </div>

                              <Button
                                variant="outline"
                                size="sm"
                                className="h-7 px-3 text-xs"
                                disabled={currentPage === totalPages}
                                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                              >
                                Next
                              </Button>
                            </div>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                </motion.div>

              )}
            </AnimatePresence>

            {/* 🔹 Bulk Schedule Modal */}
            <BulkScheduleModal
              show={showScheduleModal}
              selectedCount={selectedCandidates.size}
              selectedInterviews={interviews.filter(i => selectedCandidates.has(i.id))}
              onClose={() => setShowScheduleModal(false)}
              onSuccess={() => {
                setSelectedCandidates(new Set());
                setShowScheduleModal(false);
              }}
            />
          </main>
        </div>
      </div>
    </PageTransition>
  );
};

// Bulk Schedule Modal Component
const BulkScheduleModal: React.FC<{
  show: boolean;
  selectedCount: number;
  selectedInterviews: Interview[];
  onClose: () => void;
  onSuccess: () => void;
}> = ({ show, selectedCount, selectedInterviews, onClose, onSuccess }) => {
  const [formData, setFormData] = React.useState({
    interviewType: "Technical" as "AI" | "Technical" | "HR" | "Voice/Video",
    date: "",
    time: "",
    duration: 60,
    meetingLink: "",
    interviewer: "",
    notes: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.date || !formData.time) {
      toast.error("Please fill in date and time");
      return;
    }

      // Create schedules for all selected candidates
    let successCount = 0;
    selectedInterviews.forEach((interview) => {
      scheduleSystem.create({
        candidateName: `Candidate from ${interview.jobTitle}`,
        candidateEmail: `candidate@example.com`,
        jobTitle: interview.jobTitle,
        interviewType: formData.interviewType,
        date: formData.date,
        time: formData.time,
        duration: formData.duration,
        meetingLink: formData.meetingLink,
        interviewer: formData.interviewer,
        notes: formData.notes,
        status: "Scheduled",
      });
      successCount++;
    });

    toast.success(`${successCount} interview${successCount > 1 ? 's' : ''} scheduled successfully!`);
    onSuccess();
    setFormData({
      interviewType: "Technical",
      date: "",
      time: "",
      duration: 60,
      meetingLink: "",
      interviewer: "",
      notes: "",
    });
  };

  if (!show) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-50"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl max-h-[90vh] bg-background rounded-lg shadow-2xl z-50 overflow-hidden flex flex-col"
      >
        <div className="flex items-center justify-between p-4 border-b">
          <div>
            <h2 className="text-xl font-semibold">Schedule Interviews</h2>
            <p className="text-sm text-muted-foreground">
              Scheduling for {selectedCount} candidate{selectedCount > 1 ? 's' : ''}
            </p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="interviewType">Interview Type</Label>
              <Select
                value={formData.interviewType}
                onValueChange={(value) =>
                  setFormData({ ...formData, interviewType: value as typeof formData.interviewType })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="AI">AI</SelectItem>
                  <SelectItem value="Technical">Technical</SelectItem>
                  <SelectItem value="HR">HR</SelectItem>
                  <SelectItem value="Voice/Video">Voice/Video</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="interviewer">Interviewer</Label>
              <Input
                id="interviewer"
                value={formData.interviewer}
                onChange={(e) => setFormData({ ...formData, interviewer: e.target.value })}
                placeholder="Interviewer name"
              />
            </div>

            <div>
              <Label htmlFor="date">
                Date <span className="text-red-500">*</span>
              </Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
            </div>

            <div>
              <Label htmlFor="time">
                Time <span className="text-red-500">*</span>
              </Label>
              <Input
                id="time"
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                required
              />
            </div>

            <div>
              <Label htmlFor="duration">Duration (minutes)</Label>
              <Input
                id="duration"
                type="number"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                min="15"
                step="15"
              />
            </div>

            <div>
              <Label htmlFor="meetingLink">Meeting Link</Label>
              <Input
                id="meetingLink"
                type="url"
                value={formData.meetingLink}
                onChange={(e) => setFormData({ ...formData, meetingLink: e.target.value })}
                placeholder="https://meet.google.com/..."
              />
            </div>
          </div>

          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
              placeholder="Add any additional notes for all interviews..."
            />
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">Selected Candidates:</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              {selectedInterviews.map((interview) => (
                <li key={interview.id}>
                  • {interview.jobTitle} ({interview.candidates} candidate{interview.candidates > 1 ? 's' : ''})
                </li>
              ))}
            </ul>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              <Calendar className="h-4 w-4 mr-2" />
              Schedule All ({selectedCount})
            </Button>
          </div>
        </form>
      </motion.div>
    </AnimatePresence>
  );
};

export default InterviewsPage;

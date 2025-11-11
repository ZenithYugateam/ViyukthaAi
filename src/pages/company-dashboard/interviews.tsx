import React from "react";
import Sidebar from "@/components/company-dashboard/Sidebar";
import TopNav from "@/components/company-dashboard/TopNav";
import { PageTransition } from "@/components/company-dashboard/PageTransition";
import { mockData, Interview } from "@/data/mock-company-dashboard";
import { motion, AnimatePresence } from "framer-motion";

type InterviewStatus = "Ongoing" | "Completed" | "Scheduled";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, Download, MessageSquare, FileText, Calendar, CheckSquare, Square } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { scheduleSystem } from "@/data/schedules";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const InterviewsPage: React.FC = () => {
  const navigate = useNavigate();
  const [interviews, setInterviews] = React.useState(() => mockData.getInterviews());
  const [filter, setFilter] = React.useState<"All" | InterviewStatus>("All");
  const [selectedInterview, setSelectedInterview] = React.useState<Interview | null>(null);
  const [selectedCandidates, setSelectedCandidates] = React.useState<Set<string>>(new Set());
  const [showScheduleModal, setShowScheduleModal] = React.useState(false);

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
        <main className="p-4 md:p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold">Interviews</h1>
              {selectedCandidates.size > 0 && (
                <p className="text-sm text-muted-foreground mt-1">
                  {selectedCandidates.size} candidate{selectedCandidates.size > 1 ? 's' : ''} selected
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

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={toggleSelectAll}
                        className="h-8 w-8 p-0"
                      >
                        {selectedCandidates.size === filtered.length && filtered.length > 0 ? (
                          <CheckSquare className="h-4 w-4" />
                        ) : (
                          <Square className="h-4 w-4" />
                        )}
                      </Button>
                    </TableHead>
                    <TableHead>Job Title</TableHead>
                    <TableHead>Candidates</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="h-64">
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex flex-col items-center justify-center gap-4 text-center">
                          <MessageSquare className="h-12 w-12 text-muted-foreground" />
                          <div>
                            <h3 className="text-lg font-semibold mb-1">No interviews found</h3>
                            <p className="text-sm text-muted-foreground">
                              {filter === "All" ? "No interviews scheduled yet" : `No ${filter.toLowerCase()} interviews`}
                            </p>
                          </div>
                        </motion.div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filtered.map((interview) => (
                    <TableRow key={interview.id}>
                      <TableCell>
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
                      <TableCell className="font-medium">{interview.jobTitle}</TableCell>
                      <TableCell>{interview.candidates}</TableCell>
                      <TableCell>{interview.date}</TableCell>
                      <TableCell>
                        <span
                          className={
                            "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium " +
                            (interview.status === "Completed"
                              ? "bg-emerald-100 text-emerald-700"
                              : interview.status === "Ongoing"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-amber-100 text-amber-700")
                          }
                        >
                          {interview.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
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
        </main>
      </div>

      <AnimatePresence>
        {selectedInterview && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setSelectedInterview(null)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-full md:w-[600px] bg-background border-l shadow-2xl z-50 overflow-y-auto"
            >
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold">{selectedInterview.jobTitle}</h2>
                    <p className="text-sm text-muted-foreground">
                      {selectedInterview.candidates} candidates • {selectedInterview.date}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSelectedInterview(null)}
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownloadReport(selectedInterview.id)}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download Report
                  </Button>
                </div>

                <div className="space-y-3">
                  <h3 className="text-sm font-medium">Candidates</h3>
                  {selectedInterview.candidateList.map((candidate) => (
                    <Card key={candidate.id}>
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-base">{candidate.name}</CardTitle>
                            <p className="text-sm text-muted-foreground">{candidate.email}</p>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-semibold">{candidate.score}</div>
                            <div className="text-xs text-muted-foreground">Score</div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-medium">Status:</span>
                            <span
                              className={
                                "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium " +
                                (candidate.status === "Passed"
                                  ? "bg-emerald-100 text-emerald-700"
                                  : candidate.status === "Failed"
                                  ? "bg-red-100 text-red-700"
                                  : "bg-amber-100 text-amber-700")
                              }
                            >
                              {candidate.status}
                            </span>
                          </div>
                          <div>
                            <p className="text-xs font-medium mb-1">AI Remarks:</p>
                            <p className="text-sm text-muted-foreground">{candidate.aiRemarks}</p>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full"
                            onClick={() => navigate(`/company-dashboard/candidate/RPT-00${selectedInterview.candidateList.indexOf(candidate) + 1}`)}
                          >
                            <FileText className="h-4 w-4 mr-2" />
                            View Detailed Report
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Bulk Schedule Modal */}
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

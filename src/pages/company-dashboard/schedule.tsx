import React from "react";
import Sidebar from "@/components/company-dashboard/Sidebar";
import TopNav from "@/components/company-dashboard/TopNav";
import { PageTransition } from "@/components/company-dashboard/PageTransition";
import { scheduleSystem, InterviewSchedule } from "@/data/schedules";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Calendar,
  Clock,
  Plus,
  Video,
  User,
  Mail,
  Briefcase,
  X,
  Check,
  Ban,
  Edit,
  Trash2,
  ExternalLink,
  Filter,
  CalendarDays,
  List,
} from "lucide-react";
import { toast } from "sonner";

const SchedulePage: React.FC = () => {
  const [schedules, setSchedules] = React.useState<InterviewSchedule[]>(() =>
    scheduleSystem.getAll()
  );
  const [showCreateModal, setShowCreateModal] = React.useState(false);
  const [viewMode, setViewMode] = React.useState<"calendar" | "list">("list");
  const [filterStatus, setFilterStatus] = React.useState<string>("all");
  const [selectedDate, setSelectedDate] = React.useState<string>("");

  const refreshSchedules = () => {
    setSchedules(scheduleSystem.getAll());
  };

  React.useEffect(() => {
    window.addEventListener("focus", refreshSchedules);
    return () => window.removeEventListener("focus", refreshSchedules);
  }, []);

  const filteredSchedules = React.useMemo(() => {
    let filtered = schedules;

    if (filterStatus !== "all") {
      filtered = filtered.filter((s) => s.status === filterStatus);
    }

    if (selectedDate) {
      filtered = filtered.filter((s) => s.date === selectedDate);
    }

    return filtered.sort((a, b) => {
      const dateCompare = a.date.localeCompare(b.date);
      if (dateCompare !== 0) return dateCompare;
      return a.time.localeCompare(b.time);
    });
  }, [schedules, filterStatus, selectedDate]);

  const upcomingSchedules = scheduleSystem.getUpcoming();

  const getStatusColor = (status: InterviewSchedule["status"]) => {
    switch (status) {
      case "Scheduled":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "Completed":
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "Cancelled":
        return "bg-red-100 text-red-700 border-red-200";
      case "Rescheduled":
        return "bg-amber-100 text-amber-700 border-amber-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getTypeColor = (type: InterviewSchedule["interviewType"]) => {
    switch (type) {
      case "AI":
        return "bg-purple-100 text-purple-700";
      case "Technical":
        return "bg-blue-100 text-blue-700";
      case "HR":
        return "bg-green-100 text-green-700";
      case "Voice/Video":
        return "bg-orange-100 text-orange-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const handleCancel = (id: string) => {
    if (scheduleSystem.cancel(id)) {
      toast.success("Interview cancelled");
      refreshSchedules();
    }
  };

  const handleComplete = (id: string) => {
    if (scheduleSystem.complete(id)) {
      toast.success("Interview marked as completed");
      refreshSchedules();
    }
  };

  const handleDelete = (id: string) => {
    if (scheduleSystem.delete(id)) {
      toast.success("Schedule deleted");
      refreshSchedules();
    }
  };

  return (
    <PageTransition>
      <div className="flex min-h-screen bg-background">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <TopNav />
          <main className="p-4 md:p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold">Interview Schedule</h1>
                <p className="text-muted-foreground">Manage and track all interview schedules</p>
              </div>
              <Button onClick={() => setShowCreateModal(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Schedule Interview
              </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0 }}
              >
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Total Scheduled</span>
                      <Calendar className="h-5 w-5 text-blue-500" />
                    </div>
                    <div className="text-3xl font-bold text-blue-600">
                      {schedules.filter((s) => s.status === "Scheduled").length}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Upcoming</span>
                      <Clock className="h-5 w-5 text-amber-500" />
                    </div>
                    <div className="text-3xl font-bold text-amber-600">
                      {upcomingSchedules.length}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Completed</span>
                      <Check className="h-5 w-5 text-emerald-500" />
                    </div>
                    <div className="text-3xl font-bold text-emerald-600">
                      {schedules.filter((s) => s.status === "Completed").length}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Cancelled</span>
                      <Ban className="h-5 w-5 text-red-500" />
                    </div>
                    <div className="text-3xl font-bold text-red-600">
                      {schedules.filter((s) => s.status === "Cancelled").length}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Filters and View Toggle */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-muted-foreground" />
                    <Label>Status:</Label>
                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="Scheduled">Scheduled</SelectItem>
                        <SelectItem value="Completed">Completed</SelectItem>
                        <SelectItem value="Cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <Label>Date:</Label>
                    <Input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-40"
                    />
                    {selectedDate && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedDate("")}
                      >
                        Clear
                      </Button>
                    )}
                  </div>

                  <div className="ml-auto flex items-center gap-2">
                    <Button
                      variant={viewMode === "list" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setViewMode("list")}
                    >
                      <List className="h-4 w-4 mr-2" />
                      List
                    </Button>
                    <Button
                      variant={viewMode === "calendar" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setViewMode("calendar")}
                    >
                      <CalendarDays className="h-4 w-4 mr-2" />
                      Calendar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Schedules List */}
            <div className="space-y-4">
              {filteredSchedules.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No schedules found</h3>
                    <p className="text-muted-foreground mb-4">
                      {filterStatus !== "all" || selectedDate
                        ? "Try adjusting your filters"
                        : "Get started by scheduling your first interview"}
                    </p>
                    {filterStatus === "all" && !selectedDate && (
                      <Button onClick={() => setShowCreateModal(true)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Schedule Interview
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ) : (
                filteredSchedules.map((schedule, index) => (
                  <motion.div
                    key={schedule.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                              <h3 className="text-lg font-semibold">{schedule.candidateName}</h3>
                              <Badge className={getStatusColor(schedule.status)}>
                                {schedule.status}
                              </Badge>
                              <Badge className={getTypeColor(schedule.interviewType)}>
                                {schedule.interviewType}
                              </Badge>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <Briefcase className="h-4 w-4" />
                                <span>{schedule.jobTitle}</span>
                              </div>
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <Calendar className="h-4 w-4" />
                                <span>{new Date(schedule.date).toLocaleDateString()}</span>
                              </div>
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <Clock className="h-4 w-4" />
                                <span>
                                  {schedule.time} ({schedule.duration} min)
                                </span>
                              </div>
                              {schedule.interviewer && (
                                <div className="flex items-center gap-2 text-muted-foreground">
                                  <User className="h-4 w-4" />
                                  <span>{schedule.interviewer}</span>
                                </div>
                              )}
                            </div>

                            {schedule.notes && (
                              <p className="text-sm text-muted-foreground mt-3">
                                <strong>Notes:</strong> {schedule.notes}
                              </p>
                            )}
                          </div>

                          <div className="flex items-center gap-2">
                            {schedule.meetingLink && schedule.status === "Scheduled" && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => window.open(schedule.meetingLink, "_blank")}
                              >
                                <Video className="h-4 w-4 mr-2" />
                                Join
                                <ExternalLink className="h-3 w-3 ml-1" />
                              </Button>
                            )}
                            {schedule.status === "Scheduled" && (
                              <>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleComplete(schedule.id)}
                                >
                                  <Check className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleCancel(schedule.id)}
                                >
                                  <Ban className="h-4 w-4" />
                                </Button>
                              </>
                            )}
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete(schedule.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))
              )}
            </div>
          </main>
        </div>
      </div>

      {/* Create Schedule Modal */}
      <CreateScheduleModal
        show={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={refreshSchedules}
      />
    </PageTransition>
  );
};

// Create Schedule Modal Component
const CreateScheduleModal: React.FC<{
  show: boolean;
  onClose: () => void;
  onSuccess: () => void;
}> = ({ show, onClose, onSuccess }) => {
  const [formData, setFormData] = React.useState({
    candidateName: "",
    candidateEmail: "",
    jobTitle: "",
    interviewType: "Technical" as InterviewSchedule["interviewType"],
    date: "",
    time: "",
    duration: 60,
    meetingLink: "",
    interviewer: "",
    notes: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.candidateName || !formData.date || !formData.time) {
      toast.error("Please fill in all required fields");
      return;
    }

    scheduleSystem.create({
      ...formData,
      status: "Scheduled",
    });

    toast.success("Interview scheduled successfully!");
    onSuccess();
    onClose();
    setFormData({
      candidateName: "",
      candidateEmail: "",
      jobTitle: "",
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
          <h2 className="text-xl font-semibold">Schedule New Interview</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="candidateName">
                Candidate Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="candidateName"
                value={formData.candidateName}
                onChange={(e) => setFormData({ ...formData, candidateName: e.target.value })}
                required
              />
            </div>

            <div>
              <Label htmlFor="candidateEmail">Candidate Email</Label>
              <Input
                id="candidateEmail"
                type="email"
                value={formData.candidateEmail}
                onChange={(e) => setFormData({ ...formData, candidateEmail: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="jobTitle">Job Title</Label>
              <Input
                id="jobTitle"
                value={formData.jobTitle}
                onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="interviewType">Interview Type</Label>
              <Select
                value={formData.interviewType}
                onValueChange={(value) =>
                  setFormData({ ...formData, interviewType: value as InterviewSchedule["interviewType"] })
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
              <Label htmlFor="interviewer">Interviewer</Label>
              <Input
                id="interviewer"
                value={formData.interviewer}
                onChange={(e) => setFormData({ ...formData, interviewer: e.target.value })}
              />
            </div>
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

          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
              placeholder="Add any additional notes..."
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              Schedule Interview
            </Button>
          </div>
        </form>
      </motion.div>
    </AnimatePresence>
  );
};

export default SchedulePage;

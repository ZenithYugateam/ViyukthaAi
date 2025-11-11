import React from "react";
import Sidebar from "@/components/company-dashboard/Sidebar";
import TopNav from "@/components/company-dashboard/TopNav";
import { PageTransition } from "@/components/company-dashboard/PageTransition";
import { mockCandidateReports, CandidateReport } from "@/data/candidateAnalytics";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  CheckCircle2,
  XCircle,
  AlertCircle,
  Clock,
  Play,
  TrendingUp,
  TrendingDown,
  Award,
  MessageSquare,
  Code,
  Brain,
  Target,
  ThumbsUp,
  ThumbsDown,
  Pause,
  ArrowLeft,
  Download,
  Share2,
  Eye,
  RotateCw,
  EyeOff,
  Activity,
  User,
  ExternalLink,
  ArrowRight,
  FileText,
  Linkedin,
  Github,
  Globe,
  Calendar,
  StickyNote,
  Save,
  GitCompare,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { useParams, useNavigate } from "react-router-dom";

const CandidateAnalyticsPage: React.FC = () => {
  const { candidateId } = useParams<{ candidateId: string }>();
  const navigate = useNavigate();
  const [report, setReport] = React.useState<CandidateReport | null>(null);
  const [selectedQuestion, setSelectedQuestion] = React.useState<number>(0);
  const [actionLoading, setActionLoading] = React.useState(false);
  const [similarCandidates, setSimilarCandidates] = React.useState<CandidateReport[]>([]);
  const [videoRef, setVideoRef] = React.useState<HTMLIFrameElement | null>(null);
  const [showResumeModal, setShowResumeModal] = React.useState(false);
  const [notes, setNotes] = React.useState("");
  const [savedNotes, setSavedNotes] = React.useState<string>("");
  const [showScheduleModal, setShowScheduleModal] = React.useState(false);
  const [scheduleDate, setScheduleDate] = React.useState("");
  const [scheduleTime, setScheduleTime] = React.useState("");
  const [showCompareModal, setShowCompareModal] = React.useState(false);
  const [compareCandidate, setCompareCandidate] = React.useState<CandidateReport | null>(null);
  const [showComparison, setShowComparison] = React.useState(false);

  React.useEffect(() => {
    // Load candidate report
    const foundReport = mockCandidateReports.find((r) => r.id === candidateId);
    if (foundReport) {
      setReport(foundReport);
      
      // Load similar candidates
      if (foundReport.similarCandidates) {
        const similar = mockCandidateReports.filter((r) =>
          foundReport.similarCandidates?.includes(r.id)
        );
        setSimilarCandidates(similar);
      }
    }
  }, [candidateId]);
  
  const handleTimestampClick = (timestamp: string) => {
    toast.info(`Jumping to ${timestamp} in video`);
    // In real implementation, this would seek the video to the timestamp
  };
  
  const handleViewProfile = () => {
    navigate("/company-dashboard/quick-hire");
    toast.info("Opening candidate profile in Quick Hire");
  };
  
  const handleSaveNotes = () => {
    setSavedNotes(notes);
    localStorage.setItem(`notes-${candidateId}`, notes);
    toast.success("Notes saved successfully!");
  };
  
  const handleScheduleInterview = () => {
    if (!scheduleDate || !scheduleTime) {
      toast.error("Please select date and time");
      return;
    }
    toast.success(`Interview scheduled for ${scheduleDate} at ${scheduleTime}`);
    setShowScheduleModal(false);
  };
  
  const handleCompare = () => {
    setShowCompareModal(true);
  };
  
  const handleSelectCompareCandidate = (candidate: CandidateReport) => {
    setCompareCandidate(candidate);
    setShowCompareModal(false);
    setShowComparison(true);
    toast.success(`Comparing with ${candidate.candidateName}`);
  };
  
  const handleCloseComparison = () => {
    setShowComparison(false);
    setCompareCandidate(null);
  };
  
  React.useEffect(() => {
    if (candidateId) {
      const saved = localStorage.getItem(`notes-${candidateId}`);
      if (saved) {
        setNotes(saved);
        setSavedNotes(saved);
      }
    }
  }, [candidateId]);

  const handleStatusChange = async (newStatus: CandidateReport["status"]) => {
    if (!report) return;
    
    setActionLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    setReport({ ...report, status: newStatus });
    toast.success(`Candidate ${newStatus.toLowerCase()} successfully!`);
    setActionLoading(false);
  };

  const handleDownloadReport = () => {
    toast.success("Report downloaded successfully!");
  };

  const handleShareReport = () => {
    toast.success("Report link copied to clipboard!");
  };

  if (!report) {
    return (
      <PageTransition>
        <div className="flex min-h-screen bg-background">
          <Sidebar />
          <div className="flex-1 flex flex-col">
            <TopNav />
            <main className="p-4 md:p-6 flex items-center justify-center">
              <div className="text-center">
                <h2 className="text-2xl font-semibold mb-2">Report Not Found</h2>
                <p className="text-muted-foreground mb-4">The candidate report you're looking for doesn't exist.</p>
                <Button onClick={() => navigate("/company-dashboard/interviews")}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Interviews
                </Button>
              </div>
            </main>
          </div>
        </div>
      </PageTransition>
    );
  }

  const getStatusColor = (status: CandidateReport["status"]) => {
    switch (status) {
      case "Selected":
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "Rejected":
        return "bg-red-100 text-red-700 border-red-200";
      case "On Hold":
        return "bg-amber-100 text-amber-700 border-amber-200";
      default:
        return "bg-blue-100 text-blue-700 border-blue-200";
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-600";
    if (score >= 60) return "text-amber-600";
    return "text-red-600";
  };

  return (
    <PageTransition>
      <div className="flex min-h-screen bg-background">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <TopNav />
          <main className="p-4 md:p-6 space-y-6 max-w-[1600px] mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => navigate("/company-dashboard/interviews")}
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                  <h1 className="text-2xl font-semibold">{report.candidateName}</h1>
                  <p className="text-sm text-muted-foreground">
                    {report.jobTitle} • {report.interviewDate}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                {report.resumeUrl && (
                  <Button variant="outline" size="sm" onClick={() => setShowResumeModal(true)}>
                    <FileText className="h-4 w-4 mr-2" />
                    View Resume
                  </Button>
                )}
                <Button variant="outline" size="sm" onClick={() => setShowScheduleModal(true)}>
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule
                </Button>
                <Button 
                  variant={showComparison ? "default" : "outline"} 
                  size="sm" 
                  onClick={handleCompare}
                >
                  <GitCompare className="h-4 w-4 mr-2" />
                  {showComparison ? "Change Comparison" : "Compare"}
                </Button>
                <Button variant="outline" size="sm" onClick={handleDownloadReport}>
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
                <Button variant="outline" size="sm" onClick={handleShareReport}>
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>

            {/* Comparison Banner */}
            {showComparison && compareCandidate && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <Card className="bg-blue-50 border-blue-200">
                  <CardContent className="py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <GitCompare className="h-5 w-5 text-blue-600" />
                        <div>
                          <p className="font-semibold text-blue-900">
                            Comparing: {report.candidateName} vs {compareCandidate.candidateName}
                          </p>
                          <p className="text-sm text-blue-700">
                            Scroll down to see side-by-side comparison
                          </p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" onClick={handleCloseComparison}>
                        <X className="h-4 w-4" />
                        Close Comparison
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Score Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0 }}
              >
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Overall Score</span>
                      <Award className="h-5 w-5 text-amber-500" />
                    </div>
                    <div className={`text-3xl font-bold ${getScoreColor(report.overallScore)}`}>
                      {report.overallScore}%
                    </div>
                    <Progress value={report.overallScore} className="mt-2" />
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
                      <span className="text-sm text-muted-foreground">Correct</span>
                      <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                    </div>
                    <div className="text-3xl font-bold text-emerald-600">
                      {report.correctAnswers}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      of {report.totalQuestions} questions
                    </p>
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
                      <span className="text-sm text-muted-foreground">Wrong</span>
                      <XCircle className="h-5 w-5 text-red-500" />
                    </div>
                    <div className="text-3xl font-bold text-red-600">
                      {report.wrongAnswers}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      of {report.totalQuestions} questions
                    </p>
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
                      <span className="text-sm text-muted-foreground">Partial</span>
                      <AlertCircle className="h-5 w-5 text-amber-500" />
                    </div>
                    <div className="text-3xl font-bold text-amber-600">
                      {report.partiallyCorrect}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      of {report.totalQuestions} questions
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* AI Summary - Top Priority */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="border-2 border-primary/20">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Brain className="h-6 w-6 text-purple-500" />
                      AI Overall Assessment
                    </CardTitle>
                    <Badge variant="secondary">AI Powered</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-base leading-relaxed">{report.aiSummary}</p>
                  <div className="mt-4 flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={handleViewProfile}>
                      <User className="h-4 w-4 mr-2" />
                      View Full Profile
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => navigate("/company-dashboard/quick-hire")}>
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Quick Hire
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Sentiment & Behavioral Analysis */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-blue-500" />
                    Sentiment & Behavioral Analysis
                  </CardTitle>
                  <CardDescription>AI-powered analysis of non-verbal cues during interview</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Metrics Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-3 rounded-lg bg-muted">
                      <Eye className="h-5 w-5 mx-auto mb-2 text-blue-500" />
                      <div className="text-2xl font-bold">{report.sentimentAnalysis.eyeBlinkCount}</div>
                      <p className="text-xs text-muted-foreground">Eye Blinks</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {report.sentimentAnalysis.averageBlinkRate}/min
                      </p>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-muted">
                      <RotateCw className="h-5 w-5 mx-auto mb-2 text-amber-500" />
                      <div className="text-2xl font-bold">{report.sentimentAnalysis.headRotations}</div>
                      <p className="text-xs text-muted-foreground">Head Rotations</p>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-muted">
                      <EyeOff className="h-5 w-5 mx-auto mb-2 text-red-500" />
                      <div className="text-2xl font-bold">{report.sentimentAnalysis.lookAwayCount}</div>
                      <p className="text-xs text-muted-foreground">Look Away</p>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-muted">
                      <Activity className="h-5 w-5 mx-auto mb-2 text-emerald-500" />
                      <div className="text-2xl font-bold">{report.sentimentAnalysis.overallEngagement}%</div>
                      <p className="text-xs text-muted-foreground">Engagement</p>
                    </div>
                  </div>

                  {/* Behavioral Scores */}
                  <div className="space-y-3">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">Attentiveness</span>
                        <span className="text-sm text-muted-foreground">
                          {report.sentimentAnalysis.attentiveness}%
                        </span>
                      </div>
                      <Progress value={report.sentimentAnalysis.attentiveness} />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">Nervousness</span>
                        <span className="text-sm text-muted-foreground">
                          {report.sentimentAnalysis.nervousness}%
                        </span>
                      </div>
                      <Progress value={report.sentimentAnalysis.nervousness} className="[&>div]:bg-amber-500" />
                    </div>
                  </div>

                  {/* Timeline Events */}
                  <div>
                    <h4 className="text-sm font-medium mb-2">Key Behavioral Events</h4>
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {report.sentimentAnalysis.timestamps.map((event, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleTimestampClick(event.time)}
                          className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-muted transition-colors text-left"
                        >
                          <div className="flex items-center gap-2">
                            {event.event === "blink" && <Eye className="h-4 w-4 text-blue-500" />}
                            {event.event === "rotation" && <RotateCw className="h-4 w-4 text-amber-500" />}
                            {event.event === "look_away" && <EyeOff className="h-4 w-4 text-red-500" />}
                            <span className="text-sm capitalize">{event.event.replace("_", " ")}</span>
                            {event.duration && (
                              <Badge variant="outline" className="text-xs">{event.duration}</Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="text-xs">{event.time}</Badge>
                            <Play className="h-3 w-3" />
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Main Content */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              {/* Left Column - Video & Questions */}
              <div className="xl:col-span-2 space-y-6">
                {/* Video Player */}
                {report.videoUrl && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Play className="h-5 w-5" />
                          Interview Recording
                        </CardTitle>
                        <CardDescription>Duration: {report.interviewDuration}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="aspect-video rounded-lg overflow-hidden bg-muted">
                          <iframe
                            width="100%"
                            height="100%"
                            src={report.videoUrl}
                            title="Interview Recording"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          ></iframe>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}

                {/* Questions Analysis */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle>Question-by-Question Analysis</CardTitle>
                      <CardDescription>
                        Detailed AI-powered evaluation of each response
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Question Tabs */}
                      <div className="flex gap-2 overflow-x-auto pb-2">
                        {report.questions.map((q, idx) => (
                          <Button
                            key={q.id}
                            variant={selectedQuestion === idx ? "default" : "outline"}
                            size="sm"
                            onClick={() => setSelectedQuestion(idx)}
                            className="flex-shrink-0"
                          >
                            Q{idx + 1}
                            {q.isCorrect ? (
                              <CheckCircle2 className="h-3 w-3 ml-1" />
                            ) : (
                              <XCircle className="h-3 w-3 ml-1" />
                            )}
                          </Button>
                        ))}
                      </div>

                      <AnimatePresence mode="wait">
                        <motion.div
                          key={selectedQuestion}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          transition={{ duration: 0.2 }}
                          className="space-y-4"
                        >
                          {(() => {
                            const q = report.questions[selectedQuestion];
                            return (
                              <>
                                {/* Question Header */}
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                      <Badge variant="outline">{q.questionType}</Badge>
                                      {q.videoTimestamp && (
                                        <Badge variant="secondary" className="flex items-center gap-1">
                                          <Clock className="h-3 w-3" />
                                          {q.videoTimestamp}
                                        </Badge>
                                      )}
                                    </div>
                                    <h4 className="font-semibold text-lg">{q.questionText}</h4>
                                  </div>
                                  <div className="text-right">
                                    <div className={`text-2xl font-bold ${getScoreColor((q.score / q.maxScore) * 100)}`}>
                                      {q.score}/{q.maxScore}
                                    </div>
                                  </div>
                                </div>

                                <Separator />

                                {/* Candidate Answer */}
                                <div>
                                  <h5 className="text-sm font-medium mb-2">Candidate's Answer:</h5>
                                  <div className="p-3 rounded-lg bg-muted">
                                    <pre className="whitespace-pre-wrap text-sm font-mono">
                                      {q.candidateAnswer}
                                    </pre>
                                  </div>
                                </div>

                                {/* AI Analysis */}
                                <div>
                                  <h5 className="text-sm font-medium mb-2 flex items-center gap-2">
                                    <Brain className="h-4 w-4 text-purple-500" />
                                    AI Analysis:
                                  </h5>
                                  <p className="text-sm text-muted-foreground">{q.aiAnalysis}</p>
                                </div>

                                {/* Strengths & Weaknesses */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div>
                                    <h5 className="text-sm font-medium mb-2 flex items-center gap-2 text-emerald-600">
                                      <TrendingUp className="h-4 w-4" />
                                      Strengths:
                                    </h5>
                                    <ul className="space-y-1">
                                      {q.strengths.map((s, i) => (
                                        <li key={i} className="text-sm flex items-start gap-2">
                                          <CheckCircle2 className="h-4 w-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                                          <span>{s}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                  {q.weaknesses.length > 0 && (
                                    <div>
                                      <h5 className="text-sm font-medium mb-2 flex items-center gap-2 text-red-600">
                                        <TrendingDown className="h-4 w-4" />
                                        Weaknesses:
                                      </h5>
                                      <ul className="space-y-1">
                                        {q.weaknesses.map((w, i) => (
                                          <li key={i} className="text-sm flex items-start gap-2">
                                            <XCircle className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
                                            <span>{w}</span>
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}
                                </div>
                              </>
                            );
                          })()}
                        </motion.div>
                      </AnimatePresence>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>

              {/* Right Column - Summary & Actions */}
              <div className="space-y-6">
                {/* Status & Actions */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle>Decision</CardTitle>
                      <CardDescription>Current status and actions</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Status:</span>
                        <Badge className={getStatusColor(report.status)}>{report.status}</Badge>
                      </div>

                      <Separator />

                      <div className="space-y-2">
                        <Button
                          className="w-full bg-emerald-600 hover:bg-emerald-700"
                          disabled={actionLoading || report.status === "Selected"}
                          onClick={() => handleStatusChange("Selected")}
                        >
                          <ThumbsUp className="h-4 w-4 mr-2" />
                          {report.status === "Selected" ? "Selected" : "Accept Candidate"}
                        </Button>
                        <Button
                          variant="outline"
                          className="w-full"
                          disabled={actionLoading || report.status === "On Hold"}
                          onClick={() => handleStatusChange("On Hold")}
                        >
                          <Pause className="h-4 w-4 mr-2" />
                          {report.status === "On Hold" ? "On Hold" : "Put On Hold"}
                        </Button>
                        <Button
                          variant="destructive"
                          className="w-full"
                          disabled={actionLoading || report.status === "Rejected"}
                          onClick={() => handleStatusChange("Rejected")}
                        >
                          <ThumbsDown className="h-4 w-4 mr-2" />
                          {report.status === "Rejected" ? "Rejected" : "Reject Candidate"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* AI Summary */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Brain className="h-5 w-5 text-purple-500" />
                        AI Summary
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{report.aiSummary}</p>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Technical Skills */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Code className="h-5 w-5" />
                        Technical Skills
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {report.technicalSkills.map((skill) => (
                        <div key={skill.skill}>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium">{skill.skill}</span>
                            <span className="text-sm text-muted-foreground">
                              {skill.rating}/{skill.maxRating}
                            </span>
                          </div>
                          <Progress value={(skill.rating / skill.maxRating) * 100} />
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Soft Skills */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.9 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <MessageSquare className="h-5 w-5" />
                        Soft Skills
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {report.softSkills.map((skill) => (
                        <div key={skill.skill}>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium">{skill.skill}</span>
                            <span className="text-sm text-muted-foreground">
                              {skill.rating}/{skill.maxRating}
                            </span>
                          </div>
                          <Progress value={(skill.rating / skill.maxRating) * 100} />
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Recommendations */}
                {report.recommendations.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.0 }}
                  >
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Target className="h-5 w-5 text-blue-500" />
                          Recommendations
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {report.recommendations.map((rec, i) => (
                            <li key={i} className="text-sm flex items-start gap-2">
                              <CheckCircle2 className="h-4 w-4 text-blue-500 flex-shrink-0 mt-0.5" />
                              <span>{rec}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}

                {/* Red Flags */}
                {report.redFlags.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.1 }}
                  >
                    <Card className="border-red-200">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-red-600">
                          <AlertCircle className="h-5 w-5" />
                          Red Flags
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {report.redFlags.map((flag, i) => (
                            <li key={i} className="text-sm flex items-start gap-2">
                              <XCircle className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
                              <span>{flag}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </div>
            </div>

            {/* Similar Candidates Recommendations */}
            {similarCandidates.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
              >
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <Target className="h-5 w-5 text-blue-500" />
                          Similar Candidates Who Performed Better
                        </CardTitle>
                        <CardDescription>
                          AI-recommended candidates with similar profiles and higher scores
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {similarCandidates.map((candidate) => (
                        <motion.div
                          key={candidate.id}
                          whileHover={{ scale: 1.02 }}
                          className="cursor-pointer"
                          onClick={() => navigate(`/company-dashboard/candidate/${candidate.id}`)}
                        >
                          <Card className="hover:shadow-lg transition-all">
                            <CardContent className="pt-6">
                              <div className="flex items-start gap-3 mb-3">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                                  {candidate.candidateName.charAt(0)}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h4 className="font-semibold truncate">{candidate.candidateName}</h4>
                                  <p className="text-sm text-muted-foreground truncate">
                                    {candidate.jobTitle}
                                  </p>
                                </div>
                              </div>

                              <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <span className="text-xs text-muted-foreground">Score</span>
                                  <div className="flex items-center gap-2">
                                    <span className={`text-lg font-bold ${getScoreColor(candidate.overallScore)}`}>
                                      {candidate.overallScore}%
                                    </span>
                                    {candidate.overallScore > report.overallScore && (
                                      <Badge variant="secondary" className="text-xs">
                                        +{candidate.overallScore - report.overallScore}%
                                      </Badge>
                                    )}
                                  </div>
                                </div>

                                <Progress value={candidate.overallScore} className="h-2" />

                                <div className="flex items-center justify-between text-xs">
                                  <span className="text-muted-foreground">Status</span>
                                  <Badge className={`${getStatusColor(candidate.status)} text-xs`}>
                                    {candidate.status}
                                  </Badge>
                                </div>

                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="w-full mt-2"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(`/company-dashboard/candidate/${candidate.id}`);
                                  }}
                                >
                                  View Analytics
                                  <ArrowRight className="h-3 w-3 ml-2" />
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Recruiter Notes Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <StickyNote className="h-5 w-5 text-blue-500" />
                    Recruiter Notes
                  </CardTitle>
                  <CardDescription>Add private notes about this candidate</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Textarea
                    placeholder="Add your notes here... (e.g., cultural fit, salary expectations, availability)"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={6}
                    className="resize-none"
                  />
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-muted-foreground">
                      {savedNotes && "Last saved: " + new Date().toLocaleString()}
                    </p>
                    <Button onClick={handleSaveNotes} disabled={notes === savedNotes}>
                      <Save className="h-4 w-4 mr-2" />
                      Save Notes
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Contact Links */}
            {(report.linkedinUrl || report.githubUrl || report.portfolioUrl) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.4 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Professional Links</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-3">
                      {report.linkedinUrl && (
                        <Button
                          variant="outline"
                          onClick={() => window.open(report.linkedinUrl, "_blank")}
                        >
                          <Linkedin className="h-4 w-4 mr-2" />
                          LinkedIn
                        </Button>
                      )}
                      {report.githubUrl && (
                        <Button
                          variant="outline"
                          onClick={() => window.open(report.githubUrl, "_blank")}
                        >
                          <Github className="h-4 w-4 mr-2" />
                          GitHub
                        </Button>
                      )}
                      {report.portfolioUrl && (
                        <Button
                          variant="outline"
                          onClick={() => window.open(report.portfolioUrl, "_blank")}
                        >
                          <Globe className="h-4 w-4 mr-2" />
                          Portfolio
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </main>
        </div>
      </div>

      {/* Resume Modal */}
      <AnimatePresence>
        {showResumeModal && report.resumeUrl && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50"
              onClick={() => setShowResumeModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-4 md:inset-10 bg-background rounded-lg shadow-2xl z-50 flex flex-col"
            >
              <div className="flex items-center justify-between p-4 border-b">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  {report.candidateName}'s Resume
                </h2>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(report.resumeUrl, "_blank")}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowResumeModal(false)}
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              </div>
              <div className="flex-1 overflow-hidden">
                <iframe
                  src={`${report.resumeUrl}#view=FitH`}
                  className="w-full h-full"
                  title="Resume"
                />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Schedule Interview Modal */}
      <AnimatePresence>
        {showScheduleModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50"
              onClick={() => setShowScheduleModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-background rounded-lg shadow-2xl z-50"
            >
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      Schedule Follow-up Interview
                    </CardTitle>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setShowScheduleModal(false)}
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </div>
                  <CardDescription>Schedule next round with {report.candidateName}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="schedule-date">Date</Label>
                    <Input
                      id="schedule-date"
                      type="date"
                      value={scheduleDate}
                      onChange={(e) => setScheduleDate(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="schedule-time">Time</Label>
                    <Input
                      id="schedule-time"
                      type="time"
                      value={scheduleTime}
                      onChange={(e) => setScheduleTime(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => setShowScheduleModal(false)}
                    >
                      Cancel
                    </Button>
                    <Button className="flex-1" onClick={handleScheduleInterview}>
                      Schedule
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Candidate Selection Modal for Comparison */}
      <AnimatePresence>
        {showCompareModal && report && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50"
              onClick={() => setShowCompareModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl max-h-[80vh] bg-background rounded-lg shadow-2xl z-[60] overflow-hidden flex flex-col"
            >
              <div className="flex items-center justify-between p-4 border-b bg-background">
                <div>
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    <GitCompare className="h-5 w-5" />
                    Select Candidate to Compare
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Choose another candidate to compare with {report.candidateName}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowCompareModal(false)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <div className="flex-1 overflow-y-auto p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {mockCandidateReports
                    .filter((c) => c.id !== candidateId)
                    .map((candidate) => (
                      <Card
                        key={candidate.id}
                        className="cursor-pointer hover:border-primary transition-all"
                        onClick={() => handleSelectCompareCandidate(candidate)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h3 className="font-semibold">{candidate.candidateName}</h3>
                              <p className="text-sm text-muted-foreground">{candidate.jobTitle}</p>
                            </div>
                            <Badge className={getStatusColor(candidate.status)}>
                              {candidate.status}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                              <p className="text-muted-foreground">Score</p>
                              <p className={`font-bold ${getScoreColor(candidate.overallScore)}`}>
                                {candidate.overallScore}%
                              </p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Date</p>
                              <p className="font-medium">{candidate.interviewDate}</p>
                            </div>
                          </div>
                          <Button className="w-full mt-3" size="sm">
                            Select for Comparison
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Side-by-Side Comparison View */}
      <AnimatePresence>
        {showComparison && compareCandidate && report && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background z-[70] overflow-y-auto"
          >
            <div className="flex min-h-screen">
              <Sidebar />
              <div className="flex-1 flex flex-col">
                <TopNav />
                <main className="p-4 md:p-6 space-y-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h1 className="text-2xl font-bold">Candidate Comparison</h1>
                      <p className="text-sm text-muted-foreground mt-1">
                        Comparing {report.candidateName} vs {compareCandidate.candidateName}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" onClick={() => setShowCompareModal(true)}>
                        Change Candidate
                      </Button>
                      <Button onClick={handleCloseComparison}>
                        <X className="h-4 w-4 mr-2" />
                        Close Comparison
                      </Button>
                    </div>
                  </div>

                  {/* Comparison Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Current Candidate */}
                    <Card className="border-2 border-primary shadow-lg">
                      <CardHeader className="bg-primary/5">
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle>{report.candidateName}</CardTitle>
                            <CardDescription>{report.jobTitle}</CardDescription>
                          </div>
                          <Badge className={getStatusColor(report.status)}>
                            {report.status}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-6 space-y-4">
                        <div>
                          <h3 className="font-semibold mb-2">Overall Score</h3>
                          <div className={`text-4xl font-bold ${getScoreColor(report.overallScore)}`}>
                            {report.overallScore}%
                          </div>
                          <Progress value={report.overallScore} className="mt-2" />
                        </div>
                        <Separator />
                        <div className="grid grid-cols-3 gap-4 text-center">
                          <div>
                            <p className="text-2xl font-bold text-emerald-600">
                              {report.correctAnswers}
                            </p>
                            <p className="text-xs text-muted-foreground">Correct</p>
                          </div>
                          <div>
                            <p className="text-2xl font-bold text-red-600">
                              {report.wrongAnswers}
                            </p>
                            <p className="text-xs text-muted-foreground">Wrong</p>
                          </div>
                          <div>
                            <p className="text-2xl font-bold text-amber-600">
                              {report.partiallyCorrect}
                            </p>
                            <p className="text-xs text-muted-foreground">Partial</p>
                          </div>
                        </div>
                        <Separator />
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Interview Date</span>
                            <span className="text-sm font-medium">{report.interviewDate}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Duration</span>
                            <span className="text-sm font-medium">{report.interviewDuration}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Total Questions</span>
                            <span className="text-sm font-medium">{report.totalQuestions}</span>
                          </div>
                        </div>
                        <Button 
                          className="w-full" 
                          onClick={() => navigate(`/company-dashboard/candidate/${report.id}`)}
                        >
                          View Full Report
                        </Button>
                      </CardContent>
                    </Card>

                    {/* Comparison Candidate */}
                    <Card className="border-2 border-blue-500 shadow-lg">
                      <CardHeader className="bg-blue-50 dark:bg-blue-950">
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle>{compareCandidate.candidateName}</CardTitle>
                            <CardDescription>{compareCandidate.jobTitle}</CardDescription>
                          </div>
                          <Badge className={getStatusColor(compareCandidate.status)}>
                            {compareCandidate.status}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-6 space-y-4">
                        <div>
                          <h3 className="font-semibold mb-2">Overall Score</h3>
                          <div className={`text-4xl font-bold ${getScoreColor(compareCandidate.overallScore)}`}>
                            {compareCandidate.overallScore}%
                          </div>
                          <Progress value={compareCandidate.overallScore} className="mt-2" />
                        </div>
                        <Separator />
                        <div className="grid grid-cols-3 gap-4 text-center">
                          <div>
                            <p className="text-2xl font-bold text-emerald-600">
                              {compareCandidate.correctAnswers}
                            </p>
                            <p className="text-xs text-muted-foreground">Correct</p>
                          </div>
                          <div>
                            <p className="text-2xl font-bold text-red-600">
                              {compareCandidate.wrongAnswers}
                            </p>
                            <p className="text-xs text-muted-foreground">Wrong</p>
                          </div>
                          <div>
                            <p className="text-2xl font-bold text-amber-600">
                              {compareCandidate.partiallyCorrect}
                            </p>
                            <p className="text-xs text-muted-foreground">Partial</p>
                          </div>
                        </div>
                        <Separator />
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Interview Date</span>
                            <span className="text-sm font-medium">{compareCandidate.interviewDate}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Duration</span>
                            <span className="text-sm font-medium">{compareCandidate.interviewDuration}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Total Questions</span>
                            <span className="text-sm font-medium">{compareCandidate.totalQuestions}</span>
                          </div>
                        </div>
                        <Button 
                          className="w-full" 
                          variant="outline"
                          onClick={() => navigate(`/company-dashboard/candidate/${compareCandidate.id}`)}
                        >
                          View Full Report
                        </Button>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Detailed Comparison Table */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Detailed Comparison</CardTitle>
                      <CardDescription>Side-by-side metrics comparison</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b">
                              <th className="text-left py-3 px-4 font-semibold">Metric</th>
                              <th className="text-center py-3 px-4 font-semibold bg-primary/5">{report.candidateName}</th>
                              <th className="text-center py-3 px-4 font-semibold bg-blue-50 dark:bg-blue-950">{compareCandidate.candidateName}</th>
                              <th className="text-center py-3 px-4 font-semibold">Winner</th>
                            </tr>
                          </thead>
                          <tbody>
                            {/* Overall Score */}
                            <tr className="border-b hover:bg-muted/50">
                              <td className="py-3 px-4 font-medium">Overall Score</td>
                              <td className="text-center py-3 px-4 bg-primary/5">
                                <span className={`text-2xl font-bold ${getScoreColor(report.overallScore)}`}>
                                  {report.overallScore}%
                                </span>
                              </td>
                              <td className="text-center py-3 px-4 bg-blue-50 dark:bg-blue-950">
                                <span className={`text-2xl font-bold ${getScoreColor(compareCandidate.overallScore)}`}>
                                  {compareCandidate.overallScore}%
                                </span>
                              </td>
                              <td className="text-center py-3 px-4">
                                {report.overallScore > compareCandidate.overallScore ? (
                                  <div className="flex items-center justify-center gap-1">
                                    <TrendingUp className="h-4 w-4 text-emerald-600" />
                                    <span className="font-semibold text-emerald-600">{report.candidateName}</span>
                                    <span className="text-xs text-muted-foreground">+{report.overallScore - compareCandidate.overallScore}%</span>
                                  </div>
                                ) : report.overallScore < compareCandidate.overallScore ? (
                                  <div className="flex items-center justify-center gap-1">
                                    <TrendingUp className="h-4 w-4 text-emerald-600" />
                                    <span className="font-semibold text-emerald-600">{compareCandidate.candidateName}</span>
                                    <span className="text-xs text-muted-foreground">+{compareCandidate.overallScore - report.overallScore}%</span>
                                  </div>
                                ) : (
                                  <Badge variant="secondary">Tie</Badge>
                                )}
                              </td>
                            </tr>

                            {/* Correct Answers */}
                            <tr className="border-b hover:bg-muted/50">
                              <td className="py-3 px-4 font-medium">Correct Answers</td>
                              <td className="text-center py-3 px-4 bg-primary/5">
                                <span className="text-xl font-bold text-emerald-600">{report.correctAnswers}</span>
                              </td>
                              <td className="text-center py-3 px-4 bg-blue-50 dark:bg-blue-950">
                                <span className="text-xl font-bold text-emerald-600">{compareCandidate.correctAnswers}</span>
                              </td>
                              <td className="text-center py-3 px-4">
                                {report.correctAnswers > compareCandidate.correctAnswers ? (
                                  <div className="flex items-center justify-center gap-1">
                                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                                    <span className="font-semibold text-emerald-600">{report.candidateName}</span>
                                    <span className="text-xs text-muted-foreground">+{report.correctAnswers - compareCandidate.correctAnswers}</span>
                                  </div>
                                ) : report.correctAnswers < compareCandidate.correctAnswers ? (
                                  <div className="flex items-center justify-center gap-1">
                                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                                    <span className="font-semibold text-emerald-600">{compareCandidate.candidateName}</span>
                                    <span className="text-xs text-muted-foreground">+{compareCandidate.correctAnswers - report.correctAnswers}</span>
                                  </div>
                                ) : (
                                  <Badge variant="secondary">Tie</Badge>
                                )}
                              </td>
                            </tr>

                            {/* Wrong Answers */}
                            <tr className="border-b hover:bg-muted/50">
                              <td className="py-3 px-4 font-medium">Wrong Answers</td>
                              <td className="text-center py-3 px-4 bg-primary/5">
                                <span className="text-xl font-bold text-red-600">{report.wrongAnswers}</span>
                              </td>
                              <td className="text-center py-3 px-4 bg-blue-50 dark:bg-blue-950">
                                <span className="text-xl font-bold text-red-600">{compareCandidate.wrongAnswers}</span>
                              </td>
                              <td className="text-center py-3 px-4">
                                {report.wrongAnswers < compareCandidate.wrongAnswers ? (
                                  <div className="flex items-center justify-center gap-1">
                                    <TrendingDown className="h-4 w-4 text-emerald-600" />
                                    <span className="font-semibold text-emerald-600">{report.candidateName}</span>
                                    <span className="text-xs text-muted-foreground">-{compareCandidate.wrongAnswers - report.wrongAnswers}</span>
                                  </div>
                                ) : report.wrongAnswers > compareCandidate.wrongAnswers ? (
                                  <div className="flex items-center justify-center gap-1">
                                    <TrendingDown className="h-4 w-4 text-emerald-600" />
                                    <span className="font-semibold text-emerald-600">{compareCandidate.candidateName}</span>
                                    <span className="text-xs text-muted-foreground">-{report.wrongAnswers - compareCandidate.wrongAnswers}</span>
                                  </div>
                                ) : (
                                  <Badge variant="secondary">Tie</Badge>
                                )}
                              </td>
                            </tr>

                            {/* Partial Answers */}
                            <tr className="border-b hover:bg-muted/50">
                              <td className="py-3 px-4 font-medium">Partial Answers</td>
                              <td className="text-center py-3 px-4 bg-primary/5">
                                <span className="text-xl font-bold text-amber-600">{report.partiallyCorrect}</span>
                              </td>
                              <td className="text-center py-3 px-4 bg-blue-50 dark:bg-blue-950">
                                <span className="text-xl font-bold text-amber-600">{compareCandidate.partiallyCorrect}</span>
                              </td>
                              <td className="text-center py-3 px-4">
                                {report.partiallyCorrect !== compareCandidate.partiallyCorrect ? (
                                  <span className="text-sm text-muted-foreground">
                                    {Math.abs(report.partiallyCorrect - compareCandidate.partiallyCorrect)} difference
                                  </span>
                                ) : (
                                  <Badge variant="secondary">Tie</Badge>
                                )}
                              </td>
                            </tr>

                            {/* Total Questions */}
                            <tr className="border-b hover:bg-muted/50">
                              <td className="py-3 px-4 font-medium">Total Questions</td>
                              <td className="text-center py-3 px-4 bg-primary/5">
                                <span className="text-lg font-semibold">{report.totalQuestions}</span>
                              </td>
                              <td className="text-center py-3 px-4 bg-blue-50 dark:bg-blue-950">
                                <span className="text-lg font-semibold">{compareCandidate.totalQuestions}</span>
                              </td>
                              <td className="text-center py-3 px-4">
                                <span className="text-sm text-muted-foreground">-</span>
                              </td>
                            </tr>

                            {/* Interview Duration */}
                            <tr className="border-b hover:bg-muted/50">
                              <td className="py-3 px-4 font-medium">Interview Duration</td>
                              <td className="text-center py-3 px-4 bg-primary/5">
                                <span className="text-lg font-semibold">{report.interviewDuration}</span>
                              </td>
                              <td className="text-center py-3 px-4 bg-blue-50 dark:bg-blue-950">
                                <span className="text-lg font-semibold">{compareCandidate.interviewDuration}</span>
                              </td>
                              <td className="text-center py-3 px-4">
                                <span className="text-sm text-muted-foreground">-</span>
                              </td>
                            </tr>

                            {/* Interview Date */}
                            <tr className="hover:bg-muted/50">
                              <td className="py-3 px-4 font-medium">Interview Date</td>
                              <td className="text-center py-3 px-4 bg-primary/5">
                                <span className="text-sm">{report.interviewDate}</span>
                              </td>
                              <td className="text-center py-3 px-4 bg-blue-50 dark:bg-blue-950">
                                <span className="text-sm">{compareCandidate.interviewDate}</span>
                              </td>
                              <td className="text-center py-3 px-4">
                                <span className="text-sm text-muted-foreground">-</span>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Quick Summary */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950 dark:to-emerald-900 border-emerald-200">
                      <CardContent className="pt-6">
                        <div className="text-center">
                          <Award className="h-8 w-8 mx-auto mb-2 text-emerald-600" />
                          <h3 className="font-semibold text-emerald-900 dark:text-emerald-100 mb-1">Recommended</h3>
                          <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">
                            {report.overallScore > compareCandidate.overallScore
                              ? report.candidateName
                              : report.overallScore < compareCandidate.overallScore
                              ? compareCandidate.candidateName
                              : "Both Equal"}
                          </p>
                          {report.overallScore !== compareCandidate.overallScore && (
                            <p className="text-sm text-emerald-600 dark:text-emerald-400 mt-1">
                              {Math.abs(report.overallScore - compareCandidate.overallScore)}% higher score
                            </p>
                          )}
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200">
                      <CardContent className="pt-6">
                        <div className="text-center">
                          <Target className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                          <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">Accuracy Leader</h3>
                          <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                            {report.correctAnswers > compareCandidate.correctAnswers
                              ? report.candidateName
                              : report.correctAnswers < compareCandidate.correctAnswers
                              ? compareCandidate.candidateName
                              : "Both Equal"}
                          </p>
                          {report.correctAnswers !== compareCandidate.correctAnswers && (
                            <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
                              {Math.abs(report.correctAnswers - compareCandidate.correctAnswers)} more correct
                            </p>
                          )}
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border-purple-200">
                      <CardContent className="pt-6">
                        <div className="text-center">
                          <Brain className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                          <h3 className="font-semibold text-purple-900 dark:text-purple-100 mb-1">Consistency</h3>
                          <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                            {report.wrongAnswers < compareCandidate.wrongAnswers
                              ? report.candidateName
                              : report.wrongAnswers > compareCandidate.wrongAnswers
                              ? compareCandidate.candidateName
                              : "Both Equal"}
                          </p>
                          {report.wrongAnswers !== compareCandidate.wrongAnswers && (
                            <p className="text-sm text-purple-600 dark:text-purple-400 mt-1">
                              {Math.abs(report.wrongAnswers - compareCandidate.wrongAnswers)} fewer errors
                            </p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </main>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageTransition>
  );
};

export default CandidateAnalyticsPage;

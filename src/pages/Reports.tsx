import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Target, 
  Award, 
  Calendar,
  MessageSquare,
  Brain,
  CheckCircle2,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Clock
} from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";

type InterviewReport = {
  id: string;
  session_id: string;
  overall_score: number;
  technical_knowledge: number;
  communication_skills: number;
  confidence_level: number;
  problem_solving: number;
  ai_summary: string;
  strengths: string[] | null;
  improvements: string[] | null;
  conversation_history: any;
  created_at: string;
  session: {
    category: string;
    level: string;
    completed_at: string;
  };
};

const Reports = () => {
  const [reports, setReports] = useState<InterviewReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedReport, setExpandedReport] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      // Fetch interview sessions with their reports
      const { data: sessions, error: sessionsError } = await supabase
        .from("interview_sessions")
        .select(`
          id,
          category,
          level,
          completed_at,
          interview_reports (*)
        `)
        .eq("user_id", user.id)
        .not("completed_at", "is", null)
        .order("completed_at", { ascending: false });

      if (sessionsError) throw sessionsError;

      // Flatten the data structure
      const reportsData: InterviewReport[] = [];
      sessions?.forEach((session: any) => {
        if (session.interview_reports && session.interview_reports.length > 0) {
          session.interview_reports.forEach((report: any) => {
            reportsData.push({
              ...report,
              session: {
                category: session.category,
                level: session.level,
                completed_at: session.completed_at,
              },
            });
          });
        }
      });

      setReports(reportsData);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to load reports",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Calculate metrics from reports
  const totalInterviews = reports.length;
  const averageScore = reports.length > 0
    ? Math.round(reports.reduce((sum, r) => sum + r.overall_score, 0) / reports.length)
    : 0;
  const averageTechnical = reports.length > 0
    ? Math.round(reports.reduce((sum, r) => sum + r.technical_knowledge, 0) / reports.length)
    : 0;
  const averageCommunication = reports.length > 0
    ? Math.round(reports.reduce((sum, r) => sum + r.communication_skills, 0) / reports.length)
    : 0;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCategory = (category: string) => {
    return category.charAt(0).toUpperCase() + category.slice(1);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-amber-600";
    return "text-red-600";
  };

  const getScoreBadgeVariant = (score: number): "default" | "secondary" | "destructive" => {
    if (score >= 80) return "default";
    if (score >= 60) return "secondary";
    return "destructive";
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Report Analysis</h1>
          <p className="text-muted-foreground mt-2">Your mock interview performance reports</p>
        </div>
        <Card className="p-12">
          <div className="text-center text-muted-foreground">Loading reports...</div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Report Analysis</h1>
        <p className="text-muted-foreground mt-2">Your mock interview performance reports and analysis</p>
      </div>

      {/* Key Metrics */}
      {reports.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="p-6 card-shadow hover:card-shadow-hover transition-smooth">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <MessageSquare className="w-6 h-6" />
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Total Interviews</p>
              <p className="text-3xl font-bold text-foreground">{totalInterviews}</p>
            </div>
          </Card>

          <Card className="p-6 card-shadow hover:card-shadow-hover transition-smooth">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <Award className="w-6 h-6" />
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Average Score</p>
              <p className={cn("text-3xl font-bold", getScoreColor(averageScore))}>{averageScore}%</p>
            </div>
          </Card>

          <Card className="p-6 card-shadow hover:card-shadow-hover transition-smooth">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <Brain className="w-6 h-6" />
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Technical Knowledge</p>
              <p className={cn("text-3xl font-bold", getScoreColor(averageTechnical))}>{averageTechnical}%</p>
            </div>
          </Card>

          <Card className="p-6 card-shadow hover:card-shadow-hover transition-smooth">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <Users className="w-6 h-6" />
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Communication</p>
              <p className={cn("text-3xl font-bold", getScoreColor(averageCommunication))}>{averageCommunication}%</p>
            </div>
          </Card>
        </div>
      )}

      {/* Interview Reports */}
      {reports.length === 0 ? (
        <Card className="p-12">
          <div className="text-center">
            <MessageSquare className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">No Reports Yet</h3>
            <p className="text-muted-foreground mb-4">
              Complete a mock interview to see your performance analysis here.
            </p>
            <Button onClick={() => window.location.href = "/interviews"}>
              Start Mock Interview
            </Button>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {reports.map((report) => {
            const isExpanded = expandedReport === report.id;
            const conversationHistory = report.conversation_history || [];
            const userMessages = conversationHistory.filter((msg: any) => msg.role === "user");

            return (
              <motion.div
                key={report.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="card-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <CardTitle className="text-xl">
                            {formatCategory(report.session.category)} Interview
                          </CardTitle>
                          <Badge variant="outline">{report.session.level}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(report.session.completed_at)}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">Overall Score</p>
                          <p className={cn("text-2xl font-bold", getScoreColor(report.overall_score))}>
                            {report.overall_score}%
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setExpandedReport(isExpanded ? null : report.id)}
                        >
                          {isExpanded ? (
                            <ChevronUp className="w-5 h-5" />
                          ) : (
                            <ChevronDown className="w-5 h-5" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardHeader>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <CardContent className="space-y-6 pt-0">
                          {/* Score Breakdown */}
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div>
                              <p className="text-sm text-muted-foreground mb-2">Technical Knowledge</p>
                              <Progress value={report.technical_knowledge} className="h-2 mb-1" />
                              <p className={cn("text-lg font-semibold", getScoreColor(report.technical_knowledge))}>
                                {report.technical_knowledge}%
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground mb-2">Communication</p>
                              <Progress value={report.communication_skills} className="h-2 mb-1" />
                              <p className={cn("text-lg font-semibold", getScoreColor(report.communication_skills))}>
                                {report.communication_skills}%
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground mb-2">Confidence</p>
                              <Progress value={report.confidence_level} className="h-2 mb-1" />
                              <p className={cn("text-lg font-semibold", getScoreColor(report.confidence_level))}>
                                {report.confidence_level}%
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground mb-2">Problem Solving</p>
                              <Progress value={report.problem_solving} className="h-2 mb-1" />
                              <p className={cn("text-lg font-semibold", getScoreColor(report.problem_solving))}>
                                {report.problem_solving}%
                              </p>
                            </div>
                          </div>

                          {/* AI Summary */}
                          <div>
                            <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                              <Brain className="w-4 h-4" />
                              AI Analysis Summary
                            </h4>
                            <p className="text-muted-foreground leading-relaxed">{report.ai_summary}</p>
                          </div>

                          {/* Strengths */}
                          {report.strengths && report.strengths.length > 0 && (
                            <div>
                              <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-green-600" />
                                Strengths
                              </h4>
                              <ul className="space-y-2">
                                {report.strengths.map((strength, idx) => (
                                  <li key={idx} className="flex items-start gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                                    <span className="text-muted-foreground">{strength}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {/* Improvements */}
                          {report.improvements && report.improvements.length > 0 && (
                            <div>
                              <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                                <AlertCircle className="w-4 h-4 text-amber-600" />
                                Areas for Improvement
                              </h4>
                              <ul className="space-y-2">
                                {report.improvements.map((improvement, idx) => (
                                  <li key={idx} className="flex items-start gap-2">
                                    <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                                    <span className="text-muted-foreground">{improvement}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {/* Conversation History - Candidate Responses */}
                          {userMessages.length > 0 && (
                            <div>
                              <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                                <MessageSquare className="w-4 h-4" />
                                Your Responses ({userMessages.length} answers)
                              </h4>
                              <div className="space-y-3 max-h-96 overflow-y-auto">
                                {userMessages.map((msg: any, idx: number) => (
                                  <div
                                    key={idx}
                                    className="bg-secondary/50 rounded-lg p-4 border border-border"
                                  >
                                    <div className="flex items-start gap-3">
                                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                        <span className="text-sm font-semibold text-primary">{idx + 1}</span>
                                      </div>
                                      <div className="flex-1">
                                        <p className="text-sm font-medium text-muted-foreground mb-1">
                                          Your Answer:
                                        </p>
                                        <p className="text-foreground whitespace-pre-wrap">{msg.content}</p>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Reports;

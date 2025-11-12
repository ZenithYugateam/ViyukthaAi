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
  Clock,
  Download
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

  const handleDownloadReport = (report: InterviewReport) => {
    try {
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 15;
      let yPos = margin;
      const lineHeight = 7;
      const sectionSpacing = 10;

      const checkNewPage = (requiredSpace: number) => {
        if (yPos + requiredSpace > pageHeight - margin) {
          pdf.addPage();
          yPos = margin;
          return true;
        }
        return false;
      };

      const addText = (text: string, x: number, y: number, maxWidth: number, fontSize: number = 10) => {
        pdf.setFontSize(fontSize);
        const lines = pdf.splitTextToSize(text, maxWidth);
        pdf.text(lines, x, y);
        return lines.length * (fontSize * 0.4);
      };

      // Header
      pdf.setFillColor(30, 58, 138);
      pdf.rect(0, 0, pageWidth, 40, 'F');
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(24);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Interview Report', margin, 25);
      
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, margin, 35);
      
      yPos = 50;
      pdf.setTextColor(0, 0, 0);

      // Interview Information
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Interview Information', margin, yPos);
      yPos += lineHeight + 2;

      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      yPos += addText(`Category: ${formatCategory(report.session.category)}`, margin, yPos, pageWidth - 2 * margin);
      yPos += lineHeight;
      yPos += addText(`Level: ${report.session.level}`, margin, yPos, pageWidth - 2 * margin);
      yPos += lineHeight;
      yPos += addText(`Date: ${formatDate(report.session.completed_at)}`, margin, yPos, pageWidth - 2 * margin);
      yPos += sectionSpacing;

      // Overall Score
      checkNewPage(30);
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Overall Performance', margin, yPos);
      yPos += lineHeight + 2;

      pdf.setFontSize(32);
      pdf.setFont('helvetica', 'bold');
      const scoreColor = report.overall_score >= 80 ? [34, 197, 94] : report.overall_score >= 60 ? [251, 191, 36] : [239, 68, 68];
      pdf.setTextColor(...scoreColor);
      pdf.text(`${report.overall_score}%`, margin, yPos);
      pdf.setTextColor(0, 0, 0);
      yPos += lineHeight + 5;

      // Score Breakdown
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Score Breakdown', margin, yPos);
      yPos += lineHeight + 2;

      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      yPos += addText(`Technical Knowledge: ${report.technical_knowledge}%`, margin, yPos, pageWidth - 2 * margin);
      yPos += lineHeight;
      yPos += addText(`Communication Skills: ${report.communication_skills}%`, margin, yPos, pageWidth - 2 * margin);
      yPos += lineHeight;
      yPos += addText(`Confidence Level: ${report.confidence_level}%`, margin, yPos, pageWidth - 2 * margin);
      yPos += lineHeight;
      yPos += addText(`Problem Solving: ${report.problem_solving}%`, margin, yPos, pageWidth - 2 * margin);
      yPos += sectionSpacing;

      // AI Summary
      if (report.ai_summary) {
        checkNewPage(40);
        pdf.setFontSize(16);
        pdf.setFont('helvetica', 'bold');
        pdf.text('AI Assessment Summary', margin, yPos);
        yPos += lineHeight + 2;

        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        const summaryHeight = addText(report.ai_summary, margin, yPos, pageWidth - 2 * margin);
        yPos += summaryHeight + sectionSpacing;
      }

      // Strengths
      if (report.strengths && report.strengths.length > 0) {
        checkNewPage(30);
        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(34, 197, 94);
        pdf.text('Strengths', margin, yPos);
        pdf.setTextColor(0, 0, 0);
        yPos += lineHeight + 2;

        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        report.strengths.forEach((strength) => {
          checkNewPage(8);
          pdf.text(`• ${strength}`, margin + 5, yPos);
          yPos += lineHeight;
        });
        yPos += sectionSpacing - 5;
      }

      // Areas for Improvement
      if (report.improvements && report.improvements.length > 0) {
        checkNewPage(30);
        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(251, 191, 36);
        pdf.text('Areas for Improvement', margin, yPos);
        pdf.setTextColor(0, 0, 0);
        yPos += lineHeight + 2;

        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        report.improvements.forEach((improvement) => {
          checkNewPage(8);
          pdf.text(`• ${improvement}`, margin + 5, yPos);
          yPos += lineHeight;
        });
        yPos += sectionSpacing - 5;
      }

      // Conversation History
      if (report.conversation_history && Array.isArray(report.conversation_history)) {
        const userMessages = report.conversation_history.filter((msg: any) => msg.role === "user");
        if (userMessages.length > 0) {
          checkNewPage(40);
          pdf.setFontSize(16);
          pdf.setFont('helvetica', 'bold');
          pdf.text('Your Responses', margin, yPos);
          yPos += lineHeight + 3;

          userMessages.forEach((msg: any, index: number) => {
            checkNewPage(20);
            pdf.setFontSize(10);
            pdf.setFont('helvetica', 'normal');
            const responseHeight = addText(`Q${index + 1}: ${msg.content || 'No response'}`, margin + 5, yPos, pageWidth - 2 * margin - 5);
            yPos += responseHeight + 5;
          });
        }
      }

      // Footer
      const totalPages = pdf.internal.pages.length - 1;
      for (let i = 1; i <= totalPages; i++) {
        pdf.setPage(i);
        pdf.setFontSize(8);
        pdf.setTextColor(128, 128, 128);
        pdf.text(
          `Page ${i} of ${totalPages}`,
          pageWidth / 2,
          pageHeight - 10,
          { align: 'center' }
        );
      }

      const fileName = `Interview_Report_${formatCategory(report.session.category)}_${formatDate(report.session.completed_at).replace(/\s+/g, '_')}.pdf`;
      pdf.save(fileName);
      
      toast({
        title: "Success",
        description: "Report downloaded successfully!",
      });
    } catch (error) {
      console.error("Error downloading report:", error);
      toast({
        title: "Error",
        description: "Failed to download report. Please try again.",
        variant: "destructive",
      });
    }
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
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownloadReport(report)}
                          className="hidden sm:flex"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </Button>
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

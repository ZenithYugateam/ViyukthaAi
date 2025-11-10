import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Calendar, FileText, TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { PerformanceReport } from "./PerformanceReport";

interface InterviewSession {
  id: string;
  category: string;
  level: string;
  total_questions: number;
  completed_at: string;
  report?: {
    overall_score: number;
    technical_knowledge: number;
    communication_skills: number;
    confidence_level: number;
    problem_solving: number;
    ai_summary: string;
    strengths: string[];
    improvements: string[];
  };
}

export const InterviewHistory = () => {
  const [sessions, setSessions] = useState<InterviewSession[]>([]);
  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: sessionsData, error: sessionsError } = await supabase
        .from("interview_sessions")
        .select("*")
        .not("completed_at", "is", null) // Only show completed interviews
        .order("completed_at", { ascending: false })
        .limit(10);

      if (sessionsError) throw sessionsError;

      // Load reports for each session
      const sessionsWithReports = await Promise.all(
        (sessionsData || []).map(async (session) => {
          const { data: reportData } = await supabase
            .from("interview_reports")
            .select("*")
            .eq("session_id", session.id)
            .single();

          return {
            ...session,
            report: reportData || undefined,
          };
        })
      );

      setSessions(sessionsWithReports);
    } catch (error: any) {
      toast({
        title: "Error loading history",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card className="p-6">
        <p className="text-muted-foreground text-center">Loading interview history...</p>
      </Card>
    );
  }

  if (sessions.length === 0) {
    return (
      <Card className="p-6">
        <p className="text-muted-foreground text-center">No interview history yet. Start your first mock interview!</p>
      </Card>
    );
  }

  return (
    <>
      <Card className="p-6">
        <h3 className="text-xl font-semibold mb-4 text-foreground">Mock Interview History</h3>
        <ScrollArea className="h-[500px] pr-4">
          <div className="space-y-3">
            {sessions.map((session) => (
              <Card key={session.id} className="p-4 bg-muted/50 border-border hover:border-primary/50 transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="capitalize">
                        {session.category}
                      </Badge>
                      {session.level && (
                        <Badge variant="outline" className="capitalize">
                          {session.level}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(session.completed_at).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <FileText className="w-3 h-3" />
                        {session.total_questions} questions
                      </span>
                      {session.report && (
                        <span className="flex items-center gap-1 font-medium text-foreground">
                          <TrendingUp className="w-3 h-3" />
                          Score: {session.report.overall_score}%
                        </span>
                      )}
                    </div>
                  </div>
                  {session.report && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedReport(session.report)}
                    >
                      View Report
                    </Button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </Card>

      {selectedReport && (
        <PerformanceReport
          report={selectedReport}
          onClose={() => setSelectedReport(null)}
        />
      )}
    </>
  );
};

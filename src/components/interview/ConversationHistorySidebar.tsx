import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, MessageSquare, Calendar, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
interface InterviewSession {
  id: string;
  category: string;
  level: string;
  created_at: string;
  completed_at: string | null;
  interview_reports?: {
    overall_score: number;
  }[];
}
export const ConversationHistorySidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [sessions, setSessions] = useState<InterviewSession[]>([]);
  useEffect(() => {
    fetchInterviewHistory();
  }, []);
  const fetchInterviewHistory = async () => {
    try {
      const {
        data: {
          user
        }
      } = await supabase.auth.getUser();
      if (!user) return;
      const {
        data,
        error
      } = await supabase.from("interview_sessions").select(`
          id,
          category,
          level,
          created_at,
          completed_at,
          interview_reports (
            overall_score
          )
        `).eq("user_id", user.id).order("created_at", {
        ascending: false
      }).limit(10);
      if (error) throw error;
      setSessions(data || []);
    } catch (error) {
      console.error("Error fetching interview history:", error);
    }
  };
  return <div className={`h-full bg-card border-r border-border transition-all duration-300 flex flex-col ${isCollapsed ? "w-14" : "w-64"}`}>
      {/* Header */}
      <div className="p-3 border-b border-border flex items-center justify-between">
        {!isCollapsed}
        
      </div>

      {/* Content */}
      {!isCollapsed && <ScrollArea className="flex-1">
          <div className="p-2 space-y-2">
            {sessions.length === 0 ? <div className="text-center py-8 px-4">
                <MessageSquare className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-xs text-muted-foreground">
                  No interview history yet
                </p>
              </div> : sessions.map(session => <div key={session.id} className="p-3 rounded-lg bg-background hover:bg-accent/50 cursor-pointer transition-colors border border-border">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-medium capitalize truncate">
                        {session.category}
                      </h4>
                      <p className="text-xs text-muted-foreground capitalize">
                        {session.level}
                      </p>
                    </div>
                    {session.interview_reports?.[0]?.overall_score && <div className="flex items-center gap-1 ml-2">
                        <Award className="h-3 w-3 text-primary" />
                        <span className="text-xs font-medium">
                          {session.interview_reports[0].overall_score}/10
                        </span>
                      </div>}
                  </div>
                  
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <span>
                      {format(new Date(session.created_at), "MMM d, yyyy")}
                    </span>
                  </div>
                  
                  {session.completed_at ? <div className="mt-2">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-green-500/10 text-green-500">
                        Completed
                      </span>
                    </div> : <div className="mt-2">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-yellow-500/10 text-yellow-500">
                        In Progress
                      </span>
                    </div>}
                </div>)}
          </div>
        </ScrollArea>}

      {/* Collapsed View - Just Icons */}
      {isCollapsed && <div className="flex-1 flex flex-col items-center gap-3 py-3">
          <MessageSquare className="h-5 w-5 text-muted-foreground" />
        </div>}
    </div>;
};
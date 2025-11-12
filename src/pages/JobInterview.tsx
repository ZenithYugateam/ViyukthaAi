import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { mockData, InterviewSession } from "@/data/mock-company-dashboard";
import AIInterview from "./AIInterview";

// This component wraps AIInterview and adapts it for job-specific interviews
const JobInterview = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [job, setJob] = useState(mockData.getJobById(jobId || ""));
  const [questions, setQuestions] = useState(mockData.getQuestionsByJobId(jobId || ""));
  const [sessionId, setSessionId] = useState<string | null>(null);
  
  useEffect(() => {
    if (!jobId || !job) {
      toast({
        title: "Job not found",
        description: "The job you're looking for doesn't exist.",
        variant: "destructive",
      });
      navigate("/jobs");
      return;
    }
    
    if (questions.length === 0) {
      toast({
        title: "No questions available",
        description: "This job doesn't have interview questions set up yet.",
        variant: "destructive",
      });
      navigate("/jobs");
      return;
    }
    
    // Organize questions by rounds: General -> Technical -> HR
    const generalQuestions = questions.filter(q => !q.interviewRound || q.interviewRound === "General");
    const technicalQuestions = questions.filter(q => q.interviewRound === "Technical");
    const hrQuestions = questions.filter(q => q.interviewRound === "HR");
    
    // Combine in order: General, Technical, HR
    const orderedQuestions = [...generalQuestions, ...technicalQuestions, ...hrQuestions];
    
    // Create interview session
    const session: InterviewSession = {
      id: `SESSION-${Date.now()}`,
      jobId: jobId,
      candidateId: `CAND-${Date.now()}`, // In real app, get from auth
      candidateName: "Candidate", // In real app, get from auth
      candidateEmail: "candidate@example.com", // In real app, get from auth
      startedAt: new Date().toISOString(),
      status: "In Progress",
      questions: orderedQuestions.map((q, index) => ({
        questionId: q.id,
        questionText: q.text,
        answer: "",
        timeSpent: 0,
      })),
    };
    
    mockData.addInterviewSession(session);
    setSessionId(session.id);
    
    // Store session ID and job questions in sessionStorage for AIInterview to access
    sessionStorage.setItem('currentInterviewSession', session.id);
    sessionStorage.setItem('currentJobId', jobId);
    sessionStorage.setItem('currentJobQuestions', JSON.stringify(orderedQuestions));
  }, [jobId, job, questions.length, navigate, toast]);
  
  if (!sessionId || !job) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg">Setting up interview...</p>
        </div>
      </div>
    );
  }
  
  // Render AIInterview with job context via URL params
  return <AIInterview />;
};

export default JobInterview;


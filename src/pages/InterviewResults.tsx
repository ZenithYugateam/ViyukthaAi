import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { mockData } from "@/data/mock-company-dashboard";
import { CheckCircle2, Clock, TrendingUp, Award, Video } from "lucide-react";
import { motion } from "framer-motion";

const InterviewResults = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const [session, setSession] = useState(mockData.getInterviewSessionById(sessionId || ""));
  const [job, setJob] = useState(session ? mockData.getJobById(session.jobId) : null);

  useEffect(() => {
    if (!sessionId || !session) {
      navigate("/jobs");
      return;
    }
    if (session.jobId) {
      setJob(mockData.getJobById(session.jobId));
    }
  }, [sessionId, session, navigate]);

  if (!session) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  const totalQuestions = session.questions.length;
  const answeredQuestions = session.questions.filter(q => q.answer && q.answer.trim() !== "").length;
  const averageAccuracy = session.questions.length > 0
    ? session.questions.reduce((sum, q) => sum + (q.accuracy || 0), 0) / session.questions.length
    : 0;
  const totalTime = session.questions.reduce((sum, q) => sum + q.timeSpent, 0);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Thank You Message */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-6"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
              <CheckCircle2 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-1">Thank You for Completing the Interview!</h2>
              <p className="text-muted-foreground">
                Your responses have been recorded and analyzed. Review your performance below.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Interview Results</h1>
            <p className="text-muted-foreground">
              {job?.title || "Job Interview"} - {new Date(session.completedAt || session.startedAt).toLocaleDateString()}
            </p>
          </div>
          <Button onClick={() => navigate("/jobs")}>Back to Jobs</Button>
        </div>

        {/* Video Recording Section */}
        {session.videoUrl && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Video className="h-5 w-5" />
                Interview Video Recording
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative rounded-lg overflow-hidden bg-black aspect-video">
                <video
                  src={session.videoUrl}
                  controls
                  className="w-full h-full"
                  poster="/video-placeholder.jpg"
                >
                  Your browser does not support the video tag.
                </video>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Questions Answered</p>
                  <h3 className="text-2xl font-bold">{answeredQuestions} / {totalQuestions}</h3>
                </div>
                <CheckCircle2 className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Average Accuracy</p>
                  <h3 className="text-2xl font-bold">{averageAccuracy.toFixed(1)}%</h3>
                </div>
                <TrendingUp className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total Time</p>
                  <h3 className="text-2xl font-bold">{formatTime(totalTime)}</h3>
                </div>
                <Clock className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Overall Score</p>
                  <h3 className="text-2xl font-bold">{session.totalScore?.toFixed(1) || "N/A"}</h3>
                </div>
                <Award className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Question-by-Question Analysis */}
        <Card>
          <CardHeader>
            <CardTitle>Question Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {session.questions.map((q, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="border rounded-lg p-4 space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline">Q{index + 1}</Badge>
                        <span className="text-sm text-muted-foreground">
                          Time: {formatTime(q.timeSpent)}
                        </span>
                      </div>
                      <h4 className="font-semibold mb-2">{q.questionText}</h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        <strong>Your Answer:</strong> {q.answer || "No answer provided"}
                      </p>
                      {q.answerAnalysis && (
                        <div className="mt-2 p-3 bg-amber-50 dark:bg-amber-950 rounded-lg border border-amber-200 dark:border-amber-800">
                          <p className="text-sm font-medium text-amber-900 dark:text-amber-100 mb-1">
                            Answer Analysis:
                          </p>
                          <p className="text-sm text-amber-800 dark:text-amber-200">
                            {q.answerAnalysis}
                          </p>
                        </div>
                      )}
                      {q.correctedAnswer && (
                        <div className="mt-2 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
                          <p className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-1">
                            Corrected/Expected Answer:
                          </p>
                          <p className="text-sm text-blue-800 dark:text-blue-200">
                            {q.correctedAnswer}
                          </p>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      {q.accuracy !== undefined ? (
                        <>
                          <Badge
                            variant={q.accuracy >= 70 ? "default" : q.accuracy >= 50 ? "secondary" : "destructive"}
                            className="text-lg"
                          >
                            {q.accuracy.toFixed(1)}%
                          </Badge>
                          <Progress value={q.accuracy} className="w-24" />
                        </>
                      ) : (
                        <Badge variant="outline">Pending Evaluation</Badge>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Overall Analysis */}
        {session.aiRemarks && (
          <Card>
            <CardHeader>
              <CardTitle>AI Analysis & Remarks</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground whitespace-pre-wrap">{session.aiRemarks}</p>
            </CardContent>
          </Card>
        )}

        {/* Status */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Interview Status</p>
                <Badge
                  variant={
                    session.overallStatus === "Passed" ? "default" :
                    session.overallStatus === "Failed" ? "destructive" :
                    "secondary"
                  }
                  className="text-lg"
                >
                  {session.overallStatus || session.status}
                </Badge>
              </div>
              <Button onClick={() => navigate("/jobs")}>Continue Browsing Jobs</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default InterviewResults;


import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, TrendingUp, TrendingDown } from "lucide-react";

interface PerformanceReportProps {
  report: {
    overall_score: number;
    technical_knowledge: number;
    communication_skills: number;
    confidence_level: number;
    problem_solving: number;
    ai_summary: string;
    strengths: string[];
    improvements: string[];
  };
  onClose: () => void;
  onDownload?: () => void;
}

export const PerformanceReport = ({ report, onClose, onDownload }: PerformanceReportProps) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Good";
    if (score >= 40) return "Average";
    return "Needs Improvement";
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-card border-border">
        <div className="p-6 md:p-8 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">Performance Report</h2>
              <p className="text-sm text-muted-foreground mt-1">Your interview performance analysis</p>
            </div>
            {onDownload && (
              <Button variant="outline" size="sm" onClick={onDownload}>
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            )}
          </div>

          {/* Overall Score */}
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20 p-6">
            <div className="text-center space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Overall Score</p>
              <div className={`text-5xl md:text-6xl font-bold ${getScoreColor(report.overall_score)}`}>
                {report.overall_score}
              </div>
              <Badge variant="secondary" className="text-sm">
                {getScoreLabel(report.overall_score)}
              </Badge>
            </div>
          </Card>

          {/* Category Scores */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Category Breakdown</h3>
            <div className="grid gap-4 md:grid-cols-2">
              {[
                { label: "Technical Knowledge", value: report.technical_knowledge },
                { label: "Communication Skills", value: report.communication_skills },
                { label: "Confidence Level", value: report.confidence_level },
                { label: "Problem Solving", value: report.problem_solving },
              ].map((category) => (
                <Card key={category.label} className="p-4 bg-card border-border">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-foreground">{category.label}</span>
                      <span className={`text-lg font-bold ${getScoreColor(category.value)}`}>
                        {category.value}%
                      </span>
                    </div>
                    <Progress value={category.value} className="h-2" />
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* AI Summary */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-foreground">AI Analysis</h3>
            <Card className="p-4 bg-muted/50 border-border">
              <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                {report.ai_summary}
              </p>
            </Card>
          </div>

          {/* Strengths */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              Strengths
            </h3>
            <div className="space-y-2">
              {report.strengths.map((strength, idx) => (
                <Card key={idx} className="p-3 bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-900">
                  <p className="text-sm text-foreground">✓ {strength}</p>
                </Card>
              ))}
            </div>
          </div>

          {/* Areas for Improvement */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <TrendingDown className="w-5 h-5 text-yellow-600" />
              Areas for Improvement
            </h3>
            <div className="space-y-2">
              {report.improvements.map((improvement, idx) => (
                <Card key={idx} className="p-3 bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-900">
                  <p className="text-sm text-foreground">• {improvement}</p>
                </Card>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            <Button onClick={onClose}>
              Back to Dashboard
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

const steps = [
  { title: "Complete Profile", completed: true },
  { title: "Upload Resume", completed: true },
  { title: "Add Portfolio Projects", completed: true },
  { title: "Take Mock Interview", completed: false },
  { title: "Apply to 5 Jobs", completed: false },
];

export const ProfileCompletionCard = () => {
  const completionPercentage = (steps.filter(s => s.completed).length / steps.length) * 100;

  return (
    <Card className="p-6 card-shadow hover:card-shadow-hover transition-all duration-300 transform hover:scale-[1.02] hover:-translate-y-1 cursor-pointer">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-1">Profile Completion</h3>
          <p className="text-sm text-muted-foreground">Complete your profile to get better matches</p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-primary">{Math.round(completionPercentage)}%</div>
        </div>
      </div>

      <Progress value={completionPercentage} className="h-2 mb-6" />

      <div className="space-y-3">
        {steps.map((step, index) => (
          <div key={index} className="flex items-center gap-3">
            {step.completed ? (
              <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0" />
            ) : (
              <Circle className="w-5 h-5 text-muted-foreground flex-shrink-0" />
            )}
            <span className={cn(
              "text-sm",
              step.completed ? "text-foreground" : "text-muted-foreground"
            )}>
              {step.title}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
};

import { Card } from "@/components/ui/card";
import { FileText, Video, Briefcase, Award } from "lucide-react";
import { cn } from "@/lib/utils";

const activities = [
  {
    id: 1,
    type: "resume",
    title: "Resume Updated",
    description: "You updated your resume with new projects",
    time: "2 hours ago",
    icon: FileText,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  {
    id: 2,
    type: "interview",
    title: "Mock Interview Completed",
    description: "Score: 85/100 - Great performance!",
    time: "1 day ago",
    icon: Video,
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
  },
  {
    id: 3,
    type: "application",
    title: "Applied to Frontend Developer",
    description: "Tech Innovations Inc.",
    time: "2 days ago",
    icon: Briefcase,
    color: "text-green-500",
    bgColor: "bg-green-500/10",
  },
  {
    id: 4,
    type: "achievement",
    title: "Achievement Unlocked",
    description: "Completed 10 mock interviews",
    time: "3 days ago",
    icon: Award,
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
  },
];

export const ActivityTimeline = () => {
  return (
    <Card className="p-6 card-shadow hover:card-shadow-hover transition-all duration-300 transform hover:scale-[1.02] hover:-translate-y-1">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-foreground mb-1">Recent Activity</h3>
        <p className="text-sm text-muted-foreground">Your latest actions and achievements</p>
      </div>

      <div className="space-y-4">
        {activities.map((activity, index) => (
          <div key={activity.id} className="flex gap-4 transition-all duration-300 hover:bg-accent/5 -mx-2 px-2 rounded-lg cursor-pointer">
            <div className="flex flex-col items-center">
              <div className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0",
                activity.bgColor
              )}>
                <activity.icon className={cn("w-5 h-5", activity.color)} />
              </div>
              {index < activities.length - 1 && (
                <div className="w-px h-full bg-border mt-2" />
              )}
            </div>

            <div className="flex-1 pb-4">
              <h4 className="font-semibold text-foreground mb-1">{activity.title}</h4>
              <p className="text-sm text-muted-foreground mb-1">{activity.description}</p>
              <p className="text-xs text-muted-foreground">{activity.time}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

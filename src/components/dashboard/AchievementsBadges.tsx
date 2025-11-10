import { Card } from "@/components/ui/card";
import { Trophy, Target, Zap, Star, Award, Crown } from "lucide-react";
import { cn } from "@/lib/utils";

const achievements = [
  { 
    id: 1, 
    title: "First Application", 
    icon: Target, 
    unlocked: true,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10" 
  },
  { 
    id: 2, 
    title: "Interview Master", 
    icon: Trophy, 
    unlocked: true,
    color: "text-amber-500",
    bgColor: "bg-amber-500/10" 
  },
  { 
    id: 3, 
    title: "Quick Learner", 
    icon: Zap, 
    unlocked: true,
    color: "text-purple-500",
    bgColor: "bg-purple-500/10" 
  },
  { 
    id: 4, 
    title: "5-Star Profile", 
    icon: Star, 
    unlocked: false,
    color: "text-gray-400",
    bgColor: "bg-gray-100" 
  },
  { 
    id: 5, 
    title: "Top Performer", 
    icon: Award, 
    unlocked: false,
    color: "text-gray-400",
    bgColor: "bg-gray-100" 
  },
  { 
    id: 6, 
    title: "Career Champion", 
    icon: Crown, 
    unlocked: false,
    color: "text-gray-400",
    bgColor: "bg-gray-100" 
  },
];

export const AchievementsBadges = () => {
  const unlockedCount = achievements.filter(a => a.unlocked).length;

  return (
    <Card className="p-6 card-shadow hover:card-shadow-hover transition-all duration-300 transform hover:scale-[1.02] hover:-translate-y-1">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-1">Achievements</h3>
          <p className="text-sm text-muted-foreground">
            {unlockedCount} of {achievements.length} unlocked
          </p>
        </div>
        <div className="text-3xl">🏆</div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {achievements.map((achievement) => (
          <div
            key={achievement.id}
            className={cn(
              "flex flex-col items-center p-4 rounded-xl transition-all duration-300",
              achievement.unlocked 
                ? "hover:scale-110 cursor-pointer hover:shadow-md" 
                : "opacity-50 cursor-not-allowed",
              achievement.bgColor
            )}
          >
            <div className={cn(
              "w-12 h-12 rounded-xl flex items-center justify-center mb-2",
              achievement.unlocked ? "bg-white shadow-sm" : "bg-gray-200"
            )}>
              <achievement.icon className={cn("w-6 h-6", achievement.color)} />
            </div>
            <p className={cn(
              "text-xs font-medium text-center",
              achievement.unlocked ? "text-foreground" : "text-muted-foreground"
            )}>
              {achievement.title}
            </p>
          </div>
        ))}
      </div>
    </Card>
  );
};

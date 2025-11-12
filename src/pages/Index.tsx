import { ProfileCompletionCard } from "@/components/dashboard/ProfileCompletionCard";
import { AnalyticsCard } from "@/components/dashboard/AnalyticsCard";
import { JobRecommendations } from "@/components/dashboard/JobRecommendations";
import { UpcomingInterviews } from "@/components/dashboard/UpcomingInterviews";
import { ActivityTimeline } from "@/components/dashboard/ActivityTimeline";
import { AchievementsBadges } from "@/components/dashboard/AchievementsBadges";
import { TalentPoolCard } from "@/components/dashboard/TalentPoolCard";
import { AnimatedSearchBar } from "@/components/AnimatedSearchBar";
import { Briefcase, TrendingUp, FileCheck, Target } from "lucide-react";

const Index = () => {
  return (
    <>
      {/* Animated Search Bar */}
      <AnimatedSearchBar />
      
      {/* Analytics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-4 md:mb-6">
            <AnalyticsCard
              title="Applications Sent"
              value={24}
              change={12}
              icon={<Briefcase className="w-6 h-6" />}
              gradient
            />
            <AnalyticsCard
              title="Profile Views"
              value={156}
              change={23}
              icon={<TrendingUp className="w-6 h-6" />}
            />
            <AnalyticsCard
              title="Interview Invites"
              value={8}
              change={15}
              icon={<Target className="w-6 h-6" />}
            />
            <AnalyticsCard
              title="Resume Score"
              value="85%"
              change={5}
              icon={<FileCheck className="w-6 h-6" />}
            />
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 mb-4 md:mb-6">
            <div className="lg:col-span-2 space-y-4 md:space-y-6">
              <JobRecommendations />
              <ActivityTimeline />
            </div>
            
            <div className="space-y-4 md:space-y-6">
              <TalentPoolCard />
              <ProfileCompletionCard />
              <UpcomingInterviews />
              <AchievementsBadges />
            </div>
          </div>
    </>
  );
};

export default Index;

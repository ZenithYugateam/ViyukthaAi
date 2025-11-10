import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Briefcase, Clock, Bookmark } from "lucide-react";

const jobs = [
  {
    id: 1,
    title: "Frontend Developer Intern",
    company: "Tech Innovations Inc.",
    logo: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=100&h=100&fit=crop",
    location: "Remote",
    type: "Internship",
    postedAt: "2 days ago",
    matchScore: 95,
    salary: "$1,500/month",
  },
  {
    id: 2,
    title: "UI/UX Designer",
    company: "Creative Studios",
    logo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=100&h=100&fit=crop",
    location: "New York, NY",
    type: "Full-time",
    postedAt: "1 week ago",
    matchScore: 88,
    salary: "$60k - $75k",
  },
  {
    id: 3,
    title: "Junior Software Engineer",
    company: "StartupX",
    logo: "https://images.unsplash.com/photo-1572044162444-ad60f128bdea?w=100&h=100&fit=crop",
    location: "San Francisco, CA",
    type: "Full-time",
    postedAt: "3 days ago",
    matchScore: 92,
    salary: "$80k - $95k",
  },
];

export const JobRecommendations = () => {
  return (
    <Card className="p-6 card-shadow hover:card-shadow-hover transition-all duration-300 transform hover:scale-[1.02] hover:-translate-y-1">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-1">AI-Recommended Jobs</h3>
          <p className="text-sm text-muted-foreground">Based on your profile and preferences</p>
        </div>
        <Button variant="outline" size="sm">View All</Button>
      </div>

      <div className="space-y-4">
        {jobs.map((job) => (
          <div 
            key={job.id} 
            className="p-4 rounded-xl border border-border hover:border-primary/50 transition-all duration-300 cursor-pointer group hover:shadow-md hover:scale-[1.02]"
          >
            <div className="flex gap-4 mb-3">
              {/* Company Logo */}
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-lg overflow-hidden bg-secondary border border-border">
                  <img 
                    src={job.logo} 
                    alt={`${job.company} logo`}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                  <h4 className="font-semibold text-foreground group-hover:text-primary transition-smooth">
                    {job.title}
                  </h4>
                  <Badge className="gradient-accent text-white border-0">
                    {job.matchScore}% Match
                  </Badge>
                </div>
                    <p className="text-sm text-muted-foreground font-medium">{job.company}</p>
                  </div>
                  <Button variant="ghost" size="icon">
                    <Bookmark className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-3 ml-16">
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {job.location}
              </div>
              <div className="flex items-center gap-1">
                <Briefcase className="w-4 h-4" />
                {job.type}
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {job.postedAt}
              </div>
            </div>

            <div className="flex items-center justify-between ml-16">
              <span className="text-sm font-semibold text-primary">{job.salary}</span>
              <Button size="sm" className="gradient-primary">Apply Now</Button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

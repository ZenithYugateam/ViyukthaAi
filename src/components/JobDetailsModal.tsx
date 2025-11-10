import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Bookmark, Ban, Share2, MapPin, Briefcase, Clock, DollarSign, Users, Flag } from "lucide-react";

interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  type: string;
  experience: string;
  salary: string;
  posted: string;
  applicants: number;
  tags: string[];
  description: string;
  logo: string;
  workMode: string;
  matchScore: number;
  matchLevel: string;
}

interface JobDetailsModalProps {
  job: Job | null;
  isOpen: boolean;
  onClose: () => void;
}

export const JobDetailsModal = ({ job, isOpen, onClose }: JobDetailsModalProps) => {
  if (!job) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
        <div className="sticky top-0 bg-background z-10 border-b px-8 py-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-foreground mb-2">{job.title}</h2>
              <a 
                href="#" 
                className="text-primary hover:underline flex items-center gap-1 mb-2"
                onClick={(e) => e.preventDefault()}
              >
                {job.company} <ExternalLink className="w-4 h-4" />
              </a>
              <p className="text-muted-foreground">{job.location}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 mt-6">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
              Apply on company site <ExternalLink className="w-4 h-4 ml-2" />
            </Button>
            <Button variant="outline" size="icon">
              <Bookmark className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="icon">
              <Ban className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="icon">
              <Share2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="px-8 py-6 space-y-8">
          {/* Profile Insights */}
          <div>
            <h3 className="text-xl font-bold text-foreground mb-2">Profile insights</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Here's how the job qualifications align with your{" "}
              <a href="#" className="text-primary hover:underline">profile</a>.
            </p>
            
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Briefcase className="w-5 h-5" />
                  <h4 className="font-semibold">Skills</h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {job.tags.map((skill, index) => (
                    <Badge 
                      key={index}
                      variant="outline"
                      className="bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-400 dark:border-green-800"
                    >
                      ✓ {skill}
                    </Badge>
                  ))}
                  <button className="text-sm text-muted-foreground hover:text-foreground">
                    + show more
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Job Details */}
          <div>
            <h3 className="text-xl font-bold text-foreground mb-2">Job details</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Here's how the job details align with your{" "}
              <a href="#" className="text-primary hover:underline">profile</a>.
            </p>
            
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Briefcase className="w-5 h-5" />
                  <h4 className="font-semibold">Job type</h4>
                </div>
                <Badge 
                  variant="outline"
                  className="bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-400 dark:border-green-800"
                >
                  ✓ {job.type}
                </Badge>
              </div>
            </div>
          </div>

          {/* Location */}
          <div>
            <h3 className="text-xl font-bold text-foreground mb-4">Location</h3>
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="w-5 h-5" />
              <span>{job.location}</span>
            </div>
          </div>

          {/* Job Description */}
          <div>
            <h3 className="text-xl font-bold text-foreground mb-4">About the Role</h3>
            <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
              {job.description}
            </p>
          </div>

          {/* Additional Info */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <Clock className="w-5 h-5" />
                <span className="font-medium">Experience</span>
              </div>
              <p className="text-foreground">{job.experience}</p>
            </div>
            
            <div>
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <DollarSign className="w-5 h-5" />
                <span className="font-medium">Salary</span>
              </div>
              <p className="text-foreground">{job.salary}</p>
            </div>
            
            <div>
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <Clock className="w-5 h-5" />
                <span className="font-medium">Posted</span>
              </div>
              <p className="text-foreground">{job.posted}</p>
            </div>
            
            <div>
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <Users className="w-5 h-5" />
                <span className="font-medium">Applicants</span>
              </div>
              <p className="text-foreground">{job.applicants} applicants</p>
            </div>
          </div>

          {/* Report Job */}
          <div className="pt-6 border-t">
            <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
              <Flag className="w-4 h-4 mr-2" />
              Report job
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

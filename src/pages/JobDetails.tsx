import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Bookmark, Ban, Share2, MapPin, Briefcase, Clock, DollarSign, Users, Flag, ArrowLeft } from "lucide-react";

const JobDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const job = location.state?.job;

  if (!job) {
    navigate('/jobs');
    return null;
  }

  return (
    <div className="min-h-screen bg-background font-sans">
      {/* Header */}
      <div className="sticky top-0 bg-background z-10 border-b shadow-sm">
        <div className="max-w-5xl mx-auto px-6 py-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/jobs')}
            className="mb-6 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Jobs
          </Button>
          
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-2xl font-semibold text-foreground mb-3 tracking-tight">{job.title}</h1>
              <a 
                href="#" 
                className="text-primary hover:underline flex items-center gap-1 mb-4 font-medium"
                onClick={(e) => e.preventDefault()}
              >
                {job.company} <ExternalLink className="w-3.5 h-3.5" />
              </a>
              
              {/* Job Meta Info */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4" />
                  <span>{job.location}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Briefcase className="w-4 h-4" />
                  <span>{job.experience}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  <span>{job.type}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Users className="w-4 h-4" />
                  <span>{job.workMode}</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Skills Tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            {job.tags.map((skill: string, index: number) => (
              <Badge 
                key={index}
                variant="secondary"
                className="bg-muted text-foreground font-normal text-sm px-3 py-1 rounded-full"
              >
                {skill}
              </Badge>
            ))}
            <button className="text-sm text-muted-foreground hover:text-foreground font-medium">
              +3 more
            </button>
          </div>
          
          {/* Applicants count */}
          <p className="text-sm text-muted-foreground mb-6">{job.applicants} applicants</p>
          
          <div className="flex items-center gap-3">
            <Button className="gradient-primary text-primary-foreground px-6 font-medium">
              Apply on company site <ExternalLink className="w-4 h-4 ml-2" />
            </Button>
            <Button variant="outline" size="icon" className="border-border">
              <Bookmark className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="icon" className="border-border">
              <Ban className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="icon" className="border-border">
              <Share2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="space-y-10">
          {/* Profile Insights */}
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-2">Profile insights</h2>
            <p className="text-sm text-muted-foreground mb-5">
              Here's how the job qualifications align with your{" "}
              <a href="#" className="text-primary hover:underline">profile</a>.
            </p>
            
            <div className="space-y-5">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Briefcase className="w-4 h-4 text-muted-foreground" />
                  <h3 className="font-semibold text-base">Skills</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {job.tags.map((skill: string, index: number) => (
                    <Badge 
                      key={index}
                      variant="outline"
                      className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-400 dark:border-blue-800 text-sm px-3 py-1.5 font-normal rounded-md"
                    >
                      ✓ {skill}
                    </Badge>
                  ))}
                  <button className="text-sm text-muted-foreground hover:text-foreground font-medium">
                    + show more
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Job Details */}
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-2">Job details</h2>
            <p className="text-sm text-muted-foreground mb-5">
              Here's how the job details align with your{" "}
              <a href="#" className="text-primary hover:underline">profile</a>.
            </p>
            
            <div className="space-y-5">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Briefcase className="w-4 h-4 text-muted-foreground" />
                  <h3 className="font-semibold text-base">Job type</h3>
                </div>
                <Badge 
                  variant="outline"
                  className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-400 dark:border-blue-800 text-sm px-3 py-1.5 font-normal rounded-md"
                >
                  ✓ {job.type}
                </Badge>
              </div>
            </div>
          </section>

          {/* Location */}
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">Location</h2>
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="w-4 h-4" />
              <span className="text-sm">{job.location}</span>
            </div>
          </section>

          {/* Job Description */}
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">About the Role</h2>
            <p className="text-muted-foreground leading-relaxed text-sm whitespace-pre-line">
              {job.description}
            </p>
          </section>

          {/* Additional Info Grid */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
            <div>
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <Clock className="w-4 h-4" />
                <span className="font-medium text-sm">Experience</span>
              </div>
              <p className="text-foreground text-sm">{job.experience}</p>
            </div>
            
            <div>
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <DollarSign className="w-4 h-4" />
                <span className="font-medium text-sm">Salary</span>
              </div>
              <p className="text-foreground text-sm">{job.salary}</p>
            </div>
            
            <div>
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <Clock className="w-4 h-4" />
                <span className="font-medium text-sm">Posted</span>
              </div>
              <p className="text-foreground text-sm">{job.posted}</p>
            </div>
            
            <div>
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <Users className="w-4 h-4" />
                <span className="font-medium text-sm">Applicants</span>
              </div>
              <p className="text-foreground text-sm">{job.applicants} applicants</p>
            </div>
          </section>

          {/* Report Job */}
          <section className="pt-6 border-t">
            <Button variant="ghost" className="text-muted-foreground hover:text-foreground text-sm h-auto p-0">
              <Flag className="w-3.5 h-3.5 mr-2" />
              Report job
            </Button>
          </section>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;

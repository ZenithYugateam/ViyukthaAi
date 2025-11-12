import { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bookmark, Share2, MapPin, Briefcase, Clock, DollarSign, Users, Flag, ArrowLeft, Play } from "lucide-react";
import { mockData } from "@/data/mock-company-dashboard";

const JobDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams<{ id: string }>();
  const jobFromState = location.state?.job;
  const [job, setJob] = useState<any>(jobFromState);
  const [fullJobDetails, setFullJobDetails] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // If job has jobId, fetch full details from mockData
    if (job?.jobId) {
      const fullJob = mockData.getJobById(job.jobId);
      const questions = mockData.getQuestionsByJobId(job.jobId);
      if (fullJob) {
        setFullJobDetails({
          ...fullJob,
          questions: questions,
        });
      }
    } else if (id && !job) {
      // Try to find job by ID in mockData
      const foundJob = mockData.getJobById(id);
      if (foundJob) {
        const questions = mockData.getQuestionsByJobId(id);
        setJob({
          id: foundJob.id,
          title: foundJob.title,
          company: "Company",
          location: foundJob.location || "Remote",
          type: foundJob.type || "Full-time",
          experience: foundJob.experience || "2-3 years",
          salary: foundJob.salary || "$50k - $80k",
          description: foundJob.description || "",
          tags: foundJob.description ? foundJob.description.split(" ").slice(0, 4) : [],
          applicants: foundJob.applicants || 0,
          jobId: foundJob.id,
        });
        setFullJobDetails({
          ...foundJob,
          questions: questions,
        });
      }
    }
  }, [job, id]);

  if (!job && !loading) {
    navigate('/jobs');
    return null;
  }

  const handleStartInterview = () => {
    if (job?.jobId) {
      navigate(`/job-interview/${job.jobId}`);
    } else {
      navigate(`/job-interview/${id}`);
    }
  };

  const displayJob = fullJobDetails || job;

  return (
    <div className="min-h-screen bg-background font-sans overflow-x-hidden">
      {/* Header - Compact sticky header */}
      <div className="sticky top-0 bg-background/95 backdrop-blur-sm z-10 border-b shadow-sm">
        <div className="max-w-5xl mx-auto px-6 py-3">
          <div className="flex items-center justify-between mb-3">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/jobs')}
              className="text-muted-foreground hover:text-foreground h-8"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Jobs
            </Button>
            <div className="flex items-center gap-2">
              {job?.jobId && (
                <Button 
                  onClick={handleStartInterview}
                  className="gradient-primary text-primary-foreground px-5 py-1.5 text-sm font-semibold shadow-md hover:shadow-lg transition-all h-8"
                >
                  <Play className="w-3.5 h-3.5 mr-1.5" />
                  Start Interview
                </Button>
              )}
              <Button variant="outline" size="icon" className="border-border h-8 w-8">
                <Bookmark className="w-3.5 h-3.5" />
              </Button>
              <Button variant="outline" size="icon" className="border-border h-8 w-8">
                <Share2 className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
          
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h1 className="text-xl md:text-2xl font-bold text-foreground mb-1 tracking-tight line-clamp-2">{job.title}</h1>
              <p className="text-sm md:text-base text-muted-foreground mb-2 font-medium">
                {job.company}
              </p>
              
              {/* Job Meta Info - Compact */}
              <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground mb-2">
                <div className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  <span className="truncate">{job.location}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Briefcase className="w-3 h-3" />
                  <span>{job.experience}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{job.type}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  <span>{job.workMode}</span>
                </div>
              </div>
              
              {/* Skills Tags - Compact */}
              <div className="flex flex-wrap gap-1.5 mb-2">
                {job.tags.slice(0, 4).map((skill: string, index: number) => (
                  <Badge 
                    key={index}
                    variant="secondary"
                    className="bg-muted text-foreground font-normal text-xs px-2 py-0.5 rounded-full"
                  >
                    {skill}
                  </Badge>
                ))}
                {job.tags.length > 4 && (
                  <span className="text-xs text-muted-foreground">+{job.tags.length - 4} more</span>
                )}
              </div>
              
              {/* Applicants count */}
              <p className="text-xs text-muted-foreground">{job.applicants} applicants</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-6 py-8 pb-16">
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
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-foreground">Job Description</h2>
              {job?.jobId && (
                <Button 
                  onClick={handleStartInterview}
                  className="gradient-primary text-primary-foreground px-6 py-2 font-semibold shadow-md hover:shadow-lg transition-all"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Start Interview
                </Button>
              )}
            </div>
            <div className="bg-gradient-to-br from-card to-card/50 rounded-xl p-8 border border-border shadow-sm">
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <div className="text-foreground leading-7 whitespace-pre-line text-base">
                  {displayJob?.description || job?.description || "No job description available."}
                </div>
              </div>
            </div>
          </section>

          {/* Key Skills */}
          {fullJobDetails && (
            <section className="bg-muted/30 rounded-xl p-6 border border-border">
              <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-primary" />
                Key Skills Required
              </h2>
              <div className="flex flex-wrap gap-2">
                {fullJobDetails.description?.split(" ").slice(0, 10).map((skill: string, index: number) => (
                  <Badge 
                    key={index}
                    variant="secondary"
                    className="bg-primary/10 text-primary border-primary/20 px-4 py-1.5 text-sm font-medium hover:bg-primary/20 transition-colors"
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </section>
          )}

          {/* Additional Info Grid */}
          <section className="bg-gradient-to-br from-card to-card/50 rounded-xl p-6 border border-border shadow-sm">
            <h2 className="text-xl font-semibold text-foreground mb-6">Job Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start gap-3 p-4 bg-background/50 rounded-lg border border-border/50 hover:border-primary/20 transition-colors">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Briefcase className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground mb-1 font-medium">Experience Required</p>
                  <p className="text-foreground font-semibold">{job.experience}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-4 bg-background/50 rounded-lg border border-border/50 hover:border-primary/20 transition-colors">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <DollarSign className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground mb-1 font-medium">Salary Range</p>
                  <p className="text-foreground font-semibold text-lg">
                    {displayJob?.salary || job?.salary || "Not specified"}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-4 bg-background/50 rounded-lg border border-border/50 hover:border-primary/20 transition-colors">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Clock className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground mb-1 font-medium">Job Type</p>
                  <p className="text-foreground font-semibold">{job.type}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-4 bg-background/50 rounded-lg border border-border/50 hover:border-primary/20 transition-colors">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Users className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground mb-1 font-medium">Total Applicants</p>
                  <p className="text-foreground font-semibold">{job.applicants} candidates</p>
                </div>
              </div>
              
              {displayJob?.interviewDuration && (
                <div className="flex items-start gap-3 p-4 bg-background/50 rounded-lg border border-border/50 hover:border-primary/20 transition-colors">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Clock className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground mb-1 font-medium">Interview Duration</p>
                    <p className="text-foreground font-semibold">
                      {displayJob.interviewDuration === "60" 
                        ? "1 hour" 
                        : displayJob.interviewDuration === "90" 
                        ? "1.5 hours" 
                        : displayJob.interviewDuration === "120"
                        ? "2 hours"
                        : `${displayJob.interviewDuration} minutes`}
                    </p>
                  </div>
                </div>
              )}
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

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Github,
  Download,
  Briefcase,
  GraduationCap,
  Award,
  Star,
  Brain,
  Calendar,
  ExternalLink,
  Code,
  Upload,
  FileUp,
} from "lucide-react";
import { toast } from "sonner";
import femaleAvatar from "@/assets/female-avatar.jpg";

const candidateData = {
  name: "Priya Sharma",
  role: "Full Stack Developer & AI Enthusiast",
  location: "Bangalore, Karnataka, India",
  email: "priya.sharma@example.com",
  phone: "+91 98765 43210",
  linkedin: "linkedin.com/in/priyasharma",
  github: "github.com/priyasharma",
  avatar: femaleAvatar,
  about:
    "Passionate full-stack developer with 3+ years of experience building scalable web applications. Specialized in React, Node.js, and AI integration. Committed to writing clean, efficient code and staying updated with emerging technologies.",

  skills: [
    { name: "React & Next.js", level: 95 },
    { name: "Node.js & Express", level: 90 },
    { name: "Python & AI/ML", level: 85 },
    { name: "TypeScript", level: 88 },
    { name: "Database Design", level: 82 },
    { name: "Cloud (AWS/Azure)", level: 78 },
  ],

  education: [
    {
      degree: "B.Tech in Computer Science",
      institution: "Indian Institute of Technology, Bangalore",
      year: "2018 - 2022",
      grade: "CGPA: 8.9/10",
    },
    {
      degree: "Full Stack Development Certification",
      institution: "Viyuktha AI Academy",
      year: "2022",
      grade: "Distinction",
    },
  ],

  experience: [
    {
      title: "Senior Software Engineer",
      company: "Tech Innovations Pvt Ltd",
      period: "Jan 2023 - Present",
      description:
        "Leading development of AI-powered customer analytics platform. Built microservices architecture handling 10M+ requests/day.",
    },
    {
      title: "Full Stack Developer",
      company: "StartupHub Solutions",
      period: "Jul 2022 - Dec 2022",
      description:
        "Developed and maintained multiple client projects using MERN stack. Implemented CI/CD pipelines and automated testing.",
    },
  ],

  projects: [
    {
      title: "AI Resume Analyzer",
      tech: ["Python", "NLP", "React", "FastAPI"],
      description: "Built an AI-powered tool that analyzes resumes and provides improvement suggestions using NLP.",
    },
    {
      title: "E-Commerce Dashboard",
      tech: ["Next.js", "MongoDB", "Stripe"],
      description: "Comprehensive admin dashboard with real-time analytics and payment integration.",
    },
  ],

  achievements: [
    "Winner - National Hackathon 2023",
    "Published research paper on AI in Education",
    "Google Cloud Certified Professional",
    "Mentor for 50+ junior developers",
  ],

  aiInsights: {
    score: 94,
    strengths: ["Strong technical foundation", "Excellent problem-solving skills", "Leadership experience"],
    recommendations: [
      "Consider learning Rust for system programming",
      "Explore contributions to open-source AI projects",
    ],
  },
};

const Portfolio = () => {
  const [importDialogOpen, setImportDialogOpen] = useState(false);

  const handleImportFromResume = () => {
    toast.success("Resume import started. We'll extract your profile information.");
    setImportDialogOpen(false);
  };

  const handleImportFromLinkedIn = () => {
    toast.success("LinkedIn import started. Please connect your LinkedIn account.");
    setImportDialogOpen(false);
  };

  return (
    <div className="min-h-screen mt--6">
      {/* Hero Section with Gradient */}
      <div className="relative gradient-primary text-white p-8 rounded-lg mb-8">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Brain className="w-5 h-5 text-secondary" />
              <span className="text-secondary font-semibold text-sm">Profile Verified by Viyuktha AI</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Candidate Profile</h1>
            <p className="text-white/80">AI-Enhanced Professional Assessment</p>
          </div>

          {/* Edit Profile Dialog */}
          <Dialog open={importDialogOpen} onOpenChange={setImportDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2 bg-white hover:bg-white/90 text-primary border-white">
                <Upload className="w-4 h-4" />
                Edit Profile
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader className="space-y-3">
                <DialogTitle className="text-2xl">Import Profile Information</DialogTitle>
                <DialogDescription className="text-base">
                  Choose a source to import your profile information from
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-6">
                <button
                  onClick={handleImportFromResume}
                  className="flex items-center gap-4 p-5 rounded-lg border-2 border-border hover:border-primary hover:bg-primary/5 transition-all duration-200 text-left group"
                >
                  <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <FileUp className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-foreground text-lg mb-1">Import from Resume</p>
                    <p className="text-sm text-muted-foreground">Upload your resume to extract profile information</p>
                  </div>
                </button>

                <button
                  onClick={handleImportFromLinkedIn}
                  className="flex items-center gap-4 p-5 rounded-lg border-2 border-border hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 text-left group"
                >
                  <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-blue-500/10 group-hover:bg-blue-500/20 transition-colors">
                    <Linkedin className="w-6 h-6 text-blue-500" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-foreground text-lg mb-1">Import from LinkedIn</p>
                    <p className="text-sm text-muted-foreground">Connect your LinkedIn to sync profile data</p>
                  </div>
                </button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Profile Card */}
          <Card className="overflow-hidden border-primary border-2">
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                <Avatar className="w-32 h-32 mb-4 border-4 border-secondary">
                  <AvatarImage src={candidateData.avatar} alt={candidateData.name} />
                  <AvatarFallback>PS</AvatarFallback>
                </Avatar>
                <h2 className="text-2xl font-bold text-foreground mb-1">{candidateData.name}</h2>
                <p className="text-muted-foreground mb-4">{candidateData.role}</p>

                {/* AI Score Badge */}
                <div className="gradient-primary text-white px-4 py-2 rounded-full mb-6 flex items-center gap-2">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="font-bold">AI Score: {candidateData.aiInsights.score}%</span>
                </div>

                {/* Contact Info */}
                <div className="w-full space-y-3 text-left">
                  <div className="flex items-center gap-3 text-sm">
                    <Mail className="w-4 h-4 text-primary" />
                    <span className="text-foreground">{candidateData.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Phone className="w-4 h-4 text-primary" />
                    <span className="text-foreground">{candidateData.phone}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <MapPin className="w-4 h-4 text-primary" />
                    <span className="text-foreground">{candidateData.location}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Linkedin className="w-4 h-4 text-primary" />
                    <a
                      href={`https://${candidateData.linkedin}`}
                      className="text-foreground hover:text-primary transition-colors"
                    >
                      LinkedIn Profile
                    </a>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Github className="w-4 h-4 text-primary" />
                    <a
                      href={`https://${candidateData.github}`}
                      className="text-foreground hover:text-primary transition-colors"
                    >
                      GitHub Profile
                    </a>
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="w-full mt-6 space-y-3">
                  <Button className="w-full gradient-primary text-white">
                    <Download className="w-4 h-4 mr-2" />
                    Download Resume
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full border-primary text-primary hover:bg-primary hover:text-white"
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Contact Candidate
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* AI Insights Card */}
          <Card className="border-secondary border-2">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Brain className="w-5 h-5 text-secondary" />
                <h3 className="font-bold text-foreground">AI Insights</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-sm font-semibold text-primary mb-2">Key Strengths</p>
                  <ul className="space-y-1">
                    {candidateData.aiInsights.strengths.map((strength, idx) => (
                      <li key={idx} className="text-sm text-foreground flex items-start gap-2">
                        <span className="text-secondary mt-1">✓</span>
                        <span>{strength}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <p className="text-sm font-semibold text-primary mb-2">AI Recommendations</p>
                  <ul className="space-y-1">
                    {candidateData.aiInsights.recommendations.map((rec, idx) => (
                      <li key={idx} className="text-sm text-foreground flex items-start gap-2">
                        <span className="text-secondary mt-1">→</span>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* About Section */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-foreground mb-4">About</h3>
              <p className="text-foreground leading-relaxed">{candidateData.about}</p>
            </CardContent>
          </Card>

          {/* Skills Section */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <Code className="w-5 h-5 text-primary" />
                <h3 className="text-xl font-bold text-foreground">Technical Skills</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {candidateData.skills.map((skill, idx) => (
                  <div key={idx} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-foreground">{skill.name}</span>
                      <span className="text-sm text-primary font-semibold">{skill.level}%</span>
                    </div>
                    <Progress value={skill.level} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Education Section */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <GraduationCap className="w-5 h-5 text-primary" />
                <h3 className="text-xl font-bold text-foreground">Education</h3>
              </div>
              <div className="space-y-4">
                {candidateData.education.map((edu, idx) => (
                  <div key={idx} className="relative pl-6 border-l-2 border-secondary pb-4 last:pb-0">
                    <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-secondary border-2 border-white"></div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                      <Calendar className="w-3 h-3" />
                      <span>{edu.year}</span>
                    </div>
                    <h4 className="font-bold text-foreground mb-1">{edu.degree}</h4>
                    <p className="text-foreground text-sm mb-1">{edu.institution}</p>
                    <Badge variant="secondary">{edu.grade}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Experience Section */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <Briefcase className="w-5 h-5 text-primary" />
                <h3 className="text-xl font-bold text-foreground">Work Experience</h3>
              </div>
              <div className="space-y-6">
                {candidateData.experience.map((exp, idx) => (
                  <div key={idx} className="relative pl-6 border-l-2 border-primary pb-6 last:pb-0">
                    <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-primary border-2 border-white"></div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                      <Calendar className="w-3 h-3" />
                      <span>{exp.period}</span>
                    </div>
                    <h4 className="font-bold text-foreground text-lg mb-1">{exp.title}</h4>
                    <p className="text-primary font-medium text-sm mb-2">{exp.company}</p>
                    <p className="text-foreground text-sm">{exp.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Projects Section */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <ExternalLink className="w-5 h-5 text-primary" />
                <h3 className="text-xl font-bold text-foreground">Featured Projects</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {candidateData.projects.map((project, idx) => (
                  <Card key={idx} className="border-primary/20 hover:border-primary transition-colors">
                    <CardContent className="p-4">
                      <h4 className="font-bold text-foreground mb-2">{project.title}</h4>
                      <p className="text-sm text-foreground mb-3">{project.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {project.tech.map((tech, techIdx) => (
                          <Badge key={techIdx} variant="secondary" className="text-xs">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Achievements Section */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <Award className="w-5 h-5 text-primary" />
                <h3 className="text-xl font-bold text-foreground">Achievements & Recognition</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {candidateData.achievements.map((achievement, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 p-3 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
                  >
                    <Star className="w-4 h-4 text-secondary fill-current flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-foreground">{achievement}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

    </div>
  );
};

export default Portfolio;

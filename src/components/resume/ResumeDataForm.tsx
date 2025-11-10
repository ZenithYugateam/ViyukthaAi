import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { 
  Plus, 
  Trash2, 
  User, 
  GraduationCap, 
  Briefcase, 
  Code, 
  FileText,
  Award
} from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";

const personalInfoSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  location: z.string().trim().max(100),
  email: z.string().trim().email("Invalid email").max(255),
  phone: z.string().trim().max(20),
  website: z.string().trim().url("Invalid URL").optional().or(z.literal("")),
  linkedin: z.string().trim().url("Invalid URL").optional().or(z.literal("")),
  github: z.string().trim().url("Invalid URL").optional().or(z.literal("")),
});

const educationSchema = z.object({
  degree: z.string().trim().min(1, "Degree is required").max(200),
  institution: z.string().trim().min(1, "Institution is required").max(200),
  startDate: z.string().trim().min(1, "Start date is required"),
  endDate: z.string().trim().min(1, "End date is required"),
  gpa: z.string().trim().max(20).optional(),
  coursework: z.array(z.string()).optional(),
  highlights: z.array(z.string()).optional(),
});

const experienceSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(200),
  company: z.string().trim().min(1, "Company is required").max(200),
  location: z.string().trim().max(100),
  startDate: z.string().trim().min(1, "Start date is required"),
  endDate: z.string().trim().min(1, "End date is required"),
  highlights: z.array(z.string()).min(1, "At least one achievement is required"),
});

const projectSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(200),
  description: z.string().trim().optional(),
  technologies: z.array(z.string()).optional(),
  link: z.string().trim().url("Invalid URL").optional().or(z.literal("")),
  date: z.string().trim().optional(),
  highlights: z.array(z.string()).min(1, "At least one highlight is required"),
});

const publicationSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(300),
  authors: z.array(z.string()).min(1, "At least one author is required"),
  date: z.string().trim().min(1, "Date is required"),
  doi: z.string().trim().optional(),
});

export interface ResumeFormData {
  personalInfo: {
    name: string;
    location: string;
    email: string;
    phone: string;
    website?: string;
    linkedin?: string;
    github?: string;
    portfolio?: string;
  };
  summary?: string;
  education: z.infer<typeof educationSchema>[];
  experience: z.infer<typeof experienceSchema>[];
  projects?: z.infer<typeof projectSchema>[];
  skills?: {
    languages?: string[];
    technologies?: string[];
    tools?: string[];
  };
  publications?: z.infer<typeof publicationSchema>[];
}

interface ResumeDataFormProps {
  initialData?: ResumeFormData;
  onSubmit: (data: ResumeFormData) => void;
  onPreview: (data: ResumeFormData) => void;
  isDownloading?: boolean;
}

export const ResumeDataForm = ({ initialData, onSubmit, onPreview, isDownloading = false }: ResumeDataFormProps) => {
  const [formData, setFormData] = useState<ResumeFormData>(initialData || {
    personalInfo: {
      name: "",
      location: "",
      email: "",
      phone: "",
      website: "",
      linkedin: "",
      github: "",
    },
    summary: "",
    education: [],
    experience: [],
    projects: [],
    skills: {
      languages: [],
      technologies: [],
    },
    publications: [],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateAndUpdate = () => {
    try {
      personalInfoSchema.parse(formData.personalInfo);
      setErrors({});
      onPreview(formData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          const path = err.path.join(".");
          newErrors[path] = err.message;
        });
        setErrors(newErrors);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      personalInfoSchema.parse(formData.personalInfo);
      onSubmit(formData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          const path = err.path.join(".");
          newErrors[path] = err.message;
        });
        setErrors(newErrors);
      }
    }
  };

  const addEducation = () => {
    setFormData({
      ...formData,
      education: [
        ...formData.education,
        {
          degree: "",
          institution: "",
          startDate: "",
          endDate: "",
          gpa: "",
          coursework: [],
          highlights: [],
        },
      ],
    });
  };

  const removeEducation = (index: number) => {
    setFormData({
      ...formData,
      education: formData.education.filter((_, i) => i !== index),
    });
  };

  const addExperience = () => {
    setFormData({
      ...formData,
      experience: [
        ...formData.experience,
        {
          title: "",
          company: "",
          location: "",
          startDate: "",
          endDate: "",
          highlights: [""],
        },
      ],
    });
  };

  const removeExperience = (index: number) => {
    setFormData({
      ...formData,
      experience: formData.experience.filter((_, i) => i !== index),
    });
  };

  const addProject = () => {
    setFormData({
      ...formData,
      projects: [
        ...(formData.projects || []),
        {
          title: "",
          link: "",
          date: "",
          highlights: [""],
        },
      ],
    });
  };

  const removeProject = (index: number) => {
    setFormData({
      ...formData,
      projects: formData.projects?.filter((_, i) => i !== index),
    });
  };

  const addPublication = () => {
    setFormData({
      ...formData,
      publications: [
        ...(formData.publications || []),
        {
          title: "",
          authors: [""],
          date: "",
          doi: "",
        },
      ],
    });
  };

  const removePublication = (index: number) => {
    setFormData({
      ...formData,
      publications: formData.publications?.filter((_, i) => i !== index),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Personal Information */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <User className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Personal Information</h3>
            <p className="text-sm text-muted-foreground">Your contact details and links</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Full Name *</Label>
            <Input
              id="name"
              value={formData.personalInfo.name}
              onChange={(e) => {
                setFormData({
                  ...formData,
                  personalInfo: { ...formData.personalInfo, name: e.target.value },
                });
                validateAndUpdate();
              }}
              placeholder="John Doe"
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
          </div>

          <div>
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={formData.personalInfo.email}
              onChange={(e) => {
                setFormData({
                  ...formData,
                  personalInfo: { ...formData.personalInfo, email: e.target.value },
                });
                validateAndUpdate();
              }}
              placeholder="john@example.com"
              className={errors.email ? "border-red-500" : ""}
            />
            {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
          </div>

          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              value={formData.personalInfo.phone}
              onChange={(e) => {
                setFormData({
                  ...formData,
                  personalInfo: { ...formData.personalInfo, phone: e.target.value },
                });
                validateAndUpdate();
              }}
              placeholder="+1 234 567 8900"
            />
          </div>

          <div>
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={formData.personalInfo.location}
              onChange={(e) => {
                setFormData({
                  ...formData,
                  personalInfo: { ...formData.personalInfo, location: e.target.value },
                });
                validateAndUpdate();
              }}
              placeholder="New York, NY"
            />
          </div>

          <div>
            <Label htmlFor="linkedin">LinkedIn</Label>
            <Input
              id="linkedin"
              value={formData.personalInfo.linkedin}
              onChange={(e) => {
                setFormData({
                  ...formData,
                  personalInfo: { ...formData.personalInfo, linkedin: e.target.value },
                });
                validateAndUpdate();
              }}
              placeholder="https://linkedin.com/in/yourprofile"
            />
          </div>

          <div>
            <Label htmlFor="github">GitHub</Label>
            <Input
              id="github"
              value={formData.personalInfo.github}
              onChange={(e) => {
                setFormData({
                  ...formData,
                  personalInfo: { ...formData.personalInfo, github: e.target.value },
                });
                validateAndUpdate();
              }}
              placeholder="https://github.com/yourprofile"
            />
          </div>

          <div className="md:col-span-2">
            <Label htmlFor="website">Website</Label>
            <Input
              id="website"
              value={formData.personalInfo.website}
              onChange={(e) => {
                setFormData({
                  ...formData,
                  personalInfo: { ...formData.personalInfo, website: e.target.value },
                });
                validateAndUpdate();
              }}
              placeholder="https://yourwebsite.com"
            />
          </div>
        </div>
      </Card>

      {/* Summary */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <FileText className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Professional Summary</h3>
            <p className="text-sm text-muted-foreground">Brief overview of your experience</p>
          </div>
        </div>

        <Textarea
          value={formData.summary}
          onChange={(e) => {
            setFormData({ ...formData, summary: e.target.value });
            validateAndUpdate();
          }}
          placeholder="Experienced software engineer with 5+ years..."
          rows={4}
          maxLength={500}
        />
        <p className="text-xs text-muted-foreground mt-1">
          {formData.summary?.length || 0}/500 characters
        </p>
      </Card>

      {/* Education */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Education</h3>
              <p className="text-sm text-muted-foreground">Your academic background</p>
            </div>
          </div>
          <Button type="button" onClick={addEducation} size="sm" variant="outline">
            <Plus className="w-4 h-4 mr-2" />
            Add Education
          </Button>
        </div>

        <div className="space-y-6">
          {formData.education.map((edu, index) => (
            <div key={index} className="border rounded-lg p-4 relative">
              <Button
                type="button"
                onClick={() => removeEducation(index)}
                size="icon"
                variant="ghost"
                className="absolute top-2 right-2"
              >
                <Trash2 className="w-4 h-4 text-red-500" />
              </Button>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <div>
                  <Label>Degree *</Label>
                  <Input
                    value={edu.degree}
                    onChange={(e) => {
                      const newEducation = [...formData.education];
                      newEducation[index].degree = e.target.value;
                      setFormData({ ...formData, education: newEducation });
                      validateAndUpdate();
                    }}
                    placeholder="BS in Computer Science"
                  />
                </div>

                <div>
                  <Label>Institution *</Label>
                  <Input
                    value={edu.institution}
                    onChange={(e) => {
                      const newEducation = [...formData.education];
                      newEducation[index].institution = e.target.value;
                      setFormData({ ...formData, education: newEducation });
                      validateAndUpdate();
                    }}
                    placeholder="University of California"
                  />
                </div>

                <div>
                  <Label>Start Date *</Label>
                  <Input
                    value={edu.startDate}
                    onChange={(e) => {
                      const newEducation = [...formData.education];
                      newEducation[index].startDate = e.target.value;
                      setFormData({ ...formData, education: newEducation });
                      validateAndUpdate();
                    }}
                    placeholder="Sept 2018"
                  />
                </div>

                <div>
                  <Label>End Date *</Label>
                  <Input
                    value={edu.endDate}
                    onChange={(e) => {
                      const newEducation = [...formData.education];
                      newEducation[index].endDate = e.target.value;
                      setFormData({ ...formData, education: newEducation });
                      validateAndUpdate();
                    }}
                    placeholder="May 2022"
                  />
                </div>

                <div>
                  <Label>GPA (optional)</Label>
                  <Input
                    value={edu.gpa}
                    onChange={(e) => {
                      const newEducation = [...formData.education];
                      newEducation[index].gpa = e.target.value;
                      setFormData({ ...formData, education: newEducation });
                      validateAndUpdate();
                    }}
                    placeholder="3.8/4.0"
                  />
                </div>
              </div>
            </div>
          ))}

          {formData.education.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <GraduationCap className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No education added yet</p>
            </div>
          )}
        </div>
      </Card>

      {/* Experience */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Work Experience</h3>
              <p className="text-sm text-muted-foreground">Your professional history</p>
            </div>
          </div>
          <Button type="button" onClick={addExperience} size="sm" variant="outline">
            <Plus className="w-4 h-4 mr-2" />
            Add Experience
          </Button>
        </div>

        <div className="space-y-6">
          {formData.experience.map((exp, index) => (
            <div key={index} className="border rounded-lg p-4 relative">
              <Button
                type="button"
                onClick={() => removeExperience(index)}
                size="icon"
                variant="ghost"
                className="absolute top-2 right-2"
              >
                <Trash2 className="w-4 h-4 text-red-500" />
              </Button>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <div>
                  <Label>Job Title *</Label>
                  <Input
                    value={exp.title}
                    onChange={(e) => {
                      const newExperience = [...formData.experience];
                      newExperience[index].title = e.target.value;
                      setFormData({ ...formData, experience: newExperience });
                      validateAndUpdate();
                    }}
                    placeholder="Software Engineer"
                  />
                </div>

                <div>
                  <Label>Company *</Label>
                  <Input
                    value={exp.company}
                    onChange={(e) => {
                      const newExperience = [...formData.experience];
                      newExperience[index].company = e.target.value;
                      setFormData({ ...formData, experience: newExperience });
                      validateAndUpdate();
                    }}
                    placeholder="Google"
                  />
                </div>

                <div>
                  <Label>Location</Label>
                  <Input
                    value={exp.location}
                    onChange={(e) => {
                      const newExperience = [...formData.experience];
                      newExperience[index].location = e.target.value;
                      setFormData({ ...formData, experience: newExperience });
                      validateAndUpdate();
                    }}
                    placeholder="San Francisco, CA"
                  />
                </div>

                <div>
                  <Label>Start Date *</Label>
                  <Input
                    value={exp.startDate}
                    onChange={(e) => {
                      const newExperience = [...formData.experience];
                      newExperience[index].startDate = e.target.value;
                      setFormData({ ...formData, experience: newExperience });
                      validateAndUpdate();
                    }}
                    placeholder="Jan 2020"
                  />
                </div>

                <div>
                  <Label>End Date *</Label>
                  <Input
                    value={exp.endDate}
                    onChange={(e) => {
                      const newExperience = [...formData.experience];
                      newExperience[index].endDate = e.target.value;
                      setFormData({ ...formData, experience: newExperience });
                      validateAndUpdate();
                    }}
                    placeholder="Present"
                  />
                </div>

                <div className="md:col-span-2">
                  <Label>Achievements *</Label>
                  {exp.highlights.map((highlight, hIndex) => (
                    <div key={hIndex} className="flex gap-2 mb-2">
                      <Input
                        value={highlight}
                        onChange={(e) => {
                          const newExperience = [...formData.experience];
                          newExperience[index].highlights[hIndex] = e.target.value;
                          setFormData({ ...formData, experience: newExperience });
                          validateAndUpdate();
                        }}
                        placeholder="Increased performance by 40%"
                      />
                      {exp.highlights.length > 1 && (
                        <Button
                          type="button"
                          size="icon"
                          variant="ghost"
                          onClick={() => {
                            const newExperience = [...formData.experience];
                            newExperience[index].highlights.splice(hIndex, 1);
                            setFormData({ ...formData, experience: newExperience });
                            validateAndUpdate();
                          }}
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      const newExperience = [...formData.experience];
                      newExperience[index].highlights.push("");
                      setFormData({ ...formData, experience: newExperience });
                    }}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Achievement
                  </Button>
                </div>
              </div>
            </div>
          ))}

          {formData.experience.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Briefcase className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No experience added yet</p>
            </div>
          )}
        </div>
      </Card>

      {/* Projects */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Code className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Projects</h3>
              <p className="text-sm text-muted-foreground">Showcase your work</p>
            </div>
          </div>
          <Button type="button" onClick={addProject} size="sm" variant="outline">
            <Plus className="w-4 h-4 mr-2" />
            Add Project
          </Button>
        </div>

        <div className="space-y-6">
          {formData.projects?.map((project, index) => (
            <div key={index} className="border rounded-lg p-4 relative">
              <Button
                type="button"
                onClick={() => removeProject(index)}
                size="icon"
                variant="ghost"
                className="absolute top-2 right-2"
              >
                <Trash2 className="w-4 h-4 text-red-500" />
              </Button>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <div>
                  <Label>Project Title *</Label>
                  <Input
                    value={project.title}
                    onChange={(e) => {
                      const newProjects = [...(formData.projects || [])];
                      newProjects[index].title = e.target.value;
                      setFormData({ ...formData, projects: newProjects });
                      validateAndUpdate();
                    }}
                    placeholder="E-commerce Platform"
                  />
                </div>

                <div>
                  <Label>Link (optional)</Label>
                  <Input
                    value={project.link}
                    onChange={(e) => {
                      const newProjects = [...(formData.projects || [])];
                      newProjects[index].link = e.target.value;
                      setFormData({ ...formData, projects: newProjects });
                      validateAndUpdate();
                    }}
                    placeholder="https://github.com/yourproject"
                  />
                </div>

                <div className="md:col-span-2">
                  <Label>Highlights *</Label>
                  {project.highlights.map((highlight, hIndex) => (
                    <div key={hIndex} className="flex gap-2 mb-2">
                      <Input
                        value={highlight}
                        onChange={(e) => {
                          const newProjects = [...(formData.projects || [])];
                          newProjects[index].highlights[hIndex] = e.target.value;
                          setFormData({ ...formData, projects: newProjects });
                          validateAndUpdate();
                        }}
                        placeholder="Built using React and Node.js"
                      />
                      {project.highlights.length > 1 && (
                        <Button
                          type="button"
                          size="icon"
                          variant="ghost"
                          onClick={() => {
                            const newProjects = [...(formData.projects || [])];
                            newProjects[index].highlights.splice(hIndex, 1);
                            setFormData({ ...formData, projects: newProjects });
                            validateAndUpdate();
                          }}
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      const newProjects = [...(formData.projects || [])];
                      newProjects[index].highlights.push("");
                      setFormData({ ...formData, projects: newProjects });
                    }}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Highlight
                  </Button>
                </div>
              </div>
            </div>
          ))}

          {(!formData.projects || formData.projects.length === 0) && (
            <div className="text-center py-8 text-muted-foreground">
              <Code className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No projects added yet</p>
            </div>
          )}
        </div>
      </Card>

      {/* Skills */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <Award className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Skills & Technologies</h3>
            <p className="text-sm text-muted-foreground">Your technical expertise</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label>Programming Languages (comma-separated)</Label>
            <Input
              value={formData.skills?.languages?.join(", ") || ""}
              onChange={(e) => {
                const languages = e.target.value.split(",").map((s) => s.trim()).filter(Boolean);
                setFormData({
                  ...formData,
                  skills: { ...formData.skills, languages },
                });
                validateAndUpdate();
              }}
              placeholder="JavaScript, Python, Java"
            />
          </div>

          <div>
            <Label>Technologies & Frameworks (comma-separated)</Label>
            <Input
              value={formData.skills?.technologies?.join(", ") || ""}
              onChange={(e) => {
                const technologies = e.target.value.split(",").map((s) => s.trim()).filter(Boolean);
                setFormData({
                  ...formData,
                  skills: { ...formData.skills, technologies },
                });
                validateAndUpdate();
              }}
              placeholder="React, Node.js, AWS"
            />
          </div>
        </div>
      </Card>

              <div className="flex gap-3 sticky bottom-4 bg-background p-4 border rounded-lg shadow-lg">
        <Button
          type="button"
          variant="outline"
          onClick={() => onPreview(formData)}
          className="flex-1"
          disabled={isDownloading}
        >
          Preview Resume
        </Button>
        <Button 
          type="submit" 
          className="flex-1 gradient-primary hover:gradient-primary-hover"
          disabled={isDownloading}
        >
          Generate Resume
        </Button>
      </div>
    </form>
  );
};
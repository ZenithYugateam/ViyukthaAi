import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronLeft, ChevronRight, Check, Plus, Sparkles, Save, GraduationCap, Briefcase, Code, FolderOpen } from "lucide-react";
import { AddEducationDialog } from "./AddEducationDialog";
import { AddExperienceDialog } from "./AddExperienceDialog";
import { AddSkillDialog } from "./AddSkillDialog";
import { AddProjectDialog } from "./AddProjectDialog";

const steps = [
  { id: 1, title: "Personal Info" },
  { id: 2, title: "Contact Details" },
  { id: 3, title: "Education" },
  { id: 4, title: "Experience" },
  { id: 5, title: "Skills" },
  { id: 6, title: "Projects" },
  { id: 7, title: "Review" },
];

const tips = [
  "Fill out each section with relevant details",
  "Be concise but informative in your descriptions",
  "You can always come back and edit your information",
  'Quantify achievements when possible (e.g., "Increased sales by 20%")',
];

export const ResumeBuilder = ({ onBack }: { onBack: () => void }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [educationDialog, setEducationDialog] = useState(false);
  const [experienceDialog, setExperienceDialog] = useState(false);
  const [skillDialog, setSkillDialog] = useState(false);
  const [projectDialog, setProjectDialog] = useState(false);
  
  const [educationList, setEducationList] = useState<any[]>([]);
  const [experienceList, setExperienceList] = useState<any[]>([]);
  const [skillsList, setSkillsList] = useState<any[]>([]);
  const [projectsList, setProjectsList] = useState<any[]>([]);

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold">Personal Info</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>First Name <span className="text-destructive">*</span></Label>
                <Input placeholder="e.g. John" />
              </div>
              <div className="space-y-2">
                <Label>Last Name <span className="text-destructive">*</span></Label>
                <Input placeholder="e.g. Doe" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Professional Title</Label>
              <Input placeholder="e.g. Software Engineer" />
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold">Contact Details</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Email Address <span className="text-destructive">*</span></Label>
                <Input type="email" placeholder="e.g. johnsmith@example.com" />
              </div>
              <div className="space-y-2">
                <Label>Phone Number <span className="text-destructive">*</span></Label>
                <Input placeholder="e.g. (123) 456-7890" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Location <span className="text-destructive">*</span></Label>
                <Input placeholder="e.g. New York, NY" />
              </div>
              <div className="space-y-2">
                <Label>Website</Label>
                <Input placeholder="e.g. portfolio.com" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>LinkedIn</Label>
                <Input placeholder="e.g. linkedin.com/in/username" />
                <p className="text-xs text-muted-foreground">Enter your full LinkedIn profile URL</p>
              </div>
              <div className="space-y-2">
                <Label>GitHub</Label>
                <Input placeholder="e.g. github.com/username" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Twitter</Label>
              <Input placeholder="e.g. twitter.com/username" />
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold">Education</h2>
            <button
              onClick={() => setEducationDialog(true)}
              className="w-full border-2 border-dashed border-muted-foreground/30 rounded-lg p-8 hover:border-primary hover:bg-secondary/20 transition-all"
            >
              <div className="flex items-center justify-center gap-2 text-muted-foreground">
                <Plus className="w-5 h-5" />
                <span>Add Education</span>
              </div>
            </button>
            {educationList.length === 0 ? (
              <div className="text-center py-12">
                <GraduationCap className="w-16 h-16 mx-auto text-muted-foreground/40 mb-4" />
                <p className="text-muted-foreground">
                  No education entries yet. Add your educational background.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {educationList.map((edu, index) => (
                  <Card key={index} className="p-4">
                    <h3 className="font-semibold">{edu.institution}</h3>
                    <p className="text-sm text-muted-foreground">{edu.degree}</p>
                  </Card>
                ))}
              </div>
            )}
          </div>
        );
      case 4:
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold">Experience</h2>
            <button
              onClick={() => setExperienceDialog(true)}
              className="w-full border-2 border-dashed border-muted-foreground/30 rounded-lg p-8 hover:border-primary hover:bg-secondary/20 transition-all"
            >
              <div className="flex items-center justify-center gap-2 text-muted-foreground">
                <Plus className="w-5 h-5" />
                <span>Add Experience</span>
              </div>
            </button>
            {experienceList.length === 0 ? (
              <div className="text-center py-12">
                <Briefcase className="w-16 h-16 mx-auto text-muted-foreground/40 mb-4" />
                <p className="text-muted-foreground">
                  No work experience entries yet. Add your professional history.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {experienceList.map((exp, index) => (
                  <Card key={index} className="p-4">
                    <h3 className="font-semibold">{exp.position}</h3>
                    <p className="text-sm text-muted-foreground">{exp.company}</p>
                  </Card>
                ))}
              </div>
            )}
          </div>
        );
      case 5:
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold">Skills</h2>
            <button
              onClick={() => setSkillDialog(true)}
              className="w-full border-2 border-dashed border-muted-foreground/30 rounded-lg p-8 hover:border-primary hover:bg-secondary/20 transition-all"
            >
              <div className="flex items-center justify-center gap-2 text-muted-foreground">
                <Plus className="w-5 h-5" />
                <span>Add Skills</span>
              </div>
            </button>
            {skillsList.length === 0 ? (
              <div className="text-center py-12">
                <Code className="w-16 h-16 mx-auto text-muted-foreground/40 mb-4" />
                <p className="text-muted-foreground">
                  No skills added yet. Add your technical and soft skills.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {skillsList.map((skill, index) => (
                  <Card key={index} className="p-4">
                    <h3 className="font-semibold">{skill.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      Proficiency: {skill.proficiency}/5
                    </p>
                  </Card>
                ))}
              </div>
            )}
          </div>
        );
      case 6:
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold">Projects</h2>
            <button
              onClick={() => setProjectDialog(true)}
              className="w-full border-2 border-dashed border-muted-foreground/30 rounded-lg p-8 hover:border-primary hover:bg-secondary/20 transition-all"
            >
              <div className="flex items-center justify-center gap-2 text-muted-foreground">
                <Plus className="w-5 h-5" />
                <span>Add Project</span>
              </div>
            </button>
            {projectsList.length === 0 ? (
              <div className="text-center py-12">
                <FolderOpen className="w-16 h-16 mx-auto text-muted-foreground/40 mb-4" />
                <p className="text-muted-foreground">
                  No projects added yet. Showcase your work by adding projects.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {projectsList.map((project, index) => (
                  <Card key={index} className="p-4">
                    <h3 className="font-semibold">{project.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {project.description}
                    </p>
                  </Card>
                ))}
              </div>
            )}
          </div>
        );
      case 7:
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold">Review</h2>
            <p className="text-muted-foreground">
              Review your resume and make any final changes.
            </p>
            <div className="space-y-4">
              <Card className="p-4">
                <h3 className="font-semibold mb-2">Summary</h3>
                <p className="text-sm text-muted-foreground">
                  Education: {educationList.length} entries
                </p>
                <p className="text-sm text-muted-foreground">
                  Experience: {experienceList.length} entries
                </p>
                <p className="text-sm text-muted-foreground">
                  Skills: {skillsList.length} entries
                </p>
                <p className="text-sm text-muted-foreground">
                  Projects: {projectsList.length} entries
                </p>
              </Card>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-background sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={onBack}>
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-xl font-bold">Build Your Resume</h1>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2 border-primary text-primary hover:bg-primary hover:text-white">
              <Sparkles className="w-4 h-4" />
              Auto-fill
            </Button>
            <Button variant="outline" className="gap-2">
              <Save className="w-4 h-4" />
              Save
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-24">
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-4">Your Progress</h3>
                  <div className="space-y-2">
                    {steps.map((step) => (
                      <div
                        key={step.id}
                        className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${
                          currentStep === step.id
                            ? "bg-primary text-primary-foreground"
                            : currentStep > step.id
                            ? "text-foreground"
                            : "text-muted-foreground"
                        }`}
                        onClick={() => setCurrentStep(step.id)}
                      >
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium ${
                            currentStep === step.id
                              ? "bg-primary-foreground text-primary"
                              : currentStep > step.id
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {currentStep > step.id ? (
                            <Check className="w-4 h-4" />
                          ) : (
                            step.id
                          )}
                        </div>
                        <span className="text-sm font-medium">{step.title}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Tips</h3>
                  <ul className="space-y-2">
                    {tips.map((tip, index) => (
                      <li key={index} className="text-sm text-muted-foreground flex gap-2">
                        <span className="text-primary">•</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Card className="p-8">
              {renderStepContent()}

              <div className="flex justify-between mt-8 pt-6 border-t">
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                  disabled={currentStep === 1}
                  className="gap-2"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </Button>
                <Button
                  onClick={() =>
                    setCurrentStep(Math.min(steps.length, currentStep + 1))
                  }
                  disabled={currentStep === steps.length}
                  className="gap-2 gradient-primary text-white hover:opacity-90"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>

      <AddEducationDialog
        open={educationDialog}
        onOpenChange={setEducationDialog}
        onAdd={(edu) => setEducationList([...educationList, edu])}
      />
      <AddExperienceDialog
        open={experienceDialog}
        onOpenChange={setExperienceDialog}
        onAdd={(exp) => setExperienceList([...experienceList, exp])}
      />
      <AddSkillDialog
        open={skillDialog}
        onOpenChange={setSkillDialog}
        onAdd={(skill) => setSkillsList([...skillsList, skill])}
      />
      <AddProjectDialog
        open={projectDialog}
        onOpenChange={setProjectDialog}
        onAdd={(project) => setProjectsList([...projectsList, project])}
      />
    </div>
  );
};

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ChevronLeft, ChevronRight, Save } from "lucide-react";
import { Stepper } from "@/components/company/Stepper";
import { InterviewTypeSelector } from "@/components/company/InterviewTypeSelector";
import { BasicJobDetails } from "@/components/company/BasicJobDetails";
import { InterviewSpecificFields } from "@/components/company/InterviewSpecificFields";
import { QuestionGeneration } from "@/components/company/QuestionGeneration";
import { JobDescriptionStep } from "@/components/company/JobDescriptionStep";

const jobFormSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(100),
  department: z.string().min(1, "Department is required"),
  location: z.string().min(1, "Location is required"),
  employmentType: z.enum(["full-time", "part-time", "contract", "internship"]),
  jobType: z.enum(["onsite", "remote", "hybrid"]),
  salaryMin: z.string().optional(),
  salaryMax: z.string().optional(),
  description: z.string().min(50, "Description must be at least 50 characters"),
  skills: z.array(z.string()).min(1, "Add at least one skill"),
  deadline: z.date({
    required_error: "Application deadline is required",
  }),
  interviewTypes: z.array(z.string()).min(1, "Select at least one interview type"),
  hrInterview: z.object({
    duration: z.string().optional(),
    interviewer: z.string().optional(),
    focusAreas: z.string().optional(),
  }).optional(),
  technicalInterview: z.object({
    difficulty: z.string().optional(),
    type: z.string().optional(),
    technologies: z.string().optional(),
    duration: z.string().optional(),
  }).optional(),
  mcqAssessment: z.object({
    questionCount: z.string().optional(),
    timePerQuestion: z.string().optional(),
    categories: z.string().optional(),
    passingScore: z.string().optional(),
  }).optional(),
});

type JobFormData = z.infer<typeof jobFormSchema>;

export default function CreateJob() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [generatedQuestions, setGeneratedQuestions] = useState<any[]>([]);

  const form = useForm<JobFormData>({
    resolver: zodResolver(jobFormSchema),
    defaultValues: {
      title: "",
      department: "",
      location: "",
      employmentType: "full-time",
      jobType: "remote",
      description: "",
      skills: [],
      interviewTypes: [],
      hrInterview: {
        duration: "60",
        interviewer: "hr-manager",
        focusAreas: "",
      },
      technicalInterview: {
        difficulty: "mid",
        type: "coding",
        technologies: "",
        duration: "90",
      },
      mcqAssessment: {
        questionCount: "20",
        timePerQuestion: "60",
        categories: "",
        passingScore: "70",
      },
    },
  });

  const getSteps = () => {
    const baseSteps = [
      { id: "interview-type", title: "Interview Type", description: "Select assessment types" },
      { id: "basic-details", title: "Basic Details", description: "Job information" },
      { id: "job-description", title: "Job Description", description: "Role details & requirements" },
    ];

    if (selectedTypes.length > 0) {
      baseSteps.splice(2, 0, {
        id: "interview-fields",
        title: "Interview Settings",
        description: "Configure interview parameters"
      });
      baseSteps.splice(3, 0, {
        id: "questions",
        title: "Questions",
        description: "Generate or add questions"
      });
    }

    return baseSteps;
  };

  const steps = getSteps();

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleTypeSelection = (types: string[]) => {
    setSelectedTypes(types);
    form.setValue("interviewTypes", types);
  };

  const onSubmit = (data: JobFormData) => {
    const finalData = {
      ...data,
      generatedQuestions,
      interviewTypes: selectedTypes,
    };
    
    console.log("Job data:", finalData);
    
    toast({
      title: "Job posted successfully!",
      description: `"${data.title}" is now live and accepting applications.`,
    });
    
    navigate("/company/jobs");
  };

  const saveDraft = () => {
    toast({
      title: "Draft saved",
      description: "You can continue editing this job later.",
    });
    navigate("/company/jobs");
  };

  const renderStepContent = () => {
    const currentStepId = steps[currentStep]?.id;
    
    switch (currentStepId) {
      case "interview-type":
        return (
          <InterviewTypeSelector
            selectedTypes={selectedTypes}
            onSelectionChange={handleTypeSelection}
          />
        );
      
      case "basic-details":
        return <BasicJobDetails form={form} />;
      
      case "interview-fields":
        return (
          <InterviewSpecificFields
            form={form}
            selectedTypes={selectedTypes}
          />
        );
      
      case "questions":
        return (
          <QuestionGeneration
            form={form}
            selectedTypes={selectedTypes}
            jobData={form.getValues()}
          />
        );
      
      case "job-description":
        return (
          <JobDescriptionStep
            form={form}
            jobData={form.getValues()}
          />
        );
      
      default:
        return null;
    }
  };

  const canProceedToNext = () => {
    const currentStepId = steps[currentStep]?.id;
    
    switch (currentStepId) {
      case "interview-type":
        return selectedTypes.length > 0;
      
      case "basic-details":
        const basicFields = ['title', 'department', 'location', 'deadline'];
        return basicFields.every(field => form.getValues(field));
      
      case "interview-fields":
        return true; // Fields are optional
      
      case "questions":
        return true; // Questions can be empty
      
      case "job-description":
        return form.getValues('description')?.length >= 50;
      
      default:
        return false;
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Post New Job</h1>
        <p className="text-muted-foreground">
          Create a new job posting with step-by-step guidance
        </p>
      </div>

      {/* Stepper */}
      <Stepper steps={steps} currentStep={currentStep} />

      {/* Form Content */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="min-h-[400px]">
            {renderStepContent()}
          </div>

          {/* Navigation Actions */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between">
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={saveDraft}
                  >
                    <Save className="mr-2 h-4 w-4" />
                    Save Draft
                  </Button>
                </div>
                
                <div className="flex gap-2">
                  {currentStep > 0 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handlePrevious}
                    >
                      <ChevronLeft className="mr-2 h-4 w-4" />
                      Previous
                    </Button>
                  )}
                  
                  {currentStep < steps.length - 1 ? (
                    <Button
                      type="button"
                      onClick={handleNext}
                      disabled={!canProceedToNext()}
                    >
                      Next
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      disabled={!canProceedToNext()}
                    >
                      Publish Job
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </form>
      </Form>
    </div>
  );
}

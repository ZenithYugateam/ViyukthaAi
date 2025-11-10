import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { CalendarIcon, Plus, X, Sparkles } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

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
  interviewType: z.enum(["custom", "ai-generated"]),
});

type JobFormData = z.infer<typeof jobFormSchema>;

export default function CreateJob() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [skillInput, setSkillInput] = useState("");
  const [customQuestions, setCustomQuestions] = useState<Array<{ id: string; question: string; type: string }>>([]);
  const [aiConfig, setAiConfig] = useState({ template: "technical", difficulty: "medium", questionCount: 5 });

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
      interviewType: "custom",
    },
  });

  const skills = form.watch("skills") || [];
  const interviewType = form.watch("interviewType");

  const addSkill = () => {
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      form.setValue("skills", [...skills, skillInput.trim()]);
      setSkillInput("");
    }
  };

  const removeSkill = (skill: string) => {
    form.setValue("skills", skills.filter(s => s !== skill));
  };

  const addCustomQuestion = () => {
    setCustomQuestions([
      ...customQuestions,
      { id: Date.now().toString(), question: "", type: "open-text" }
    ]);
  };

  const removeCustomQuestion = (id: string) => {
    setCustomQuestions(customQuestions.filter(q => q.id !== id));
  };

  const onSubmit = (data: JobFormData) => {
    console.log("Job data:", data);
    console.log("Custom questions:", customQuestions);
    console.log("AI config:", aiConfig);
    
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

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Post New Job</h1>
        <p className="text-muted-foreground">
          Create a new job posting and start receiving applications
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Essential details about the position</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Job Title</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Senior Frontend Engineer" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="department"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Department</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Engineering" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. San Francisco, CA" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="employmentType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Employment Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="full-time">Full-time</SelectItem>
                          <SelectItem value="part-time">Part-time</SelectItem>
                          <SelectItem value="contract">Contract</SelectItem>
                          <SelectItem value="internship">Internship</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="jobType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Work Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="onsite">Onsite</SelectItem>
                          <SelectItem value="remote">Remote</SelectItem>
                          <SelectItem value="hybrid">Hybrid</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="salaryMin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Salary Min (Optional)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="e.g. 100000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="salaryMax"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Salary Max (Optional)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="e.g. 150000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="deadline"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Application Deadline</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date()}
                          initialFocus
                          className="pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                    <FormDescription>
                      Applications will close on this date
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Job Description */}
          <Card>
            <CardHeader>
              <CardTitle>Job Description</CardTitle>
              <CardDescription>Describe the role and responsibilities</CardDescription>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        placeholder="Describe the role, responsibilities, requirements, and benefits..."
                        className="min-h-[200px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Minimum 50 characters. Include key responsibilities and requirements.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Skills */}
          <Card>
            <CardHeader>
              <CardTitle>Required Skills</CardTitle>
              <CardDescription>Add skills and technologies required for this role</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="e.g. React, TypeScript, Node.js"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
                />
                <Button type="button" onClick={addSkill} variant="secondary">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <Badge key={skill} variant="secondary" className="gap-1">
                    {skill}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => removeSkill(skill)}
                    />
                  </Badge>
                ))}
              </div>
              {form.formState.errors.skills && (
                <p className="text-sm text-destructive">{form.formState.errors.skills.message}</p>
              )}
            </CardContent>
          </Card>

          {/* Interview Configuration */}
          <Card>
            <CardHeader>
              <CardTitle>Interview Configuration</CardTitle>
              <CardDescription>Choose between custom questions or AI-generated interviews</CardDescription>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="interviewType"
                render={({ field }) => (
                  <FormItem>
                    <Tabs value={field.value} onValueChange={field.onChange}>
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="custom">Custom Questions</TabsTrigger>
                        <TabsTrigger value="ai-generated">
                          <Sparkles className="mr-2 h-4 w-4" />
                          AI-Generated
                        </TabsTrigger>
                      </TabsList>

                      <TabsContent value="custom" className="space-y-4 mt-4">
                        <div className="space-y-2">
                          {customQuestions.map((q) => (
                            <div key={q.id} className="flex gap-2">
                              <Input
                                placeholder="Enter your question..."
                                value={q.question}
                                onChange={(e) => {
                                  setCustomQuestions(customQuestions.map(question =>
                                    question.id === q.id ? { ...question, question: e.target.value } : question
                                  ));
                                }}
                              />
                              <Select
                                value={q.type}
                                onValueChange={(value) => {
                                  setCustomQuestions(customQuestions.map(question =>
                                    question.id === q.id ? { ...question, type: value } : question
                                  ));
                                }}
                              >
                                <SelectTrigger className="w-[180px]">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="open-text">Open Text</SelectItem>
                                  <SelectItem value="multiple-choice">Multiple Choice</SelectItem>
                                  <SelectItem value="coding">Coding</SelectItem>
                                </SelectContent>
                              </Select>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => removeCustomQuestion(q.id)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                        <Button type="button" variant="outline" onClick={addCustomQuestion}>
                          <Plus className="mr-2 h-4 w-4" />
                          Add Question
                        </Button>
                      </TabsContent>

                      <TabsContent value="ai-generated" className="space-y-4 mt-4">
                        <div className="space-y-4">
                          <div>
                            <Label>Interview Template</Label>
                            <Select value={aiConfig.template} onValueChange={(value) => setAiConfig({ ...aiConfig, template: value })}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="technical">Technical Assessment</SelectItem>
                                <SelectItem value="behavioral">Behavioral Interview</SelectItem>
                                <SelectItem value="role-specific">Role-Specific</SelectItem>
                                <SelectItem value="leadership">Leadership Assessment</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div>
                            <Label>Difficulty Level</Label>
                            <Select value={aiConfig.difficulty} onValueChange={(value) => setAiConfig({ ...aiConfig, difficulty: value })}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="entry">Entry Level</SelectItem>
                                <SelectItem value="medium">Intermediate</SelectItem>
                                <SelectItem value="senior">Senior Level</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div>
                            <Label>Number of Questions</Label>
                            <Select value={aiConfig.questionCount.toString()} onValueChange={(value) => setAiConfig({ ...aiConfig, questionCount: parseInt(value) })}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="3">3 Questions</SelectItem>
                                <SelectItem value="5">5 Questions</SelectItem>
                                <SelectItem value="7">7 Questions</SelectItem>
                                <SelectItem value="10">10 Questions</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="bg-muted p-4 rounded-lg">
                            <p className="text-sm text-muted-foreground">
                              <Sparkles className="inline h-4 w-4 mr-1" />
                              AI will generate {aiConfig.questionCount} {aiConfig.difficulty} level {aiConfig.template} questions based on your job description and required skills.
                            </p>
                          </div>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={saveDraft}>
              Save as Draft
            </Button>
            <Button type="submit">Publish Job</Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

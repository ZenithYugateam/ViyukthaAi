import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Sparkles, Plus, X, Loader2, FileText, Wand2 } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { cn } from "@/lib/utils";

interface JobDescriptionStepProps {
  form: UseFormReturn<any>;
  jobData: any;
}

export function JobDescriptionStep({ form, jobData }: JobDescriptionStepProps) {
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");
  const [isGeneratingJD, setIsGeneratingJD] = useState(false);

  const addSkill = () => {
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      setSkills([...skills, skillInput.trim()]);
      setSkillInput("");
    }
  };

  const removeSkill = (skill: string) => {
    setSkills(skills.filter(s => s !== skill));
  };

  const generateJobDescription = async () => {
    setIsGeneratingJD(true);
    
    // Simulate AI generation for job description
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const generatedDescription = `About the Role:

We are seeking a talented ${jobData?.title || 'Professional'} to join our ${jobData?.department || 'team'} in ${jobData?.location || 'our office'}. This is a ${jobData?.employmentType || 'full-time'} ${jobData?.jobType || 'remote'} position offering a competitive salary range of ${jobData?.salaryMin || '$80,000'} - ${jobData?.salaryMax || '$120,000'}.

What You'll Do:

• Design, develop, and maintain high-quality solutions that meet business requirements
• Collaborate with cross-functional teams to define, design, and ship new features
• Write clean, maintainable, and well-documented code following best practices
• Participate in code reviews and contribute to team knowledge sharing
• Troubleshoot, debug, and upgrade existing systems to ensure optimal performance
• Stay up-to-date with emerging technologies and industry trends

What We're Looking For:

• ${skills.length > 0 ? skills.slice(0, 3).join(' • ') : 'Relevant technical skills and experience'}
• Strong problem-solving abilities and attention to detail
• Excellent communication and collaboration skills
• Ability to work independently and in a team environment
• Passion for learning and adapting to new technologies
• Experience with agile development methodologies

What We Offer:

• Competitive compensation and benefits package
• Flexible work arrangements and work-life balance
• Professional development opportunities and career growth
• Collaborative and inclusive work environment
• Modern tools and technologies to support your work
• Regular team events and social activities

If you're passionate about ${skills[0] || 'technology'} and want to make an impact, we'd love to hear from you!`;

    form.setValue("description", generatedDescription);
    setIsGeneratingJD(false);
  };

  const enhanceJobDescription = async () => {
    setIsGeneratingJD(true);
    
    // Simulate AI enhancement
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const currentDescription = form.getValues("description") || "";
    const enhancedDescription = currentDescription + `

Requirements:

• ${skills.length > 0 ? skills.map(skill => `Proficiency in ${skill}`).join(' • ') : 'Relevant technical expertise'}
• Bachelor's degree in Computer Science, Engineering, or related field (or equivalent experience)
• ${jobData?.title?.includes('Senior') ? '5+ years of relevant experience' : jobData?.title?.includes('Lead') ? '8+ years of experience with leadership responsibilities' : '2+ years of relevant experience'}
• Strong understanding of software development lifecycle and best practices
• Experience with version control systems (e.g., Git)
• Excellent problem-solving and analytical skills

Nice to Have:

• Experience with cloud platforms (AWS, Azure, or GCP)
• Knowledge of containerization and orchestration technologies
• Previous experience in a similar industry
• Contributions to open-source projects
• Certifications in relevant technologies`;

    form.setValue("description", enhancedDescription);
    setIsGeneratingJD(false);
  };

  return (
    <div className="space-y-6">
      {/* Skills Section */}
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

          {skills.length > 0 && (
            <div className="bg-muted/50 p-4 rounded-lg">
              <p className="text-sm text-muted-foreground">
                These skills will be used to generate relevant interview questions and job description content.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Job Description Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Job Description</CardTitle>
              <CardDescription>Describe the role, responsibilities, and requirements</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={generateJobDescription}
                disabled={isGeneratingJD || !jobData?.title}
              >
                {isGeneratingJD ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Wand2 className="mr-2 h-4 w-4" />
                    Generate JD
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={enhanceJobDescription}
                disabled={isGeneratingJD || !form.getValues("description")}
              >
                {isGeneratingJD ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Enhancing...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Enhance
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea
                    placeholder="Describe the role, responsibilities, requirements, and benefits..."
                    className="min-h-[300px] font-mono text-sm"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  {form.getValues("description") ? (
                    <span className="text-green-600">
                      <FileText className="inline h-4 w-4 mr-1" />
                      {field.value?.length || 0} characters
                    </span>
                  ) : (
                    "Minimum 50 characters. Include key responsibilities and requirements."
                  )}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {form.getValues("description") && (
            <div className="bg-muted/30 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Preview:</h4>
              <div className="text-sm text-muted-foreground max-h-40 overflow-y-auto">
                {form.getValues("description")?.substring(0, 300)}
                {form.getValues("description")?.length > 300 && "..."}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common job description templates and enhancements</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                const template = `We are looking for a ${jobData?.title || 'professional'} to join our growing team. 

Key Responsibilities:
• Lead and contribute to project development
• Collaborate with cross-functional teams
• Ensure code quality and best practices
• Mentor junior team members

Requirements:
• Strong technical background
• Excellent problem-solving skills
• Great communication abilities
• Passion for innovation`;

                form.setValue("description", template);
              }}
            >
              <FileText className="mr-2 h-4 w-4" />
              Use Standard Template
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={() => {
                const currentDesc = form.getValues("description") || "";
                const benefits = `

Benefits & Perks:
• Competitive salary and equity package
• Comprehensive health, dental, and vision insurance
• Flexible work hours and remote work options
• Professional development budget
• Generous paid time off and parental leave
• Modern office space with great amenities
• Team building events and social activities`;
                
                form.setValue("description", currentDesc + benefits);
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Benefits Section
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

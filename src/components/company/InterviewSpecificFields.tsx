import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { Clock, Target, Layers, Users } from "lucide-react";

interface InterviewSpecificFieldsProps {
  form: UseFormReturn<any>;
  selectedTypes: string[];
}

export function InterviewSpecificFields({ form, selectedTypes }: InterviewSpecificFieldsProps) {
  const renderHRFields = () => (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <FormField
          control={form.control}
          name="hrInterview.duration"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Interview Duration</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="45">45 minutes</SelectItem>
                  <SelectItem value="60">60 minutes</SelectItem>
                  <SelectItem value="90">90 minutes</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="hrInterview.interviewer"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Interviewer Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="hr-manager">HR Manager</SelectItem>
                  <SelectItem value="team-lead">Team Lead</SelectItem>
                  <SelectItem value="department-head">Department Head</SelectItem>
                  <SelectItem value="panel">Interview Panel</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="hrInterview.focusAreas"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Focus Areas</FormLabel>
            <FormControl>
              <Textarea
                placeholder="e.g. Team collaboration, leadership potential, problem-solving approach, communication skills..."
                className="min-h-[100px]"
                {...field}
              />
            </FormControl>
            <FormDescription>
              Specify key areas to evaluate during the HR interview
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );

  const renderTechnicalFields = () => (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <FormField
          control={form.control}
          name="technicalInterview.difficulty"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Difficulty Level</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="junior">Junior (0-2 years)</SelectItem>
                  <SelectItem value="mid">Mid-level (2-5 years)</SelectItem>
                  <SelectItem value="senior">Senior (5+ years)</SelectItem>
                  <SelectItem value="lead">Lead/Principal</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="technicalInterview.type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Technical Assessment Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="coding">Coding Challenge</SelectItem>
                  <SelectItem value="system-design">System Design</SelectItem>
                  <SelectItem value="algorithm">Algorithm & Data Structures</SelectItem>
                  <SelectItem value="practical">Practical Problem Solving</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="technicalInterview.technologies"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Required Technologies</FormLabel>
            <FormControl>
              <Input
                placeholder="e.g. React, Node.js, Python, AWS..."
                {...field}
              />
            </FormControl>
            <FormDescription>
              List the key technologies to assess (comma-separated)
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
          name="technicalInterview.duration"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Time Limit</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="60">1 hour</SelectItem>
                  <SelectItem value="90">1.5 hours</SelectItem>
                  <SelectItem value="120">2 hours</SelectItem>
                  <SelectItem value="180">3 hours</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
    </div>
  );

  const renderMCQFields = () => (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <FormField
          control={form.control}
          name="mcqAssessment.questionCount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Number of Questions</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="10">10 Questions</SelectItem>
                  <SelectItem value="20">20 Questions</SelectItem>
                  <SelectItem value="30">30 Questions</SelectItem>
                  <SelectItem value="50">50 Questions</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="mcqAssessment.timePerQuestion"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Time per Question</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="30">30 seconds</SelectItem>
                  <SelectItem value="60">1 minute</SelectItem>
                  <SelectItem value="120">2 minutes</SelectItem>
                  <SelectItem value="300">5 minutes</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="mcqAssessment.categories"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Question Categories</FormLabel>
            <FormControl>
              <Textarea
                placeholder="e.g. Programming fundamentals, Database concepts, Web technologies, System architecture..."
                className="min-h-[100px]"
                {...field}
              />
            </FormControl>
            <FormDescription>
              Specify the categories of questions to include
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="mcqAssessment.passingScore"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Passing Score (%)</FormLabel>
            <FormControl>
              <Input
                type="number"
                min="0"
                max="100"
                placeholder="e.g. 70"
                {...field}
              />
            </FormControl>
            <FormDescription>
              Minimum score required to pass the assessment
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );

  const getInterviewIcon = (type: string) => {
    switch (type) {
      case 'hr': return <Users className="w-4 h-4" />;
      case 'technical': return <Target className="w-4 h-4" />;
      case 'mcq': return <Layers className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getInterviewTitle = (type: string) => {
    switch (type) {
      case 'hr': return 'HR Interview Settings';
      case 'technical': return 'Technical Interview Settings';
      case 'mcq': return 'MCQ Assessment Settings';
      default: return 'Interview Settings';
    }
  };

  return (
    <div className="space-y-6">
      {selectedTypes.map((type) => (
        <Card key={type}>
          <CardHeader>
            <div className="flex items-center gap-2">
              {getInterviewIcon(type)}
              <CardTitle>{getInterviewTitle(type)}</CardTitle>
            </div>
            <CardDescription>
              Configure specific settings for {type === 'hr' ? 'behavioral' : type === 'technical' ? 'technical' : 'assessment'} evaluation
            </CardDescription>
          </CardHeader>
          <CardContent>
            {type === 'hr' && renderHRFields()}
            {type === 'technical' && renderTechnicalFields()}
            {type === 'mcq' && renderMCQFields()}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

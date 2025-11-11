import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import { Sparkles, Plus, X, Loader2, CheckCircle, Circle } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { cn } from "@/lib/utils";

interface Question {
  id: string;
  question: string;
  type: string;
  category?: string;
  difficulty?: string;
  isAI?: boolean;
}

interface QuestionGenerationProps {
  form: UseFormReturn<any>;
  selectedTypes: string[];
  jobData: any;
}

export function QuestionGeneration({ form, selectedTypes, jobData }: QuestionGenerationProps) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationMode, setGenerationMode] = useState<'ai' | 'manual' | 'mixed'>('manual');
  const [aiConfig, setAiConfig] = useState({
    template: "technical",
    difficulty: "medium",
    questionCount: 5
  });

  const addCustomQuestion = () => {
    const newQuestion: Question = {
      id: Date.now().toString(),
      question: "",
      type: selectedTypes.includes('mcq') ? "multiple-choice" : "open-text",
      isAI: false
    };
    setQuestions([...questions, newQuestion]);
  };

  const removeQuestion = (id: string) => {
    setQuestions(questions.filter(q => q.id !== id));
  };

  const updateQuestion = (id: string, updates: Partial<Question>) => {
    setQuestions(questions.map(q => 
      q.id === id ? { ...q, ...updates } : q
    ));
  };

  const generateAIQuestions = async () => {
    setIsGenerating(true);
    
    // Simulate AI generation with animation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const aiQuestions: Question[] = [];
    const categories = selectedTypes.includes('hr') ? ['behavioral', 'cultural', 'motivational'] :
                      selectedTypes.includes('technical') ? ['coding', 'system-design', 'algorithms'] :
                      ['general', 'domain-specific'];
    
    for (let i = 0; i < aiConfig.questionCount; i++) {
      const category = categories[i % categories.length];
      let question = "";
      
      if (selectedTypes.includes('hr')) {
        const hrQuestions = [
          "Describe a time when you had to work with a difficult team member. How did you handle it?",
          "What motivates you to do your best work?",
          "How do you handle stress and pressure in the workplace?",
          "Tell me about a time you failed at something. What did you learn?",
          "Where do you see yourself in 5 years?"
        ];
        question = hrQuestions[i % hrQuestions.length];
      } else if (selectedTypes.includes('technical')) {
        const techQuestions = [
          "Design a URL shortening service like bit.ly. What would be your approach?",
          "Explain the difference between REST and GraphQL APIs.",
          "How would you optimize a slow database query?",
          "Write a function to detect if a binary tree is balanced.",
          "What are the key considerations when designing a microservices architecture?"
        ];
        question = techQuestions[i % techQuestions.length];
      } else {
        question = `Generated ${category} question ${i + 1} for ${jobData?.title || 'this position'}`;
      }
      
      aiQuestions.push({
        id: `ai-${Date.now()}-${i}`,
        question,
        type: selectedTypes.includes('mcq') ? "multiple-choice" : "open-text",
        category,
        difficulty: aiConfig.difficulty,
        isAI: true
      });
    }
    
    setQuestions([...questions, ...aiQuestions]);
    setIsGenerating(false);
  };

  const getQuestionTypeIcon = (type: string) => {
    switch (type) {
      case 'open-text': return <Circle className="w-4 h-4" />;
      case 'multiple-choice': return <CheckCircle className="w-4 h-4" />;
      case 'coding': return <Sparkles className="w-4 h-4" />;
      default: return <Circle className="w-4 h-4" />;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Question Generation Method</CardTitle>
          <CardDescription>Choose how you want to create interview questions</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={generationMode} onValueChange={(value: any) => setGenerationMode(value)}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="manual">Manual</TabsTrigger>
              <TabsTrigger value="ai">
                <Sparkles className="mr-2 h-4 w-4" />
                AI Generated
              </TabsTrigger>
              <TabsTrigger value="mixed">Mixed</TabsTrigger>
            </TabsList>

            <TabsContent value="manual" className="space-y-4 mt-4">
              <div className="bg-muted/50 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  Create your own custom questions tailored to your specific requirements.
                </p>
              </div>
              <Button onClick={addCustomQuestion} variant="outline">
                <Plus className="mr-2 h-4 w-4" />
                Add Question
              </Button>
            </TabsContent>

            <TabsContent value="ai" className="space-y-4 mt-4">
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <Label>Template</Label>
                  <Select value={aiConfig.template} onValueChange={(value) => setAiConfig({ ...aiConfig, template: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="technical">Technical</SelectItem>
                      <SelectItem value="behavioral">Behavioral</SelectItem>
                      <SelectItem value="mixed">Mixed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Difficulty</Label>
                  <Select value={aiConfig.difficulty} onValueChange={(value) => setAiConfig({ ...aiConfig, difficulty: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="easy">Easy</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="hard">Hard</SelectItem>
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
              </div>

              <Button 
                onClick={generateAIQuestions} 
                disabled={isGenerating}
                className="w-full"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating Questions...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate AI Questions
                  </>
                )}
              </Button>
            </TabsContent>

            <TabsContent value="mixed" className="space-y-4 mt-4">
              <div className="bg-muted/50 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  Combine AI-generated questions with your own custom questions for a comprehensive assessment.
                </p>
              </div>
              <div className="flex gap-2">
                <Button onClick={addCustomQuestion} variant="outline">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Custom Question
                </Button>
                <Button 
                  onClick={generateAIQuestions} 
                  disabled={isGenerating}
                  variant="secondary"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Add AI Questions
                    </>
                  )}
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {questions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Generated Questions</CardTitle>
            <CardDescription>
              Review and edit your interview questions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {questions.map((question, index) => (
              <div 
                key={question.id} 
                className={cn(
                  "p-4 border rounded-lg space-y-3 transition-all duration-200",
                  question.isAI && "bg-blue-50 border-blue-200"
                )}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    {getQuestionTypeIcon(question.type)}
                    <span className="font-medium">Question {index + 1}</span>
                    {question.isAI && (
                      <Badge variant="secondary" className="text-xs">
                        <Sparkles className="w-3 h-3 mr-1" />
                        AI Generated
                      </Badge>
                    )}
                    {question.category && (
                      <Badge variant="outline" className="text-xs">
                        {question.category}
                      </Badge>
                    )}
                    {question.difficulty && (
                      <Badge className={cn("text-xs", getDifficultyColor(question.difficulty))}>
                        {question.difficulty}
                      </Badge>
                    )}
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeQuestion(question.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <Textarea
                  placeholder="Enter your question..."
                  value={question.question}
                  onChange={(e) => updateQuestion(question.id, { question: e.target.value })}
                  className="min-h-[80px]"
                />

                <div className="flex gap-2">
                  <Select
                    value={question.type}
                    onValueChange={(value) => updateQuestion(question.id, { type: value })}
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

                  {selectedTypes.includes('technical') && (
                    <Select
                      value={question.difficulty || 'medium'}
                      onValueChange={(value) => updateQuestion(question.id, { difficulty: value })}
                    >
                      <SelectTrigger className="w-[120px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="easy">Easy</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="hard">Hard</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                </div>
              </div>
            ))}

            <div className="flex justify-between items-center pt-4 border-t">
              <p className="text-sm text-muted-foreground">
                Total: {questions.length} questions
              </p>
              <Button onClick={addCustomQuestion} variant="outline" size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Add Another
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

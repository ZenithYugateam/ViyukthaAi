import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Code, FileQuestion, Brain } from "lucide-react";

interface InterviewType {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  features: string[];
}

const interviewTypes: InterviewType[] = [
  {
    id: "hr",
    title: "HR Interview",
    description: "Behavioral and cultural fit assessment",
    icon: <Users className="w-6 h-6" />,
    features: ["Behavioral questions", "Cultural fit", "Communication skills", "Motivation assessment"]
  },
  {
    id: "technical",
    title: "Technical Interview", 
    description: "Technical skills and problem-solving evaluation",
    icon: <Code className="w-6 h-6" />,
    features: ["Coding challenges", "System design", "Technical concepts", "Problem solving"]
  },
  {
    id: "mcq",
    title: "MCQ Assessment",
    description: "Multiple choice questions for quick evaluation",
    icon: <FileQuestion className="w-6 h-6" />,
    features: ["Quick assessment", "Objective evaluation", "Knowledge testing", "Scalable screening"]
  },
  {
    id: "mixed",
    title: "Mixed Assessment",
    description: "Combination of multiple interview types",
    icon: <Brain className="w-6 h-6" />,
    features: ["HR + Technical", "Comprehensive evaluation", "Multiple stages", "Flexible approach"]
  }
];

interface InterviewTypeSelectorProps {
  selectedTypes: string[];
  onSelectionChange: (types: string[]) => void;
}

export function InterviewTypeSelector({ selectedTypes, onSelectionChange }: InterviewTypeSelectorProps) {
  const toggleType = (typeId: string) => {
    if (typeId === "mixed") {
      onSelectionChange(["mixed"]);
    } else {
      const newSelection = selectedTypes.includes(typeId)
        ? selectedTypes.filter(t => t !== typeId)
        : [...selectedTypes.filter(t => t !== "mixed"), typeId];
      onSelectionChange(newSelection);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        {interviewTypes.map((type) => (
          <Card 
            key={type.id}
            className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
              selectedTypes.includes(type.id) 
                ? 'ring-2 ring-primary bg-primary/5' 
                : 'hover:bg-muted/50'
            }`}
            onClick={() => toggleType(type.id)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${
                  selectedTypes.includes(type.id) ? 'bg-primary text-primary-foreground' : 'bg-muted'
                }`}>
                  {type.icon}
                </div>
                <div className="flex-1">
                  <CardTitle className="text-lg">{type.title}</CardTitle>
                  <CardDescription className="text-sm">{type.description}</CardDescription>
                </div>
                {selectedTypes.includes(type.id) && (
                  <Badge variant="default">Selected</Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2">
                {type.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground" />
                    {feature}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {selectedTypes.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-4">
          Select at least one interview type to proceed
        </p>
      )}
      
      {selectedTypes.length > 0 && (
        <div className="bg-muted/50 p-4 rounded-lg">
          <p className="text-sm font-medium mb-2">Selected Interview Types:</p>
          <div className="flex flex-wrap gap-2">
            {selectedTypes.map(typeId => {
              const type = interviewTypes.find(t => t.id === typeId);
              return type ? (
                <Badge key={typeId} variant="secondary">
                  {type.title}
                </Badge>
              ) : null;
            })}
          </div>
        </div>
      )}
    </div>
  );
}

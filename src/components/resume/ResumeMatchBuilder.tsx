import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { FileText, Upload, ArrowRight, ArrowLeft, CheckCircle2, Download, Type } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist';
import { RenderCVTemplate } from "./templates/RenderCVTemplate";
import { ModernCenteredTemplate } from "./templates/ModernCenteredTemplate";
import { JakeTemplate } from "./templates/JakeTemplate";
import { resumeTemplates } from "@/data/resumeTemplates";
import { ResumeFormData } from "./ResumeDataForm";
import { generateResumePDF } from "@/utils/pdfGenerator";

// Initialize a dedicated module worker to avoid fake-worker fallback
const pdfjsWorker = new Worker(
  new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url),
  { type: 'module' }
);
GlobalWorkerOptions.workerPort = pdfjsWorker;

type Step = "preferences" | "upload" | "parsing" | "processing" | "analysis" | "enhance" | "generated";

interface AnalysisResult {
  matchScore: number;
  jobTitleMatch: string;
  keywordCount: number;
  totalExpectedKeywords: number;
  missingKeywords: string[];
  sectionsToEnhance: string[];
  resumeStructure?: string[];
}

interface GeneratedResumeResult {
  generatedResume: ResumeFormData | string;
  success: boolean;
}

export const ResumeMatchBuilder = ({ onBack }: { onBack: () => void }) => {
  const [currentStep, setCurrentStep] = useState<Step>("preferences");
  const [jobFunction, setJobFunction] = useState("");
  const [jobRole, setJobRole] = useState("");
  const [jobType, setJobType] = useState<string[]>(["full-time"]);
  const [country, setCountry] = useState("india");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [openToRemote, setOpenToRemote] = useState(true);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeText, setResumeText] = useState("");
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState(resumeTemplates[0].id);
  const [generatedResume, setGeneratedResume] = useState<ResumeFormData | string | null>(null);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [selectedSections, setSelectedSections] = useState<string[]>([]);
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [parsingProgress, setParsingProgress] = useState(0);
  const [selectedFont, setSelectedFont] = useState<string>("charter");
  const { toast } = useToast();

  const jobFunctions = [
    { value: "software", label: "Software/Internet/AI" },
    { value: "data", label: "Data & Analytics" },
    { value: "ml", label: "Machine Learning & AI" },
    { value: "consulting", label: "Consulting" },
    { value: "marketing", label: "Marketing" },
    { value: "finance", label: "Finance" },
  ];

  const jobRoles = [
    { value: "software-engineer", label: "Software Engineer" },
    { value: "frontend-developer", label: "Frontend Developer" },
    { value: "backend-developer", label: "Backend Developer" },
    { value: "full-stack-developer", label: "Full Stack Developer" },
    { value: "data-scientist", label: "Data Scientist" },
    { value: "data-analyst", label: "Data Analyst" },
    { value: "ml-engineer", label: "Machine Learning Engineer" },
    { value: "devops-engineer", label: "DevOps Engineer" },
    { value: "product-manager", label: "Product Manager" },
    { value: "ui-ux-designer", label: "UI/UX Designer" },
    { value: "qa-engineer", label: "QA Engineer" },
    { value: "business-analyst", label: "Business Analyst" },
  ];

  const countries = [
    { value: "india", label: "India" },
    { value: "usa", label: "United States" },
    { value: "uk", label: "United Kingdom" },
    { value: "canada", label: "Canada" },
    { value: "australia", label: "Australia" },
  ];

  const statesByCountry: { [key: string]: { [key: string]: string[] } } = {
    india: {
    "maharashtra": ["Mumbai", "Pune", "Nagpur", "Nashik", "Thane", "Aurangabad"],
    "karnataka": ["Bangalore", "Mysore", "Mangalore", "Hubli", "Belgaum"],
    "delhi": ["New Delhi", "North Delhi", "South Delhi", "East Delhi", "West Delhi"],
    "tamil-nadu": ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem"],
    "telangana": ["Hyderabad", "Warangal", "Nizamabad", "Khammam", "Karimnagar"],
    "uttar-pradesh": ["Lucknow", "Kanpur", "Agra", "Varanasi", "Noida", "Ghaziabad"],
    "gujarat": ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Bhavnagar"],
    "rajasthan": ["Jaipur", "Jodhpur", "Udaipur", "Kota", "Ajmer"],
    "west-bengal": ["Kolkata", "Howrah", "Durgapur", "Asansol", "Siliguri"],
    "haryana": ["Gurugram", "Faridabad", "Panipat", "Ambala", "Karnal"],
    "punjab": ["Chandigarh", "Ludhiana", "Amritsar", "Jalandhar", "Patiala"],
    "madhya-pradesh": ["Bhopal", "Indore", "Gwalior", "Jabalpur", "Ujjain"],
    "kerala": ["Thiruvananthapuram", "Kochi", "Kozhikode", "Thrissur", "Kollam"],
    "andhra-pradesh": ["Visakhapatnam", "Vijayawada", "Guntur", "Tirupati", "Kakinada"],
    "odisha": ["Bhubaneswar", "Cuttack", "Rourkela", "Berhampur", "Sambalpur"],
    "jharkhand": ["Ranchi", "Jamshedpur", "Dhanbad", "Bokaro", "Deoghar"],
    "assam": ["Guwahati", "Silchar", "Dibrugarh", "Jorhat", "Nagaon"],
    "chhattisgarh": ["Raipur", "Bhilai", "Bilaspur", "Korba", "Durg"],
    "bihar": ["Patna", "Gaya", "Bhagalpur", "Muzaffarpur", "Darbhanga"],
    "uttarakhand": ["Dehradun", "Haridwar", "Roorkee", "Haldwani", "Rudrapur"],
    "himachal-pradesh": ["Shimla", "Dharamshala", "Solan", "Mandi", "Kullu"],
      "goa": ["Panaji", "Margao", "Vasco da Gama", "Mapusa", "Ponda"],
    },
    usa: {
      "california": ["Los Angeles", "San Francisco", "San Diego", "San Jose", "Sacramento"],
      "texas": ["Houston", "Austin", "Dallas", "San Antonio", "Fort Worth"],
      "new-york": ["New York City", "Buffalo", "Rochester", "Albany", "Syracuse"],
      "florida": ["Miami", "Orlando", "Tampa", "Jacksonville", "Fort Lauderdale"],
      "illinois": ["Chicago", "Aurora", "Naperville", "Joliet", "Rockford"],
    },
    uk: {
      "england": ["London", "Manchester", "Birmingham", "Liverpool", "Leeds"],
      "scotland": ["Edinburgh", "Glasgow", "Aberdeen", "Dundee", "Inverness"],
      "wales": ["Cardiff", "Swansea", "Newport", "Wrexham", "Barry"],
    },
    canada: {
      "ontario": ["Toronto", "Ottawa", "Mississauga", "Brampton", "Hamilton"],
      "quebec": ["Montreal", "Quebec City", "Laval", "Gatineau", "Longueuil"],
      "british-columbia": ["Vancouver", "Surrey", "Burnaby", "Richmond", "Abbotsford"],
    },
    australia: {
      "new-south-wales": ["Sydney", "Newcastle", "Wollongong", "Central Coast", "Maitland"],
      "victoria": ["Melbourne", "Geelong", "Ballarat", "Bendigo", "Frankston"],
      "queensland": ["Brisbane", "Gold Coast", "Sunshine Coast", "Townsville", "Cairns"],
    },
  };

  const jobTypeOptions = [
    { value: "full-time", label: "Full-time" },
    { value: "contract", label: "Contract" },
    { value: "part-time", label: "Part-time" },
    { value: "internship", label: "Internship" },
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      validateAndSetFile(file);
    }
  };

  const validateAndSetFile = (file: File) => {
    if (file.type === "application/pdf") {
      setResumeFile(file);
      toast({
        title: "File uploaded",
        description: `${file.name} is ready for analysis`,
      });
    } else {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF file",
        variant: "destructive",
      });
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      validateAndSetFile(file);
    }
  };

  const handleNext = async () => {
    if (currentStep === "preferences" && !jobFunction) {
      toast({
        title: "Required field",
        description: "Please select a job function",
        variant: "destructive",
      });
      return;
    }

    if (currentStep === "upload") {
      if (!resumeFile) {
        toast({
          title: "Resume required",
          description: "Please upload your resume",
          variant: "destructive",
        });
        return;
      }
      setCurrentStep("parsing");
      setParsingProgress(0);
      
      try {
        // Read PDF file and extract text
        setParsingProgress(20);
        const arrayBuffer = await resumeFile.arrayBuffer();
        
        setParsingProgress(40);
        const pdf = await getDocument({ data: arrayBuffer }).promise;
        
        setParsingProgress(60);
        let fullText = '';
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          const pageText = textContent.items
            .map((item: any) => item.str)
            .join(' ');
          fullText += pageText + '\n';
          
          // Update progress based on pages parsed
          setParsingProgress(60 + (i / pdf.numPages) * 30);
        }
        
        setResumeText(fullText);
        setParsingProgress(100);
        
        // Small delay to show 100% before moving to processing
        await new Promise(resolve => setTimeout(resolve, 500));
        setCurrentStep("processing");
        
        // Simulate progress for AI analysis
        let progress = 0;
        const interval = setInterval(() => {
          progress += 20;
          setProcessingProgress(progress);
        }, 300);

        // Call AI analysis
        const { data, error } = await supabase.functions.invoke('analyze-resume', {
          body: { 
            resumeText: fullText,
            jobFunction: jobFunctions.find(f => f.value === jobFunction)?.label || jobFunction,
            jobType: jobType.join(", ")
          }
        });

        clearInterval(interval);
        setProcessingProgress(100);

        if (error) {
          console.error("Analysis error:", error);
          toast({
            title: "Analysis failed",
            description: "Could not analyze resume. Please try again.",
            variant: "destructive",
          });
          setCurrentStep("upload");
          return;
        }

        setAnalysisResult(data);
        setTimeout(() => setCurrentStep("analysis"), 500);
      } catch (error) {
        console.error("Error processing resume:", error);
        toast({
          title: "Processing error",
          description: error instanceof Error ? error.message : "Failed to process PDF. Please ensure the file is a valid PDF.",
          variant: "destructive",
        });
        setCurrentStep("upload");
      }
      return;
    }

    if (currentStep === "preferences") {
      setCurrentStep("upload");
    } else if (currentStep === "analysis") {
      // Initialize selected sections and keywords with all options checked
      setSelectedSections(analysisResult?.sectionsToEnhance || []);
      setSelectedKeywords(analysisResult?.missingKeywords.slice(0, 6) || []);
      setCurrentStep("enhance");
    }
  };

// Parse the generated resume (JSON or text) into structured data for template rendering
const parseGeneratedResume = (resume: string | ResumeFormData): ResumeFormData => {
  // If it's already structured, return as-is
  if (typeof resume === 'object' && resume !== null) {
    return resume as ResumeFormData;
  }
  const resumeText = String(resume);
  const lines = resumeText.split('\n').filter(line => line.trim());
    
    // Extract personal info from first few lines
    const nameMatch = lines[0]?.match(/^([A-Z\s]+)/);
    const name = nameMatch ? nameMatch[1].trim() : "Your Name";
    
    // Try to extract contact info
    const contactLine = lines.find(line => line.includes('@') || line.includes('+'));
    const emailMatch = contactLine?.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/);
    const phoneMatch = contactLine?.match(/(\+?\d[\d\s-]+)/);
    const locationMatch = lines.find(line => line.includes('Hyderabad') || line.includes('Location'))?.trim();
    
    // Extract LinkedIn and GitHub
    const linkedinMatch = resumeText.match(/linkedin\.com\/[^\s]+/);
    const githubMatch = resumeText.match(/github\.com\/[^\s]+/);
    
    // Extract summary
    const summaryStart = resumeText.indexOf('Summary:');
    const summaryEnd = resumeText.indexOf('\n\nEducation');
    const summary = summaryStart !== -1 && summaryEnd !== -1 
      ? resumeText.substring(summaryStart + 8, summaryEnd).trim()
      : "";

    // Extract education entries
    const education: any[] = [];
    const educationSection = resumeText.match(/Education([\s\S]*?)(?=Projects|Experience|Skills|$)/);
    if (educationSection) {
      const eduLines = educationSection[1].split('\n').filter(l => l.trim());
      let i = 0;
      while (i < eduLines.length) {
        const line = eduLines[i].trim();
        if (line && !line.startsWith('-')) {
          const nextLine = eduLines[i + 1]?.trim();
          education.push({
            institution: line.split(',')[0]?.trim() || "",
            degree: nextLine || "",
            location: line.split(',')[1]?.trim() || "",
            startDate: "",
            endDate: nextLine?.match(/\d{4}\s*[-–]\s*\d{4}/)?.toString() || "",
          });
          i += 2;
        } else {
          i++;
        }
      }
    }

    // Extract projects
    const projects: any[] = [];
    const projectsSection = resumeText.match(/Projects([\s\S]*?)(?=Skills|Experience|Education|$)/);
    if (projectsSection) {
      const projLines = projectsSection[1].split('\n').filter(l => l.trim());
      let currentProject: any = null;
      
      projLines.forEach(line => {
        line = line.trim();
        if (line && !line.startsWith('-') && !line.toLowerCase().startsWith('skills')) {
          if (currentProject) {
            projects.push(currentProject);
          }
          currentProject = {
            title: line,
            highlights: [],
          };
        } else if (line.toLowerCase().startsWith('skills') && currentProject) {
          currentProject.highlights.push(line);
        }
      });
      
      if (currentProject) {
        projects.push(currentProject);
      }
    }

    // Extract skills
    const skillsMatch = resumeText.match(/Skills\s*:\s*([^\n]+)/);
    const skillsText = skillsMatch ? skillsMatch[1] : "";
    const skillsList = skillsText.split(',').map(s => s.trim()).filter(Boolean);

    return {
      personalInfo: {
        name: name,
        location: locationMatch || "Your Location",
        email: emailMatch ? emailMatch[1] : "your.email@example.com",
        phone: phoneMatch ? phoneMatch[1].trim() : "+1 234 567 8900",
        linkedin: linkedinMatch ? `https://${linkedinMatch[0]}` : "",
        github: githubMatch ? `https://${githubMatch[0]}` : "",
      },
      summary: summary,
      education: education.length > 0 ? education : [],
      experience: [],
      projects: projects.length > 0 ? projects : [],
      skills: {
        technologies: skillsList,
      },
    };
  };

  const handleDownloadResume = async () => {
    try {
      setIsDownloading(true);
      
      // Generate filename based on parsed resume data
      const parsedData = parseGeneratedResume(generatedResume);
      const fileName = `${parsedData.personalInfo.name.replace(/\s+/g, '_')}_Resume.pdf`;
      
      await generateResumePDF('resume-preview-container', fileName);
      
      toast({
        title: "Success!",
        description: "Your resume has been downloaded as PDF",
      });
    } catch (error) {
      console.error('Error downloading resume:', error);
      toast({
        title: "Error",
        description: "Failed to download resume. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  const handleGenerateResume = async () => {
    if (!resumeText || !jobFunction) {
      toast({
        title: "Missing information",
        description: "Resume text or job function is missing",
        variant: "destructive",
      });
      return;
    }

    setCurrentStep("processing");
    setProcessingProgress(0);

    try {
      // Simulate progress
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        if (progress <= 90) setProcessingProgress(progress);
      }, 500);

      const { data, error } = await supabase.functions.invoke('generate-resume', {
        body: {
          resumeText,
          jobFunction: jobFunctions.find(f => f.value === jobFunction)?.label || jobFunction,
          jobRole: jobRoles.find(r => r.value === jobRole)?.label || jobRole || "Not specified",
          sectionsToEnhance: selectedSections,
          missingKeywords: selectedKeywords,
          resumeStructure: analysisResult?.resumeStructure || []
        }
      });

      clearInterval(interval);
      setProcessingProgress(100);

      if (error) {
        console.error("Generation error:", error);
        toast({
          title: "Generation failed",
          description: "Could not generate resume. Please try again.",
          variant: "destructive",
        });
        setCurrentStep("enhance");
        return;
      }

      if (data?.generatedResume) {
        setGeneratedResume(data.generatedResume);
        setTimeout(() => setCurrentStep("generated"), 500);
        toast({
          title: "Success!",
          description: "Your optimized resume has been generated",
        });
      } else {
        throw new Error("No resume content received");
      }
    } catch (error) {
      console.error("Error generating resume:", error);
      toast({
        title: "Generation error",
        description: "Failed to generate resume",
        variant: "destructive",
      });
      setCurrentStep("enhance");
    }
  };

  const toggleSection = (section: string) => {
    setSelectedSections(prev =>
      prev.includes(section)
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const toggleKeyword = (keyword: string) => {
    setSelectedKeywords(prev =>
      prev.includes(keyword)
        ? prev.filter(k => k !== keyword)
        : [...prev, keyword]
    );
  };

  const selectAllKeywords = () => {
    if (analysisResult) {
      setSelectedKeywords(analysisResult.missingKeywords.slice(0, 6));
    }
  };

  const toggleJobType = (type: string) => {
    setJobType(prev =>
      prev.includes(type)
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" onClick={onBack} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Templates
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Resume Builder</h1>
          <p className="text-muted-foreground mt-2">
            Get your resume analyzed and matched with jobs
          </p>
        </div>

        {/* Step 1: Job Preferences */}
        {currentStep === "preferences" && (
          <Card className="p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2">What type of role are you looking for?</h2>
              <p className="text-muted-foreground">
                Help us understand your job preferences for better matching
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <Label className="text-base font-semibold mb-3 block">
                  Job Function <span className="text-red-500">*</span>
                </Label>
                <Select value={jobFunction} onValueChange={setJobFunction}>
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="Please select/enter your expected job function" />
                  </SelectTrigger>
                  <SelectContent className="bg-white z-50">
                    {jobFunctions.map((func) => (
                      <SelectItem key={func.value} value={func.value}>
                        {func.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-base font-semibold mb-3 block">
                  Job Role <span className="text-red-500">*</span>
                </Label>
                <Select value={jobRole} onValueChange={setJobRole}>
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="Select your desired job role" />
                  </SelectTrigger>
                  <SelectContent className="bg-white z-50 max-h-[300px]">
                    {jobRoles.map((role) => (
                      <SelectItem key={role.value} value={role.value}>
                        {role.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-base font-semibold mb-3 block">
                  Job Type <span className="text-red-500">*</span>
                </Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {jobTypeOptions.map((option) => (
                    <div
                      key={option.value}
                      className={`flex items-center space-x-2 p-3 border rounded-lg cursor-pointer transition-colors ${
                        jobType.includes(option.value)
                          ? "bg-primary/10 border-primary"
                          : "hover:border-gray-400"
                      }`}
                      onClick={() => toggleJobType(option.value)}
                    >
                      <Checkbox
                        checked={jobType.includes(option.value)}
                        onCheckedChange={() => toggleJobType(option.value)}
                      />
                      <Label className="cursor-pointer font-normal">{option.label}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-base font-semibold mb-3 block">
                  Country <span className="text-red-500">*</span>
                </Label>
                <Select value={country} onValueChange={(value) => {
                  setCountry(value);
                  setState("");
                  setCity("");
                }}>
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="Select your country" />
                  </SelectTrigger>
                  <SelectContent className="bg-white z-50">
                    {countries.map((c) => (
                      <SelectItem key={c.value} value={c.value}>
                        {c.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-base font-semibold mb-3 block">
                  State/Province/Region <span className="text-red-500">*</span>
                </Label>
                <Select value={state} onValueChange={(value) => {
                  setState(value);
                  setCity("");
                }}>
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="Select your state" />
                  </SelectTrigger>
                  <SelectContent className="bg-white z-50 max-h-[300px]">
                    {country === "india" && (
                      <>
                        <SelectItem value="andhra-pradesh">Andhra Pradesh</SelectItem>
                        <SelectItem value="arunachal-pradesh">Arunachal Pradesh</SelectItem>
                        <SelectItem value="assam">Assam</SelectItem>
                        <SelectItem value="bihar">Bihar</SelectItem>
                        <SelectItem value="chhattisgarh">Chhattisgarh</SelectItem>
                        <SelectItem value="goa">Goa</SelectItem>
                        <SelectItem value="gujarat">Gujarat</SelectItem>
                        <SelectItem value="haryana">Haryana</SelectItem>
                        <SelectItem value="himachal-pradesh">Himachal Pradesh</SelectItem>
                        <SelectItem value="jharkhand">Jharkhand</SelectItem>
                        <SelectItem value="karnataka">Karnataka</SelectItem>
                        <SelectItem value="kerala">Kerala</SelectItem>
                        <SelectItem value="madhya-pradesh">Madhya Pradesh</SelectItem>
                        <SelectItem value="maharashtra">Maharashtra</SelectItem>
                        <SelectItem value="manipur">Manipur</SelectItem>
                        <SelectItem value="meghalaya">Meghalaya</SelectItem>
                        <SelectItem value="mizoram">Mizoram</SelectItem>
                        <SelectItem value="nagaland">Nagaland</SelectItem>
                        <SelectItem value="odisha">Odisha</SelectItem>
                        <SelectItem value="punjab">Punjab</SelectItem>
                        <SelectItem value="rajasthan">Rajasthan</SelectItem>
                        <SelectItem value="sikkim">Sikkim</SelectItem>
                        <SelectItem value="tamil-nadu">Tamil Nadu</SelectItem>
                        <SelectItem value="telangana">Telangana</SelectItem>
                        <SelectItem value="tripura">Tripura</SelectItem>
                        <SelectItem value="uttar-pradesh">Uttar Pradesh</SelectItem>
                        <SelectItem value="uttarakhand">Uttarakhand</SelectItem>
                        <SelectItem value="west-bengal">West Bengal</SelectItem>
                        <SelectItem value="delhi">Delhi</SelectItem>
                      </>
                    )}
                    {country === "usa" && (
                      <>
                        <SelectItem value="california">California</SelectItem>
                        <SelectItem value="texas">Texas</SelectItem>
                        <SelectItem value="new-york">New York</SelectItem>
                        <SelectItem value="florida">Florida</SelectItem>
                        <SelectItem value="illinois">Illinois</SelectItem>
                      </>
                    )}
                    {country === "uk" && (
                      <>
                        <SelectItem value="england">England</SelectItem>
                        <SelectItem value="scotland">Scotland</SelectItem>
                        <SelectItem value="wales">Wales</SelectItem>
                      </>
                    )}
                    {country === "canada" && (
                      <>
                        <SelectItem value="ontario">Ontario</SelectItem>
                        <SelectItem value="quebec">Quebec</SelectItem>
                        <SelectItem value="british-columbia">British Columbia</SelectItem>
                      </>
                    )}
                    {country === "australia" && (
                      <>
                        <SelectItem value="new-south-wales">New South Wales</SelectItem>
                        <SelectItem value="victoria">Victoria</SelectItem>
                        <SelectItem value="queensland">Queensland</SelectItem>
                      </>
                    )}
                  </SelectContent>
                </Select>
              </div>

              {state && statesByCountry[country]?.[state] && (
                <div>
                  <Label className="text-base font-semibold mb-3 block">
                    City <span className="text-red-500">*</span>
                  </Label>
                  <Select value={city} onValueChange={setCity}>
                    <SelectTrigger className="bg-white">
                      <SelectValue placeholder="Select your city" />
                    </SelectTrigger>
                    <SelectContent className="bg-white z-50 max-h-[300px]">
                      {statesByCountry[country][state].map((cityName) => (
                        <SelectItem key={cityName} value={cityName.toLowerCase().replace(/\s+/g, '-')}>
                          {cityName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div>
                <Label className="text-base font-semibold mb-3 block">Open to Remote Work?</Label>
                <div className="grid grid-cols-2 gap-3">
                  <div
                    className={`p-3 border rounded-lg cursor-pointer ${
                      openToRemote ? "bg-primary/10 border-primary" : "hover:border-gray-400"
                    }`}
                    onClick={() => setOpenToRemote(true)}
                  >
                    <Label className="cursor-pointer font-normal">Yes</Label>
                  </div>
                  <div
                    className={`p-3 border rounded-lg cursor-pointer ${
                      !openToRemote ? "bg-primary/10 border-primary" : "hover:border-gray-400"
                    }`}
                    onClick={() => setOpenToRemote(false)}
                  >
                    <Label className="cursor-pointer font-normal">No</Label>
                  </div>
                </div>
              </div>

              <Button
                onClick={handleNext}
                className="w-full gradient-primary hover:gradient-primary-hover h-12 text-lg font-semibold"
              >
                Next
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </Card>
        )}

        {/* Step 2: Resume Upload */}
        {currentStep === "upload" && (
          <Card className="p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2">Upload Your Resume</h2>
              <p className="text-muted-foreground">
                Upload your resume to get matched with relevant job opportunities
              </p>
            </div>

            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-gray-700">
                Data privacy is our top priority. Your resume will only be used for job matching
                and will never be shared with third parties.
              </p>
            </div>

            <div
              className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all ${
                isDragging
                  ? "border-primary bg-primary/5 scale-[1.02]"
                  : resumeFile
                  ? "border-green-500 bg-green-50"
                  : "border-gray-300 hover:border-primary hover:bg-gray-50"
              }`}
              onClick={() => document.getElementById("resume-file")?.click()}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="flex flex-col items-center gap-4">
                <div className={`w-20 h-20 rounded-full flex items-center justify-center transition-colors ${
                  isDragging
                    ? "bg-primary/20"
                    : resumeFile
                    ? "bg-green-100"
                    : "bg-blue-50"
                }`}>
                  {resumeFile ? (
                    <CheckCircle2 className="w-10 h-10 text-green-600" />
                  ) : isDragging ? (
                    <Upload className="w-10 h-10 text-primary animate-bounce" />
                  ) : (
                    <Upload className="w-10 h-10 text-primary" />
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-1">
                    {resumeFile 
                      ? `✓ ${resumeFile.name}` 
                      : isDragging 
                      ? "Drop your resume here" 
                      : "Upload Your Resume"}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {isDragging 
                      ? "Release to upload your PDF file"
                      : "Drag & drop your PDF here or click to browse"}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    PDF format • Max 10MB
                  </p>
                </div>
                <Input
                  id="resume-file"
                  type="file"
                  accept=".pdf"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <Button
                variant="outline"
                onClick={() => setCurrentStep("preferences")}
                className="flex-1"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <Button
                onClick={handleNext}
                disabled={!resumeFile}
                className="flex-1 gradient-primary hover:gradient-primary-hover font-semibold"
              >
                Start Matching
              </Button>
            </div>
          </Card>
        )}

        {/* Step 2.5: Parsing PDF */}
        {currentStep === "parsing" && (
          <Card className="p-12 text-center">
            <div className="flex flex-col items-center gap-6">
              <div className="relative w-24 h-24">
                {/* Animated spinner background */}
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-accent/20 rounded-full animate-spin" 
                     style={{ animationDuration: '3s' }} />
                
                {/* Icon */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-20 h-20 bg-background rounded-full flex items-center justify-center">
                    <FileText className="w-10 h-10 text-primary animate-pulse" />
                  </div>
                </div>
              </div>
              
              <div>
                <h2 className="text-2xl font-bold mb-2">Reading your resume</h2>
                <p className="text-muted-foreground">Extracting text from your PDF file...</p>
              </div>
              
              <div className="w-full max-w-md">
                <Progress value={parsingProgress} className="h-2" />
                <p className="text-sm text-muted-foreground mt-2">
                  {parsingProgress < 40 && "Loading PDF file..."}
                  {parsingProgress >= 40 && parsingProgress < 60 && "Opening document..."}
                  {parsingProgress >= 60 && parsingProgress < 100 && "Extracting text..."}
                  {parsingProgress === 100 && "Complete!"}
                  {" "}({Math.round(parsingProgress)}%)
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Step 3: Processing */}
        {currentStep === "processing" && (
          <Card className="p-12 text-center">
            <div className="flex flex-col items-center gap-6">
              <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center">
                <FileText className="w-12 h-12 text-primary animate-pulse" />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-2">Matching your profile with relevant job posts</h2>
                <p className="text-muted-foreground">This will only take a moment...</p>
              </div>
              <div className="w-full max-w-md">
                <Progress value={processingProgress} className="h-2" />
                <p className="text-sm text-muted-foreground mt-2">{processingProgress}% complete</p>
              </div>
            </div>
          </Card>
        )}

        {/* Step 4: Analysis Results */}
        {currentStep === "analysis" && analysisResult && (
          <Card className="p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2">Your Resume Match Score</h2>
              <p className="text-muted-foreground">
                Based on your resume and selected job function
              </p>
            </div>

            <div className={`${analysisResult.matchScore >= 6 ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'} border rounded-lg p-6 mb-6`}>
              <div className="flex items-center gap-4">
                <div className="relative w-24 h-24">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="48"
                      cy="48"
                      r="40"
                      stroke={analysisResult.matchScore >= 6 ? "#dcfce7" : "#fee2e2"}
                      strokeWidth="8"
                      fill="none"
                    />
                    <circle
                      cx="48"
                      cy="48"
                      r="40"
                      stroke={analysisResult.matchScore >= 6 ? "#22c55e" : "#ef4444"}
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray={`${(analysisResult.matchScore / 10) * 251.2} 251.2`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold">{analysisResult.matchScore.toFixed(1)}</span>
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg mb-1">
                    {analysisResult.matchScore >= 6 ? 'Good Match!' : 'Your Resume is a Low Match'}
                  </h3>
                  <p className="text-sm text-gray-700">
                    {analysisResult.matchScore >= 6 
                      ? 'Your resume aligns well with the job requirements. A few improvements can make it even stronger.'
                      : 'Resumes under 6.0 are likely to be filtered out — we\'ll help you fix it fast.'}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    analysisResult.jobTitleMatch === "Good Match" ? "bg-green-100" : 
                    analysisResult.jobTitleMatch === "Needs Improvement" ? "bg-yellow-100" : "bg-red-100"
                  }`}>
                    <span className={`font-bold ${
                      analysisResult.jobTitleMatch === "Good Match" ? "text-green-600" : 
                      analysisResult.jobTitleMatch === "Needs Improvement" ? "text-yellow-600" : "text-red-600"
                    }`}>
                      {analysisResult.jobTitleMatch === "Good Match" ? "✓" : "!"}
                    </span>
                  </div>
                  <span className="font-medium">Job Title Match</span>
                </div>
                <span className={`font-semibold ${
                  analysisResult.jobTitleMatch === "Good Match" ? "text-green-600" : 
                  analysisResult.jobTitleMatch === "Needs Improvement" ? "text-yellow-600" : "text-red-600"
                }`}>
                  {analysisResult.jobTitleMatch}
                </span>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    (analysisResult.keywordCount / analysisResult.totalExpectedKeywords) >= 0.6 
                      ? "bg-green-100" : "bg-yellow-100"
                  }`}>
                    <span className={`font-bold ${
                      (analysisResult.keywordCount / analysisResult.totalExpectedKeywords) >= 0.6 
                        ? "text-green-600" : "text-yellow-600"
                    }`}>!</span>
                  </div>
                  <span className="font-medium">
                    Job Keywords ({analysisResult.keywordCount}/{analysisResult.totalExpectedKeywords})
                  </span>
                </div>
                <span className={`font-semibold ${
                  (analysisResult.keywordCount / analysisResult.totalExpectedKeywords) >= 0.6 
                    ? "text-green-600" : "text-yellow-600"
                }`}>
                  {Math.round((analysisResult.keywordCount / analysisResult.totalExpectedKeywords) * 100)}% Match
                </span>
              </div>
            </div>

            {analysisResult.missingKeywords.length > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <h4 className="font-semibold mb-2">Missing Keywords</h4>
                <div className="flex flex-wrap gap-2">
                  {analysisResult.missingKeywords.map((keyword, idx) => (
                    <Badge key={idx} variant="secondary" className="bg-white">
                      {keyword}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <Button
              onClick={handleNext}
              className="w-full gradient-primary hover:gradient-primary-hover h-12 text-lg font-semibold"
            >
              Improve My Resume for This Job
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Card>
        )}

        {/* Step 5: Enhancement Options */}
        {currentStep === "enhance" && analysisResult && (
          <Card className="p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2">Customize Your Resume</h2>
              <p className="text-muted-foreground">
                Choose sections to enhance and add missing keywords
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="font-semibold mb-3">1. Choose sections to enhance</h3>
                <div className="space-y-2">
                  {analysisResult.sectionsToEnhance.map((section) => (
                    <div 
                      key={section} 
                      className="flex items-center space-x-2 p-3 border rounded-lg cursor-pointer hover:bg-secondary/50"
                      onClick={() => toggleSection(section)}
                    >
                      <Checkbox 
                        checked={selectedSections.includes(section)}
                        onCheckedChange={() => toggleSection(section)}
                      />
                      <Label className="cursor-pointer font-normal">{section}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3">
                  2. Add missing skill keywords ({selectedKeywords.length}/{analysisResult.missingKeywords.length})
                </h3>
                <div className="space-y-2">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={selectAllKeywords}
                  >
                    Select all
                  </Button>
                  <div className="grid grid-cols-2 gap-2">
                    {analysisResult.missingKeywords.slice(0, 6).map((skill) => (
                      <div 
                        key={skill} 
                        className="flex items-center space-x-2 p-2 border rounded cursor-pointer hover:bg-secondary/50"
                        onClick={() => toggleKeyword(skill)}
                      >
                        <Checkbox 
                          checked={selectedKeywords.includes(skill)}
                          onCheckedChange={() => toggleKeyword(skill)}
                        />
                        <Label className="cursor-pointer text-sm font-normal">{skill}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Type className="w-4 h-4" />
                3. Select Font Style
              </h3>
              <Select value={selectedFont} onValueChange={setSelectedFont}>
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder="Select font" />
                </SelectTrigger>
                <SelectContent className="bg-white z-50">
                  <SelectItem value="charter">Charter (Serif)</SelectItem>
                  <SelectItem value="times">Times New Roman</SelectItem>
                  <SelectItem value="merriweather">Merriweather (Serif)</SelectItem>
                  <SelectItem value="playfair">Playfair Display (Serif)</SelectItem>
                  <SelectItem value="lora">Lora (Serif)</SelectItem>
                  <SelectItem value="sans">Inter (Sans-serif)</SelectItem>
                  <SelectItem value="roboto">Roboto (Sans-serif)</SelectItem>
                  <SelectItem value="open-sans">Open Sans (Sans-serif)</SelectItem>
                  <SelectItem value="montserrat">Montserrat (Modern)</SelectItem>
                  <SelectItem value="raleway">Raleway (Modern)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button 
              onClick={handleGenerateResume}
              disabled={selectedSections.length === 0}
              className="w-full gradient-primary hover:gradient-primary-hover h-12 text-lg font-semibold"
            >
              Generate My New Resume
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Card>
        )}

        {/* Step 6: Generated Resume with Template Selection */}
        {currentStep === "generated" && generatedResume && (
          <div className="space-y-6">
            {/* Template Selection */}
            <Card className="p-6">
              <div className="mb-4">
                <h2 className="text-2xl font-bold mb-2">Choose Your Resume Template</h2>
                <p className="text-muted-foreground">
                  Select an ATS-optimized template for your enhanced resume
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {resumeTemplates.map((template) => (
                  <div
                    key={template.id}
                    onClick={() => setSelectedTemplate(template.id)}
                    className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                      selectedTemplate === template.id
                        ? 'border-primary bg-primary/5'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="aspect-[3/4] bg-white rounded overflow-hidden mb-3 border">
                      <img src={template.preview} alt={template.name} className="w-full h-full object-cover" />
                    </div>
                    <h3 className="font-semibold text-center mb-1">{template.name}</h3>
                    <p className="text-xs text-muted-foreground text-center">{template.description}</p>
                    {template.isATS && (
                      <Badge className="w-full mt-2 justify-center gradient-primary text-white">
                        ATS Optimized
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </Card>

            {/* Resume Preview with Selected Template */}
            <Card className="p-8">
              <div className="mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">Your Optimized Resume</h2>
                    <p className="text-muted-foreground">
                      AI-enhanced and optimized for {jobRoles.find(r => r.value === jobRole)?.label || "your target role"}
                    </p>
                  </div>
                  <CheckCircle2 className="w-12 h-12 text-green-500" />
                </div>
              </div>

              {/* Parse resume text and render with template */}
              <div className="bg-gray-50 border-2 border-gray-300 rounded-lg overflow-hidden mb-6 shadow-lg">
                <div id="resume-preview-container" className="max-h-[800px] overflow-y-auto">
                  {selectedTemplate === 'modern-centered' ? (
                    <ModernCenteredTemplate 
                      data={parseGeneratedResume(generatedResume)}
                      fontFamily={selectedFont}
                    />
                  ) : selectedTemplate === 'jake' ? (
                    <JakeTemplate 
                      data={parseGeneratedResume(generatedResume)}
                      fontFamily={selectedFont}
                    />
                  ) : (
                    <RenderCVTemplate 
                      data={parseGeneratedResume(generatedResume)}
                      fontFamily={selectedFont}
                    />
                  )}
                </div>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-blue-900">
                  <strong>Note:</strong> Your resume has been optimized with the selected ATS-friendly template. 
                  The content has been enhanced to match job requirements while maintaining professional formatting.
                </p>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep("enhance")}
                  className="flex-1"
                  disabled={isDownloading}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Go Back
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    const text = typeof generatedResume === 'string'
                      ? generatedResume
                      : JSON.stringify(generatedResume, null, 2);
                    navigator.clipboard.writeText(text || "");
                    toast({
                      title: "Copied!",
                      description: "Resume content copied to clipboard",
                    });
                  }}
                  className="flex-1"
                  disabled={isDownloading}
                >
                  Copy Content
                </Button>
                <Button
                  onClick={handleDownloadResume}
                  className="flex-1 gradient-primary hover:gradient-primary-hover"
                  disabled={isDownloading}
                >
                  {isDownloading ? (
                    <>
                      <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Generating PDF...
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4 mr-2" />
                      Download PDF
                    </>
                  )}
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};
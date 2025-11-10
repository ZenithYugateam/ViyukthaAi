import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Upload, Check, Code2, Coffee, Sparkles, Settings, ArrowRight, Clock, Award, Briefcase, History } from "lucide-react";
import interviewIllustration from "@/assets/interview-illustration.jpg";
import { InterviewHistory } from "@/components/interview/InterviewHistory";

const Interviews = () => {
  const ITEMS_PER_PAGE = 4;
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");
  const [numQuestions, setNumQuestions] = useState("5");
  const [interviewLevel, setInterviewLevel] = useState("intermediate");
  const [interviewCategory, setInterviewCategory] = useState("general");
  const [hasResume, setHasResume] = useState(false);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setResumeFile(e.target.files[0]);
  };

  const handleQuickStart = (category: string, difficulty: string) => {
    const params = new URLSearchParams({
      category: category,
      level: difficulty,
      questions: "5"
    });
    window.location.href = `/permissions-test?${params.toString()}`;
  };

  const handleStartInterview = () => {
    console.log("Starting interview with:", {
      numQuestions,
      interviewLevel,
      interviewCategory,
      hasResume,
      resumeFile,
      jobDescription,
    });
    // Pass the selected category and settings to the permissions test page
    const params = new URLSearchParams({
      category: interviewCategory,
      level: interviewLevel,
      questions: numQuestions
    });
    window.location.href = `/permissions-test?${params.toString()}`;
  };

  const resolvePublicUrl = (path: string) => {
    const base = import.meta.env.BASE_URL || "/";
    const clean = path.startsWith("/") ? path.slice(1) : path;
    return `${base}${clean}`;
  };

  const allInterviewOptions = [
    {
      icon: Code2,
      iconBg: "bg-blue-600",
      title: "Python Developer",
      company: "Technical Interview",
      description: "Mock practice for Python interview questions",
      duration: "30-45 min",
      difficulty: "Intermediate",
      topics: ["Data Structures", "OOP", "Algorithms", "+2 more"],
      category: "python",
      matchRate: "92%"
    },
    {
      icon: Coffee,
      iconBg: "bg-orange-600",
      title: "Java Developer",
      company: "Technical Interview",
      description: "Comprehensive Java interview preparation",
      duration: "30-45 min",
      difficulty: "Intermediate",
      topics: ["Collections", "Multithreading", "Spring", "+1 more"],
      category: "java",
      matchRate: "88%"
    },
    {
      icon: Sparkles,
      iconBg: "bg-cyan-600",
      title: "React Developer",
      company: "Frontend Interview",
      description: "React interview practice and components",
      duration: "25-40 min",
      difficulty: "Intermediate",
      topics: ["Hooks", "State Management", "Performance", "+2 more"],
      category: "react",
      matchRate: "95%"
    },
    {
      icon: Settings,
      iconBg: "bg-purple-600",
      title: "Custom Interview",
      company: "Personalized Setup",
      description: "Create your own custom interview setup",
      duration: "Flexible",
      difficulty: "All Levels",
      topics: ["Choose Category", "Set Difficulty", "Custom Questions"],
      isCustom: true,
      matchRate: "100%"
    },
    {
      icon: Briefcase,
      iconBg: "bg-red-600",
      title: "Google Interview",
      company: "Google",
      companyLogo: "/images/companies/google.png",
      description: "Practice Google-style algorithm interviews",
      duration: "45-60 min",
      difficulty: "Advanced",
      topics: ["Algorithms", "System Design", "Problem Solving", "+1 more"],
      category: "google",
      matchRate: "85%"
    },
    {
      icon: Briefcase,
      iconBg: "bg-orange-500",
      title: "Amazon Interview",
      company: "Amazon",
      companyLogo: "/images/companies/amazon.png",
      description: "Amazon leadership principles interview prep",
      duration: "40-50 min",
      difficulty: "Advanced",
      topics: ["Behavioral", "Coding", "Leadership", "+2 more"],
      category: "amazon",
      matchRate: "87%"
    },
    {
      icon: Briefcase,
      iconBg: "bg-blue-500",
      title: "Meta Interview",
      company: "Meta (Facebook)",
      companyLogo: "/images/companies/meta.png",
      description: "Meta technical and product sense interviews",
      duration: "45-55 min",
      difficulty: "Advanced",
      topics: ["Product Design", "Coding", "System Design"],
      category: "meta",
      matchRate: "90%"
    },
    {
      icon: Briefcase,
      iconBg: "bg-blue-700",
      title: "Microsoft Interview",
      company: "Microsoft",
      companyLogo: "/images/companies/microsoft.png",
      description: "Microsoft technical and behavioral interviews",
      duration: "40-50 min",
      difficulty: "Advanced",
      topics: ["Azure", "C#", "System Design", "+1 more"],
      category: "microsoft",
      matchRate: "88%"
    },
    {
      icon: Briefcase,
      iconBg: "bg-gray-800",
      title: "Apple Interview",
      company: "Apple",
      companyLogo: "/images/companies/apple.png",
      description: "Apple hardware and software interview prep",
      duration: "45-55 min",
      difficulty: "Advanced",
      topics: ["iOS", "Swift", "Hardware", "+2 more"],
      category: "apple",
      matchRate: "86%"
    },
    {
      icon: Briefcase,
      iconBg: "bg-red-700",
      title: "Netflix Interview",
      company: "Netflix",
      companyLogo: "/images/companies/netflix.png",
      description: "Netflix culture and technical interviews",
      duration: "40-50 min",
      difficulty: "Advanced",
      topics: ["Microservices", "Streaming", "Culture Fit"],
      category: "netflix",
      matchRate: "89%"
    },
    {
      icon: Briefcase,
      iconBg: "bg-red-500",
      title: "Tesla Interview",
      company: "Tesla",
      companyLogo: "/images/companies/tesla.png",
      description: "Tesla engineering and innovation interviews",
      duration: "45-60 min",
      difficulty: "Advanced",
      topics: ["Embedded Systems", "Automotive", "Innovation"],
      category: "tesla",
      matchRate: "84%"
    },
    {
      icon: Briefcase,
      iconBg: "bg-green-600",
      title: "Nvidia Interview",
      company: "Nvidia",
      companyLogo: "/images/companies/nvidia.png",
      description: "Nvidia GPU and AI focused interviews",
      duration: "45-55 min",
      difficulty: "Advanced",
      topics: ["CUDA", "Deep Learning", "Graphics", "+1 more"],
      category: "nvidia",
      matchRate: "87%"
    },
  ];

  const renderInterviewCard = (option: typeof allInterviewOptions[0], difficulty: string) => (
    <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all border border-gray-100">
      <div className="flex items-start justify-between gap-6">
        {/* Left Section */}
        <div className="flex gap-4 flex-1">
          {/* Company Logo or Icon */}
          {option.companyLogo ? (
            <div className="w-16 h-16 rounded-xl bg-muted border border-border flex items-center justify-center flex-shrink-0 p-2">
              <img 
                src={resolvePublicUrl(option.companyLogo)} 
                alt={`${option.company} logo`}
                loading="lazy"
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = resolvePublicUrl("/placeholder.svg");
                }}
              />
            </div>
          ) : (
            <div className={`w-16 h-16 rounded-xl ${option.iconBg} flex items-center justify-center flex-shrink-0`}>
              <option.icon className="w-8 h-8 text-white" />
            </div>
          )}

          {/* Content */}
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 mb-1">{option.title}</h3>
            <p className="text-gray-600 text-sm mb-3">{option.company}</p>
            
            {/* Meta Info */}
            <div className="flex items-center gap-4 mb-3 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{option.duration}</span>
              </div>
            </div>

            {/* Topics */}
            <div className="flex flex-wrap gap-2">
              {option.topics.map((topic, idx) => (
                <Badge key={idx} variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-100">
                  {topic}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center justify-end flex-shrink-0">
          {/* Action Button */}
          <Button
            onClick={() => option.isCustom ? setShowCustomForm(true) : handleQuickStart(option.category!, difficulty)}
            className="gradient-primary hover:gradient-primary-hover text-white font-semibold rounded-xl h-11 px-6 shadow-sm"
          >
            {option.isCustom ? "Customize" : "Start Now"}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );

  // Filter interviews based on selected difficulty
  const filteredInterviews = (() => {
    if (selectedDifficulty === "all") {
      return allInterviewOptions.filter(option => !option.isCustom);
    }
    
    if (selectedDifficulty === "beginner") {
      // Show only Python, Java, React
      return allInterviewOptions.filter(option => 
        !option.isCustom && ["python", "java", "react"].includes(option.category || "")
      );
    }
    
    if (selectedDifficulty === "intermediate") {
      // Show some company interviews: Amazon, Microsoft, Meta, Netflix
      return allInterviewOptions.filter(option => 
        !option.isCustom && ["amazon", "microsoft", "meta", "netflix"].includes(option.category || "")
      );
    }
    
    if (selectedDifficulty === "advanced") {
      // Show advanced company interviews: Google, Apple, Tesla, Nvidia
      return allInterviewOptions.filter(option => 
        !option.isCustom && ["google", "apple", "tesla", "nvidia"].includes(option.category || "")
      );
    }
    
    return allInterviewOptions.filter(option => !option.isCustom);
  })();

  const totalPages = Math.ceil(filteredInterviews.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentInterviews = filteredInterviews.slice(startIndex, endIndex);

  return (
    <div className="min-h-screen bg-[#F5F7FA] p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {!showCustomForm ? (
          <>
            {/* Header with Navbar */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-4xl font-bold text-gray-900">AI Interview Practice</h1>
                <Button
                  onClick={() => setShowCustomForm(true)}
                  className="gradient-primary hover:gradient-primary-hover text-white font-semibold rounded-xl h-12 px-8 shadow-sm flex items-center gap-2"
                >
                  <Settings className="w-5 h-5" />
                  Create Custom Interview
                </Button>
              </div>

              {/* Tabs for Practice vs History */}
              <Tabs defaultValue="practice" className="w-full">
                <TabsList className="w-full mb-6 bg-white rounded-xl p-2 shadow-sm border border-gray-200">
                  <TabsTrigger value="practice" className="flex-1 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-primary/80 data-[state=active]:text-white">
                    Interview Practice
                  </TabsTrigger>
                  <TabsTrigger value="history" className="flex-1 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-primary/80 data-[state=active]:text-white">
                    <History className="w-4 h-4 mr-2" />
                    Interview History
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="practice">
                  {/* Difficulty Level Navbar */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-2 mb-8">
                    <div className="flex gap-2">
                      <Button
                        onClick={() => {
                          setSelectedDifficulty("all");
                          setCurrentPage(1);
                        }}
                        variant={selectedDifficulty === "all" ? "default" : "ghost"}
                        className={`flex-1 rounded-lg h-11 font-semibold ${
                          selectedDifficulty === "all"
                            ? "gradient-primary text-white"
                            : "hover:bg-gray-100"
                        }`}
                      >
                        All Interviews
                      </Button>
                      <Button
                        onClick={() => {
                          setSelectedDifficulty("beginner");
                          setCurrentPage(1);
                        }}
                        variant={selectedDifficulty === "beginner" ? "default" : "ghost"}
                        className={`flex-1 rounded-lg h-11 font-semibold ${
                          selectedDifficulty === "beginner"
                            ? "bg-green-600 text-white hover:bg-green-700"
                            : "hover:bg-gray-100"
                        }`}
                      >
                        <Award className="w-4 h-4 mr-2" />
                        Beginner
                      </Button>
                      <Button
                        onClick={() => {
                          setSelectedDifficulty("intermediate");
                          setCurrentPage(1);
                        }}
                        variant={selectedDifficulty === "intermediate" ? "default" : "ghost"}
                        className={`flex-1 rounded-lg h-11 font-semibold ${
                          selectedDifficulty === "intermediate"
                            ? "bg-blue-600 text-white hover:bg-blue-700"
                            : "hover:bg-gray-100"
                        }`}
                      >
                        <Award className="w-4 h-4 mr-2" />
                        Intermediate
                      </Button>
                      <Button
                        onClick={() => {
                          setSelectedDifficulty("advanced");
                          setCurrentPage(1);
                        }}
                        variant={selectedDifficulty === "advanced" ? "default" : "ghost"}
                        className={`flex-1 rounded-lg h-11 font-semibold ${
                          selectedDifficulty === "advanced"
                            ? "bg-purple-600 text-white hover:bg-purple-700"
                            : "hover:bg-gray-100"
                        }`}
                      >
                        <Award className="w-4 h-4 mr-2" />
                        Advanced
                      </Button>
                    </div>
                  </div>

                  {/* Interview Cards Grid */}
                  <div className="space-y-4 mb-8">
                    {currentInterviews.map((option, index) => (
                      <div key={`${selectedDifficulty}-${index}`}>
                        {renderInterviewCard(option, selectedDifficulty === "all" ? "intermediate" : selectedDifficulty)}
                      </div>
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex justify-center gap-2">
                      <Button
                        variant="outline"
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                      >
                        Previous
                      </Button>
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                        <Button
                          key={page}
                          variant={currentPage === page ? "default" : "outline"}
                          onClick={() => setCurrentPage(page)}
                          className={currentPage === page ? "gradient-primary" : ""}
                        >
                          {page}
                        </Button>
                      ))}
                      <Button
                        variant="outline"
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                      >
                        Next
                      </Button>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="history">
                  <InterviewHistory />
                </TabsContent>
              </Tabs>
            </div>
          </>
        ) : (
          <>
            {/* ---------- GRID ---------- */}
            <div className="grid lg:grid-cols-2 gap-8">
          {/* ────────────────────── LEFT – FIXED ────────────────────── */}
          <div
            className="flex flex-col space-y-6 
                          lg:sticky lg:top-0 lg:self-start 
                          lg:h-screen lg:overflow-hidden"
          >
            {/* Image Card */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <img src={interviewIllustration} alt="AI Interview Illustration" className="w-full h-auto object-cover" />
            </div>

            {/* What to Expect Card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm flex-1 overflow-hidden">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">What to expect:</h2>

              <div className="space-y-4">
                {[
                  "Real-time AI feedback on your responses",
                  "Detailed performance analysis",
                  "Personalized improvement suggestions",
                ].map((text, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-[#2ECC71] flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                    <p className="text-gray-900 text-base font-normal">{text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ────────────────────── RIGHT – SCROLLABLE ────────────────────── */}
          <div
            className="bg-white rounded-2xl p-8 shadow-sm 
                          lg:h-screen lg:overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Custom AI Interview</h1>
              <Button
                variant="ghost"
                onClick={() => setShowCustomForm(false)}
                className="text-gray-600 hover:text-gray-900"
              >
                ← Back
              </Button>
            </div>

            <div className="space-y-7 pb-8">
              {/* Number of Questions */}
              <div className="space-y-3">
                <Label className="text-gray-900 font-semibold text-base">Number of Questions</Label>
                <RadioGroup value={numQuestions} onValueChange={setNumQuestions}>
                  <div className="flex items-center gap-8">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="5" id="q5" />
                      <Label htmlFor="q5" className="text-gray-700 cursor-pointer font-normal">
                        5 Questions
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="10" id="q10" />
                      <Label htmlFor="q10" className="text-gray-700 cursor-pointer font-normal">
                        10 Questions
                      </Label>
                    </div>
                  </div>
                </RadioGroup>
              </div>

              {/* Interview Level */}
              <div className="space-y-3">
                <Label className="text-gray-900 font-semibold text-base">Interview Level</Label>
                <RadioGroup value={interviewLevel} onValueChange={setInterviewLevel}>
                  <div className="flex items-center gap-6 flex-wrap">
                    {["beginner", "intermediate", "advanced"].map((level) => (
                      <div key={level} className="flex items-center space-x-2">
                        <RadioGroupItem value={level} id={level} />
                        <Label htmlFor={level} className="text-gray-700 cursor-pointer font-normal capitalize">
                          {level}
                        </Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </div>

              {/* Interview Category */}
              <div className="space-y-3">
                <Label className="text-gray-900 font-semibold text-base">Interview Category</Label>
                <RadioGroup value={interviewCategory} onValueChange={setInterviewCategory}>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { value: "general", label: "General" },
                      { value: "python", label: "Python" },
                      { value: "java", label: "Java" },
                      { value: "react", label: "React" },
                      { value: "javascript", label: "JavaScript" },
                      { value: "sql", label: "SQL" },
                      { value: "fullstack", label: "Full Stack" },
                    ].map((category) => (
                      <div key={category.value} className="flex items-center space-x-2">
                        <RadioGroupItem value={category.value} id={category.value} />
                        <Label htmlFor={category.value} className="text-gray-700 cursor-pointer font-normal">
                          {category.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </div>

              {/* Resume Upload */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="resume"
                  checked={hasResume}
                  onCheckedChange={(checked) => setHasResume(checked as boolean)}
                />
                <Label htmlFor="resume" className="text-gray-900 font-normal text-base cursor-pointer">
                  I have a resume to upload
                </Label>
              </div>

              {hasResume && (
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 bg-gray-50 hover:bg-gray-100 transition-colors">
                  <Label htmlFor="file-upload" className="flex flex-col items-center gap-3 cursor-pointer">
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                      <Upload className="w-6 h-6 text-blue-600" />
                    </div>
                    {resumeFile ? (
                      <div className="text-center">
                        <p className="text-gray-900 font-medium">{resumeFile.name}</p>
                        <p className="text-xs text-gray-500 mt-1">Click to change file</p>
                      </div>
                    ) : (
                      <div className="text-center">
                        <p className="text-gray-900 font-medium">Upload PDF</p>
                        <p className="text-xs text-gray-500 mt-1">Click to browse or drag and drop</p>
                      </div>
                    )}
                    <Input id="file-upload" type="file" accept=".pdf" className="hidden" onChange={handleFileChange} />
                  </Label>
                </div>
              )}

              {/* Job Description */}
              <div className="space-y-3">
                <Label htmlFor="job-description" className="text-gray-900 font-semibold text-base">
                  Job Description <span className="text-gray-500 font-normal">(optional)</span>
                </Label>
                <Textarea
                  id="job-description"
                  placeholder="Paste the job description here to get tailored interview questions..."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  className="min-h-[120px] rounded-xl border-gray-300 focus:border-blue-500 focus:ring-blue-500 resize-none"
                />
              </div>

              {/* Start Interview Button */}
              <Button
                onClick={handleStartInterview}
                className="w-full h-14 gradient-primary hover:gradient-primary-hover text-white font-semibold rounded-xl transition-all shadow-sm hover:shadow-md text-lg"
              >
                Start Interview
              </Button>
            </div>
          </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Interviews;

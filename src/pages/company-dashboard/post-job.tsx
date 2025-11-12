import React from "react";

import Sidebar from "@/components/company-dashboard/Sidebar";
import TopNav from "@/components/company-dashboard/TopNav";
import Stepper, { Step } from "@/components/company-dashboard/Stepper";
import { PageTransition } from "@/components/company-dashboard/PageTransition";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { generateJD } from "@/lib/ai/generateJD";
import { generateQuestions } from "@/lib/ai/generateQuestions";
import { generateSkills } from "@/lib/ai/generateSkills";
import { generateCompanySummary } from "@/lib/ai/generateCompanySummary";
import { mockData } from "@/data/mock-company-dashboard";
import { tokenSystem } from "@/data/tokenSystem";
import { Coins, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";

type InterviewType = "AI" | "Technical" | "HR" | "Voice/Video";

type JobForm = {
  interviewTypes: InterviewType[];
  details: {
    title: string;
    experience: string;
    workArrangement: string; // Remote, Hybrid, On-site
    country: string;
    state: string;
    city: string;
    salaryCurrency: string;
    salaryMin: string;
    salaryMax: string;
    type: string;
    deadline: string;
    interviewDuration: string; // Interview duration in minutes
  };
  description: {
    text: string;
    skills?: string;
    companySummary?: string;
    fileName?: string;
  };
  questions: Array<{
    id: string;
    text: string;
    weight: number; // percentage
    type: "Text" | "MCQ" | "Code" | "Voice";
    evalMode: "Auto" | "Manual";
    difficulty?: "Easy" | "Medium" | "Hard" | "Mixed";
    expectedAnswer?: string;
    interviewRound?: "General" | "Technical" | "HR";
    options?: string[];
  }>;
};

const STORAGE_KEY = "companyDashboard.postJob.v1";

const steps: Step[] = [
  { key: "type", label: "Interview Type" },
  { key: "details", label: "Job Details" },
  { key: "description", label: "Job Description" },
  { key: "questions", label: "Question Bank" },
  { key: "review", label: "Review & Publish" },
];

const initialState: JobForm = {
  interviewTypes: [],
  details: {
    title: "",
    experience: "",
    workArrangement: "",
    country: "",
    state: "",
    city: "",
    salaryCurrency: "USD",
    salaryMin: "",
    salaryMax: "",
    type: "",
    deadline: "",
    interviewDuration: "",
  },
  description: {
    text: "",
    skills: "",
    companySummary: "",
  },
  questions: [
    { id: `Q-${Date.now()}`, text: "Describe a challenging project you led.", weight: 25, type: "Text", evalMode: "Auto" },
  ],
};

// Countries and cities data
const countries = [
  { value: "india", label: "India" },
  { value: "usa", label: "United States" },
  { value: "uk", label: "United Kingdom" },
  { value: "canada", label: "Canada" },
  { value: "australia", label: "Australia" },
  { value: "germany", label: "Germany" },
  { value: "france", label: "France" },
  { value: "singapore", label: "Singapore" },
  { value: "uae", label: "United Arab Emirates" },
  { value: "japan", label: "Japan" },
  { value: "south-korea", label: "South Korea" },
  { value: "netherlands", label: "Netherlands" },
  { value: "sweden", label: "Sweden" },
  { value: "switzerland", label: "Switzerland" },
  { value: "spain", label: "Spain" },
  { value: "italy", label: "Italy" },
  { value: "brazil", label: "Brazil" },
  { value: "mexico", label: "Mexico" },
  { value: "south-africa", label: "South Africa" },
  { value: "other", label: "Other" },
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
  },
  usa: {
    "california": ["Los Angeles", "San Francisco", "San Diego", "San Jose", "Sacramento"],
    "texas": ["Houston", "Austin", "Dallas", "San Antonio", "Fort Worth"],
    "new-york": ["New York City", "Buffalo", "Rochester", "Albany", "Syracuse"],
    "florida": ["Miami", "Orlando", "Tampa", "Jacksonville", "Fort Lauderdale"],
    "illinois": ["Chicago", "Aurora", "Naperville", "Joliet", "Rockford"],
    "washington": ["Seattle", "Spokane", "Tacoma", "Vancouver", "Bellevue"],
    "massachusetts": ["Boston", "Worcester", "Springfield", "Cambridge", "Lowell"],
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
  germany: {
    "bavaria": ["Munich", "Nuremberg", "Augsburg", "Regensburg", "Würzburg"],
    "berlin": ["Berlin"],
    "north-rhine-westphalia": ["Cologne", "Düsseldorf", "Dortmund", "Essen", "Duisburg"],
  },
  singapore: {
    "singapore": ["Singapore"],
  },
  uae: {
    "dubai": ["Dubai"],
    "abu-dhabi": ["Abu Dhabi"],
  },
};

const variants = {
  enter: (direction: number) => ({ x: direction > 0 ? 24 : -24, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({ x: direction < 0 ? 24 : -24, opacity: 0 })
};

const PostJobPage: React.FC = () => {
  const navigate = useNavigate();
  const [current, setCurrent] = React.useState(0);
  const [direction, setDirection] = React.useState(0);
  const [form, setForm] = React.useState<JobForm>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as JobForm;
        // Ensure interviewTypes is always an array
        if (!parsed.interviewTypes || !Array.isArray(parsed.interviewTypes)) {
          parsed.interviewTypes = [];
        }
        return parsed;
      }
      return initialState;
    } catch {
      return initialState;
    }
  });
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [generating, setGenerating] = React.useState(false);
  const [generatingSkills, setGeneratingSkills] = React.useState(false);
  const [generatingCompanySummary, setGeneratingCompanySummary] = React.useState(false);
  const [aiQGenerating, setAiQGenerating] = React.useState(false);
  const [aiQCount, setAiQCount] = React.useState(5);
  const [aiQCategories, setAiQCategories] = React.useState("");
  const [interviewMode, setInterviewMode] = React.useState<"Technical" | "HR" | "General">("General");
  const [questionDifficulty, setQuestionDifficulty] = React.useState<"Easy" | "Medium" | "Hard" | "Mixed">("Mixed");
  const [selectedRoundFilter, setSelectedRoundFilter] = React.useState<"All" | "General" | "Technical" | "HR">("All");
  const [published, setPublished] = React.useState(false);
  const [tokenBalance, setTokenBalance] = React.useState(() => tokenSystem.getBalance());
  
  const tokenCost = React.useMemo(() => {
    return tokenSystem.calculateCost(form.interviewTypes);
  }, [form.interviewTypes]);

  React.useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(form));
  }, [form, current]);

  const go = (idx: number) => {
    setDirection(idx > current ? 1 : -1);
    setCurrent(idx);
  };

  const next = () => {
    if (validateStep(current)) {
      setDirection(1);
      setCurrent((c) => Math.min(c + 1, steps.length - 1));
    }
  };
  const prev = () => {
    setDirection(-1);
    setCurrent((c) => Math.max(c - 1, 0));
  };

  const setField = <K extends keyof JobForm>(key: K, value: JobForm[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
  };
  
  const toggleInterviewType = (type: InterviewType) => {
    setForm((f) => ({
      ...f,
      interviewTypes: f.interviewTypes?.includes(type)
        ? f.interviewTypes.filter(t => t !== type)
        : [...(f.interviewTypes || []), type]
    }));
  };

  const updateDetails = (patch: Partial<JobForm["details"]>) => {
    setForm((f) => {
      const updated = { ...f.details, ...patch };
      // Reset state and city when country changes
      if (patch.country && patch.country !== f.details.country) {
        updated.state = "";
        updated.city = "";
      }
      // Reset city when state changes
      if (patch.state && patch.state !== f.details.state) {
        updated.city = "";
      }
      return { ...f, details: updated };
    });
  };
  const updateDescription = (patch: Partial<JobForm["description"]>) =>
    setForm((f) => ({ ...f, description: { ...f.description, ...patch } }));

  const addQuestion = () =>
    setForm((f) => ({
      ...f,
      questions: [
        ...f.questions,
        { 
          id: `Q-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`, 
          text: "", 
          weight: 10, 
          type: "Text", 
          evalMode: "Auto",
          difficulty: "Medium",
          interviewRound: interviewMode,
        },
      ],
    }));
  const updateQuestion = (id: string, patch: Partial<JobForm["questions"][number]>) =>
    setForm((f) => ({
      ...f,
      questions: f.questions.map((q) => (q.id === id ? { ...q, ...patch } : q)),
    }));
  const removeQuestion = (id: string) =>
    setForm((f) => ({ ...f, questions: f.questions.filter((q) => q.id !== id) }));

  const validateStep = (idx: number) => {
    const e: Record<string, string> = {};
    if (current === 0 && (!form.interviewTypes || form.interviewTypes.length === 0)) e.interviewType = "Please select at least one interview type";
    if (idx === 1) {
      if (!form.details.title) e.title = "Title is required";
      if (!form.details.workArrangement) e.workArrangement = "Work arrangement is required";
      if (!form.details.type) e.type = "Job type is required";
      if (!form.details.deadline) e.deadline = "Deadline is required";
      if (!form.details.interviewDuration) e.interviewDuration = "Interview duration is required";
    } else if (idx === 2) {
      if (!form.description.text) e.description = "Provide a description or upload a file";
    } else if (idx === 3) {
      if (!form.questions.length || form.questions.some((q) => !q.text)) {
        e.questions = "Add at least one question with text";
      }
      // We only warn for weight total; do not block navigation
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const totalWeight = React.useMemo(
    () => form.questions.reduce((sum, q) => sum + (Number(q.weight) || 0), 0),
    [form.questions],
  );

  return (
    <PageTransition>
      <div className="flex min-h-screen bg-background">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <TopNav />
          <main className="p-4 md:p-6 space-y-4">
            <Stepper steps={steps} current={current} onStepChange={go} />

            <div className="rounded-xl border bg-card p-4">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={current}
                  custom={direction}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.25 }}
                >
                  {current === 0 && (
                    <div className="space-y-4">
                      <div className="pb-4 border-b">
                        <h3 className="text-lg font-semibold text-foreground mb-1">Interview Type</h3>
                        <p className="text-sm text-muted-foreground">
                          Select one or more interview types for this position
                        </p>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {["AI", "Technical", "HR", "Voice/Video"].map((t) => (
                          <div
                            key={t}
                            onClick={() => toggleInterviewType(t as InterviewType)}
                            className={`rounded-lg border p-4 cursor-pointer transition-all hover:shadow-md ${
                              form.interviewTypes?.includes(t as InterviewType)
                                ? "border-blue-500 bg-blue-50 ring-2 ring-blue-200"
                                : "border-muted hover:border-blue-300"
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <Checkbox
                                checked={form.interviewTypes?.includes(t as InterviewType) || false}
                                onCheckedChange={() => toggleInterviewType(t as InterviewType)}
                                className="mt-1"
                              />
                              <div className="flex-1">
                                <Label className="text-base font-semibold cursor-pointer">{t}</Label>
                                <p className="text-sm text-muted-foreground mt-1">
                                  {t === "AI" && "Automated AI-powered interview"}
                                  {t === "Technical" && "Technical skills assessment"}
                                  {t === "HR" && "HR screening and behavioral questions"}
                                  {t === "Voice/Video" && "Live voice or video interview"}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      {errors.interviewType && (
                        <p className="text-sm text-red-600">{errors.interviewType}</p>
                      )}
                      {form.interviewTypes && form.interviewTypes.length > 0 && (
                        <div className="mt-4 space-y-3">
                          <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
                            <p className="text-sm font-medium text-blue-900">
                              Selected: {form.interviewTypes.join(", ")}
                            </p>
                          </div>
                          <div className="p-3 rounded-lg bg-amber-50 border border-amber-200">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium text-amber-900">
                                Token Cost: {tokenCost} tokens
                              </span>
                              <Badge variant="secondary">
                                Balance: {tokenBalance.current}
                              </Badge>
                            </div>
                            {tokenCost > tokenBalance.current && (
                              <Alert className="mt-2 bg-red-50 border-red-200">
                                <AlertTriangle className="h-4 w-4 text-red-600" />
                                <AlertDescription className="text-red-900">
                                  Insufficient tokens! You need {tokenCost - tokenBalance.current} more tokens.
                                </AlertDescription>
                              </Alert>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {current === 1 && (
                    <div className="space-y-6">
                      {/* Basic Information */}
                      <div>
                        <h3 className="text-base font-semibold mb-4 text-foreground">Basic Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium">Job Title <span className="text-red-500">*</span></label>
                            <Input 
                              value={form.details.title} 
                              onChange={(e) => updateDetails({ title: e.target.value })} 
                              className="mt-1" 
                              placeholder="e.g., Senior Software Engineer"
                            />
                            {errors.title && <p className="text-sm text-red-600 mt-1">{errors.title}</p>}
                          </div>
                          <div>
                            <label className="text-sm font-medium">Experience Required</label>
                            <Input 
                              value={form.details.experience} 
                              onChange={(e) => updateDetails({ experience: e.target.value })} 
                              className="mt-1" 
                              placeholder="e.g., 3-5 years"
                            />
                            <p className="text-xs text-muted-foreground mt-1">Optional - helps candidates understand requirements</p>
                          </div>
                        </div>
                      </div>

                      {/* Work Arrangement & Location */}
                      <div>
                        <h3 className="text-base font-semibold mb-4 text-foreground">Work Arrangement & Location</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium">Work Arrangement <span className="text-red-500">*</span></label>
                            <Select value={form.details.workArrangement} onValueChange={(v) => updateDetails({ workArrangement: v })}>
                              <SelectTrigger className="mt-1">
                                <SelectValue placeholder="Select work arrangement" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Remote">🌐 Remote</SelectItem>
                                <SelectItem value="Hybrid">🏢 Hybrid</SelectItem>
                                <SelectItem value="On-site">📍 On-site</SelectItem>
                              </SelectContent>
                            </Select>
                            <p className="text-xs text-muted-foreground mt-1">Choose how the work will be performed</p>
                            {errors.workArrangement && <p className="text-sm text-red-600 mt-1">{errors.workArrangement}</p>}
                          </div>
                          {form.details.workArrangement !== "Remote" && (
                            <>
                              <div>
                                <label className="text-sm font-medium">Country</label>
                                <Select value={form.details.country} onValueChange={(v) => updateDetails({ country: v })}>
                                  <SelectTrigger className="mt-1">
                                    <SelectValue placeholder="Select country" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {countries.map((c) => (
                                      <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                              {form.details.country && statesByCountry[form.details.country] && (
                                <div>
                                  <label className="text-sm font-medium">State/Province</label>
                                  <Select value={form.details.state} onValueChange={(v) => updateDetails({ state: v })}>
                                    <SelectTrigger className="mt-1">
                                      <SelectValue placeholder="Select state/province" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {Object.keys(statesByCountry[form.details.country]).map((state) => (
                                        <SelectItem key={state} value={state}>
                                          {state.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                              )}
                              {form.details.state && statesByCountry[form.details.country]?.[form.details.state] && (
                                <div>
                                  <label className="text-sm font-medium">City</label>
                                  <Select value={form.details.city} onValueChange={(v) => updateDetails({ city: v })}>
                                    <SelectTrigger className="mt-1">
                                      <SelectValue placeholder="Select city" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {statesByCountry[form.details.country][form.details.state].map((city) => (
                                        <SelectItem key={city} value={city}>{city}</SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      </div>

                      {/* Compensation */}
                      <div>
                        <h3 className="text-base font-semibold mb-4 text-foreground">Compensation</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="md:col-span-2">
                            <label className="text-sm font-medium">Salary Range</label>
                            <div className="flex gap-2 mt-1">
                              <Select value={form.details.salaryCurrency} onValueChange={(v) => updateDetails({ salaryCurrency: v })}>
                                <SelectTrigger className="w-32">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="USD">USD ($)</SelectItem>
                                  <SelectItem value="EUR">EUR (€)</SelectItem>
                                  <SelectItem value="GBP">GBP (£)</SelectItem>
                                  <SelectItem value="INR">INR (₹)</SelectItem>
                                  <SelectItem value="CAD">CAD (C$)</SelectItem>
                                  <SelectItem value="AUD">AUD (A$)</SelectItem>
                                  <SelectItem value="JPY">JPY (¥)</SelectItem>
                                  <SelectItem value="CNY">CNY (¥)</SelectItem>
                                  <SelectItem value="SGD">SGD (S$)</SelectItem>
                                  <SelectItem value="AED">AED (د.إ)</SelectItem>
                                </SelectContent>
                              </Select>
                              <Input 
                                type="number" 
                                value={form.details.salaryMin} 
                                onChange={(e) => updateDetails({ salaryMin: e.target.value })} 
                                placeholder="Minimum" 
                                className="flex-1"
                              />
                              <Input 
                                type="number" 
                                value={form.details.salaryMax} 
                                onChange={(e) => updateDetails({ salaryMax: e.target.value })} 
                                placeholder="Maximum" 
                                className="flex-1"
                              />
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">Optional - leave blank if salary is negotiable</p>
                          </div>
                        </div>
                      </div>

                      {/* Job Details */}
                      <div>
                        <h3 className="text-base font-semibold mb-4 text-foreground">Job Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium">Employment Type <span className="text-red-500">*</span></label>
                            <Select value={form.details.type} onValueChange={(v) => updateDetails({ type: v })}>
                              <SelectTrigger className="mt-1">
                                <SelectValue placeholder="Select employment type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Full-time">Full-time</SelectItem>
                                <SelectItem value="Part-time">Part-time</SelectItem>
                                <SelectItem value="Contract">Contract</SelectItem>
                                <SelectItem value="Internship">Internship</SelectItem>
                              </SelectContent>
                            </Select>
                            {errors.type && <p className="text-sm text-red-600 mt-1">{errors.type}</p>}
                          </div>
                          <div>
                            <label className="text-sm font-medium">Application Deadline <span className="text-red-500">*</span></label>
                            <Input 
                              type="date" 
                              value={form.details.deadline} 
                              onChange={(e) => updateDetails({ deadline: e.target.value })} 
                              className="mt-1"
                              min={new Date().toISOString().split('T')[0]}
                            />
                            {errors.deadline && <p className="text-sm text-red-600 mt-1">{errors.deadline}</p>}
                          </div>
                          <div>
                            <label className="text-sm font-medium">Interview Duration <span className="text-red-500">*</span></label>
                            <Select 
                              value={form.details.interviewDuration} 
                              onValueChange={(v) => updateDetails({ interviewDuration: v })}
                            >
                              <SelectTrigger className="mt-1">
                                <SelectValue placeholder="Select interview duration" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="15">15 minutes</SelectItem>
                                <SelectItem value="30">30 minutes</SelectItem>
                                <SelectItem value="45">45 minutes</SelectItem>
                                <SelectItem value="60">1 hour</SelectItem>
                                <SelectItem value="90">1.5 hours</SelectItem>
                                <SelectItem value="120">2 hours</SelectItem>
                              </SelectContent>
                            </Select>
                            <p className="text-xs text-muted-foreground mt-1">Expected duration for the interview</p>
                            {errors.interviewDuration && <p className="text-sm text-red-600 mt-1">{errors.interviewDuration}</p>}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {current === 2 && (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-base font-semibold mb-2 text-foreground">Job Description</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Enter a basic job description or let AI generate a comprehensive one for you. You can also add key skills and company information to help AI create a better description.
                        </p>
                        <div>
                          <label className="text-sm font-medium">Job Description <span className="text-red-500">*</span></label>
                          <Textarea
                            value={form.description.text}
                            onChange={(e) => updateDescription({ text: e.target.value })}
                            rows={12}
                            className="mt-1"
                            placeholder="Enter job description or requirements. You can also leave this blank and click 'AI Generate JD' to create one automatically."
                          />
                          {errors.description && (
                            <p className="text-sm text-red-600 mt-1">{errors.description}</p>
                          )}
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-base font-semibold mb-4 text-foreground">Additional Information (Optional)</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <label className="text-sm font-medium">Key Skills</label>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                disabled={generatingSkills || !form.details.title}
                                onClick={async () => {
                                  setGeneratingSkills(true);
                                  toast.info("AI is generating key skills...");
                                  try {
                                    const result = await generateSkills({
                                      jobTitle: form.details.title,
                                      jobDescription: form.description.text,
                                      experience: form.details.experience,
                                    });
                                    setForm((f) => ({ ...f, description: { ...f.description, skills: result } }));
                                    toast.success("Skills generated successfully!");
                                  } catch (error: any) {
                                    toast.error(error.message || "Failed to generate skills");
                                  } finally {
                                    setGeneratingSkills(false);
                                  }
                                }}
                                className="h-7 px-2 text-xs"
                              >
                                {generatingSkills ? (
                                  <motion.div
                                    className="flex items-center gap-1"
                                    animate={{ opacity: [1, 0.5, 1] }}
                                    transition={{ duration: 1, repeat: Infinity }}
                                  >
                                    <div className="w-3 h-3 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                                    <span>Generating...</span>
                                  </motion.div>
                                ) : (
                                  "✨ AI Generate"
                                )}
                              </Button>
                            </div>
                            <Input
                              value={form.description.skills || ""}
                              onChange={(e) => updateDescription({ skills: e.target.value })}
                              className="mt-1"
                              placeholder="e.g., React, Node.js, Python (comma-separated)"
                            />
                            <p className="text-xs text-muted-foreground mt-1">Help AI generate better job description</p>
                          </div>
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <label className="text-sm font-medium">Company Summary</label>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                disabled={generatingCompanySummary || !form.details.title}
                                onClick={async () => {
                                  setGeneratingCompanySummary(true);
                                  toast.info("AI is generating company summary...");
                                  try {
                                    const result = await generateCompanySummary({
                                      jobTitle: form.details.title,
                                    });
                                    setForm((f) => ({ ...f, description: { ...f.description, companySummary: result } }));
                                    toast.success("Company summary generated successfully!");
                                  } catch (error: any) {
                                    toast.error(error.message || "Failed to generate company summary");
                                  } finally {
                                    setGeneratingCompanySummary(false);
                                  }
                                }}
                                className="h-7 px-2 text-xs"
                              >
                                {generatingCompanySummary ? (
                                  <motion.div
                                    className="flex items-center gap-1"
                                    animate={{ opacity: [1, 0.5, 1] }}
                                    transition={{ duration: 1, repeat: Infinity }}
                                  >
                                    <div className="w-3 h-3 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                                    <span>Generating...</span>
                                  </motion.div>
                                ) : (
                                  "✨ AI Generate"
                                )}
                              </Button>
                            </div>
                            <Textarea
                              value={form.description.companySummary || ""}
                              onChange={(e) => updateDescription({ companySummary: e.target.value })}
                              rows={3}
                              className="mt-1"
                              placeholder="Brief about your company (optional)"
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3 pt-4 border-t">
                        <Button
                          type="button"
                          variant="outline"
                          disabled={generating || !form.details.title}
                          onClick={async () => {
                            setGenerating(true);
                            toast.info("AI is generating your job description...");
                            try {
                              const result = await generateJD({
                                role: form.details.title,
                                skills: form.description.skills || "",
                                companySummary: form.description.companySummary || "",
                                jobDescription: form.description.text || "",
                              });
                              setForm((f) => ({ ...f, description: { ...f.description, text: result } }));
                              toast.success("Job description generated successfully!");
                            } catch (error: any) {
                              toast.error(error.message || "Failed to generate job description");
                            } finally {
                              setGenerating(false);
                            }
                          }}
                        >
                          {generating ? (
                            <motion.div
                              className="flex items-center gap-2"
                              animate={{ opacity: [1, 0.5, 1] }}
                              transition={{ duration: 1, repeat: Infinity }}
                            >
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                              >
                                <svg className="h-4 w-4" viewBox="0 0 24 24">
                                  <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                    fill="none"
                                  />
                                  <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                  />
                                </svg>
                              </motion.div>
                              <span>Generating...</span>
                            </motion.div>
                          ) : (
                            "✨ AI Generate JD"
                          )}
                        </Button>
                        <p className="text-xs text-muted-foreground">
                          AI will create a professional job description based on your inputs
                        </p>
                      </div>
                    </div>
                  )}

                  {current === 3 && (
                    <div className="space-y-6">
                      {/* Header Section */}
                      <div className="flex items-center justify-between pb-4 border-b">
                        <div>
                          <h3 className="text-lg font-semibold text-foreground mb-1">Question Bank</h3>
                          <p className="text-sm text-muted-foreground">
                            Generate questions with AI or add them manually
                          </p>
                        </div>
                        <span className={`text-xs px-3 py-1.5 rounded-md border font-medium ${
                          totalWeight === 100 
                            ? "border-emerald-200 text-emerald-700 bg-emerald-50" 
                            : "border-amber-200 text-amber-700 bg-amber-50"
                        }`}>
                          Weight: {totalWeight}% {totalWeight !== 100 && "⚠️"}
                        </span>
                      </div>

                      {/* AI Question Generation Section */}
                      <div className="rounded-lg border p-5 space-y-4 bg-card">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-lg">✨</span>
                          <div>
                            <h4 className="text-sm font-semibold">AI Generate Questions</h4>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              AI will create questions with expected answers based on your job description
                            </p>
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground mb-4 p-3 bg-muted/50 rounded border border-muted">
                          <strong>Works for all industries:</strong> Medical, Legal, IT, Engineering, Finance, Healthcare, Education, Sales, Marketing, Operations, HR, Non-profit, Government, and more. The AI adapts to your domain automatically.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="text-xs font-medium mb-1.5 block text-foreground">Interview Round</label>
                            <Select value={interviewMode} onValueChange={(v) => setInterviewMode(v as "Technical" | "HR" | "General")}>
                              <SelectTrigger className="h-9">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="General">
                                  <div className="flex flex-col">
                                    <span className="font-medium">General Round</span>
                                    <span className="text-xs text-muted-foreground">Mix of knowledge, skills & behavioral</span>
                                  </div>
                                </SelectItem>
                                <SelectItem value="Technical">
                                  <div className="flex flex-col">
                                    <span className="font-medium">Technical Round</span>
                                    <span className="text-xs text-muted-foreground">Domain expertise (Medical, Legal, IT, Engineering, etc.)</span>
                                  </div>
                                </SelectItem>
                                <SelectItem value="HR">
                                  <div className="flex flex-col">
                                    <span className="font-medium">HR Round</span>
                                    <span className="text-xs text-muted-foreground">Behavioral, soft skills, cultural fit</span>
                                  </div>
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            <p className="text-xs text-muted-foreground mt-1.5">
                              {interviewMode === "Technical" && "Questions focus on domain-specific expertise, practical knowledge, and problem-solving relevant to your field"}
                              {interviewMode === "HR" && "Questions focus on behavioral scenarios, teamwork, communication, and professional ethics"}
                              {interviewMode === "General" && "Questions include a balanced mix of domain knowledge, practical skills, and behavioral topics"}
                            </p>
                          </div>

                          <div>
                            <label className="text-xs font-medium mb-1.5 block text-foreground">Difficulty Level</label>
                            <Select value={questionDifficulty} onValueChange={(v) => setQuestionDifficulty(v as "Easy" | "Medium" | "Hard" | "Mixed")}>
                              <SelectTrigger className="h-9">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Easy">Easy (Entry-level)</SelectItem>
                                <SelectItem value="Medium">Medium (Mid-level)</SelectItem>
                                <SelectItem value="Hard">Hard (Senior/Expert)</SelectItem>
                                <SelectItem value="Mixed">Mixed (All levels)</SelectItem>
                              </SelectContent>
                            </Select>
                            <p className="text-xs text-muted-foreground mt-1.5">
                              {questionDifficulty === "Easy" && "Basic concepts and fundamental knowledge"}
                              {questionDifficulty === "Medium" && "Moderate complexity with practical application"}
                              {questionDifficulty === "Hard" && "Advanced concepts and complex problem-solving"}
                              {questionDifficulty === "Mixed" && "Mix of Easy, Medium, and Hard questions"}
                            </p>
                          </div>

                          <div>
                            <label className="text-xs font-medium mb-1.5 block text-foreground">Number of Questions</label>
                            <Input
                              type="number"
                              min={1}
                              max={20}
                              value={aiQCount}
                              onChange={(e) => setAiQCount(Math.max(1, Math.min(20, Number(e.target.value))))}
                              className="h-9"
                              placeholder="5"
                            />
                            <p className="text-xs text-muted-foreground mt-1.5">How many questions to generate (1-20)</p>
                          </div>
                        </div>

                        <div className="flex items-end gap-3 pt-2">
                          <div className="flex-1">
                            <label className="text-xs font-medium mb-1.5 block text-muted-foreground">Focus Areas (Optional)</label>
                            <Input
                              placeholder="e.g., Python, React, Clinical Procedures (comma separated)"
                              value={aiQCategories}
                              onChange={(e) => setAiQCategories(e.target.value)}
                              className="h-9"
                            />
                          </div>
                          <Button
                            type="button"
                            variant="default"
                            disabled={aiQGenerating || !form.description.text}
                            onClick={async () => {
                              setAiQGenerating(true);
                              toast.info(`AI is generating ${interviewMode.toLowerCase()} interview questions...`);
                              try {
                                const result = await generateQuestions({
                                  jd: form.description.text,
                                  numQuestions: aiQCount,
                                  interviewTypes: form.interviewTypes,
                                  interviewMode: interviewMode,
                                  categories: aiQCategories ? aiQCategories.split(",").map(c => c.trim()) : [],
                                  difficulty: questionDifficulty,
                                });
                                // Add id and interviewRound to each generated question
                                const questionsWithId = result.map((q) => ({
                                  ...q,
                                  id: `Q-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                                  interviewRound: interviewMode,
                                }));
                                setForm((f) => ({ ...f, questions: [...f.questions, ...questionsWithId] }));
                                toast.success(`Generated ${result.length} ${interviewMode.toLowerCase()} questions successfully! All questions include expected answers.`);
                                // Reset categories after generation
                                setAiQCategories("");
                              } catch (error: any) {
                                toast.error(error.message || "Failed to generate questions");
                              } finally {
                                setAiQGenerating(false);
                              }
                            }}
                            className="h-9"
                          >
                            {aiQGenerating ? (
                              <motion.div className="flex items-center gap-2" animate={{ opacity: [1, 0.5, 1] }} transition={{ duration: 1, repeat: Infinity }}>
                                <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
                                  <svg className="h-4 w-4" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                  </svg>
                                </motion.div>
                                <span>Generating...</span>
                              </motion.div>
                            ) : (
                              "Generate Questions"
                            )}
                          </Button>
                        </div>
                        {!form.description.text && (
                          <p className="text-xs text-amber-600">⚠️ Job description is required</p>
                        )}
                      </div>

                      {/* Manual Question Addition */}
                      <div className="flex items-center justify-between pt-4 border-t">
                        <div>
                          <h4 className="text-sm font-semibold mb-0.5">Add Question Manually</h4>
                          <p className="text-xs text-muted-foreground">Create custom questions</p>
                        </div>
                        <Button type="button" variant="outline" size="sm" onClick={addQuestion}>
                          + Add Question
                        </Button>
                      </div>

                      {/* Questions List */}
                      <div className="space-y-4">
                        {form.questions.length === 0 ? (
                          <div className="text-center py-8 border-2 border-dashed rounded-lg">
                            <p className="text-sm text-muted-foreground mb-2">No questions added yet</p>
                            <p className="text-xs text-muted-foreground">Use AI to generate questions or add them manually</p>
                          </div>
                        ) : (
                          <>
                            <div className="flex items-center justify-between mb-4 pb-3 border-b">
                              <h4 className="text-sm font-semibold">Questions ({form.questions.length})</h4>
                              <div className="flex gap-2 text-xs">
                                <button
                                  onClick={() => setSelectedRoundFilter("All")}
                                  className={`px-3 py-1 rounded transition-all cursor-pointer ${
                                    selectedRoundFilter === "All"
                                      ? "bg-gray-100 text-gray-900 border-2 border-gray-300 font-medium"
                                      : "bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100"
                                  }`}
                                >
                                  All: {form.questions.length}
                                </button>
                                <button
                                  onClick={() => setSelectedRoundFilter("General")}
                                  className={`px-3 py-1 rounded transition-all cursor-pointer ${
                                    selectedRoundFilter === "General"
                                      ? "bg-blue-100 text-blue-900 border-2 border-blue-300 font-medium"
                                      : "bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100"
                                  }`}
                                >
                                  General: {form.questions.filter(q => q.interviewRound === "General" || !q.interviewRound).length}
                                </button>
                                <button
                                  onClick={() => setSelectedRoundFilter("Technical")}
                                  className={`px-3 py-1 rounded transition-all cursor-pointer ${
                                    selectedRoundFilter === "Technical"
                                      ? "bg-purple-100 text-purple-900 border-2 border-purple-300 font-medium"
                                      : "bg-purple-50 text-purple-700 border border-purple-200 hover:bg-purple-100"
                                  }`}
                                >
                                  Technical: {form.questions.filter(q => q.interviewRound === "Technical").length}
                                </button>
                                <button
                                  onClick={() => setSelectedRoundFilter("HR")}
                                  className={`px-3 py-1 rounded transition-all cursor-pointer ${
                                    selectedRoundFilter === "HR"
                                      ? "bg-green-100 text-green-900 border-2 border-green-300 font-medium"
                                      : "bg-green-50 text-green-700 border border-green-200 hover:bg-green-100"
                                  }`}
                                >
                                  HR: {form.questions.filter(q => q.interviewRound === "HR").length}
                                </button>
                              </div>
                            </div>
                            <div className="space-y-4">
                              {/* Group questions by round */}
                              {(["General", "Technical", "HR"] as const)
                                .filter(round => selectedRoundFilter === "All" || selectedRoundFilter === round)
                                .map((round) => {
                                  const roundQuestions = form.questions.filter(q => q.interviewRound === round || (!q.interviewRound && round === "General"));
                                  if (roundQuestions.length === 0) return null;
                                  
                                  return (
                                    <div key={round} className="space-y-3">
                                      <div className={`flex items-center gap-3 pb-3 border-b-2 ${
                                        round === "General" ? "border-blue-300 bg-blue-50/30 rounded-lg p-3" :
                                        round === "Technical" ? "border-purple-300 bg-purple-50/30 rounded-lg p-3" :
                                        "border-green-300 bg-green-50/30 rounded-lg p-3"
                                      }`}>
                                        <span className={`text-base font-bold ${
                                          round === "General" ? "text-blue-700" :
                                          round === "Technical" ? "text-purple-700" :
                                          "text-green-700"
                                        }`}>
                                          {round === "General" && "📋 General Round"}
                                          {round === "Technical" && "🔧 Technical Round"}
                                          {round === "HR" && "👥 HR Round"}
                                        </span>
                                        <span className={`text-xs px-2 py-1 rounded font-medium ${
                                          round === "General" ? "bg-blue-100 text-blue-800" :
                                          round === "Technical" ? "bg-purple-100 text-purple-800" :
                                          "bg-green-100 text-green-800"
                                        }`}>
                                          {roundQuestions.length} {roundQuestions.length === 1 ? "question" : "questions"}
                                        </span>
                                      </div>
                                      <div className="space-y-3 pl-3 border-l-2 border-muted">
                                      {roundQuestions.map((q, idx) => {
                                        const globalIndex = form.questions.findIndex(qq => qq.id === q.id);
                                        return (
                                          <div key={q.id} className="rounded-lg border p-5 space-y-4 bg-card shadow-sm">
                                            <div className="flex items-start justify-between pb-3 border-b">
                                              <div className="flex items-center gap-2 flex-1">
                                                <span className="text-sm font-semibold text-foreground">Q{globalIndex + 1}</span>
                                                {q.difficulty && (
                                                  <span className={`text-xs px-2 py-1 rounded font-medium ${
                                                    q.difficulty === "Easy" ? "bg-green-50 text-green-700 border border-green-200" :
                                                    q.difficulty === "Medium" ? "bg-yellow-50 text-yellow-700 border border-yellow-200" :
                                                    q.difficulty === "Hard" ? "bg-red-50 text-red-700 border border-red-200" :
                                                    "bg-gray-50 text-gray-700 border border-gray-200"
                                                  }`}>
                                                    {q.difficulty}
                                                  </span>
                                                )}
                                                <span className={`text-xs px-2 py-1 rounded font-medium ${
                                                  q.interviewRound === "Technical" ? "bg-purple-50 text-purple-700 border border-purple-200" :
                                                  q.interviewRound === "HR" ? "bg-green-50 text-green-700 border border-green-200" :
                                                  "bg-blue-50 text-blue-700 border border-blue-200"
                                                }`}>
                                                  {q.interviewRound || "General"}
                                                </span>
                                                <div className="h-px flex-1 bg-border"></div>
                                              </div>
                                              <Button 
                                                type="button" 
                                                variant="ghost" 
                                                size="sm"
                                                onClick={() => removeQuestion(q.id)}
                                                className="h-7 w-7 p-0 text-destructive hover:text-destructive"
                                              >
                                                ✕
                                              </Button>
                                            </div>
                                            
                                            <div>
                                              <label className="text-sm font-semibold text-foreground mb-2 block">Question Text</label>
                                              <Textarea
                                                value={q.text}
                                                onChange={(e) => updateQuestion(q.id, { text: e.target.value })}
                                                placeholder="Enter your question here..."
                                                className="w-full min-h-[80px]"
                                                rows={3}
                                              />
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                                              <div>
                                                <label className="text-xs font-medium text-muted-foreground mb-1 block">Interview Round</label>
                                                <Select
                                                  value={q.interviewRound || "General"}
                                                  onValueChange={(v) => updateQuestion(q.id, { interviewRound: v as "General" | "Technical" | "HR" })}
                                                >
                                                  <SelectTrigger>
                                                    <SelectValue />
                                                  </SelectTrigger>
                                                  <SelectContent>
                                                    <SelectItem value="General">General</SelectItem>
                                                    <SelectItem value="Technical">Technical</SelectItem>
                                                    <SelectItem value="HR">HR</SelectItem>
                                                  </SelectContent>
                                                </Select>
                                              </div>

                                              <div>
                                                <label className="text-xs font-medium text-muted-foreground mb-1 block">Difficulty</label>
                                                <Select
                                                  value={q.difficulty || "Medium"}
                                                  onValueChange={(v) => updateQuestion(q.id, { difficulty: v as "Easy" | "Medium" | "Hard" | "Mixed" })}
                                                >
                                                  <SelectTrigger>
                                                    <SelectValue />
                                                  </SelectTrigger>
                                                  <SelectContent>
                                                    <SelectItem value="Easy">Easy</SelectItem>
                                                    <SelectItem value="Medium">Medium</SelectItem>
                                                    <SelectItem value="Hard">Hard</SelectItem>
                                                    <SelectItem value="Mixed">Mixed</SelectItem>
                                                  </SelectContent>
                                                </Select>
                                              </div>

                                              <div>
                                                <label className="text-xs font-medium text-muted-foreground mb-1 block">Question Type</label>
                                                <Select
                                                  value={q.type}
                                                  onValueChange={(v) => updateQuestion(q.id, { type: v as JobForm["questions"][number]["type"] })}
                                                >
                                                  <SelectTrigger>
                                                    <SelectValue />
                                                  </SelectTrigger>
                                                  <SelectContent>
                                                    <SelectItem value="Text">Text</SelectItem>
                                                    <SelectItem value="MCQ">MCQ</SelectItem>
                                                    <SelectItem value="Code">Code</SelectItem>
                                                    <SelectItem value="Voice">Voice</SelectItem>
                                                  </SelectContent>
                                                </Select>
                                              </div>

                                              <div>
                                                <label className="text-xs font-medium text-muted-foreground mb-1 block">Weight (%)</label>
                                                <Input
                                                  type="number"
                                                  min={0}
                                                  max={100}
                                                  value={q.weight}
                                                  onChange={(e) => updateQuestion(q.id, { weight: Number(e.target.value) })}
                                                  placeholder="0-100"
                                                />
                                              </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                              <div>
                                                <label className="text-xs font-medium text-muted-foreground mb-1 block">Evaluation Mode</label>
                                                <Select
                                                  value={q.evalMode}
                                                  onValueChange={(v) => updateQuestion(q.id, { evalMode: v as "Auto" | "Manual" })}
                                                >
                                                  <SelectTrigger>
                                                    <SelectValue />
                                                  </SelectTrigger>
                                                  <SelectContent>
                                                    <SelectItem value="Auto">Auto</SelectItem>
                                                    <SelectItem value="Manual">Manual</SelectItem>
                                                  </SelectContent>
                                                </Select>
                                              </div>
                                            </div>

                                            <div className="bg-blue-50/50 rounded-lg p-4 border-2 border-blue-200">
                                              <div className="flex items-center justify-between mb-3">
                                                <div className="flex items-center gap-2">
                                                  <span className="text-sm font-semibold text-blue-900">Expected Answer / Key Points</span>
                                                  <span className="text-xs px-2 py-0.5 rounded bg-blue-100 text-blue-800 border border-blue-300 font-medium">For Evaluators</span>
                                                </div>
                                                {q.expectedAnswer && (
                                                  <span className="text-xs text-blue-700">✓ Answer provided</span>
                                                )}
                                              </div>
                                              <Textarea
                                                value={q.expectedAnswer || ""}
                                                onChange={(e) => updateQuestion(q.id, { expectedAnswer: e.target.value })}
                                                placeholder="Enter the expected answer or key points that should be covered in the candidate's response. This helps evaluators assess answers accurately. For domain-specific questions (Medical, Legal, IT, Engineering, etc.), include specific terminology, procedures, or concepts that indicate a good answer..."
                                                rows={5}
                                                className="w-full text-sm bg-background border-blue-200 focus:border-blue-400"
                                              />
                                              <div className="mt-2 p-2 bg-blue-100/50 rounded border border-blue-200">
                                                <p className="text-xs text-blue-800">
                                                  <strong>💡 Tip:</strong> Include specific points, examples, or criteria that indicate a good answer. This is especially important for domain-specific questions (Medical, Legal, IT, Engineering, etc.). AI-generated questions will automatically include expected answers.
                                                </p>
                                              </div>
                                            </div>

                                            {q.type === "MCQ" && (
                                              <div>
                                                <label className="text-xs font-medium text-muted-foreground mb-1 block">Answer Options (comma separated)</label>
                                                <Input
                                                  value={(q.options || []).join(", ")}
                                                  onChange={(e) => updateQuestion(q.id, { options: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) })}
                                                  placeholder="Option A, Option B, Option C, Option D"
                                                />
                                              </div>
                                            )}
                                          </div>
                                        );
                                      })}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </>
                        )}
                        {errors.questions && <p className="text-sm text-red-600">{errors.questions}</p>}
                      </div>
                    </div>
                  )}

                  {current === 4 && (
                    <div className="space-y-6">
                      {/* Header */}
                      <div className="pb-4 border-b">
                        <h3 className="text-xl font-bold text-foreground mb-2">Review & Publish</h3>
                        <p className="text-sm text-muted-foreground">
                          Review all details before publishing. Once published, this job will appear in your Jobs dashboard.
                        </p>
                      </div>

                      {/* Job Information Card */}
                      <div className="rounded-lg border-2 border-muted bg-card p-6 space-y-4">
                        <div className="flex items-center justify-between pb-3 border-b">
                          <h4 className="text-lg font-semibold text-foreground">Job Information</h4>
                          <Badge variant="outline" className="text-xs">Step 1</Badge>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="text-xs font-medium text-muted-foreground">Job Title</label>
                            <p className="text-sm font-semibold mt-1">{form.details.title || "-"}</p>
                          </div>
                          <div>
                            <label className="text-xs font-medium text-muted-foreground">Experience Required</label>
                            <p className="text-sm mt-1">{form.details.experience || "Not specified"}</p>
                          </div>
                          <div>
                            <label className="text-xs font-medium text-muted-foreground">Work Arrangement</label>
                            <p className="text-sm mt-1">{form.details.workArrangement || "-"}</p>
                          </div>
                          <div>
                            <label className="text-xs font-medium text-muted-foreground">Location</label>
                            <p className="text-sm mt-1">
                              {form.details.workArrangement === "Remote" 
                                ? "Remote" 
                                : form.details.city && form.details.state && form.details.country
                                ? `${form.details.city}, ${form.details.state.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")}, ${countries.find(c => c.value === form.details.country)?.label || form.details.country}`
                                : form.details.country
                                ? countries.find(c => c.value === form.details.country)?.label || form.details.country
                                : "-"}
                            </p>
                          </div>
                          <div>
                            <label className="text-xs font-medium text-muted-foreground">Salary Range</label>
                            <p className="text-sm mt-1">
                              {form.details.salaryMin && form.details.salaryMax 
                                ? `${form.details.salaryCurrency} ${form.details.salaryMin} - ${form.details.salaryMax}` 
                                : "Not specified"}
                            </p>
                          </div>
                          <div>
                            <label className="text-xs font-medium text-muted-foreground">Employment Type</label>
                            <p className="text-sm mt-1">{form.details.type || "-"}</p>
                          </div>
                          <div>
                            <label className="text-xs font-medium text-muted-foreground">Application Deadline</label>
                            <p className="text-sm mt-1">{form.details.deadline || "-"}</p>
                          </div>
                          <div>
                            <label className="text-xs font-medium text-muted-foreground">Interview Duration</label>
                            <p className="text-sm mt-1 font-semibold">
                              {form.details.interviewDuration 
                                ? `${form.details.interviewDuration === "60" ? "1 hour" : form.details.interviewDuration === "90" ? "1.5 hours" : form.details.interviewDuration === "120" ? "2 hours" : `${form.details.interviewDuration} minutes`}`
                                : "-"}
                            </p>
                          </div>
                          <div>
                            <label className="text-xs font-medium text-muted-foreground">Interview Types</label>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {form.interviewTypes && form.interviewTypes.length > 0 ? (
                                form.interviewTypes.map((type) => (
                                  <Badge key={type} variant="secondary" className="text-xs">
                                    {type}
                                  </Badge>
                                ))
                              ) : (
                                <span className="text-sm text-muted-foreground">-</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Job Description Card */}
                      <div className="rounded-lg border-2 border-muted bg-card p-6 space-y-4">
                        <div className="flex items-center justify-between pb-3 border-b">
                          <h4 className="text-lg font-semibold text-foreground">Job Description</h4>
                          <Badge variant="outline" className="text-xs">Step 2</Badge>
                        </div>
                        <div className="bg-muted/30 rounded-lg p-4 border border-muted">
                          <div className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">
                            {form.description.text || "No description provided"}
                          </div>
                        </div>
                        {form.description.skills && (
                          <div>
                            <label className="text-xs font-medium text-muted-foreground">Key Skills</label>
                            <p className="text-sm mt-1">{form.description.skills}</p>
                          </div>
                        )}
                        {form.description.companySummary && (
                          <div>
                            <label className="text-xs font-medium text-muted-foreground">Company Summary</label>
                            <p className="text-sm mt-1">{form.description.companySummary}</p>
                          </div>
                        )}
                      </div>

                      {/* Questions Card */}
                      <div className="rounded-lg border-2 border-muted bg-card p-6 space-y-4">
                        <div className="flex items-center justify-between pb-3 border-b">
                          <h4 className="text-lg font-semibold text-foreground">Interview Questions</h4>
                          <Badge variant="outline" className="text-xs">Step 3</Badge>
                        </div>
                        <div className="flex gap-2 mb-4">
                          <span className="text-xs px-2 py-1 rounded bg-blue-50 text-blue-700 border border-blue-200">
                            General: {form.questions.filter(q => q.interviewRound === "General" || !q.interviewRound).length}
                          </span>
                          <span className="text-xs px-2 py-1 rounded bg-purple-50 text-purple-700 border border-purple-200">
                            Technical: {form.questions.filter(q => q.interviewRound === "Technical").length}
                          </span>
                          <span className="text-xs px-2 py-1 rounded bg-green-50 text-green-700 border border-green-200">
                            HR: {form.questions.filter(q => q.interviewRound === "HR").length}
                          </span>
                          <span className="text-xs px-2 py-1 rounded bg-gray-50 text-gray-700 border border-gray-200">
                            Total: {form.questions.length} questions
                          </span>
                        </div>
                        <div className="space-y-4">
                          {(["General", "Technical", "HR"] as const).map((round) => {
                            const roundQuestions = form.questions.filter(q => q.interviewRound === round || (!q.interviewRound && round === "General"));
                            if (roundQuestions.length === 0) return null;
                            
                            return (
                              <div key={round} className="space-y-2">
                                <div className={`flex items-center gap-2 pb-2 border-b ${
                                  round === "General" ? "border-blue-200" :
                                  round === "Technical" ? "border-purple-200" :
                                  "border-green-200"
                                }`}>
                                  <span className={`text-sm font-semibold ${
                                    round === "General" ? "text-blue-700" :
                                    round === "Technical" ? "text-purple-700" :
                                    "text-green-700"
                                  }`}>
                                    {round === "General" && "📋 General Round"}
                                    {round === "Technical" && "🔧 Technical Round"}
                                    {round === "HR" && "👥 HR Round"}
                                  </span>
                                  <span className="text-xs text-muted-foreground">({roundQuestions.length} questions)</span>
                                </div>
                                <div className="space-y-2 pl-4 border-l-2 border-muted">
                                  {roundQuestions.map((q, idx) => (
                                    <div key={q.id} className="py-2 border-b border-muted/50 last:border-0">
                                      <div className="flex items-start justify-between gap-2">
                                        <div className="flex-1">
                                          <p className="text-sm font-medium text-foreground mb-1">
                                            Q{form.questions.findIndex(qq => qq.id === q.id) + 1}. {q.text}
                                          </p>
                                          <div className="flex items-center gap-2 mt-1">
                                            <Badge variant="outline" className="text-xs">{q.type}</Badge>
                                            {q.difficulty && (
                                              <Badge variant="outline" className="text-xs">{q.difficulty}</Badge>
                                            )}
                                            <span className="text-xs text-muted-foreground">Weight: {q.weight}%</span>
                                          </div>
                                          {q.expectedAnswer && (
                                            <div className="mt-2 p-2 bg-blue-50/50 rounded border border-blue-200">
                                              <p className="text-xs font-medium text-blue-900 mb-1">Expected Answer:</p>
                                              <p className="text-xs text-blue-800">{q.expectedAnswer}</p>
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Token Information */}
                      <div className="rounded-lg border-2 border-amber-200 bg-amber-50/30 p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Coins className="h-5 w-5 text-amber-600" />
                            <div>
                              <p className="text-sm font-semibold text-amber-900">Token Cost</p>
                              <p className="text-xs text-amber-700">This will be deducted from your balance</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-amber-900">{tokenCost} tokens</p>
                            <p className="text-xs text-amber-700">Balance: {tokenBalance.current} tokens</p>
                          </div>
                        </div>
                        {tokenCost > tokenBalance.current && (
                          <Alert className="mt-3 bg-red-50 border-red-200">
                            <AlertTriangle className="h-4 w-4 text-red-600" />
                            <AlertDescription className="text-red-900">
                              Insufficient tokens! You need {tokenCost - tokenBalance.current} more tokens to publish this job.
                            </AlertDescription>
                          </Alert>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center justify-between pt-4 border-t">
                        <Button type="button" variant="outline" onClick={() => {
                          localStorage.setItem(STORAGE_KEY, JSON.stringify(form));
                          toast.success("Draft saved successfully!");
                        }}>
                          Save Draft
                        </Button>
                        <div className="flex items-center gap-3">
                          <Button type="button" variant="outline" onClick={() => setCurrent(3)}>
                            Back to Questions
                          </Button>
                          <Button
                            type="button"
                            disabled={tokenCost > tokenBalance.current || published}
                            onClick={() => {
                            // Deduct tokens first
                            const deductionResult = tokenSystem.deductTokens(form.interviewTypes);
                            
                            if (!deductionResult.success) {
                              toast.error(deductionResult.message);
                              return;
                            }
                            
                            // Save job to centralized data
                            const locationDisplay = form.details.workArrangement === "Remote" 
                              ? "Remote" 
                              : form.details.city && form.details.state && form.details.country
                              ? `${form.details.city}, ${form.details.state.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")}, ${countries.find(c => c.value === form.details.country)?.label || form.details.country}`
                              : form.details.country
                              ? countries.find(c => c.value === form.details.country)?.label || form.details.country
                              : "";

                            const newJob = {
                              id: `JOB-${Date.now()}`,
                              title: form.details.title,
                              status: "Open" as const,
                              applicants: 0,
                              updatedAt: new Date().toISOString(),
                              description: form.description.text,
                              experience: form.details.experience,
                              location: locationDisplay,
                              salary: form.details.salaryMin && form.details.salaryMax 
                                ? `${form.details.salaryCurrency} ${form.details.salaryMin} - ${form.details.salaryMax}` 
                                : "",
                              type: form.details.type,
                              deadline: form.details.deadline,
                              interviewDuration: form.details.interviewDuration,
                            };
                            mockData.addJob(newJob);

                            // Save questions to centralized data
                            form.questions.forEach((q) => {
                              mockData.addQuestion({
                                ...q,
                                jobId: newJob.id,
                              });
                            });

                            // Update token balance
                            setTokenBalance(tokenSystem.getBalance());
                            
                            toast.success(`Job published successfully! ${deductionResult.message}`);
                            setPublished(true);
                            
                            // Navigate to jobs dashboard after 2 seconds
                            setTimeout(() => {
                              localStorage.removeItem(STORAGE_KEY);
                              setForm(initialState);
                              setCurrent(0);
                              setPublished(false);
                              navigate("/company-dashboard");
                            }, 2000);
                          }}
                          className="min-w-[120px]"
                        >
                          {published ? "Published!" : "Publish Job"}
                        </Button>
                      </div>
                      </div>
                      {published && (
                        <motion.div
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ type: "spring", stiffness: 200, damping: 15 }}
                          className="mt-4 p-6 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-center"
                        >
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: [0, 1.2, 1] }}
                            transition={{ delay: 0.2, duration: 0.5 }}
                            className="inline-block"
                          >
                            <svg
                              className="h-16 w-16 mx-auto mb-3"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <motion.path
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: 1 }}
                                transition={{ delay: 0.3, duration: 0.5 }}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          </motion.div>
                          <h4 className="text-lg font-bold mb-2">Job Published Successfully!</h4>
                          <p className="text-sm mb-4">Your job posting is now live and accepting applications.</p>
                          <p className="text-xs text-emerald-600">Redirecting to Jobs dashboard...</p>
                        </motion.div>
                      )}
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="flex items-center justify-between">
              <Button onClick={prev} variant="outline" disabled={current === 0}>Back</Button>
              <Button onClick={next}>
                {current === steps.length - 1 ? "Finish" : "Next"}
              </Button>
            </div>
          </main>
        </div>
      </div>
    </PageTransition>
  );
};

export default PostJobPage;

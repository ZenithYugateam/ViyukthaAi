import React from "react";

import Sidebar from "@/components/company-dashboard/Sidebar";
import TopNav from "@/components/company-dashboard/TopNav";
import Stepper, { Step } from "@/components/company-dashboard/Stepper";
import { PageTransition } from "@/components/company-dashboard/PageTransition";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
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
    department: string;
    experience: string;
    location: string;
    salary: string;
    type: string;
    deadline: string;
  };
  settings: {
    model: string;
    tone: string;
    difficulty: string;
    interviewer: string;
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
    options?: string[];
  }>;
};

const STORAGE_KEY = "companyDashboard.postJob.v1";

const steps: Step[] = [
  { key: "type", label: "Interview Type" },
  { key: "details", label: "Job Details" },
  { key: "settings", label: "Interview Settings" },
  { key: "description", label: "Job Description" },
  { key: "questions", label: "Question Bank" },
  { key: "review", label: "Review & Publish" },
];

const initialState: JobForm = {
  interviewTypes: [],
  details: {
    title: "",
    department: "",
    experience: "",
    location: "",
    salary: "",
    type: "",
    deadline: "",
  },
  settings: {
    model: "gpt-4o-mini",
    tone: "Professional",
    difficulty: "Medium",
    interviewer: "AI"
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

const variants = {
  enter: (direction: number) => ({ x: direction > 0 ? 24 : -24, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({ x: direction < 0 ? 24 : -24, opacity: 0 })
};

const PostJobPage: React.FC = () => {
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
  const [aiQGenerating, setAiQGenerating] = React.useState(false);
  const [aiQCount, setAiQCount] = React.useState(5);
  const [aiQCategories, setAiQCategories] = React.useState("");
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

  const updateDetails = (patch: Partial<JobForm["details"]>) =>
    setForm((f) => ({ ...f, details: { ...f.details, ...patch } }));
  const updateSettings = (patch: Partial<JobForm["settings"]>) =>
    setForm((f) => ({ ...f, settings: { ...f.settings, ...patch } }));
  const updateDescription = (patch: Partial<JobForm["description"]>) =>
    setForm((f) => ({ ...f, description: { ...f.description, ...patch } }));

  const addQuestion = () =>
    setForm((f) => ({
      ...f,
      questions: [
        ...f.questions,
        { id: `Q-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`, text: "", weight: 10, type: "Text", evalMode: "Auto" },
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
      if (!form.details.department) e.department = "Department is required";
      if (!form.details.type) e.type = "Job type is required";
      if (!form.details.deadline) e.deadline = "Deadline is required";
    } else if (idx === 3) {
      if (!form.description.text) e.description = "Provide a description or upload a file";
    } else if (idx === 4) {
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
                      <p className="text-sm text-muted-foreground mb-4">
                        Select one or more interview types for this position
                      </p>
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
                        <div className="mt-4 space-y-2">
                          <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
                            <p className="text-sm font-medium text-blue-900">
                              Selected: {form.interviewTypes.join(", ")}
                            </p>
                          </div>
                          <div className="p-3 rounded-lg bg-amber-50 border border-amber-200">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Coins className="h-4 w-4 text-amber-600" />
                                <span className="text-sm font-medium text-amber-900">
                                  Token Cost: {tokenCost} tokens
                                </span>
                              </div>
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm">Job Title</label>
                        <Input value={form.details.title} onChange={(e) => updateDetails({ title: e.target.value })} className="mt-1" />
                        {errors.title && <p className="text-sm text-red-600 mt-1">{errors.title}</p>}
                      </div>
                      <div>
                        <label className="text-sm">Department</label>
                        <Input value={form.details.department} onChange={(e) => updateDetails({ department: e.target.value })} className="mt-1" />
                        {errors.department && <p className="text-sm text-red-600 mt-1">{errors.department}</p>}
                      </div>
                      <div>
                        <label className="text-sm">Experience</label>
                        <Input value={form.details.experience} onChange={(e) => updateDetails({ experience: e.target.value })} className="mt-1" />
                      </div>
                      <div>
                        <label className="text-sm">Location</label>
                        <Input value={form.details.location} onChange={(e) => updateDetails({ location: e.target.value })} className="mt-1" />
                      </div>
                      <div>
                        <label className="text-sm">Salary</label>
                        <Input value={form.details.salary} onChange={(e) => updateDetails({ salary: e.target.value })} className="mt-1" />
                      </div>
                      <div>
                        <label className="text-sm">Type</label>
                        <Select value={form.details.type} onValueChange={(v) => updateDetails({ type: v })}>
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Select..." />
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
                        <label className="text-sm">Deadline</label>
                        <Input type="date" value={form.details.deadline} onChange={(e) => updateDetails({ deadline: e.target.value })} className="mt-1" />
                        {errors.deadline && <p className="text-sm text-red-600 mt-1">{errors.deadline}</p>}
                      </div>
                    </div>
                  )}

                  {current === 2 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm">AI Model</label>
                        <Input value={form.settings.model} onChange={(e) => updateSettings({ model: e.target.value })} className="mt-1" />
                      </div>
                      <div>
                        <label className="text-sm">Tone</label>
                        <Select value={form.settings.tone} onValueChange={(v) => updateSettings({ tone: v })}>
                          <SelectTrigger className="mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Professional">Professional</SelectItem>
                            <SelectItem value="Friendly">Friendly</SelectItem>
                            <SelectItem value="Direct">Direct</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="text-sm">Difficulty</label>
                        <Select value={form.settings.difficulty} onValueChange={(v) => updateSettings({ difficulty: v })}>
                          <SelectTrigger className="mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Easy">Easy</SelectItem>
                            <SelectItem value="Medium">Medium</SelectItem>
                            <SelectItem value="Hard">Hard</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="text-sm">Interviewer</label>
                        <Select value={form.settings.interviewer} onValueChange={(v) => updateSettings({ interviewer: v })}>
                          <SelectTrigger className="mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="AI">AI</SelectItem>
                            <SelectItem value="Technical">Technical</SelectItem>
                            <SelectItem value="HR">HR</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}

                  {current === 3 && (
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm">Job Description</label>
                        <Textarea
                          value={form.description.text}
                          onChange={(e) => updateDescription({ text: e.target.value })}
                          rows={8}
                          className="mt-1"
                        />
                        {errors.description && (
                          <p className="text-sm text-red-600 mt-1">{errors.description}</p>
                        )}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm">Key Skills (comma-separated)</label>
                          <Input
                            value={form.description.skills || ""}
                            onChange={(e) => updateDescription({ skills: e.target.value })}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <label className="text-sm">Role (defaults to Job Title)</label>
                          <Input
                            value={form.details.title}
                            onChange={(e) => updateDetails({ title: e.target.value })}
                            className="mt-1"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="text-sm">Company Summary (optional)</label>
                          <Textarea
                            value={form.description.companySummary || ""}
                            onChange={(e) => updateDescription({ companySummary: e.target.value })}
                            rows={4}
                            className="mt-1"
                          />
                        </div>
                      </div>
                      <div>
                        <Button
                          type="button"
                          variant="outline"
                          disabled={generating}
                          onClick={async () => {
                            setGenerating(true);
                            toast.info("AI is generating your job description...");
                            const result = await generateJD({
                              role: form.details.title,
                              skills: form.description.skills || "",
                              companySummary: form.description.companySummary || "",
                              tone: form.settings.tone,
                              difficulty: form.settings.difficulty,
                            });
                            setForm((f) => ({ ...f, description: { ...f.description, text: result } }));
                            setGenerating(false);
                            toast.success("Job description generated successfully!");
                          }}
                        >
                          {generating && (
                            <motion.div
                              className="mr-2"
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
                          )}
                          {generating ? "Generating..." : "AI Generate JD"}
                        </Button>
                      </div>
                    </div>
                  )}

                  {current === 4 && (
                    <div className="space-y-4">
                      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        <div className="flex items-center gap-3">
                          <h3 className="text-sm font-medium">Questions</h3>
                          <span className={`text-xs px-2 py-0.5 rounded-full border ${totalWeight === 100 ? "border-emerald-300 text-emerald-700 bg-emerald-50" : "border-amber-300 text-amber-700 bg-amber-50"}`}>
                            Total weight: {totalWeight}% {totalWeight !== 100 && "(should be 100%)"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button type="button" variant="outline" onClick={addQuestion}>Add Question</Button>
                          <div className="flex items-center gap-2">
                            <Input
                              type="number"
                              min={1}
                              max={20}
                              value={aiQCount}
                              onChange={(e) => setAiQCount(Math.max(1, Math.min(20, Number(e.target.value))))}
                              className="w-20"
                            />
                            <Input
                              placeholder="Categories (comma separated)"
                              value={aiQCategories}
                              onChange={(e) => setAiQCategories(e.target.value)}
                              className="w-64"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              disabled={aiQGenerating || !form.description.text}
                              onClick={async () => {
                                setAiQGenerating(true);
                                toast.info("AI is generating interview questions...");
                                const result = await generateQuestions({
                                  jd: form.description.text,
                                  numQuestions: aiQCount,
                                  difficulty: form.settings.difficulty,
                                  categories: aiQCategories ? aiQCategories.split(",").map(c => c.trim()) : [],
                                });
                                // Add id to each generated question
                                const questionsWithId = result.map((q) => ({
                                  ...q,
                                  id: `Q-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                                }));
                                setForm((f) => ({ ...f, questions: [...f.questions, ...questionsWithId] }));
                                setAiQGenerating(false);
                                toast.success(`Generated ${result.length} questions successfully!`);
                              }}
                            >
                              {aiQGenerating && (
                                <motion.div
                                  className="mr-2"
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
                              )}
                              {aiQGenerating ? "Generating..." : "AI Generate Questions"}
                            </Button>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        {form.questions.map((q) => (
                          <div key={q.id} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-start">
                            <Input
                              value={q.text}
                              onChange={(e) => updateQuestion(q.id, { text: e.target.value })}
                              placeholder="Enter question"
                              className="md:col-span-5"
                            />
                            <Select
                              value={q.type}
                              onValueChange={(v) => updateQuestion(q.id, { type: v as JobForm["questions"][number]["type"] })}
                            >
                              <SelectTrigger className="md:col-span-2">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Text">Text</SelectItem>
                                <SelectItem value="MCQ">MCQ</SelectItem>
                                <SelectItem value="Code">Code</SelectItem>
                                <SelectItem value="Voice">Voice</SelectItem>
                              </SelectContent>
                            </Select>
                            <Select
                              value={q.evalMode}
                              onValueChange={(v) => updateQuestion(q.id, { evalMode: v as "Auto" | "Manual" })}
                            >
                              <SelectTrigger className="md:col-span-2">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Auto">Auto</SelectItem>
                                <SelectItem value="Manual">Manual</SelectItem>
                              </SelectContent>
                            </Select>
                            <Input
                              type="number"
                              min={0}
                              max={100}
                              value={q.weight}
                              onChange={(e) => updateQuestion(q.id, { weight: Number(e.target.value) })}
                              className="md:col-span-2"
                            />
                            <Button type="button" variant="outline" onClick={() => removeQuestion(q.id)} className="md:col-span-1">Remove</Button>

                            {q.type === "MCQ" && (
                              <div className="md:col-span-12">
                                <label className="text-xs text-muted-foreground">Options (comma separated)</label>
                                <Input
                                  value={(q.options || []).join(", ")}
                                  onChange={(e) => updateQuestion(q.id, { options: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) })}
                                />
                              </div>
                            )}
                          </div>
                        ))}
                        {errors.questions && <p className="text-sm text-red-600">{errors.questions}</p>}
                      </div>
                    </div>
                  )}

                  {current === 5 && (
                    <div className="space-y-4">
                      <h3 className="text-sm font-medium">Review</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div className="rounded-lg border p-3">
                          <h4 className="font-semibold mb-2">Job</h4>
                          <div>Interview Types: {form.interviewTypes && form.interviewTypes.length > 0 ? form.interviewTypes.join(", ") : "-"}</div>
                          <div>Title: {form.details.title || "-"}</div>
                          <div>Department: {form.details.department || "-"}</div>
                          <div>Experience: {form.details.experience || "-"}</div>
                          <div>Location: {form.details.location || "-"}</div>
                          <div>Salary: {form.details.salary || "-"}</div>
                          <div>Type: {form.details.type || "-"}</div>
                          <div>Deadline: {form.details.deadline || "-"}</div>
                        </div>
                        <div className="rounded-lg border p-3">
                          <h4 className="font-semibold mb-2">Interview</h4>
                          <div>Model: {form.settings.model}</div>
                          <div>Tone: {form.settings.tone}</div>
                          <div>Difficulty: {form.settings.difficulty}</div>
                          <div>Interviewer: {form.settings.interviewer}</div>
                        </div>
                        <div className="rounded-lg border p-3 md:col-span-2">
                          <h4 className="font-semibold mb-2">Description</h4>
                          <pre className="whitespace-pre-wrap text-xs">{form.description.text || "-"}</pre>
                        </div>
                        <div className="rounded-lg border p-3 md:col-span-2">
                          <h4 className="font-semibold mb-2">Questions</h4>
                          <ul className="list-disc pl-5 space-y-1">
                            {form.questions.map((q) => (
                              <li key={q.id}>{q.text || "-"} • {q.type} • {q.weight}%</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      <div className="flex items-center justify-end gap-2">
                        <Button type="button" variant="outline" onClick={() => alert("Draft saved locally.")}>Save Draft</Button>
                        <Button
                          type="button"
                          disabled={tokenCost > tokenBalance.current}
                          onClick={() => {
                            // Deduct tokens first
                            const deductionResult = tokenSystem.deductTokens(form.interviewTypes);
                            
                            if (!deductionResult.success) {
                              toast.error(deductionResult.message);
                              return;
                            }
                            
                            // Save job to centralized data
                            const newJob = {
                              id: `JOB-${Date.now()}`,
                              title: form.details.title,
                              department: form.details.department,
                              status: "Open" as const,
                              applicants: 0,
                              updatedAt: new Date().toISOString().split("T")[0],
                              description: form.description.text,
                              experience: form.details.experience,
                              location: form.details.location,
                              salary: form.details.salary,
                              type: form.details.type,
                              deadline: form.details.deadline,
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
                            setTimeout(() => {
                              localStorage.removeItem(STORAGE_KEY);
                              setForm(initialState);
                              setCurrent(0);
                              setPublished(false);
                            }, 2000);
                          }}
                        >
                          Publish
                        </Button>
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
                          <div className="font-semibold text-lg mb-1">Job Published Successfully!</div>
                          <div className="text-sm">Redirecting to dashboard...</div>
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

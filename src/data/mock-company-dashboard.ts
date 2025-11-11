// Centralized mock data for company dashboard with localStorage persistence

export type Job = {
  id: string;
  title: string;
  department: string;
  status: "Open" | "Paused" | "Closed";
  applicants: number;
  updatedAt: string;
  description?: string;
  experience?: string;
  location?: string;
  salary?: string;
  type?: string;
  deadline?: string;
};

export type Question = {
  id: string;
  jobId: string;
  text: string;
  weight: number;
  type: "Text" | "MCQ" | "Code" | "Voice";
  evalMode: "Auto" | "Manual";
  options?: string[];
};

export type Interview = {
  id: string;
  jobTitle: string;
  candidates: number;
  date: string;
  status: "Ongoing" | "Completed" | "Scheduled";
  candidateList: Array<{
    id: string;
    name: string;
    email: string;
    score: number;
    aiRemarks: string;
    status: "Passed" | "Failed" | "Pending";
  }>;
};

export type Insight = {
  metric: string;
  value: number | string;
  change: string;
  trend: "up" | "down" | "neutral";
};

// Initial mock data
const initialJobs: Job[] = [
  {
    id: "JOB-1012",
    title: "Frontend Engineer",
    department: "Engineering",
    status: "Open",
    applicants: 42,
    updatedAt: "2025-11-02",
    description: "We are seeking a talented Frontend Engineer to join our team.",
    experience: "3-5 years",
    location: "Remote",
    salary: "$80k - $120k",
    type: "Full-time",
    deadline: "2025-12-01",
  },
  {
    id: "JOB-1013",
    title: "Backend Engineer",
    department: "Engineering",
    status: "Open",
    applicants: 31,
    updatedAt: "2025-11-01",
    description: "Looking for an experienced Backend Engineer.",
    experience: "4-6 years",
    location: "Hybrid",
    salary: "$90k - $130k",
    type: "Full-time",
    deadline: "2025-11-30",
  },
  {
    id: "JOB-1014",
    title: "Product Designer",
    department: "Design",
    status: "Paused",
    applicants: 18,
    updatedAt: "2025-10-29",
    description: "Creative Product Designer needed.",
    experience: "2-4 years",
    location: "On-site",
    salary: "$70k - $100k",
    type: "Full-time",
    deadline: "2025-11-25",
  },
  {
    id: "JOB-1015",
    title: "Data Analyst",
    department: "Analytics",
    status: "Open",
    applicants: 25,
    updatedAt: "2025-10-28",
    description: "Data-driven analyst to join our analytics team.",
    experience: "2-3 years",
    location: "Remote",
    salary: "$65k - $95k",
    type: "Full-time",
    deadline: "2025-11-20",
  },
];

const initialQuestions: Question[] = [
  {
    id: "Q-001",
    jobId: "JOB-1012",
    text: "Describe your experience with React and modern frontend frameworks.",
    weight: 30,
    type: "Text",
    evalMode: "Auto",
  },
  {
    id: "Q-002",
    jobId: "JOB-1012",
    text: "What is the virtual DOM and how does React use it?",
    weight: 20,
    type: "MCQ",
    evalMode: "Auto",
    options: ["A rendering technique", "A data structure", "A browser API", "None of the above"],
  },
  {
    id: "Q-003",
    jobId: "JOB-1013",
    text: "Explain the difference between SQL and NoSQL databases.",
    weight: 25,
    type: "Text",
    evalMode: "Auto",
  },
  {
    id: "Q-004",
    jobId: "JOB-1013",
    text: "Write a function to implement rate limiting.",
    weight: 35,
    type: "Code",
    evalMode: "Manual",
  },
];

const initialInterviews: Interview[] = [
  {
    id: "INT-001",
    jobTitle: "Frontend Engineer",
    candidates: 5,
    date: "2025-11-08",
    status: "Completed",
    candidateList: [
      {
        id: "C1",
        name: "Alice Johnson",
        email: "alice@example.com",
        score: 85,
        aiRemarks: "Strong technical skills, excellent communication. Recommended for hire.",
        status: "Passed",
      },
      {
        id: "C2",
        name: "Bob Smith",
        email: "bob@example.com",
        score: 72,
        aiRemarks: "Good problem-solving ability. Needs improvement in system design.",
        status: "Passed",
      },
      {
        id: "C3",
        name: "Carol White",
        email: "carol@example.com",
        score: 58,
        aiRemarks: "Basic understanding. Lacks depth in core concepts.",
        status: "Failed",
      },
      {
        id: "C4",
        name: "David Lee",
        email: "david@example.com",
        score: 90,
        aiRemarks: "Outstanding performance. Deep knowledge and excellent coding practices.",
        status: "Passed",
      },
      {
        id: "C5",
        name: "Emma Davis",
        email: "emma@example.com",
        score: 78,
        aiRemarks: "Solid technical foundation. Good cultural fit.",
        status: "Passed",
      },
    ],
  },
  {
    id: "INT-002",
    jobTitle: "Backend Engineer",
    candidates: 3,
    date: "2025-11-10",
    status: "Ongoing",
    candidateList: [
      {
        id: "C6",
        name: "Frank Miller",
        email: "frank@example.com",
        score: 82,
        aiRemarks: "Strong backend fundamentals. Excellent API design skills.",
        status: "Passed",
      },
      {
        id: "C7",
        name: "Grace Chen",
        email: "grace@example.com",
        score: 0,
        aiRemarks: "Interview in progress.",
        status: "Pending",
      },
      {
        id: "C8",
        name: "Henry Wilson",
        email: "henry@example.com",
        score: 0,
        aiRemarks: "Interview scheduled.",
        status: "Pending",
      },
    ],
  },
];

const initialInsights: Insight[] = [
  { metric: "Hiring Velocity", value: "+12%", change: "vs last month", trend: "up" },
  { metric: "Avg. Time to Hire", value: "18 days", change: "-3 days improvement", trend: "up" },
  { metric: "Candidate Quality", value: "8.2/10", change: "AI-scored average", trend: "neutral" },
  { metric: "AI Efficiency", value: "94%", change: "Automation rate", trend: "up" },
];

// LocalStorage keys
const STORAGE_KEYS = {
  JOBS: "companyDashboard.jobs.v1",
  QUESTIONS: "companyDashboard.questions.v1",
  INTERVIEWS: "companyDashboard.interviews.v1",
  INSIGHTS: "companyDashboard.insights.v1",
};

// Helper functions for localStorage operations
function loadFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function saveToStorage<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error("Failed to save to localStorage:", error);
  }
}

// Data access functions with localStorage persistence
export const mockData = {
  // Jobs CRUD
  getJobs: (): Job[] => loadFromStorage(STORAGE_KEYS.JOBS, initialJobs),
  
  getJobById: (id: string): Job | undefined => {
    const jobs = loadFromStorage<Job[]>(STORAGE_KEYS.JOBS, initialJobs);
    return jobs.find((job) => job.id === id);
  },
  
  addJob: (job: Job): void => {
    const jobs = loadFromStorage<Job[]>(STORAGE_KEYS.JOBS, initialJobs);
    jobs.push(job);
    saveToStorage(STORAGE_KEYS.JOBS, jobs);
  },
  
  updateJob: (id: string, updates: Partial<Job>): void => {
    const jobs = loadFromStorage<Job[]>(STORAGE_KEYS.JOBS, initialJobs);
    const index = jobs.findIndex((job) => job.id === id);
    if (index !== -1) {
      jobs[index] = { ...jobs[index], ...updates };
      saveToStorage(STORAGE_KEYS.JOBS, jobs);
    }
  },
  
  deleteJob: (id: string): void => {
    const jobs = loadFromStorage<Job[]>(STORAGE_KEYS.JOBS, initialJobs);
    const filtered = jobs.filter((job) => job.id !== id);
    saveToStorage(STORAGE_KEYS.JOBS, filtered);
  },

  // Questions CRUD
  getQuestions: (): Question[] => loadFromStorage(STORAGE_KEYS.QUESTIONS, initialQuestions),
  
  getQuestionsByJobId: (jobId: string): Question[] => {
    const questions = loadFromStorage<Question[]>(STORAGE_KEYS.QUESTIONS, initialQuestions);
    return questions.filter((q) => q.jobId === jobId);
  },
  
  addQuestion: (question: Question): void => {
    const questions = loadFromStorage<Question[]>(STORAGE_KEYS.QUESTIONS, initialQuestions);
    questions.push(question);
    saveToStorage(STORAGE_KEYS.QUESTIONS, questions);
  },
  
  updateQuestion: (id: string, updates: Partial<Question>): void => {
    const questions = loadFromStorage<Question[]>(STORAGE_KEYS.QUESTIONS, initialQuestions);
    const index = questions.findIndex((q) => q.id === id);
    if (index !== -1) {
      questions[index] = { ...questions[index], ...updates };
      saveToStorage(STORAGE_KEYS.QUESTIONS, questions);
    }
  },
  
  deleteQuestion: (id: string): void => {
    const questions = loadFromStorage<Question[]>(STORAGE_KEYS.QUESTIONS, initialQuestions);
    const filtered = questions.filter((q) => q.id !== id);
    saveToStorage(STORAGE_KEYS.QUESTIONS, filtered);
  },

  // Interviews CRUD
  getInterviews: (): Interview[] => loadFromStorage(STORAGE_KEYS.INTERVIEWS, initialInterviews),
  
  getInterviewById: (id: string): Interview | undefined => {
    const interviews = loadFromStorage<Interview[]>(STORAGE_KEYS.INTERVIEWS, initialInterviews);
    return interviews.find((interview) => interview.id === id);
  },
  
  addInterview: (interview: Interview): void => {
    const interviews = loadFromStorage<Interview[]>(STORAGE_KEYS.INTERVIEWS, initialInterviews);
    interviews.push(interview);
    saveToStorage(STORAGE_KEYS.INTERVIEWS, interviews);
  },
  
  updateInterview: (id: string, updates: Partial<Interview>): void => {
    const interviews = loadFromStorage<Interview[]>(STORAGE_KEYS.INTERVIEWS, initialInterviews);
    const index = interviews.findIndex((interview) => interview.id === id);
    if (index !== -1) {
      interviews[index] = { ...interviews[index], ...updates };
      saveToStorage(STORAGE_KEYS.INTERVIEWS, interviews);
    }
  },

  // Insights
  getInsights: (): Insight[] => loadFromStorage(STORAGE_KEYS.INSIGHTS, initialInsights),
  
  updateInsights: (insights: Insight[]): void => {
    saveToStorage(STORAGE_KEYS.INSIGHTS, insights);
  },

  // Reset all data
  resetAll: (): void => {
    saveToStorage(STORAGE_KEYS.JOBS, initialJobs);
    saveToStorage(STORAGE_KEYS.QUESTIONS, initialQuestions);
    saveToStorage(STORAGE_KEYS.INTERVIEWS, initialInterviews);
    saveToStorage(STORAGE_KEYS.INSIGHTS, initialInsights);
  },
};

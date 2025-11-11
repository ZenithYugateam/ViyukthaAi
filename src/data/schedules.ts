export type InterviewSchedule = {
  id: string;
  candidateName: string;
  candidateEmail: string;
  jobTitle: string;
  interviewType: "AI" | "Technical" | "HR" | "Voice/Video";
  date: string;
  time: string;
  duration: number; // in minutes
  status: "Scheduled" | "Completed" | "Cancelled" | "Rescheduled";
  meetingLink?: string;
  notes?: string;
  interviewer?: string;
};

export const mockSchedules: InterviewSchedule[] = [
  {
    id: "SCH-001",
    candidateName: "Alice Johnson",
    candidateEmail: "alice@example.com",
    jobTitle: "Frontend Engineer",
    interviewType: "Technical",
    date: "2025-11-15",
    time: "10:00",
    duration: 60,
    status: "Scheduled",
    meetingLink: "https://meet.google.com/abc-defg-hij",
    interviewer: "John Doe",
    notes: "Focus on React and TypeScript",
  },
  {
    id: "SCH-002",
    candidateName: "Bob Smith",
    candidateEmail: "bob@example.com",
    jobTitle: "Backend Engineer",
    interviewType: "HR",
    date: "2025-11-15",
    time: "14:00",
    duration: 45,
    status: "Scheduled",
    meetingLink: "https://meet.google.com/xyz-abcd-efg",
    interviewer: "Jane Smith",
    notes: "Cultural fit assessment",
  },
  {
    id: "SCH-003",
    candidateName: "Carol White",
    candidateEmail: "carol@example.com",
    jobTitle: "Frontend Engineer",
    interviewType: "AI",
    date: "2025-11-16",
    time: "11:00",
    duration: 30,
    status: "Scheduled",
    notes: "Automated screening",
  },
  {
    id: "SCH-004",
    candidateName: "David Brown",
    candidateEmail: "david@example.com",
    jobTitle: "Full Stack Developer",
    interviewType: "Voice/Video",
    date: "2025-11-16",
    time: "15:30",
    duration: 90,
    status: "Scheduled",
    meetingLink: "https://zoom.us/j/123456789",
    interviewer: "Sarah Johnson",
    notes: "System design discussion",
  },
  {
    id: "SCH-005",
    candidateName: "Emma Davis",
    candidateEmail: "emma@example.com",
    jobTitle: "UI/UX Designer",
    interviewType: "Technical",
    date: "2025-11-17",
    time: "10:30",
    duration: 60,
    status: "Scheduled",
    meetingLink: "https://meet.google.com/design-review",
    interviewer: "Mike Wilson",
    notes: "Portfolio review and design challenge",
  },
  {
    id: "SCH-006",
    candidateName: "Frank Miller",
    candidateEmail: "frank@example.com",
    jobTitle: "DevOps Engineer",
    interviewType: "Technical",
    date: "2025-11-12",
    time: "09:00",
    duration: 60,
    status: "Completed",
    meetingLink: "https://meet.google.com/devops-int",
    interviewer: "Tom Anderson",
    notes: "Kubernetes and CI/CD",
  },
  {
    id: "SCH-007",
    candidateName: "Grace Lee",
    candidateEmail: "grace@example.com",
    jobTitle: "Product Manager",
    interviewType: "HR",
    date: "2025-11-13",
    time: "13:00",
    duration: 45,
    status: "Cancelled",
    interviewer: "Jane Smith",
    notes: "Candidate requested reschedule",
  },
  {
    id: "SCH-008",
    candidateName: "Henry Taylor",
    candidateEmail: "henry@example.com",
    jobTitle: "Data Scientist",
    interviewType: "Technical",
    date: "2025-11-18",
    time: "14:00",
    duration: 75,
    status: "Scheduled",
    meetingLink: "https://meet.google.com/data-sci",
    interviewer: "Dr. Lisa Chen",
    notes: "ML algorithms and statistics",
  },
];

const STORAGE_KEY = "companyDashboard.schedules.v1";

function loadFromStorage(): InterviewSchedule[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : mockSchedules;
  } catch {
    return mockSchedules;
  }
}

function saveToStorage(schedules: InterviewSchedule[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(schedules));
  } catch (error) {
    console.error("Failed to save schedules:", error);
  }
}

export const scheduleSystem = {
  getAll: (): InterviewSchedule[] => {
    return loadFromStorage();
  },

  getById: (id: string): InterviewSchedule | undefined => {
    const schedules = loadFromStorage();
    return schedules.find((s) => s.id === id);
  },

  getByDate: (date: string): InterviewSchedule[] => {
    const schedules = loadFromStorage();
    return schedules.filter((s) => s.date === date);
  },

  getUpcoming: (): InterviewSchedule[] => {
    const schedules = loadFromStorage();
    const today = new Date().toISOString().split("T")[0];
    return schedules
      .filter((s) => s.date >= today && s.status === "Scheduled")
      .sort((a, b) => {
        const dateCompare = a.date.localeCompare(b.date);
        if (dateCompare !== 0) return dateCompare;
        return a.time.localeCompare(b.time);
      });
  },

  create: (schedule: Omit<InterviewSchedule, "id">): InterviewSchedule => {
    const schedules = loadFromStorage();
    const newSchedule: InterviewSchedule = {
      ...schedule,
      id: `SCH-${Date.now()}`,
    };
    schedules.push(newSchedule);
    saveToStorage(schedules);
    return newSchedule;
  },

  update: (id: string, updates: Partial<InterviewSchedule>): boolean => {
    const schedules = loadFromStorage();
    const index = schedules.findIndex((s) => s.id === id);
    if (index === -1) return false;

    schedules[index] = { ...schedules[index], ...updates };
    saveToStorage(schedules);
    return true;
  },

  delete: (id: string): boolean => {
    const schedules = loadFromStorage();
    const filtered = schedules.filter((s) => s.id !== id);
    if (filtered.length === schedules.length) return false;

    saveToStorage(filtered);
    return true;
  },

  cancel: (id: string): boolean => {
    return scheduleSystem.update(id, { status: "Cancelled" });
  },

  complete: (id: string): boolean => {
    return scheduleSystem.update(id, { status: "Completed" });
  },
};

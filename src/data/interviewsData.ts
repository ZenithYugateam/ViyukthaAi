export type InterviewStatus = "Ongoing" | "Completed" | "Scheduled";

export type Candidate = {
  id: string;
  name: string;
  email: string;
  score: number;
  aiRemarks: string;
  status: "Passed" | "Failed" | "Pending";
};

export type Interview = {
  id: string;
  jobTitle: string;
  candidates: number;
  date: string;
  status: InterviewStatus;
  candidateList: Candidate[];
};

export const interviewsData: Interview[] = [
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
  {
    id: "INT-003",
    jobTitle: "Product Designer",
    candidates: 4,
    date: "2025-11-05",
    status: "Completed",
    candidateList: [
      {
        id: "C9",
        name: "Ivy Martinez",
        email: "ivy@example.com",
        score: 88,
        aiRemarks: "Exceptional design thinking. Portfolio demonstrates strong UX skills.",
        status: "Passed",
      },
      {
        id: "C10",
        name: "Jack Brown",
        email: "jack@example.com",
        score: 65,
        aiRemarks: "Decent portfolio. Needs more experience with user research.",
        status: "Failed",
      },
      {
        id: "C11",
        name: "Kelly Green",
        email: "kelly@example.com",
        score: 92,
        aiRemarks: "Top-tier candidate. Innovative approach and excellent presentation.",
        status: "Passed",
      },
      {
        id: "C12",
        name: "Liam Taylor",
        email: "liam@example.com",
        score: 75,
        aiRemarks: "Good technical skills. Could improve on visual design.",
        status: "Passed",
      },
    ],
  },
  {
    id: "INT-004",
    jobTitle: "Data Analyst",
    candidates: 2,
    date: "2025-11-12",
    status: "Scheduled",
    candidateList: [
      {
        id: "C13",
        name: "Mia Anderson",
        email: "mia@example.com",
        score: 0,
        aiRemarks: "Scheduled for interview.",
        status: "Pending",
      },
      {
        id: "C14",
        name: "Noah Thomas",
        email: "noah@example.com",
        score: 0,
        aiRemarks: "Scheduled for interview.",
        status: "Pending",
      },
    ],
  },
];

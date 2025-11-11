export type QuestionAnalysis = {
  id: string;
  questionText: string;
  questionType: "Text" | "MCQ" | "Code" | "Voice";
  candidateAnswer: string;
  expectedAnswer?: string;
  isCorrect: boolean;
  score: number;
  maxScore: number;
  aiAnalysis: string;
  strengths: string[];
  weaknesses: string[];
  videoTimestamp?: string;
  duration?: string;
};

export type CandidateReport = {
  id: string;
  candidateName: string;
  candidateEmail: string;
  jobTitle: string;
  interviewDate: string;
  interviewDuration: string;
  overallScore: number;
  status: "Pending" | "Selected" | "Rejected" | "On Hold";
  videoUrl?: string;
  thumbnailUrl?: string;
  resumeUrl?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  portfolioUrl?: string;
  
  // Summary metrics
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  partiallyCorrect: number;
  
  // Detailed analysis
  questions: QuestionAnalysis[];
  
  // AI Overall Assessment
  aiSummary: string;
  technicalSkills: {
    skill: string;
    rating: number;
    maxRating: number;
  }[];
  softSkills: {
    skill: string;
    rating: number;
    maxRating: number;
  }[];
  recommendations: string[];
  redFlags: string[];
  
  // Communication analysis
  communicationScore: number;
  confidence: number;
  clarity: number;
  pace: number;
  
  // Sentiment & Behavioral Analysis
  sentimentAnalysis: {
    eyeBlinkCount: number;
    averageBlinkRate: number; // per minute
    headRotations: number;
    lookAwayCount: number;
    timestamps: {
      time: string;
      event: "blink" | "rotation" | "look_away";
      duration?: string;
    }[];
    overallEngagement: number; // 0-100
    nervousness: number; // 0-100
    attentiveness: number; // 0-100
  };
  
  // Similar candidates for recommendations
  similarCandidates?: string[]; // IDs of similar candidates
};

export const mockCandidateReports: CandidateReport[] = [
  {
    id: "RPT-001",
    candidateName: "Alice Johnson",
    candidateEmail: "alice@example.com",
    jobTitle: "Frontend Engineer",
    interviewDate: "2025-11-08",
    interviewDuration: "45 mins",
    overallScore: 85,
    status: "Selected",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    thumbnailUrl: "https://via.placeholder.com/400x225/1E88E5/FFFFFF?text=Alice+Interview",
    resumeUrl: "https://example.com/resume/alice-johnson.pdf",
    linkedinUrl: "https://linkedin.com/in/alicejohnson",
    githubUrl: "https://github.com/alicejohnson",
    portfolioUrl: "https://alicejohnson.dev",
    
    totalQuestions: 10,
    correctAnswers: 7,
    wrongAnswers: 1,
    partiallyCorrect: 2,
    
    questions: [
      {
        id: "Q1",
        questionText: "Explain the concept of React Hooks and their benefits.",
        questionType: "Text",
        candidateAnswer: "React Hooks are functions that let you use state and lifecycle features in functional components. They were introduced in React 16.8. The main benefits include better code reusability, cleaner component logic, and easier testing. Common hooks are useState for state management and useEffect for side effects.",
        isCorrect: true,
        score: 10,
        maxScore: 10,
        aiAnalysis: "Excellent answer demonstrating strong understanding of React Hooks. The candidate correctly identified the purpose, version introduction, and key benefits. Mentioned the most commonly used hooks with accurate descriptions.",
        strengths: ["Clear explanation", "Mentioned version number", "Listed practical benefits"],
        weaknesses: [],
        videoTimestamp: "2:15",
        duration: "3:20",
      },
      {
        id: "Q2",
        questionText: "What is the Virtual DOM and how does React use it?",
        questionType: "MCQ",
        candidateAnswer: "A rendering technique that creates a lightweight copy of the actual DOM",
        expectedAnswer: "A rendering technique that creates a lightweight copy of the actual DOM",
        isCorrect: true,
        score: 10,
        maxScore: 10,
        aiAnalysis: "Correct answer selected. Shows understanding of React's core rendering mechanism.",
        strengths: ["Correct selection"],
        weaknesses: [],
        videoTimestamp: "5:40",
        duration: "1:10",
      },
      {
        id: "Q3",
        questionText: "Write a function to debounce user input in a search bar.",
        questionType: "Code",
        candidateAnswer: `function debounce(func, delay) {
  let timeoutId;
  return function(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
}`,
        isCorrect: true,
        score: 15,
        maxScore: 15,
        aiAnalysis: "Well-implemented debounce function with proper closure usage and timeout management. Code is clean and follows best practices.",
        strengths: ["Correct implementation", "Proper use of closures", "Clean code"],
        weaknesses: [],
        videoTimestamp: "8:30",
        duration: "5:45",
      },
      {
        id: "Q4",
        questionText: "Explain CSS Flexbox and its main properties.",
        questionType: "Text",
        candidateAnswer: "Flexbox is a CSS layout model for arranging items in rows or columns. Main properties include display: flex, justify-content for horizontal alignment, and align-items for vertical alignment.",
        isCorrect: true,
        score: 8,
        maxScore: 10,
        aiAnalysis: "Good answer covering the basics of Flexbox. Could have mentioned flex-direction, flex-wrap, and flex-grow for a more comprehensive response.",
        strengths: ["Correct core concepts", "Mentioned key properties"],
        weaknesses: ["Missing some advanced properties"],
        videoTimestamp: "15:20",
        duration: "2:30",
      },
      {
        id: "Q5",
        questionText: "What is the difference between let, const, and var?",
        questionType: "Text",
        candidateAnswer: "var is function-scoped and can be redeclared. let is block-scoped and cannot be redeclared. const is also block-scoped but cannot be reassigned.",
        isCorrect: true,
        score: 10,
        maxScore: 10,
        aiAnalysis: "Perfect answer covering all three variable declarations with accurate scope and mutability descriptions.",
        strengths: ["Complete comparison", "Accurate technical details"],
        weaknesses: [],
        videoTimestamp: "18:50",
        duration: "2:00",
      },
    ],
    
    aiSummary: "Alice demonstrates strong technical proficiency in React and modern JavaScript. Her answers show deep understanding of core concepts and practical implementation skills. Communication is clear and confident. Highly recommended for the Frontend Engineer position.",
    
    technicalSkills: [
      { skill: "React", rating: 9, maxRating: 10 },
      { skill: "JavaScript", rating: 9, maxRating: 10 },
      { skill: "CSS", rating: 8, maxRating: 10 },
      { skill: "Problem Solving", rating: 9, maxRating: 10 },
      { skill: "Code Quality", rating: 9, maxRating: 10 },
    ],
    
    softSkills: [
      { skill: "Communication", rating: 9, maxRating: 10 },
      { skill: "Confidence", rating: 8, maxRating: 10 },
      { skill: "Clarity", rating: 9, maxRating: 10 },
      { skill: "Professionalism", rating: 9, maxRating: 10 },
    ],
    
    recommendations: [
      "Strong candidate with excellent technical skills",
      "Clear communicator with good problem-solving abilities",
      "Would be a great addition to the frontend team",
      "Consider for senior-level positions in the future",
    ],
    
    redFlags: [],
    
    communicationScore: 88,
    confidence: 85,
    clarity: 90,
    pace: 88,
    
    sentimentAnalysis: {
      eyeBlinkCount: 142,
      averageBlinkRate: 18,
      headRotations: 8,
      lookAwayCount: 3,
      timestamps: [
        { time: "2:15", event: "blink" },
        { time: "5:40", event: "rotation", duration: "2s" },
        { time: "8:30", event: "look_away", duration: "3s" },
        { time: "15:20", event: "blink" },
        { time: "18:50", event: "rotation", duration: "1s" },
      ],
      overallEngagement: 92,
      nervousness: 15,
      attentiveness: 95,
    },
    
    similarCandidates: ["RPT-004", "RPT-005"],
  },
  {
    id: "RPT-002",
    candidateName: "Bob Smith",
    candidateEmail: "bob@example.com",
    jobTitle: "Backend Engineer",
    interviewDate: "2025-11-09",
    interviewDuration: "50 mins",
    overallScore: 72,
    status: "On Hold",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    thumbnailUrl: "https://via.placeholder.com/400x225/F9A826/FFFFFF?text=Bob+Interview",
    resumeUrl: "https://example.com/resume/bob-smith.pdf",
    linkedinUrl: "https://linkedin.com/in/bobsmith",
    
    totalQuestions: 8,
    correctAnswers: 5,
    wrongAnswers: 2,
    partiallyCorrect: 1,
    
    questions: [
      {
        id: "Q1",
        questionText: "Explain the difference between SQL and NoSQL databases.",
        questionType: "Text",
        candidateAnswer: "SQL databases use structured tables with predefined schemas. NoSQL databases are more flexible and can store unstructured data. SQL is good for complex queries, NoSQL is better for scalability.",
        isCorrect: true,
        score: 8,
        maxScore: 10,
        aiAnalysis: "Good fundamental understanding. Answer covers key differences but lacks specific examples and use cases.",
        strengths: ["Correct core concepts", "Mentioned scalability"],
        weaknesses: ["Could provide specific examples", "Missing ACID vs BASE discussion"],
        videoTimestamp: "1:30",
        duration: "2:45",
      },
      {
        id: "Q2",
        questionText: "What is REST API and its principles?",
        questionType: "Text",
        candidateAnswer: "REST is an architectural style for APIs. It uses HTTP methods like GET, POST, PUT, DELETE. APIs should be stateless.",
        isCorrect: true,
        score: 7,
        maxScore: 10,
        aiAnalysis: "Basic understanding demonstrated. Missing important REST principles like resource-based URLs, uniform interface, and cacheability.",
        strengths: ["Mentioned HTTP methods", "Understood statelessness"],
        weaknesses: ["Incomplete list of principles", "No mention of resource-based design"],
        videoTimestamp: "5:00",
        duration: "2:10",
      },
      {
        id: "Q3",
        questionText: "Implement rate limiting for an API endpoint.",
        questionType: "Code",
        candidateAnswer: `const rateLimit = {};
function checkRateLimit(userId) {
  if (!rateLimit[userId]) {
    rateLimit[userId] = 1;
    return true;
  }
  if (rateLimit[userId] < 100) {
    rateLimit[userId]++;
    return true;
  }
  return false;
}`,
        isCorrect: false,
        score: 5,
        maxScore: 15,
        aiAnalysis: "Implementation shows basic logic but lacks time-window management. Rate limit never resets, making it ineffective. Missing sliding window or token bucket algorithm.",
        strengths: ["Basic counter logic"],
        weaknesses: ["No time window", "No reset mechanism", "Not production-ready"],
        videoTimestamp: "10:30",
        duration: "6:20",
      },
    ],
    
    aiSummary: "Bob shows decent understanding of backend concepts but lacks depth in some areas. Implementation skills need improvement, particularly in production-ready code. Communication is adequate but could be more structured. Recommend additional technical assessment or consider for junior position.",
    
    technicalSkills: [
      { skill: "Database Design", rating: 7, maxRating: 10 },
      { skill: "API Development", rating: 6, maxRating: 10 },
      { skill: "System Design", rating: 6, maxRating: 10 },
      { skill: "Problem Solving", rating: 7, maxRating: 10 },
      { skill: "Code Quality", rating: 6, maxRating: 10 },
    ],
    
    softSkills: [
      { skill: "Communication", rating: 7, maxRating: 10 },
      { skill: "Confidence", rating: 6, maxRating: 10 },
      { skill: "Clarity", rating: 7, maxRating: 10 },
      { skill: "Professionalism", rating: 8, maxRating: 10 },
    ],
    
    recommendations: [
      "Consider for junior backend position",
      "Needs mentorship in production-ready code practices",
      "Good cultural fit with professional demeanor",
    ],
    
    redFlags: [
      "Incomplete understanding of rate limiting",
      "Lacks production experience indicators",
    ],
    
    communicationScore: 70,
    confidence: 65,
    clarity: 72,
    pace: 75,
    
    sentimentAnalysis: {
      eyeBlinkCount: 245,
      averageBlinkRate: 28,
      headRotations: 15,
      lookAwayCount: 12,
      timestamps: [
        { time: "1:30", event: "blink" },
        { time: "5:00", event: "look_away", duration: "5s" },
        { time: "10:30", event: "rotation", duration: "3s" },
      ],
      overallEngagement: 68,
      nervousness: 45,
      attentiveness: 72,
    },
    
    similarCandidates: ["RPT-003"],
  },
  {
    id: "RPT-003",
    candidateName: "Carol White",
    candidateEmail: "carol@example.com",
    jobTitle: "Frontend Engineer",
    interviewDate: "2025-11-10",
    interviewDuration: "40 mins",
    overallScore: 58,
    status: "Rejected",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    thumbnailUrl: "https://via.placeholder.com/400x225/EF4444/FFFFFF?text=Carol+Interview",
    resumeUrl: "https://example.com/resume/carol-white.pdf",
    
    totalQuestions: 10,
    correctAnswers: 4,
    wrongAnswers: 5,
    partiallyCorrect: 1,
    
    questions: [
      {
        id: "Q1",
        questionText: "Explain React component lifecycle methods.",
        questionType: "Text",
        candidateAnswer: "Components have methods like componentDidMount and componentWillUnmount. They run at different times.",
        isCorrect: false,
        score: 3,
        maxScore: 10,
        aiAnalysis: "Very basic answer lacking depth. Only mentioned two lifecycle methods without explaining their purpose or when they're called. Missing discussion of modern hooks alternative.",
        strengths: ["Mentioned two valid methods"],
        weaknesses: ["Incomplete explanation", "No context provided", "Missing other important methods"],
        videoTimestamp: "1:00",
        duration: "1:30",
      },
      {
        id: "Q2",
        questionText: "What is closure in JavaScript?",
        questionType: "Text",
        candidateAnswer: "A closure is when a function remembers variables from outside.",
        isCorrect: false,
        score: 4,
        maxScore: 10,
        aiAnalysis: "Oversimplified answer. Lacks technical accuracy and practical examples. Doesn't explain lexical scoping or use cases.",
        strengths: ["Basic concept mentioned"],
        weaknesses: ["Too vague", "No examples", "Missing technical details"],
        videoTimestamp: "3:20",
        duration: "1:00",
      },
    ],
    
    aiSummary: "Carol demonstrates insufficient technical knowledge for the Frontend Engineer role. Answers lack depth and show gaps in fundamental concepts. Communication is hesitant. Not recommended for this position at this time.",
    
    technicalSkills: [
      { skill: "React", rating: 5, maxRating: 10 },
      { skill: "JavaScript", rating: 5, maxRating: 10 },
      { skill: "CSS", rating: 6, maxRating: 10 },
      { skill: "Problem Solving", rating: 5, maxRating: 10 },
      { skill: "Code Quality", rating: 4, maxRating: 10 },
    ],
    
    softSkills: [
      { skill: "Communication", rating: 5, maxRating: 10 },
      { skill: "Confidence", rating: 4, maxRating: 10 },
      { skill: "Clarity", rating: 5, maxRating: 10 },
      { skill: "Professionalism", rating: 7, maxRating: 10 },
    ],
    
    recommendations: [
      "Needs significant skill development before reapplying",
      "Consider entry-level or internship positions",
    ],
    
    redFlags: [
      "Insufficient technical knowledge",
      "Lack of depth in answers",
      "Hesitant communication",
    ],
    
    communicationScore: 52,
    confidence: 45,
    clarity: 55,
    pace: 60,
    
    sentimentAnalysis: {
      eyeBlinkCount: 312,
      averageBlinkRate: 35,
      headRotations: 22,
      lookAwayCount: 18,
      timestamps: [
        { time: "1:00", event: "look_away", duration: "8s" },
        { time: "3:20", event: "blink" },
        { time: "5:10", event: "rotation", duration: "4s" },
      ],
      overallEngagement: 48,
      nervousness: 72,
      attentiveness: 55,
    },
    
    similarCandidates: [],
  },
];

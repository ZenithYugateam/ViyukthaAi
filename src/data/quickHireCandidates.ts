export type Candidate = {
  id: string;
  name: string;
  title: string;
  location: string;
  avatar: string;
  experience: string;
  expectedSalary: string;
  availability: "Immediate" | "2 Weeks" | "1 Month" | "Negotiable";
  
  // Skills
  skills: string[];
  primarySkills: string[];
  
  // Profile
  bio: string;
  email: string;
  phone: string;
  linkedin?: string;
  github?: string;
  portfolio?: string;
  
  // Experience details
  currentCompany?: string;
  previousCompanies: string[];
  totalExperience: number; // in years
  
  // Education
  education: {
    degree: string;
    institution: string;
    year: string;
  }[];
  
  // Ratings
  overallRating: number;
  technicalRating: number;
  communicationRating: number;
  
  // Preferences
  preferredRoles: string[];
  workMode: ("Remote" | "Hybrid" | "On-site")[];
  
  // Status
  isVerified: boolean;
  isAvailable: boolean;
  lastActive: string;
  
  // Projects
  projects: {
    name: string;
    description: string;
    technologies: string[];
    link?: string;
  }[];
  
  // Certifications
  certifications: string[];
};

export const mockCandidates: Candidate[] = [
  {
    id: "CAND-001",
    name: "Priya Sharma",
    title: "Senior Frontend Developer",
    location: "Bangalore, India",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya",
    experience: "5 years",
    expectedSalary: "₹15-20 LPA",
    availability: "2 Weeks",
    
    skills: ["React", "TypeScript", "Next.js", "Tailwind CSS", "Redux", "GraphQL", "Jest", "Webpack", "Git", "Figma"],
    primarySkills: ["React", "TypeScript", "Next.js"],
    
    bio: "Passionate frontend developer with 5 years of experience building scalable web applications. Specialized in React ecosystem and modern JavaScript. Love creating pixel-perfect, performant user interfaces.",
    email: "priya.sharma@example.com",
    phone: "+91 98765 43210",
    linkedin: "linkedin.com/in/priyasharma",
    github: "github.com/priyasharma",
    portfolio: "priyasharma.dev",
    
    currentCompany: "Tech Innovations Pvt Ltd",
    previousCompanies: ["Startup XYZ", "Digital Solutions Inc"],
    totalExperience: 5,
    
    education: [
      {
        degree: "B.Tech in Computer Science",
        institution: "IIT Delhi",
        year: "2019",
      },
    ],
    
    overallRating: 4.8,
    technicalRating: 4.9,
    communicationRating: 4.7,
    
    preferredRoles: ["Frontend Developer", "Full Stack Developer", "React Developer"],
    workMode: ["Remote", "Hybrid"],
    
    isVerified: true,
    isAvailable: true,
    lastActive: "2 hours ago",
    
    projects: [
      {
        name: "E-commerce Platform",
        description: "Built a full-featured e-commerce platform with React, Next.js, and Stripe integration",
        technologies: ["React", "Next.js", "TypeScript", "Stripe", "Tailwind CSS"],
        link: "github.com/priyasharma/ecommerce",
      },
      {
        name: "Task Management App",
        description: "Real-time collaborative task management application",
        technologies: ["React", "Firebase", "Material-UI"],
        link: "taskapp.priyasharma.dev",
      },
    ],
    
    certifications: ["AWS Certified Developer", "React Advanced Certification"],
  },
  {
    id: "CAND-002",
    name: "Rahul Verma",
    title: "Backend Engineer",
    location: "Mumbai, India",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul",
    experience: "4 years",
    expectedSalary: "₹12-18 LPA",
    availability: "Immediate",
    
    skills: ["Node.js", "Python", "MongoDB", "PostgreSQL", "Redis", "Docker", "Kubernetes", "AWS", "Express", "FastAPI"],
    primarySkills: ["Node.js", "Python", "MongoDB"],
    
    bio: "Backend engineer with expertise in building scalable microservices and RESTful APIs. Strong experience with cloud infrastructure and DevOps practices.",
    email: "rahul.verma@example.com",
    phone: "+91 98765 43211",
    linkedin: "linkedin.com/in/rahulverma",
    github: "github.com/rahulverma",
    
    currentCompany: "CloudTech Solutions",
    previousCompanies: ["DataSystems Ltd", "API Services Inc"],
    totalExperience: 4,
    
    education: [
      {
        degree: "B.E. in Information Technology",
        institution: "Mumbai University",
        year: "2020",
      },
    ],
    
    overallRating: 4.6,
    technicalRating: 4.8,
    communicationRating: 4.4,
    
    preferredRoles: ["Backend Developer", "DevOps Engineer", "Full Stack Developer"],
    workMode: ["Remote", "Hybrid", "On-site"],
    
    isVerified: true,
    isAvailable: true,
    lastActive: "1 hour ago",
    
    projects: [
      {
        name: "Microservices Architecture",
        description: "Designed and implemented microservices architecture for a fintech platform",
        technologies: ["Node.js", "Docker", "Kubernetes", "MongoDB", "Redis"],
      },
      {
        name: "Real-time Analytics API",
        description: "Built high-performance analytics API handling 10k+ requests/sec",
        technologies: ["Python", "FastAPI", "PostgreSQL", "Redis"],
      },
    ],
    
    certifications: ["AWS Solutions Architect", "Kubernetes Administrator"],
  },
  {
    id: "CAND-003",
    name: "Ananya Patel",
    title: "UI/UX Designer",
    location: "Pune, India",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ananya",
    experience: "3 years",
    expectedSalary: "₹10-15 LPA",
    availability: "1 Month",
    
    skills: ["Figma", "Adobe XD", "Sketch", "Prototyping", "User Research", "Wireframing", "HTML", "CSS", "Design Systems"],
    primarySkills: ["Figma", "UI Design", "UX Research"],
    
    bio: "Creative UI/UX designer passionate about creating intuitive and beautiful user experiences. Experienced in design thinking and user-centered design methodologies.",
    email: "ananya.patel@example.com",
    phone: "+91 98765 43212",
    linkedin: "linkedin.com/in/ananyapatel",
    portfolio: "ananyapatel.design",
    
    currentCompany: "Design Studio Pro",
    previousCompanies: ["Creative Agency", "Startup Design Lab"],
    totalExperience: 3,
    
    education: [
      {
        degree: "B.Des in Communication Design",
        institution: "NID Ahmedabad",
        year: "2021",
      },
    ],
    
    overallRating: 4.7,
    technicalRating: 4.6,
    communicationRating: 4.9,
    
    preferredRoles: ["UI/UX Designer", "Product Designer", "Visual Designer"],
    workMode: ["Remote", "Hybrid"],
    
    isVerified: true,
    isAvailable: true,
    lastActive: "3 hours ago",
    
    projects: [
      {
        name: "Banking App Redesign",
        description: "Complete redesign of mobile banking application improving user satisfaction by 40%",
        technologies: ["Figma", "Prototyping", "User Testing"],
        link: "behance.net/ananyapatel/banking-app",
      },
      {
        name: "Design System",
        description: "Created comprehensive design system for SaaS product",
        technologies: ["Figma", "Design Tokens", "Component Library"],
      },
    ],
    
    certifications: ["Google UX Design Certificate", "Interaction Design Foundation"],
  },
  {
    id: "CAND-004",
    name: "Arjun Singh",
    title: "Full Stack Developer",
    location: "Delhi, India",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Arjun",
    experience: "6 years",
    expectedSalary: "₹18-25 LPA",
    availability: "Negotiable",
    
    skills: ["React", "Node.js", "TypeScript", "PostgreSQL", "AWS", "Docker", "GraphQL", "Next.js", "Express", "MongoDB"],
    primarySkills: ["React", "Node.js", "TypeScript"],
    
    bio: "Experienced full stack developer with a track record of delivering complex web applications. Strong problem-solving skills and passion for clean code.",
    email: "arjun.singh@example.com",
    phone: "+91 98765 43213",
    linkedin: "linkedin.com/in/arjunsingh",
    github: "github.com/arjunsingh",
    portfolio: "arjunsingh.tech",
    
    currentCompany: "Enterprise Solutions Ltd",
    previousCompanies: ["Tech Giants Inc", "Innovation Labs", "Startup Hub"],
    totalExperience: 6,
    
    education: [
      {
        degree: "M.Tech in Computer Science",
        institution: "IIT Bombay",
        year: "2018",
      },
    ],
    
    overallRating: 4.9,
    technicalRating: 5.0,
    communicationRating: 4.8,
    
    preferredRoles: ["Full Stack Developer", "Tech Lead", "Senior Developer"],
    workMode: ["Remote", "Hybrid"],
    
    isVerified: true,
    isAvailable: true,
    lastActive: "30 minutes ago",
    
    projects: [
      {
        name: "Enterprise CRM",
        description: "Led development of enterprise CRM system serving 50k+ users",
        technologies: ["React", "Node.js", "PostgreSQL", "AWS", "Docker"],
      },
      {
        name: "Real-time Collaboration Tool",
        description: "Built real-time collaboration platform with WebSocket integration",
        technologies: ["Next.js", "Socket.io", "Redis", "MongoDB"],
        link: "github.com/arjunsingh/collab-tool",
      },
    ],
    
    certifications: ["AWS Certified Solutions Architect", "MongoDB Professional"],
  },
  {
    id: "CAND-005",
    name: "Sneha Reddy",
    title: "Data Scientist",
    location: "Hyderabad, India",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sneha",
    experience: "4 years",
    expectedSalary: "₹15-22 LPA",
    availability: "2 Weeks",
    
    skills: ["Python", "Machine Learning", "TensorFlow", "PyTorch", "SQL", "Pandas", "NumPy", "Scikit-learn", "Data Visualization", "Statistics"],
    primarySkills: ["Python", "Machine Learning", "Data Analysis"],
    
    bio: "Data scientist with strong background in machine learning and statistical analysis. Experienced in building predictive models and deriving actionable insights from data.",
    email: "sneha.reddy@example.com",
    phone: "+91 98765 43214",
    linkedin: "linkedin.com/in/snehareddy",
    github: "github.com/snehareddy",
    
    currentCompany: "AI Research Labs",
    previousCompanies: ["Data Analytics Corp", "ML Solutions"],
    totalExperience: 4,
    
    education: [
      {
        degree: "M.Sc. in Data Science",
        institution: "IIIT Hyderabad",
        year: "2020",
      },
    ],
    
    overallRating: 4.7,
    technicalRating: 4.9,
    communicationRating: 4.5,
    
    preferredRoles: ["Data Scientist", "ML Engineer", "Data Analyst"],
    workMode: ["Remote", "Hybrid"],
    
    isVerified: true,
    isAvailable: true,
    lastActive: "1 hour ago",
    
    projects: [
      {
        name: "Predictive Analytics Model",
        description: "Developed ML model for customer churn prediction with 92% accuracy",
        technologies: ["Python", "TensorFlow", "Pandas", "Scikit-learn"],
      },
      {
        name: "NLP Sentiment Analysis",
        description: "Built sentiment analysis system for social media monitoring",
        technologies: ["Python", "NLTK", "PyTorch", "FastAPI"],
      },
    ],
    
    certifications: ["Google Data Analytics", "Deep Learning Specialization"],
  },
  {
    id: "CAND-006",
    name: "Vikram Malhotra",
    title: "DevOps Engineer",
    location: "Bangalore, India",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Vikram",
    experience: "5 years",
    expectedSalary: "₹16-23 LPA",
    availability: "Immediate",
    
    skills: ["AWS", "Docker", "Kubernetes", "Jenkins", "Terraform", "Ansible", "Linux", "Python", "Bash", "CI/CD"],
    primarySkills: ["AWS", "Kubernetes", "Docker"],
    
    bio: "DevOps engineer specialized in cloud infrastructure and automation. Passionate about building reliable and scalable systems.",
    email: "vikram.malhotra@example.com",
    phone: "+91 98765 43215",
    linkedin: "linkedin.com/in/vikrammalhotra",
    github: "github.com/vikrammalhotra",
    
    currentCompany: "Cloud Infrastructure Inc",
    previousCompanies: ["DevOps Solutions", "Tech Infrastructure Ltd"],
    totalExperience: 5,
    
    education: [
      {
        degree: "B.Tech in Electronics",
        institution: "NIT Trichy",
        year: "2019",
      },
    ],
    
    overallRating: 4.8,
    technicalRating: 4.9,
    communicationRating: 4.7,
    
    preferredRoles: ["DevOps Engineer", "Cloud Engineer", "SRE"],
    workMode: ["Remote", "Hybrid", "On-site"],
    
    isVerified: true,
    isAvailable: true,
    lastActive: "2 hours ago",
    
    projects: [
      {
        name: "CI/CD Pipeline",
        description: "Implemented automated CI/CD pipeline reducing deployment time by 70%",
        technologies: ["Jenkins", "Docker", "Kubernetes", "AWS"],
      },
      {
        name: "Infrastructure as Code",
        description: "Migrated infrastructure to IaC using Terraform",
        technologies: ["Terraform", "AWS", "Ansible"],
      },
    ],
    
    certifications: ["AWS DevOps Engineer", "Certified Kubernetes Administrator"],
  },
  {
    id: "CAND-007",
    name: "Meera Krishnan",
    title: "Mobile App Developer",
    location: "Chennai, India",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Meera",
    experience: "3 years",
    expectedSalary: "₹10-16 LPA",
    availability: "1 Month",
    
    skills: ["React Native", "Flutter", "iOS", "Android", "JavaScript", "Dart", "Firebase", "Redux", "Git"],
    primarySkills: ["React Native", "Flutter", "Mobile Development"],
    
    bio: "Mobile app developer with expertise in cross-platform development. Created multiple apps with millions of downloads.",
    email: "meera.krishnan@example.com",
    phone: "+91 98765 43216",
    linkedin: "linkedin.com/in/meerakrishnan",
    github: "github.com/meerakrishnan",
    portfolio: "meerakrishnan.app",
    
    currentCompany: "Mobile First Technologies",
    previousCompanies: ["App Development Studio", "Mobile Solutions"],
    totalExperience: 3,
    
    education: [
      {
        degree: "B.E. in Computer Science",
        institution: "Anna University",
        year: "2021",
      },
    ],
    
    overallRating: 4.6,
    technicalRating: 4.7,
    communicationRating: 4.5,
    
    preferredRoles: ["Mobile Developer", "React Native Developer", "Flutter Developer"],
    workMode: ["Remote", "Hybrid"],
    
    isVerified: true,
    isAvailable: true,
    lastActive: "4 hours ago",
    
    projects: [
      {
        name: "Fitness Tracking App",
        description: "Built fitness app with 500k+ downloads on Play Store",
        technologies: ["React Native", "Firebase", "Redux"],
        link: "play.google.com/store/apps/fitness-tracker",
      },
      {
        name: "E-learning Platform",
        description: "Cross-platform e-learning app with video streaming",
        technologies: ["Flutter", "Dart", "Firebase"],
      },
    ],
    
    certifications: ["Google Associate Android Developer"],
  },
  {
    id: "CAND-008",
    name: "Karthik Iyer",
    title: "Product Manager",
    location: "Bangalore, India",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Karthik",
    experience: "7 years",
    expectedSalary: "₹25-35 LPA",
    availability: "Negotiable",
    
    skills: ["Product Strategy", "Agile", "Scrum", "User Research", "Data Analysis", "Roadmapping", "Stakeholder Management", "SQL", "Analytics"],
    primarySkills: ["Product Management", "Strategy", "Agile"],
    
    bio: "Experienced product manager with a track record of launching successful products. Strong analytical and leadership skills.",
    email: "karthik.iyer@example.com",
    phone: "+91 98765 43217",
    linkedin: "linkedin.com/in/karthikiyer",
    
    currentCompany: "Product Innovation Labs",
    previousCompanies: ["Tech Products Inc", "Startup Ventures", "Enterprise Solutions"],
    totalExperience: 7,
    
    education: [
      {
        degree: "MBA",
        institution: "IIM Bangalore",
        year: "2017",
      },
      {
        degree: "B.Tech in Computer Science",
        institution: "VIT Vellore",
        year: "2015",
      },
    ],
    
    overallRating: 4.9,
    technicalRating: 4.5,
    communicationRating: 5.0,
    
    preferredRoles: ["Product Manager", "Senior Product Manager", "Product Lead"],
    workMode: ["Hybrid", "On-site"],
    
    isVerified: true,
    isAvailable: true,
    lastActive: "1 hour ago",
    
    projects: [
      {
        name: "SaaS Platform Launch",
        description: "Led launch of B2B SaaS platform generating $5M ARR in first year",
        technologies: ["Product Strategy", "Market Research", "Analytics"],
      },
      {
        name: "Mobile App Revamp",
        description: "Managed complete redesign increasing user engagement by 60%",
        technologies: ["User Research", "A/B Testing", "Analytics"],
      },
    ],
    
    certifications: ["Certified Scrum Product Owner", "Product Management Certificate"],
  },
];

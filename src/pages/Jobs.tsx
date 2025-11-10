import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Pagination } from "@/components/Pagination";
import { Search, MapPin, Briefcase, Clock, Bookmark, X, ChevronDown, Home, Wallet } from "lucide-react";
import { cn } from "@/lib/utils";

const jobListings = [
  {
    id: 1,
    title: "Senior UI/UX Designer",
    company: "Adobe",
    logo: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=100&h=100&fit=crop",
    location: "Onsite / LA",
    type: "Full-time",
    salary: "$10k-13k",
    posted: "2 hour ago",
    tags: ["Figma", "Design Systems", "Prototyping", "User Research"],
    description: "At Adobe, creativity meets innovation! We're searching for experienced UI/UX Designers passionate about crafting delightful design systems and improving user journeys.",
    experience: "3y+",
    matchScore: 95,
    matchLevel: "HIGH MATCH",
    workMode: "Onsite",
    applicants: 24,
  },
  {
    id: 2,
    title: "UI/UX Designer",
    company: "Facebook",
    logo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=100&h=100&fit=crop",
    location: "Remote / UK",
    type: "Full-time",
    salary: "$8k-12k",
    posted: "1 hour ago",
    tags: ["Sketch", "Prototyping", "Wireframing", "User Testing"],
    description: "Join Facebook's Design Team and help shape the future of digital connection! We're looking for UI/UX Designers passionate about creating user-centered experiences.",
    experience: "2y+",
    matchScore: 75,
    matchLevel: "MEDIUM MATCH",
    workMode: "Remote",
    applicants: 42,
  },
  {
    id: 3,
    title: "Digital Product Designer",
    company: "Mc donalds",
    logo: "https://images.unsplash.com/photo-1572044162444-ad60f128bdea?w=100&h=100&fit=crop",
    location: "Remote / UK",
    type: "Part-time",
    salary: "$12k-15k",
    posted: "1 hour ago",
    tags: ["Product Design", "Mobile", "UI Design", "Design Thinking"],
    description: "Join McDonald's Global Digital Team! We're seeking a creative Digital Product Designer to help craft user-friendly digital ordering experiences.",
    experience: "1y+",
    matchScore: 88,
    matchLevel: "HIGH MATCH",
    workMode: "Hybrid",
    applicants: 18,
  },
  {
    id: 4,
    title: "React Js Developer",
    company: "Tech Solutions Inc",
    logo: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=100&h=100&fit=crop",
    location: "Visakhapatnam",
    type: "Full-time",
    salary: "$5k-7k",
    posted: "2 days ago",
    tags: ["Canvas API", "React", "state management", "code testing"],
    description: "Join our team to build modern web applications with React",
    experience: "1-2 years",
    matchScore: 25,
    matchLevel: "LOW MATCH",
    workMode: "Onsite",
    applicants: 18,
  },
  {
    id: 5,
    title: "Frontend Developer",
    company: "Google",
    logo: "https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?w=100&h=100&fit=crop",
    location: "Remote / US",
    type: "Full-time",
    salary: "$15k-20k",
    posted: "3 hours ago",
    tags: ["React", "TypeScript", "CSS", "JavaScript"],
    description: "Build the next generation of Google's web applications",
    experience: "3-5 years",
    matchScore: 92,
    matchLevel: "HIGH MATCH",
    workMode: "Remote",
    applicants: 67,
  },
  {
    id: 6,
    title: "Product Designer",
    company: "Apple",
    logo: "https://images.unsplash.com/photo-1621768216002-5ac171876625?w=100&h=100&fit=crop",
    location: "Onsite / CA",
    type: "Full-time",
    salary: "$18k-25k",
    posted: "5 hours ago",
    tags: ["Sketch", "Figma", "Product Strategy", "iOS Design"],
    description: "Design innovative products that change people's lives",
    experience: "5y+",
    matchScore: 89,
    matchLevel: "HIGH MATCH",
    workMode: "Onsite",
    applicants: 103,
  },
  {
    id: 7,
    title: "UX Researcher",
    company: "Microsoft",
    logo: "https://images.unsplash.com/photo-1633409361618-c73427e4e206?w=100&h=100&fit=crop",
    location: "Hybrid / NY",
    type: "Full-time",
    salary: "$12k-16k",
    posted: "1 day ago",
    tags: ["User Research", "Data Analysis", "Surveys", "Testing"],
    description: "Help shape Microsoft products through user research",
    experience: "2-4 years",
    matchScore: 78,
    matchLevel: "MEDIUM MATCH",
    workMode: "Hybrid",
    applicants: 45,
  },
  {
    id: 8,
    title: "Mobile App Designer",
    company: "Spotify",
    logo: "https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=100&h=100&fit=crop",
    location: "Remote / EU",
    type: "Full-time",
    salary: "$11k-14k",
    posted: "6 hours ago",
    tags: ["Mobile Design", "iOS", "Android", "Prototyping"],
    description: "Design beautiful music experiences for millions",
    experience: "2-3 years",
    matchScore: 85,
    matchLevel: "HIGH MATCH",
    workMode: "Remote",
    applicants: 56,
  },
  {
    id: 9,
    title: "Full Stack Developer",
    company: "Netflix",
    logo: "https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=100&h=100&fit=crop",
    location: "Onsite / CA",
    type: "Full-time",
    salary: "$16k-22k",
    posted: "2 days ago",
    tags: ["Node.js", "React", "MongoDB", "AWS"],
    description: "Build streaming technology at scale",
    experience: "4-6 years",
    matchScore: 71,
    matchLevel: "MEDIUM MATCH",
    workMode: "Onsite",
    applicants: 89,
  },
  {
    id: 10,
    title: "Visual Designer",
    company: "Airbnb",
    logo: "https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=100&h=100&fit=crop",
    location: "Remote / Worldwide",
    type: "Full-time",
    salary: "$13k-17k",
    posted: "4 hours ago",
    tags: ["Visual Design", "Branding", "Illustration", "Motion"],
    description: "Create stunning visuals for travel experiences",
    experience: "3-4 years",
    matchScore: 87,
    matchLevel: "HIGH MATCH",
    workMode: "Remote",
    applicants: 72,
  },
  {
    id: 11,
    title: "Backend Developer",
    company: "Amazon",
    logo: "https://images.unsplash.com/photo-1523474253046-8cd2748b5fd2?w=100&h=100&fit=crop",
    location: "Onsite / Seattle",
    type: "Full-time",
    salary: "$14k-19k",
    posted: "1 day ago",
    tags: ["Java", "Python", "Microservices", "Docker"],
    description: "Build scalable backend systems for e-commerce",
    experience: "3-5 years",
    matchScore: 68,
    matchLevel: "MEDIUM MATCH",
    workMode: "Onsite",
    applicants: 94,
  },
  {
    id: 12,
    title: "Interaction Designer",
    company: "Tesla",
    logo: "https://images.unsplash.com/photo-1560807707-8cc77767d783?w=100&h=100&fit=crop",
    location: "Onsite / TX",
    type: "Full-time",
    salary: "$15k-20k",
    posted: "3 days ago",
    tags: ["Interaction Design", "Animation", "Prototyping", "AR/VR"],
    description: "Design innovative vehicle interfaces",
    experience: "4y+",
    matchScore: 82,
    matchLevel: "HIGH MATCH",
    workMode: "Onsite",
    applicants: 61,
  },
  {
    id: 13,
    title: "UI Designer",
    company: "Figma",
    logo: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=100&h=100&fit=crop",
    location: "Remote / US",
    type: "Full-time",
    salary: "$12k-15k",
    posted: "5 hours ago",
    tags: ["UI Design", "Design Systems", "Figma", "Web Design"],
    description: "Design the future of collaborative design tools",
    experience: "2-4 years",
    matchScore: 91,
    matchLevel: "HIGH MATCH",
    workMode: "Remote",
    applicants: 112,
  },
  {
    id: 14,
    title: "DevOps Engineer",
    company: "IBM",
    logo: "https://images.unsplash.com/photo-1526948531399-320e7e40f0ca?w=100&h=100&fit=crop",
    location: "Hybrid / NY",
    type: "Full-time",
    salary: "$13k-18k",
    posted: "2 days ago",
    tags: ["Docker", "Kubernetes", "CI/CD", "Jenkins"],
    description: "Manage cloud infrastructure and deployment",
    experience: "3-5 years",
    matchScore: 62,
    matchLevel: "MEDIUM MATCH",
    workMode: "Hybrid",
    applicants: 38,
  },
  {
    id: 15,
    title: "Product Manager",
    company: "Slack",
    logo: "https://images.unsplash.com/photo-1622547748225-3fc4abd2cca0?w=100&h=100&fit=crop",
    location: "Remote / US",
    type: "Full-time",
    salary: "$16k-21k",
    posted: "1 day ago",
    tags: ["Product Management", "Strategy", "Analytics", "Leadership"],
    description: "Lead product development for communication tools",
    experience: "5y+",
    matchScore: 55,
    matchLevel: "MEDIUM MATCH",
    workMode: "Remote",
    applicants: 87,
  },
  {
    id: 16,
    title: "Motion Designer",
    company: "Adobe",
    logo: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=100&h=100&fit=crop",
    location: "Onsite / LA",
    type: "Contract",
    salary: "$10k-14k",
    posted: "4 hours ago",
    tags: ["After Effects", "Motion Graphics", "Animation", "Video"],
    description: "Create stunning motion graphics and animations",
    experience: "2-3 years",
    matchScore: 79,
    matchLevel: "MEDIUM MATCH",
    workMode: "Onsite",
    applicants: 43,
  },
  {
    id: 17,
    title: "Data Scientist",
    company: "Meta",
    logo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=100&h=100&fit=crop",
    location: "Remote / Worldwide",
    type: "Full-time",
    salary: "$17k-23k",
    posted: "6 hours ago",
    tags: ["Python", "Machine Learning", "SQL", "Data Analysis"],
    description: "Analyze data to drive product decisions",
    experience: "4-6 years",
    matchScore: 48,
    matchLevel: "LOW MATCH",
    workMode: "Remote",
    applicants: 156,
  },
  {
    id: 18,
    title: "Brand Designer",
    company: "Nike",
    logo: "https://images.unsplash.com/photo-1556906781-9a412961c28c?w=100&h=100&fit=crop",
    location: "Onsite / OR",
    type: "Full-time",
    salary: "$11k-15k",
    posted: "1 day ago",
    tags: ["Branding", "Visual Identity", "Typography", "Print Design"],
    description: "Shape Nike's global brand identity",
    experience: "3-5 years",
    matchScore: 84,
    matchLevel: "HIGH MATCH",
    workMode: "Onsite",
    applicants: 78,
  },
  {
    id: 19,
    title: "QA Engineer",
    company: "Salesforce",
    logo: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=100&h=100&fit=crop",
    location: "Hybrid / CA",
    type: "Full-time",
    salary: "$9k-12k",
    posted: "3 days ago",
    tags: ["Testing", "Automation", "Selenium", "QA"],
    description: "Ensure quality across all products",
    experience: "2-4 years",
    matchScore: 39,
    matchLevel: "LOW MATCH",
    workMode: "Hybrid",
    applicants: 52,
  },
  {
    id: 20,
    title: "Creative Director",
    company: "Shopify",
    logo: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=100&h=100&fit=crop",
    location: "Remote / CA",
    type: "Full-time",
    salary: "$20k-28k",
    posted: "2 days ago",
    tags: ["Creative Direction", "Leadership", "Brand Strategy", "Design"],
    description: "Lead creative vision for e-commerce platform",
    experience: "7y+",
    matchScore: 93,
    matchLevel: "HIGH MATCH",
    workMode: "Remote",
    applicants: 124,
  },
];

const Jobs = () => {
  const navigate = useNavigate();
  const [showFilters, setShowFilters] = useState(true);
  const [salaryRange, setSalaryRange] = useState([1200]);
  const [locationExpanded, setLocationExpanded] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [clickedJobId, setClickedJobId] = useState<number | null>(null);
  const itemsPerPage = 4;
  
  const [filters, setFilters] = useState({
    location: { remote: false, onsite: false, hybrid: false },
    jobType: { fullTime: false, partTime: false, internship: false, projectWork: false, volunteer: false, contract: false },
    seniority: { student: false, mid: false, senior: false, directors: false },
    salary: { under500: false, under1000: false, above2000: false, custom: false }
  });

  // Extract salary value from string (e.g., "$10k-13k" -> 10000)
  const extractMinSalary = (salaryStr: string): number => {
    const match = salaryStr.match(/\$?(\d+)k?/i);
    return match ? parseInt(match[1]) * 1000 : 0;
  };

  // Filter jobs based on all criteria
  const filteredJobs = jobListings.filter((job) => {
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesSearch = 
        job.title.toLowerCase().includes(query) ||
        job.company.toLowerCase().includes(query) ||
        job.tags.some(tag => tag.toLowerCase().includes(query)) ||
        job.description.toLowerCase().includes(query);
      
      if (!matchesSearch) return false;
    }

    // Location filter
    const locationActive = filters.location.remote || filters.location.onsite || filters.location.hybrid;
    if (locationActive) {
      const workMode = job.workMode.toLowerCase();
      const matchesLocation = 
        (filters.location.remote && workMode === "remote") ||
        (filters.location.onsite && workMode === "onsite") ||
        (filters.location.hybrid && workMode === "hybrid");
      
      if (!matchesLocation) return false;
    }

    // Job type filter
    const jobTypeActive = Object.values(filters.jobType).some(v => v);
    if (jobTypeActive) {
      const jobType = job.type.toLowerCase();
      const matchesJobType = 
        (filters.jobType.fullTime && jobType.includes("full-time")) ||
        (filters.jobType.partTime && jobType.includes("part-time")) ||
        (filters.jobType.internship && jobType.includes("internship")) ||
        (filters.jobType.contract && jobType.includes("contract")) ||
        (filters.jobType.volunteer && jobType.includes("volunteer")) ||
        (filters.jobType.projectWork && jobType.includes("project"));
      
      if (!matchesJobType) return false;
    }

    // Seniority filter
    const seniorityActive = Object.values(filters.seniority).some(v => v);
    if (seniorityActive) {
      const experience = job.experience.toLowerCase();
      const matchesSeniority = 
        (filters.seniority.student && (experience.includes("1") || experience.includes("0"))) ||
        (filters.seniority.mid && (experience.includes("2") || experience.includes("3") || experience.includes("4"))) ||
        (filters.seniority.senior && (experience.includes("5") || experience.includes("6") || experience.includes("7+"))) ||
        (filters.seniority.directors && experience.includes("7+"));
      
      if (!matchesSeniority) return false;
    }

    // Salary filter
    const minSalary = extractMinSalary(job.salary);
    const salaryActive = Object.values(filters.salary).some(v => v);
    if (salaryActive) {
      const matchesSalary = 
        (filters.salary.under500 && minSalary < 500) ||
        (filters.salary.under1000 && minSalary < 1000) ||
        (filters.salary.above2000 && minSalary >= 2000) ||
        (filters.salary.custom && minSalary >= salaryRange[0]);
      
      if (!matchesSalary) return false;
    }

    return true;
  });

  // Paginate filtered results
  const totalPages = Math.ceil(filteredJobs.length / itemsPerPage);
  const paginatedJobs = filteredJobs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Reset to page 1 when filters change
  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleSearch = () => {
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setSearchQuery("");
    setFilters({
      location: { remote: false, onsite: false, hybrid: false },
      jobType: { fullTime: false, partTime: false, internship: false, projectWork: false, volunteer: false, contract: false },
      seniority: { student: false, mid: false, senior: false, directors: false },
      salary: { under500: false, under1000: false, above2000: false, custom: false }
    });
    setSalaryRange([1200]);
    setCurrentPage(1);
  };

  const handleApplyClick = (job: typeof jobListings[0]) => {
    setClickedJobId(job.id);
    setTimeout(() => {
      setClickedJobId(null);
      navigate(`/jobs/${job.id}`, { state: { job } });
    }, 600);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Job Listings</h1>
          <p className="text-muted-foreground mt-2">
            Showing <span className="text-primary font-semibold">{filteredJobs.length}</span> Jobs
            {searchQuery && <span> for "<span className="text-primary">{searchQuery}</span>"</span>}
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <Card className="p-4 card-shadow">
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input
              placeholder="Search jobs, companies, keywords..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
          </div>
          <Button onClick={handleSearch} className="gradient-primary text-white px-8">
            Search
          </Button>
        </div>
      </Card>

      {/* Main Content with Filters */}
      <div className="flex gap-6">
        {/* Job Listings - Left Side */}
        <div className="flex-1 space-y-3">
          {filteredJobs.length === 0 ? (
            <Card className="p-12 text-center">
              <div className="max-w-md mx-auto space-y-4">
                <h2 className="text-2xl font-bold text-foreground">
                  No jobs match your criteria
                </h2>
                <p className="text-muted-foreground text-lg">
                  Try adjusting your search filters or try different keywords
                </p>
                <Button 
                  onClick={resetFilters}
                  className="mt-6 gradient-primary text-primary-foreground px-8 py-6 text-lg"
                >
                  Reset Filters
                </Button>
              </div>
            </Card>
          ) : (
            <>
              {paginatedJobs.map((job) => (
            <Card 
              key={job.id} 
              className="p-5 hover:shadow-xl transition-all duration-300 hover:scale-[1.01] cursor-pointer group bg-card border-border/50 hover:border-primary/20"
            >
              <div className="flex gap-4">
                {/* Company Logo */}
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-secondary/50 border border-border/50 shadow-sm">
                    <img 
                      src={job.logo} 
                      alt={`${job.company} logo`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Job Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                        {job.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">{job.company}</p>
                    </div>
                  </div>

                  {/* Additional Job Meta with Icons */}
                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-3">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {job.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Briefcase className="w-4 h-4" />
                      {job.experience}
                    </span>
                    <span className="flex items-center gap-1">
                      <Wallet className="w-4 h-4" />
                      {job.salary}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {job.type}
                    </span>
                    <span className="flex items-center gap-1">
                      <Home className="w-4 h-4" />
                      {job.workMode}
                    </span>
                  </div>

                  {/* Skills Tags */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    {job.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {job.tags.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{job.tags.length - 3} more
                      </Badge>
                    )}
                  </div>

                  {/* Bottom Row: Applicants and Bookmark */}
                  <div className="flex items-center gap-4 pt-3 border-t border-border/50">
                    <span className="text-sm text-muted-foreground">
                      {job.applicants} applicants
                    </span>
                    <Bookmark className="w-5 h-5 text-muted-foreground hover:text-primary cursor-pointer transition-colors hover:scale-110" />
                  </div>
                </div>

                {/* Match Score Circle and Apply Button - Right Side */}
                <div className="flex-shrink-0 flex flex-col items-center justify-between gap-4">
                  <div className="flex flex-col items-center gap-2">
                    <div className="relative w-20 h-20">
                      <svg className="w-20 h-20 transform -rotate-90">
                        <circle
                          cx="40"
                          cy="40"
                          r="34"
                          stroke="currentColor"
                          strokeWidth="6"
                          fill="none"
                          className="text-gray-200"
                        />
                        <circle
                          cx="40"
                          cy="40"
                          r="34"
                          stroke="currentColor"
                          strokeWidth="6"
                          fill="none"
                          strokeDasharray={`${2 * Math.PI * 34}`}
                          strokeDashoffset={`${2 * Math.PI * 34 * (1 - job.matchScore / 100)}`}
                          className={cn(
                            "transition-all duration-300",
                            job.matchScore >= 80 ? "text-green-500" :
                            job.matchScore >= 50 ? "text-yellow-500" :
                            "text-[#FF6B35]"
                          )}
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-lg font-bold text-foreground">{job.matchScore}%</span>
                      </div>
                    </div>
                    <span className={cn(
                      "text-xs font-semibold",
                      job.matchScore >= 80 ? "text-green-600" :
                      job.matchScore >= 50 ? "text-yellow-600" :
                      "text-gray-600"
                    )}>
                      {job.matchLevel}
                    </span>
                  </div>
                  
                  <Button 
                    onClick={() => handleApplyClick(job)}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 shadow-sm hover:shadow-md transition-shadow whitespace-nowrap relative overflow-hidden group"
                  >
                    <span className="relative z-10">Apply now</span>
                    <span className={cn(
                      "ml-2 inline-block transition-transform duration-500 relative z-10",
                      clickedJobId === job.id && "animate-[slide-arrow_0.6s_ease-in-out]"
                    )}>
                      →
                    </span>
                  </Button>
                </div>
              </div>
            </Card>
              ))}
              
              {/* Pagination */}
              <Pagination 
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </>
          )}
        </div>

        {/* Filters Sidebar - Right Side */}
        {showFilters && (
          <Card className="w-80 p-6 card-shadow h-fit sticky top-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-foreground">Filter</h2>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setShowFilters(false)}
                className="hover:bg-muted"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="space-y-6">
              {/* Job Location */}
              <div>
                <h3 className="font-semibold text-foreground mb-3">Job Location</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="remote" 
                      checked={filters.location.remote}
                      onCheckedChange={(checked) => 
                        handleFilterChange({...filters, location: {...filters.location, remote: checked as boolean}})
                      }
                    />
                    <label htmlFor="remote" className="text-sm text-muted-foreground cursor-pointer">
                      Remote
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="onsite" 
                      checked={filters.location.onsite}
                      onCheckedChange={(checked) => 
                        handleFilterChange({...filters, location: {...filters.location, onsite: checked as boolean}})
                      }
                    />
                    <label htmlFor="onsite" className="text-sm text-muted-foreground cursor-pointer">
                      Onsite
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="hybrid" 
                      checked={filters.location.hybrid}
                      onCheckedChange={(checked) => 
                        handleFilterChange({...filters, location: {...filters.location, hybrid: checked as boolean}})
                      }
                    />
                    <label htmlFor="hybrid" className="text-sm text-muted-foreground cursor-pointer">
                      Hybrid
                    </label>
                  </div>
                  
                  {/* Location Dropdown */}
                  <div 
                    className="flex items-center justify-between p-2 rounded-lg border border-border hover:bg-muted cursor-pointer"
                    onClick={() => setLocationExpanded(!locationExpanded)}
                  >
                    <span className="text-sm text-muted-foreground flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      London
                    </span>
                    <ChevronDown className={cn("w-4 h-4 transition-transform", locationExpanded && "rotate-180")} />
                  </div>
                </div>
              </div>

              {/* Job Type */}
              <div>
                <h3 className="font-semibold text-foreground mb-3">Job Type</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="fulltime" 
                      checked={filters.jobType.fullTime}
                      onCheckedChange={(checked) => 
                        handleFilterChange({...filters, jobType: {...filters.jobType, fullTime: checked as boolean}})
                      }
                    />
                    <label htmlFor="fulltime" className="text-sm text-muted-foreground cursor-pointer">
                      Full-time
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="parttime" 
                      checked={filters.jobType.partTime}
                      onCheckedChange={(checked) => 
                        handleFilterChange({...filters, jobType: {...filters.jobType, partTime: checked as boolean}})
                      }
                    />
                    <label htmlFor="parttime" className="text-sm text-muted-foreground cursor-pointer">
                      Part-time
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="internship" 
                      checked={filters.jobType.internship}
                      onCheckedChange={(checked) => 
                        handleFilterChange({...filters, jobType: {...filters.jobType, internship: checked as boolean}})
                      }
                    />
                    <label htmlFor="internship" className="text-sm text-muted-foreground cursor-pointer">
                      Internship
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="contract" 
                      checked={filters.jobType.contract}
                      onCheckedChange={(checked) => 
                        handleFilterChange({...filters, jobType: {...filters.jobType, contract: checked as boolean}})
                      }
                    />
                    <label htmlFor="contract" className="text-sm text-muted-foreground cursor-pointer">
                      Contract
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="volunteer" 
                      checked={filters.jobType.volunteer}
                      onCheckedChange={(checked) => 
                        handleFilterChange({...filters, jobType: {...filters.jobType, volunteer: checked as boolean}})
                      }
                    />
                    <label htmlFor="volunteer" className="text-sm text-muted-foreground cursor-pointer">
                      Volunteer
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="projectwork" 
                      checked={filters.jobType.projectWork}
                      onCheckedChange={(checked) => 
                        handleFilterChange({...filters, jobType: {...filters.jobType, projectWork: checked as boolean}})
                      }
                    />
                    <label htmlFor="projectwork" className="text-sm text-muted-foreground cursor-pointer">
                      Project Work
                    </label>
                  </div>
                </div>
              </div>

              {/* Seniority Level */}
              <div>
                <h3 className="font-semibold text-foreground mb-3">Seniority level</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="student" 
                      checked={filters.seniority.student}
                      onCheckedChange={(checked) => 
                        handleFilterChange({...filters, seniority: {...filters.seniority, student: checked as boolean}})
                      }
                    />
                    <label htmlFor="student" className="text-sm text-muted-foreground cursor-pointer">
                      Student level
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="directors" 
                      checked={filters.seniority.directors}
                      onCheckedChange={(checked) => 
                        handleFilterChange({...filters, seniority: {...filters.seniority, directors: checked as boolean}})
                      }
                    />
                    <label htmlFor="directors" className="text-sm text-muted-foreground cursor-pointer">
                      Directors
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="midlevel" 
                      checked={filters.seniority.mid}
                      onCheckedChange={(checked) => 
                        handleFilterChange({...filters, seniority: {...filters.seniority, mid: checked as boolean}})
                      }
                    />
                    <label htmlFor="midlevel" className="text-sm text-muted-foreground cursor-pointer">
                      Mid level
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="seniorlevel" 
                      checked={filters.seniority.senior}
                      onCheckedChange={(checked) => 
                        handleFilterChange({...filters, seniority: {...filters.seniority, senior: checked as boolean}})
                      }
                    />
                    <label htmlFor="seniorlevel" className="text-sm text-muted-foreground cursor-pointer">
                      Senior level
                    </label>
                  </div>
                </div>
              </div>

              {/* Salary */}
              <div>
                <h3 className="font-semibold text-foreground mb-3">Salary</h3>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="under500" 
                      checked={filters.salary.under500}
                      onCheckedChange={(checked) => 
                        handleFilterChange({...filters, salary: {...filters.salary, under500: checked as boolean}})
                      }
                    />
                    <label htmlFor="under500" className="text-sm text-muted-foreground cursor-pointer">
                      Under $500
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="above2000" 
                      checked={filters.salary.above2000}
                      onCheckedChange={(checked) => 
                        handleFilterChange({...filters, salary: {...filters.salary, above2000: checked as boolean}})
                      }
                    />
                    <label htmlFor="above2000" className="text-sm text-muted-foreground cursor-pointer">
                      Above $2000
                    </label>
                  </div>
                  <div className="flex items-center space-x-2 col-span-2">
                    <Checkbox 
                      id="under1000" 
                      checked={filters.salary.under1000}
                      onCheckedChange={(checked) => 
                        handleFilterChange({...filters, salary: {...filters.salary, under1000: checked as boolean}})
                      }
                    />
                    <label htmlFor="under1000" className="text-sm text-muted-foreground cursor-pointer">
                      Under $1000
                    </label>
                  </div>
                  <div className="flex items-center space-x-2 col-span-2">
                    <Checkbox 
                      id="custom" 
                      checked={filters.salary.custom}
                      onCheckedChange={(checked) => 
                        handleFilterChange({...filters, salary: {...filters.salary, custom: checked as boolean}})
                      }
                    />
                    <label htmlFor="custom" className="text-sm text-muted-foreground cursor-pointer">
                      Custom (use slider)
                    </label>
                  </div>
                </div>
                
                {/* Salary Slider */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Min: ${salaryRange[0]}</span>
                  </div>
                  <Slider
                    value={salaryRange}
                    onValueChange={(value) => {
                      setSalaryRange(value);
                      if (filters.salary.custom) {
                        setCurrentPage(1);
                      }
                    }}
                    max={30000}
                    min={0}
                    step={1000}
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* Show Filters Button when hidden */}
      {!showFilters && (
        <Button 
          onClick={() => setShowFilters(true)}
          className="fixed bottom-6 right-6 gradient-primary text-white shadow-lg"
        >
          Show Filters
        </Button>
      )}
    </div>
  );
};

export default Jobs;

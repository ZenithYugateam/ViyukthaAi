import React from "react";
import Sidebar from "@/components/company-dashboard/Sidebar";
import TopNav from "@/components/company-dashboard/TopNav";
import { PageTransition } from "@/components/company-dashboard/PageTransition";
import { mockCandidates, Candidate } from "@/data/quickHireCandidates";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Search,
  MapPin,
  Briefcase,
  DollarSign,
  Clock,
  Star,
  CheckCircle2,
  Mail,
  Phone,
  Linkedin,
  Github,
  Globe,
  X,
  Award,
  Code,
  GraduationCap,
  Target,
  TrendingUp,
  Filter,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const QuickHirePage: React.FC = () => {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [filteredCandidates, setFilteredCandidates] = React.useState(mockCandidates);
  const [selectedCandidate, setSelectedCandidate] = React.useState<Candidate | null>(null);
  
  // Filter states
  const [selectedExperience, setSelectedExperience] = React.useState<string[]>([]);
  const [selectedLocations, setSelectedLocations] = React.useState<string[]>([]);
  const [selectedSkills, setSelectedSkills] = React.useState<string[]>([]);
  const [selectedAvailability, setSelectedAvailability] = React.useState<string[]>([]);
  const [showFilters, setShowFilters] = React.useState(false);
  
  // Extract unique values for filters
  const experienceOptions = ["0-2 years", "3-5 years", "5+ years"];
  const locationOptions = Array.from(new Set(mockCandidates.map(c => c.location)));
  const topSkills = Array.from(new Set(mockCandidates.flatMap(c => c.primarySkills))).slice(0, 10);
  const availabilityOptions: Candidate["availability"][] = ["Immediate", "2 Weeks", "1 Month", "Negotiable"];

  // Apply all filters
  const applyFilters = React.useCallback(() => {
    let filtered = mockCandidates;

    // Search query filter
    if (searchQuery.trim()) {
      const lowerQuery = searchQuery.toLowerCase();
      const keywords = lowerQuery.split(" ").filter(Boolean);

      filtered = filtered.filter((candidate) => {
        const searchableText = [
          candidate.name,
          candidate.title,
          candidate.location,
          candidate.bio,
          candidate.experience,
          ...candidate.skills,
          ...candidate.primarySkills,
          ...candidate.preferredRoles,
          candidate.currentCompany || "",
          ...candidate.previousCompanies,
          ...candidate.education.map(e => `${e.degree} ${e.institution}`),
        ].join(" ").toLowerCase();

        return keywords.every(keyword => searchableText.includes(keyword));
      });
    }

    // Experience filter
    if (selectedExperience.length > 0) {
      filtered = filtered.filter((candidate) => {
        const years = candidate.totalExperience;
        return selectedExperience.some(exp => {
          if (exp === "0-2 years") return years <= 2;
          if (exp === "3-5 years") return years >= 3 && years <= 5;
          if (exp === "5+ years") return years > 5;
          return false;
        });
      });
    }

    // Location filter
    if (selectedLocations.length > 0) {
      filtered = filtered.filter((candidate) =>
        selectedLocations.includes(candidate.location)
      );
    }

    // Skills filter
    if (selectedSkills.length > 0) {
      filtered = filtered.filter((candidate) =>
        selectedSkills.some(skill =>
          candidate.skills.includes(skill) || candidate.primarySkills.includes(skill)
        )
      );
    }

    // Availability filter
    if (selectedAvailability.length > 0) {
      filtered = filtered.filter((candidate) =>
        selectedAvailability.includes(candidate.availability)
      );
    }

    setFilteredCandidates(filtered);
  }, [searchQuery, selectedExperience, selectedLocations, selectedSkills, selectedAvailability]);

  // Intelligent search function
  const handleSearch = React.useCallback((query: string) => {
    setSearchQuery(query);
  }, []);
  
  // Apply filters whenever any filter changes
  React.useEffect(() => {
    applyFilters();
  }, [applyFilters]);
  
  const toggleFilter = (value: string, selected: string[], setter: React.Dispatch<React.SetStateAction<string[]>>) => {
    if (selected.includes(value)) {
      setter(selected.filter(v => v !== value));
    } else {
      setter([...selected, value]);
    }
  };
  
  const clearAllFilters = () => {
    setSelectedExperience([]);
    setSelectedLocations([]);
    setSelectedSkills([]);
    setSelectedAvailability([]);
    setSearchQuery("");
  };
  
  const activeFiltersCount = selectedExperience.length + selectedLocations.length + selectedSkills.length + selectedAvailability.length;

  const handleContactCandidate = (candidate: Candidate) => {
    toast.success(`Contact request sent to ${candidate.name}!`);
  };

  const handleShortlist = (candidate: Candidate) => {
    toast.success(`${candidate.name} added to shortlist!`);
  };

  const getAvailabilityColor = (availability: Candidate["availability"]) => {
    switch (availability) {
      case "Immediate":
        return "bg-emerald-100 text-emerald-700";
      case "2 Weeks":
        return "bg-blue-100 text-blue-700";
      case "1 Month":
        return "bg-amber-100 text-amber-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <PageTransition>
      <div className="flex min-h-screen bg-background">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <TopNav />
          <main className="p-4 md:p-6 space-y-6">
            {/* Hero Section with Search */}
            <div className="text-center space-y-4 py-8">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h1 className="text-4xl font-bold mb-2">Quick Hire</h1>
                <p className="text-lg text-muted-foreground">
                  Find and hire top talent instantly from our verified candidate pool
                </p>
              </motion.div>

              {/* Centered Search Bar */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="max-w-3xl mx-auto"
              >
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search by role, skills, experience, location... (e.g., 'React developer 5 years Bangalore')"
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="pl-12 pr-4 py-6 text-lg rounded-full shadow-lg border-2 focus:border-primary"
                  />
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Try: "frontend developer", "python 3 years", "UI designer remote", "full stack bangalore"
                </p>
              </motion.div>

              {/* Filter Toggle & Results Count */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="flex items-center justify-center gap-4"
              >
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                  className="gap-2"
                >
                  <Filter className="h-4 w-4" />
                  Filters
                  {activeFiltersCount > 0 && (
                    <Badge variant="secondary" className="ml-1">{activeFiltersCount}</Badge>
                  )}
                  {showFilters ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </Button>
                <p className="text-sm text-muted-foreground">
                  {filteredCandidates.length} {filteredCandidates.length === 1 ? "candidate" : "candidates"} found
                </p>
              </motion.div>
            </div>

            {/* Filters Panel */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <Card className="max-w-5xl mx-auto">
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold">Filter Candidates</h3>
                        {activeFiltersCount > 0 && (
                          <Button variant="ghost" size="sm" onClick={clearAllFilters}>
                            Clear All
                          </Button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {/* Experience Filter */}
                        <div>
                          <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                            <Briefcase className="h-4 w-4" />
                            Experience
                          </h4>
                          <div className="space-y-2">
                            {experienceOptions.map((exp) => (
                              <div key={exp} className="flex items-center space-x-2">
                                <Checkbox
                                  id={`exp-${exp}`}
                                  checked={selectedExperience.includes(exp)}
                                  onCheckedChange={() => toggleFilter(exp, selectedExperience, setSelectedExperience)}
                                />
                                <Label
                                  htmlFor={`exp-${exp}`}
                                  className="text-sm font-normal cursor-pointer"
                                >
                                  {exp}
                                </Label>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Location Filter */}
                        <div>
                          <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            Location
                          </h4>
                          <div className="space-y-2">
                            {locationOptions.map((loc) => (
                              <div key={loc} className="flex items-center space-x-2">
                                <Checkbox
                                  id={`loc-${loc}`}
                                  checked={selectedLocations.includes(loc)}
                                  onCheckedChange={() => toggleFilter(loc, selectedLocations, setSelectedLocations)}
                                />
                                <Label
                                  htmlFor={`loc-${loc}`}
                                  className="text-sm font-normal cursor-pointer"
                                >
                                  {loc}
                                </Label>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Skills Filter */}
                        <div>
                          <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                            <Code className="h-4 w-4" />
                            Top Skills
                          </h4>
                          <div className="space-y-2 max-h-48 overflow-y-auto">
                            {topSkills.map((skill) => (
                              <div key={skill} className="flex items-center space-x-2">
                                <Checkbox
                                  id={`skill-${skill}`}
                                  checked={selectedSkills.includes(skill)}
                                  onCheckedChange={() => toggleFilter(skill, selectedSkills, setSelectedSkills)}
                                />
                                <Label
                                  htmlFor={`skill-${skill}`}
                                  className="text-sm font-normal cursor-pointer"
                                >
                                  {skill}
                                </Label>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Availability Filter */}
                        <div>
                          <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            Availability
                          </h4>
                          <div className="space-y-2">
                            {availabilityOptions.map((avail) => (
                              <div key={avail} className="flex items-center space-x-2">
                                <Checkbox
                                  id={`avail-${avail}`}
                                  checked={selectedAvailability.includes(avail)}
                                  onCheckedChange={() => toggleFilter(avail, selectedAvailability, setSelectedAvailability)}
                                />
                                <Label
                                  htmlFor={`avail-${avail}`}
                                  className="text-sm font-normal cursor-pointer"
                                >
                                  {avail}
                                </Label>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Candidate Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence mode="popLayout">
                {filteredCandidates.map((candidate, index) => (
                  <motion.div
                    key={candidate.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <Card className="hover:shadow-xl transition-all duration-300 cursor-pointer h-full flex flex-col">
                      <CardHeader className="pb-3">
                        <div className="flex items-start gap-3">
                          <div className="relative">
                            <Avatar className="w-16 h-16 border-2 border-primary bg-gradient-to-br from-primary/20 to-primary/10">
                              <AvatarImage src={candidate.avatar || undefined} alt={candidate.name} />
                              <AvatarFallback className="text-lg font-semibold bg-gradient-to-br from-primary/30 to-primary/20 text-primary-foreground">
                                {candidate.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            {candidate.isVerified && (
                              <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-1">
                                <CheckCircle2 className="h-3 w-3 text-white" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-lg truncate">{candidate.name}</h3>
                            <p className="text-sm text-muted-foreground truncate">{candidate.title}</p>
                            <div className="flex items-center gap-1 mt-1">
                              <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                              <span className="text-xs font-medium">{candidate.overallRating}</span>
                            </div>
                          </div>
                        </div>
                      </CardHeader>

                      <CardContent className="space-y-3 flex-1 flex flex-col">
                        {/* Key Info */}
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <MapPin className="h-4 w-4 flex-shrink-0" />
                            <span className="truncate">{candidate.location}</span>
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Briefcase className="h-4 w-4 flex-shrink-0" />
                            <span className="truncate">{candidate.experience} experience</span>
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <DollarSign className="h-4 w-4 flex-shrink-0" />
                            <span className="truncate">{candidate.expectedSalary}</span>
                          </div>
                        </div>

                        {/* Availability Badge */}
                        <div>
                          <Badge className={getAvailabilityColor(candidate.availability)}>
                            <Clock className="h-3 w-3 mr-1" />
                            {candidate.availability}
                          </Badge>
                        </div>

                        {/* Primary Skills */}
                        <div className="flex-1">
                          <p className="text-xs font-medium mb-2">Top Skills:</p>
                          <div className="flex flex-wrap gap-1">
                            {candidate.primarySkills.slice(0, 3).map((skill) => (
                              <Badge key={skill} variant="secondary" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                            {candidate.primarySkills.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{candidate.primarySkills.length - 3}
                              </Badge>
                            )}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2 pt-2">
                          <Button
                            size="sm"
                            className="flex-1"
                            onClick={() => setSelectedCandidate(candidate)}
                          >
                            View Profile
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleShortlist(candidate)}
                          >
                            <Star className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Empty State */}
            {filteredCandidates.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-16"
              >
                <Search className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">No candidates found</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your search terms or browse all candidates
                </p>
                <Button onClick={() => handleSearch("")}>Show All Candidates</Button>
              </motion.div>
            )}
          </main>
        </div>

        {/* Detailed Candidate Modal */}
        <AnimatePresence>
          {selectedCandidate && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 z-40"
                onClick={() => setSelectedCandidate(null)}
              />
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="fixed right-0 top-0 bottom-0 w-full md:w-[700px] bg-background border-l shadow-2xl z-50 overflow-y-auto"
              >
                <div className="p-6 space-y-6">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <Avatar className="w-20 h-20 border-2 border-primary bg-gradient-to-br from-primary/20 to-primary/10">
                        <AvatarImage src={selectedCandidate.avatar || undefined} alt={selectedCandidate.name} />
                        <AvatarFallback className="text-2xl font-semibold bg-gradient-to-br from-primary/30 to-primary/20 text-primary-foreground">
                          {selectedCandidate.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h2 className="text-2xl font-bold">{selectedCandidate.name}</h2>
                        <p className="text-lg text-muted-foreground">{selectedCandidate.title}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                            <span className="font-medium">{selectedCandidate.overallRating}</span>
                          </div>
                          {selectedCandidate.isVerified && (
                            <Badge variant="secondary" className="flex items-center gap-1">
                              <CheckCircle2 className="h-3 w-3" />
                              Verified
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setSelectedCandidate(null)}
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </div>

                  {/* Quick Info */}
                  <div className="grid grid-cols-2 gap-4">
                    <Card>
                      <CardContent className="pt-4">
                        <div className="flex items-center gap-2 text-muted-foreground mb-1">
                          <MapPin className="h-4 w-4" />
                          <span className="text-xs">Location</span>
                        </div>
                        <p className="font-medium">{selectedCandidate.location}</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-4">
                        <div className="flex items-center gap-2 text-muted-foreground mb-1">
                          <Briefcase className="h-4 w-4" />
                          <span className="text-xs">Experience</span>
                        </div>
                        <p className="font-medium">{selectedCandidate.experience}</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-4">
                        <div className="flex items-center gap-2 text-muted-foreground mb-1">
                          <DollarSign className="h-4 w-4" />
                          <span className="text-xs">Expected Salary</span>
                        </div>
                        <p className="font-medium">{selectedCandidate.expectedSalary}</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-4">
                        <div className="flex items-center gap-2 text-muted-foreground mb-1">
                          <Clock className="h-4 w-4" />
                          <span className="text-xs">Availability</span>
                        </div>
                        <Badge className={getAvailabilityColor(selectedCandidate.availability)}>
                          {selectedCandidate.availability}
                        </Badge>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Bio */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">About</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{selectedCandidate.bio}</p>
                    </CardContent>
                  </Card>

                  {/* Skills */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Code className="h-5 w-5" />
                        Skills
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {selectedCandidate.skills.map((skill) => (
                          <Badge key={skill} variant="secondary">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Ratings */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <TrendingUp className="h-5 w-5" />
                        Performance Ratings
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium">Technical Skills</span>
                          <span className="text-sm text-muted-foreground">
                            {selectedCandidate.technicalRating}/5.0
                          </span>
                        </div>
                        <Progress value={selectedCandidate.technicalRating * 20} />
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium">Communication</span>
                          <span className="text-sm text-muted-foreground">
                            {selectedCandidate.communicationRating}/5.0
                          </span>
                        </div>
                        <Progress value={selectedCandidate.communicationRating * 20} />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Education */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <GraduationCap className="h-5 w-5" />
                        Education
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {selectedCandidate.education.map((edu, idx) => (
                        <div key={idx}>
                          <p className="font-medium">{edu.degree}</p>
                          <p className="text-sm text-muted-foreground">{edu.institution}</p>
                          <p className="text-xs text-muted-foreground">{edu.year}</p>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  {/* Projects */}
                  {selectedCandidate.projects.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Target className="h-5 w-5" />
                          Projects
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {selectedCandidate.projects.map((project, idx) => (
                          <div key={idx}>
                            <h4 className="font-medium">{project.name}</h4>
                            <p className="text-sm text-muted-foreground mb-2">
                              {project.description}
                            </p>
                            <div className="flex flex-wrap gap-1">
                              {project.technologies.map((tech) => (
                                <Badge key={tech} variant="outline" className="text-xs">
                                  {tech}
                                </Badge>
                              ))}
                            </div>
                            {idx < selectedCandidate.projects.length - 1 && (
                              <Separator className="mt-4" />
                            )}
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  )}

                  {/* Certifications */}
                  {selectedCandidate.certifications.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Award className="h-5 w-5" />
                          Certifications
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {selectedCandidate.certifications.map((cert, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <CheckCircle2 className="h-4 w-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                              <span className="text-sm">{cert}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  )}

                  {/* Contact Info */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Contact Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{selectedCandidate.email}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{selectedCandidate.phone}</span>
                      </div>
                      {selectedCandidate.linkedin && (
                        <div className="flex items-center gap-3">
                          <Linkedin className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{selectedCandidate.linkedin}</span>
                        </div>
                      )}
                      {selectedCandidate.github && (
                        <div className="flex items-center gap-3">
                          <Github className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{selectedCandidate.github}</span>
                        </div>
                      )}
                      {selectedCandidate.portfolio && (
                        <div className="flex items-center gap-3">
                          <Globe className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{selectedCandidate.portfolio}</span>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Action Buttons */}
                  <div className="flex gap-3 sticky bottom-0 bg-background pt-4 border-t">
                    <Button
                      className="flex-1"
                      size="lg"
                      onClick={() => handleContactCandidate(selectedCandidate)}
                    >
                      <Mail className="h-4 w-4 mr-2" />
                      Contact Candidate
                    </Button>
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={() => handleShortlist(selectedCandidate)}
                    >
                      <Star className="h-4 w-4 mr-2" />
                      Shortlist
                    </Button>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </PageTransition>
  );
};

export default QuickHirePage;

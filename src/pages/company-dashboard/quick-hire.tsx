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
  Crown,
  Sparkles,
  Zap,
} from "lucide-react";
import { toast } from "sonner";

const QuickHirePage: React.FC = () => {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [filteredCandidates, setFilteredCandidates] = React.useState(mockCandidates);
  const [selectedCandidate, setSelectedCandidate] = React.useState<Candidate | null>(null);
  
  const [selectedExperience, setSelectedExperience] = React.useState<string[]>([]);
  const [selectedLocations, setSelectedLocations] = React.useState<string[]>([]);
  const [selectedSkills, setSelectedSkills] = React.useState<string[]>([]);
  const [selectedAvailability, setSelectedAvailability] = React.useState<string[]>([]);
  const [showFilters, setShowFilters] = React.useState(false);

  const experienceOptions = ["0-2 years", "3-5 years", "5+ years"];
  const locationOptions = Array.from(new Set(mockCandidates.map(c => c.location)));
  const topSkills = Array.from(new Set(mockCandidates.flatMap(c => c.primarySkills))).slice(0, 10);
  const availabilityOptions: Candidate["availability"][] = ["Immediate", "2 Weeks", "1 Month", "Negotiable"];

  const generateUniqueAvatarUrl = (candidate: Candidate, index: number) => {
    const professionalAvatars = [
      "1472099645785-5658abf4ff4e",
      "1507003211169-0a1dd7228f2d",
      "1519345182560-3f2917c472ef",
      "1500648767791-00dcc994a43e",
      "1531427186611-ecfd6d936c79",
      "1560250097-0b93528c311a",
      "1544725176-7c40e5a71c5e",
      "1570295999919-56ceb5ecca61",
      "1580489944761-15a19d654956",
      "1590080874088-8dc0c3d63d1a",
      "1494790108755-2616b192b099",
      "1535713875002-d1d0cf377fde",
      "1517841905240-472988babdf9",
      "1544005313-94ddf0286df2",
      "1554151228-14d9def656e4",
      "1567532939604-b6b5b0db2604",
      "1573496359142-b8d757343da7",
      "1580489944761-15a19d654956",
      "1590080874088-8d0c3d63d1a",
      "1544005313-94ddf0286df2",
      "1519345182560-3f2917c472ef",
      "1500648767791-00dcc994a43e",
      "1531427186611-ecfd6d936c79",
      "1560250097-0b93528c311a",
      "1544725176-7c40e5a71c5e",
      "1570295999919-56ceb5ecca61",
      "1580489944761-15a19d654956",
      "1590080874088-8d0c3d63d1a",
      "1544005313-94ddf0286df2",
      "1554151228-14d9def656e4",
      "1567532939604-b6b5b0db2604",
      "1573496359142-b8d757343da7",
      "1472099645785-5658abf4ff4e",
      "1507003211169-0a1dd7228f2d",
      "1519345182560-3f2917c472ef",
      "1500648767791-00dcc994a43e",
      "1531427186611-ecfd6d936c79",
      "1560250097-0b93528c311a",
      "1544725176-7c40e5a71c5e",
      "1570295999919-56ceb5ecca61",
    ];
    
    const uniqueSeed = candidate.id.charCodeAt(0) + index;
    const avatarIndex = uniqueSeed % professionalAvatars.length;
    
    return `https://images.unsplash.com/photo-${professionalAvatars[avatarIndex]}?w=150&h=150&fit=crop&crop=face&auto=format`;
  };

  const getGradientByRating = (rating: number) => {
    if (rating >= 4.5) return "bg-gradient-to-br from-purple-500 via-pink-500 to-red-500";
    if (rating >= 4.0) return "bg-gradient-to-br from-blue-500 via-cyan-500 to-teal-500";
    if (rating >= 3.5) return "bg-gradient-to-br from-green-500 via-emerald-500 to-lime-500";
    return "bg-gradient-to-br from-gray-500 via-slate-600 to-stone-600";
  };

  const getStatusIcon = (rating: number, isVerified: boolean) => {
    if (rating >= 4.5) return <Crown className="h-3 w-3 text-yellow-400" />;
    if (rating >= 4.0) return <Sparkles className="h-3 w-3 text-blue-400" />;
    if (isVerified) return <CheckCircle2 className="h-3 w-3 text-green-400" />;
    return <Zap className="h-3 w-3 text-amber-400" />;
  };

  const getStatusBadgeColor = (rating: number, isVerified: boolean) => {
    if (rating >= 4.5) return "bg-yellow-500";
    if (rating >= 4.0) return "bg-blue-500";
    if (isVerified) return "bg-green-500";
    return "bg-amber-500";
  };

  const applyFilters = React.useCallback(() => {
    let filtered = mockCandidates;

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

    if (selectedLocations.length > 0) {
      filtered = filtered.filter((candidate) =>
        selectedLocations.includes(candidate.location)
      );
    }

    if (selectedSkills.length > 0) {
      filtered = filtered.filter((candidate) =>
        selectedSkills.some(skill =>
          candidate.skills.includes(skill) || candidate.primarySkills.includes(skill)
        )
      );
    }

    if (selectedAvailability.length > 0) {
      filtered = filtered.filter((candidate) =>
        selectedAvailability.includes(candidate.availability)
      );
    }

    setFilteredCandidates(filtered);
  }, [searchQuery, selectedExperience, selectedLocations, selectedSkills, selectedAvailability]);

  const handleSearch = React.useCallback((query: string) => {
    setSearchQuery(query);
  }, []);
  
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
                          <motion.div 
                            className="relative group"
                            whileHover={{ scale: 1.05 }}
                            transition={{ type: "spring", stiffness: 300 }}
                          >
                            <div className="relative">
                              <div className={`
                                absolute inset-0 rounded-full blur-md opacity-60
                                ${getGradientByRating(candidate.overallRating)}
                              `} />
                              
                              <img
                                src={generateUniqueAvatarUrl(candidate, index)}
                                alt={candidate.name}
                                className="w-16 h-16 rounded-full border-3 border-white shadow-xl relative z-10 transition-all duration-300 group-hover:shadow-2xl object-cover"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.src = `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face&auto=format`;
                                }}
                              />
                              
                              <div className={`
                                absolute -bottom-1 -right-1 rounded-full p-1.5 shadow-lg border-2 border-white z-20
                                ${getStatusBadgeColor(candidate.overallRating, candidate.isVerified)}
                              `}>
                                {getStatusIcon(candidate.overallRating, candidate.isVerified)}
                              </div>

                              <div className="absolute inset-0 rounded-full bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-30" />
                            </div>
                          </motion.div>
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

                        <div>
                          <Badge className={getAvailabilityColor(candidate.availability)}>
                            <Clock className="h-3 w-3 mr-1" />
                            {candidate.availability}
                          </Badge>
                        </div>

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
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <motion.div 
                        className="relative group"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
                      >
                        <div className="relative">
                          <div className={`
                            absolute inset-0 rounded-full blur-xl opacity-50
                            ${getGradientByRating(selectedCandidate.overallRating)}
                          `} />
                          
                          <img
                            src={generateUniqueAvatarUrl(selectedCandidate, mockCandidates.findIndex(c => c.id === selectedCandidate.id))}
                            alt={selectedCandidate.name}
                            className="w-20 h-20 rounded-full border-4 border-white shadow-2xl relative z-10 object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face&auto=format`;
                            }}
                          />
                          
                          <div className={`
                            absolute -bottom-2 -right-2 rounded-full p-2 shadow-2xl border-3 border-white z-20
                            ${getStatusBadgeColor(selectedCandidate.overallRating, selectedCandidate.isVerified)}
                          `}>
                            {getStatusIcon(selectedCandidate.overallRating, selectedCandidate.isVerified)}
                          </div>

                          <motion.div
                            className="absolute inset-0 rounded-full border-2 border-transparent border-t-white/60 border-r-white/40"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                            style={{ scale: 1.1 }}
                          />
                        </div>
                      </motion.div>
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

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">About</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{selectedCandidate.bio}</p>
                    </CardContent>
                  </Card>

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
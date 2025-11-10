import { Search } from "lucide-react";
import { Input } from "./ui/input";
import { useEffect, useState } from "react";

const searchSuggestions = [
  "Search jobs...",
  "Find your profile...",
  "Schedule mock interviews...",
  "Browse opportunities...",
  "Track applications...",
];

export const AnimatedSearchBar = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % searchSuggestions.length);
        setIsAnimating(false);
      }, 300);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full max-w-2xl mx-auto mb-8">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/80 z-10" />
      <Input
        type="text"
        placeholder={searchSuggestions[currentIndex]}
        className={`pl-12 h-14 text-lg bg-card border-border shadow-lg transition-all duration-300 placeholder:text-foreground placeholder:font-semibold ${
          isAnimating ? "opacity-0 translate-y-1" : "opacity-100 translate-y-0"
        }`}
      />
    </div>
  );
};

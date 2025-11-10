import { BellDot, Moon, Sun, Search, Settings, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { cn } from "@/lib/utils";
import maleAvatar from "@/assets/male-avatar.jpg";
import femaleAvatar from "@/assets/female-avatar.jpg";

export const TopNavbar = () => {
  const [isDark, setIsDark] = useState(false);

  // Mock user data - replace with actual user data from auth/database
  const userGender = "female"; // This should come from user profile/auth

  // Get avatar image based on gender
  const getAvatarUrl = (gender: string) => {
    return gender === "female" ? femaleAvatar : maleAvatar;
  };

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <header className="fixed top-0 right-0 left-0 md:left-20 h-16 bg-card/80 backdrop-blur-lg border-b border-border/50 z-30 animate-fade-in">
      <div className="flex items-center justify-between h-full px-4 md:px-6">
        {/* Welcome Section */}
        <div className="animate-fade-in ml-12 md:ml-0">
          <h2 className="text-base md:text-xl font-semibold text-foreground">Welcome back, Priya! 👋</h2>
          <p className="text-xs md:text-sm text-muted-foreground hidden sm:block">
            Here's what's happening with your job search
          </p>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-1 md:gap-2">
          {/* Search Button - Hidden on mobile */}
          <Button
            variant="ghost"
            size="icon"
            className="hidden sm:flex hover:bg-primary/10 hover:text-primary transition-all duration-200 hover-scale"
          >
            <Search className="w-5 h-5" />
          </Button>

          {/* Notifications */}
          <Button
            variant="ghost"
            size="icon"
            className="relative hover:bg-primary/10 hover:text-primary transition-all duration-200 hover-scale"
          >
            <BellDot className="w-4 h-4 md:w-5 md:h-5" />
            <Badge className="absolute -top-1 -right-1 w-4 h-4 md:w-5 md:h-5 flex items-center justify-center p-0 gradient-primary text-white text-[10px] md:text-xs border-2 border-background animate-pulse">
              3
            </Badge>
          </Button>

          {/* Settings - Hidden on mobile */}
          <Button
            variant="ghost"
            size="icon"
            className="hidden lg:flex hover:bg-primary/10 hover:text-primary transition-all duration-200 hover:rotate-90 duration-300"
          >
            <Settings className="w-5 h-5" />
          </Button>

          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className={cn(
              "hover:bg-primary/10 transition-all duration-200 hover-scale",
              isDark ? "text-yellow-500" : "text-primary",
            )}
          >
            {isDark ? (
              <Sun className="w-4 h-4 md:w-5 md:h-5 animate-scale-in" />
            ) : (
              <Moon className="w-4 h-4 md:w-5 md:h-5 animate-scale-in" />
            )}
          </Button>

          {/* Profile */}
          <div className="flex items-center gap-2 md:gap-3 ml-2 pl-2 md:pl-4 border-l border-border/50">
            <div className="text-right hidden lg:block">
              <p className="text-sm font-medium text-foreground">Priya Sharma</p>
              <p className="text-xs text-muted-foreground">Computer Science</p>
            </div>
            <Button
              variant="ghost"
              className="hover:bg-primary/10 p-0 h-auto rounded-full transition-all duration-200 group"
            >
              <div className="flex items-center gap-1 md:gap-2">
                <div className="relative">
                  <img
                    src={getAvatarUrl(userGender)}
                    alt="User Avatar"
                    className="w-10 h-10 rounded-full object-cover transition-transform duration-200 group-hover:scale-105"
                    style={{
                      border: "1.5px solid #7B2FD0",
                      backgroundColor: "transparent",
                    }}
                  />
                </div>
                <ChevronDown className="w-3 h-3 md:w-4 md:h-4 text-muted-foreground group-hover:text-primary transition-all duration-200 hidden sm:block" />
              </div>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

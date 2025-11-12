import { useState } from "react";
import { NavLink } from "react-router-dom";
import { 
  LayoutDashboard, 
  Briefcase, 
  FileText, 
  Video, 
  FolderKanban,
  BarChart3,
  Settings,
  LogOut,
  ChevronRight,
  Menu,
} from "lucide-react";
import SmartToyIcon from '@mui/icons-material/SmartToy';
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

const candidateNavItems = [
  { title: "Dashboard", icon: LayoutDashboard, path: "/" },
  { title: "Job Listing", icon: Briefcase, path: "/jobs" },
  { title: "Resume Builder", icon: FileText, path: "/resume" },
  { title: "Mock Interviews", icon: Video, path: "/interviews" },
  { title: "Profile", icon: FolderKanban, path: "/portfolio" },
  { title: "Report Analysis", icon: BarChart3, path: "/reports" },
  { title: "Settings", icon: Settings, path: "/settings" },
];

const SidebarContent = ({ isExpanded, onNavigate }: { isExpanded: boolean; onNavigate?: () => void }) => (
  <>
    {/* Logo */}
    <div className="flex items-center justify-center h-16 border-b border-border px-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
          <SmartToyIcon sx={{ fontSize: 28, color: '#3A8DFF' }} />
        </div>
        {isExpanded && (
          <span className="font-semibold text-lg whitespace-nowrap text-foreground">
            Viyuktha AI
          </span>
        )}
      </div>
    </div>

    {/* Navigation */}
    <nav className="flex flex-col gap-2 p-4 mt-4 relative">
      {/* Candidate Section */}
      {isExpanded && (
        <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-4">
          Candidate
        </div>
      )}
      {candidateNavItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          onClick={onNavigate}
          className={({ isActive }) =>
            cn(
              "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 relative group transform overflow-hidden",
              isActive
                ? "gradient-primary text-primary-foreground shadow-md scale-105"
                : "text-foreground hover:bg-primary/10 hover:scale-105 hover:shadow-sm"
            )
          }
        >
          {({ isActive }) => (
            <>
              {/* Curved Outside Bubble for Active Tab */}
              {isActive && (
                <>
                  <span className="absolute -right-5 top-0 h-full w-5 bg-background rounded-l-full shadow-sm" />
                  <span className="absolute -left-5 top-0 h-full w-5 bg-background rounded-r-full shadow-sm" />
                </>
              )}

              <item.icon className="w-5 h-5 flex-shrink-0 z-10" />
              {isExpanded && (
                <span className="text-sm font-medium whitespace-nowrap z-10">
                  {item.title}
                </span>
              )}
              {!isExpanded && (
                <div className="absolute left-full ml-6 px-3 py-2 bg-popover text-popover-foreground text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 shadow-lg border border-border">
                  {item.title}
                  <div className="absolute top-1/2 -left-1 -translate-y-1/2 border-4 border-transparent border-r-popover" />
                </div>
              )}
            </>
          )}
        </NavLink>
      ))}

      {/* Logout Button */}
      <button className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 text-foreground hover:bg-destructive/10 hover:text-destructive hover:scale-105 hover:shadow-sm mt-8 transform">
        <LogOut className="w-5 h-5 flex-shrink-0" />
        {isExpanded && (
          <span className="text-sm font-medium whitespace-nowrap">
            Logout
          </span>
        )}
      </button>
    </nav>

      {/* Collapse Indicator */}
      {!onNavigate && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <ChevronRight 
            className={cn(
              "w-5 h-5 text-muted-foreground transition-smooth",
              isExpanded && "rotate-180"
            )} 
          />
        </div>
      )}
  </>
);

export const Sidebar = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile Menu Button */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon"
            className="fixed top-4 left-4 z-50 md:hidden bg-background shadow-md hover:bg-accent"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-64">
          <SidebarContent isExpanded={true} onNavigate={() => setMobileOpen(false)} />
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "hidden md:block fixed left-0 top-0 h-screen bg-background border-r border-border transition-smooth z-40 shadow-sm",
          isExpanded ? "w-64" : "w-20"
        )}
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
      >
        <SidebarContent isExpanded={isExpanded} />
      </aside>
    </>
  );
};
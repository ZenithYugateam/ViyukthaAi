import React from "react";
import { NavLink } from "react-router-dom";
import { Briefcase, PlusSquare, Video, LineChart, Settings, Zap, Coins, CalendarDays } from "lucide-react";
import { motion } from "framer-motion";

type Item = {
  to: string;
  label: string;
  icon: React.ReactNode;
};

const items: Item[] = [
  { to: "/company-dashboard", label: "Jobs", icon: <Briefcase className="h-5 w-5" /> },
  { to: "/company-dashboard/post-job", label: "Post Job", icon: <PlusSquare className="h-5 w-5" /> },
  { to: "/company-dashboard/quick-hire", label: "Quick Hire", icon: <Zap className="h-5 w-5" /> },
  { to: "/company-dashboard/interviews", label: "Interviews", icon: <Video className="h-5 w-5" /> },
  { to: "/company-dashboard/schedule", label: "Schedule", icon: <CalendarDays className="h-5 w-5" /> },
  { to: "/company-dashboard/insights", label: "Insights", icon: <LineChart className="h-5 w-5" /> },
  { to: "/company-dashboard/tokens", label: "Tokens", icon: <Coins className="h-5 w-5" /> },
  { to: "/company-dashboard/settings", label: "Settings", icon: <Settings className="h-5 w-5" /> },
];

const Sidebar: React.FC = () => {
  return (
    <motion.aside
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 120, damping: 20 }}
      className="hidden md:flex md:flex-col w-64 shrink-0 border-r bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/50"
    >
      <div className="px-4 py-5 border-b">
        <span className="font-semibold text-lg">Company</span>
      </div>
      <nav className="p-2 space-y-1">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors hover:bg-muted ${
                isActive ? "bg-muted text-foreground" : "text-muted-foreground"
              }`
            }
          >
            {item.icon}
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </motion.aside>
  );
};

export default Sidebar;

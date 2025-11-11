import React from "react";
import { Bell, ChevronDown, User2 } from "lucide-react";
import { companyInfo as defaultInfo, notifications as defaultNotifications } from "@/data/companyDashboard";

type Props = {
  companyName?: string;
  notificationsCount?: number;
};

const TopNav: React.FC<Props> = ({ companyName, notificationsCount }) => {
  const name = companyName ?? defaultInfo.name;
  const count = notificationsCount ?? defaultNotifications;
  return (
    <nav className="sticky top-0 z-10 border-b bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/50">
      <div className="h-14 px-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className="font-medium text-foreground">{name}</span>
        </div>
        <div className="flex items-center gap-4">
          <button className="relative inline-flex items-center justify-center h-9 w-9 rounded-md hover:bg-muted">
            <Bell className="h-5 w-5" />
            {count > 0 && (
              <span className="absolute -top-1 -right-1 h-5 min-w-[20px] rounded-full bg-red-500 text-white text-[10px] px-1 flex items-center justify-center">
                {count}
              </span>
            )}
          </button>
          <button className="inline-flex items-center gap-2 h-9 px-2 rounded-md hover:bg-muted">
            <div className="h-7 w-7 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center">
              <User2 className="h-4 w-4" />
            </div>
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default TopNav;

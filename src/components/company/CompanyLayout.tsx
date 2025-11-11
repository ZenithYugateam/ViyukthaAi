import { ReactNode } from "react";
import { CompanySidebar } from "./CompanySidebar";
import { TopNavbar } from "@/components/TopNavbar";

interface CompanyLayoutProps {
  children: ReactNode;
}

export const CompanyLayout = ({ children }: CompanyLayoutProps) => {
  return (
    <div className="min-h-screen bg-background flex w-full">
      <CompanySidebar />
      <div className="flex-1 w-full md:ml-20">
        <TopNavbar />
        <main className="p-4 pt-24 md:p-6 md:pt-28 lg:p-8 lg:pt-32">
          {children}
        </main>
      </div>
    </div>
  );
};

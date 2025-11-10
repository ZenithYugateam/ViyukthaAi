import { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { TopNavbar } from "./TopNavbar";

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-background flex w-full">
      <Sidebar />
      <div className="flex-1 w-full md:ml-20">
        <TopNavbar />
        <main className="p-4 pt-24 md:p-6 md:pt-28 lg:p-8 lg:pt-32">
          {children}
        </main>
      </div>
    </div>
  );
};

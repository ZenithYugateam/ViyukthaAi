import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import Index from "./pages/Index";
import Jobs from "./pages/Jobs";
import JobDetails from "./pages/JobDetails";
import Resume from "./pages/Resume";
import Interviews from "./pages/Interviews";
import PermissionsTest from "./pages/PermissionsTest";
import AIInterview from "./pages/AIInterview";
import Portfolio from "./pages/Portfolio";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import CompanyDashboard from "./pages/company/CompanyDashboard";
import CompanyJobs from "./pages/company/CompanyJobs";
import CreateJob from "./pages/company/CreateJob";
import JobApplicants from "./pages/company/JobApplicants";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Fullscreen routes without Layout */}
          <Route path="/ai-interview" element={<AIInterview />} />
          <Route path="/guidelines" element={<AIInterview />} />
          
          {/* Candidate Routes with Layout (sidebar + navbar) */}
          <Route path="/" element={<Layout><Index /></Layout>} />
          <Route path="/jobs" element={<Layout><Jobs /></Layout>} />
          <Route path="/jobs/:id" element={<Layout><JobDetails /></Layout>} />
          <Route path="/resume" element={<Layout><Resume /></Layout>} />
          <Route path="/interviews" element={<Layout><Interviews /></Layout>} />
          <Route path="/permissions-test" element={<Layout><PermissionsTest /></Layout>} />
          <Route path="/portfolio" element={<Layout><Portfolio /></Layout>} />
          <Route path="/reports" element={<Layout><Reports /></Layout>} />
          <Route path="/settings" element={<Layout><Settings /></Layout>} />
          
          {/* Company Routes with Layout */}
          <Route path="/company" element={<Layout><CompanyDashboard /></Layout>} />
          <Route path="/company/jobs" element={<Layout><CompanyJobs /></Layout>} />
          <Route path="/company/jobs/new" element={<Layout><CreateJob /></Layout>} />
          <Route path="/company/jobs/:jobId/edit" element={<Layout><CreateJob /></Layout>} />
          <Route path="/company/jobs/:jobId/applicants" element={<Layout><JobApplicants /></Layout>} />
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Layout } from "./components/Layout";
import Index from "./pages/Index";
import Jobs from "./pages/Jobs";
import JobDetails from "./pages/JobDetails";
import Resume from "./pages/Resume";
import Interviews from "./pages/Interviews";
import PermissionsTest from "./pages/PermissionsTest";
import AIInterview from "./pages/AIInterview";
import JobInterview from "./pages/JobInterview";
import InterviewResults from "./pages/InterviewResults";
import Portfolio from "./pages/Portfolio";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import CompanyDashboard from "./pages/company/CompanyDashboard";
import CompanyJobs from "./pages/company/CompanyJobs";
import CreateJob from "./pages/company/CreateJob";
import JobApplicants from "./pages/company/JobApplicants";
import CompanyDashboardIndex from "./pages/company-dashboard/index";
import CompanyDashboardPostJob from "./pages/company-dashboard/post-job";
import CompanyDashboardInterviews from "./pages/company-dashboard/interviews";
import CompanyDashboardInsights from "./pages/company-dashboard/insights";
import CompanyDashboardSettings from "./pages/company-dashboard/settings";
import CandidateAnalytics from "./pages/company-dashboard/candidate-analytics";
import QuickHire from "./pages/company-dashboard/quick-hire";
import Tokens from "./pages/company-dashboard/tokens";
import Schedule from "./pages/company-dashboard/schedule";

const queryClient = new QueryClient();

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Wrap each route's element with motion.div for page transitions */}
          {/* Fullscreen routes without Layout */}
          <Route
            path="/ai-interview"
            element={
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <AIInterview />
              </motion.div>
            }
          />
          <Route
            path="/job-interview/:jobId"
            element={
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <JobInterview />
              </motion.div>
            }
          />
          <Route
            path="/interview-results/:sessionId"
            element={
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <InterviewResults />
              </motion.div>
            }
          />
          <Route
            path="/guidelines"
            element={
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <AIInterview />
              </motion.div>
            }
          />
          
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

          {/* Company Dashboard Module Routes (self-contained layout) */}
          <Route path="/company-dashboard/*">
            <Route index element={<CompanyDashboardIndex />} />
            <Route path="post-job" element={<CompanyDashboardPostJob />} />
            <Route path="quick-hire" element={<QuickHire />} />
            <Route path="interviews" element={<CompanyDashboardInterviews />} />
            <Route path="candidate/:candidateId" element={<CandidateAnalytics />} />
            <Route path="insights" element={<CompanyDashboardInsights />} />
            <Route path="schedule" element={<Schedule />} />
            <Route path="tokens" element={<Tokens />} />
            <Route path="settings" element={<CompanyDashboardSettings />} />
          </Route>
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route
            path="*"
            element={
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <NotFound />
              </motion.div>
            }
          />
        </Routes>
      </AnimatePresence>
    );
  };

  const App = () => (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AnimatedRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );

export default App;

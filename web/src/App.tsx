import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CvUpload from "./pages/CvUpload";
import InternSoftwareEngineer from "./pages/InternSoftwareEngineer";
import InternBusinessAnalyst from "./pages/InternBusinessAnalyst";
import Index from "./pages/Index";
import CreateInterviews from "./pages/CreateInterviews";
import DynamicInterview from "./pages/DynamicInterview";
import DynamicCvUpload from "./pages/DynamicCvUpload";
import NotFound from "./pages/NotFound";

import InterviewQuestionProvider from './contexts/InterviewQuestionProvider';
import JobTitleProvider from "./contexts/JobTitleProvider";
import InterviewerNameProvider from "./contexts/InterviewerNameProvider";

const queryClient = new QueryClient();

const App = () => (
<InterviewerNameProvider>
<JobTitleProvider>
<InterviewQuestionProvider>
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Interview Management Routes */}
          <Route path="/" element={<CreateInterviews />} />
          <Route path="/create-interviews" element={<CreateInterviews />} />
          <Route path="/cv-upload/:interviewGuid" element={<DynamicCvUpload />} />
          <Route path="/interview/:interviewGuid" element={<DynamicInterview />} />
          
          {/* Legacy CV Upload Routes */}
          <Route path="/intern_software_engineer" element={<InternSoftwareEngineer />} />
          <Route path="/business_analyst" element={<InternBusinessAnalyst />} />
          <Route path="/interview" element={<Index />} />
          
          {/* Catch-all route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
</InterviewQuestionProvider>
</JobTitleProvider>
</InterviewerNameProvider>
);

export default App;
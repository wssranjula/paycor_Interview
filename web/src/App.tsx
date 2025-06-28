import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CvUpload from "./pages/CvUpload";
import InternSoftwareEngineer from "./pages/InternSoftwareEngineer";
import InternBusinessAnalyst from "./pages/InternBusinessAnalyst";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

import InterviewQuestionProvider from './contexts/InterviewQuestionProvider';
import JobTitleProvider from "./contexts/JobTitleProvider";

const queryClient = new QueryClient();

const App = () => (
<JobTitleProvider>
<InterviewQuestionProvider>
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* <Route path="/" element={<Index />} /> */}
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          {/* <Route path="*" element={<NotFound />} /> */}
        <Route path="/intern_software_engineer" element={<InternSoftwareEngineer />} />
        <Route path="/intern_business_analyst" element={<InternBusinessAnalyst />} />
        <Route path="/interview" element={<Index />} />
        <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
</InterviewQuestionProvider>
</JobTitleProvider>
);

export default App;

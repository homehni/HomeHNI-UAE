
import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import AboutUs from "./pages/AboutUs";
import TermsAndConditions from "./pages/TermsAndConditions";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Careers from "./pages/Careers";
import ContactUs from "./pages/ContactUs";
import Testimonials from "./pages/Testimonials";
import Safety from "./pages/Safety";
import FAQ from "./pages/FAQ";
import GrievanceRedressal from "./pages/GrievanceRedressal";
import ReportProblem from "./pages/ReportProblem";
import SummonsNotices from "./pages/SummonsNotices";
import PaintingCleaning from "./pages/PaintingCleaning";
import ReferEarn from "./pages/ReferEarn";
import PackersMovers from "./pages/PackersMovers";
import RentalAgreement from "./pages/RentalAgreement";
import RentReceipts from "./pages/RentReceipts";
import NotFound from "./pages/NotFound";
import ScrollToTop from "./components/ScrollToTop";

const queryClient = new QueryClient();

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/about-us" element={<AboutUs />} />
            <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/careers" element={<Careers />} />
            <Route path="/contact-us" element={<ContactUs />} />
            <Route path="/testimonials" element={<Testimonials />} />
            <Route path="/safety" element={<Safety />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/grievance-redressal" element={<GrievanceRedressal />} />
            <Route path="/report-problem" element={<ReportProblem />} />
            <Route path="/summons-notices" element={<SummonsNotices />} />
            <Route path="/painting-cleaning" element={<PaintingCleaning />} />
            <Route path="/refer-earn" element={<ReferEarn />} />
            <Route path="/packers-movers" element={<PackersMovers />} />
            <Route path="/rental-agreement" element={<RentalAgreement />} />
            <Route path="/rent-receipts" element={<RentReceipts />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;

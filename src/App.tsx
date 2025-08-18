
import React, { useState } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from '@/contexts/AuthContext';
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
import LegalServices from "./pages/LegalServices";
import HandoverServices from "./pages/HandoverServices";
import PropertyManagement from "./pages/PropertyManagement";
import PropManagement from "./pages/PropManagement";
import RobotsTxt from "./pages/RobotsTxt";
import SitemapXml from "./pages/SitemapXml";
import OwnerPlans from "./pages/OwnerPlans";
import BuyerPlans from "./pages/BuyerPlans";
import SellerPlans from "./pages/SellerPlans";
import CorporateEnquiry from "./pages/CorporateEnquiry";
import CommercialOwnerPlans from "./pages/CommercialOwnerPlans";
import CommercialBuyerPlan from "./pages/CommercialBuyerPlan";
import CommercialSellerPlans from "./pages/CommercialSellerPlans";
import Blog from "./pages/Blog";
import { Auth } from "./pages/Auth";
import { Profile } from "./pages/Profile";
import { VerifyEmail } from "./pages/VerifyEmail";
import { Dashboard } from "./pages/Dashboard";
import { PostProperty } from "./pages/PostProperty";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AdminRoute } from "@/components/AdminRoute";
import { AdminLayout } from "@/components/admin/AdminLayout";
import Admin from "./pages/Admin";
import AdminProperties from "./pages/AdminProperties";
import AdminUsers from "./pages/AdminUsers";
import AdminSettings from "./pages/AdminSettings";
import AdminLogin from "./pages/AdminLogin";
import { AdminAnalytics } from "./pages/AdminAnalytics";
import { AdminContent } from "./pages/AdminContent";
import { AdminLeads } from "./pages/AdminLeads";
import { AdminRegions } from "./pages/AdminRegions";
import { AdminSEO } from "./pages/AdminSEO";
import { AdminAudit } from "./pages/AdminAudit";
import NotFound from "./pages/NotFound";
import ScrollToTop from "./components/ScrollToTop";

import Architecture from "./pages/Architects";
import Interior from "./pages/Interior";
import Loans from "./pages/Loans";
import AboutSidebar from "./pages/AboutSidebar";
import PropertyDetails from "./pages/PropertyDetails";

const App: React.FC = () => {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        retry: 2,
        staleTime: 5 * 60 * 1000, // 5 minutes
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <ScrollToTop />
            <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/about-us" element={<AboutUs />} />
            <Route path="/about" element={<AboutSidebar />} />
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
            <Route path="/legal-services" element={<LegalServices />} />
            <Route path="/handover-services" element={<HandoverServices />} />
            <Route path="/property-management" element={<PropertyManagement />} />
            <Route path="/prop-management" element={<PropManagement />} />
            <Route path="/owner-plans" element={<OwnerPlans />} />
            <Route path="/buyer-plans" element={<BuyerPlans />} />
            <Route path="/seller-plans" element={<SellerPlans />} />
            <Route path="/commercial-owner-plans" element={<CommercialOwnerPlans />} />
          <Route path="/commercial-buyer-plan" element={<CommercialBuyerPlan />} />
          <Route path="/commercial-seller-plans" element={<CommercialSellerPlans />} />
            <Route path="/corporate-enquiry" element={<CorporateEnquiry />} />
            <Route path="/blog" element={<Blog />} />
            
            <Route path="/architects" element={<Architecture />} />
            <Route path="/interior" element={<Interior />} />
            <Route path="/loans" element={<Loans />} />
            
            {/* Authentication Routes */}
            <Route path="/auth" element={<Auth />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            
            {/* Profile Route */}
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
            
            {/* Property Detail Route */}
            <Route path="/property/:id" element={<PropertyDetails />} />
            
            {/* Protected Routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute requireEmailVerified>
                <Dashboard />
              </ProtectedRoute>
            } />
            
            <Route path="/post-property" element={
              <ProtectedRoute>
                <PostProperty />
              </ProtectedRoute>
            } />
            
            {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }>
            <Route index element={<Admin />} />
            <Route path="properties" element={<AdminProperties />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="analytics" element={<AdminAnalytics />} />
            <Route path="content" element={<AdminContent />} />
            <Route path="leads" element={<AdminLeads />} />
            <Route path="regions" element={<AdminRegions />} />
            <Route path="seo" element={<AdminSEO />} />
            <Route path="audit" element={<AdminAudit />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>
            
            <Route path="/robots.txt" element={<RobotsTxt />} />
            <Route path="/sitemap.xml" element={<SitemapXml />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;

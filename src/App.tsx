
import React, { useState } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
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
import AgentPlans from "./pages/AgentPlans";
import BuilderLifetimePlans from "@/pages/BuilderLifetimePlans";
import ServiceSuite from "@/pages/ServiceSuite";
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
import AdminAuth from "./pages/AdminAuth";
import AdminProtectedRoute from "@/components/AdminProtectedRoute";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminLayout from "@/components/admin/AdminLayout";
import AdminProperties from "./pages/AdminProperties";
import EmployeeManagement from "./pages/EmployeeManagement";
import AdminSettings from "./pages/AdminSettings";
import AdminLogin from "./pages/AdminLogin";
import { AdminAnalytics } from "./pages/AdminAnalytics";
import { AdminContent } from "./pages/AdminContent";
import { AdminLeads } from "./pages/AdminLeads";
import { AdminRegions } from "./pages/AdminRegions";
import { AdminSEO } from "./pages/AdminSEO";
import { AdminAudit } from "./pages/AdminAudit";
import { AdminPageManagement } from "./pages/AdminPageManagement";
import { AdminWebsiteCMS } from "./pages/AdminWebsiteCMS";
import ContentManagementPage from "./pages/ContentManagement";
import NotFound from "./pages/NotFound";
import ScrollToTop from "./components/ScrollToTop";
import GeolocationRedirect from "./components/GeolocationRedirect";

import Architecture from "./pages/Architects";
import Interior from "./pages/Interior";
import Loans from "./pages/Loans";
import HomeSecurityServices from "./pages/HomeSecurityServices";
import AboutSidebar from "./pages/AboutSidebar";
import NRIServices from "./pages/NRIServices";
import NewProjects from "./pages/NewProjects";
import BuyersForum from "./pages/BuyersForum";
import BuyersGuide from "./pages/BuyersGuide";
import SellersGuide from "./pages/SellersGuide";
import NRIGuide from "./pages/NRIGuide";
import NRIQueries from "./pages/NRIQueries";
import RentalHelp from "./pages/RentalHelp";
import RentCalculator from "./pages/RentCalculator";
import BudgetCalculator from "./pages/BudgetCalculator";
import AreaConverter from "./pages/AreaConverter";
import LoanEligibility from "./pages/LoanEligibility";
import RentalGuide from "./pages/RentalGuide";
import LandlordGuide from "./pages/LandlordGuide";
import TenantGuide from "./pages/TenantGuide";
import PropertyDetails from "./pages/PropertyDetails";
import PropertySearch from "./pages/PropertySearch";
import { MyInterests } from "./pages/MyInterests";
import PagePreview from "./pages/PagePreview";
import DynamicPage from "./pages/DynamicPage";
import DeveloperPage from "./pages/DeveloperPage";
import PaymentSuccess from "./pages/payments/Success";
import PaymentFailed from "./pages/payments/Failed";
import PostService from "./pages/PostService";
import { EmployeeDashboard } from "./pages/EmployeeDashboard";

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
        <GeolocationRedirect>
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
        <Route path="/agent-plans" element={<AgentPlans />} />
        <Route path="/builder-lifetime-plans" element={<BuilderLifetimePlans />} />
        <Route path="/service-suite" element={<ServiceSuite />} />
            <Route path="/commercial-owner-plans" element={<CommercialOwnerPlans />} />
          <Route path="/commercial-buyer-plan" element={<CommercialBuyerPlan />} />
          <Route path="/commercial-seller-plans" element={<CommercialSellerPlans />} />
            <Route path="/corporate-enquiry" element={<CorporateEnquiry />} />
            <Route path="/blog" element={<Blog />} />
            
            <Route path="/architects" element={<Architecture />} />
            <Route path="/interior" element={<Interior />} />
            <Route path="/loans" element={<Loans />} />
            <Route path="/home-security-services" element={<HomeSecurityServices />} />
            <Route path="/post-service" element={<PostService />} />
            
            {/* Service Pages */}
            <Route path="/nri-services" element={<NRIServices />} />
            <Route path="/new-projects" element={<NewProjects />} />
            <Route path="/buyers-forum" element={<BuyersForum />} />
            <Route path="/buyers-guide" element={<BuyersGuide />} />
            <Route path="/sellers-guide" element={<SellersGuide />} />
            <Route path="/nri-guide" element={<NRIGuide />} />
            <Route path="/nri-queries" element={<NRIQueries />} />
            <Route path="/rental-help" element={<RentalHelp />} />
            <Route path="/rent-calculator" element={<RentCalculator />} />
            <Route path="/budget-calculator" element={<BudgetCalculator />} />
            <Route path="/area-converter" element={<AreaConverter />} />
            <Route path="/loan-eligibility" element={<LoanEligibility />} />
            <Route path="/rental-guide" element={<RentalGuide />} />
            <Route path="/landlord-guide" element={<LandlordGuide />} />
            <Route path="/tenant-guide" element={<TenantGuide />} />
            
            {/* Authentication Routes */}
            <Route path="/auth" element={<Auth />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            
            {/* Profile Route */}
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
            
            {/* Property Routes */}
            <Route path="/property/:id" element={<PropertyDetails />} />
            <Route path="/search" element={<PropertySearch />} />
            <Route path="/property-search" element={<PropertySearch />} />
            
            {/* My Interests Route */}
            <Route path="/my-interests" element={
              <ProtectedRoute>
                <MyInterests />
              </ProtectedRoute>
            } />
            
            {/* Developer Routes */}
            <Route path="/developer/:developerId" element={<DeveloperPage />} />
            
            {/* Preview Routes */}
            <Route path="/preview/:slug" element={<PagePreview />} />
            
            {/* Protected Routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute requireEmailVerified>
                <Dashboard />
              </ProtectedRoute>
            } />

            <Route path="/employee-dashboard" element={
              <ProtectedRoute requireEmailVerified>
                <EmployeeDashboard />
              </ProtectedRoute>
            } />
            
            <Route path="/post-property" element={
              <ProtectedRoute>
                <PostProperty />
              </ProtectedRoute>
            } />
            
            {/* Admin Routes - Updated */}
            <Route path="/admin/auth" element={<AdminAuth />} />
            <Route path="/admin" element={
              <AdminProtectedRoute>
                <AdminLayout />
              </AdminProtectedRoute>
            }>
              <Route index element={<AdminDashboard />} />
              <Route path="employees" element={<EmployeeManagement />} />
              <Route path="content" element={<ContentManagementPage />} />
              <Route path="analytics" element={<AdminAnalytics />} />
              <Route path="listings" element={<AdminProperties />} />
              <Route path="leads" element={<AdminLeads />} />
              <Route path="featured-properties" element={<Navigate to="/admin/listings" replace />} />
              <Route path="website-cms" element={<AdminWebsiteCMS />} />
              <Route path="regions" element={<AdminRegions />} />
              <Route path="security" element={<AdminAudit />} />
              <Route path="settings" element={<AdminSettings />} />
              <Route path="seo" element={<AdminSEO />} />
            </Route>
            
            <Route path="/robots.txt" element={<RobotsTxt />} />
            <Route path="/sitemap.xml" element={<SitemapXml />} />
            
            {/* Payment Routes */}
            <Route path="/payment/success" element={<PaymentSuccess />} />
            <Route path="/payment/failed" element={<PaymentFailed />} />
            
            {/* Dynamic page route - must be before catch-all */}
            <Route path="/:slug" element={<DynamicPage />} />
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
            </Routes>
            </AuthProvider>
          </BrowserRouter>
        </GeolocationRedirect>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;

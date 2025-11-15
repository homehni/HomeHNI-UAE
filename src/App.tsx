import * as React from 'react';
import { useState } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import Index from "./pages/Index";
import AboutUs from "./pages/AboutUs";
import TermsAndConditions from "./pages/TermsAndConditions";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import CancellationRefunds from "./pages/CancellationRefunds";
import Shipping from "./pages/Shipping";
import LegalCompliance from "./pages/LegalCompliance";
import Careers from "./pages/Careers";
import ContactUs from "./pages/ContactUs";
import Testimonials from "./pages/Testimonials";
import Safety from "./pages/Safety";
import FAQ from "./pages/FAQ";
import GrievanceRedressal from "./pages/GrievanceRedressal";
import ReportProblem from "./pages/ReportProblem";
import SummonsNotices from "./pages/SummonsNotices";
import ReferEarn from "./pages/ReferEarn";
import RentalAgreement from "./pages/RentalAgreement";
import RentReceipts from "./pages/RentReceipts";
import RobotsTxt from "./pages/RobotsTxt";
import Sitemap from "./pages/Sitemap";
import OwnerPlans from "./pages/OwnerPlans";
import BuyerPlans from "./pages/BuyerPlans";
import SellerPlans from "./pages/SellerPlans";
import AgentPlans from "./pages/AgentPlans";
import BuilderDealerPlans from "@/pages/BuilderDealerPlans";
import CommercialOwnerPlans from "./pages/CommercialOwnerPlans";
import CommercialSellerPlans from "./pages/CommercialSellerPlans";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import FindDevelopers from "./pages/FindDevelopers";
import AreaInsights from "./pages/AreaInsights";
import InsightsHub from "./pages/InsightsHub";
import { Auth } from "./pages/Auth";
import { Profile } from "./pages/Profile";
import { DealRoom } from "./pages/DealRoom";
import { VerifyEmail } from "./pages/VerifyEmail";
import { Dashboard } from "./pages/Dashboard";
import { PostProperty } from "./pages/PostProperty";
import { EditPropertyInline } from "./pages/EditPropertyInline";
import { PropertyPreviewPage } from "./pages/PropertyPreviewPage";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import AdminAuth from "./pages/AdminAuth";
import AdminProtectedRoute from "@/components/AdminProtectedRoute";
import AdminDashboard from "./pages/admin/AdminDashboard";
import PropertyStatus from "./pages/admin/PropertyStatus";
import AdminLayout from "@/components/admin/AdminLayout";
import AdminOrEmployeeRoute from "@/components/admin/AdminOrEmployeeRoute";
import { AdminAgents } from "./pages/AdminAgents";
import AdminProperties from "./pages/AdminProperties";
import EmployeeManagement from "./pages/EmployeeManagement";
import AdminSettings from "./pages/AdminSettings";
import AdminLogin from "./pages/AdminLogin";
import { AdminAnalytics } from "./pages/AdminAnalytics";
import { AdminContent } from "./pages/AdminContent";
import { AdminLeads } from "./pages/AdminLeads";
import FinanceOverview from "./pages/admin/FinanceOverview";
import { FinanceProtectedRoute } from "@/components/admin/FinanceProtectedRoute";
import { EmployeeRedirectHandler } from "@/components/admin/EmployeeRedirectHandler";
import { AdminRegions } from "./pages/AdminRegions";
import { AdminSEO } from "./pages/AdminSEO";
// AdminAudit removed
import AdminPageManagement from "./pages/AdminPageManagement";
import { AdminWebsiteCMS } from "./pages/AdminWebsiteCMS";
import ContentManagementPage from "./pages/ContentManagement";
import NotFound from "./pages/NotFound";
import ScrollToTop from "./components/ScrollToTop";
import GeolocationRedirect from "./components/GeolocationRedirect";
import { SettingsProvider } from '@/contexts/SettingsContext';
import MaintenanceGate from '@/components/MaintenanceGate';

import AboutSidebar from "./pages/AboutSidebar";
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
import PagePreview from "./pages/PagePreview";
import DynamicPage from "./pages/DynamicPage";
import PaymentSuccess from "./pages/payments/Success";
import PaymentFailed from "./pages/payments/Failed";
import PostService from "./pages/PostService";
import { EmployeeDashboard } from "./pages/EmployeeDashboard";
import Plans from "./pages/Plans";
import PropertyPlans from "./pages/PropertyPlans";
import Services from "./pages/Services";
import { useUserRegistrationAlerts } from '@/listeners/userRegistrationAlerts';

const RegistrationAlertsActivator: React.FC = () => {
  // This component must be rendered within SettingsProvider
  useUserRegistrationAlerts();
  return null;
};

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
      <ThemeProvider>
      <SettingsProvider>
      {/* Activate alerts under the SettingsProvider so it can read settings context */}
      <RegistrationAlertsActivator />
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <GeolocationRedirect>
          <BrowserRouter>
            <>
              <ScrollToTop />
              <MaintenanceGate>
            <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/about-us" element={<AboutUs />} />
            <Route path="/about" element={<AboutSidebar />} />
            <Route path="/property/:id/plans" element={<PropertyPlans />} />
            <Route path="/plans" element={<Plans />} />
            <Route path="/services" element={<Services />} />
            <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/cancellation-refunds" element={<CancellationRefunds />} />
            <Route path="/shipping" element={<Shipping />} />
            <Route path="/legal-compliance" element={<LegalCompliance />} />
            <Route path="/contact-us" element={<ContactUs />} />
            <Route path="/testimonials" element={<Testimonials />} />
            <Route path="/safety" element={<Safety />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/grievance-redressal" element={<GrievanceRedressal />} />
            <Route path="/report-problem" element={<ReportProblem />} />
            <Route path="/summons-notices" element={<SummonsNotices />} />
            <Route path="/refer-earn" element={<ReferEarn />} />
            <Route path="/rental-agreement" element={<RentalAgreement />} />
            <Route path="/rent-receipts" element={<RentReceipts />} />
            <Route path="/owner-plans" element={<OwnerPlans />} />
            <Route path="/buyer-plans" element={<BuyerPlans />} />
            <Route path="/seller-plans" element={<SellerPlans />} />
        <Route path="/agent-plans" element={<AgentPlans />} />
        <Route path="/builder-dealer-plans" element={<BuilderDealerPlans />} />
            <Route path="/commercial-owner-plans" element={<CommercialOwnerPlans />} />
          <Route path="/commercial-seller-plans" element={<CommercialSellerPlans />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/find-developers" element={<FindDevelopers />} />
            <Route path="/area-insights" element={<AreaInsights />} />
            <Route path="/insights-hub" element={<InsightsHub />} />
            
            <Route path="/post-service" element={
              <ProtectedRoute>
                <PostService />
              </ProtectedRoute>
            } />
            
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
            
            {/* Deal Room Route */}
            <Route path="/deal-room" element={
              <ProtectedRoute>
                <DealRoom />
              </ProtectedRoute>
            } />
            
            {/* Property Routes */}
            {/* SEO-friendly URL format: /property/:slug/:id */}
            <Route path="/property/:slug/:id" element={<PropertyPreviewPage />} />
            {/* Backward compatibility: /property/:id */}
            <Route path="/property/:id" element={<PropertyPreviewPage />} />
            <Route path="/search" element={<PropertySearch />} />
            <Route path="/property-search" element={<PropertySearch />} />
            
            {/* Property Preview Route */}
            <Route path="/buy/preview/:draftId/detail" element={<PropertyPreviewPage />} />
            
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
                <EmployeeRedirectHandler>
                  <EmployeeDashboard />
                </EmployeeRedirectHandler>
              </ProtectedRoute>
            } />
            
            <Route path="/post-property" element={
              <ProtectedRoute>
                <PostProperty />
              </ProtectedRoute>
            } />
            
            <Route path="/edit-property/:propertyId" element={
              <ProtectedRoute>
                <EditPropertyInline />
              </ProtectedRoute>
            } />
            
            {/* Admin Routes - Updated */}
            <Route path="/admin/auth" element={<AdminAuth />} />
<Route path="/admin" element={
  <AdminOrEmployeeRoute>
    <AdminLayout />
  </AdminOrEmployeeRoute>
}>
              <Route index element={<AdminDashboard />} />
              <Route path="property-status" element={<PropertyStatus />} />
              <Route path="employees" element={<EmployeeManagement />} />
              <Route path="content" element={<ContentManagementPage />} />
              <Route path="analytics" element={<AdminAnalytics />} />
              <Route path="listings" element={<AdminProperties />} />
              <Route path="leads" element={<AdminLeads />} />
              <Route path="featured-properties" element={<Navigate to="/admin/listings" replace />} />
              <Route path="website-cms" element={<AdminWebsiteCMS />} />
              <Route path="regions" element={<AdminRegions />} />
              {/* Security & Audit removed */}
              <Route path="settings" element={<AdminSettings />} />
              <Route path="seo" element={<AdminSEO />} />
              <Route path="pages" element={<AdminPageManagement />} />
              <Route path="page-management" element={<Navigate to="/admin/pages" replace />} />
              <Route path="agents" element={<AdminAgents />} />
              
              {/* Finance Routes - Role Protected */}
              <Route path="finance" element={
                <FinanceProtectedRoute>
                  <FinanceOverview />
                </FinanceProtectedRoute>
              } />
              <Route path="finance/payouts" element={
                <FinanceProtectedRoute>
                  <FinanceOverview />
                </FinanceProtectedRoute>
              } />
              <Route path="finance/transactions" element={
                <FinanceProtectedRoute>
                  <FinanceOverview />
                </FinanceProtectedRoute>
              } />
              <Route path="finance/payroll" element={
                <FinanceProtectedRoute>
                  <FinanceOverview />
                </FinanceProtectedRoute>
              } />
              <Route path="finance/reports" element={
                <FinanceProtectedRoute>
                  <FinanceOverview />
                </FinanceProtectedRoute>
              } />
            </Route>
            
            {/* Sitemap Routes */}
            <Route path="/robots.txt" element={<RobotsTxt />} />
            <Route path="/sitemap.xml" element={<Sitemap />} />
            <Route path="/sitemap" element={<Sitemap />} />
            
            {/* Payment Routes */}
            <Route path="/payment/success" element={<PaymentSuccess />} />
            <Route path="/payment/failed" element={<PaymentFailed />} />
            
            {/* Dynamic page route - must be before catch-all */}
            <Route path="/:slug" element={<DynamicPage />} />
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
            </Routes>
              </MaintenanceGate>
            </>
          </BrowserRouter>
        </GeolocationRedirect>
      </TooltipProvider>
      </SettingsProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;

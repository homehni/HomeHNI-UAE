import { useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Marquee from '@/components/Marquee';

const PrivacyPolicy = () => {
  useEffect(() => {
    // Smooth scroll to top when component mounts
    const scrollToTop = () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    };
    
    // Small delay to ensure page is fully loaded
    setTimeout(scrollToTop, 100);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Marquee at the very top */}
      <Marquee />
      
      {/* Header overlapping with content */}
      <Header />
      
      {/* Hero Section with banner image merged with header/marquee */}
      <div className="md:pt-8">
        <div className="relative h-[50vh] overflow-hidden">
          {/* Banner Background */}
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1613490493576-7fde63acd811?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')`,
              backgroundPosition: 'center center'
            }}
          ></div>
          {/* Overlay for better text readability */}
          <div className="absolute inset-0 bg-black/40"></div>
          {/* Title Overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white uppercase tracking-wide drop-shadow-2xl">
              Official Public Policies
            </h1>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto prose prose-lg max-w-none">
            
            <div className="mb-8 text-center border-b pb-4">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">HomeHNI.ae – Official Public Policies</h2>
              <p className="text-gray-600">Last Updated: {new Date().toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</p>
              <p className="text-sm text-gray-500 mt-2">Applies to www.homehni.ae, mobile apps, and all services operated by HomeHNI Portal FZ-LLC, UAE.</p>
            </div>

            {/* 1. Privacy Policy */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Privacy Policy</h2>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-3">1.1 Introduction</h3>
              <p className="text-gray-700 mb-4 leading-relaxed">
                This Privacy Policy explains how HomeHNI collects, uses, stores, and protects personal information. By using HomeHNI services, you consent to the practices described.
              </p>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">1.2 Information We Collect</h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
                <li><strong>Identity & Contact Information:</strong> name, email, phone number, address, identification documents.</li>
                <li><strong>Professional Information:</strong> agent ID, agency licence, builder registration.</li>
                <li><strong>Account Information:</strong> login credentials, preferences, saved searches.</li>
                <li><strong>Property & Transaction Data:</strong> listings, enquiries, notes, documents.</li>
                <li><strong>Payments:</strong> wallet transactions, billing history (payment processing handled by third-party providers).</li>
                <li><strong>Technical Data:</strong> IP, device, browser details, usage statistics.</li>
                <li><strong>Marketing Preferences:</strong> communication and notification choices.</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">1.3 How We Use Your Information</h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
                <li>Provide, operate, and maintain the platform.</li>
                <li>Create and manage user accounts.</li>
                <li>Facilitate communication between buyers, tenants, agents, agencies, and builders.</li>
                <li>Process payments, subscriptions, and packages.</li>
                <li>Analyse usage to improve products and services.</li>
                <li>Detect fraud, enhance security, and ensure regulatory compliance.</li>
                <li>Send alerts, marketing messages, and notifications (with consent).</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">1.4 Sharing of Information</h3>
              <p className="text-gray-700 mb-2 leading-relaxed">We may share information with:</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
                <li>Service providers (hosting, analytics, SMS, payment gateways).</li>
                <li>Agents, agencies, and builders when users submit an enquiry.</li>
                <li>Legal authorities where required.</li>
                <li>Contractors and affiliates under confidentiality obligations.</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">1.5 International Transfers</h3>
              <p className="text-gray-700 mb-4 leading-relaxed">
                Data may be stored or processed outside the UAE using secure and compliant systems.
              </p>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">1.6 Data Retention</h3>
              <p className="text-gray-700 mb-4 leading-relaxed">
                We retain data only for as long as necessary for operations, legal compliance, and dispute resolution.
              </p>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">1.7 User Rights</h3>
              <p className="text-gray-700 mb-4 leading-relaxed">
                Users may request access, correction, deletion, or withdrawal of marketing consent.
              </p>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">1.8 Security Measures</h3>
              <p className="text-gray-700 mb-4 leading-relaxed">
                We use encryption, access controls, monitoring, and industry-standard protections.
              </p>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">1.9 Children</h3>
              <p className="text-gray-700 mb-4 leading-relaxed">
                HomeHNI is not intended for individuals under the age of 18.
              </p>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">1.10 Updates</h3>
              <p className="text-gray-700 mb-4 leading-relaxed">
                We may update this Privacy Policy periodically. The date above reflects the latest version.
              </p>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">1.11 Contact</h3>
              <p className="text-gray-700 mb-4 leading-relaxed">
                <a href="mailto:privacy@homehni.ae" className="text-[#800000] hover:underline">privacy@homehni.ae</a>
              </p>
            </section>

            {/* 2. Cookies Policy */}
            <section className="mb-12 border-t pt-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Cookies Policy</h2>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-3">2.1 Purpose</h3>
              <p className="text-gray-700 mb-4 leading-relaxed">
                HomeHNI uses cookies to improve functionality, performance, and user experience.
              </p>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">2.2 Types of Cookies</h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
                <li><strong>Essential:</strong> security, login, core functionality.</li>
                <li><strong>Analytics:</strong> behaviour tracking and performance.</li>
                <li><strong>Advertising:</strong> personalised marketing, retargeting.</li>
                <li><strong>Preferences:</strong> saved preferences and settings.</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">2.3 Cookie Management</h3>
              <p className="text-gray-700 mb-4 leading-relaxed">
                Users may disable non-essential cookies through browser settings or the HomeHNI cookie banner.
              </p>
            </section>

            {/* 3. Website Terms of Use */}
            <section className="mb-12 border-t pt-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Website Terms of Use</h2>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-3">3.1 Acceptance</h3>
              <p className="text-gray-700 mb-4 leading-relaxed">
                By accessing HomeHNI, you agree to these Terms.
              </p>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">3.2 Permitted Use</h3>
              <p className="text-gray-700 mb-2 leading-relaxed">Users must not:</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
                <li>Misuse the platform or disrupt services.</li>
                <li>Engage in scraping, automated data collection, or security breaches.</li>
                <li>Upload unlawful or fraudulent content.</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">3.3 Intellectual Property</h3>
              <p className="text-gray-700 mb-4 leading-relaxed">
                All content, branding, design, software, and trademarks belong to HomeHNI or its licensors.
              </p>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">3.4 Disclaimers</h3>
              <p className="text-gray-700 mb-4 leading-relaxed">
                HomeHNI does not guarantee accuracy of listings or uninterrupted access.
              </p>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">3.5 Limitation of Liability</h3>
              <p className="text-gray-700 mb-4 leading-relaxed">
                HomeHNI is not liable for losses resulting from use of the platform, downtime, or third-party interactions.
              </p>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">3.6 Governing Law</h3>
              <p className="text-gray-700 mb-4 leading-relaxed">
                UAE laws (Dubai jurisdiction) apply.
              </p>
            </section>

            {/* 4. Member Terms for Agents, Agencies & Builders */}
            <section className="mb-12 border-t pt-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Member Terms for Agents, Agencies & Builders</h2>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-3">4.1 Eligibility</h3>
              <p className="text-gray-700 mb-4 leading-relaxed">
                Members must provide valid business documentation and comply with UAE real estate regulations.
              </p>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">4.2 Responsibilities</h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
                <li>Ensure accuracy of listings and project data.</li>
                <li>Honour enquiry follow-up commitments.</li>
                <li>Maintain licensing and regulatory compliance.</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">4.3 Packages & Payments</h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
                <li>All paid services must be prepaid.</li>
                <li>Billing disputes must be reported within 7 days.</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">4.4 Suspension</h3>
              <p className="text-gray-700 mb-4 leading-relaxed">
                HomeHNI may remove content or suspend accounts for violations.
              </p>
            </section>

            {/* 5. Freelancer Agent Terms */}
            <section className="mb-12 border-t pt-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Freelancer Agent Terms</h2>
              <p className="text-gray-700 mb-2 leading-relaxed"><strong>Freelancer Agents may:</strong></p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
                <li>Create and manage their own listings.</li>
              </ul>
              <p className="text-gray-700 mb-2 leading-relaxed"><strong>They may NOT:</strong></p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
                <li>Add agents or builders.</li>
                <li>Act as a licensed brokerage without proper documentation.</li>
              </ul>
              <p className="text-gray-700 mb-4 leading-relaxed">
                Freelancer listings may carry a specific tag for transparency.
              </p>
            </section>

            {/* 6. Project & Builder Service Terms */}
            <section className="mb-12 border-t pt-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Project & Builder Service Terms</h2>
              <p className="text-gray-700 mb-2 leading-relaxed"><strong>Builders may:</strong></p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
                <li>Add off plan projects and unit inventories.</li>
                <li>Add partner agencies.</li>
              </ul>
              <p className="text-gray-700 mb-2 leading-relaxed"><strong>Builders must:</strong></p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
                <li>Provide RERA-approved project data.</li>
                <li>Maintain accuracy of inventory status and pricing.</li>
              </ul>
            </section>

            {/* 7. Listing & Content Policy */}
            <section className="mb-12 border-t pt-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Listing & Content Policy</h2>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-3">7.1 Allowed Content</h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
                <li>Genuine, available properties.</li>
                <li>Accurate specifications and prices.</li>
                <li>Photos owned or authorised by the uploader.</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">7.2 Prohibited Content</h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
                <li>Fake, misleading or duplicate listings.</li>
                <li>Copyright-infringing photos.</li>
                <li>Offensive or inappropriate text/media.</li>
              </ul>
            </section>

            {/* 8. Acceptable Use & Anti Spam Policy */}
            <section className="mb-12 border-t pt-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Acceptable Use & Anti Spam Policy</h2>
              <p className="text-gray-700 mb-2 leading-relaxed">Users may not:</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
                <li>Send unsolicited messages.</li>
                <li>Use bots or automation.</li>
                <li>Post fraudulent listings.</li>
                <li>Harass or abuse other users.</li>
              </ul>
              <p className="text-gray-700 mb-4 leading-relaxed">
                Violations may result in suspension.
              </p>
            </section>

            {/* 9. Refund, Cancellation & Package Policy */}
            <section className="mb-12 border-t pt-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Refund, Cancellation & Package Policy</h2>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-3">9.1 General</h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
                <li>All advertising packages, featured listings, subscriptions, and wallet credits are prepaid.</li>
                <li>Once activated, services are non-refundable, except as described below.</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">9.2 Featured Listings & Paid Ads</h3>
              <p className="text-gray-700 mb-2 leading-relaxed"><strong>Refunds apply only when:</strong></p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
                <li>A technical issue from HomeHNI prevents the listing from going live.</li>
                <li>A duplicate charge occurs.</li>
              </ul>
              <p className="text-gray-700 mb-2 leading-relaxed"><strong>Refunds do not apply when:</strong></p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
                <li>The user uploaded incorrect content.</li>
                <li>Property becomes unavailable.</li>
                <li>User wishes to cancel mid-term.</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">9.3 Subscription Packages</h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
                <li>Subscriptions renew automatically unless cancelled.</li>
                <li>Cancelation stops the next billing cycle but does not refund unused time.</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">9.4 Wallet Credits</h3>
              <p className="text-gray-700 mb-4 leading-relaxed">
                Wallet credits are non-refundable, non-transferable, and expire after 12 months.
              </p>
            </section>

            {/* 10. Paid Ads Policy (Ranking & Visibility Policy) */}
            <section className="mb-12 border-t pt-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Paid Ads Policy (Ranking & Visibility Policy)</h2>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-3">10.1 Ad Types</h3>
              <p className="text-gray-700 mb-2 leading-relaxed">HomeHNI provides the following advertisement types:</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
                <li><strong>Standard Listing</strong> – Appears in normal search order.</li>
                <li><strong>Featured Listing</strong> – Higher visibility, priority exposure.</li>
                <li><strong>Premium Boost</strong> – Temporarily pushes listing to top.</li>
                <li><strong>Spotlight Projects (Builders)</strong> – Highlighted project microsites.</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">10.2 Ranking Algorithm</h3>
              <p className="text-gray-700 mb-2 leading-relaxed">Ranking considers:</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
                <li>Listing freshness.</li>
                <li>Photo quality.</li>
                <li>Content completeness.</li>
                <li>User behaviour (clicks, saves).</li>
                <li>Compliance score (no duplicates, accuracy).</li>
                <li>Paid promotions.</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">10.3 Ad Expiry</h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
                <li>Featured listings expire based on the package purchased.</li>
                <li>Expired ads revert to standard position.</li>
              </ul>
            </section>

            {/* 11. RERA Compliance Clause */}
            <section className="mb-12 border-t pt-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">11. RERA Compliance Clause (Mandatory in UAE)</h2>
              <p className="text-gray-700 mb-4 leading-relaxed">
                HomeHNI complies with Dubai Land Department (DLD) and RERA regulations.
              </p>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-3">11.1 Agent Obligations</h3>
              <p className="text-gray-700 mb-2 leading-relaxed">Agents must:</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
                <li>Hold valid RERA/BRN IDs.</li>
                <li>Upload only RERA-compliant listings.</li>
                <li>Display correct permit numbers for each listing.</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">11.2 Agency Obligations</h3>
              <p className="text-gray-700 mb-2 leading-relaxed">Agencies must:</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
                <li>Maintain valid trade license & office location.</li>
                <li>Ensure all agents are registered.</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">11.3 Builder Obligations</h3>
              <p className="text-gray-700 mb-2 leading-relaxed">Builders must:</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
                <li>Upload RERA-approved project documentation.</li>
                <li>Provide escrow account details for off-plan projects.</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">11.4 Enforcement</h3>
              <p className="text-gray-700 mb-4 leading-relaxed">
                HomeHNI may remove listings or suspend accounts for regulatory violations.
              </p>
            </section>

            {/* 12. Mobile App Terms */}
            <section className="mb-12 border-t pt-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Mobile App Terms (Apple & Google Compliant)</h2>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-3">12.1 App Store Compliance</h3>
              <p className="text-gray-700 mb-4 leading-relaxed">
                Users downloading the HomeHNI app from Apple App Store or Google Play agree to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
                <li>The terms of this policy.</li>
                <li>App-store-specific rules on disputes, refunds, and in-app purchases.</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">12.2 In-App Purchases</h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
                <li>Payments made through Apple/Google are subject to their refund policies.</li>
                <li>HomeHNI cannot issue direct refunds for in-app purchases.</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">12.3 Device Permissions</h3>
              <p className="text-gray-700 mb-2 leading-relaxed">App may request:</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
                <li>Location for map-based search.</li>
                <li>Camera and photos for listing uploads.</li>
                <li>Notifications for alerts.</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">12.4 App Content Usage</h3>
              <p className="text-gray-700 mb-4 leading-relaxed">
                Users may not reverse engineer, copy or distribute app assets.
              </p>
            </section>

            {/* 13. User Verification / KYC Policy */}
            <section className="mb-12 border-t pt-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">13. User Verification / KYC Policy</h2>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-3">13.1 Required For</h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
                <li>Agents</li>
                <li>Agencies</li>
                <li>Builders</li>
                <li>Freelancer Agents</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">13.2 Documents Required</h3>
              
              <p className="text-gray-700 mb-2 leading-relaxed font-semibold">Agents</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
                <li>Emirates ID</li>
                <li>RERA/BRN ID</li>
                <li>Agency association (if applicable)</li>
              </ul>

              <p className="text-gray-700 mb-2 leading-relaxed font-semibold">Agencies</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
                <li>Trade license</li>
                <li>Office location proof</li>
                <li>Owner/manager ID</li>
              </ul>

              <p className="text-gray-700 mb-2 leading-relaxed font-semibold">Builders</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
                <li>DLD project approvals</li>
                <li>Escrow account certificate</li>
                <li>Trade license</li>
              </ul>

              <p className="text-gray-700 mb-2 leading-relaxed font-semibold">Freelancer Agents</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
                <li>Emirates ID</li>
                <li>Self-declaration of activity</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">13.3 KYC Failure</h3>
              <p className="text-gray-700 mb-2 leading-relaxed">HomeHNI may:</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
                <li>Request additional documents.</li>
                <li>Suspend incomplete profiles.</li>
                <li>Block listings until verification.</li>
              </ul>
            </section>

            {/* 14. Lead Distribution Policy */}
            <section className="mb-12 border-t pt-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">14. Lead Distribution Policy</h2>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-3">14.1 How Leads Are Assigned</h3>
              <p className="text-gray-700 mb-2 leading-relaxed">Leads are distributed based on:</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
                <li>Listing ownership</li>
                <li>Agency or builder partnerships</li>
                <li>Platform algorithms</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">14.2 Lead Sharing</h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
                <li>Agencies may share leads across their team.</li>
                <li>Builders may share leads with partner agencies.</li>
                <li>Freelancers receive leads only for their own listings.</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">14.3 Lead Privacy</h3>
              <p className="text-gray-700 mb-2 leading-relaxed">Lead details may not be:</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
                <li>Shared outside the organisation</li>
                <li>Sold or exported improperly</li>
                <li>Used for spam messaging</li>
              </ul>
            </section>

            {/* 15. Confidentiality / NDA for Business Clients */}
            <section className="mb-12 border-t pt-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">15. Confidentiality / NDA for Business Clients</h2>
              <p className="text-gray-700 mb-2 leading-relaxed">HomeHNI and partners agree to:</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
                <li>Maintain confidentiality of shared business information.</li>
                <li>Use information solely for agreed purposes.</li>
              </ul>
              <p className="text-gray-700 mb-4 leading-relaxed">
                Exclusions apply for publicly known or legally required disclosures.
              </p>
            </section>

            {/* 16. Data Processing / Data Sharing Addendum */}
            <section className="mb-12 border-t pt-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">16. Data Processing / Data Sharing Addendum</h2>
              <p className="text-gray-700 mb-4 leading-relaxed">
                Applicable when HomeHNI handles CRM or customer data for enterprise clients.
              </p>
              <p className="text-gray-700 mb-2 leading-relaxed">Covers:</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
                <li>Roles (controller/processor).</li>
                <li>Sub processing.</li>
                <li>International transfers.</li>
                <li>Data deletion upon contract termination.</li>
              </ul>
            </section>

            {/* 17. KYC / AML & Sanctions Compliance Statement */}
            <section className="mb-12 border-t pt-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">17. KYC / AML & Sanctions Compliance Statement</h2>
              <p className="text-gray-700 mb-2 leading-relaxed">HomeHNI complies with:</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
                <li>UAE AML/CTF laws.</li>
                <li>Dubai Land Department requirements.</li>
                <li>Sanctions screening regulations.</li>
              </ul>
              <p className="text-gray-700 mb-4 leading-relaxed">
                Users may be required to submit proof of identity or property ownership.
              </p>
            </section>

            {/* 18. Copyright & IP / Takedown Policy */}
            <section className="mb-12 border-t pt-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">18. Copyright & IP / Takedown Policy</h2>
              <p className="text-gray-700 mb-4 leading-relaxed">
                Users may request removal of content that infringes intellectual property rights.
              </p>
              <p className="text-gray-700 mb-4 leading-relaxed">
                Submit takedown requests to: <a href="mailto:copyright@homehni.ae" className="text-[#800000] hover:underline">copyright@homehni.ae</a>
              </p>
            </section>

            <div className="mt-12 pt-8 border-t border-gray-200 text-center">
              <p className="text-sm text-gray-500">
                Last updated: {new Date().toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;

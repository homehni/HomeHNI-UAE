
import { useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Marquee from '@/components/Marquee';
import { Mail, Phone, Building } from 'lucide-react';

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
              Privacy Policy
            </h1>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            
            <section className="mb-12">
              <div className="flex items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900"> 1. Information We Collect</h2>
              </div>
              <p className="text-gray-700 mb-4 leading-relaxed">
                We may collect the following types of information:
              </p>
              
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">a. Personal Information</h3>
                <p className="text-gray-700 mb-4 leading-relaxed">
                  When you register, post listings, request services, or contact us, we may collect:
                </p>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <ul className="space-y-3 text-gray-700">
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-brand-red rounded-full mt-3 mr-4 flex-shrink-0"></div>
                      <span>Full Name</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-brand-red rounded-full mt-3 mr-4 flex-shrink-0"></div>
                      <span>Email Address</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-brand-red rounded-full mt-3 mr-4 flex-shrink-0"></div>
                      <span>Phone Number</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-brand-red rounded-full mt-3 mr-4 flex-shrink-0"></div>
                      <span>Residential or Property Address</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-brand-red rounded-full mt-3 mr-4 flex-shrink-0"></div>
                      <span>Identity proof or ownership documents</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-brand-red rounded-full mt-3 mr-4 flex-shrink-0"></div>
                      <span>Property-related data (photos, legal documents, prices, etc.)</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">b. Technical Information</h3>
                <p className="text-gray-700 mb-4 leading-relaxed">
                  When you access our platform, we may collect:
                </p>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <ul className="space-y-3 text-gray-700">
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-brand-red rounded-full mt-3 mr-4 flex-shrink-0"></div>
                      <span>IP address</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-brand-red rounded-full mt-3 mr-4 flex-shrink-0"></div>
                      <span>Browser type and version</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-brand-red rounded-full mt-3 mr-4 flex-shrink-0"></div>
                      <span>Device details</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-brand-red rounded-full mt-3 mr-4 flex-shrink-0"></div>
                      <span>Cookies and tracking data</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-brand-red rounded-full mt-3 mr-4 flex-shrink-0"></div>
                      <span>Time spent on pages and usage patterns</span>
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="mb-12">
              <div className="flex items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900"> 2. How We Use Your Information</h2>
              </div>
              <p className="text-gray-700 mb-4 leading-relaxed">
                Your information is used to:
              </p>
              <div className="bg-blue-50 p-6 rounded-lg">
                <ul className="space-y-3 text-blue-800">
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-3 mr-4 flex-shrink-0"></div>
                    <span>Provide, manage, and improve our services</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-3 mr-4 flex-shrink-0"></div>
                    <span>Contact you for service-related communications</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-3 mr-4 flex-shrink-0"></div>
                    <span>Display property listings and connect buyers/sellers</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-3 mr-4 flex-shrink-0"></div>
                    <span>Process service requests such as legal opinions or consultation</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-3 mr-4 flex-shrink-0"></div>
                    <span>Ensure platform security and prevent fraud</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-3 mr-4 flex-shrink-0"></div>
                    <span>Send marketing updates (only with your consent)</span>
                  </li>
                </ul>
              </div>
            </section>

            <section className="mb-12">
              <div className="flex items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900"> 3. Cookies and Tracking Technologies</h2>
              </div>
              <p className="text-gray-700 mb-4 leading-relaxed">
                We use cookies, pixels, and similar technologies to:
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-green-50 p-6 rounded-lg">
                  <ul className="space-y-2 text-green-700">
                    <li>• Personalize user experience</li>
                    <li>• Track website performance and analytics</li>
                    <li>• Remember user preferences</li>
                    <li>• Serve targeted advertisements</li>
                  </ul>
                </div>
                <div className="bg-yellow-50 p-6 rounded-lg">
                  <p className="text-yellow-800 font-medium">
                    <strong>Note:</strong> You may manage your cookie preferences through your browser settings.
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-12">
              <div className="flex items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900"> 4. Sharing of Information</h2>
              </div>
              <p className="text-gray-700 mb-4 leading-relaxed">
                We do not sell your personal information. However, we may share it with:
              </p>
              <div className="bg-gray-50 p-6 rounded-lg">
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-brand-red rounded-full mt-3 mr-4 flex-shrink-0"></div>
                    <span>Third-party service providers (legal experts, consultants, verification partners) to fulfill your requests</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-brand-red rounded-full mt-3 mr-4 flex-shrink-0"></div>
                    <span>Payment processors to handle secure transactions</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-brand-red rounded-full mt-3 mr-4 flex-shrink-0"></div>
                    <span>Law enforcement authorities, if required by law or legal process</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-brand-red rounded-full mt-3 mr-4 flex-shrink-0"></div>
                    <span>Business affiliates, in the event of a merger, acquisition, or restructuring</span>
                  </li>
                </ul>
              </div>
              <p className="text-gray-700 mt-4 leading-relaxed">
                All third parties are bound to protect your information per contractual obligations.
              </p>
            </section>

            <section className="mb-12">
              <div className="flex items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900"> 5. User Rights</h2>
              </div>
              <p className="text-gray-700 mb-4 leading-relaxed">
                As a user, you have the right to:
              </p>
              <div className="bg-blue-50 p-6 rounded-lg">
                <ul className="space-y-3 text-blue-800">
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-3 mr-4 flex-shrink-0"></div>
                    <span>Access the personal data we hold about you</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-3 mr-4 flex-shrink-0"></div>
                    <span>Request correction of incorrect or outdated information</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-3 mr-4 flex-shrink-0"></div>
                    <span>Request deletion of your data (subject to legal obligations)</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-3 mr-4 flex-shrink-0"></div>
                    <span>Withdraw consent to marketing communications</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-3 mr-4 flex-shrink-0"></div>
                    <span>Object to or restrict processing under certain conditions</span>
                  </li>
                </ul>
              </div>
              <p className="text-gray-700 mt-4 leading-relaxed">
                To exercise these rights, email us at <strong>homehni8@gmail.com</strong>
              </p>
            </section>

            <section className="mb-12">
              <div className="flex items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900"> 6. Data Security</h2>
              </div>
              <p className="text-gray-700 mb-4 leading-relaxed">
                We implement industry-standard security practices to protect your data:
              </p>
              <div className="bg-green-50 p-6 rounded-lg">
                <ul className="space-y-3 text-green-700">
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-3 mr-4 flex-shrink-0"></div>
                    <span>SSL encryption for all data transmission</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-3 mr-4 flex-shrink-0"></div>
                    <span>Secure server storage with restricted access</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-3 mr-4 flex-shrink-0"></div>
                    <span>Regular security audits and firewall protection</span>
                  </li>
                </ul>
              </div>
              <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-lg mt-4">
                <p className="text-yellow-800 leading-relaxed">
                  However, no system is 100% secure. We encourage users to take necessary precautions (e.g., strong passwords, logout after sessions).
                </p>
              </div>
            </section>

            <section className="mb-12">
              <div className="flex items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900"> 7. Data Retention</h2>
              </div>
              <p className="text-gray-700 mb-4 leading-relaxed">
                We retain your information for as long as necessary:
              </p>
              <div className="bg-gray-50 p-6 rounded-lg">
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-brand-red rounded-full mt-3 mr-4 flex-shrink-0"></div>
                    <span>To provide services to you</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-brand-red rounded-full mt-3 mr-4 flex-shrink-0"></div>
                    <span>To comply with legal, accounting, or reporting requirements</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-brand-red rounded-full mt-3 mr-4 flex-shrink-0"></div>
                    <span>To resolve disputes or enforce agreements</span>
                  </li>
                </ul>
              </div>
              <p className="text-gray-700 mt-4 leading-relaxed">
                You may request account deletion by writing to us, subject to verification and compliance checks.
              </p>
            </section>

            <section className="mb-12">
              <div className="flex items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900"> 8. Third-Party Links</h2>
              </div>
              <p className="text-gray-700 mb-4 leading-relaxed">
                Our website may contain links to third-party websites. We are not responsible for their privacy practices. Please review their policies before sharing any information.
              </p>
            </section>

            <section className="mb-12">
              <div className="flex items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900"> 9. Children's Privacy</h2>
              </div>
              <p className="text-gray-700 mb-4 leading-relaxed">
                Our services are not intended for users under the age of 18. We do not knowingly collect data from minors. If we learn that we have unintentionally collected information from a minor, we will promptly delete it.
              </p>
            </section>

            <section className="mb-12">
              <div className="flex items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900"> 10. Updates to This Policy</h2>
              </div>
              <p className="text-gray-700 mb-4 leading-relaxed">
                We may revise this Privacy Policy from time to time. Any changes will be posted on this page with a new effective date. Continued use of the platform after changes means you accept the updated policy.
              </p>
            </section>

            <section className="mb-12">
              <div className="flex items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900"> 11. Contact Us</h2>
              </div>
              <p className="text-gray-700 mb-4 leading-relaxed">
                For questions, concerns, or complaints regarding this Privacy Policy, please contact:
              </p>
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <Mail className="w-8 h-8 mx-auto mb-2 text-primary" />
                    <p className="font-medium text-gray-900">Email</p>
                    <p className="text-gray-600">homehni8@gmail.com</p>
                  </div>
                  <div className="text-center">
                    <Phone className="w-8 h-8 mx-auto mb-2 text-primary" />
                    <p className="font-medium text-gray-900">Phone</p>
                    <p className="text-gray-600">+971 XX XXX XXXX</p>
                  </div>
                  <div className="text-center">
                    <Building className="w-8 h-8 mx-auto mb-2 text-primary" />
                    <p className="font-medium text-gray-900">Address</p>
                    <p className="text-gray-600">HomeHNI UAE<br />Dubai, United Arab Emirates</p>
                  </div>
                </div>
              </div>
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

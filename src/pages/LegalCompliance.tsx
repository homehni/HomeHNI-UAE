import { useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Marquee from '@/components/Marquee';
import { Mail, Phone, Building, FileText, Shield, CreditCard } from 'lucide-react';

const LegalCompliance = () => {
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
              backgroundImage: `url('/lovable-uploads/clean-hero-banner.jpg')`,
              backgroundPosition: 'center center'
            }}
          ></div>
          
          {/* Red Overlay */}
          <div className="absolute inset-0 bg-red-900/70"></div>
          
          {/* Title Overlay */}
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white uppercase tracking-wide drop-shadow-2xl">
              Legal Compliance
            </h1>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            
            <section className="mb-12">
              <div className="flex items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">1. Business Information</h2>
              </div>
              <p className="text-gray-700 mb-4 leading-relaxed">
                HomeHNI Pvt. Ltd. is a registered company providing comprehensive real estate services across India.
              </p>
              <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg">
                <p className="text-blue-800 font-medium">
                  <strong>Company Registration:</strong> HomeHNI Pvt. Ltd. is duly registered under the Companies Act, 2013, and operates in compliance with all applicable Indian laws and regulations.
                </p>
              </div>
            </section>

            <section className="mb-12">
              <div className="flex items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">2. Payment Gateway Compliance</h2>
              </div>
              <p className="text-gray-700 mb-4 leading-relaxed">
                We are committed to maintaining the highest standards of payment security and compliance:
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-green-50 p-6 rounded-lg">
                  <h3 className="font-semibold text-green-800 mb-3">Security Standards</h3>
                  <ul className="space-y-2 text-green-700">
                    <li>• PCI DSS Level 1 Compliant</li>
                    <li>• SSL/TLS Encryption</li>
                    <li>• Secure Payment Processing</li>
                    <li>• Fraud Prevention Measures</li>
                  </ul>
                </div>
                <div className="bg-blue-50 p-6 rounded-lg">
                  <h3 className="font-semibold text-blue-800 mb-3">Payment Partners</h3>
                  <ul className="space-y-2 text-blue-700">
                    <li>• Razorpay Integration</li>
                    <li>• Multiple Payment Options</li>
                    <li>• Real-time Transaction Monitoring</li>
                    <li>• Automated Reconciliation</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="mb-12">
              <div className="flex items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">3. Regulatory Compliance</h2>
              </div>
              <p className="text-gray-700 mb-4 leading-relaxed">
                Our operations are conducted in full compliance with applicable Indian regulations:
              </p>
              <div className="bg-gray-50 p-6 rounded-lg">
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-brand-red rounded-full mt-3 mr-4 flex-shrink-0"></div>
                    <span>Real Estate (Regulation and Development) Act, 2016 (RERA)</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-brand-red rounded-full mt-3 mr-4 flex-shrink-0"></div>
                    <span>Consumer Protection Act, 2019</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-brand-red rounded-full mt-3 mr-4 flex-shrink-0"></div>
                    <span>Information Technology Act, 2000</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-brand-red rounded-full mt-3 mr-4 flex-shrink-0"></div>
                    <span>Personal Data Protection Bill compliance</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-brand-red rounded-full mt-3 mr-4 flex-shrink-0"></div>
                    <span>GST and Tax Compliance</span>
                  </li>
                </ul>
              </div>
            </section>

            <section className="mb-12">
              <div className="flex items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">4. Service Provider Verification</h2>
              </div>
              <p className="text-gray-700 mb-4 leading-relaxed">
                All service providers on our platform undergo rigorous verification:
              </p>
              <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-lg">
                <p className="text-yellow-800 leading-relaxed mb-4">
                  <strong>Verification Process:</strong>
                </p>
                <ul className="space-y-2 text-yellow-700">
                  <li>• Identity verification and background checks</li>
                  <li>• Professional license validation</li>
                  <li>• Business registration verification</li>
                  <li>• Customer feedback and rating monitoring</li>
                  <li>• Regular compliance audits</li>
                </ul>
              </div>
            </section>

            <section className="mb-12">
              <div className="flex items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">5. Dispute Resolution</h2>
              </div>
              <p className="text-gray-700 mb-4 leading-relaxed">
                We have established comprehensive dispute resolution mechanisms:
              </p>
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-brand-red text-white rounded-full flex items-center justify-center font-bold mr-4 flex-shrink-0">1</div>
                    <div>
                      <p className="font-medium text-gray-900">Internal Resolution</p>
                      <p className="text-gray-600">Customer support team handles initial complaints within 24 hours</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-brand-red text-white rounded-full flex items-center justify-center font-bold mr-4 flex-shrink-0">2</div>
                    <div>
                      <p className="font-medium text-gray-900">Escalation Process</p>
                      <p className="text-gray-600">Senior management review for unresolved issues within 48 hours</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-brand-red text-white rounded-full flex items-center justify-center font-bold mr-4 flex-shrink-0">3</div>
                    <div>
                      <p className="font-medium text-gray-900">External Arbitration</p>
                      <p className="text-gray-600">Consumer court or arbitration as per applicable laws</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="mb-12">
              <div className="flex items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">6. Contact Information</h2>
              </div>
              <p className="text-gray-700 mb-4 leading-relaxed">
                For legal and compliance-related queries:
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
                    <p className="text-gray-600">+91 80740 17388</p>
                  </div>
                  <div className="text-center">
                    <Building className="w-8 h-8 mx-auto mb-2 text-primary" />
                    <p className="font-medium text-gray-900">Address</p>
                    <p className="text-gray-600">HOMEHNI PRIVATE LIMITED<br />ΗΝΟ.5.5.558 ABHYUDAYA, NAGAR SAHEB NAGAR, Vanastalipuram, Hayathnagar, Hyderabad- 500070, Telangana</p>
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

export default LegalCompliance;

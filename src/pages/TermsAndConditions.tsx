
import { useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Marquee from '@/components/Marquee';
import { Mail, Phone, Building } from 'lucide-react';

const TermsAndConditions = () => {
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
              backgroundImage: `url('/lovable-uploads/94c2146b-79a1-4541-a959-f1f0c70611e0.png')`,
              backgroundPosition: 'center center'
            }}
          ></div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            
            <section className="mb-12">
              <div className="flex items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900"> 1. Acceptance of Terms</h2>
              </div>
              <p className="text-gray-700 mb-4 leading-relaxed">
                By accessing and using HomeHNI's services, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>
            </section>

            <section className="mb-12">
              <div className="flex items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">2. Use License</h2>
              </div>
              <p className="text-gray-700 mb-4 leading-relaxed">
                Permission is granted to temporarily download one copy of the materials on HomeHNI's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
              </p>
              <div className="bg-gray-50 p-6 rounded-lg">
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-brand-red rounded-full mt-3 mr-4 flex-shrink-0"></div>
                    <span>Modify or copy the materials</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-brand-red rounded-full mt-3 mr-4 flex-shrink-0"></div>
                    <span>Use the materials for any commercial purpose or for any public display</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-brand-red rounded-full mt-3 mr-4 flex-shrink-0"></div>
                    <span>Attempt to reverse engineer any software contained on the website</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-brand-red rounded-full mt-3 mr-4 flex-shrink-0"></div>
                    <span>Remove any copyright or other proprietary notations from the materials</span>
                  </li>
                </ul>
              </div>
            </section>

            <section className="mb-12">
              <div className="flex items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900"> 3. Property Listings</h2>
              </div>
              <p className="text-gray-700 mb-4 leading-relaxed">
                HomeHNI provides property listing services connecting buyers, sellers, and renters. We act as a platform facilitating these connections but do not guarantee the accuracy of property information provided by third parties.
              </p>
              <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg">
                <p className="text-blue-800 font-medium">
                  <strong>Important:</strong> All property details, prices, and availability are subject to change without notice. We recommend verifying all information independently before making any decisions.
                </p>
              </div>
            </section>

            <section className="mb-12">
              <div className="flex items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900"> 4. User Responsibilities</h2>
              </div>
              <p className="text-gray-700 mb-4 leading-relaxed">
                As a user of HomeHNI, you are responsible for:
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-green-50 p-6 rounded-lg">
                  <h3 className="font-semibold text-green-800 mb-3"> What You Should Do</h3>
                  <ul className="space-y-2 text-green-700">
                    <li>• Provide accurate information when creating listings</li>
                    <li>• Comply with local laws and regulations</li>
                    <li>• Respect the rights of other users</li>
                    <li>• Maintain the confidentiality of your account</li>
                  </ul>
                </div>
                <div className="bg-red-50 p-6 rounded-lg">
                  <h3 className="font-semibold text-red-800 mb-3"> What You Should Not Do</h3>
                  <ul className="space-y-2 text-red-700">
                    <li>• Use the platform for fraudulent activities</li>
                    <li>• Post false or misleading information</li>
                    <li>• Harass or spam other users</li>
                    <li>• Violate intellectual property rights</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="mb-12">
              <div className="flex items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900"> 5. Privacy & Data Protection</h2>
              </div>
              <p className="text-gray-700 mb-4 leading-relaxed">
                Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the website. We are committed to protecting your personal information and complying with applicable data protection laws.
              </p>
            </section>

            <section className="mb-12">
              <div className="flex items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900"> 6. Disclaimer</h2>
              </div>
              <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-lg">
                <p className="text-yellow-800 leading-relaxed">
                  The materials on HomeHNI's website are provided on an 'as is' basis. HomeHNI makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
                </p>
              </div>
            </section>

            <section className="mb-12">
              <div className="flex items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900"> 7. Limitations of Liability</h2>
              </div>
              <p className="text-gray-700 mb-4 leading-relaxed">
                In no event shall HomeHNI or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on HomeHNI's website, even if HomeHNI or a HomeHNI authorized representative has been notified orally or in writing of the possibility of such damage.
              </p>
            </section>

            <section className="mb-12">
              <div className="flex items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900"> 8. Modifications & Updates</h2>
              </div>
              <p className="text-gray-700 mb-4 leading-relaxed">
                HomeHNI may revise these terms of service for its website at any time without notice. By using this website, you are agreeing to be bound by the then current version of these terms of service. We will notify users of significant changes through the platform.
              </p>
            </section>

            <section className="mb-12">
              <div className="flex items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900"> 9. Payment Terms</h2>
              </div>
              <p className="text-gray-700 mb-4 leading-relaxed">
                All payments for HomeHNI services are processed securely through our payment partners. By using our services, you agree to the following payment terms:
              </p>
              <div className="bg-green-50 p-6 rounded-lg">
                <h3 className="font-semibold text-green-800 mb-3">Payment Methods</h3>
                <ul className="space-y-2 text-green-700">
                  <li>• Credit/Debit Cards (Visa, MasterCard, RuPay)</li>
                  <li>• Net Banking</li>
                  <li>• UPI Payments</li>
                  <li>• Digital Wallets</li>
                  <li>• EMI Options (where applicable)</li>
                </ul>
              </div>
              <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg mt-4">
                <p className="text-blue-800 font-medium">
                  <strong>Security:</strong> All payment transactions are encrypted and processed through PCI DSS compliant payment gateways. We do not store your payment card details.
                </p>
              </div>
            </section>

            <section className="mb-12">
              <div className="flex items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900"> 10. Service Fees and Charges</h2>
              </div>
              <p className="text-gray-700 mb-4 leading-relaxed">
                HomeHNI offers both free and premium services. Premium services are charged as per our pricing structure:
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="font-semibold text-gray-800 mb-3">Free Services</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Basic property listings</li>
                    <li>• Property search</li>
                    <li>• Basic consultation</li>
                    <li>• Account registration</li>
                  </ul>
                </div>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="font-semibold text-gray-800 mb-3">Premium Services</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Featured property listings</li>
                    <li>• Advanced property reports</li>
                    <li>• Legal services</li>
                    <li>• Property management</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="mb-12">
              <div className="flex items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900"> 11. Governing Law</h2>
              </div>
              <p className="text-gray-700 mb-4 leading-relaxed">
                These terms and conditions are governed by and construed in accordance with the laws of India and you irrevocably submit to the exclusive jurisdiction of the courts in that state or location.
              </p>
            </section>

            <section className="mb-12">
              <div className="flex items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900"> 12. Contact Information</h2>
              </div>
              <p className="text-gray-700 mb-4 leading-relaxed">
                If you have any questions about these Terms & Conditions, please contact us:
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
                    <p className="text-gray-600">+91 8074 017 388</p>
                  </div>
                  <div className="text-center">
                    <Building className="w-8 h-8 mx-auto mb-2 text-primary" />
                    <p className="font-medium text-gray-900">Address</p>
                    <p className="text-gray-600">Plot No: 52 E/P<br />CBI Colony Sahebnagar Kalan</p>
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

export default TermsAndConditions;

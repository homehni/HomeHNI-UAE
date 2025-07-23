
import { useEffect } from 'react';
import { Award, Star, Target, Users } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Marquee from '@/components/Marquee';

const TermsAndConditions = () => {
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Banner with Marquee and Header */}
      <div className="relative w-full h-64 md:h-80 lg:h-96 overflow-hidden">
        <img 
          src="/lovable-uploads/538e373b-acbd-4afc-9969-4e8e6a2530ac.png" 
          alt="Terms and Conditions Banner" 
          className="w-full h-full object-cover"
        />
        
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black/20"></div>
        
        {/* Marquee and Header positioned over the banner */}
        <div className="absolute top-0 left-0 right-0 z-10">
          <Marquee />
          <Header />
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Terms and Conditions</h1>
          
          {/* Introduction */}
          <div className="mb-16">
            <p className="text-lg text-gray-700 leading-relaxed">
              Welcome to HomeHNI. These terms and conditions outline the rules and regulations for the use of HomeHNI's website and services. By accessing this website and using our services, you accept these terms and conditions in full. If you disagree with these terms and conditions or any part of these terms and conditions, you must not use this website.
            </p>
          </div>

          {/* Terms of Use Section */}
          <div className="mb-16">
            <div className="flex items-center mb-8">
              <Star className="w-8 h-8 text-red-600 mr-3" />
              <h2 className="text-3xl font-bold text-gray-900">📋 Terms of Use</h2>
            </div>
            <div className="text-gray-700 leading-relaxed">
              <p className="mb-4">
                The use of this website is subject to the following terms of use:
              </p>
              <ul className="space-y-2 ml-6">
                <li>• You must be at least 18 years old to use our services</li>
                <li>• You agree to provide accurate and complete information</li>
                <li>• You are responsible for maintaining the confidentiality of your account</li>
                <li>• You agree not to use the service for any unlawful purpose</li>
              </ul>
            </div>
          </div>

          {/* Privacy Policy Section */}
          <div className="mb-16">
            <div className="flex items-center mb-8">
              <Award className="w-8 h-8 text-red-600 mr-3" />
              <h2 className="text-3xl font-bold text-gray-900">🔒 Privacy Policy</h2>
            </div>
            <div className="space-y-6">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Data Collection</h3>
                <p className="text-gray-700">
                  We collect information you provide directly to us, such as when you create an account, post a property listing, or contact us for support.
                </p>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Data Usage</h3>
                <p className="text-gray-700">
                  We use the information we collect to provide, maintain, and improve our services, process transactions, and communicate with you.
                </p>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Data Protection</h3>
                <p className="text-gray-700">
                  We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction.
                </p>
              </div>
            </div>
          </div>

          {/* Liability Section */}
          <div className="mb-16">
            <div className="flex items-center mb-8">
              <Target className="w-8 h-8 text-red-600 mr-3" />
              <h2 className="text-3xl font-bold text-gray-900">⚖️ Liability</h2>
            </div>
            <div className="text-gray-700 leading-relaxed">
              <p className="mb-4">
                HomeHNI acts as a platform connecting property owners and seekers. We are not responsible for:
              </p>
              <ul className="space-y-2 ml-6">
                <li>• The accuracy of property listings</li>
                <li>• Disputes between users</li>
                <li>• Financial transactions between users</li>
                <li>• Property condition or legal issues</li>
              </ul>
            </div>
          </div>

          {/* User Responsibilities Section */}
          <div className="mb-16">
            <div className="flex items-center mb-8">
              <Users className="w-8 h-8 text-red-600 mr-3" />
              <h2 className="text-3xl font-bold text-gray-900">👥 User Responsibilities</h2>
            </div>
            <div className="text-gray-700 leading-relaxed">
              <p className="mb-4">As a user of HomeHNI, you agree to:</p>
              <ul className="space-y-2 ml-6">
                <li>• Provide accurate and truthful information in all listings</li>
                <li>• Respect other users and communicate professionally</li>
                <li>• Comply with all applicable laws and regulations</li>
                <li>• Not engage in fraudulent or misleading activities</li>
                <li>• Report any suspicious or inappropriate behavior</li>
              </ul>
            </div>
          </div>

          {/* Modifications Section */}
          <div className="mb-16">
            <div className="flex items-center mb-8">
              <Star className="w-8 h-8 text-red-600 mr-3" />
              <h2 className="text-3xl font-bold text-gray-900">📝 Modifications</h2>
            </div>
            <div className="text-gray-700 leading-relaxed">
              <p>
                HomeHNI reserves the right to modify these terms and conditions at any time. Changes will be effective immediately upon posting on the website. Your continued use of the service after any such changes constitutes your acceptance of the new terms and conditions.
              </p>
            </div>
          </div>

          {/* Contact Information */}
          <div className="mb-16">
            <div className="flex items-center mb-8">
              <Award className="w-8 h-8 text-red-600 mr-3" />
              <h2 className="text-3xl font-bold text-gray-900">📞 Contact Us</h2>
            </div>
            <div className="text-gray-700 leading-relaxed">
              <p>
                If you have any questions about these Terms and Conditions, please contact us through our website or customer support channels.
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

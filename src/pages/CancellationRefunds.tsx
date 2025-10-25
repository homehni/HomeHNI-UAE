import { useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Marquee from '@/components/Marquee';
import { Mail, Phone, Building, Clock, CreditCard, Shield } from 'lucide-react';

const CancellationRefunds = () => {
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
                <h2 className="text-2xl font-bold text-gray-900">1. Cancellation Policy</h2>
              </div>
              <p className="text-gray-700 mb-4 leading-relaxed">
                At HomeHNI, we understand that plans can change. Our cancellation policy is designed to be fair and transparent for all our users.
              </p>
              <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg">
                <p className="text-blue-800 font-medium">
                  <strong>Important:</strong> All cancellations must be requested through our official channels. Cancellation requests are processed within 24-48 hours of receipt.
                </p>
              </div>
            </section>

            <section className="mb-12">
              <div className="flex items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">2. Service Cancellation</h2>
              </div>
              <p className="text-gray-700 mb-4 leading-relaxed">
                You may cancel the following services under the specified conditions:
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-green-50 p-6 rounded-lg">
                  <h3 className="font-semibold text-green-800 mb-3">Property Listings</h3>
                  <ul className="space-y-2 text-green-700">
                    <li>• Free listings can be cancelled anytime</li>
                    <li>• Premium listings cancelled within 24 hours: Full refund</li>
                    <li>• Premium listings cancelled after 24 hours: Pro-rated refund</li>
                    <li>• Featured listings: Cancellation fee may apply</li>
                  </ul>
                </div>
                <div className="bg-blue-50 p-6 rounded-lg">
                  <h3 className="font-semibold text-blue-800 mb-3">Service Bookings</h3>
                  <ul className="space-y-2 text-blue-700">
                    <li>• Legal services: 48-hour cancellation notice</li>
                    <li>• Property management: 30-day notice required</li>
                    <li>• Home services: Same-day cancellation allowed</li>
                    <li>• Consultation services: 24-hour notice</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="mb-12">
              <div className="flex items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">3. Refund Policy</h2>
              </div>
              <p className="text-gray-700 mb-4 leading-relaxed">
                We strive to process refunds quickly and efficiently. Refunds are processed using the same payment method used for the original transaction.
              </p>
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <Clock className="w-8 h-8 mx-auto mb-2 text-primary" />
                    <p className="font-medium text-gray-900">Processing Time</p>
                    <p className="text-gray-600">5-7 business days</p>
                  </div>
                  <div className="text-center">
                    <CreditCard className="w-8 h-8 mx-auto mb-2 text-primary" />
                    <p className="font-medium text-gray-900">Payment Method</p>
                    <p className="text-gray-600">Original payment method</p>
                  </div>
                  <div className="text-center">
                    <Shield className="w-8 h-8 mx-auto mb-2 text-primary" />
                    <p className="font-medium text-gray-900">Security</p>
                    <p className="text-gray-600">100% secure refunds</p>
                  </div>
                </div>
              </div>
            </section>

            <section className="mb-12">
              <div className="flex items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">4. Refund Eligibility</h2>
              </div>
              <p className="text-gray-700 mb-4 leading-relaxed">
                Refunds are available under the following circumstances:
              </p>
              <div className="bg-gray-50 p-6 rounded-lg">
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-brand-red rounded-full mt-3 mr-4 flex-shrink-0"></div>
                    <span>Service not delivered as promised</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-brand-red rounded-full mt-3 mr-4 flex-shrink-0"></div>
                    <span>Technical issues preventing service delivery</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-brand-red rounded-full mt-3 mr-4 flex-shrink-0"></div>
                    <span>Cancellation within the specified time frame</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-brand-red rounded-full mt-3 mr-4 flex-shrink-0"></div>
                    <span>Duplicate payments or billing errors</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-brand-red rounded-full mt-3 mr-4 flex-shrink-0"></div>
                    <span>Service provider cancellation</span>
                  </li>
                </ul>
              </div>
            </section>

            <section className="mb-12">
              <div className="flex items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">5. Non-Refundable Services</h2>
              </div>
              <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-lg">
                <p className="text-yellow-800 leading-relaxed mb-4">
                  The following services are generally non-refundable:
                </p>
                <ul className="space-y-2 text-yellow-700">
                  <li>• Services already completed or delivered</li>
                  <li>• Custom reports or documentation</li>
                  <li>• Third-party service fees</li>
                  <li>• Services cancelled after completion</li>
                  <li>• Administrative fees</li>
                </ul>
              </div>
            </section>

            <section className="mb-12">
              <div className="flex items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">6. How to Request Cancellation/Refund</h2>
              </div>
              <p className="text-gray-700 mb-4 leading-relaxed">
                To request a cancellation or refund, please follow these steps:
              </p>
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-brand-red text-white rounded-full flex items-center justify-center font-bold mr-4 flex-shrink-0">1</div>
                    <div>
                      <p className="font-medium text-gray-900">Contact Support</p>
                      <p className="text-gray-600">Email us at homehni8@gmail.com or call our helpline</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-brand-red text-white rounded-full flex items-center justify-center font-bold mr-4 flex-shrink-0">2</div>
                    <div>
                      <p className="font-medium text-gray-900">Provide Details</p>
                      <p className="text-gray-600">Include your order number, service details, and reason for cancellation</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-brand-red text-white rounded-full flex items-center justify-center font-bold mr-4 flex-shrink-0">3</div>
                    <div>
                      <p className="font-medium text-gray-900">Review Process</p>
                      <p className="text-gray-600">Our team will review your request and respond within 24-48 hours</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-brand-red text-white rounded-full flex items-center justify-center font-bold mr-4 flex-shrink-0">4</div>
                    <div>
                      <p className="font-medium text-gray-900">Refund Processing</p>
                      <p className="text-gray-600">If approved, refund will be processed within 5-7 business days</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="mb-12">
              <div className="flex items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">7. Dispute Resolution</h2>
              </div>
              <p className="text-gray-700 mb-4 leading-relaxed">
                If you are not satisfied with our cancellation or refund decision, you may escalate the matter through our dispute resolution process.
              </p>
              <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-r-lg">
                <p className="text-red-800 font-medium">
                  <strong>Escalation Process:</strong> Contact our customer relations team at homehni8@gmail.com. All disputes are reviewed by our senior management team within 7 business days.
                </p>
              </div>
            </section>

            <section className="mb-12">
              <div className="flex items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">8. Contact Information</h2>
              </div>
              <p className="text-gray-700 mb-4 leading-relaxed">
                For cancellation and refund requests, please contact us:
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

export default CancellationRefunds;

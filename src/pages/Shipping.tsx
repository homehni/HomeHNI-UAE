import { useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Marquee from '@/components/Marquee';
import { Mail, Phone, Building, Truck, MapPin, Clock, Package, Shield } from 'lucide-react';

const Shipping = () => {
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
                <h2 className="text-2xl font-bold text-gray-900">1. Service Delivery Policy</h2>
              </div>
              <p className="text-gray-700 mb-4 leading-relaxed">
                HomeHNI primarily operates as a digital platform connecting property buyers, sellers, and service providers. Our "shipping" refers to the delivery of services rather than physical goods.
              </p>
              <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg">
                <p className="text-blue-800 font-medium">
                  <strong>Important:</strong> Most of our services are delivered digitally or through on-site visits. Physical document delivery is handled by our trusted partners.
                </p>
              </div>
            </section>

            <section className="mb-12">
              <div className="flex items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">2. Digital Service Delivery</h2>
              </div>
              <p className="text-gray-700 mb-4 leading-relaxed">
                The following services are delivered digitally:
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-green-50 p-6 rounded-lg">
                  <h3 className="font-semibold text-green-800 mb-3">Instant Digital Services</h3>
                  <ul className="space-y-2 text-green-700">
                    <li>• Property listings activation</li>
                    <li>• Digital property reports</li>
                    <li>• Online consultation bookings</li>
                    <li>• Property search results</li>
                    <li>• Account verification</li>
                  </ul>
                </div>
                <div className="bg-blue-50 p-6 rounded-lg">
                  <h3 className="font-semibold text-blue-800 mb-3">Scheduled Digital Services</h3>
                  <ul className="space-y-2 text-blue-700">
                    <li>• Property valuation reports (24-48 hours)</li>
                    <li>• Legal document preparation (3-5 days)</li>
                    <li>• Property inspection reports (1-2 days)</li>
                    <li>• Market analysis reports (2-3 days)</li>
                    <li>• Custom property recommendations (24 hours)</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="mb-12">
              <div className="flex items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">3. Physical Document Delivery</h2>
              </div>
              <p className="text-gray-700 mb-4 leading-relaxed">
                For services requiring physical document delivery, we partner with reliable courier services:
              </p>
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <Truck className="w-8 h-8 mx-auto mb-2 text-primary" />
                    <p className="font-medium text-gray-900">Delivery Time</p>
                    <p className="text-gray-600">2-5 business days</p>
                  </div>
                  <div className="text-center">
                    <MapPin className="w-8 h-8 mx-auto mb-2 text-primary" />
                    <p className="font-medium text-gray-900">Coverage</p>
                    <p className="text-gray-600">Pan India</p>
                  </div>
                  <div className="text-center">
                    <Shield className="w-8 h-8 mx-auto mb-2 text-primary" />
                    <p className="font-medium text-gray-900">Security</p>
                    <p className="text-gray-600">Tracked delivery</p>
                  </div>
                </div>
              </div>
            </section>

            <section className="mb-12">
              <div className="flex items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">4. Service Delivery Timeline</h2>
              </div>
              <p className="text-gray-700 mb-4 leading-relaxed">
                Our service delivery timelines are designed to meet your needs efficiently:
              </p>
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-brand-red text-white rounded-full flex items-center justify-center font-bold mr-4 flex-shrink-0">1</div>
                    <div>
                      <p className="font-medium text-gray-900">Property Listing Services</p>
                      <p className="text-gray-600">Immediate activation upon approval</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-brand-red text-white rounded-full flex items-center justify-center font-bold mr-4 flex-shrink-0">2</div>
                    <div>
                      <p className="font-medium text-gray-900">Legal Services</p>
                      <p className="text-gray-600">3-5 business days for document preparation</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-brand-red text-white rounded-full flex items-center justify-center font-bold mr-4 flex-shrink-0">3</div>
                    <div>
                      <p className="font-medium text-gray-900">Property Management</p>
                      <p className="text-gray-600">Service begins within 48 hours of agreement</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-brand-red text-white rounded-full flex items-center justify-center font-bold mr-4 flex-shrink-0">4</div>
                    <div>
                      <p className="font-medium text-gray-900">Home Services</p>
                      <p className="text-gray-600">Scheduled as per customer preference</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="mb-12">
              <div className="flex items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">5. Delivery Areas</h2>
              </div>
              <p className="text-gray-700 mb-4 leading-relaxed">
                We provide services across major Indian cities with plans to expand:
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-green-50 p-6 rounded-lg">
                  <h3 className="font-semibold text-green-800 mb-3">Primary Service Areas</h3>
                  <ul className="space-y-2 text-green-700">
                    <li>• Bangalore</li>
                    <li>• Mumbai</li>
                    <li>• Delhi/NCR</li>
                    <li>• Hyderabad</li>
                    <li>• Pune</li>
                    <li>• Chennai</li>
                  </ul>
                </div>
                <div className="bg-blue-50 p-6 rounded-lg">
                  <h3 className="font-semibold text-blue-800 mb-3">Expanding Service Areas</h3>
                  <ul className="space-y-2 text-blue-700">
                    <li>• Kolkata</li>
                    <li>• Ahmedabad</li>
                    <li>• Kochi</li>
                    <li>• Jaipur</li>
                    <li>• Chandigarh</li>
                    <li>• Indore</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="mb-12">
              <div className="flex items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">6. Service Quality Assurance</h2>
              </div>
              <p className="text-gray-700 mb-4 leading-relaxed">
                We maintain high standards for all our service deliveries:
              </p>
              <div className="bg-gray-50 p-6 rounded-lg">
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-brand-red rounded-full mt-3 mr-4 flex-shrink-0"></div>
                    <span>All services are verified before delivery</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-brand-red rounded-full mt-3 mr-4 flex-shrink-0"></div>
                    <span>Quality checks at every stage</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-brand-red rounded-full mt-3 mr-4 flex-shrink-0"></div>
                    <span>Customer satisfaction tracking</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-brand-red rounded-full mt-3 mr-4 flex-shrink-0"></div>
                    <span>Regular service provider audits</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-brand-red rounded-full mt-3 mr-4 flex-shrink-0"></div>
                    <span>Continuous improvement processes</span>
                  </li>
                </ul>
              </div>
            </section>

            <section className="mb-12">
              <div className="flex items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">7. Delivery Tracking</h2>
              </div>
              <p className="text-gray-700 mb-4 leading-relaxed">
                Track your service delivery status through multiple channels:
              </p>
              <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-lg">
                <p className="text-yellow-800 leading-relaxed mb-4">
                  <strong>Tracking Options:</strong>
                </p>
                <ul className="space-y-2 text-yellow-700">
                  <li>• Email notifications at each stage</li>
                  <li>• SMS updates for urgent services</li>
                  <li>• Dashboard tracking for registered users</li>
                  <li>• Customer support helpline</li>
                  <li>• WhatsApp updates (where applicable)</li>
                </ul>
              </div>
            </section>

            <section className="mb-12">
              <div className="flex items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">8. Contact Information</h2>
              </div>
              <p className="text-gray-700 mb-4 leading-relaxed">
                For delivery-related queries and support:
              </p>
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <Mail className="w-8 h-8 mx-auto mb-2 text-primary" />
                    <p className="font-medium text-gray-900">Email</p>
                    <p className="text-gray-600">delivery@homehni.com</p>
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

export default Shipping;

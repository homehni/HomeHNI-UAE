
import { useEffect } from 'react';
import { Award, Star, Target, Users } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Marquee from '@/components/Marquee';

const AboutUs = () => {
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
          alt="About Us Banner" 
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
          {/* Introduction */}
          <div className="mb-16">
            <p className="text-lg text-gray-700 leading-relaxed">
              At HomeHNI, we believe in empowering you with seamless, transparent, and direct access to premium property listings—without the middlemen. Guided by the principle of "making real estate simple for everyone", our mission is to transform the way you buy, sell, or rent by removing unnecessary barriers and fostering trust.
            </p>
          </div>

          {/* Our Story Section */}
          <div className="mb-16">
            <div className="flex items-center mb-8">
              <Star className="w-8 h-8 text-red-600 mr-3" />
              <h2 className="text-3xl font-bold text-gray-900">🌟 Our Story</h2>
            </div>
            <div className="text-gray-700 leading-relaxed">
              <p>
                Founded by real-estate enthusiasts who were frustrated with hidden fees and confusing broker hierarchies, we set out to build a platform that puts you in control. Following in the footsteps of trailblazers like 99acres—whose portal serves millions across India—and embracing NoBroker's model of fairness and direct connection, we combine technology and user-centric design to simplify property searches.
              </p>
            </div>
          </div>

          {/* What Makes Us Different Section */}
          <div className="mb-16">
            <div className="flex items-center mb-8">
              <Award className="w-8 h-8 text-red-600 mr-3" />
              <h2 className="text-3xl font-bold text-gray-900">🛠 What Makes Us Different</h2>
            </div>
            <div className="space-y-6">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Zero Brokerage, Zero Hassle</h3>
                <p className="text-gray-700">
                  Enjoy a broker-free marketplace where property owners and seekers connect directly—no hidden charges, no negotiation drama.
                </p>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Verified Listings Only</h3>
                <p className="text-gray-700">
                  Every listing is hand-reviewed to ensure accuracy, authenticity, and clarity—so you can trust what you see.
                </p>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Smart Tools & Transparency</h3>
                <p className="text-gray-700">
                  With intuitive filters, clear pricing, and rich media previews, you can find your ideal space from the comfort of your home.
                </p>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Customer-First Service</h3>
                <p className="text-gray-700">
                  Our friendly support team is here to help—offering assistance without upselling or pushy sales tactics.
                </p>
              </div>
            </div>
          </div>

          {/* Our Vision Section */}
          <div className="mb-16">
            <div className="flex items-center mb-8">
              <Target className="w-8 h-8 text-red-600 mr-3" />
              <h2 className="text-3xl font-bold text-gray-900">🎯 Our Vision</h2>
            </div>
            <div className="text-gray-700 leading-relaxed">
              <p>
                To become India's most reliable and user-first real estate destination—where every interaction is transparent, every property is accurate, and every user feels in control.
              </p>
            </div>
          </div>

          {/* Join Our Community Section */}
          <div className="mb-16">
            <div className="flex items-center mb-8">
              <Users className="w-8 h-8 text-red-600 mr-3" />
              <h2 className="text-3xl font-bold text-gray-900">🤝 Join Our Community</h2>
            </div>
            <div className="text-gray-700 leading-relaxed">
              <p>
                Whether you're selling your home, hunting for a dream space, or exploring rentals, HomeHNI is built around you—no brokers, no gimmicks, just a human-centered experience.
              </p>
            </div>
          </div>

          {/* Why HomeHNI Section */}
          <div className="mb-16">
            <div className="flex items-center mb-8">
              <Star className="w-8 h-8 text-red-600 mr-3" />
              <h2 className="text-3xl font-bold text-gray-900">Why HomeHNI?</h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="w-2 h-2 bg-red-600 rounded-full mt-3 mr-4 flex-shrink-0"></div>
                <p className="text-gray-700">
                  Modeled on the success of 99acres.com, a trusted name since 2005
                </p>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-red-600 rounded-full mt-3 mr-4 flex-shrink-0"></div>
                <p className="text-gray-700">
                  Inspired by NoBroker's mission to eliminate unnecessary middlemen
                </p>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-red-600 rounded-full mt-3 mr-4 flex-shrink-0"></div>
                <p className="text-gray-700">
                  Committed to delivering honest, accurate listings and empathetic support
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AboutUs;

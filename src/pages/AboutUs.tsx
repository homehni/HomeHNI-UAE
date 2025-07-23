
import { Award, Star } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Marquee from '@/components/Marquee';
import { useEffect } from 'react';

const AboutUs = () => {
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
      
      {/* Hero Section with new banner image merged with header/marquee */}
      <div className="pt-8">
        <div className="relative h-[50vh] overflow-hidden">
          {/* New Banner Background */}
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url('/lovable-uploads/43d4891e-82e4-406d-9a77-308cbaa66a93.png')`,
              backgroundPosition: 'center center'
            }}
          ></div>
          
          {/* Content overlay - removed "About Us" text and GA logo */}
          <div className="relative z-10 flex items-center justify-center h-full">
            {/* Empty content area - hero section now only shows the banner */}
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            {/* Introduction */}
            <div className="mb-16">
              <p className="text-lg text-gray-700 leading-relaxed mb-8">
                At HomeHNI, we believe in empowering you with seamless, transparent, and direct access to premium property listings—without the middlemen. Guided by the principle of "making real estate simple for everyone", our mission is to transform the way you buy, sell, or rent by removing unnecessary barriers and fostering trust.
              </p>
            </div>

            {/* Our Story Section */}
            <div className="mb-16">
              <div className="flex items-center mb-8">
                <Star className="w-8 h-8 text-red-600 mr-3" />
                <h2 className="text-3xl font-bold text-gray-900">🌟 Our Story</h2>
              </div>
              <div className="space-y-6 text-gray-700">
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
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Zero Brokerage, Zero Hassle</h3>
                  <p className="text-gray-700">Enjoy a broker-free marketplace where property owners and seekers connect directly—no hidden charges, no negotiation drama.</p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Verified Listings Only</h3>
                  <p className="text-gray-700">Every listing is hand-reviewed to ensure accuracy, authenticity, and clarity—so you can trust what you see.</p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Smart Tools & Transparency</h3>
                  <p className="text-gray-700">With intuitive filters, clear pricing, and rich media previews, you can find your ideal space from the comfort of your home.</p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Customer-First Service</h3>
                  <p className="text-gray-700">Our friendly support team is here to help—offering assistance without upselling or pushy sales tactics.</p>
                </div>
              </div>
            </div>

            {/* Our Vision Section */}
            <div className="mb-16">
              <div className="flex items-center mb-8">
                <Star className="w-8 h-8 text-red-600 mr-3" />
                <h2 className="text-3xl font-bold text-gray-900">🎯 Our Vision</h2>
              </div>
              <p className="text-gray-700 text-lg">
                To become India's most reliable and user-first real estate destination—where every interaction is transparent, every property is accurate, and every user feels in control.
              </p>
            </div>

            {/* Join Our Community Section */}
            <div className="mb-16">
              <div className="flex items-center mb-8">
                <Award className="w-8 h-8 text-red-600 mr-3" />
                <h2 className="text-3xl font-bold text-gray-900">🤝 Join Our Community</h2>
              </div>
              <p className="text-gray-700 text-lg">
                Whether you're selling your home, hunting for a dream space, or exploring rentals, HomeHNI is built around you—no brokers, no gimmicks, just a human-centered experience.
              </p>
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
                  <p className="text-gray-700">Modeled on the success of 99acres.com, a trusted name since 2005</p>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-red-600 rounded-full mt-3 mr-4 flex-shrink-0"></div>
                  <p className="text-gray-700">Inspired by NoBroker's mission to eliminate unnecessary middlemen</p>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-red-600 rounded-full mt-3 mr-4 flex-shrink-0"></div>
                  <p className="text-gray-700">Committed to delivering honest, accurate listings and empathetic support</p>
                </div>
              </div>
            </div>

            {/* Single Facebook Social Media Section */}
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Follow us on Facebook:</h3>
              <div className="flex justify-center">
                <a
                  href="https://www.facebook.com/profile.php?id=61578319572154"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-transform hover:scale-110"
                  style={{ color: "#1877F2" }}
                >
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
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

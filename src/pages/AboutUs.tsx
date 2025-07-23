import { Award, Star } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const AboutUs = () => {
  const awards = [
    "PropTech Mobile App of the Year Award 2019",
    "99acres.com won the award for 'Personalized User Journey'",
    "Best Mobile Appies Award 2015", 
    "99acres.com won the award for having the 'Most Innovative Mobile App' in the real estate category",
    "CMO ASIA Awards 2012",
    "99acres.com was awarded the 'Most Admired Real Estate Website of the Year' at the 3rd CMO Asia Awards for excellence in the real estate segment.",
    "BCI Awards 2012",
    "99acres.com was recognised as the 'Best Real Estate Portal' in 2012.",
    "Accommodation Times Awards 2012",
    "99acres.com was announced the 'Best Online Realty Portal' by the Accommodation Times in 2012."
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="pt-20">
        {/* Hero Section with City Skyline Background */}
        <div className="relative bg-gradient-to-b from-red-600 to-red-700 text-white py-16 overflow-hidden">
          {/* City Skyline Background */}
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40"
            style={{
              backgroundImage: `url('/lovable-uploads/68165188-72aa-4757-a0fa-fc2b785a86ca.png')`,
              backgroundPosition: 'bottom center'
            }}
          ></div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center">
                  <div className="text-white text-2xl font-bold">5A</div>
                </div>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">About Us</h1>
              <p className="text-xl opacity-90 max-w-2xl mx-auto">
                India's Leading Property Portal - Connecting Dreams with Reality
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            {/* Introduction */}
            <div className="mb-16">
              <p className="text-lg text-gray-700 leading-relaxed">
                Launched in 2005, 99acres.com, India's No. 1 property portal, deals with every aspect of the consumers' needs in the real estate industry. It is an online forum where buyers, sellers and brokers/agents can exchange information about real estate properties quickly, effectively and inexpensively. At 99acres.com, you can advertise a property, search for a property, browse through properties, build your own property microsite, and keep yourself updated with the latest news and trends making headlines in the realty sector.
              </p>
            </div>

            {/* Why Section */}
            <div className="mb-16">
              <div className="flex items-center mb-8">
                <Star className="w-8 h-8 text-red-600 mr-3" />
                <h2 className="text-3xl font-bold text-gray-900">Why 99acres.com?</h2>
              </div>
              <div className="space-y-6 text-gray-700">
                <p>
                  At present, 99acres.com prides itself for having around nine lakh property listings spanning across 600+ cities in India. Of all, the website held over 5.7 lakh paid listings at the end of FY 2018-19. In addition to providing an online platform to real estate developers, brokers and property owners for listing their property for sale, purchase or rent, 99acres.com offers advertisement stints such as microsites, banners, home page links and project pages to the clients for better visibility and branding in the market.
                </p>
                <p>
                  With the ever-evolving online search behaviour, 99acres.com shares updated information pertinent to real estate activities, assisting prospective buyers to make informed buying decision. We make online property search easier, quicker and smarter!
                </p>
              </div>
            </div>

            {/* Awards Section */}
            <div className="mb-16">
              <div className="flex items-center mb-8">
                <Award className="w-8 h-8 text-red-600 mr-3" />
                <h2 className="text-3xl font-bold text-gray-900">Awards & Recognitions</h2>
              </div>
              <div className="space-y-4">
                {awards.map((award, index) => (
                  <div key={index} className="flex items-start">
                    <div className="w-2 h-2 bg-red-600 rounded-full mt-3 mr-4 flex-shrink-0"></div>
                    <p className="text-gray-700">{award}</p>
                  </div>
                ))}
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

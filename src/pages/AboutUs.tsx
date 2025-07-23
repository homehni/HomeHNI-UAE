
import { Award, Star } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Marquee from '@/components/Marquee';

const AboutUs = () => {
  const awards = [
    "PropTech Mobile App of the Year Award 2019",
    "homehni.com won the award for 'Personalized User Journey'",
    "Best Mobile Appies Award 2015", 
    "homehni.com won the award for having the 'Most Innovative Mobile App' in the real estate category",
    "CMO ASIA Awards 2012",
    "homehni.com was awarded the 'Most Admired Real Estate Website of the Year' at the 3rd CMO Asia Awards for excellence in the real estate segment.",
    "BCI Awards 2012",
    "homehni.com was recognised as the 'Best Real Estate Portal' in 2012.",
    "Accommodation Times Awards 2012",
    "homehni.com was announced the 'Best Online Realty Portal' by the Accommodation Times in 2012."
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Marquee />
      
      {/* Hero Section with New Banner */}
      <div className="relative" id="about-section">
        <div 
          className="h-96 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('/lovable-uploads/54c60425-c16a-4621-a337-c5ce511ba22b.png')`,
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-30"></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Introduction */}
          <div className="mb-16">
            <p className="text-lg text-gray-700 leading-relaxed">
              Launched in 2005, homehni.com, India's No. 1 property portal, deals with every aspect of the consumers' needs in the real estate industry. It is an online forum where buyers, sellers and brokers/agents can exchange information about real estate properties quickly, effectively and inexpensively. At homehni.com, you can advertise a property, search for a property, browse through properties, build your own property microsite, and keep yourself updated with the latest news and trends making headlines in the realty sector.
            </p>
          </div>

          {/* Why Section */}
          <div className="mb-16">
            <div className="flex items-center mb-8">
              <Star className="w-8 h-8 text-red-600 mr-3" />
              <h2 className="text-3xl font-bold text-gray-900">Why homehni.com?</h2>
            </div>
            <div className="space-y-6 text-gray-700">
              <p>
                At present, homehni.com prides itself for having around nine lakh property listings spanning across 600+ cities in India. Of all, the website held over 5.7 lakh paid listings at the end of FY 2018-19. In addition to providing an online platform to real estate developers, brokers and property owners for listing their property for sale, purchase or rent, homehni.com offers advertisement stints such as microsites, banners, home page links and project pages to the clients for better visibility and branding in the market.
              </p>
              <p>
                With the ever-evolving online search behaviour, homehni.com shares updated information pertinent to real estate activities, assisting prospective buyers to make informed buying decision. We make online property search easier, quicker and smarter!
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
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AboutUs;

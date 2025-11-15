import { MapPin, Phone, Mail, Facebook, Twitter, Instagram, Linkedin, ChevronRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useState } from 'react';
import { useCMSContent } from '@/hooks/useCMSContent';
import mortgeaseLogo from '@/assets/mortgease-logo.jpg';
interface FooterProps {
  searchSectionRef?: React.RefObject<{
    focusSearchInput: () => void;
  }>;
}
const Footer = ({
  searchSectionRef
}: FooterProps) => {
  const { content: cmsContent } = useCMSContent('footer_content');
  const {
    user
  } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Properties & Flats for Sale');
  const [activeServicesTab, setActiveServicesTab] = useState('Buy');
  
  const handlePostPropertyClick = () => {
    if (user) {
      navigate('/post-property');
    } else {
      navigate('/auth?redirectTo=/post-property');
    }
  };
  const handleFindNowClick = () => {
    const heroSearchElement = document.getElementById('hero-search');
    if (heroSearchElement) {
      heroSearchElement.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
      // Focus the search input after scrolling
      if (searchSectionRef?.current) {
        searchSectionRef.current.focusSearchInput();
      }
    } else {
      // If not on home page, navigate to home page then scroll
      navigate('/', {
        state: {
          scrollToSearch: true
        }
      });
    }
  };
  const propertyListings = [{
    title: "Properties & Flats for Sale",
    cityData: {
      "Properties for Sale in Dubai": ["Apartments for Sale in Dubai Marina", "Villas for Sale in Palm Jumeirah", "Properties for Sale in Downtown Dubai", "Apartments for Sale in Business Bay", "Villas for Sale in Arabian Ranches", "Properties for Sale in Jumeirah", "Apartments for Sale in Dubai Hills", "Properties for Sale in Dubai Creek", "Luxury Properties in Dubai", "Properties Below 1M AED in Dubai"],
      "Properties for Sale in Abu Dhabi": ["Apartments for Sale in Yas Island", "Villas for Sale in Saadiyat Island", "Properties for Sale in Al Reem Island", "Apartments for Sale in Corniche", "Villas for Sale in Al Raha", "Properties for Sale in Khalifa City", "Luxury Properties in Abu Dhabi", "Properties Below 800K AED in Abu Dhabi"],
      "Properties for Sale in Sharjah": ["Apartments for Sale in Al Qasimia", "Villas for Sale in Al Khan", "Properties for Sale in Al Majaz", "Apartments for Sale in Al Nahda", "Properties for Sale in Sharjah", "Properties Below 500K AED in Sharjah"]
    }
  }, {
    title: "Flats for Rent",
    cityData: {
      "Properties for Rent in Dubai": ["Apartments for Rent in Dubai Marina", "Villas for Rent in Palm Jumeirah", "Properties for Rent in Downtown Dubai", "Apartments for Rent in Business Bay", "1 BHK for Rent in Dubai", "2 BHK for Rent in Dubai", "3 BHK for Rent in Dubai", "Studio Apartments in Dubai"],
      "Properties for Rent in Abu Dhabi": ["Apartments for Rent in Yas Island", "Villas for Rent in Saadiyat Island", "Properties for Rent in Al Reem Island", "1 BHK for Rent in Abu Dhabi", "2 BHK for Rent in Abu Dhabi", "3 BHK for Rent in Abu Dhabi"],
      "Properties for Rent in Sharjah": ["Apartments for Rent in Al Qasimia", "Villas for Rent in Al Khan", "1 BHK for Rent in Sharjah", "2 BHK for Rent in Sharjah", "3 BHK for Rent in Sharjah"]
    }
  }, {
    title: "Commercial Properties",
    cityData: {
      "Commercial in Dubai": ["Office Space for Rent in Dubai", "Retail Space for Sale in Dubai", "Warehouse for Rent in Dubai", "Co-working Spaces in Dubai", "Business Centers in Dubai"],
      "Commercial in Abu Dhabi": ["Office Space for Rent in Abu Dhabi", "Retail Space for Sale in Abu Dhabi", "Warehouse for Rent in Abu Dhabi"],
      "Commercial in Sharjah": ["Office Space for Rent in Sharjah", "Retail Space for Sale in Sharjah"]
    }
  }, {
    title: "Luxury Properties",
    cityData: {
      "Luxury in Dubai": ["Luxury Villas in Dubai", "Premium Apartments in Dubai", "Penthouses in Dubai", "Waterfront Properties in Dubai", "Gated Communities in Dubai"],
      "Luxury in Abu Dhabi": ["Luxury Villas in Abu Dhabi", "Premium Apartments in Abu Dhabi", "Penthouses in Abu Dhabi"],
      "Investment Properties": ["Investment Properties in Dubai", "Investment Properties in Abu Dhabi", "High ROI Properties in UAE", "Pre-launch Projects in UAE"]
    }
  }];

  const tabs = propertyListings.map(section => section.title);

  const getActiveTabData = () => {
    const activeSection = propertyListings.find(section => section.title === activeTab);
    return activeSection ? activeSection.cityData : {};
  };
  const cityListings = [{
    title: "Properties for Sale in Dubai",
    links: ["Apartments for Sale in Dubai Marina", "Villas for Sale in Palm Jumeirah", "Properties for Sale in Downtown Dubai", "Luxury Properties in Dubai"]
  }, {
    title: "Properties for Sale in Abu Dhabi",
    links: ["Apartments for Sale in Yas Island", "Villas for Sale in Saadiyat Island", "Properties for Sale in Al Reem Island", "Luxury Properties in Abu Dhabi"]
  }, {
    title: "Properties for Sale in Sharjah",
    links: ["Apartments for Sale in Al Qasimia", "Villas for Sale in Al Khan", "Properties for Sale in Al Majaz"]
  }, {
    title: "Properties for Rent in UAE",
    links: ["Properties for Rent in Dubai", "Properties for Rent in Abu Dhabi", "Properties for Rent in Sharjah", "Properties for Rent in Ajman"]
  }];
  const handleLinkClick = (linkText: string) => {
    // Check for services with dedicated pages first
    const serviceRoutes = {
      'Rental Agreement': '/rental-agreement',
      'Refer and Earn': '/refer-earn',
      'Pay Rent': '/rent-receipts',
      'New Builder Project': '/new-projects',
      'Property Buyers Forum': '/buyers-forum',
      'Property Buyers Guide': '/buyers-guide',
      'Property Seller Guide': '/sellers-guide',
      'NRI Real Estate Guide': '/nri-guide',
      'NRI Real Estate Queries': '/nri-queries',
      'Rental Questions': '/rental-help',
      'Rent Calculator': '/rent-calculator',
      'Property Rental Guide': '/rental-guide',
      'Landlord Guide': '/landlord-guide',
      'Tenant Guide': '/tenant-guide'
    };

    // If the service has a dedicated page, navigate there
    if (serviceRoutes[linkText as keyof typeof serviceRoutes]) {
      navigate(serviceRoutes[linkText as keyof typeof serviceRoutes]);
      return;
    }

    // Otherwise, extract location and property type information from the link text
    const searchParams = new URLSearchParams();
    
    // Determine search type based on link content
    if (linkText.toLowerCase().includes('rent')) {
      searchParams.set('type', 'rent');
    } else if (linkText.toLowerCase().includes('sale') || linkText.toLowerCase().includes('buy')) {
      searchParams.set('type', 'buy');
    }
    
    // Extract location if mentioned
    const locationKeywords = ['bangalore', 'mumbai', 'delhi', 'pune', 'chennai', 'hyderabad', 'noida', 'gurgaon'];
    const foundLocation = locationKeywords.find(keyword => 
      linkText.toLowerCase().includes(keyword)
    );
    
    if (foundLocation) {
      searchParams.set('location', foundLocation);
    }
    
    // Extract property type
    if (linkText.toLowerCase().includes('flat') || linkText.toLowerCase().includes('apartment')) {
      searchParams.set('propertyType', 'Flat/Apartment');
    } else if (linkText.toLowerCase().includes('villa')) {
      searchParams.set('propertyType', 'Villa');
    } else if (linkText.toLowerCase().includes('plot')) {
      searchParams.set('propertyType', 'Plots');
    } else if (linkText.toLowerCase().includes('independent house')) {
      searchParams.set('propertyType', 'Independent House');
    }
    
    // Navigate to search page with parameters
    navigate(`/search?${searchParams.toString()}`);
  };
  
  const additionalCities = [{
    title: "Properties for Sale in Ajman",
    links: ["Apartments for Sale in Ajman", "Villas for Sale in Ajman", "Properties for Sale in Al Nuaimiya", "Properties for Sale in Al Rashidiya", "Properties Below 400K AED in Ajman"]
  }, {
    title: "Properties for Sale in Ras Al Khaimah",
    links: ["Apartments for Sale in RAK", "Villas for Sale in RAK", "Properties for Sale in Al Marjan Island", "Properties for Sale in Al Hamra", "Luxury Properties in RAK"]
  }, {
    title: "Properties for Sale in Fujairah",
    links: ["Apartments for Sale in Fujairah", "Villas for Sale in Fujairah", "Properties for Sale in Fujairah", "Properties Below 300K AED in Fujairah"]
  }];
  const services = {
    buy: ["Property Legal Services", "Interiors", "Sale Agreement", "Home HNI For NRI's", "New Builder Project", "Loan against Mutual fund", "Loan Liability Balance Transfer", "Home Loan Eligibility Calculator", "Apply Home Loan", "Compare Home Loan Interest", "Property Buyers Forum", "Property Buyers Guide", "Property Seller Guide", "Home Loan Guide", "Home Loan Queries", "Home Renovation Guide", "Home Renovation Queries", "Interior Design Tips", "Interior Design Queries", "NRI Real Estate Guide", "NRI Real Estate Queries", "Readinsite Vastu Guide", "Personal Loan Guide", "Personal Loan Queries"],
    rent: ["Rental Agreement", "Pay Rent", "Refer and Earn", "Packers and Movers", "Property Management in India", "Painting and Cleaning", "Rental Questions", "Rent Calculator", "Property Rental Guide", "Landlord Guide", "Tenant Guide", "Packers and Movers Guide", "Packers and Movers queries", "Painting Services", "Home Painting Guide", "Home Painting Queries", "Cleaning Services", "Kitchen Cleaning Services", "Sofa Cleaning Services", "Bathroom Cleaning Services", "Full House Cleaning Services", "Home Cleaning Guide"]
  };
  const loanServices = {
    loanServices: ["Home Loans in Hyderabad", "Home Loans in Bangalore", "Home Loans in Mumbai", "Home Loans in Pune", "Home Loans in Delhi", "Home Loans in Chennai", "Loan Against Property", "Business Loans", "Construction Loans", "Balance Transfer Loans", "Top-up Loans", "Quick Loan Approval", "Low Interest Rate Loans"],
    propertyLoanServices: ["Loan Against Property in Hyderabad", "Property Valuation Services"],
    homeLoanDocumentation: ["Home Loan Documents", "Loan Processing Services", "Digital Loan Application", "Instant Loan Approval", "Zero Processing Fee Loans"]
  };
  return <footer className="bg-white text-gray-700 border-t">
      <div className="container mx-auto px-4 py-8">
        {/* Tabbed Property Listings Section */}
        <div className="mb-8">
          {/* Tab Navigation */}
          <div className="border-b border-gray-200 mb-6">
            <div className="flex flex-wrap justify-between gap-0">
              {tabs.map((tab, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTab(tab)}
                  className={`font-poppins px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab
                      ? 'border-[#800000] text-[#800000] bg-[#800000]/5'
                      : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Object.entries(getActiveTabData()).map(([cityTitle, links], index) => (
              <div key={index}>
                <h4 className="font-poppins font-semibold text-gray-900 mb-3 text-sm">{cityTitle}</h4>
                <ul className="space-y-1">
                  {(links as string[]).map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <button 
                        onClick={() => handleLinkClick(link)} 
                        className="text-xs text-gray-600 hover:text-[#800000] transition-colors leading-relaxed text-left"
                      >
                        {link}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Additional city listings */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {additionalCities.map((section, index) => <div key={index}>
              <h4 className="font-semibold text-gray-900 mb-3 text-sm">{section.title}</h4>
              <ul className="space-y-1">
                {section.links.map((link, linkIndex) => <li key={linkIndex}>
                    <button onClick={() => handleLinkClick(link)} className="text-xs text-gray-600 hover:text-[#800000] transition-colors leading-relaxed text-left">
                      {link}
                    </button>
                  </li>)}
              </ul>
            </div>)}
        </div>

        {/* Loan Services sections */}
        <div className="mb-8">
          
        </div>

        {/* Home HNI Services */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 text-center">Home HNI Services</h3>
        </div>

        {/* Services Section with Tabs */}
        <div className="mb-8">
          {/* Services Tab Navigation */}
          <div className="border-b border-gray-200 mb-6">
            <div className="flex justify-between gap-0">
              <button
                onClick={() => setActiveServicesTab('Buy')}
                className={`font-poppins px-4 py-3 text-sm font-medium border-b-2 transition-colors flex-1 ${
                  activeServicesTab === 'Buy'
                    ? 'border-brand-red text-brand-red bg-brand-red/5'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                }`}
              >
                Buy
              </button>
              <button
                onClick={() => setActiveServicesTab('Rent')}
                className={`font-poppins px-4 py-3 text-sm font-medium border-b-2 transition-colors flex-1 ${
                  activeServicesTab === 'Rent'
                    ? 'border-brand-red text-brand-red bg-brand-red/5'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                }`}
              >
                Rent
              </button>
            </div>
          </div>

          {/* Services Tab Content */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {(activeServicesTab === 'Buy' ? services.buy : services.rent).map((service, index) => (
              <button 
                key={index} 
                onClick={() => handleLinkClick(service)} 
                className="text-xs text-gray-600 hover:text-[#800000] transition-colors text-left"
              >
                {service}
              </button>
            ))}
          </div>
        </div>

        {/* Call-to-action sections */}
       <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 py-8 bg-gray-50 px-6 rounded-lg">
  {/* Post property card */}
  <div className="bg-white rounded-md p-6 shadow-sm ring-1 ring-gray-200 hover:shadow-md transition-shadow">
    <div className="text-center">
      <h4 className="font-semibold text-gray-900 mb-2">Post Your Property (Free)</h4>
      <p className="text-sm text-gray-600 mb-4">
        Reach verified buyers & tenants. Professional service.
      </p>
      <button
        onClick={handlePostPropertyClick}
        className={`px-6 py-2 rounded text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
          theme === 'opaque'
            ? 'bg-gray-200/75 text-gray-800 hover:bg-gray-300/85 border border-gray-300 backdrop-blur-md focus-visible:ring-gray-400'
            : 'bg-[#800000] text-white hover:bg-[#700000] focus-visible:ring-[#800000]'
        }`}
      >
        Post for Free
      </button>
    </div>
  </div>

  {/* Find property card */}
  <div className="bg-white rounded-md p-6 shadow-sm ring-1 ring-gray-200 hover:shadow-md transition-shadow">
    <div className="text-center">
      <h4 className="font-semibold text-gray-900 mb-2">Search Verified Listings</h4>
      <p className="text-sm text-gray-600 mb-4">
        Thousands of owner-listed options. Expert guidance.
      </p>
      <button
        onClick={() => navigate('/search')}
        className={`px-6 py-2 rounded text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
          theme === 'opaque'
            ? 'bg-gray-200/75 text-gray-800 hover:bg-gray-300/85 border border-gray-300 backdrop-blur-md focus-visible:ring-gray-400'
            : 'bg-[#800000] text-white hover:bg-[#700000] focus-visible:ring-[#800000]'
        }`}
      >
        Browse Listings
      </button>
    </div>
  </div>
</div>


        {/* Footer links and social media */}
        <div className="border-t border-gray-200 pt-6">
          <div className="flex flex-wrap justify-center gap-6 mb-6 text-sm">
            <Link to="/about?tab=about" className="text-gray-600 hover:text-[#800000] transition-colors">About Us</Link>
            <Link to="/careers" className="text-gray-600 hover:text-[#800000] transition-colors">Careers</Link>
            <Link to="/blog" className="text-gray-600 hover:text-[#800000] transition-colors">Blog</Link>
            <Link to="/about?tab=contact" className="text-gray-600 hover:text-[#800000] transition-colors">Contact Us</Link>
            <Link to="/terms-and-conditions" className="text-gray-600 hover:text-[#800000] transition-colors">Terms & Conditions</Link>
            <Link to="/privacy-policy" className="text-gray-600 hover:text-[#800000] transition-colors">Privacy Policy</Link>
            <Link to="/cancellation-refunds" className="text-gray-600 hover:text-[#800000] transition-colors">Cancellation & Refunds</Link>
            <Link to="/shipping" className="text-gray-600 hover:text-[#800000] transition-colors">Shipping</Link>
            <Link to="/legal-compliance" className="text-gray-600 hover:text-[#800000] transition-colors">Legal Compliance</Link>
            {/* <Link to="/testimonials" className="text-gray-600 hover:text-[#800000] transition-colors">Testimonials</Link> */}
            <Link to="/sitemap" className="text-gray-600 hover:text-[#800000] transition-colors">Sitemap</Link>
            <Link to="/about?tab=faq" className="text-gray-600 hover:text-[#800000] transition-colors">FAQs</Link>
          </div>

          {/* Company Info from CMS */}
          {cmsContent?.content && (
            <div className="text-center mb-6 p-6 bg-gray-50 rounded-lg">
              {cmsContent.content.companyName && (
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {cmsContent.content.companyName}
                </h3>
              )}
              {cmsContent.content.description && (
                <p className="text-gray-600 mb-4 max-w-2xl mx-auto">
                  {cmsContent.content.description}
                </p>
              )}
              {cmsContent.content.address && (
                <div className="flex items-center justify-center gap-2 text-sm text-gray-600 mb-2">
                  <MapPin className="w-4 h-4" />
                  <span>{cmsContent.content.address}</span>
                </div>
              )}
              {cmsContent.content.phone && (
                <div className="flex items-center justify-center gap-2 text-sm text-gray-600 mb-2">
                  <Phone className="w-4 h-4" />
                  <span>{cmsContent.content.phone}</span>
                </div>
              )}
              {cmsContent.content.email && (
                <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                  <Mail className="w-4 h-4" />
                  <span>{cmsContent.content.email}</span>
                </div>
              )}
            </div>
          )}

          {/* App store badges */}
          <div className="flex flex-col items-center gap-2 mb-6 font-poppins">
            <img src="/lovable-uploads/8b28a8cb-02f0-4e86-9ba6-1845c4372e1a.png" alt="Google Play and App Store" className="h-12" />
          <div className="text-center">
              <p className="text-sm font-bold text-[#800000] mb-1">🚀 Mobile Apps Coming Soon!</p>
              <p className="text-xs text-gray-600">Download our apps for the ultimate property experience</p>
            </div>

          </div>

          {/* Social media icons */}
              {/* Social: brand ring, fills red on hover */}
    <div className="flex justify-center gap-4 mb-8">
      <a
        href="https://www.facebook.com/profile.php?id=61578319572154"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Home HNI on Facebook"
        className="group w-10 h-10 rounded-full ring-1 ring-[#800000]/40 bg-white hover:bg-[#800000] transition-all flex items-center justify-center hover:scale-110
                   focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#800000]"
      >
        <Facebook className="w-5 h-5 text-[#800000] group-hover:text-white" />
      </a>
      <a
        href="https://x.com/homehni8"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Home HNI on X (Twitter)"
        className="group w-10 h-10 rounded-full ring-1 ring-[#800000]/40 bg-white hover:bg-[#800000] transition-all flex items-center justify-center hover:scale-110
                   focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#800000]"
      >
        <Twitter className="w-5 h-5 text-[#800000] group-hover:text-white" />
      </a>
      <a
        href="https://www.instagram.com/homehni/"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Home HNI on Instagram"
        className="group w-10 h-10 rounded-full ring-1 ring-[#800000]/40 bg-white hover:bg-[#800000] transition-all flex items-center justify-center hover:scale-110
                   focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#800000]"
      >
        <Instagram className="w-5 h-5 text-[#800000] group-hover:text-white" />
      </a>
      <a
        href="https://www.linkedin.com/in/homehni/"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Home HNI on LinkedIn"
        className="group w-10 h-10 rounded-full ring-1 ring-[#800000]/40 bg-white hover:bg-[#800000] transition-all flex items-center justify-center hover:scale-110
                   focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#800000]"
      >
        <Linkedin className="w-5 h-5 text-[#800000] group-hover:text-white" />
      </a>
    </div>

          {/* Mortgease Partnership Section - UAE Only */}
          {(window.location.hostname === 'homehni.ae' || window.location.hostname === 'www.homehni.ae') && (
            <div className="mb-6 p-6 md:p-8 rounded-xl">
              <div className="flex flex-col items-center justify-center gap-6">
                <div className="flex-shrink-0">
                  <img 
                    src={mortgeaseLogo} 
                    alt="Mortgease - Official Home Finance Partner" 
                    className="h-20 md:h-24 lg:h-28 object-contain"
                  />
                </div>
                <div className="text-center">
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
                    Official Channel Partner for Home Finance
                  </h3>
                  <p className="text-sm md:text-base text-gray-600 mb-3">
                    Making your home ownership dreams a reality in the UAE
                  </p>
                  <a 
                    href="https://www.mortgease.ae" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-semibold transition-colors text-base md:text-lg"
                  >
                    <span>Explore Mortgease Services</span>
                    <ChevronRight size={18} />
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* Copyright */}
        {/* Copyright & Credit */}
<div className="mt-6 text-center space-y-3">
  {/* Compact badge-style copyright line */}
  <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 ring-1 ring-gray-200 text-[11px] sm:text-xs text-gray-600">
    <span>© 2025</span>
    <span className="font-medium text-gray-800">Home HNI Pvt. Ltd.</span>
    <span className="text-gray-400">•</span>
    <span>All Rights Reserved</span>
  </div>

  {/* Product credit with orange heart */}
  <div className="text-[11px] sm:text-xs text-gray-500 font-poppins">
    Designed by{" "}
    <a
      href="https://ranazonai.com/"
      target="_blank"
      rel="noopener noreferrer"
      className="text-[#800000] font-semibold underline hover:text-[#800000]/80 transition-colors"
    >
      Ranazonai Technologies
    </a>
    , Built with <span className="text-orange-500" role="img" aria-label="orange heart">🧡</span> and Dedication.
  </div>
</div>

          
        </div>
      </div>
    </footer>;
};
export default Footer;

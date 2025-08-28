import { MapPin, Phone, Mail, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';
interface FooterProps {
  searchSectionRef?: React.RefObject<{
    focusSearchInput: () => void;
  }>;
}
const Footer = ({
  searchSectionRef
}: FooterProps) => {
  const {
    user
  } = useAuth();
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
      "Flats for Sale in Bangalore": ["Flats for Sale in Koramangala", "Flats for Sale in Marathahalli", "Flats for Sale in HSR Layout", "Flats for Sale in Whitefield", "Flats for Sale in Indira Nagar", "Flats for Sale in Bellandur", "Flats for Sale in Chandra Layout", "Flats for Sale in J.P Nagar", "Flats for Sale in BTM Layout", "Flats for Sale in Jayanagar", "Flats for Sale Below 30 Lakhs in Bangalore", "Flats for Sale Between 50-90 Lakhs", "Flats for Sale Between 90 Lakhs-1 Crore", "Flats for Sale Below 50 Lakhs in Bangalore", "Properties for Sale in Bangalore"],
      "Flats for Sale in Mumbai": ["Flats for Sale in Andheri West", "Flats for Sale in Andheri East", "Flats for Sale in Malad West", "Flats for Sale in Navi Mumbai", "Flats for Sale in Powai", "Flats for Sale in Vashi", "Flats for Sale in Mira Road East", "Flats for Sale in Bhayander", "Flats for Sale in Kandivali", "Flats for Sale in Borivali West", "Flats for Sale Below 1 Cr in Mumbai", "Flats for Sale in Thane", "Flats for Sale Below 2 Cr in Mumbai", "Properties for Sale in Mumbai"],
      "Flats for Sale in Hyderabad": ["Flats for Sale in Banjara Hills", "Flats for Sale in Jubilee Hills", "Flats for Sale in Madhapur", "Flats for Sale in Kukatpally", "Flats for Sale in Gachibowli", "Flats for Sale in Secunderabad", "Flats for Sale in Miyapur", "Flats for Sale in Himayatnagar", "Flats for Sale in Ameerpet", "Flats for Sale Below 65 Lakhs in Hyderabad", "Flats for Sale Below 50 Lakhs in Hyderabad", "Properties for Sale in Hyderabad"]
    }
  }, {
    title: "Flats for Rent",
    cityData: {
      "Flats for Rent in Bangalore": ["Flats for Rent in Koramangala", "Flats for Rent in Marathahalli", "Flats for Rent in HSR Layout", "Flats for Rent in Whitefield", "Flats for Rent in Indira Nagar", "Flats for Rent in Bellandur", "Flats for Rent in Electronic City", "Flats for Rent in BTM Layout", "Flats for Rent in Jayanagar", "1 BHK for Rent in Bangalore", "2 BHK for Rent in Bangalore", "3 BHK for Rent in Bangalore"],
      "Flats for Rent in Mumbai": ["Flats for Rent in Andheri West", "Flats for Rent in Andheri East", "Flats for Rent in Malad West", "Flats for Rent in Navi Mumbai", "Flats for Rent in Powai", "Flats for Rent in Vashi", "Flats for Rent in Kandivali", "Flats for Rent in Borivali", "1 BHK for Rent in Mumbai", "2 BHK for Rent in Mumbai", "3 BHK for Rent in Mumbai"],
      "Flats for Rent in Hyderabad": ["Flats for Rent in Banjara Hills", "Flats for Rent in Jubilee Hills", "Flats for Rent in Madhapur", "Flats for Rent in Kukatpally", "Flats for Rent in Gachibowli", "Flats for Rent in Secunderabad", "Flats for Rent in Miyapur", "1 BHK for Rent in Hyderabad", "2 BHK for Rent in Hyderabad", "3 BHK for Rent in Hyderabad"]
    }
  }, {
    title: "PG / Hostels",
    cityData: {
      "PG in Bangalore": ["PG for Boys in Koramangala", "PG for Girls in Marathahalli", "PG near HSR Layout", "PG near Whitefield", "PG near Electronic City", "PG near BTM Layout", "PG near Jayanagar", "Shared PG in Bangalore", "Single Room PG in Bangalore", "Double Sharing PG in Bangalore"],
      "PG in Mumbai": ["PG for Boys in Andheri", "PG for Girls in Malad", "PG near Powai", "PG near Vashi", "PG near Kandivali", "PG near Borivali", "Shared PG in Mumbai", "Single Room PG in Mumbai", "Double Sharing PG in Mumbai"],
      "PG in Hyderabad": ["PG for Boys in Madhapur", "PG for Girls in Gachibowli", "PG near Kukatpally", "PG near Secunderabad", "PG near Miyapur", "Shared PG in Hyderabad", "Single Room PG in Hyderabad", "Double Sharing PG in Hyderabad"]
    }
  }, {
    title: "Flatmates",
    cityData: {
      "Flatmates in Bangalore": ["Flatmates in Koramangala", "Flatmates in Marathahalli", "Flatmates in HSR Layout", "Flatmates in Whitefield", "Flatmates in Electronic City", "Flatmates in BTM Layout", "Male Roommates in Bangalore", "Female Roommates in Bangalore", "Working Professional Roommates"],
      "Flatmates in Mumbai": ["Flatmates in Andheri", "Flatmates in Malad", "Flatmates in Powai", "Flatmates in Vashi", "Flatmates in Kandivali", "Male Roommates in Mumbai", "Female Roommates in Mumbai", "Working Professional Roommates Mumbai"],
      "Flatmates in Hyderabad": ["Flatmates in Madhapur", "Flatmates in Gachibowli", "Flatmates in Kukatpally", "Flatmates in Secunderabad", "Male Roommates in Hyderabad", "Female Roommates in Hyderabad", "Working Professional Roommates Hyderabad"]
    }
  }, {
    title: "Miscellaneous",
    cityData: {
      "Commercial Properties": ["Office Space for Rent in Bangalore", "Office Space for Sale in Mumbai", "Retail Space in Hyderabad", "Warehouse for Rent", "Co-working Spaces", "Business Centers", "Industrial Plots", "Commercial Land"],
      "Investment Properties": ["Investment Properties in Bangalore", "Investment Properties in Mumbai", "Investment Properties in Hyderabad", "High ROI Properties", "Pre-launch Projects", "Under Construction Properties"],
      "Luxury Properties": ["Luxury Villas in Bangalore", "Luxury Apartments in Mumbai", "Premium Properties in Hyderabad", "Penthouses", "Villa Communities", "Gated Communities"]
    }
  }];

  const tabs = propertyListings.map(section => section.title);

  const getActiveTabData = () => {
    const activeSection = propertyListings.find(section => section.title === activeTab);
    return activeSection ? activeSection.cityData : {};
  };
  const cityListings = [{
    title: "Flats for Sale in Bangalore",
    links: ["Properties for Sale in Koramangala", "Properties for Sale in Whitefield", "Independent Floor for Sale in Bangalore"]
  }, {
    title: "Bank Auction Properties for Sale in Bangalore",
    links: ["Properties for Sale in Kharghar", "Properties for Sale in Bandra", "Independent Floor for Sale in Mumbai"]
  }, {
    title: "Bank Auction Properties for Sale in Mumbai",
    links: ["Properties for Sale in Guttahalli High", "Properties for Sale in Yelahanka", "Independent Floor for Sale in Chennai"]
  }, {
    title: "Bank Auction Properties for Sale in Chennai",
    links: ["Properties for Sale in Hadapsar", "Properties for Sale in Kothrud", "Independent Floor for Sale in Pune"]
  }, {
    title: "Bank Auction Properties for Sale in Pune",
    links: []
  }];
  const handleLinkClick = (linkText: string) => {
    // Check for services with dedicated pages first
    const serviceRoutes = {
      'Property Legal Services': '/legal-services',
      'Interiors': '/interior',
      'Rental Agreement': '/rental-agreement',
      'Packers and Movers': '/packers-movers',
      'Property Management in India': '/property-management',
      'Painting and Cleaning': '/painting-cleaning',
      'Refer and Earn': '/refer-earn',
      'Pay Rent': '/rent-receipts',
      'Sale Agreement': '/legal-services',
      'Apply Home Loan': '/loans',
      'Home Loan Eligibility Calculator': '/loans',
      'Compare Home Loan Interest': '/loans',
      'Home Loan Guide': '/loans',
      'Home Loan Queries': '/loans',
      'Personal Loan Guide': '/loans',
      'Personal Loan Queries': '/loans',
      'Loan against Mutual fund': '/loans',
      'Loan Liability Balance Transfer': '/loans',
      'Interior Design Tips': '/interior',
      'Interior Design Queries': '/interior',
      'Home Renovation Guide': '/interior',
      'Home Renovation Queries': '/interior',
      'Readinsite Vastu Guide': '/architects',
      'Packers and Movers Guide': '/packers-movers',
      'Packers and Movers queries': '/packers-movers',
      'Painting Services': '/painting-cleaning',
      'Home Painting Guide': '/painting-cleaning',
      'Home Painting Queries': '/painting-cleaning',
      'Cleaning Services': '/painting-cleaning',
      'Kitchen Cleaning Services': '/painting-cleaning',
      'Sofa Cleaning Services': '/painting-cleaning',
      'Bathroom Cleaning Services': '/painting-cleaning',
      'Full House Cleaning Services': '/painting-cleaning',
      'Home Cleaning Guide': '/painting-cleaning',
      'Home Services': '/service-suite',
      'Home Services Queries': '/service-suite',
      'Home HNI For NRI\'s': '/nri-services',
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
    title: "Flats for Sale in Hyderabad",
    links: ["Flats for Sale in Banjara Hills", "Flats for Sale in Jubilee Hills", "Flats for Sale in Madhapur", "Flats for Sale in Kukatpally Housing Board Colony", "Flats for Sale in Gachibowli", "Flats for Sale in Secrbowl", "Flats for Sale in Kukatpally", "Flats for Sale in Miyapur", "Flats for Sale in Himaya Nagar", "Flats for Sale in Ameerpet", "Flats for Sale in Hyderabad Below 65 Lakhs", "Flats for Sale in Hyderabad Below 50 Lakhs", "Flats for Sale Below 50 Lakhs in Hyderabad", "Flats for Sale Below 70 Lakhs in Hyderabad", "Flats for Sale Below 80 Lakhs in Hyderabad", "Flats for Sale Below 90 Lakhs in Hyderabad", "Properties for Sale in Hyderabad"]
  }, {
    title: "Flats for Sale in Delhi",
    links: ["Flats for Sale in Vasant Vihar", "Flats for Sale in Safdarjung Enclave", "Flats for Sale in Maya Puri", "Flats for Sale in Greater Kailash", "Flats for Sale in Connaught Place", "Flats for Sale in Laxmi Nagar", "Flats for Sale in Green Park Extension", "Flats for Sale in East of Kailash", "Flats for Sale in Pitampura Park", "Flats for Sale in Lajpat Nagar I", "Flats for Sale in Delhi Below 65 Lakhs", "Flats for Sale in Delhi Below 50 Lakhs", "Flats for Sale Below 80 Lakhs in Delhi", "Flats for Sale Below 70 Lakhs in Delhi", "Flats for Sale Below 80 Lakhs in Delhi", "Flats for Sale Below 90 Lakhs in Delhi", "Properties for Sale in Delhi"]
  }, {
    title: "Flats for Sale in Noida",
    links: ["Flats for Sale in Noida Sector 62", "Flats for Sale in Noida Sector 50", "Flats for Sale in Sector 137 Noida", "Flats for Sale in Sector 75 Noida", "Flats for Sale in Sector 76 Noida", "Flats for Sale in Kandilya Vihar Sector 51 Noida", "Flats for Sale in Noida Sector 18", "Flats for Sale in Sector 467 Noida", "Flats for Sale in Sector 168 Noida", "Flats for Sale in Sector 150 Noida", "Flats for Sale in Greater Noida", "Flats for Sale in Gamdia 70 Lakhs in Noida", "Flats for Sale Below 80 Lakhs in Noida", "Flats for Sale Below 80 Lakhs in Noida", "Properties for Sale in Noida"]
  }];
  const services = {
    buy: ["Property Legal Services", "Interiors", "Sale Agreement", "Home HNI For NRI's", "New Builder Project", "Loan against Mutual fund", "Loan Liability Balance Transfer", "Home Loan Eligibility Calculator", "Apply Home Loan", "Compare Home Loan Interest", "Property Buyers Forum", "Property Buyers Guide", "Property Seller Guide", "Home Loan Guide", "Home Loan Queries", "Home Renovation Guide", "Home Renovation Queries", "Interior Design Tips", "Interior Design Queries", "NRI Real Estate Guide", "NRI Real Estate Queries", "Readinsite Vastu Guide", "Personal Loan Guide", "Personal Loan Queries"],
    rent: ["Rental Agreement", "Pay Rent", "Refer and Earn", "Packers and Movers", "Property Management in India", "Painting and Cleaning", "Rental Questions", "Rent Calculator", "Property Rental Guide", "Landlord Guide", "Tenant Guide", "Packers and Movers Guide", "Packers and Movers queries", "Home Services", "Home Services Queries", "Painting Services", "Home Painting Guide", "Home Painting Queries", "Cleaning Services", "Kitchen Cleaning Services", "Sofa Cleaning Services", "Bathroom Cleaning Services", "Full House Cleaning Services", "Home Cleaning Guide"]
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
                  className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab
                      ? 'border-brand-red text-brand-red bg-brand-red/5'
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
                <h4 className="font-semibold text-gray-900 mb-3 text-sm">{cityTitle}</h4>
                <ul className="space-y-1">
                  {(links as string[]).map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <button 
                        onClick={() => handleLinkClick(link)} 
                        className="text-xs text-gray-600 hover:text-brand-red transition-colors leading-relaxed text-left"
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
                    <button onClick={() => handleLinkClick(link)} className="text-xs text-gray-600 hover:text-brand-red transition-colors leading-relaxed text-left">
                      {link}
                    </button>
                  </li>)}
              </ul>
            </div>)}
        </div>

        {/* Loan Services sections */}
        <div className="mb-8">
          
        </div>

        {/* Services Section with Tabs */}
        <div className="mb-8">
          {/* Services Tab Navigation */}
          <div className="border-b border-gray-200 mb-6">
            <div className="flex justify-between gap-0">
              <button
                onClick={() => setActiveServicesTab('Buy')}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors flex-1 ${
                  activeServicesTab === 'Buy'
                    ? 'border-brand-red text-brand-red bg-brand-red/5'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                }`}
              >
                Buy
              </button>
              <button
                onClick={() => setActiveServicesTab('Rent')}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors flex-1 ${
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
                className="text-xs text-gray-600 hover:text-brand-red transition-colors text-left"
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
        Reach verified buyers & tenants. Zero brokerage.
      </p>
      <button
        onClick={handlePostPropertyClick}
        className="bg-brand-red text-white px-6 py-2 rounded text-sm hover:bg-brand-red-dark transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand-red"
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
        Thousands of owner-listed options. No brokerage.
      </p>
      <button
        onClick={handleFindNowClick}
        className="bg-brand-red text-white px-6 py-2 rounded text-sm hover:bg-brand-red-dark transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand-red"
      >
        Browse Listings
      </button>
    </div>
  </div>
</div>


        {/* Footer links and social media */}
        <div className="border-t border-gray-200 pt-6">
          <div className="flex flex-wrap justify-center gap-6 mb-6 text-sm">
            <Link to="/about?tab=about" className="text-gray-600 hover:text-brand-red transition-colors">About Us</Link>
            <Link to="/careers" className="text-gray-600 hover:text-brand-red transition-colors">Careers</Link>
            <Link to="/about?tab=contact" className="text-gray-600 hover:text-brand-red transition-colors">Contact Us</Link>
            <Link to="/terms-and-conditions" className="text-gray-600 hover:text-brand-red transition-colors">Terms & Conditions</Link>
            <Link to="/privacy-policy" className="text-gray-600 hover:text-brand-red transition-colors">Privacy Policy</Link>
            {/* <Link to="/testimonials" className="text-gray-600 hover:text-brand-red transition-colors">Testimonials</Link> */}
            <a href="/sitemap.xml" className="text-gray-600 hover:text-brand-red transition-colors">Sitemap</a>
            <Link to="/about?tab=faq" className="text-gray-600 hover:text-brand-red transition-colors">FAQs</Link>
          </div>

          {/* App store badges */}
          <div className="flex flex-col items-center gap-2 mb-6">
            <img src="/lovable-uploads/8b28a8cb-02f0-4e86-9ba6-1845c4372e1a.png" alt="Google Play and App Store" className="h-12" />
           <p className="text-sm font-semibold text-red-600">Coming Soon</p>

          </div>

          {/* Social media icons */}
              {/* Social: brand ring, fills red on hover */}
    <div className="flex justify-center gap-4 mb-8">
      <a
        href="https://www.facebook.com/profile.php?id=61578319572154"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Home HNI on Facebook"
        className="group w-10 h-10 rounded-full ring-1 ring-brand-red/40 bg-white hover:bg-brand-red transition-all flex items-center justify-center hover:scale-110
                   focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand-red"
      >
        <Facebook className="w-5 h-5 text-brand-red group-hover:text-white" />
      </a>
      <a
        href="https://x.com/homehni8"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Home HNI on X (Twitter)"
        className="group w-10 h-10 rounded-full ring-1 ring-brand-red/40 bg-white hover:bg-brand-red transition-all flex items-center justify-center hover:scale-110
                   focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand-red"
      >
        <Twitter className="w-5 h-5 text-brand-red group-hover:text-white" />
      </a>
      <a
        href="https://www.instagram.com/homehni/"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Home HNI on Instagram"
        className="group w-10 h-10 rounded-full ring-1 ring-brand-red/40 bg-white hover:bg-brand-red transition-all flex items-center justify-center hover:scale-110
                   focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand-red"
      >
        <Instagram className="w-5 h-5 text-brand-red group-hover:text-white" />
      </a>
      <a
        href="https://www.linkedin.com/in/homehni/"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Home HNI on LinkedIn"
        className="group w-10 h-10 rounded-full ring-1 ring-brand-red/40 bg-white hover:bg-brand-red transition-all flex items-center justify-center hover:scale-110
                   focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand-red"
      >
        <Linkedin className="w-5 h-5 text-brand-red group-hover:text-white" />
      </a>
    </div>

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
  <div className="text-[11px] sm:text-xs text-gray-500">
    Designed by{" "}
    <a
      href="https://ranazonai.com/"
      target="_blank"
      rel="noopener noreferrer"
      className="text-brand-red font-semibold underline hover:text-brand-red/80 transition-colors"
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
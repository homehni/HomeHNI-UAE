import { MapPin, Phone, Mail, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
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
    links: ["Flats for Sale in Koramangala", "Flats for Sale in Marathahalli", "Flats for Sale in HSR Layout", "Flats for Sale in Whitefield", "Flats for Sale in Indira Nagar", "Flats for Sale in Bellandur", "Flats for Sale in Chandra Layout", "Flats for Sale in J.P Nagar", "Flats for Sale in BTM Layout", "Flats for Sale in Jayanagar", "Flats for Sale Below 30 Lakhs in Bangalore", "Flats for Sale Between 50-90 Lakhs", "Flats for Sale Between 90 Lakhs-1 Crore", "Flats for Sale Below 50 Lakhs in Bangalore", "Flats for Sale Below 30 Lakhs in Bangalore", "Properties for Sale in Bangalore"]
  }, {
    title: "Flats for Rent",
    links: ["Flats for Sale in Andrew West", "Flats for Sale in Andrew East", "Flats for Sale in Malad West", "Flats for Sale in New Mumbai", "Flats for Sale in Powai", "Flats for Sale in Vashi West", "Flats for Sale in Mira Road East", "Flats for Sale in Bhayander", "Flats for Sale in Kandivali", "Flats for Sale in Borivali West", "Flats for Sale Below 30 Lakhs in Mumbai", "Flats for Sale Below 30 Lakhs in Mumbai", "Flats for Sale in Thane", "Flats for Sale Below 30 Lakhs in Mumbai", "Flats for Sale Below 2 Cr in Mumbai", "Properties for Sale in Mumbai"]
  }, {
    title: "PG / Hostels",
    links: ["Flats for Sale in Velachery", "Flats for Sale in Thiruvanmiyur", "Flats for Sale in Madipakkam", "Flats for Sale in Thiruvanmiyur", "Flats for Sale in Sholinganallur", "Flats for Sale in Maduravoyal", "Flats for Sale in Mylapore", "Flats for Sale in Adyar", "Flats for Sale in T Nagar", "Flats for Sale in Perungudi", "Flats for Sale Chennai Below 40 Lakhs", "Flats for Sale in Chennai Below 40 Lakhs", "Flats for Sale Below 30 Lakhs in Chennai", "Flats for Sale Below 70 Lakhs in Chennai", "Flats for Sale Below 90 Lakhs in Chennai", "Flats for Sale Below 90 Lakhs in Chennai", "Properties for Sale in Chennai"]
  }, {
    title: "Flatmates",
    links: ["Flats for Sale in Wakad", "Flats for Sale in Kharadi", "Flats for Sale in Baner", "Flats for Sale in Hadapsar", "Flats for Sale in Aundh", "Flats for Sale in Kondivad", "Flats for Sale in Pimple Saudagar", "Flats for Sale in Viman Nagar", "Flats for Sale in Pimpri", "Flats for Sale in Hinjewadi", "Flats for Sale Below 40 Lakhs", "Flats for Sale Below 50 Lakhs", "Flats for Sale Below 30 Lakhs in Pune", "Flats for Sale Below 70 Lakhs in Pune", "Flats for Sale Below 90 Lakhs in Pune", "Flats for Sale 90 Lakhs in Pune", "Properties for Sale in Pune"]
  }, {
    title: "Miscellaneous",
    links: ["1 BHK Flats in Gurgaon", "2 BHK Flats in Gurgaon", "3 BHK Flats in Gurgaon", "4 BHK Flats in Gurgaon", "As BHK in Gurgaon", "Independent Flats in Gurgaon", "Semi Furnished Flats in Gurgaon", "Unfurnished Flats in Gurgaon", "Independent Flats for Sale in Gurgaon", "Independent Houses for Sale in Gurgaon", "Flats for Sale Below 20 Lakhs in Gurgaon", "Flats for Sale Below 10 Lakhs in Gurgaon", "Flats for Sale in Gurgaon", "Flats for Sale Below 50 Lakhs in Gurgaon", "Properties for Sale in Gurgaon", "Properties for Sale in Sector 51", "Properties for Sale in Sector 4"]
  }];
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
      'NoBroker For NRI\'s': '/nri-services',
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
    buy: ["Property Legal Services", "Interiors", "Sale Agreement", "NoBroker For NRI's", "New Builder Project", "Loan against Mutual fund", "Loan Liability Balance Transfer", "Home Loan Eligibility Calculator", "Apply Home Loan", "Compare Home Loan Interest", "Property Buyers Forum", "Property Buyers Guide", "Property Seller Guide", "Home Loan Guide", "Home Loan Queries", "Home Renovation Guide", "Home Renovation Queries", "Interior Design Tips", "Interior Design Queries", "NRI Real Estate Guide", "NRI Real Estate Queries", "Readinsite Vastu Guide", "Personal Loan Guide", "Personal Loan Queries"],
    rent: ["Rental Agreement", "Pay Rent", "Refer and Earn", "Packers and Movers", "Property Management in India", "Painting and Cleaning", "Rental Questions", "Rent Calculator", "Property Rental Guide", "Landlord Guide", "Tenant Guide", "Packers and Movers Guide", "Packers and Movers queries", "Home Services", "Home Services Queries", "Painting Services", "Home Painting Guide", "Home Painting Queries", "Cleaning Services", "Kitchen Cleaning Services", "Sofa Cleaning Services", "Bathroom Cleaning Services", "Full House Cleaning Services", "Home Cleaning Guide"]
  };
  const loanServices = {
    loanServices: ["Home Loans in Hyderabad", "Home Loans in Bangalore", "Home Loans in Mumbai", "Home Loans in Pune", "Home Loans in Delhi", "Home Loans in Chennai", "Loan Against Property", "Business Loans", "Construction Loans", "Balance Transfer Loans", "Top-up Loans", "Quick Loan Approval", "Low Interest Rate Loans"],
    propertyLoanServices: ["Loan Against Property in Hyderabad", "Property Valuation Services"],
    homeLoanDocumentation: ["Home Loan Documents", "Loan Processing Services", "Digital Loan Application", "Instant Loan Approval", "Zero Processing Fee Loans"]
  };
  return <footer className="bg-white text-gray-700 border-t">
      <div className="container mx-auto px-4 py-8">
        {/* Property listings grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-8">
          {propertyListings.map((section, index) => <div key={index}>
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

        {/* Original Services sections */}
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Buy</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {services.buy.map((service, index) => <button key={index} onClick={() => handleLinkClick(service)} className="text-xs text-gray-600 hover:text-brand-red transition-colors text-left">
                    {service}
                  </button>)}
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Rent</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {services.rent.map((service, index) => <button key={index} onClick={() => handleLinkClick(service)} className="text-xs text-gray-600 hover:text-brand-red transition-colors text-left">
                    {service}
                  </button>)}
              </div>
            </div>
          </div>
        </div>

        {/* Call-to-action sections */}
<div className="border-t border-gray-200 pt-8 bg-gray-50/60">
  <div className="max-w-7xl mx-auto px-4">
    {/* Links as a responsive grid with pill hover */}
    <nav aria-label="Footer" className="mb-8">
      <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3 text-sm">
        <li>
          <Link
            to="/about?tab=about"
            className="group inline-flex items-center justify-center sm:justify-start gap-2 rounded-md px-3 py-2 text-gray-700 ring-1 ring-transparent hover:ring-gray-200 hover:bg-white hover:text-brand-red transition"
          >
            About Us
          </Link>
        </li>
        <li>
          <Link
            to="/careers"
            className="group inline-flex items-center justify-center sm:justify-start gap-2 rounded-md px-3 py-2 text-gray-700 ring-1 ring-transparent hover:ring-gray-200 hover:bg-white hover:text-brand-red transition"
          >
            Careers
          </Link>
        </li>
        <li>
          <Link
            to="/about?tab=contact"
            className="group inline-flex items-center justify-center sm:justify-start gap-2 rounded-md px-3 py-2 text-gray-700 ring-1 ring-transparent hover:ring-gray-200 hover:bg-white hover:text-brand-red transition"
          >
            Contact Us
          </Link>
        </li>
        <li>
          <Link
            to="/terms-and-conditions"
            className="group inline-flex items-center justify-center sm:justify-start gap-2 rounded-md px-3 py-2 text-gray-700 ring-1 ring-transparent hover:ring-gray-200 hover:bg-white hover:text-brand-red transition"
          >
            Terms &amp; Conditions
          </Link>
        </li>
        <li>
          <Link
            to="/privacy-policy"
            className="group inline-flex items-center justify-center sm:justify-start gap-2 rounded-md px-3 py-2 text-gray-700 ring-1 ring-transparent hover:ring-gray-200 hover:bg-white hover:text-brand-red transition"
          >
            Privacy Policy
          </Link>
        </li>
        <li>
          <a
            href="/sitemap.xml"
            className="group inline-flex items-center justify-center sm:justify-start gap-2 rounded-md px-3 py-2 text-gray-700 ring-1 ring-transparent hover:ring-gray-200 hover:bg-white hover:text-brand-red transition"
          >
            Sitemap
          </a>
        </li>
        <li>
          <Link
            to="/about?tab=faq"
            className="group inline-flex items-center justify-center sm:justify-start gap-2 rounded-md px-3 py-2 text-gray-700 ring-1 ring-transparent hover:ring-gray-200 hover:bg-white hover:text-brand-red transition"
          >
            FAQs
          </Link>
        </li>
      </ul>
    </nav>

    {/* Store badges with subtle accent frame */}
    <div className="flex justify-center mb-8">
      <a
        href="#"
        aria-label="Download the Home HNI app"
        className="relative inline-flex items-center justify-center rounded-xl overflow-hidden"
      >
        <span className="pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-r from-brand-red/20 to-transparent" />
        <span className="relative ring-1 ring-gray-200 rounded-lg bg-white p-1 hover:ring-brand-red transition">
          <img
            src="/lovable-uploads/8b28a8cb-02f0-4e86-9ba6-1845c4372e1a.png"
            alt="Get it on Google Play and App Store"
            className="h-12"
            loading="lazy"
          />
        </span>
      </a>
    </div>

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
        href="https://www.linkedin.com/in/home-hni-622605376/"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Home HNI on LinkedIn"
        className="group w-10 h-10 rounded-full ring-1 ring-brand-red/40 bg-white hover:bg-brand-red transition-all flex items-center justify-center hover:scale-110
                   focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand-red"
      >
        <Linkedin className="w-5 h-5 text-brand-red group-hover:text-white" />
      </a>
    </div>

    {/* Bottom bar */}
    <div className="flex flex-col items-center gap-2 text-center">
      <p className="text-xs text-gray-500">
        © 2025 Home HNI Pvt. Ltd. · All Rights Reserved
      </p>
      <p className="text-xs text-gray-500">
        A Product of{" "}
        <a
          href="https://ranazonai.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-brand-red font-semibold underline hover:text-brand-red/80 transition-colors"
        >
          Ranazonai Technologies
        </a>
        . Built with 🤍 and Dedication.
      </p>
      <a
        href="#top"
        className="mt-1 inline-flex items-center gap-1 text-[11px] text-gray-600 hover:text-brand-red transition"
        aria-label="Back to top"
      >
        ↑ Back to top
      </a>
    </div>
  </div>
</div>

      </div>
    </footer>;
};
export default Footer;

import { MapPin, Phone, Mail, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const propertyListings = [
    {
      title: "Properties & Flats for Sale",
      links: [
        "Flats for Sale in Koramangala",
        "Flats for Sale in Marathahalli", 
        "Flats for Sale in HSR Layout",
        "Flats for Sale in Whitefield",
        "Flats for Sale in Indira Nagar",
        "Flats for Sale in Bellandur",
        "Flats for Sale in Chandra Layout",
        "Flats for Sale in J.P Nagar",
        "Flats for Sale in BTM Layout",
        "Flats for Sale in Jayanagar",
        "Flats for Sale Below 30 Lakhs in Bangalore",
        "Flats for Sale Between 50-90 Lakhs",
        "Flats for Sale Between 90 Lakhs-1 Crore",
        "Flats for Sale Below 50 Lakhs in Bangalore",
        "Flats for Sale Below 30 Lakhs in Bangalore",
        "Properties for Sale in Bangalore"
      ]
    },
    {
      title: "Flats for Rent",
      links: [
        "Flats for Sale in Andrew West",
        "Flats for Sale in Andrew East",
        "Flats for Sale in Malad West",
        "Flats for Sale in New Mumbai",
        "Flats for Sale in Powai",
        "Flats for Sale in Vashi West",
        "Flats for Sale in Mira Road East",
        "Flats for Sale in Bhayander",
        "Flats for Sale in Kandivali",
        "Flats for Sale in Borivali West",
        "Flats for Sale Below 30 Lakhs in Mumbai",
        "Flats for Sale Below 30 Lakhs in Mumbai",
        "Flats for Sale in Thane",
        "Flats for Sale Below 30 Lakhs in Mumbai",
        "Flats for Sale Below 2 Cr in Mumbai",
        "Properties for Sale in Mumbai"
      ]
    },
    {
      title: "PG / Hostels",
      links: [
        "Flats for Sale in Velachery",
        "Flats for Sale in Thiruvanmiyur",
        "Flats for Sale in Madipakkam",
        "Flats for Sale in Thiruvanmiyur",
        "Flats for Sale in Sholinganallur",
        "Flats for Sale in Maduravoyal",
        "Flats for Sale in Mylapore",
        "Flats for Sale in Adyar",
        "Flats for Sale in T Nagar",
        "Flats for Sale in Perungudi",
        "Flats for Sale Chennai Below 40 Lakhs",
        "Flats for Sale in Chennai Below 40 Lakhs",
        "Flats for Sale Below 30 Lakhs in Chennai",
        "Flats for Sale Below 70 Lakhs in Chennai",
        "Flats for Sale Below 90 Lakhs in Chennai",
        "Flats for Sale Below 90 Lakhs in Chennai",
        "Properties for Sale in Chennai"
      ]
    },
    {
      title: "Flatmates",
      links: [
        "Flats for Sale in Wakad",
        "Flats for Sale in Kharadi",
        "Flats for Sale in Baner",
        "Flats for Sale in Hadapsar",
        "Flats for Sale in Aundh",
        "Flats for Sale in Kondivad",
        "Flats for Sale in Pimple Saudagar",
        "Flats for Sale in Viman Nagar",
        "Flats for Sale in Pimpri",
        "Flats for Sale in Hinjewadi",
        "Flats for Sale Below 40 Lakhs",
        "Flats for Sale Below 50 Lakhs",
        "Flats for Sale Below 30 Lakhs in Pune",
        "Flats for Sale Below 70 Lakhs in Pune",
        "Flats for Sale Below 90 Lakhs in Pune",
        "Flats for Sale 90 Lakhs in Pune",
        "Properties for Sale in Pune"
      ]
    },
    {
      title: "Miscellaneous",
      links: [
        "1 BHK Flats in Gurgaon",
        "2 BHK Flats in Gurgaon",
        "3 BHK Flats in Gurgaon",
        "4 BHK Flats in Gurgaon",
        "As BHK in Gurgaon",
        "Independent Flats in Gurgaon",
        "Semi Furnished Flats in Gurgaon",
        "Unfurnished Flats in Gurgaon",
        "Independent Flats for Sale in Gurgaon",
        "Independent Houses for Sale in Gurgaon",
        "Flats for Sale Below 20 Lakhs in Gurgaon",
        "Flats for Sale Below 10 Lakhs in Gurgaon",
        "Flats for Sale in Gurgaon",
        "Flats for Sale Below 50 Lakhs in Gurgaon",
        "Properties for Sale in Gurgaon",
        "Properties for Sale in Sector 51",
        "Properties for Sale in Sector 4"
      ]
    }
  ];

  const cityListings = [
    {
      title: "Flats for Sale in Bangalore",
      links: [
        "Properties for Sale in Koramangala",
        "Properties for Sale in Whitefield",
        "Independent Floor for Sale in Bangalore"
      ]
    },
    {
      title: "Bank Auction Properties for Sale in Bangalore",
      links: [
        "Properties for Sale in Kharghar",
        "Properties for Sale in Bandra",
        "Independent Floor for Sale in Mumbai"
      ]
    },
    {
      title: "Bank Auction Properties for Sale in Mumbai",
      links: [
        "Properties for Sale in Guttahalli High",
        "Properties for Sale in Yelahanka",
        "Independent Floor for Sale in Chennai"
      ]
    },
    {
      title: "Bank Auction Properties for Sale in Chennai",
      links: [
        "Properties for Sale in Hadapsar",
        "Properties for Sale in Kothrud",
        "Independent Floor for Sale in Pune"
      ]
    },
    {
      title: "Bank Auction Properties for Sale in Pune",
      links: []
    }
  ];

  const additionalCities = [
    {
      title: "Flats for Sale in Hyderabad",
      links: [
        "Flats for Sale in Banjara Hills",
        "Flats for Sale in Jubilee Hills",
        "Flats for Sale in Madhapur",
        "Flats for Sale in Kukatpally Housing Board Colony",
        "Flats for Sale in Gachibowli",
        "Flats for Sale in Secrbowl",
        "Flats for Sale in Kukatpally",
        "Flats for Sale in Miyapur",
        "Flats for Sale in Himaya Nagar",
        "Flats for Sale in Ameerpet",
        "Flats for Sale in Hyderabad Below 65 Lakhs",
        "Flats for Sale in Hyderabad Below 50 Lakhs",
        "Flats for Sale Below 50 Lakhs in Hyderabad",
        "Flats for Sale Below 70 Lakhs in Hyderabad",
        "Flats for Sale Below 80 Lakhs in Hyderabad",
        "Flats for Sale Below 90 Lakhs in Hyderabad",
        "Properties for Sale in Hyderabad"
      ]
    },
    {
      title: "Flats for Sale in Delhi",
      links: [
        "Flats for Sale in Vasant Vihar",
        "Flats for Sale in Safdarjung Enclave",
        "Flats for Sale in Maya Puri",
        "Flats for Sale in Greater Kailash",
        "Flats for Sale in Connaught Place",
        "Flats for Sale in Laxmi Nagar",
        "Flats for Sale in Green Park Extension",
        "Flats for Sale in East of Kailash",
        "Flats for Sale in Pitampura Park",
        "Flats for Sale in Lajpat Nagar I",
        "Flats for Sale in Delhi Below 65 Lakhs",
        "Flats for Sale in Delhi Below 50 Lakhs",
        "Flats for Sale Below 80 Lakhs in Delhi",
        "Flats for Sale Below 70 Lakhs in Delhi",
        "Flats for Sale Below 80 Lakhs in Delhi",
        "Flats for Sale Below 90 Lakhs in Delhi",
        "Properties for Sale in Delhi"
      ]
    },
    {
      title: "Flats for Sale in Noida",
      links: [
        "Flats for Sale in Noida Sector 62",
        "Flats for Sale in Noida Sector 50",
        "Flats for Sale in Sector 137 Noida",
        "Flats for Sale in Sector 75 Noida",
        "Flats for Sale in Sector 76 Noida",
        "Flats for Sale in Kandilya Vihar Sector 51 Noida",
        "Flats for Sale in Noida Sector 18",
        "Flats for Sale in Sector 467 Noida",
        "Flats for Sale in Sector 168 Noida",
        "Flats for Sale in Sector 150 Noida",
        "Flats for Sale in Greater Noida",
        "Flats for Sale in Gamdia 70 Lakhs in Noida",
        "Flats for Sale Below 80 Lakhs in Noida",
        "Flats for Sale Below 80 Lakhs in Noida",
        "Properties for Sale in Noida"
      ]
    }
  ];

  const services = {
    buy: [
      "Property Legal Services", "Interiors", "Sale Agreement", "NoBroker For NRI's", "New Builder Project",
      "Loan against Mutual fund", "Loan Liability Balance Transfer", "Home Loan Eligibility Calculator",
      "Apply Home Loan", "Compare Home Loan Interest", "Property Buyers Forum", "Property Buyers Guide",
      "Property Seller Guide", "Home Loan Guide", "Home Loan Queries", "Home Renovation Guide",
      "Home Renovation Queries", "Interior Design Tips", "Interior Design Queries", "NRI Real Estate Guide",
      "NRI Real Estate Queries", "Readinsite Vastu Guide", "Personal Loan Guide", "Personal Loan Queries"
    ],
    rent: [
      "Rental Agreement", "Pay Rent", "Refer and Earn", "Packers and Movers", "Property Management in India",
      "Painting and Cleaning", "Rental Questions", "Rent Calculator", "Property Rental Guide",
      "Landlord Guide", "Tenant Guide", "Packers and Movers Guide", "Packers and Movers queries",
      "Home Services", "Home Services Queries", "Painting Services", "Home Painting Guide",
      "Home Painting Queries", "Cleaning Services", "Kitchen Cleaning Services", "Sofa Cleaning Services",
      "Bathroom Cleaning Services", "Full House Cleaning Services", "Home Cleaning Guide"
    ]
  };

  return (
    <footer className="bg-white text-gray-700 border-t">
      <div className="container mx-auto px-4 py-8">
        {/* Property listings grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-8">
          {propertyListings.map((section, index) => (
            <div key={index}>
              <h4 className="font-semibold text-gray-900 mb-3 text-sm">{section.title}</h4>
              <ul className="space-y-1">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a href="#" className="text-xs text-gray-600 hover:text-brand-red transition-colors leading-relaxed">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Additional city listings */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {additionalCities.map((section, index) => (
            <div key={index}>
              <h4 className="font-semibold text-gray-900 mb-3 text-sm">{section.title}</h4>
              <ul className="space-y-1">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a href="#" className="text-xs text-gray-600 hover:text-brand-red transition-colors leading-relaxed">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Services sections */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">NoBroker services</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Buy</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {services.buy.map((service, index) => (
                  <a key={index} href="#" className="text-xs text-gray-600 hover:text-brand-red transition-colors">
                    {service}
                  </a>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Rent</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {services.rent.map((service, index) => (
                  <a key={index} href="#" className="text-xs text-gray-600 hover:text-brand-red transition-colors">
                    {service}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Call-to-action sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 py-8 bg-gray-50 px-6 rounded-lg">
          <div className="text-center">
            <h4 className="font-semibold text-gray-900 mb-2">Find Property</h4>
            <p className="text-sm text-gray-600 mb-4">Select from thousands of options, without brokerage.</p>
            <button className="bg-gray-800 text-white px-6 py-2 rounded text-sm hover:bg-gray-700 transition-colors">
              Find Now
            </button>
          </div>
          <div className="text-center">
            <h4 className="font-semibold text-gray-900 mb-2">List Your Property</h4>
            <p className="text-sm text-gray-600 mb-4">For Free, Without any brokerage.</p>
            <button className="bg-gray-800 text-white px-6 py-2 rounded text-sm hover:bg-gray-700 transition-colors">
              Free Posting
            </button>
          </div>
        </div>

        {/* Footer links and social media */}
        <div className="border-t border-gray-200 pt-6">
          <div className="flex flex-wrap justify-center gap-6 mb-6 text-sm">
            <Link to="/about-us" className="text-gray-600 hover:text-brand-red transition-colors">About Us</Link>
            <Link to="/careers" className="text-gray-600 hover:text-brand-red transition-colors">Careers</Link>
            <Link to="/contact-us" className="text-gray-600 hover:text-brand-red transition-colors">Contact Us</Link>
            <Link to="/terms-and-conditions" className="text-gray-600 hover:text-brand-red transition-colors">Terms & Conditions</Link>
            <Link to="/privacy-policy" className="text-gray-600 hover:text-brand-red transition-colors">Privacy Policy</Link>
            {/* <Link to="/testimonials" className="text-gray-600 hover:text-brand-red transition-colors">Testimonials</Link> */}
            <a href="/sitemap.xml" className="text-gray-600 hover:text-brand-red transition-colors">Sitemap</a>
            <Link to="/faq" className="text-gray-600 hover:text-brand-red transition-colors">FAQs</Link>
          </div>

          {/* App store badges */}
          <div className="flex justify-center gap-4 mb-6">
            <img src="/lovable-uploads/8b28a8cb-02f0-4e86-9ba6-1845c4372e1a.png" alt="Google Play and App Store" className="h-12" />
          </div>

          {/* Social media icons */}
          <div className="flex justify-center space-x-4 mb-6">
            <a 
              href="https://www.facebook.com/profile.php?id=61578319572154" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center transition-all hover:bg-gray-400 hover:scale-110"
            >
              <Facebook className="w-5 h-5 text-gray-700" />
            </a>
            <a 
              href="https://x.com/homehni8" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center transition-all hover:bg-gray-400 hover:scale-110"
            >
              <Twitter className="w-5 h-5 text-gray-700" />
            </a>
            <a 
              href="https://www.instagram.com/homehni/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center transition-all hover:bg-gray-400 hover:scale-110"
            >
              <Instagram className="w-5 h-5 text-gray-700" />
            </a>
            <a 
              href="https://www.linkedin.com/in/home-hni-622605376/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center transition-all hover:bg-gray-400 hover:scale-110"
            >
              <Linkedin className="w-5 h-5 text-gray-700" />
            </a>
          </div>

          {/* Copyright */}
          <div className="text-center text-xs text-gray-500">
            © 2025 HomeHNI. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import Header from "@/components/Header";
import Marquee from "@/components/Marquee";
import Footer from "@/components/Footer";

const Sitemap = () => {
  const handleLinkClick = (linkText: string) => {
    // Extract location and property type information from the link text
    const searchParams = new URLSearchParams();
    
    // Determine search type based on link content
    if (linkText.toLowerCase().includes('rent')) {
      searchParams.set('type', 'rent');
    } else if (linkText.toLowerCase().includes('sale') || linkText.toLowerCase().includes('buy')) {
      searchParams.set('type', 'buy');
    }
    
    // Extract location if mentioned
    const locationKeywords = ['bangalore', 'mumbai', 'delhi', 'pune', 'chennai', 'hyderabad', 'noida', 'gurgaon', 'ghaziabad', 'faridabad', 'greater noida'];
    const foundLocation = locationKeywords.find(keyword => 
      linkText.toLowerCase().includes(keyword)
    );
    
    if (foundLocation) {
      searchParams.set('location', foundLocation);
    }
    
    // Extract property type
    if (linkText.toLowerCase().includes('flat') || linkText.toLowerCase().includes('apartment')) {
      searchParams.set('propertyType', 'Flat/Apartment');
    } else if (linkText.toLowerCase().includes('villa') || linkText.toLowerCase().includes('house')) {
      searchParams.set('propertyType', 'Villa');
    } else if (linkText.toLowerCase().includes('plot')) {
      searchParams.set('propertyType', 'Plots');
    } else if (linkText.toLowerCase().includes('pg') || linkText.toLowerCase().includes('hostel')) {
      searchParams.set('propertyType', 'PG/Hostel');
    }
    
    // Add search query
    searchParams.set('q', linkText);
    
    // Navigate to search page with parameters
    return `/search?${searchParams.toString()}`;
  };
  
  const sitemapData = {
    "Flats for rent": {
      "Bangalore": [
        "Flats for rent in Bangalore",
        "1 RK for rent in Bangalore",
        "1 BHK for rent in Bangalore",
        "2 BHK for rent in Bangalore", 
        "3 BHK for rent in Bangalore",
        "4 BHK for rent in Bangalore",
        "4+ BHK for rent in Bangalore"
      ],
      "Mumbai": [
        "Flats for rent in Mumbai",
        "1 RK for rent in Mumbai",
        "1 BHK for rent in Mumbai",
        "2 BHK for rent in Mumbai",
        "3 BHK for rent in Mumbai", 
        "4 BHK for rent in Mumbai",
        "4+ BHK for rent in Mumbai"
      ],
      "Pune": [
        "Flats for rent in Pune",
        "1 RK for rent in Pune",
        "1 BHK for rent in Pune",
        "2 BHK for rent in Pune",
        "3 BHK for rent in Pune",
        "4 BHK for rent in Pune",
        "4+ BHK for rent in Pune"
      ],
      "Chennai": [
        "Flats for rent in Chennai",
        "1 RK for rent in Chennai",
        "1 BHK for rent in Chennai",
        "2 BHK for rent in Chennai",
        "3 BHK for rent in Chennai",
        "4 BHK for rent in Chennai",
        "4+ BHK for rent in Chennai"
      ],
      "Gurgaon": [
        "Flats for rent in Gurgaon",
        "1 RK for rent in Gurgaon",
        "1 BHK for rent in Gurgaon",
        "2 BHK for rent in Gurgaon",
        "3 BHK for rent in Gurgaon",
        "4 BHK for rent in Gurgaon",
        "4+ BHK for rent in Gurgaon"
      ],
      "Hyderabad": [
        "Flats for rent in Hyderabad",
        "1 RK for rent in Hyderabad",
        "1 BHK for rent in Hyderabad",
        "2 BHK for rent in Hyderabad",
        "3 BHK for rent in Hyderabad",
        "4 BHK for rent in Hyderabad",
        "4+ BHK for rent in Hyderabad"
      ],
      "Delhi": [
        "Flats for rent in Delhi",
        "1 RK for rent in Delhi",
        "1 BHK for rent in Delhi",
        "2 BHK for rent in Delhi",
        "3 BHK for rent in Delhi",
        "4 BHK for rent in Delhi",
        "4+ BHK for rent in Delhi"
      ],
      "Ghaziabad": [
        "Flats for rent in Ghaziabad",
        "1 RK for rent in Ghaziabad",
        "1 BHK for rent in Ghaziabad",
        "2 BHK for rent in Ghaziabad",
        "3 BHK for rent in Ghaziabad",
        "4 BHK for rent in Ghaziabad",
        "4+ BHK for rent in Ghaziabad"
      ],
      "Faridabad": [
        "Flats for rent in Faridabad",
        "1 RK for rent in Faridabad",
        "1 BHK for rent in Faridabad",
        "2 BHK for rent in Faridabad",
        "3 BHK for rent in Faridabad",
        "4 BHK for rent in Faridabad",
        "4+ BHK for rent in Faridabad"
      ],
      "Noida": [
        "Flats in Noida",
        "1 RK in Noida",
        "1 BHK in Noida",
        "2 BHK in Noida",
        "3 BHK in Noida",
        "4 BHK in Noida",
        "4+ BHK in Noida"
      ],
      "Greater Noida": [
        "Flats for rent in Greater Noida",
        "1 RK for rent in Greater Noida",
        "1 BHK for rent in Greater Noida",
        "2 BHK for rent in Greater Noida",
        "3 BHK for rent in Greater Noida",
        "4 BHK for rent in Greater Noida",
        "4+ BHK for rent in Greater Noida"
      ]
    },
    "Flats for sale": {
      "Bangalore": [
        "Flats in Bangalore",
        "1 RK in Bangalore",
        "1 BHK in Bangalore",
        "2 BHK in Bangalore",
        "3 BHK in Bangalore",
        "4 BHK in Bangalore",
        "4+ BHK in Bangalore"
      ],
      "Mumbai": [
        "Flats in Mumbai",
        "1 RK in Mumbai",
        "1 BHK in Mumbai",
        "2 BHK in Mumbai",
        "3 BHK in Mumbai",
        "4 BHK in Mumbai",
        "4+ BHK in Mumbai"
      ],
      "Pune": [
        "Flats in Pune",
        "1 RK in Pune",
        "1 BHK in Pune",
        "2 BHK in Pune",
        "3 BHK in Pune",
        "4 BHK in Pune",
        "4+ BHK in Pune"
      ],
      "Chennai": [
        "Flats in Chennai",
        "1 RK in Chennai",
        "1 BHK in Chennai",
        "2 BHK in Chennai",
        "3 BHK in Chennai",
        "4 BHK in Chennai",
        "4+ BHK in Chennai"
      ],
      "Gurgaon": [
        "Flats in Gurgaon",
        "1 RK in Gurgaon",
        "1 BHK in Gurgaon",
        "2 BHK in Gurgaon",
        "3 BHK in Gurgaon",
        "4 BHK in Gurgaon"
      ],
      "Hyderabad": [
        "Flats in Hyderabad",
        "1 RK in Hyderabad",
        "1 BHK in Hyderabad",
        "2 BHK in Hyderabad",
        "3 BHK in Hyderabad",
        "4 BHK in Hyderabad",
        "4+ BHK in Hyderabad"
      ],
      "Delhi": [
        "Flats in Delhi",
        "1 RK in Delhi",
        "1 BHK in Delhi",
        "2 BHK in Delhi",
        "3 BHK in Delhi",
        "4 BHK in Delhi",
        "4+ BHK in Delhi"
      ],
      "Ghaziabad": [
        "Flats in Ghaziabad",
        "1 RK in Ghaziabad",
        "1 BHK in Ghaziabad",
        "2 BHK in Ghaziabad",
        "3 BHK in Ghaziabad",
        "4 BHK in Ghaziabad",
        "4+ BHK in Ghaziabad"
      ],
      "Faridabad": [
        "Flats in Faridabad",
        "1 RK in Faridabad",
        "1 BHK in Faridabad",
        "2 BHK in Faridabad",
        "3 BHK in Faridabad",
        "4 BHK in Faridabad",
        "4+ BHK in Faridabad"
      ]
    },
    "PG/Hostels": {
      "Bangalore": [
        "PG/Hostels in Bangalore",
        "Boys PG/Hostels in Bangalore",
        "Girls PG/Hostels in Bangalore"
      ],
      "Mumbai": [
        "PG/Hostels in Mumbai",
        "Boys PG/Hostels in Mumbai", 
        "Girls PG/Hostels in Mumbai"
      ],
      "Pune": [
        "PG/Hostels in Pune",
        "Boys PG/Hostels in Pune",
        "Girls PG/Hostels in Pune"
      ],
      "Chennai": [
        "PG/Hostels in Chennai",
        "Boys PG/Hostels in Chennai",
        "Girls PG/Hostels in Chennai"
      ],
      "Gurgaon": [
        "PG/Hostels in Gurgaon",
        "Boys PG/Hostels in Gurgaon",
        "Girls PG/Hostels in Gurgaon"
      ],
      "Hyderabad": [
        "PG/Hostels in Hyderabad",
        "Boys PG/Hostels in Hyderabad",
        "Girls PG/Hostels in Hyderabad"
      ],
      "Delhi": [
        "PG/Hostels in Delhi",
        "Boys PG/Hostels in Delhi",
        "Girls PG/Hostels in Delhi"
      ],
      "Ghaziabad": [
        "PG/Hostels in Ghaziabad",
        "Boys PG/Hostels in Ghaziabad",
        "Girls PG/Hostels in Ghaziabad"
      ],
      "Faridabad": [
        "PG/Hostels in Faridabad",
        "Boys PG/Hostels in Faridabad",
        "Girls PG/Hostels in Faridabad"
      ],
      "Noida": [
        "PG/Hostels in Noida",
        "Boys PG/hostels in Noida",
        "Girls PG/Hostels in Noida"
      ],
      "Greater Noida": [
        "PG/Hostels in Greater Noida",
        "Boys PG/Hostels in Greater Noida",
        "Girls PG/Hostels in Greater Noida"
      ]
    },
    "Flatmates/Roommates": {
      "Bangalore": [
        "Flatmates/Roommates in Bangalore",
        "Male Flatmates/Roommates in Bangalore",
        "Female Flatmates/Roommates in Bangalore"
      ],
      "Mumbai": [
        "Flatmates/Roommates in Mumbai",
        "Male Flatmates/Roommates in Mumbai",
        "Female Flatmates/Roommates in Mumbai"
      ],
      "Pune": [
        "Flatmates/Roommates in Pune",
        "Male Flatmates/Roommates in Pune", 
        "Female Flatmates/Roommates in Pune"
      ],
      "Chennai": [
        "Flatmates/Roommates in Chennai",
        "Male Flatmates/Roommates in Chennai",
        "Female Flatmates/Roommates in Chennai"
      ],
      "Gurgaon": [
        "Flatmates/Roommates in Gurgaon",
        "Male Flatmates/Roommates in Gurgaon",
        "Female Flatmates/Roommates in Gurgaon"
      ],
      "Hyderabad": [
        "Flatmates/Roommates in Hyderabad",
        "Male Flatmates/Roommates in Hyderabad",
        "Female Flatmates/Roommates in Hyderabad"
      ],
      "Delhi": [
        "Flatmates/Roommates in Delhi",
        "Male Flatmates/Roommates in Delhi",
        "Female Flatmates/Roommates in Delhi"
      ],
      "Ghaziabad": [
        "Flatmates/Roommates in Ghaziabad",
        "Male Flatmates/Roommates in Ghaziabad",
        "Female Flatmates/Roommates in Ghaziabad"
      ],
      "Faridabad": [
        "Flatmates/Roommates in Faridabad",
        "Male Flatmates/Roommates in Faridabad",
        "Female Flatmates/Roommates in Faridabad"
      ],
      "Noida": [
        "Flatmates/Roommates in Noida",
        "Male Flatmates/Roommates in Noida",
        "Female Flatmates/Roommates in Noida"
      ],
      "Greater Noida": [
        "Flatmates/Roommates in Greater Noida",
        "Male Flatmates/Roommates in Greater Noida",
        "Female Flatmates/Roommates in Greater Noida"
      ]
    },
    "Projects": {
      "Bangalore": ["New Projects in Bangalore"],
      "Mumbai": ["New Projects in Mumbai"],
      "Pune": ["New Projects in Pune"],
      "Chennai": ["New Projects in Chennai"],
      "Gurgaon": ["New Projects in Gurgaon"],
      "Hyderabad": ["New Projects in Hyderabad"],
      "Delhi": ["New Projects in Delhi"],
      "Ghaziabad": ["New Projects in Ghaziabad"],
      "Faridabad": ["New Projects in Faridabad"],
      "Noida": ["New Projects in Noida"],
      "Greater Noida": ["New Projects in Greater Noida"]
    },
    "Societies": {
      "Bangalore": ["Societies in Bangalore"],
      "Mumbai": ["Societies in Mumbai"],
      "Pune": ["Societies in Pune"],
      "Chennai": ["Societies in Chennai"],
      "Gurgaon": ["Societies in Gurgaon"],
      "Hyderabad": ["Societies in Hyderabad"],
      "Delhi": ["Societies in Delhi"],
      "Ghaziabad": ["Societies in Ghaziabad"],
      "Faridabad": ["Societies in Faridabad"],
      "Noida": ["Societies in Noida"],
      "Greater Noida": ["Societies in Greater Noida"]
    },
    "Villa | House for rent": {
      "Bangalore": ["Villa | House for rent in Bangalore"],
      "Mumbai": ["Villa | House for rent in Mumbai"],
      "Pune": ["Villa | House for rent in Pune"],
      "Chennai": ["Villa | House for rent in Chennai"],
      "Gurgaon": ["Villa | House for rent in Gurgaon"],
      "Hyderabad": ["Villa | House for rent in Hyderabad"],
      "Delhi": ["Villa | House for rent in Delhi"],
      "Ghaziabad": ["Villa | House for rent in Ghaziabad"],
      "Faridabad": ["Villa | House for rent in Faridabad"],
      "Noida": ["Villa | House for rent in Noida"],
      "Greater Noida": ["Villa | House for rent in Greater Noida"]
    },
    "Villa | House for sale": {
      "Bangalore": ["Villa | House for sale in Bangalore"],
      "Mumbai": ["Villa | House for sale in Mumbai"],
      "Pune": ["Villa | House for sale in Pune"],
      "Chennai": ["Villa | House for sale in Chennai"],
      "Gurgaon": ["Villa | House for sale in Gurgaon"],
      "Hyderabad": ["Villa | House for sale in Hyderabad"],
      "Delhi": ["Villa | House for sale in Delhi"],
      "Ghaziabad": ["Villa | House for sale in Ghaziabad"],
      "Faridabad": ["Villa | House for sale in Faridabad"],
      "Noida": ["Villa | House for sale in Noida"],
      "Greater Noida": ["Villa | House for sale in Greater Noida"]
    }
  };

  return (
    <>
      <Helmet>
        <title>Sitemap - Home HNI</title>
        <meta name="description" content="Site map for Home HNI - Find all pages and services on our platform" />
        <meta name="robots" content="index, follow" />
      </Helmet>
      
      <div className="min-h-screen bg-white">
        {/* Marquee at the very top */}
        <Marquee />
        
        {/* Header overlapping with content */}
        <Header />
        
        {/* Main Content */}
        <div className="md:pt-8">
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 mt-16">
            <div className="mb-12 text-center">
              <h1 className="text-4xl font-bold text-foreground mb-4">Site Map</h1>
            </div>

            {/* Sitemap Sections */}
            <div className="space-y-16">
              {Object.entries(sitemapData).map(([mainCategory, cities]) => (
                <div key={mainCategory} className="space-y-8">
                  <h2 className="text-2xl font-bold text-brand-red mb-6">{mainCategory}</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {Object.entries(cities).map(([cityName, links]) => (
                      <div key={cityName} className="space-y-4">
                        <h3 className="text-lg font-semibold text-foreground border-b border-gray-200 pb-2">
                          {cityName}
                        </h3>
                        <ul className="space-y-2">
                          {links.map((link, index) => (
                            <li key={index}>
                              <Link 
                                to={handleLinkClick(link)}
                                state={{ scrollToSearch: true }}
                                className="text-sm text-muted-foreground hover:text-brand-red transition-colors duration-200 block py-1 hover:underline"
                              >
                                {link}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

export default Sitemap;

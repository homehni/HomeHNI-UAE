import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";

const Sitemap = () => {
  const sitemapData = {
    "Main Pages": [
      { name: "Home", path: "/" },
      { name: "About Us", path: "/about-us" },
      { name: "Contact Us", path: "/contact-us" },
      { name: "Testimonials", path: "/testimonials" },
      { name: "Careers", path: "/careers" },
      { name: "FAQ", path: "/faq" }
    ],
    "Legal Services": [
      { name: "Legal Services", path: "/legal-services" },
      { name: "Rental Agreement", path: "/rental-agreement" },
      { name: "Rent Receipts", path: "/rent-receipts" },
      { name: "Summons Notices", path: "/summons-notices" },
      { name: "Property Management", path: "/prop-management" }
    ],
    "Additional Services": [
      { name: "Packers Movers", path: "/packers-movers" },
      { name: "Painting Cleaning", path: "/painting-cleaning" },
      { name: "Refer & Earn", path: "/refer-earn" }
    ],
    "Plans & Pricing": [
      { name: "Owner Plans", path: "/owner-plans" },
      { name: "Buyer Plans", path: "/buyer-plans" }
    ],
    "Support & Policies": [
      { name: "Safety", path: "/safety" },
      { name: "Grievance Redressal", path: "/grievance-redressal" },
      { name: "Report Problem", path: "/report-problem" },
      { name: "Terms and Conditions", path: "/terms-and-conditions" },
      { name: "Privacy Policy", path: "/privacy-policy" }
    ]
  };

  return (
    <>
      <Helmet>
        <title>Sitemap - Home HNI</title>
        <meta name="description" content="Site map for Home HNI - Find all pages and services on our platform" />
        <meta name="robots" content="index, follow" />
      </Helmet>
      
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <Link to="/" className="flex items-center">
                <img 
                  src="/logo.png" 
                  alt="Home HNI" 
                  className="h-8 w-auto"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
                <span className="ml-2 text-xl font-bold text-brand-red">Home HNI</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">Site Map</h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Find all the pages and services available on Home HNI. Browse through our comprehensive directory of legal services, property management, and support resources.
            </p>
          </div>

          {/* Sitemap Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Object.entries(sitemapData).map(([category, links]) => (
              <div key={category} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-foreground mb-4 pb-2 border-b border-gray-100">
                  {category}
                </h2>
                <ul className="space-y-3">
                  {links.map((link) => (
                    <li key={link.path}>
                      <Link 
                        to={link.path}
                        className="text-muted-foreground hover:text-brand-red transition-colors duration-200 block py-1 hover:underline"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Additional Info */}
          <div className="mt-16 bg-gray-50 rounded-lg p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4">About This Sitemap</h3>
                <p className="text-muted-foreground leading-relaxed">
                  This sitemap provides a comprehensive overview of all pages and services available on Home HNI. 
                  We regularly update our content to ensure you have access to the latest information and services.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4">Need Help?</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Can't find what you're looking for? Our support team is here to help.
                </p>
                <Link 
                  to="/contact-us" 
                  className="inline-flex items-center px-4 py-2 bg-brand-red text-white rounded-md hover:bg-brand-red/90 transition-colors"
                >
                  Contact Support
                </Link>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-white border-t mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center text-muted-foreground">
              <p>&copy; 2025 Home HNI. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Sitemap;
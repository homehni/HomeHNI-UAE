import { FileText, Home, Heart, Edit, Building, Palette, Globe, Banknote, Scale } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCMSContent } from '@/hooks/useCMSContent';

const WhyUseSection = () => {
  const { content: cmsContent } = useCMSContent('why-use');
  const topServices = [{
    icon: <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
        <Building className="w-6 h-6 text-gray-600" />
      </div>,
    title: "Builder Projects",
    badge: "New",
    link: "/new-projects"
  }, {
    icon: <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
        <FileText className="w-6 h-6 text-gray-600" />
      </div>,
    title: "Sale Agreement",
    badge: "New",
    link: "/rental-agreement"
  }, {
    icon: <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
        <Banknote className="w-6 h-6 text-gray-600" />
      </div>,
    title: "Home Loan",
    link: "/loans"
  }, {
    icon: <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
        <Scale className="w-6 h-6 text-gray-600" />
      </div>,
    title: "Property Legal Services",
    link: "/legal-services"
  }, {
    icon: <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
        <Palette className="w-6 h-6 text-gray-600" />
      </div>,
    title: "Home Interiors",
    badge: "Sale is live!",
    link: "/interior"
  }, {
    icon: <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
        <Globe className="w-6 h-6 text-gray-600" />
      </div>,
    title: "NoBroker For NRIs",
    link: "/nri-services"
  }];

  const benefits = [{
    icon: <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="w-8 h-8 bg-red-500 rounded-full"></div>
      </div>,
    title: "Avoid Brokers",
    description: "We directly connect you to verified owners to save brokerage"
  }, {
    icon: <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
        <FileText className="w-8 h-8 text-gray-600" />
      </div>,
    title: "Free Listing",
    description: "Easy listing process. Also using WhatsApp"
  }, {
    icon: <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
        <Home className="w-8 h-8 text-gray-600" />
        <Heart className="w-4 h-4 text-red-500 absolute" />
      </div>,
    title: "Shortlist without Visit",
    description: "Extensive Information makes it easy"
  }, {
    icon: <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
        <FileText className="w-8 h-8 text-gray-600" />
      </div>,
    title: "Rental Agreement",
    description: "Assistance in creating Rental agreement & Paper work"
  }];
  return <section className="py-16 bg-white section-separator">
      {/* Top promotional banner */}
      <div className="text-white py-3 mb-12" style={{
      backgroundColor: '#d21404'
    }}>
        <div className="container mx-auto px-4 flex items-center justify-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
              <span className="text-slate-700 text-xs font-bold">₹</span>
            </div>
            <span className="text-sm text-uniform">
              Do you know how much <strong>loan</strong> you can get? Get maximum with <strong>Home Hni</strong>
            </span>
          </div>
          <button className="bg-white text-slate-700 px-4 py-1 rounded text-sm font-medium hover:bg-gray-100 transition-colors card-border">
            Check Eligibility
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4">
        {/* Top services grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-16">
          {topServices.map((service, index) => 
            <Link key={index} to={service.link} className="card-border hover-lift p-4 bg-white block transition-transform">
              <div className="relative flex items-center justify-center mb-3 w-full">
                {service.icon}
                {service.badge && <span className={`absolute -top-2 -right-2 px-2 py-1 text-xs rounded-full text-white ${service.badge === "Sale is live!" ? "bg-green-500" : "bg-orange-500"}`}>
                    {service.badge}
                  </span>}
              </div>
              <h3 className="text-sm font-medium text-gray-700 text-uniform-center">{service.title}</h3>
            </Link>
          )}
        </div>

        {/* Why Use NoBroker section */}
        <div className="text-uniform-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">{cmsContent?.content?.title || 'Why Use Home HNI'}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => <div key={index} className="card-border-accent hover-lift p-6 bg-white">
                <div className="relative inline-block mb-4 text-uniform-center w-full">
                  {benefit.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2 text-left">{benefit.title}</h3>
                <p className="text-sm text-gray-600 text-uniform">{benefit.description}</p>
              </div>)}
          </div>
        </div>
      </div>
    </section>;
};
export default WhyUseSection;
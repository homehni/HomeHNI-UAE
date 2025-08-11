import { FileText, Home, Heart, Edit } from 'lucide-react';
const WhyUseSection = () => {
  const topServices = [{
    icon: <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="w-8 h-8 bg-gray-300 rounded"></div>
      </div>,
    title: "Builder Projects",
    badge: "New"
  }, {
    icon: <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
        <FileText className="w-6 h-6 text-gray-600" />
      </div>,
    title: "Sale Agreement",
    badge: "New"
  }, {
    icon: <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
          <span className="text-white text-xs">₹</span>
        </div>
      </div>,
    title: "Home Loan"
  }, {
    icon: <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
        <Edit className="w-6 h-6 text-gray-600" />
      </div>,
    title: "Property Legal Services"
  }, {
    icon: <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="w-8 h-6 bg-gray-300 rounded"></div>
      </div>,
    title: "Home Interiors",
    badge: "Sale is live!"
  }, {
    icon: <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-gray-400 rounded-full"></div>
      </div>,
    title: "NoBroker For NRIs"
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
  return <section className="py-16 bg-white">
      {/* Top promotional banner */}
      <div className="text-white py-3 mb-12" style={{
      backgroundColor: '#d21404'
    }}>
        <div className="container mx-auto px-4 flex items-center justify-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
              <span className="text-slate-700 text-xs font-bold">₹</span>
            </div>
            <span className="text-sm">
              Do you know how much <strong>loan</strong> you can get? Get maximum with <strong>Home Hni</strong>
            </span>
          </div>
          <button className="bg-white text-slate-700 px-4 py-1 rounded text-sm font-medium hover:bg-gray-100 transition-colors">
            Check Eligibility
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4">
        {/* Top services grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-16">
          {topServices.map((service, index) => <div key={index} className="text-center">
              <div className="relative inline-block mb-3">
                {service.icon}
                {service.badge && <span className={`absolute -top-2 -right-2 px-2 py-1 text-xs rounded-full text-white ${service.badge === "Sale is live!" ? "bg-green-500" : "bg-orange-500"}`}>
                    {service.badge}
                  </span>}
              </div>
              <h3 className="text-sm font-medium text-gray-700">{service.title}</h3>
            </div>)}
        </div>

        {/* Why Use NoBroker section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">Why Use Home HNI</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => <div key={index} className="text-center">
                <div className="relative inline-block mb-4">
                  {benefit.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{benefit.title}</h3>
                <p className="text-sm text-gray-600">{benefit.description}</p>
              </div>)}
          </div>
        </div>
      </div>
    </section>;
};
export default WhyUseSection;
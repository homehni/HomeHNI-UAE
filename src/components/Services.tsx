import { Shield, Search, FileText, Key, TrendingUp, Users } from 'lucide-react';
const Services = () => {
  const services = [{
    icon: Search,
    title: 'Property Search',
    description: 'Find your perfect property with our advanced search filters and personalized recommendations.'
  }, {
    icon: Shield,
    title: 'Verified Listings',
    description: 'All our properties are verified and come with authentic documents for your peace of mind.'
  }, {
    icon: FileText,
    title: 'Legal Assistance',
    description: 'Get expert legal guidance for property documentation and registration processes.'
  }, {
    icon: Key,
    title: 'Property Management',
    description: 'Complete property management services for landlords and property investors.'
  }, {
    icon: TrendingUp,
    title: 'Market Analysis',
    description: 'Get detailed market insights and property valuation reports from our experts.'
  }, {
    icon: Users,
    title: 'Expert Consultation',
    description: 'Connect with certified real estate experts for personalized property advice.'
  }];
  return <section className="py-16 bg-white section-separator">
      <div className="container mx-auto px-4">
        <div className="text-uniform-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Our Services
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Comprehensive real estate solutions tailored to meet all your property needs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => <div key={index} className="card-border card-border-accent hover-lift p-6 bg-white">
              <div className="text-uniform-center">
                <div className="w-16 h-16 bg-gradient-to-br from-brand-red to-brand-maroon rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <service.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{service.title}</h3>
                <p className="text-gray-600 text-uniform text-center">{service.description}</p>
              </div>
            </div>)}
        </div>
      </div>
    </section>;
};
export default Services;
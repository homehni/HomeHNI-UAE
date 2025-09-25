import { FileText, Home, Heart, Building, Palette, Globe, Banknote, Scale, UserX, Upload, Eye, FileSignature } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCMSContent } from '@/hooks/useCMSContent';

const WhyUseSection = () => {
  const { content: cmsContent } = useCMSContent('why-use');

  const topServices = [
    {
      icon: (
        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
          <Building className="w-6 h-6 text-gray-600" />
        </div>
      ),
      title: 'Builder Projects',
      badge: 'New',
      link: '/new-projects',
    },
    {
      icon: (
        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
          <FileText className="w-6 h-6 text-gray-600" />
        </div>
      ),
      title: 'Sale Agreement',
      badge: 'New',
      link: '/rental-agreement',
    },
    {
      icon: (
        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
          <Banknote className="w-6 h-6 text-gray-600" />
        </div>
      ),
      title: 'Home Loan',
      link: '/loans',
    },
    {
      icon: (
        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
          <Scale className="w-6 h-6 text-gray-600" />
        </div>
      ),
      title: 'Property Legal Services',
      link: '/legal-services',
    },
    {
      icon: (
        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
          <Palette className="w-6 h-6 text-gray-600" />
        </div>
      ),
      title: 'Home Interiors',
      badge: 'Sale is live!',
      link: '/interior',
    },
    {
      icon: (
        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
          <Globe className="w-6 h-6 text-gray-600" />
        </div>
      ),
      title: 'Home HNI For NRIs',
      link: '/nri-services',
    },
  ];

  const benefits = [
    {
      icon: (
        <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
          <UserX className="w-8 h-8 text-red-500" />
        </div>
      ),
      title: 'Avoid Brokers',
      description: 'We directly connect you to verified owners to save brokerage',
    },
    {
      icon: (
        <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
          <Upload className="w-8 h-8 text-red-500" />
        </div>
      ),
      title: 'Free Listing',
      description: 'Easy listing process. Also using WhatsApp',
    },
    {
      icon: (
        <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
          <Eye className="w-8 h-8 text-red-500" />
        </div>
      ),
      title: 'Shortlist without Visit',
      description: 'Extensive Information makes it easy',
    },
    {
      icon: (
        <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
          <FileSignature className="w-8 h-8 text-red-500" />
        </div>
      ),
      title: 'Rental Agreement',
      description: 'Assistance in creating Rental agreement & Paper work',
    },
  ];

  return (
    <section className="py-8 bg-white section-separator">
      {/* Top promotional banner (mobile-friendly) */}
      <div className="text-white py-3 mb-12" style={{ backgroundColor: '#d21404' }}>
        <div className="container mx-auto px-4 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center" aria-hidden="true">
              <span className="text-slate-700 text-xs font-bold">₹</span>
            </div>
            <span className="text-sm text-uniform">
              Do you know how much <strong>loan</strong> you can get? Get maximum with{' '}
              <strong>Home HNI</strong>
            </span>
          </div>

          {/* React Router link styled as button */}
          <Link
            to="/loans"
            aria-label="Check home loan eligibility"
            className="inline-flex items-center justify-center bg-white text-slate-700 px-4 py-1 rounded text-sm font-medium hover:bg-gray-100 transition-colors card-border focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-600"
          >
            Check Eligibility
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4">
        {/* Top services grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-16">
          {topServices.map((service, index) => (
            <Link
              key={index}
              to={service.link}
              className="card-border hover-lift p-4 bg-white block transition-transform"
            >
              <div className="relative flex items-center justify-center mb-3 w-full">
                {service.icon}
                {service.badge && (
                  <span
                    className={`absolute -top-2 -right-2 px-2 py-1 text-xs rounded-full text-white ${
                      service.badge === 'Sale is live!' ? 'bg-green-500' : 'bg-orange-500'
                    }`}
                  >
                    {service.badge}
                  </span>
                )}
              </div>
              <h3 className="text-sm font-medium text-gray-700 text-uniform-center">
                {service.title}
              </h3>
            </Link>
          ))}
        </div>

        {/* Why Use Home HNI section */}
        <div className="text-uniform-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">
            {cmsContent?.content?.title || 'Why Use Home HNI'}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="card-border-accent hover-lift p-6 bg-white text-uniform-center">
                <div className="flex justify-center items-center mb-4 w-full">
                  {benefit.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2 text-uniform-center">
                  {benefit.title}
                </h3>
                <p className="text-sm text-gray-600 text-uniform-center">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyUseSection;

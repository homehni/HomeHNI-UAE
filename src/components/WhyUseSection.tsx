import { UserX, Upload, Eye, FileSignature } from 'lucide-react';
import { useCMSContent } from '@/hooks/useCMSContent';

const WhyUseSection = () => {
  const { content: cmsContent } = useCMSContent('why-use');

  const benefits = [
    {
      icon: (
        <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
          <UserX className="w-8 h-8 text-[#22c55e]" />
        </div>
      ),
      title: 'Expert Agents',
      description: 'Connect with certified real estate professionals for trusted guidance',
    },
    {
      icon: (
        <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
          <Upload className="w-8 h-8 text-[#22c55e]" />
        </div>
      ),
      title: 'Premium Listing',
      description: 'Professional listing service with enhanced visibility. Also using WhatsApp',
    },
    {
      icon: (
        <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
          <Eye className="w-8 h-8 text-[#22c55e]" />
        </div>
      ),
      title: 'Shortlist without Visit',
      description: 'Extensive Information makes it easy',
    },
    {
      icon: (
        <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
          <FileSignature className="w-8 h-8 text-[#22c55e]" />
        </div>
      ),
      title: 'Rental Agreement',
      description: 'Assistance in creating Rental agreement & Paper work',
    },
  ];

  return (
    <section className="py-8 bg-white section-separator">
      <div className="container mx-auto px-4">
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

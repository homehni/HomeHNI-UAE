import React from 'react';
import { Shield, Star, Facebook, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';

const GetTenantsFasterSection: React.FC = () => {
  const features = [
    {
      icon: Shield,
      title: "Privacy",
      description: "Your data is secure with us"
    },
    {
      icon: Star,
      title: "Promoted Listing",
      description: "Get better visibility"
    },
    {
      icon: Facebook,
      title: "Social Marketing",
      description: "Reach more potential tenants"
    },
    {
      icon: Tag,
      title: "Price Consultation",
      description: "Get expert pricing advice"
    }
  ];

  return (
    <div className="w-full h-full bg-gray-50 border-l border-gray-200 hidden lg:block">
      <div className="p-6 space-y-6 min-h-screen flex flex-col">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-xl font-medium text-gray-700 mb-3">Get Tenants Faster</h2>
          <p className="text-sm text-gray-600 leading-relaxed px-2">
            Subscribe to our owner plans and find Tenants quickly and with ease
          </p>
        </div>

        {/* Features */}
        <div className="space-y-6">
          {features.map((feature, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-3 shadow-sm border border-gray-200">
                <feature.icon className="w-6 h-6 text-gray-600" strokeWidth={1.5} />
              </div>
              <h3 className="font-medium text-gray-700 text-base mb-1">{feature.title}</h3>
              <p className="text-gray-500 text-xs">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <div className="pt-6">
          <Button className="w-full font-medium py-3 rounded-md">
            Show Interest
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GetTenantsFasterSection;
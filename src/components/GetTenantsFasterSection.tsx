import React, { useState } from 'react';
import { Shield, Star, Facebook, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
const GetTenantsFasterSection: React.FC = () => {
  const { toast } = useToast();
  const [interestShown, setInterestShown] = useState(false);
  
  const handleShowInterest = () => {
    setInterestShown(true);
    toast({
      title: "Your request has been submitted successfully.",
      description: "Our executives will reach out to you soon.",
    });
  };

  const features = [{
    icon: Shield,
    title: "Privacy",
    description: "Your data is secure with us"
  }, {
    icon: Star,
    title: "Promoted Listing",
    description: "Get better visibility"
  }, {
    icon: Facebook,
    title: "Social Marketing",
    description: "Reach more potential tenants"
  }, {
    icon: Tag,
    title: "Price Consultation",
    description: "Get expert pricing advice"
  }];
  return <div className="w-full h-full bg-gray-50 border-l border-gray-200 hidden lg:block">
      <div className="p-4 space-y-4 flex flex-col">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-lg font-medium text-gray-700 mb-2">Get Tenants Faster</h2>
          <p className="text-xs text-gray-600 leading-relaxed px-1">
            Subscribe to our owner plans and find Tenants quickly and with ease
          </p>
        </div>

        {/* Features */}
        <div className="space-y-3">
          {features.map((feature, index) => <div key={index} className="flex flex-col items-center text-center">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mb-1 shadow-sm border border-gray-200">
                <feature.icon className="w-4 h-4 text-gray-600" strokeWidth={1.5} />
              </div>
              <h3 className="font-medium text-gray-700 text-xs mb-1">{feature.title}</h3>
              
            </div>)}
        </div>

        {/* CTA Button */}
        <div className="pt-2">
          <Button 
            onClick={handleShowInterest}
            className="w-full font-medium py-2 rounded-md bg-red-800 hover:bg-red-900 text-white text-sm"
          >
            {interestShown ? "Interest shown" : "Show Interest"}
          </Button>
        </div>
      </div>
    </div>;
};
export default GetTenantsFasterSection;
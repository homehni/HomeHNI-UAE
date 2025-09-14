import React from 'react';
import { 
  Truck, 
  FileText, 
  Paintbrush, 
  Sparkles, 
  Wrench 
} from 'lucide-react';

export const ServicesCard: React.FC = () => {
  const services = [
    {
      icon: Truck,
      name: 'Packers and Movers',
      isNew: false
    },
    {
      icon: FileText,
      name: 'Create Agreement',
      isNew: false
    },
    {
      icon: Paintbrush,
      name: 'Painting',
      isNew: false
    },
    {
      icon: Sparkles,
      name: 'Cleaning',
      isNew: false
    },
    {
      icon: Wrench,
      name: 'Home Repairs',
      isNew: true
    }
  ];

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      <div className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          Home HNI Services
        </h2>
        
        <div className="grid grid-cols-5 gap-6">
          {services.map((service, index) => {
            const IconComponent = service.icon;
            return (
              <div key={index} className="flex flex-col items-center text-center relative">
                {service.isNew && (
                  <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                    NEW
                  </div>
                )}
                <div className="w-16 h-16 bg-gray-50 rounded-lg flex items-center justify-center mb-3 border border-gray-100 hover:bg-gray-100 transition-colors cursor-pointer">
                  <IconComponent className="w-6 h-6 text-red-600" />
                </div>
                <span className="text-sm text-gray-700 font-medium">
                  {service.name}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
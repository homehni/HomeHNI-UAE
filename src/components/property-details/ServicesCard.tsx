import React from 'react';
import { Link } from 'react-router-dom';
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
      isNew: false,
      link: '/packers-movers'
    },
    {
      icon: FileText,
      name: 'Create Agreement',
      isNew: false,
      link: '/legal-services'
    },
    {
      icon: Paintbrush,
      name: 'Painting',
      isNew: false,
      link: '/painting-cleaning'
    },
    {
      icon: Sparkles,
      name: 'Cleaning',
      isNew: false,
      link: '/painting-cleaning'
    },
    {
      icon: Wrench,
      name: 'Home Repairs',
      isNew: true,
      link: '/handover-services'
    }
  ];

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      <div className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          Home HNI Services
        </h2>
        
        <div className="grid grid-cols-3 md:grid-cols-5 gap-4 md:gap-6">
          {services.map((service, index) => {
            const IconComponent = service.icon;
            return (
              <Link 
                key={index} 
                to={service.link}
                className="flex flex-col items-center text-center relative group p-3 rounded-lg border border-gray-100 hover:border-red-200 transition-colors"
              >
                {service.isNew && (
                  <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium z-10">
                    NEW
                  </div>
                )}
                <div className="w-12 h-12 md:w-16 md:h-16 bg-gray-50 rounded-lg flex items-center justify-center mb-2 md:mb-3 border border-gray-100 group-hover:bg-red-50 transition-colors">
                  <IconComponent className="w-5 h-5 md:w-6 md:h-6 text-red-600" />
                </div>
                <span className="text-xs md:text-sm text-gray-700 font-medium group-hover:text-red-600 transition-colors leading-tight">
                  {service.name}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};
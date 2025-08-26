import React from 'react';
import { Paintbrush, Calculator, FileText, ShieldCheck } from 'lucide-react';

interface ServicesStripProps {
  onLegalServices: () => void;
}

export const ServicesStrip: React.FC<ServicesStripProps> = ({ onLegalServices }) => {
  const services = [
    { 
      icon: Paintbrush, 
      label: 'Painting',
      onClick: () => {}
    },
    { 
      icon: Calculator, 
      label: 'Estimate Cost',
      onClick: () => {}
    },
    { 
      icon: FileText, 
      label: 'Legal Services',
      onClick: onLegalServices
    },
    { 
      icon: ShieldCheck, 
      label: 'Create Agreement',
      onClick: () => {}
    },
  ];

  return (
    <div className="rounded-2xl border-2 border-red-500 bg-white shadow-lg">
      <div className="p-5 pt-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <div
                key={index}
                onClick={service.onClick}
                className="group flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <div 
                  className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: '#fff0ee' }}
                >
                  <Icon className="w-5 h-5" style={{ color: '#d21404' }} />
                </div>
                <span className="text-sm font-medium text-gray-800 group-hover:text-[#d21404]">
                  {service.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
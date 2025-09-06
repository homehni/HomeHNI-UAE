import React from 'react';
import { Home, MapPin, Building, Sparkles, Camera, FileText, Calendar } from 'lucide-react';

interface RentalSidebarProps {
  currentStep: number;
}

export const RentalSidebar: React.FC<RentalSidebarProps> = ({ currentStep }) => {
  const steps = [
    { icon: Home, label: 'Property Details', active: currentStep === 1 || currentStep === 2 },
    { icon: MapPin, label: 'Location Details', active: currentStep === 2 },
    { icon: Building, label: 'Rental Details', active: currentStep === 3 },
    { icon: Sparkles, label: 'What You Get', active: currentStep === 4 },
    { icon: Camera, label: 'Gallery', active: currentStep === 5 },
    { icon: FileText, label: 'Additional Information', active: currentStep === 6 },
    { icon: Calendar, label: 'Schedule', active: currentStep === 7 },
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 min-h-screen">
      <div className="p-6">
        <nav className="space-y-2">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.label}
                className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                  step.active
                    ? 'bg-primary/10 text-primary border-l-4 border-primary'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="text-sm font-medium">{step.label}</span>
              </div>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

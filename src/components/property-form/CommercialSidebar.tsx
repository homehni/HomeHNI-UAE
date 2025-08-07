import React from 'react';
import { Building, MapPin, DollarSign, Sparkles, Camera, FileText, Calendar } from 'lucide-react';

interface CommercialSidebarProps {
  currentStep: number;
  completedSteps: number[];
  onStepClick: (step: number) => void;
}

export const CommercialSidebar: React.FC<CommercialSidebarProps> = ({
  currentStep,
  completedSteps,
  onStepClick
}) => {
  const steps = [
    { 
      id: 2, 
      icon: Building, 
      label: 'Property Details', 
      description: 'Space type, area, facilities' 
    },
    { 
      id: 3, 
      icon: MapPin, 
      label: 'Location Details', 
      description: 'Address and locality' 
    },
    { 
      id: 4, 
      icon: DollarSign, 
      label: 'Rental Details', 
      description: 'Rent, deposit, lease terms' 
    },
    { 
      id: 5, 
      icon: Sparkles, 
      label: 'Amenities', 
      description: 'Facilities and features' 
    },
    { 
      id: 6, 
      icon: Camera, 
      label: 'Gallery', 
      description: 'Photos and videos' 
    },
    { 
      id: 7, 
      icon: FileText, 
      label: 'Additional Info', 
      description: 'Description and extras' 
    },
    { 
      id: 8, 
      icon: Calendar, 
      label: 'Schedule', 
      description: 'Viewing schedule' 
    },
  ];

  const getStepStatus = (stepId: number) => {
    if (completedSteps.includes(stepId)) return 'completed';
    if (stepId === currentStep) return 'current';
    if (stepId < currentStep) return 'available';
    return 'upcoming';
  };

  const getStepClasses = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-primary/10 text-primary border-l-4 border-primary cursor-pointer hover:bg-primary/15';
      case 'current':
        return 'bg-primary/20 text-primary border-l-4 border-primary';
      case 'available':
        return 'text-gray-600 hover:bg-gray-50 cursor-pointer';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <div className="w-72 bg-white border-r border-gray-200 min-h-screen">
      <div className="p-6">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Commercial Property Listing</h2>
          <p className="text-sm text-gray-600 mt-1">Complete all steps to list your commercial property</p>
        </div>
        
        <nav className="space-y-2">
          {steps.map((step) => {
            const Icon = step.icon;
            const status = getStepStatus(step.id);
            const isClickable = status === 'completed' || status === 'available';
            
            return (
              <div
                key={step.id}
                className={`flex items-start space-x-3 p-3 rounded-lg transition-colors ${getStepClasses(status)}`}
                onClick={isClickable ? () => onStepClick(step.id) : undefined}
              >
                <div className="flex-shrink-0 mt-0.5">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">{step.label}</span>
                    {status === 'completed' && (
                      <svg className="h-4 w-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{step.description}</p>
                </div>
              </div>
            );
          })}
        </nav>

        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <h3 className="text-sm font-medium text-blue-900 mb-2">Need Help?</h3>
          <p className="text-xs text-blue-700 mb-3">
            Our team can help you list your commercial property with professional photos and descriptions.
          </p>
          <button className="text-xs text-blue-600 hover:text-blue-800 font-medium">
            Get Professional Help →
          </button>
        </div>
      </div>
    </div>
  );
};
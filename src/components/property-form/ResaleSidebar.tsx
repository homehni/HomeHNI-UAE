import React from 'react';
import { Home, MapPin, Building, Sparkles, Camera, FileText, Clock, CheckCircle } from 'lucide-react';

interface SidebarStep {
  number: number;
  title: string;
  icon: React.ElementType;
  completed: boolean;
  active: boolean;
}

interface ResaleSidebarProps {
  currentStep: number;
  completedSteps: number[];
}

export const ResaleSidebar: React.FC<ResaleSidebarProps> = ({
  currentStep,
  completedSteps
}) => {
  const sidebarSteps: SidebarStep[] = [
    { 
      number: 1, 
      title: "Property Details", 
      icon: Home, 
      completed: completedSteps.includes(1), 
      active: currentStep === 1 
    },
    { 
      number: 2, 
      title: "Location Details", 
      icon: MapPin, 
      completed: completedSteps.includes(2), 
      active: currentStep === 2 
    },
    { 
      number: 3, 
      title: "Resale Details", 
      icon: Building, 
      completed: completedSteps.includes(3), 
      active: currentStep === 3 
    },
    { 
      number: 4, 
      title: "Amenities", 
      icon: Sparkles, 
      completed: completedSteps.includes(4), 
      active: currentStep === 4 
    },
    { 
      number: 5, 
      title: "Gallery", 
      icon: Camera, 
      completed: completedSteps.includes(5), 
      active: currentStep === 5 
    },
    { 
      number: 6, 
      title: "Additional Information", 
      icon: FileText, 
      completed: completedSteps.includes(6), 
      active: currentStep === 6 
    },
    { 
      number: 7, 
      title: "Schedule", 
      icon: Clock, 
      completed: completedSteps.includes(7), 
      active: currentStep === 7 
    },
    { 
      number: 8, 
      title: "Preview & Submit", 
      icon: CheckCircle, 
      completed: completedSteps.includes(8), 
      active: currentStep === 8 
    },
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 min-h-screen p-6">
      <div className="space-y-1">
        {sidebarSteps.map((step) => {
          const Icon = step.icon;
          return (
            <div
              key={step.number}
              className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                step.active 
                  ? 'bg-red-50 text-red-600 border-l-4 border-red-500' 
                  : step.completed 
                    ? 'text-green-600 bg-green-50' 
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                step.active 
                  ? 'border-red-500 bg-red-500 text-white' 
                  : step.completed 
                    ? 'border-green-500 bg-green-500 text-white' 
                    : 'border-gray-300 bg-white'
              }`}>
                {step.completed ? (
                  <CheckCircle className="w-4 h-4" />
                ) : (
                  <Icon className="w-4 h-4" />
                )}
              </div>
              <span className="font-medium text-sm">{step.title}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
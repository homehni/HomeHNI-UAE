import React from 'react';
import { Building, MapPin, IndianRupee, Sparkles, Camera, FileText, Calendar, Home, CheckCircle, Eye } from 'lucide-react';

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
      completed: completedSteps.includes(2),
      active: currentStep === 2
    },
    { 
      id: 3, 
      icon: MapPin, 
      label: 'Locality Details', 
      completed: completedSteps.includes(3),
      active: currentStep === 3
    },
    { 
      id: 4, 
      icon: IndianRupee, 
      label: 'Rental Details', 
      completed: completedSteps.includes(4),
      active: currentStep === 4
    },
    { 
      id: 5, 
      icon: Sparkles, 
      label: 'Amenities', 
      completed: completedSteps.includes(5),
      active: currentStep === 5
    },
    { 
      id: 6, 
      icon: Camera, 
      label: 'Gallery', 
      completed: completedSteps.includes(6),
      active: currentStep === 6
    },
    { 
      id: 7, 
      icon: Calendar, 
      label: 'Schedule', 
      completed: completedSteps.includes(7),
      active: currentStep === 7
    },
  ];

  return (
    <div className="w-80 bg-white border-r border-gray-200 h-full p-3 flex-shrink-0">
      {/* Logo/Header */}
      <div className="mb-4 p-2">
        <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center">
          <Home className="w-5 h-5 text-white" />
        </div>
      </div>

      {/* Steps */}
      <div className="space-y-2">
        {steps.map((step) => (
          <div
            key={step.id}
            className={`flex items-center gap-2 p-2 rounded-lg transition-all duration-200 ${
              step.active 
                ? 'bg-teal-50 border-l-4 border-teal-500' 
                : step.completed 
                  ? 'hover:bg-gray-50' 
                  : 'text-gray-400'
            }`}
            onClick={step.completed || step.id <= currentStep ? () => onStepClick(step.id) : undefined}
          >
            <div className={`flex items-center justify-center w-7 h-7 rounded-lg ${
              step.active 
                ? 'text-teal-600' 
                : step.completed 
                  ? 'text-green-600' 
                  : 'text-gray-400'
            }`}>
              {step.completed ? (
                <CheckCircle className="w-4 h-4" />
              ) : (
                <div className="text-sm">
                  <step.icon className="w-4 h-4" />
                </div>
              )}
            </div>
            <span className={`text-sm font-medium ${
              step.active 
                ? 'text-teal-700' 
                : step.completed 
                  ? 'text-gray-700' 
                  : 'text-gray-400'
            }`}>
              {step.label}
            </span>
          </div>
        ))}
      </div>

      {/* Circular Progress Indicator */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-center">
          <div className="relative w-20 h-20">
            <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 36 36">
              <path
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#e5e7eb"
                strokeWidth="2"
              />
              <path
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#10b981"
                strokeWidth="2"
                strokeDasharray={`${Math.min((currentStep / 7) * 100, 100)}, 100`}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-lg font-semibold text-gray-700">
                {Math.min(Math.round((currentStep / 7) * 100), 100)}%
              </span>
            </div>
          </div>
        </div>
        <div className="text-center mt-2">
          <p className="text-xs text-gray-600">Property Score</p>
          <p className="text-xs text-gray-500">Better your property score, greater your visibility</p>
        </div>
      </div>
    </div>
  );
};
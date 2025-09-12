import React from 'react';
import { Home, MapPin, Building, Sparkles, Camera, Calendar, CheckCircle } from 'lucide-react';

interface SidebarStep {
  number: number;
  title: string;
  icon: React.ReactNode;
  completed: boolean;
  active: boolean;
}

interface PropertyFormSidebarProps {
  currentStep: number;
  completedSteps: number[];
  steps: { title: string; icon: React.ReactNode }[];
}

export const PropertyFormSidebar: React.FC<PropertyFormSidebarProps> = ({
  currentStep,
  completedSteps,
  steps
}) => {
  const sidebarSteps: SidebarStep[] = steps.map((step, index) => ({
    number: index + 1,
    title: step.title,
    icon: step.icon,
    completed: completedSteps.includes(index + 1),
    active: currentStep === index + 1
  }));

  return (
    <div className="w-56 bg-white border-r border-gray-200 h-full p-2 flex-shrink-0">
      {/* Logo/Header */}
      <div className="mb-2 p-1">
        <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
          <Home className="w-4 h-4 text-white" />
        </div>
      </div>

      {/* Steps */}
      <div className="space-y-1">
        {sidebarSteps.map((step) => (
          <div
            key={step.number}
            className={`flex items-center gap-1 p-1 rounded transition-all duration-200 ${
              step.active 
                ? 'bg-teal-50 border-l-2 border-teal-500' 
                : step.completed 
                  ? 'hover:bg-gray-50' 
                  : 'text-gray-400'
            }`}
          >
            <div className={`flex items-center justify-center w-5 h-5 rounded ${
              step.active 
                ? 'text-teal-600' 
                : step.completed 
                  ? 'text-green-600' 
                  : 'text-gray-400'
            }`}>
              {step.completed ? (
                <CheckCircle className="w-3 h-3" />
              ) : (
                <div className="text-xs">
                  {step.icon}
                </div>
              )}
            </div>
            <span className={`text-xs font-medium truncate ${
              step.active 
                ? 'text-teal-700' 
                : step.completed 
                  ? 'text-gray-700' 
                  : 'text-gray-400'
            }`}>
              {step.title}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
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
    <div className="w-80 bg-white border-r border-gray-200 min-h-screen p-6">
      {/* Logo/Header */}
      <div className="mb-8 p-4">
        <div className="w-14 h-14 bg-red-500 rounded-xl flex items-center justify-center">
          <Home className="w-7 h-7 text-white" />
        </div>
      </div>

      {/* Steps */}
      <div className="space-y-3">
        {sidebarSteps.map((step) => (
          <div
            key={step.number}
            className={`flex items-center gap-4 p-4 rounded-xl transition-all duration-200 ${
              step.active 
                ? 'bg-teal-50 border border-teal-200 shadow-sm' 
                : step.completed 
                  ? 'hover:bg-gray-50' 
                  : 'text-gray-400'
            }`}
          >
            <div className={`flex items-center justify-center w-10 h-10 rounded-xl ${
              step.active 
                ? 'bg-teal-100 text-teal-600' 
                : step.completed 
                  ? 'bg-green-100 text-green-600' 
                  : 'bg-gray-100 text-gray-400'
            }`}>
              {step.completed ? (
                <CheckCircle className="w-6 h-6" />
              ) : (
                <div className="text-lg">
                  {step.icon}
                </div>
              )}
            </div>
            <span className={`text-base font-medium ${
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
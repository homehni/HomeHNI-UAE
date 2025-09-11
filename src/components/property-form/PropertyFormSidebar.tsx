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
    <div className="w-64 bg-white border-r border-gray-200 min-h-screen p-4">
      {/* Logo/Header */}
      <div className="mb-8 p-4">
        <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center">
          <Home className="w-6 h-6 text-white" />
        </div>
      </div>

      {/* Steps */}
      <div className="space-y-2">
        {sidebarSteps.map((step) => (
          <div
            key={step.number}
            className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
              step.active 
                ? 'bg-teal-50 border-l-4 border-teal-500' 
                : step.completed 
                  ? 'text-gray-600' 
                  : 'text-gray-400'
            }`}
          >
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
              step.active 
                ? 'text-teal-600' 
                : step.completed 
                  ? 'text-green-600' 
                  : 'text-gray-400'
            }`}>
              {step.completed ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                step.icon
              )}
            </div>
            <span className={`text-sm font-medium ${
              step.active 
                ? 'text-teal-600' 
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
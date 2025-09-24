import React from 'react';
import { Home, MapPin, IndianRupee, Sparkles, Camera, FileText, Calendar, CheckCircle } from 'lucide-react';

interface SidebarStep {
  number: number;
  title: string;
  icon: React.ElementType;
  completed: boolean;
  active: boolean;
}

interface LandPlotSidebarProps {
  currentStep: number;
  completedSteps: number[];
}

export const LandPlotSidebar: React.FC<LandPlotSidebarProps> = ({
  currentStep,
  completedSteps
}) => {
  const sidebarSteps: SidebarStep[] = [
    { 
      number: 1, 
      title: "Plot Details", 
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
      title: "Sale Details", 
      icon: IndianRupee, 
      completed: completedSteps.includes(3), 
      active: currentStep === 3 
    },
    { 
      number: 4, 
      title: "Infrastructure", 
      icon: Sparkles, 
      completed: completedSteps.includes(4), 
      active: currentStep === 4 
    },
    { 
      number: 5, 
      title: "Photos & Videos", 
      icon: Camera, 
      completed: completedSteps.includes(5), 
      active: currentStep === 5 
    },
    { 
      number: 6, 
      title: "Schedule", 
      icon: Calendar, 
      completed: completedSteps.includes(6), 
      active: currentStep === 6 
    },
    { 
      number: 7, 
      title: "Preview & Submit", 
      icon: CheckCircle, 
      completed: completedSteps.includes(7), 
      active: currentStep === 7 
    },
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 min-h-screen p-6">
      {/* Navigation Steps */}
      <div className="space-y-1">
        {sidebarSteps.map((step) => {
          const Icon = step.icon;
          return (
            <div
              key={step.number}
              className={`flex items-center gap-3 p-3 transition-colors ${
                step.active 
                  ? 'bg-teal-50 text-teal-600 border-l-4 border-teal-500' 
                  : step.completed 
                    ? 'text-teal-600 bg-teal-50' 
                    : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <div className={`flex items-center justify-center w-8 h-8 rounded-lg ${
                step.active 
                  ? 'bg-teal-500 text-white' 
                  : step.completed 
                    ? 'bg-teal-500 text-white' 
                    : 'text-gray-400'
              }`}>
                {step.completed ? (
                  <CheckCircle className="w-4 h-4" />
                ) : (
                  <Icon className="w-4 h-4" />
                )}
              </div>
              <span className={`font-medium text-sm ${
                step.active 
                  ? 'text-teal-600' 
                  : step.completed 
                    ? 'text-teal-600' 
                    : 'text-gray-400'
              }`}>{step.title}</span>
            </div>
          );
        })}
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
                stroke="#14b8a6"
                strokeWidth="2"
                strokeDasharray={`${Math.min(17 + (completedSteps.length / 7) * 83, 100)}, 100`}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-lg font-semibold text-gray-700">
                {Math.min(Math.round(17 + (completedSteps.length / 7) * 83), 100)}%
              </span>
            </div>
          </div>
        </div>
        <div className="text-center mt-2">
          <p className="text-xs text-gray-600">Completion Progress</p>
          <p className="text-xs text-gray-500">Complete all steps to publish your property</p>
        </div>
      </div>
    </div>
  );
};

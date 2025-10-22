import React from 'react';
import { Building, MapPin, IndianRupee, Sparkles, Camera, Calendar, Home, CheckCircle, Eye } from 'lucide-react';

interface CommercialSaleSidebarProps {
  currentStep: number;
  completedSteps: number[];
  onStepClick: (step: number) => void;
  onPreview?: () => void;
  draftId?: string | null;
  isSavingDraft?: boolean;
}

export const CommercialSaleSidebar = ({ currentStep, completedSteps, onStepClick, onPreview, draftId, isSavingDraft }: CommercialSaleSidebarProps) => {
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
      label: 'Sale Details', 
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
    { 
      id: 8, 
      icon: Eye, 
      label: 'Preview', 
      completed: completedSteps.includes(8),
      active: currentStep === 8
    },
  ];

  return (
    <div className="w-80 bg-white border-r border-gray-200 h-full p-3 flex-shrink-0">
      {/* Logo/Header */}
      <div className="mb-4 p-2">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center">
            <Home className="w-5 h-5 text-white" />
          </div>
          {/* Preview Button */}
          {onPreview && currentStep !== 8 && (
            <button
              onClick={onPreview}
              disabled={!draftId || isSavingDraft}
              className={`flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-md border transition-colors ${
                !draftId || isSavingDraft
                  ? 'bg-gray-100 text-gray-400 border-gray-300 cursor-not-allowed'
                  : 'bg-white text-blue-600 border-blue-600 hover:bg-blue-50'
              }`}
            >
              <Eye className="w-3 h-3" />
              {isSavingDraft ? 'Saving...' : 'Preview'}
            </button>
          )}
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
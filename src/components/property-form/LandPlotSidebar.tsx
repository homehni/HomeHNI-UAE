import React from 'react';
import { Home, MapPin, IndianRupee, Sparkles, Camera, FileText, Calendar, CheckCircle, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
  onPreview?: () => void;
  draftId?: string | null;
  isSavingDraft?: boolean;
}

export const LandPlotSidebar: React.FC<LandPlotSidebarProps> = ({
  currentStep,
  completedSteps,
  onPreview,
  draftId,
  isSavingDraft = false
}) => {
  // Calculate percentage based on specific progression: 17, 33, 50, 67, 83, 100
  const getProgressPercentage = (completedCount: number) => {
    const progressSteps = [17, 33, 50, 67, 83, 100];
    if (completedCount === 0) return 17;
    if (completedCount >= 5) return 100;
    return progressSteps[completedCount];
  };

  const progressPercentage = getProgressPercentage(completedSteps.length);
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
      {/* Header with Home Icon and Preview Button */}
      <div className="mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center">
            <Home className="w-5 h-5 text-white" />
          </div>
          {/* Preview Button */}
          {currentStep !== 7 && onPreview && (
            <Button 
              type="button" 
              variant="outline"
              onClick={onPreview}
              disabled={!draftId || isSavingDraft}
              className="h-8 px-3 text-xs border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300"
            >
              <Eye className="h-3 w-3 mr-1" />
              {isSavingDraft ? 'Saving...' : 'Preview'}
            </Button>
          )}
        </div>
      </div>

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
                strokeDasharray={`${progressPercentage}, 100`}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-lg font-semibold text-gray-700">
                {progressPercentage}%
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

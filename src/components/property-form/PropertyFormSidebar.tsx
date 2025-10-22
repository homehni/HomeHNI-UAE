import React from 'react';
import { Home, MapPin, Building, Sparkles, Camera, Calendar, CheckCircle, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
  onPreview?: () => void;
  draftId?: string | null;
  isSavingDraft?: boolean;
}

export const PropertyFormSidebar: React.FC<PropertyFormSidebarProps> = ({
  currentStep,
  completedSteps,
  steps,
  onPreview,
  draftId,
  isSavingDraft = false
}) => {
  const sidebarSteps: SidebarStep[] = steps.map((step, index) => ({
    number: index + 1,
    title: step.title,
    icon: step.icon,
    completed: completedSteps.includes(index + 1),
    active: currentStep === index + 1
  }));

  // Compute progress based on steps
  const totalSteps = steps.length || 1;
  let progress: number;
  if (totalSteps === 7) {
    // Residential Rent flow (7 steps). Preview should also show 100%.
    const progressMap = [17, 33, 50, 67, 83, 100, 100];
    const idx = Math.min(Math.max(currentStep, 1), 7) - 1;
    progress = progressMap[idx];
  } else if (totalSteps === 6) {
    // 6-step flows if any
    const progressMap = [17, 33, 50, 67, 83, 100];
    const idx = Math.min(Math.max(currentStep, 1), 6) - 1;
    progress = progressMap[idx];
  } else {
    // Fallback: proportional progress
    progress = Math.min((currentStep / totalSteps) * 100, 100);
  }

  return (
    <div className="w-80 bg-white border-r border-gray-200 h-full p-3 flex-shrink-0">
      {/* Logo/Header with Preview Button */}
      <div className="mb-4 p-2">
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

        {/* Steps */}
        <div className="space-y-2">
          {sidebarSteps.map((step) => (
            <div
              key={step.number}
              className={`flex items-center gap-2 p-2 rounded-lg transition-all duration-200 ${
                step.active 
                  ? 'bg-teal-50 border-l-4 border-teal-500' 
                  : step.completed 
                    ? 'hover:bg-gray-50' 
                    : 'text-gray-400'
              }`}
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
                    {step.icon}
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
                {step.title}
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
                  strokeDasharray={`${progress}, 100`}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-semibold text-gray-700">
                  {Math.round(progress)}%
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
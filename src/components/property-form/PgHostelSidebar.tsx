import React from 'react';
import { Home, MapPin, DollarSign, Star, Camera, Calendar, CheckCircle, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PgHostelSidebarProps {
  currentStep: number;
  completedSteps: number[];
  onPreview?: () => void;
  draftId?: string | null;
  isSavingDraft?: boolean;
}

const steps = [
  { id: 1, title: 'Room Types', description: 'Select room types available', icon: Home },
  { id: 2, title: 'Room Details', description: 'Pricing & room amenities', icon: DollarSign },
  { id: 3, title: 'Locality Details', description: 'Location information', icon: MapPin },
  { id: 4, title: 'PG Details', description: 'PG rules & preferences', icon: Star },
  { id: 5, title: 'Amenities', description: 'Services & amenities', icon: Star },
  { id: 6, title: 'Gallery', description: 'Photos & videos', icon: Camera },
  { id: 7, title: 'Schedule', description: 'Availability & timing', icon: Calendar },
  { id: 8, title: 'Congratulations', description: 'Review & publish', icon: CheckCircle },
];

export function PgHostelSidebar({ currentStep, completedSteps, onPreview, draftId, isSavingDraft = false }: PgHostelSidebarProps) {
  const calculatePropertyScore = () => {
    // Calculate score based on completed steps
    const totalSteps = steps.length;
    const completedCount = completedSteps.length;
    const score = Math.round((completedCount / totalSteps) * 100);
    // Cap the score at 100%
    return Math.min(score, 100);
  };

  const propertyScore = calculatePropertyScore();

  return (
    <div className="hidden lg:block w-80 bg-white border-r border-gray-200 p-6 h-full">
      {/* Header with red square icon and Preview Button */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
            <Home className="w-5 h-5 text-white" />
          </div>
          {/* Preview Button */}
          {currentStep !== 8 && onPreview && (
            <Button 
              type="button" 
              variant="outline"
              onClick={onPreview}
              disabled={isSavingDraft}
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
        {steps.map((step) => {
          const isCompleted = completedSteps.includes(step.id);
          const isCurrent = currentStep === step.id;
          
          return (
            <div
              key={step.id}
              className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                isCurrent 
                  ? 'bg-green-50 border-l-4 border-l-green-500' 
                  : 'bg-white'
              }`}
            >
              {/* Icon */}
              <div className={`flex-shrink-0 w-6 h-6 flex items-center justify-center ${
                isCurrent 
                  ? 'text-green-600' 
                  : isCompleted 
                  ? 'text-green-600' 
                  : 'text-gray-400'
              }`}>
                <step.icon className="w-5 h-5" />
              </div>
              
              {/* Text */}
              <div className="flex-1 min-w-0">
                <h3 className={`text-sm font-medium ${
                  isCurrent 
                    ? 'text-green-700' 
                    : isCompleted 
                    ? 'text-gray-700' 
                    : 'text-gray-500'
                }`}>
                  {step.title}
                </h3>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Property Score Widget */}
      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <div className="flex flex-col items-center">
          {/* Circular Progress */}
          <div className="relative w-16 h-16 mb-3">
            <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
              {/* Background circle */}
              <path
                className="text-gray-300"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              {/* Progress circle */}
              <path
                className="text-green-500"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                fill="none"
                strokeDasharray={`${propertyScore}, 100`}
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            {/* Percentage text */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-sm font-semibold text-gray-700">{propertyScore}%</span>
            </div>
          </div>
          
          {/* Text */}
          <h4 className="text-sm font-medium text-gray-700 mb-1">Property Score</h4>
          <p className="text-xs text-gray-500 text-center leading-relaxed">
            Better your property score,<br />
            greater your visibility
          </p>
        </div>
      </div>
    </div>
  );
}

import React from 'react';

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
  completedSteps?: number[];
}

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  currentStep,
  totalSteps,
  completedSteps = []
}) => {
  // Generate steps array based on totalSteps
  const steps = Array.from({ length: totalSteps }, (_, index) => index + 1);

  return (
    <div className="w-full mb-4">
      {/* Simple Step Numbers Progress */}
      <div className="flex items-center justify-center space-x-2">
        {steps.map((step, index) => (
          <div key={step} className="flex items-center">
            <div
              className={`
                flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium transition-all duration-300
                ${currentStep === step
                  ? 'bg-brand-red text-white shadow-md'
                  : completedSteps.includes(step)
                  ? 'bg-brand-maroon text-white'
                  : 'bg-gray-200 text-gray-500'
                }
              `}
            >
              {step}
            </div>
            {index < steps.length - 1 && (
              <div className="flex-1 h-px bg-gray-300 min-w-[20px] max-w-[40px]" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
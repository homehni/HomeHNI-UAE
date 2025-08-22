import React from 'react';
import { Check } from 'lucide-react';

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
  const steps = [
    { id: 1, label: 'Owner Info' },
    { id: 2, label: 'Property Info' },
    { id: 3, label: 'Preview & Submit' }
  ];

  return (
    <div className="w-full mb-8">
      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between text-xs text-gray-500 mb-2">
          <span>Step {currentStep} of {totalSteps}</span>
          <span>{Math.round((currentStep / totalSteps) * 100)}% Complete</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-brand-red to-brand-maroon h-2 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      {/* Step Indicators */}
      <div className="flex items-center justify-between relative">
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            <div className="flex flex-col items-center relative z-10">
              <div
                className={`
                  flex items-center justify-center w-12 h-12 rounded-full border-2 mb-3 transition-all duration-300
                  ${currentStep === step.id
                    ? 'bg-brand-red border-brand-red text-white shadow-lg scale-110'
                    : completedSteps.includes(step.id)
                    ? 'bg-brand-maroon border-brand-maroon text-white'
                    : 'border-gray-300 bg-white text-gray-400'
                  }
                `}
              >
                {completedSteps.includes(step.id) ? (
                  <Check className="w-6 h-6" />
                ) : (
                  <span className="text-sm font-semibold">{step.id}</span>
                )}
              </div>
              <span className={`
                text-sm font-medium text-center transition-colors duration-300
                ${currentStep === step.id 
                  ? 'text-brand-red' 
                  : completedSteps.includes(step.id)
                  ? 'text-brand-maroon'
                  : 'text-gray-500'
                }
              `}>
                {step.label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div className="flex-1 h-0.5 mx-4 relative">
                <div className="absolute inset-0 bg-gray-200 rounded-full" />
                <div
                  className={`
                    absolute inset-0 rounded-full transition-all duration-500 ease-out
                    ${completedSteps.includes(step.id) 
                      ? 'bg-gradient-to-r from-brand-red to-brand-maroon' 
                      : 'bg-gray-200'
                    }
                  `}
                  style={{
                    width: completedSteps.includes(step.id) ? '100%' : '0%'
                  }}
                />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
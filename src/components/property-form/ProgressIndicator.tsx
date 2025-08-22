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
    <div className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border/40 mb-8">
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Enhanced Progress Bar */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-4">
            <h2 className="text-xl sm:text-2xl font-bold text-foreground">
              Property Listing Progress
            </h2>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm text-muted-foreground">
              <span className="font-medium">Step {currentStep} of {totalSteps}</span>
              <span className="hidden sm:inline">•</span>
              <span className="font-semibold text-brand-red">
                {Math.round((currentStep / totalSteps) * 100)}% Complete
              </span>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="relative w-full bg-muted rounded-full h-3 mb-2 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-brand-red to-brand-maroon h-full rounded-full transition-all duration-500 ease-out shadow-sm"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-full opacity-30" />
          </div>
        </div>

        {/* Responsive Step Indicators */}
        <div className="hidden md:flex items-center justify-between relative">
          {steps.map((step, index) => (
            <React.Fragment key={step.id}>
              <div className="flex flex-col items-center relative z-10">
                <div
                  className={`
                    flex items-center justify-center w-14 h-14 rounded-full border-2 mb-3 transition-all duration-300 shadow-lg
                    ${currentStep === step.id
                      ? 'bg-brand-red border-brand-red text-white shadow-brand-red/30 scale-110'
                      : completedSteps.includes(step.id)
                      ? 'bg-brand-maroon border-brand-maroon text-white shadow-brand-maroon/30'
                      : 'border-muted-foreground/30 bg-background text-muted-foreground hover:border-brand-red/50'
                    }
                  `}
                >
                  {completedSteps.includes(step.id) ? (
                    <Check className="w-7 h-7" />
                  ) : (
                    <span className="text-lg font-bold">{step.id}</span>
                  )}
                </div>
                <span className={`
                  text-sm font-semibold text-center transition-colors duration-300 px-2
                  ${currentStep === step.id 
                    ? 'text-brand-red' 
                    : completedSteps.includes(step.id)
                    ? 'text-brand-maroon'
                    : 'text-muted-foreground'
                  }
                `}>
                  {step.label}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div className="flex-1 h-1 mx-6 relative">
                  <div className="absolute inset-0 bg-muted rounded-full" />
                  <div
                    className={`
                      absolute inset-0 rounded-full transition-all duration-700 ease-out
                      ${completedSteps.includes(step.id) 
                        ? 'bg-gradient-to-r from-brand-red to-brand-maroon shadow-sm' 
                        : 'bg-muted'
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

        {/* Mobile Step Indicators */}
        <div className="md:hidden flex items-center justify-center gap-3">
          {steps.map((step) => (
            <div
              key={step.id}
              className={`
                flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300
                ${currentStep === step.id
                  ? 'bg-brand-red border-brand-red text-white shadow-lg scale-110'
                  : completedSteps.includes(step.id)
                  ? 'bg-brand-maroon border-brand-maroon text-white'
                  : 'border-muted-foreground/30 bg-background text-muted-foreground'
                }
              `}
            >
              {completedSteps.includes(step.id) ? (
                <Check className="w-5 h-5" />
              ) : (
                <span className="text-sm font-bold">{step.id}</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
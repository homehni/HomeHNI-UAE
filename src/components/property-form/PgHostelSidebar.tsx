import React from 'react';
import { Check } from 'lucide-react';

interface PgHostelSidebarProps {
  currentStep: number;
  completedSteps: number[];
}

const steps = [
  { id: 1, title: 'Owner Info', description: 'Basic owner details' },
  { id: 2, title: 'Room Types', description: 'Available room types' },
  { id: 3, title: 'Room Details', description: 'Room info & amenities' },
  { id: 4, title: 'Locality Details', description: 'Location information' },
  { id: 5, title: 'PG Details', description: 'PG specific details' },
  { id: 6, title: 'Amenities', description: 'Services & amenities' },
  { id: 7, title: 'Gallery', description: 'Photos & videos' },
  { id: 8, title: 'Schedule', description: 'Availability & schedule' },
];

export function PgHostelSidebar({ currentStep, completedSteps }: PgHostelSidebarProps) {
  return (
    <div className="w-80 bg-card border-r border-border p-6">
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-foreground mb-2">List Your PG/Hostel</h2>
        <p className="text-sm text-muted-foreground">Complete all steps to list your property</p>
      </div>
      
      <div className="space-y-4">
        {steps.map((step, index) => {
          const isCompleted = completedSteps.includes(step.id);
          const isCurrent = currentStep === step.id;
          const isAccessible = step.id <= currentStep || isCompleted;
          
          return (
            <div
              key={step.id}
              className={`flex items-start space-x-3 p-3 rounded-lg transition-colors ${
                isCurrent 
                  ? 'bg-primary/10 border border-primary/20' 
                  : isCompleted 
                  ? 'bg-green-50 border border-green-200' 
                  : 'bg-muted/50'
              }`}
            >
              <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                isCompleted 
                  ? 'bg-green-500 text-white'
                  : isCurrent 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-muted-foreground/20 text-muted-foreground'
              }`}>
                {isCompleted ? <Check className="w-4 h-4" /> : step.id}
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className={`text-sm font-medium ${
                  isCurrent 
                    ? 'text-primary' 
                    : isCompleted 
                    ? 'text-green-700' 
                    : 'text-foreground'
                }`}>
                  {step.title}
                </h3>
                <p className={`text-xs ${
                  isCurrent 
                    ? 'text-primary/70' 
                    : isCompleted 
                    ? 'text-green-600' 
                    : 'text-muted-foreground'
                }`}>
                  {step.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h4 className="text-sm font-medium text-blue-900 mb-1">Need Help?</h4>
        <p className="text-xs text-blue-700">Contact our support team for assistance with listing your PG/Hostel</p>
      </div>
    </div>
  );
}
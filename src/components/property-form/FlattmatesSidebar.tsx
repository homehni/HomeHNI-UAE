import React from 'react';
import { Home, MapPin, IndianRupee, Wifi, Camera, Calendar, CheckCircle } from 'lucide-react';

interface FlattmatesSidebarProps {
  currentStep: number;
  completedSteps: number[];
}

const steps = [
  { id: 1, title: "Property Details", icon: Home },
  { id: 2, title: "Locality Details", icon: MapPin },
  { id: 3, title: "Rental Details", icon: IndianRupee },
  { id: 4, title: "Amenities", icon: Wifi },
  { id: 5, title: "Gallery", icon: Camera },
  { id: 6, title: "Schedule", icon: Calendar }
];

export function FlattmatesSidebar({ currentStep, completedSteps }: FlattmatesSidebarProps) {
  return (
    <div className="w-80 bg-card border-r p-6 space-y-4">
      <div className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-2">Flatmates Listing</h2>
        <p className="text-sm text-muted-foreground">Complete all steps to list your property</p>
      </div>

      <div className="space-y-3">
        {steps.map((step) => {
          const isCompleted = completedSteps.includes(step.id);
          const isCurrent = currentStep === step.id;
          const IconComponent = step.icon;

          return (
            <div
              key={step.id}
              className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                isCurrent
                  ? 'bg-primary/10 border border-primary/20'
                  : isCompleted
                  ? 'bg-green-50 border border-green-200'
                  : 'bg-muted/30 border border-border'
              }`}
            >
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                isCompleted
                  ? 'bg-green-100 text-green-600'
                  : isCurrent
                  ? 'bg-primary/20 text-primary'
                  : 'bg-muted text-muted-foreground'
              }`}>
                {isCompleted ? (
                  <CheckCircle className="w-4 h-4" />
                ) : (
                  <IconComponent className="w-4 h-4" />
                )}
              </div>
              <span className={`text-sm font-medium ${
                isCurrent ? 'text-primary' : isCompleted ? 'text-green-700' : 'text-muted-foreground'
              }`}>
                {step.title}
              </span>
            </div>
          );
        })}
      </div>

      <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h3 className="text-sm font-medium text-blue-900 mb-2">Need Help?</h3>
        <p className="text-xs text-blue-700 mb-3">
          Our team is here to assist you with listing your property.
        </p>
        <button className="w-full px-3 py-2 bg-blue-600 text-white text-xs rounded-md hover:bg-blue-700 transition-colors">
          Contact Support
        </button>
      </div>
    </div>
  );
}
import React from 'react';
import { Button } from '@/components/ui/button';

interface StickyFormNavigationProps {
  onBack?: () => void;
  onNext: () => void;
  nextButtonText?: string;
  showBackButton?: boolean;
  isLoading?: boolean;
  className?: string;
}

export const StickyFormNavigation: React.FC<StickyFormNavigationProps> = ({
  onBack,
  onNext,
  nextButtonText = "Save & Continue",
  showBackButton = true,
  isLoading = false,
  className = ""
}) => {
  return (
    <div className={`fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 p-4 ${className}`}>
      <div className="flex justify-between max-w-4xl mx-auto">
        {showBackButton && onBack ? (
          <Button 
            type="button" 
            variant="outline" 
            onClick={onBack} 
            className="h-10 px-6"
            disabled={isLoading}
          >
            Back
          </Button>
        ) : (
          <div></div>
        )}
        <Button 
          type="button" 
          onClick={onNext} 
          className="h-10 px-6 bg-[#d21404] hover:bg-[#b80f03] text-white"
          disabled={isLoading}
        >
          {isLoading ? "Saving..." : nextButtonText}
        </Button>
      </div>
    </div>
  );
};
import React from 'react';
import { ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MobileStickyCTAProps {
  onContactOwner: () => void;
}

export const MobileStickyCTA: React.FC<MobileStickyCTAProps> = ({ onContactOwner }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 sm:hidden border-t border-gray-200 bg-white/95 backdrop-blur-sm p-4">
      <Button
        onClick={onContactOwner}
        className="w-full bg-[#d21404] text-white hover:bg-[#b80f03] rounded-lg px-4 py-3 font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#d21404] flex items-center justify-center"
      >
        Contact Owner
        <ChevronRight className="w-4 h-4 ml-2" />
      </Button>
    </div>
  );
};

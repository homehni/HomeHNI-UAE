import React from 'react';
import { Button } from '@/components/ui/button';
import { ShieldCheck } from 'lucide-react';

interface PropertyActionsProps {
  onContact: () => void;
  onScheduleVisit: () => void;
}

export const PropertyActions: React.FC<PropertyActionsProps> = ({ 
  onContact, 
  onScheduleVisit 
}) => {
  return (
    <div className="space-y-3">
      <div className="flex gap-3">
        <Button 
          onClick={onContact}
          className="flex-1 bg-red-600 hover:bg-red-700 text-white rounded-lg py-3 font-medium"
        >
          Contact
        </Button>
        <Button 
          onClick={onScheduleVisit}
          className="flex-1 bg-red-600 hover:bg-red-700 text-white rounded-lg py-3 font-medium relative"
        >
          Schedule Visit
          <div className="absolute -top-1 -right-1 bg-black text-white text-xs px-1.5 py-0.5 rounded-full flex items-center gap-1">
            <ShieldCheck className="w-3 h-3" />
            <span className="text-[10px]">Verified Availability</span>
          </div>
        </Button>
      </div>
    </div>
  );
};
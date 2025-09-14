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
          className="flex-1 bg-red-500 hover:bg-red-600 text-white rounded-lg py-3 font-medium"
        >
          Contact
        </Button>
        <div className="flex-1 relative">
          <Button 
            onClick={onScheduleVisit}
            className="w-full bg-red-500 hover:bg-red-600 text-white rounded-lg py-3 font-medium"
          >
            Schedule Visit
          </Button>
          <div className="absolute -top-2 -right-2 bg-black text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
            <ShieldCheck className="w-3 h-3" />
            <span>Verified Availability</span>
          </div>
        </div>
      </div>
    </div>
  );
};
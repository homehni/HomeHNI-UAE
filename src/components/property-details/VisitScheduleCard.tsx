import React from 'react';
import { Clock, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface VisitScheduleCardProps {
  onJoinVisit?: () => void;
}

export const VisitScheduleCard: React.FC<VisitScheduleCardProps> = ({ onJoinVisit }) => {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-blue-100 p-2 rounded-lg">
            <Clock className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <div className="text-sm text-blue-700">
              The owner will be showing this property at
            </div>
            <div className="text-sm font-semibold text-blue-700">
              03:30 PM Today!
            </div>
          </div>
        </div>
        <Button
          onClick={onJoinVisit}
          variant="outline"
          size="sm"
          className="text-blue-600 border-blue-300 hover:bg-blue-100 flex items-center gap-1"
        >
          Join Visit
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};
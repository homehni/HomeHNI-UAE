import React from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { calculateGSTAmount, formatCurrency } from '@/utils/gstCalculator';

interface GSTDisplayProps {
  basePriceInPaise: number;
  className?: string;
}

const GSTDisplay: React.FC<GSTDisplayProps> = ({ basePriceInPaise, className = "" }) => {
  const gstAmount = calculateGSTAmount(basePriceInPaise);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={`text-sm text-gray-500 cursor-help hover:text-gray-700 transition-colors ${className}`}>
            +18% GST
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p className="font-medium">GST Amount: {formatCurrency(gstAmount)}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default GSTDisplay;
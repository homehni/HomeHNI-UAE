import React, { useState } from 'react';
import { calculateGSTAmount, calculateTotalWithGST, formatCurrencyDetailed } from '@/utils/gstCalculator';

interface GSTDisplayProps {
  basePriceInPaise: number;
  className?: string;
}

const GSTDisplay: React.FC<GSTDisplayProps> = ({ basePriceInPaise, className = "" }) => {
  const [isHovered, setIsHovered] = useState(false);
  const gstAmount = calculateGSTAmount(basePriceInPaise);
  const totalAmount = calculateTotalWithGST(basePriceInPaise);

  return (
    <div className="relative inline-block">
      <div 
        className={`text-sm text-muted-foreground cursor-help hover:text-foreground transition-colors ${className}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        +18% GST
      </div>
      
      {isHovered && (
        <div className="absolute top-full left-0 mt-2 bg-background border border-border rounded-lg p-4 shadow-lg z-50 min-w-[240px]">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Plan Price</span>
              <span className="font-medium">{formatCurrencyDetailed(basePriceInPaise)}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">GST @ 18%</span>
              <span className="font-medium">{formatCurrencyDetailed(gstAmount)}</span>
            </div>
            
            <hr className="border-border" />
            
            <div className="flex justify-between items-center">
              <span className="font-semibold">Amount Payable</span>
              <span className="font-bold text-primary">{formatCurrencyDetailed(totalAmount)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GSTDisplay;
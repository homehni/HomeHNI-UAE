import React, { useState } from 'react';
import { calculateGSTAmount, calculateTotalWithGST, formatCurrencyDetailed, getTaxRate } from '@/utils/gstCalculator';
import { getCurrentCountryConfig } from '@/services/domainCountryService';

interface GSTDisplayProps {
  basePriceInPaise: number;
  className?: string;
}

const GSTDisplay: React.FC<GSTDisplayProps> = ({ basePriceInPaise, className = "" }) => {
  const [isHovered, setIsHovered] = useState(false);
  const countryConfig = getCurrentCountryConfig();
  const taxRate = getTaxRate();
  const taxLabel = countryConfig.currency === 'AED' ? 'VAT' : 'GST';
  const taxPercentage = Math.round(taxRate * 100);
  const taxAmount = calculateGSTAmount(basePriceInPaise);
  const totalAmount = calculateTotalWithGST(basePriceInPaise);

  return (
    <div className="relative inline-block">
      <div 
        className={`text-sm text-muted-foreground cursor-help hover:text-foreground transition-colors ${className}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        +{taxPercentage}% {taxLabel}
      </div>
      
      {isHovered && (
        <div className="absolute top-full left-0 mt-2 bg-background border border-border rounded-lg p-4 shadow-lg z-50 min-w-[240px]">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Plan Price</span>
              <span className="font-medium">{formatCurrencyDetailed(basePriceInPaise)}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">{taxLabel} @ {taxPercentage}%</span>
              <span className="font-medium">{formatCurrencyDetailed(taxAmount)}</span>
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

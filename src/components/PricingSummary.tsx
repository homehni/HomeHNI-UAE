import React from 'react';
import { calculateGSTAmount, calculateTotalWithGST, formatCurrency } from '@/utils/gstCalculator';
import { getCurrentCountryConfig } from '@/services/domainCountryService';

interface PricingSummaryProps {
  basePriceInPaise: number;
  planName: string;
  className?: string;
}

const PricingSummary: React.FC<PricingSummaryProps> = ({ 
  basePriceInPaise, 
  planName,
  className = "" 
}) => {
  const countryConfig = getCurrentCountryConfig();
  const gstAmount = calculateGSTAmount(basePriceInPaise);
  const totalAmount = calculateTotalWithGST(basePriceInPaise);

  return (
    <div className={`bg-muted/30 rounded-lg p-4 border ${className}`}>
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Plan Price</span>
          <span className="font-medium">{formatCurrency(basePriceInPaise, countryConfig.currency)}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">GST @ 18%</span>
          <span className="font-medium">{formatCurrency(gstAmount, countryConfig.currency)}</span>
        </div>
        
        <hr className="border-border" />
        
        <div className="flex justify-between items-center">
          <span className="font-semibold">Amount Payable</span>
          <span className="font-bold text-brand-red">{formatCurrency(totalAmount, countryConfig.currency)}</span>
        </div>
      </div>
    </div>
  );
};

export default PricingSummary;

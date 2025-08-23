import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface EMICalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  propertyPrice?: number;
}

const EMICalculatorModal: React.FC<EMICalculatorModalProps> = ({
  isOpen,
  onClose,
  propertyPrice = 5000000
}) => {
  const [loanAmount, setLoanAmount] = useState(Math.min(propertyPrice * 0.8, 5200000));
  const [interestRate, setInterestRate] = useState(7.7);
  const [loanTenure, setLoanTenure] = useState(20);
  const [emi, setEmi] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);

  // EMI Calculation
  useEffect(() => {
    const monthlyRate = interestRate / (12 * 100);
    const months = loanTenure * 12;
    
    if (monthlyRate > 0 && months > 0 && loanAmount > 0) {
      const emiValue = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, months)) / 
                      (Math.pow(1 + monthlyRate, months) - 1);
      
      const totalAmountValue = emiValue * months;
      const totalInterestValue = totalAmountValue - loanAmount;
      
      setEmi(emiValue);
      setTotalAmount(totalAmountValue);
      setTotalInterest(totalInterestValue);
    }
  }, [loanAmount, interestRate, loanTenure]);

  const banks = [
    { name: 'HDFC', rate: '7.5% Floating', logo: '🏦' },
    { name: 'Indian Bank', rate: '7.5% Floating', logo: '🏛️' },
    { name: 'ICICI', rate: '7.5% Floating', logo: '🏪' },
    { name: 'PNB', rate: '7.5% Floating', logo: '🏢' },
    { name: 'SBI', rate: '7.5% Floating', logo: '🏦' }
  ];

  const progressPercentage = (loanAmount / totalAmount) * 100;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Calculate EMI</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* EMI Display */}
          <div className="text-center bg-muted/30 rounded-lg p-6">
            <div className="text-3xl font-bold text-primary mb-2">
              ₹{emi.toLocaleString('en-IN', { maximumFractionDigits: 0 })} / Month
            </div>
            <div className="text-muted-foreground">
              {loanTenure} years Fixed {interestRate}% Interest
            </div>
            
            {/* Progress Bar */}
            <div className="mt-4 relative">
              <div className="w-full bg-secondary rounded-full h-3">
                <div 
                  className="bg-primary h-3 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
              <div className="flex justify-between mt-2 text-sm">
                <span className="text-primary font-medium">
                  ₹{loanAmount.toLocaleString('en-IN')}
                </span>
                <span className="text-muted-foreground">
                  ₹{totalInterest.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                </span>
              </div>
            </div>
          </div>

          {/* Input Fields and Sliders */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Loan Amount */}
            <div className="space-y-4">
              <Label className="text-sm font-medium">Enter loan amount</Label>
              <Input
                type="number"
                value={loanAmount}
                onChange={(e) => setLoanAmount(Number(e.target.value))}
                className="text-center"
              />
              <Slider
                value={[loanAmount]}
                onValueChange={(value) => setLoanAmount(value[0])}
                max={10000000}
                min={100000}
                step={100000}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>₹1L</span>
                <span>₹1Cr</span>
              </div>
            </div>

            {/* Interest Rate */}
            <div className="space-y-4">
              <Label className="text-sm font-medium">Interest Rate</Label>
              <Input
                type="number"
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                step="0.1"
                className="text-center"
              />
              <Slider
                value={[interestRate]}
                onValueChange={(value) => setInterestRate(value[0])}
                max={20}
                min={5}
                step={0.1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>5%</span>
                <span>20%</span>
              </div>
            </div>

            {/* Loan Tenure */}
            <div className="space-y-4">
              <Label className="text-sm font-medium">Loan Tenure (Years)</Label>
              <Input
                type="number"
                value={loanTenure}
                onChange={(e) => setLoanTenure(Number(e.target.value))}
                className="text-center"
              />
              <Slider
                value={[loanTenure]}
                onValueChange={(value) => setLoanTenure(value[0])}
                max={30}
                min={1}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>1 Year</span>
                <span>30 Years</span>
              </div>
            </div>
          </div>

          {/* Check Eligibility Button */}
          <div className="text-center">
            <Button size="lg" className="px-8">
              Check Eligibility
            </Button>
          </div>

          {/* Banks */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {banks.map((bank, index) => (
              <Card key={index} className="p-4 text-center hover:shadow-md transition-shadow cursor-pointer">
                <div className="text-2xl mb-2">{bank.logo}</div>
                <div className="font-medium text-sm">{bank.name}</div>
                <div className="text-xs text-muted-foreground">{bank.rate}</div>
              </Card>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EMICalculatorModal;
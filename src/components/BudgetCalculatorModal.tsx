import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Calculator, TrendingUp, AlertCircle, Home } from 'lucide-react';

interface BudgetCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const BudgetCalculatorModal: React.FC<BudgetCalculatorModalProps> = ({
  isOpen,
  onClose
}) => {
  const [monthlyIncome, setMonthlyIncome] = useState(50000);
  const [monthlyExpenses, setMonthlyExpenses] = useState(25000);
  const [existingEMI, setExistingEMI] = useState(0);
  const [downPayment, setDownPayment] = useState(1000000);
  const [loanTenure, setLoanTenure] = useState(20);
  const [interestRate, setInterestRate] = useState(8.5);

  const [affordableBudget, setAffordableBudget] = useState(0);
  const [maxEMI, setMaxEMI] = useState(0);
  const [maxLoanAmount, setMaxLoanAmount] = useState(0);
  const [totalBudget, setTotalBudget] = useState(0);

  useEffect(() => {
    const disposableIncome = monthlyIncome - monthlyExpenses - existingEMI;
    const maxAffordableEMI = Math.max(0, disposableIncome * 0.5); // 50% of disposable income
    
    // Calculate maximum loan amount using EMI formula
    const monthlyRate = interestRate / (12 * 100);
    const months = loanTenure * 12;
    
    let maxLoan = 0;
    if (monthlyRate > 0 && maxAffordableEMI > 0) {
      maxLoan = (maxAffordableEMI * (Math.pow(1 + monthlyRate, months) - 1)) / 
                (monthlyRate * Math.pow(1 + monthlyRate, months));
    }
    
    const totalPropertyBudget = maxLoan + downPayment;
    
    setMaxEMI(maxAffordableEMI);
    setMaxLoanAmount(maxLoan);
    setTotalBudget(totalPropertyBudget);
    setAffordableBudget(totalPropertyBudget);
  }, [monthlyIncome, monthlyExpenses, existingEMI, downPayment, loanTenure, interestRate]);

  const budgetTips = [
    "Keep EMI below 50% of disposable income",
    "Maintain 6-month expense emergency fund",
    "Consider additional costs like registration",
    "Factor in maintenance charges"
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <Calculator className="w-6 h-6 text-primary" />
            Budget Calculator
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Input Section */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardContent className="p-6 space-y-6">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold">Income & Expenses</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <Label>Monthly Income</Label>
                    <Input
                      type="number"
                      value={monthlyIncome}
                      onChange={(e) => setMonthlyIncome(Number(e.target.value))}
                      className="text-center"
                    />
                    <Slider
                      value={[monthlyIncome]}
                      onValueChange={(value) => setMonthlyIncome(value[0])}
                      max={500000}
                      min={10000}
                      step={5000}
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>₹10K</span>
                      <span>₹5L</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Label>Monthly Expenses</Label>
                    <Input
                      type="number"
                      value={monthlyExpenses}
                      onChange={(e) => setMonthlyExpenses(Number(e.target.value))}
                      className="text-center"
                    />
                    <Slider
                      value={[monthlyExpenses]}
                      onValueChange={(value) => setMonthlyExpenses(value[0])}
                      max={200000}
                      min={5000}
                      step={2500}
                    />
                  </div>

                  <div className="space-y-4">
                    <Label>Existing EMI</Label>
                    <Input
                      type="number"
                      value={existingEMI}
                      onChange={(e) => setExistingEMI(Number(e.target.value))}
                      className="text-center"
                    />
                    <Slider
                      value={[existingEMI]}
                      onValueChange={(value) => setExistingEMI(value[0])}
                      max={100000}
                      min={0}
                      step={1000}
                    />
                  </div>

                  <div className="space-y-4">
                    <Label>Down Payment</Label>
                    <Input
                      type="number"
                      value={downPayment}
                      onChange={(e) => setDownPayment(Number(e.target.value))}
                      className="text-center"
                    />
                    <Slider
                      value={[downPayment]}
                      onValueChange={(value) => setDownPayment(value[0])}
                      max={5000000}
                      min={100000}
                      step={100000}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 space-y-6">
                <div className="flex items-center gap-2 mb-4">
                  <Home className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold">Loan Details</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <Label>Loan Tenure (Years)</Label>
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
                      min={5}
                      step={1}
                    />
                  </div>

                  <div className="space-y-4">
                    <Label>Interest Rate (%)</Label>
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
                      max={15}
                      min={6}
                      step={0.1}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            <Card className="bg-primary/5">
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-primary mb-2">
                  ₹{totalBudget.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                </div>
                <p className="text-sm text-muted-foreground mb-4">Total Property Budget</p>

                <div className="space-y-3 pt-4 border-t text-left">
                  <div className="flex justify-between text-sm">
                    <span>Max Loan</span>
                    <span className="font-medium">₹{maxLoanAmount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Down Payment</span>
                    <span className="font-medium">₹{downPayment.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Max EMI</span>
                    <span className="font-medium">₹{maxEMI.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <AlertCircle className="w-4 h-4 text-primary" />
                  <h4 className="font-medium text-sm">Budget Tips</h4>
                </div>
                <div className="space-y-2">
                  {budgetTips.map((tip, index) => (
                    <p key={index} className="text-xs text-muted-foreground">• {tip}</p>
                  ))}
                </div>
              </CardContent>
            </Card>

          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BudgetCalculatorModal;
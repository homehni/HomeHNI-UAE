import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Calculator, Home, TrendingUp, AlertCircle } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const BudgetCalculator = () => {
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

  useEffect(() => {
    document.title = "Budget Calculator - Property Budget Planning Tool";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Calculate your property budget with our advanced budget calculator. Plan your home purchase based on income, expenses, and loan eligibility.');
    }
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 pt-24 pb-16">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-primary w-12 h-12 rounded-full flex items-center justify-center mr-4">
              <Calculator className="w-6 h-6 text-primary-foreground" />
            </div>
            <h1 className="text-4xl font-bold text-foreground">Budget Calculator</h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Calculate your affordable property budget based on your income, expenses, and loan eligibility
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Input Section */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Income & Expenses
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
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
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>₹5K</span>
                      <span>₹2L</span>
                    </div>
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
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>₹0</span>
                      <span>₹1L</span>
                    </div>
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
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>₹1L</span>
                      <span>₹50L</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Home className="w-5 h-5" />
                  Loan Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
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
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>5 Years</span>
                      <span>30 Years</span>
                    </div>
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
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>6%</span>
                      <span>15%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            <Card className="bg-primary/5">
              <CardHeader>
                <CardTitle className="text-center text-primary">Your Budget</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">
                    ₹{totalBudget.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                  </div>
                  <p className="text-sm text-muted-foreground">Total Property Budget</p>
                </div>

                <div className="space-y-3 pt-4 border-t">
                  <div className="flex justify-between">
                    <span className="text-sm">Max Loan Amount</span>
                    <span className="font-medium">₹{maxLoanAmount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Down Payment</span>
                    <span className="font-medium">₹{downPayment.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Max EMI</span>
                    <span className="font-medium">₹{maxEMI.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  Budget Tips
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <p>• Keep EMI below 50% of disposable income</p>
                <p>• Maintain 6-month expense emergency fund</p>
                <p>• Consider additional costs like registration, taxes</p>
                <p>• Factor in maintenance and society charges</p>
                <p>• Compare interest rates across banks</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BudgetCalculator;
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TrendingUp, User, Briefcase, Calculator } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const LoanEligibility = () => {
  const [monthlyIncome, setMonthlyIncome] = useState(75000);
  const [otherEMI, setOtherEMI] = useState(0);
  const [interestRate, setInterestRate] = useState(8.5);
  const [loanTenure, setLoanTenure] = useState(20);
  const [employmentType, setEmploymentType] = useState('salaried');
  const [age, setAge] = useState(30);
  const [creditScore, setCreditScore] = useState(750);

  const [eligibleLoanAmount, setEligibleLoanAmount] = useState(0);
  const [maxEMI, setMaxEMI] = useState(0);
  const [eligibilityPercentage, setEligibilityPercentage] = useState(0);

  const calculateEligibility = () => {
    // Calculate disposable income (subtract other EMIs)
    const disposableIncome = monthlyIncome - otherEMI;
    
    // Calculate maximum EMI based on employment type and other factors
    let emiRatio = employmentType === 'salaried' ? 0.6 : 0.45; // 60% for salaried, 45% for self-employed
    
    // Adjust for age (younger people get higher ratios)
    if (age < 30) emiRatio += 0.05;
    else if (age > 50) emiRatio -= 0.1;
    
    // Adjust for credit score
    if (creditScore >= 800) emiRatio += 0.05;
    else if (creditScore < 650) emiRatio -= 0.15;
    
    const maxAffordableEMI = Math.max(0, disposableIncome * emiRatio);
    
    // Calculate loan amount using EMI formula: P = EMI × [(1+r)^n - 1] / [r × (1+r)^n]
    const monthlyRate = interestRate / (12 * 100);
    const months = loanTenure * 12;
    
    let loanAmount = 0;
    if (monthlyRate > 0 && maxAffordableEMI > 0) {
      loanAmount = (maxAffordableEMI * (Math.pow(1 + monthlyRate, months) - 1)) / 
                   (monthlyRate * Math.pow(1 + monthlyRate, months));
    }
    
    // Calculate eligibility percentage based on various factors
    let eligibilityScore = 100;
    if (creditScore < 750) eligibilityScore -= 20;
    if (otherEMI > monthlyIncome * 0.3) eligibilityScore -= 15;
    if (age > 55) eligibilityScore -= 10;
    if (employmentType === 'self-employed') eligibilityScore -= 5;
    
    setMaxEMI(maxAffordableEMI);
    setEligibleLoanAmount(loanAmount);
    setEligibilityPercentage(Math.max(0, eligibilityScore));
  };

  useEffect(() => {
    calculateEligibility();
  }, [monthlyIncome, otherEMI, interestRate, loanTenure, employmentType, age, creditScore]);

  useEffect(() => {
    document.title = "Loan Eligibility Calculator - Check Your Home Loan Eligibility";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Check your home loan eligibility instantly. Calculate maximum loan amount based on income, employment type, age, and credit score.');
    }
  }, []);

  const eligibilityFactors = [
    { factor: 'Monthly Income', impact: monthlyIncome >= 50000 ? 'Positive' : 'Moderate', description: 'Higher income increases eligibility' },
    { factor: 'Credit Score', impact: creditScore >= 750 ? 'Excellent' : creditScore >= 650 ? 'Good' : 'Poor', description: 'Better score means better terms' },
    { factor: 'Existing EMIs', impact: otherEMI <= monthlyIncome * 0.3 ? 'Good' : 'High', description: 'Lower existing EMIs preferred' },
    { factor: 'Employment Type', impact: employmentType === 'salaried' ? 'Stable' : 'Variable', description: 'Salaried employees get higher ratios' },
    { factor: 'Age', impact: age <= 45 ? 'Optimal' : 'Moderate', description: 'Younger applicants get better terms' }
  ];

  const banks = [
    { name: 'SBI', rate: '8.50%', maxTenure: '30 years', processingFee: '0.35%' },
    { name: 'HDFC', rate: '8.60%', maxTenure: '30 years', processingFee: '0.50%' },
    { name: 'ICICI', rate: '8.75%', maxTenure: '30 years', processingFee: '0.50%' },
    { name: 'Axis Bank', rate: '8.80%', maxTenure: '30 years', processingFee: '1.00%' },
    { name: 'BOB', rate: '8.40%', maxTenure: '30 years', processingFee: '0.25%' }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 pt-24 pb-16">
        {/* Hero Section */}
        <div className="text-center mb-12 pt-8">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-primary w-12 h-12 rounded-full flex items-center justify-center mr-4">
              <TrendingUp className="w-6 h-6 text-primary-foreground" />
            </div>
            <h1 className="text-4xl font-bold text-foreground">Loan Eligibility Calculator</h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-4xl mx-auto">
            Check your home loan eligibility and discover the maximum loan amount you can get
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Input Section */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Personal Information
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
                      min={15000}
                      step={5000}
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>₹15K</span>
                      <span>₹5L</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Label>Age</Label>
                    <Input
                      type="number"
                      value={age}
                      onChange={(e) => setAge(Number(e.target.value))}
                      className="text-center"
                    />
                    <Slider
                      value={[age]}
                      onValueChange={(value) => setAge(value[0])}
                      max={65}
                      min={21}
                      step={1}
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>21 years</span>
                      <span>65 years</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Label>Employment Type</Label>
                    <Select value={employmentType} onValueChange={setEmploymentType}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="salaried">Salaried Employee</SelectItem>
                        <SelectItem value="self-employed">Self Employed</SelectItem>
                        <SelectItem value="business">Business Owner</SelectItem>
                        <SelectItem value="professional">Professional</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-4">
                    <Label>Credit Score</Label>
                    <Input
                      type="number"
                      value={creditScore}
                      onChange={(e) => setCreditScore(Number(e.target.value))}
                      className="text-center"
                    />
                    <Slider
                      value={[creditScore]}
                      onValueChange={(value) => setCreditScore(value[0])}
                      max={900}
                      min={300}
                      step={10}
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>300</span>
                      <span>900</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="w-5 h-5" />
                  Loan Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-4">
                    <Label>Existing EMI</Label>
                    <Input
                      type="number"
                      value={otherEMI}
                      onChange={(e) => setOtherEMI(Number(e.target.value))}
                      className="text-center"
                    />
                    <Slider
                      value={[otherEMI]}
                      onValueChange={(value) => setOtherEMI(value[0])}
                      max={100000}
                      min={0}
                      step={1000}
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
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            <Card className="bg-primary/5">
              <CardHeader>
                <CardTitle className="text-center text-primary">Eligibility Results</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">
                    ₹{eligibleLoanAmount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                  </div>
                  <p className="text-sm text-muted-foreground">Maximum Loan Amount</p>
                </div>

                <div className="space-y-3 pt-4 border-t">
                  <div className="flex justify-between">
                    <span className="text-sm">Max EMI</span>
                    <span className="font-medium">₹{maxEMI.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Eligibility Score</span>
                    <span className={`font-medium ${eligibilityPercentage >= 80 ? 'text-green-600' : eligibilityPercentage >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
                      {eligibilityPercentage.toFixed(0)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Loan Tenure</span>
                    <span className="font-medium">{loanTenure} years</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Interest Rate</span>
                    <span className="font-medium">{interestRate}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Eligibility Factors</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {eligibilityFactors.map((item, index) => (
                  <div key={index} className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">{item.factor}</span>
                      <span className={`text-xs px-2 py-1 rounded ${
                        item.impact === 'Excellent' || item.impact === 'Positive' || item.impact === 'Good' || item.impact === 'Stable' || item.impact === 'Optimal' 
                          ? 'bg-green-100 text-green-700'
                          : item.impact === 'Moderate' || item.impact === 'Variable'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {item.impact}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">{item.description}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Bank Comparison</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {banks.map((bank, index) => (
                  <div key={index} className="text-sm border-b pb-2 last:border-b-0">
                    <div className="flex justify-between font-medium">
                      <span>{bank.name}</span>
                      <span className="text-primary">{bank.rate}</span>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Max: {bank.maxTenure} • Processing: {bank.processingFee}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default LoanEligibility;

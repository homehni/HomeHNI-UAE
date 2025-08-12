import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CheckCircle, Calculator, Users, Shield, Clock, TrendingUp, FileText, CreditCard } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Marquee from '@/components/Marquee';
const Loans = () => {
  const [loanAmount, setLoanAmount] = useState(5000000);
  const [tenure, setTenure] = useState(20);
  const [interestRate, setInterestRate] = useState(7);
  const calculateEMI = () => {
    const principal = loanAmount;
    const rate = interestRate / 12 / 100;
    const time = tenure * 12;
    const emi = principal * rate * Math.pow(1 + rate, time) / (Math.pow(1 + rate, time) - 1);
    return Math.round(emi);
  };
  const totalAmount = calculateEMI() * tenure * 12;
  const totalInterest = totalAmount - loanAmount;
  return <div className="min-h-screen bg-background">
      <Marquee />
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-20 bg-cover bg-center bg-no-repeat" style={{backgroundImage: "url('/lovable-uploads/bd672939-951b-4007-b092-868ec5ac81c4.png')"}}>
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="container mx-auto text-center px-[19px] py-[20px] relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 py-[25px]">
            Unlock Your Dream Home with Smart Financing
          </h1>
          <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
            Get up to 90% of your property's value, transparent terms, and zero hidden fees—100% digital, entirely broker-free.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-primary hover:bg-primary/90">Get Started Now</Button>
            
          </div>
        </div>
      </section>

      {/* Why Choose Our Loans */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Our Loans?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <TrendingUp className="w-12 h-12 text-primary mx-auto mb-4" />
                <CardTitle>High Funding Ratio</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Secure up to 90% of the property's value via top banks and NBFCs, all in one place.
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardHeader>
                <Shield className="w-12 h-12 text-primary mx-auto mb-4" />
                <CardTitle>Transparent & Fee-Free</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  No hidden processing charges—just honest, straightforward lending.
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardHeader>
                <Users className="w-12 h-12 text-primary mx-auto mb-4" />
                <CardTitle>Zero Brokerage</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Enjoy seamless access to home loans without any commission—complete digital journey.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Enter Your Details</h3>
              <p className="text-muted-foreground">
                Fill in basic information to get instant eligibility results.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Compare Offers</h3>
              <p className="text-muted-foreground">
                Choose from curated options with best-fit interest rates and terms.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Apply Online</h3>
              <p className="text-muted-foreground">
                Complete documentation and submit fully online with support every step of the way.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What You Get */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">What You Get</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-start space-x-3">
              <CheckCircle className="w-6 h-6 text-green-500 mt-1" />
              <div>
                <h4 className="font-semibold mb-2">Top-Notch Interest Rates</h4>
                <p className="text-sm text-muted-foreground">
                  Competitive floating and fixed options across multiple lenders.
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <CheckCircle className="w-6 h-6 text-green-500 mt-1" />
              <div>
                <h4 className="font-semibold mb-2">Flexible Loan Tenure</h4>
                <p className="text-sm text-muted-foreground">
                  Spread your repayments comfortably over long periods—up to 30 years.
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <CheckCircle className="w-6 h-6 text-green-500 mt-1" />
              <div>
                <h4 className="font-semibold mb-2">Tax Benefits</h4>
                <p className="text-sm text-muted-foreground">
                  Enjoy appreciated deductions under Sections 24 and 80C—up to ₹3.5 lakh annually.
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <CheckCircle className="w-6 h-6 text-green-500 mt-1" />
              <div>
                <h4 className="font-semibold mb-2">Eligibility Calculator</h4>
                <p className="text-sm text-muted-foreground">
                  Estimate your EMI and see breakdown of principal vs interest using our tool.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* EMI Calculator */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">EMI & Interest Calculator</h2>
          <div className="max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calculator className="w-6 h-6 mr-2" />
                  Calculate Your EMI
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div>
                      <Label htmlFor="loanAmount">Loan Amount (₹)</Label>
                      <Input id="loanAmount" type="number" value={loanAmount} onChange={e => setLoanAmount(Number(e.target.value))} className="mt-1" />
                    </div>
                    
                    <div>
                      <Label htmlFor="tenure">Tenure (Years)</Label>
                      <Input id="tenure" type="number" value={tenure} onChange={e => setTenure(Number(e.target.value))} className="mt-1" />
                    </div>
                    
                    <div>
                      <Label htmlFor="interestRate">Interest Rate (%)</Label>
                      <Input id="interestRate" type="number" step="0.1" value={interestRate} onChange={e => setInterestRate(Number(e.target.value))} className="mt-1" />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="bg-primary/10 p-4 rounded-lg">
                      <h4 className="font-semibold text-lg mb-2">Monthly EMI</h4>
                      <p className="text-2xl font-bold text-primary">₹{calculateEMI().toLocaleString()}</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-muted p-3 rounded">
                        <p className="text-sm text-muted-foreground">Total Amount</p>
                        <p className="font-semibold">₹{totalAmount.toLocaleString()}</p>
                      </div>
                      <div className="bg-muted p-3 rounded">
                        <p className="text-sm text-muted-foreground">Total Interest</p>
                        <p className="font-semibold">₹{totalInterest.toLocaleString()}</p>
                      </div>
                    </div>
                    
                    <p className="text-sm text-muted-foreground">
                      Sample calculation: ₹50 lakhs over 20 years at 7% results in ~₹38,586 per month
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Eligibility & Documents */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Eligibility & Documents</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="w-6 h-6 mr-2" />
                  Eligibility Criteria
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="font-medium">Age Range:</span>
                  <span>21–65 years at loan maturity</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Income:</span>
                  <span>Stable income, varies by lender</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Credit Score:</span>
                  <span>Preferably 750+</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Employment:</span>
                  <span>Salaried, self-employed, or NRI</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="w-6 h-6 mr-2" />
                  Required Documents
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Identity proof (PAN, Aadhaar, Passport)
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Income proof (salary slips, Form 16, bank statements)
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Property proof & KYC documentation
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Additional lender-specific paperwork as required
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">FAQs</h2>
          <div className="max-w-4xl mx-auto space-y-6">
            <Card>
              <CardContent className="pt-6">
                <h4 className="font-semibold mb-2">Q: Can I get a 100% home loan?</h4>
                <p className="text-muted-foreground">
                  A: No—most lenders offer up to 90% for properties under ₹30 lakh.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <h4 className="font-semibold mb-2">Q: How long does approval take?</h4>
                <p className="text-muted-foreground">
                  A: The entire process is often completed digitally in just a few days. Our team expedites verification and documentation.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <h4 className="font-semibold mb-2">Q: Are there hidden charges?</h4>
                <p className="text-muted-foreground">
                  A: No—our platform ensures zero brokerage and no undisclosed charges. Transparent and straightforward.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Move Your Foot Forward?</h2>
          <p className="text-xl mb-8 opacity-90">
            Take the next step toward homeownership with confidence—no hassle, no hidden costs, and full support.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary">
 Get Started with Your Application
            </Button>


          </div>
        </div>
      </section>

      <Footer />
    </div>;
};
export default Loans;
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useToast } from "@/hooks/use-toast";
import { Building2, Users, CreditCard, Calculator, TrendingUp, FileText, MapPin, Crown, Clock, CheckCircle, Shield, Star, X, Plus, Minus, Globe, Shield as ShieldCheck, Headphones, Smartphone, Download, Home, Percent, DollarSign } from "lucide-react";

const LoansEmbedded = () => {
  const [statesData, setStatesData] = useState<any>(null);
  const [selectedState, setSelectedState] = useState("");
  const [selectedStateDesktop, setSelectedStateDesktop] = useState("");
  const [cities, setCities] = useState<string[]>([]);
  const [citiesDesktop, setCitiesDesktop] = useState<string[]>([]);

  const services = [{
    icon: Home,
    title: "Home Loans",
    description: "Competitive rates for purchasing your dream home."
  }, {
    icon: Building2,
    title: "Loan Against Property",
    description: "Leverage your property for business or personal needs."
  }, {
    icon: Calculator,
    title: "Balance Transfer",
    description: "Switch to lower rates and save on EMIs."
  }, {
    icon: TrendingUp,
    title: "Top-up Loans",
    description: "Additional funding on your existing home loan."
  }, {
    icon: CreditCard,
    title: "Construction Finance",
    description: "Finance for construction and renovation projects."
  }, {
    icon: FileText,
    title: "Business Loans",
    description: "Secured business loans against property collateral."
  }];

  const targetAudience = [{
    icon: Home,
    title: "First-time Home Buyers",
    description: "Looking for their dream home with best rates"
  }, {
    icon: TrendingUp,
    title: "Real Estate Investors",
    description: "Seeking investment property financing"
  }, {
    icon: Building2,
    title: "Business Owners",
    description: "Need capital for business expansion"
  }];

  const comparisonData = [{
    feature: "Quick Loan Approval",
    homeHNI: true,
    others: false
  }, {
    feature: "Competitive Interest Rates",
    homeHNI: true,
    others: false
  }, {
    feature: "Minimal Documentation",
    homeHNI: true,
    others: false
  }, {
    feature: "Dedicated Loan Advisor",
    homeHNI: true,
    others: false
  }, {
    feature: "Free Property Valuation",
    homeHNI: true,
    others: false
  }, {
    feature: "Zero Processing Fees",
    homeHNI: true,
    others: false
  }, {
    feature: "Door-to-door Service",
    homeHNI: true,
    others: false
  }, {
    feature: "Legal & Technical Support",
    homeHNI: true,
    others: false
  }];

  const testimonials = [{
    name: "Suresh Reddy",
    role: "Home Buyer",
    image: "/lovable-uploads/46a07bb4-9f10-4614-ad52-73dfb2de4f28.png",
    rating: 5,
    text: "Got my home loan approved in just 48 hours! Excellent service and competitive rates."
  }, {
    name: "Meera Patel",
    role: "Business Owner",
    image: "/lovable-uploads/5b898e4e-d9b6-4366-b58f-176fc3c8a9c3.png",
    rating: 5,
    text: "Loan against property helped me expand my business. Hassle-free process!"
  }, {
    name: "Ravi Kumar",
    role: "Property Investor",
    image: "/lovable-uploads/6e6c47cd-700c-49d4-bfee-85a69bb8353f.png",
    rating: 5,
    text: "Best loan rates in the market. Saved lakhs with their balance transfer option."
  }];

  const faqs = [{
    question: "What types of loans do you offer?",
    answer: "We offer home loans, loan against property, balance transfer, top-up loans, construction finance, and business loans against property."
  }, {
    question: "What are the interest rates?",
    answer: "Our interest rates start from 8.5% per annum and vary based on loan type, amount, and your profile. We offer some of the most competitive rates in the market."
  }, {
    question: "How quick is the loan approval process?",
    answer: "With our streamlined process and minimal documentation, loan approvals can be completed within 48-72 hours for eligible applicants."
  }, {
    question: "What documents are required?",
    answer: "Basic documents include identity proof, address proof, income documents, property papers, and bank statements. Our team will guide you through the complete list."
  }, {
    question: "Do you charge processing fees?",
    answer: "We offer zero processing fees on select loan products. Our team will provide complete transparency on all charges before you proceed."
  }];

  const { toast } = useToast();

  // Load states and cities data
  useEffect(() => {
    const loadStatesData = async () => {
      try {
        const response = await fetch('/data/india_states_cities.json');
        const data = await response.json();
        setStatesData(data);
      } catch (error) {
        console.error('Failed to load states data:', error);
      }
    };
    loadStatesData();
  }, []);

  // Update cities when state changes (mobile)
  useEffect(() => {
    if (statesData && selectedState) {
      const cities = statesData[selectedState];
      setCities(cities || []);
    } else {
      setCities([]);
    }
  }, [selectedState, statesData]);

  // Update cities when state changes (desktop)
  useEffect(() => {
    if (statesData && selectedStateDesktop) {
      const cities = statesData[selectedStateDesktop];
      setCitiesDesktop(cities || []);
    } else {
      setCitiesDesktop([]);
    }
  }, [selectedStateDesktop, statesData]);

  return (
    <div className="bg-background">
      {/* Hero Section */}
      <section className="relative pt-8 pb-20 md:pb-32 px-4 md:px-8 text-white overflow-hidden bg-cover bg-center bg-no-repeat" style={{
        backgroundImage: "url('/lovable-uploads/fbb0d72f-782e-49f5-bbe1-8afc1314b5f7.png')"
      }}>
        <div className="absolute inset-0 bg-red-900/80 pointer-events-none" />

        <div className="relative z-10 container mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 items-start">
            {/* Left: Copy */}
            <div className="max-w-2xl">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
                Quick & Easy Loan Solutions
                <br className="hidden md:block" />
                <span className="block">for Your Property Needs</span>
              </h1>
              <p className="text-lg md:text-xl text-white/90 mb-6">
                Get instant approval on home loans, property loans, and business loans
                with competitive rates starting from 8.5% per annum.
              </p>
            </div>

            {/* Right: Placeholder for form on desktop */}
            <div className="hidden lg:block lg:justify-self-end">
              <div className="w-full max-w-md h-80"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Sticky Form Container for Large Screens */}
      <div className="hidden lg:block absolute top-32 right-8 z-40">
        <div className="w-96 sticky top-32">
          <Card className="w-full rounded-xl shadow-2xl bg-background border-2 border-primary">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold text-foreground mb-2 text-uniform-center">Need a loan?</h3>
              <p className="text-sm text-muted-foreground mb-4 text-uniform-center">Fill the form & get instant pre-approval</p>

              <form className="space-y-4" onSubmit={e => {
                e.preventDefault();
                const form = e.currentTarget as HTMLFormElement;
                if (!form.checkValidity()) {
                  form.reportValidity();
                  toast({
                    title: "Required Fields Missing",
                    description: "Please fill in all required fields before submitting the loan application.",
                    variant: "destructive"
                  });
                  return;
                }
                toast({
                  title: "Application received",
                  description: "Our loan expert will contact you shortly."
                });
                form.reset();
              }}>
                <Input id="loan-name" name="name" placeholder="Name" required />

                <div className="flex gap-2">
                  <Select defaultValue="+91" name="countryCode">
                    <SelectTrigger className="w-28"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="+91">🇮🇳 +91</SelectItem>
                      <SelectItem value="+1">🇺🇸 +1</SelectItem>
                      <SelectItem value="+44">🇬🇧 +44</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input id="loan-phone" name="phone" type="tel" placeholder="Phone Number" className="flex-1" required />
                </div>

                <Input id="loan-email" name="email" type="email" placeholder="Email ID" required />

                <div className="flex gap-2">
                  <Select defaultValue="India" name="country">
                    <SelectTrigger className="flex-1"><SelectValue placeholder="Country" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="India">India</SelectItem>
                      <SelectItem value="USA">USA</SelectItem>
                      <SelectItem value="UK">UK</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select name="state" onValueChange={setSelectedStateDesktop}>
                    <SelectTrigger className="flex-1"><SelectValue placeholder="State" /></SelectTrigger>
                    <SelectContent>
                      {statesData && Object.keys(statesData).map((state: string) => (
                        <SelectItem key={state} value={state}>
                          {state}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select name="city">
                    <SelectTrigger className="flex-1"><SelectValue placeholder="City" /></SelectTrigger>
                    <SelectContent>
                      {citiesDesktop.map((city: string) => (
                        <SelectItem key={city} value={city}>
                          {city}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-2">
                  <Select name="loanType" required>
                    <SelectTrigger className="flex-1"><SelectValue placeholder="Loan Type" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="home-loan">Home Loan</SelectItem>
                      <SelectItem value="lap">Loan Against Property</SelectItem>
                      <SelectItem value="balance-transfer">Balance Transfer</SelectItem>
                      <SelectItem value="top-up">Top-up Loan</SelectItem>
                      <SelectItem value="construction">Construction Loan</SelectItem>
                      <SelectItem value="business">Business Loan</SelectItem>
                      <SelectItem value="other">Others</SelectItem>
                    </SelectContent>
                  </Select>

                  <Input id="loan-amount" name="amount" type="number" placeholder="Loan Amount Required" className="flex-1" required />
                </div>

                <Button type="submit" className="w-full">Get Pre-Approved Now!</Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Mobile Form - Static below hero */}
      <section className="lg:hidden px-4 py-8 bg-background">
        <div className="container mx-auto max-w-xl px-4">
          <Card className="w-full rounded-2xl shadow-xl border-2 border-primary bg-card">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-foreground mb-3 text-uniform-center">Need a loan?</h3>
              <p className="text-base text-muted-foreground mb-8 text-uniform-center">Fill the form & get instant pre-approval</p>

              <form className="space-y-5" onSubmit={e => {
                e.preventDefault();
                const form = e.currentTarget as HTMLFormElement;
                if (!form.checkValidity()) {
                  form.reportValidity();
                  toast({
                    title: "Required Fields Missing",
                    description: "Please fill in all required fields before submitting the loan application.",
                    variant: "destructive"
                  });
                  return;
                }
                toast({
                  title: "Application received",
                  description: "Our loan expert will contact you shortly."
                });
                form.reset();
              }}>
                <Input 
                  id="loan-name-mobile" 
                  name="name" 
                  placeholder="Name" 
                  className="h-12 text-base bg-background"
                  required 
                />

                <div className="flex gap-3">
                  <Select defaultValue="+91" name="countryCode">
                    <SelectTrigger className="w-32 h-12 bg-background">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-background border shadow-lg">
                      <SelectItem value="+91">🇮🇳 +91</SelectItem>
                      <SelectItem value="+1">🇺🇸 +1</SelectItem>
                      <SelectItem value="+44">🇬🇧 +44</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input 
                    id="loan-phone-mobile" 
                    name="phone" 
                    type="tel" 
                    placeholder="Phone Number" 
                    className="flex-1 h-12 text-base bg-background" 
                    required 
                  />
                </div>

                <Input 
                  id="loan-email-mobile" 
                  name="email" 
                  type="email" 
                  placeholder="Email ID" 
                  className="h-12 text-base bg-background"
                />

                <div className="flex gap-3">
                  <Select defaultValue="India" name="country">
                    <SelectTrigger className="flex-1 h-12 bg-background">
                      <SelectValue placeholder="Country" />
                    </SelectTrigger>
                    <SelectContent className="bg-background border shadow-lg">
                      <SelectItem value="India">India</SelectItem>
                      <SelectItem value="USA">USA</SelectItem>
                      <SelectItem value="UK">UK</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select name="state" onValueChange={setSelectedState}>
                    <SelectTrigger className="flex-1 h-12 bg-background">
                      <SelectValue placeholder="State" />
                    </SelectTrigger>
                    <SelectContent className="bg-background border shadow-lg">
                      {statesData && Object.keys(statesData).map((state: string) => (
                        <SelectItem key={state} value={state}>
                          {state}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select name="city">
                    <SelectTrigger className="flex-1 h-12 bg-background">
                      <SelectValue placeholder="City" />
                    </SelectTrigger>
                    <SelectContent className="bg-background border shadow-lg">
                      {cities.map((city: string) => (
                        <SelectItem key={city} value={city}>
                          {city}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-3">
                  <Select name="loanType">
                    <SelectTrigger className="flex-1 h-12 bg-background">
                      <SelectValue placeholder="Loan Type" />
                    </SelectTrigger>
                    <SelectContent className="bg-background border shadow-lg">
                      <SelectItem value="home-loan">Home Loan</SelectItem>
                      <SelectItem value="lap">Loan Against Property</SelectItem>
                      <SelectItem value="balance-transfer">Balance Transfer</SelectItem>
                      <SelectItem value="top-up">Top-up Loan</SelectItem>
                      <SelectItem value="construction">Construction Loan</SelectItem>
                      <SelectItem value="business">Business Loan</SelectItem>
                    </SelectContent>
                  </Select>

                  <Input 
                    id="loan-amount-mobile" 
                    name="amount" 
                    type="number" 
                    placeholder="Loan Amount Required" 
                    className="flex-1 h-12 text-base bg-background"
                  />
                </div>

                <Button type="submit" className="w-full h-12 text-base font-semibold bg-red-600 hover:bg-red-700 text-white mt-6">
                  Get Pre-Approved Now!
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* What's in it for you Section */}
      <section className="py-16 px-4 bg-background">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 items-start">
            <div className="max-w-2xl pr-8">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8">
                Why choose our loan services?
              </h2>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                    <Percent className="w-5 h-5 text-red-600" />
                  </div>
                  <h3 className="text-base font-semibold text-foreground">
                    Competitive Interest Rates
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Starting from 8.5% per annum with flexible repayment options
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                    <Clock className="w-5 h-5 text-red-600" />
                  </div>
                  <h3 className="text-base font-semibold text-foreground">
                    Quick Approval
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Get loan approval in just 48-72 hours with minimal documentation
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-red-600" />
                  </div>
                  <h3 className="text-base font-semibold text-foreground">
                    Minimal Documentation
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Simple paperwork with digital documentation process
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-red-600" />
                  </div>
                  <h3 className="text-base font-semibold text-foreground">
                    Dedicated Loan Advisor
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Personal guidance throughout the loan process
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-red-600" />
                  </div>
                  <h3 className="text-base font-semibold text-foreground">
                    Free Property Valuation
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Professional property assessment at no extra cost
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-red-600" />
                  </div>
                  <h3 className="text-base font-semibold text-foreground">
                    Zero Processing Fees
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    No hidden charges or processing fees on select loan products
                  </p>
                </div>
              </div>
            </div>
            
            {/* Right side spacing for sticky form */}
            <div className="hidden lg:block"></div>
          </div>
        </div>
      </section>

      {/* Loan Services Info Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div className="max-w-3xl">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8">
                Comprehensive Loan Solutions
              </h2>
              <div className="text-muted-foreground space-y-4 text-sm leading-relaxed">
                <p>
                  Whether you're looking to purchase your dream home, expand your business, or leverage your 
                  property for additional funds, our comprehensive loan solutions are designed to meet your 
                  unique financial needs. With competitive interest rates and quick approval processes, we make 
                  borrowing simple and stress-free.
                </p>
                <p>
                  Our team of experienced loan advisors provides personalized guidance throughout the entire 
                  process, from initial consultation to loan disbursement. We understand that every financial 
                  situation is unique, which is why we offer flexible terms and customized solutions to help 
                  you achieve your goals.
                </p>
                <p>
                  With our digital-first approach, minimal documentation requirements, and transparent fee 
                  structure, getting a loan has never been easier. Join thousands of satisfied customers who 
                  have trusted us with their financial needs and experienced the difference of working with 
                  a truly customer-centric lending partner.
                </p>
              </div>
            </div>
            
            {/* Right side spacing for sticky form */}
            <div className="hidden lg:block"></div>
          </div>
        </div>
      </section>

      {/* Loan Services */}
      <section className="py-16 px-4 bg-background">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div className="max-w-3xl">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8">
                Our Loan Services
              </h2>
              <div className="grid gap-6">
                {services.map((service, index) => {
                  const IconComponent = service.icon;
                  return (
                    <div key={index} className="flex gap-4 p-6 bg-card rounded-lg border">
                      <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <IconComponent className="w-6 h-6 text-red-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-foreground mb-2">{service.title}</h3>
                        <p className="text-muted-foreground text-sm">{service.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            {/* Right side spacing for sticky form */}
            <div className="hidden lg:block"></div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div className="max-w-3xl">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8">
                Trusted by Thousands
              </h2>
              <div className="grid grid-cols-2 gap-8">
                <div className="text-center">
                  <div className="text-4xl md:text-5xl font-bold text-red-600 mb-2">₹500Cr+</div>
                  <p className="text-muted-foreground">Loans Disbursed</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl md:text-5xl font-bold text-red-600 mb-2">10K+</div>
                  <p className="text-muted-foreground">Happy Customers</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl md:text-5xl font-bold text-red-600 mb-2">48hrs</div>
                  <p className="text-muted-foreground">Average Approval Time</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl md:text-5xl font-bold text-red-600 mb-2">98%</div>
                  <p className="text-muted-foreground">Customer Satisfaction</p>
                </div>
              </div>
            </div>
            
            {/* Right side spacing for sticky form */}
            <div className="hidden lg:block"></div>
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-16 px-4 bg-background">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div className="max-w-3xl">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8">
                Why Home HNI is Better
              </h2>
              <div className="bg-card rounded-xl border overflow-hidden">
                <div className="grid grid-cols-3 gap-4 p-4 bg-muted/50 font-semibold text-sm">
                  <div>Features</div>
                  <div className="text-center">Home HNI</div>
                  <div className="text-center">Others</div>
                </div>
                {comparisonData.map((item, index) => (
                  <div key={index} className="grid grid-cols-3 gap-4 p-4 border-t text-sm">
                    <div className="text-foreground">{item.feature}</div>
                    <div className="text-center">
                      {item.homeHNI ? (
                        <CheckCircle className="w-4 h-4 text-red-600 mx-auto" />
                      ) : (
                        <X className="w-4 h-4 text-red-500 mx-auto" />
                      )}
                    </div>
                    <div className="text-center">
                      {item.others ? (
                        <CheckCircle className="w-4 h-4 text-red-600 mx-auto" />
                      ) : (
                        <X className="w-4 h-4 text-red-500 mx-auto" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Right side spacing for sticky form */}
            <div className="hidden lg:block"></div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div className="max-w-3xl">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8">
                What Our Customers Say
              </h2>
              <div className="space-y-6">
                {testimonials.map((testimonial, index) => (
                  <Card key={index} className="p-6">
                    <CardContent className="p-0">
                      <div className="flex items-start gap-4">
                        <img 
                          src={testimonial.image} 
                          alt={testimonial.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-1 mb-2">
                            {[...Array(testimonial.rating)].map((_, i) => (
                              <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            ))}
                          </div>
                          <p className="text-muted-foreground text-sm mb-3">"{testimonial.text}"</p>
                          <div>
                            <p className="font-semibold text-sm">{testimonial.name}</p>
                            <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
            
            {/* Right side spacing for sticky form */}
            <div className="hidden lg:block"></div>
          </div>
        </div>
      </section>

      {/* Target Audience */}
      <section className="py-16 px-4 bg-background">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div className="max-w-3xl">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8">
                Who We Serve
              </h2>
              <div className="grid gap-6">
                {targetAudience.map((audience, index) => {
                  const IconComponent = audience.icon;
                  return (
                    <div key={index} className="flex gap-4 p-6 bg-card rounded-lg border">
                      <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <IconComponent className="w-6 h-6 text-red-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-foreground mb-2">{audience.title}</h3>
                        <p className="text-muted-foreground text-sm">{audience.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            {/* Right side spacing for sticky form */}
            <div className="hidden lg:block"></div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div className="max-w-3xl">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8">
                Frequently Asked Questions
              </h2>
              <Accordion type="single" collapsible className="space-y-4">
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`} className="bg-card border rounded-lg px-6">
                    <AccordionTrigger className="text-left font-semibold text-sm py-4">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground text-sm pb-4">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
            
            {/* Right side spacing for sticky form */}
            <div className="hidden lg:block"></div>
          </div>
        </div>
      </section>

      {/* Service Tags Section */}
      <section className="py-16 px-4 bg-background">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div className="max-w-3xl">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8">
                Loan Services
              </h2>
              
              <div className="space-y-6 mb-8">
                <div className="flex flex-wrap gap-3">
                  <span className="px-4 py-2 bg-muted rounded-full text-sm">Home Loans in Hyderabad</span>
                  <span className="px-4 py-2 bg-muted rounded-full text-sm">Home Loans in Bangalore</span>
                  <span className="px-4 py-2 bg-muted rounded-full text-sm">Home Loans in Mumbai</span>
                </div>
                <div className="flex flex-wrap gap-3">
                  <span className="px-4 py-2 bg-muted rounded-full text-sm">Home Loans in Pune</span>
                  <span className="px-4 py-2 bg-muted rounded-full text-sm">Home Loans in Delhi</span>
                  <span className="px-4 py-2 bg-muted rounded-full text-sm">Home Loans in Chennai</span>
                </div>
                <div className="flex flex-wrap gap-3">
                  <span className="px-4 py-2 bg-muted rounded-full text-sm">Loan Against Property</span>
                  <span className="px-4 py-2 bg-muted rounded-full text-sm">Business Loans</span>
                  <span className="px-4 py-2 bg-muted rounded-full text-sm">Construction Loans</span>
                </div>
                <div className="flex flex-wrap gap-3">
                  <span className="px-4 py-2 bg-muted rounded-full text-sm">Balance Transfer Loans</span>
                  <span className="px-4 py-2 bg-muted rounded-full text-sm">Top-up Loans</span>
                  <span className="px-4 py-2 bg-muted rounded-full text-sm">Quick Loan Approval</span>
                </div>
                <div className="flex flex-wrap gap-3">
                  <span className="px-4 py-2 bg-muted rounded-full text-sm">Low Interest Rate Loans</span>
                </div>
              </div>

              <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-6">
                Property Loan Services
              </h3>
              
              <div className="space-y-3 mb-8">
                <div className="flex flex-wrap gap-3">
                  <span className="px-4 py-2 bg-muted rounded-full text-sm">Loan Against Property in Hyderabad</span>
                  <span className="px-4 py-2 bg-muted rounded-full text-sm">Property Valuation Services</span>
                </div>
              </div>

              <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-6">
                Home Loan Documentation
              </h3>
              
              <div className="space-y-3">
                <div className="flex flex-wrap gap-3">
                  <span className="px-4 py-2 bg-muted rounded-full text-sm">Home Loan Documents</span>
                  <span className="px-4 py-2 bg-muted rounded-full text-sm">Loan Processing Services</span>
                </div>
                <div className="flex flex-wrap gap-3">
                  <span className="px-4 py-2 bg-muted rounded-full text-sm">Digital Loan Application</span>
                  <span className="px-4 py-2 bg-muted rounded-full text-sm">Instant Loan Approval</span>
                </div>
                <div className="flex flex-wrap gap-3">
                  <span className="px-4 py-2 bg-muted rounded-full text-sm">Zero Processing Fee Loans</span>
                </div>
              </div>
            </div>
            
            {/* Right side spacing for sticky form */}
            <div className="hidden lg:block"></div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LoansEmbedded;

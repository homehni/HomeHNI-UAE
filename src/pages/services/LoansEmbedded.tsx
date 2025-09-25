import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useToast } from "@/hooks/use-toast";
import { Building2, Users, CreditCard, Calculator, TrendingUp, FileText, MapPin, Crown, Clock, CheckCircle, Shield, Star, X, Plus, Minus, Globe, Shield as ShieldCheck, Headphones, Smartphone, Download, Home, Percent, DollarSign } from "lucide-react";

const LoansEmbedded = () => {
  // Major cities in India
  const majorCities = [
    "Mumbai", "Delhi", "Bangalore", "Hyderabad", "Ahmedabad", "Chennai", "Kolkata", "Surat", "Pune", "Jaipur",
    "Lucknow", "Kanpur", "Nagpur", "Indore", "Thane", "Bhopal", "Visakhapatnam", "Pimpri-Chinchwad", "Patna", "Vadodara",
    "Ghaziabad", "Ludhiana", "Agra", "Nashik", "Faridabad", "Meerut", "Rajkot", "Kalyan-Dombivli", "Vasai-Virar", "Varanasi",
    "Srinagar", "Aurangabad", "Dhanbad", "Amritsar", "Navi Mumbai", "Allahabad", "Ranchi", "Howrah", "Coimbatore", "Jabalpur",
    "Gwalior", "Vijayawada", "Jodhpur", "Madurai", "Raipur", "Kota", "Guwahati", "Chandigarh", "Solapur", "Hubli-Dharwad"
  ];

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

  const [formMessage, setFormMessage] = useState<{ type: 'success' | 'error' | null; text: string }>({ type: null, text: '' });

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
      <div className="hidden lg:block absolute top-8 right-8 z-40">
        <div className="w-96 sticky top-8">
          <Card className="w-full rounded-xl shadow-2xl bg-background border-2 border-primary">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold text-foreground mb-2 text-uniform-center">Need a loan?</h3>
              <p className="text-sm text-muted-foreground mb-4 text-uniform-center">Fill the form & get instant pre-approval</p>

              <form className="space-y-4" onSubmit={async e => {
                e.preventDefault();
                const form = e.currentTarget as HTMLFormElement;
                if (!form.checkValidity()) {
                  form.reportValidity();
                  setFormMessage({
                    type: "error",
                    text: "Please fill in all required fields before submitting the loan application."
                  });
                  return;
                }

                const formData = new FormData(form);
                const email = formData.get('email') as string;
                const name = formData.get('name') as string;

                console.log('=== LOAN FORM SUBMISSION DEBUG ===');
                console.log('Form email extracted:', email);
                console.log('Form name extracted:', name);
                console.log('Email field value directly:', (form.querySelector('[name="email"]') as HTMLInputElement)?.value);

                if (!email || !email.includes('@')) {
                  console.error('Invalid email address:', email);
                  setFormMessage({
                    type: "error",
                    text: "Please enter a valid email address."
                  });
                  return;
                }

                try {
                  const requestBody = {
                    to: email,
                    userName: name || 'there',
                    loanEligibilityUrl: 'https://homehni.com/loan-eligibility'
                  };
                  
                  console.log('Email API request body:', requestBody);

                  // Send loan enquiry email
                  const response = await fetch('https://lovable-email-backend.vercel.app/send-loan-enquiry-email', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                      'x-api-key': 'lov@ble-2025-secret-KEY'
                    },
                    body: JSON.stringify(requestBody)
                  });

                  console.log('Email API response status:', response.status);
                  console.log('Email API response ok:', response.ok);

                  const result = await response.json();
                  console.log('Email API full response:', result);
                  
                  if (response.ok && result.success !== false) {
                    console.log('✅ Email sent successfully to:', email);
                    setFormMessage({
                      type: "success",
                      text: `Application received! Loan details sent to ${email}. Our expert will contact you shortly.`
                    });
                  } else {
                    console.error('❌ Email API returned error:', result);
                    setFormMessage({
                      type: "error",
                      text: "There was an issue processing your request. Please try again."
                    });
                  }
                } catch (error) {
                  console.error('❌ Failed to send loan enquiry email:', error);
                  setFormMessage({
                    type: "error",
                    text: "Network error occurred. Please check your internet connection and try again."
                  });
                }
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

                  <Select name="city" required>
                    <SelectTrigger className="flex-1"><SelectValue placeholder="City" /></SelectTrigger>
                    <SelectContent>
                      {majorCities.map((city: string) => (
                        <SelectItem key={city} value={city}>
                          {city}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

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

                <Button type="submit" className="w-full bg-red-800 hover:bg-red-900 text-white">Get Pre-Approved Now!</Button>
                
                {/* Inline message */}
                {formMessage.type && (
                  <div className={`mt-2 p-3 rounded-lg text-sm ${
                    formMessage.type === 'error'
                      ? 'bg-red-50 text-red-700 border border-red-200'
                      : 'bg-green-50 text-green-700 border border-green-200'
                  }`}>
                    {formMessage.text}
                  </div>
                )}
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

              <form className="space-y-5" onSubmit={async e => {
                e.preventDefault();
                const form = e.currentTarget as HTMLFormElement;
                if (!form.checkValidity()) {
                  form.reportValidity();
                  setFormMessage({
                    type: "error",
                    text: "Please fill in all required fields before submitting the loan application."
                  });
                  return;
                }

                const formData = new FormData(form);
                const email = formData.get('email') as string;
                const name = formData.get('name') as string;

                console.log('=== MOBILE LOAN FORM SUBMISSION DEBUG ===');
                console.log('Form email extracted:', email);
                console.log('Form name extracted:', name);
                console.log('Email field value directly:', (form.querySelector('[name="email"]') as HTMLInputElement)?.value);

                if (!email || !email.includes('@')) {
                  console.error('Invalid email address:', email);
                  setFormMessage({
                    type: "error",
                    text: "Please enter a valid email address."
                  });
                  return;
                }

                try {
                  const requestBody = {
                    to: email,
                    userName: name || 'there',
                    loanEligibilityUrl: 'https://homehni.com/loan-eligibility'
                  };
                  
                  console.log('Email API request body:', requestBody);

                  // Send loan enquiry email
                  const response = await fetch('https://lovable-email-backend.vercel.app/send-loan-enquiry-email', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                      'x-api-key': 'lov@ble-2025-secret-KEY'
                    },
                    body: JSON.stringify(requestBody)
                  });

                  console.log('Email API response status:', response.status);
                  console.log('Email API response ok:', response.ok);

                  const result = await response.json();
                  console.log('Email API full response:', result);
                  
                  if (response.ok && result.success !== false) {
                    console.log('✅ Email sent successfully to:', email);
                    setFormMessage({
                      type: "success",
                      text: `Application received! Loan details sent to ${email}. Our expert will contact you shortly.`
                    });
                  } else {
                    console.error('❌ Email API returned error:', result);
                    setFormMessage({
                      type: "error",
                      text: "There was an issue processing your request. Please try again."
                    });
                  }
                } catch (error) {
                  console.error('❌ Failed to send loan enquiry email:', error);
                  setFormMessage({
                    type: "error",
                    text: "Network error occurred. Please check your internet connection and try again."
                  });
                }
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

                <div className="flex flex-col md:flex-row gap-3">
                  <Select defaultValue="india" name="country">
                    <SelectTrigger className="flex-1 h-12 bg-background">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-background border shadow-lg">
                      <SelectItem value="india">India</SelectItem>
                      <SelectItem value="usa">USA</SelectItem>
                      <SelectItem value="uk">UK</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select name="city" required>
                    <SelectTrigger className="flex-1 h-12 bg-background">
                      <SelectValue placeholder="City" />
                    </SelectTrigger>
                    <SelectContent className="bg-background border shadow-lg">
                      {majorCities.map((city: string) => (
                        <SelectItem key={city} value={city}>
                          {city}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-col md:flex-row gap-3">
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

                <Button type="submit" className="w-full h-12 text-base font-semibold bg-red-800 hover:bg-red-900 text-white mt-6">
                  Get Pre-Approved Now!
                </Button>
                
                {/* Inline message */}
                {formMessage.type && (
                  <div className={`mt-2 p-3 rounded-lg text-sm ${
                    formMessage.type === 'error'
                      ? 'bg-red-50 text-red-700 border border-red-200'
                      : 'bg-green-50 text-green-700 border border-green-200'
                  }`}>
                    {formMessage.text}
                  </div>
                )}
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
                    Starting from 8.5% per annum
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
                    Pre-approval in 48-72 hours
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
                    Hassle-free paperwork process
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                    <Headphones className="w-5 h-5 text-red-600" />
                  </div>
                  <h3 className="text-base font-semibold text-foreground">
                    Expert Guidance
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Dedicated loan advisors
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-center lg:justify-end">
              <div className="w-full max-w-md aspect-square bg-gradient-to-br from-red-100 to-red-50 rounded-2xl flex items-center justify-center">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto">
                    <DollarSign className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground">Loan Amount</h3>
                  <p className="text-3xl font-bold text-red-600">Up to ₹5 Cr</p>
                  <p className="text-muted-foreground">Based on property value</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comprehensive Loan Solutions Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Comprehensive Loan Solutions
          </h2>
          <p className="text-lg text-muted-foreground mb-12 max-w-2xl mx-auto">
            From home purchases to business expansion, we provide tailored loan solutions for all your financial needs.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-shadow bg-background border border-border">
                <CardContent className="p-0 text-center">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <service.icon className="w-6 h-6 text-red-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{service.title}</h3>
                  <p className="text-muted-foreground">{service.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Our Loan Services Section */}
      <section className="py-16 px-4 bg-background">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-12">Our Loan Services</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto">
                <Home className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-foreground">Home Loans</h3>
              <p className="text-muted-foreground">Competitive interest rates starting from 8.5% per annum for your dream home purchase.</p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Loan amount up to ₹5 crores</li>
                <li>• Tenure up to 30 years</li>
                <li>• Zero processing fees*</li>
              </ul>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto">
                <Building2 className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-foreground">Loan Against Property</h3>
              <p className="text-muted-foreground">Leverage your property for business expansion or personal financial needs.</p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Up to 70% of property value</li>
                <li>• Flexible repayment options</li>
                <li>• Quick disbursement</li>
              </ul>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-foreground">Balance Transfer</h3>
              <p className="text-muted-foreground">Switch your existing loan to us and save on EMIs with lower interest rates.</p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Save up to ₹5 lakhs in interest</li>
                <li>• Top-up facility available</li>
                <li>• Free legal assistance</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted by Thousands Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-12">Trusted by Thousands</h2>
          
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-2">
              <div className="text-4xl font-bold text-red-600">50K+</div>
              <p className="text-muted-foreground">Happy Customers</p>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-red-600">₹1000Cr+</div>
              <p className="text-muted-foreground">Loans Disbursed</p>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-red-600">48 Hrs</div>
              <p className="text-muted-foreground">Quick Approval</p>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-red-600">15+</div>
              <p className="text-muted-foreground">Years Experience</p>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Table Section */}
      <section className="py-16 px-4 bg-background">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-12">Why Choose HomeHNI Over Others?</h2>
          
          <div className="max-w-4xl mx-auto">
            <div className="bg-card border border-border rounded-lg overflow-hidden">
              <div className="grid grid-cols-3 bg-muted text-center py-4">
                <div className="font-semibold text-foreground">Features</div>
                <div className="font-semibold text-foreground">HomeHNI</div>
                <div className="font-semibold text-foreground">Others</div>
              </div>
              
              {comparisonData.map((item, index) => (
                <div key={index} className={`grid grid-cols-3 text-center py-3 ${index % 2 === 0 ? 'bg-muted/50' : 'bg-background'}`}>
                  <div className="text-foreground font-medium">{item.feature}</div>
                  <div>{item.homeHNI ? <CheckCircle className="w-5 h-5 text-green-600 mx-auto" /> : <X className="w-5 h-5 text-red-500 mx-auto" />}</div>
                  <div>{item.others ? <CheckCircle className="w-5 h-5 text-green-600 mx-auto" /> : <X className="w-5 h-5 text-red-500 mx-auto" />}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Customer Testimonials Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-12">What Our Customers Say</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="p-6 bg-background border border-border">
                <CardContent className="p-0">
                  <div className="flex items-center mb-4">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover mr-4"
                    />
                    <div>
                      <h4 className="font-semibold text-foreground">{testimonial.name}</h4>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                  
                  <div className="flex mb-3">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  
                  <p className="text-muted-foreground">{testimonial.text}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Target Audience Section */}
      <section className="py-16 px-4 bg-background">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Perfect For</h2>
          <p className="text-lg text-muted-foreground mb-12">Our loan solutions are designed for various customer needs</p>
          
          <div className="grid md:grid-cols-3 gap-8">
            {targetAudience.map((audience, index) => (
              <div key={index} className="space-y-4">
                <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto">
                  <audience.icon className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-xl font-bold text-foreground">{audience.title}</h3>
                <p className="text-muted-foreground">{audience.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-12">Frequently Asked Questions</h2>
          
          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left font-semibold text-foreground">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* Service Tags Section */}
      <section className="py-12 px-4 bg-background">
        <div className="container mx-auto text-center">
          <div className="flex flex-wrap justify-center gap-3">
            <span className="px-4 py-2 bg-red-100 text-red-700 rounded-full text-sm font-medium">Home Loans Mumbai</span>
            <span className="px-4 py-2 bg-red-100 text-red-700 rounded-full text-sm font-medium">Property Loans Delhi</span>
            <span className="px-4 py-2 bg-red-100 text-red-700 rounded-full text-sm font-medium">Business Loans Bangalore</span>
            <span className="px-4 py-2 bg-red-100 text-red-700 rounded-full text-sm font-medium">Loan Against Property</span>
            <span className="px-4 py-2 bg-red-100 text-red-700 rounded-full text-sm font-medium">Balance Transfer</span>
            <span className="px-4 py-2 bg-red-100 text-red-700 rounded-full text-sm font-medium">Construction Finance</span>
            <span className="px-4 py-2 bg-red-100 text-red-700 rounded-full text-sm font-medium">Quick Loan Approval</span>
            <span className="px-4 py-2 bg-red-100 text-red-700 rounded-full text-sm font-medium">Low Interest Rates</span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LoansEmbedded;

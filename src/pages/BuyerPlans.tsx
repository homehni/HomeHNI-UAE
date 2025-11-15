import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, Check, Phone, Home, Users, Shield, Clock, UserCheck, Globe, Lock, FileText, TrendingUp, Camera, ClipboardList, Search, Calendar, Handshake, FileCheck, MapPin, Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import PayButton from '@/components/PayButton';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Marquee from '@/components/Marquee';
import GSTDisplay from '@/components/GSTDisplay';
import { calculateTotalWithGST } from '@/utils/gstCalculator';
import { supabase } from '@/integrations/supabase/client';

interface BuyerPlansProps { embedded?: boolean }
const BuyerPlans = ({ embedded }: BuyerPlansProps) => {
  const [selectedPlans, setSelectedPlans] = useState({
    residential: 1,
    commercial: 1, 
    industrial: 1,
    agricultural: 1
  });
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);

  const tabPlans = {
    residential: [
      {
        name: "Silver Plan",
        price: "AED 44",
        originalPrice: "AED 44",
        freePrice: "FREE",
        gst: "+5% VAT",
        badge: "BASIC SEARCH",
        badgeColor: "bg-yellow-500",
        amountPaise: 4400,
        isFree: true,
      },
      {
        name: "Gold Plan", 
        price: "AED 110",
        gst: "+5% VAT",
        badge: "EXPERT ASSISTANCE",
        badgeColor: "bg-green-500",
        amountPaise: 11000,
      },
      {
        name: "Platinum Plan",
        price: "AED 220",
        gst: "+5% VAT", 
        badge: "EXCLUSIVE SUPPORT",
        badgeColor: "bg-red-500",
        amountPaise: 22000,
      }
    ],
    commercial: [
      {
        name: "Business Explorer",
        price: "AED 44",
        originalPrice: "AED 44",
        freePrice: "FREE",
        gst: "+5% VAT",
        badge: "COMMERCIAL SEARCH",
        badgeColor: "bg-blue-500",
        amountPaise: 4400,
        isFree: true,
      },
      {
        name: "Business Pro", 
        price: "AED 400",
        gst: "+5% VAT",
        badge: "COMMERCIAL EXPERT",
        badgeColor: "bg-indigo-500",
        amountPaise: 40000,
      },
      {
        name: "Business Elite",
        price: "AED 580",
        gst: "+5% VAT", 
        badge: "VIP COMMERCIAL",
        badgeColor: "bg-purple-600",
        amountPaise: 58000,
      }
    ],
    industrial: [
      {
        name: "Industrial Basic",
        price: "AED 44",
        originalPrice: "AED 44",
        freePrice: "FREE",
        gst: "+5% VAT",
        badge: "INDUSTRIAL SEARCH",
        badgeColor: "bg-gray-600",
        amountPaise: 4400,
        isFree: true,
      },
      {
        name: "Industrial Pro", 
        price: "AED 710",
        gst: "+5% VAT",
        badge: "INDUSTRIAL EXPERT",
        badgeColor: "bg-slate-700",
        amountPaise: 71000,
      },
      {
        name: "Industrial Premium",
        price: "AED 1,160",
        gst: "+5% VAT", 
        badge: "PREMIUM INDUSTRIAL",
        badgeColor: "bg-zinc-800",
        amountPaise: 116000,
      }
    ],
    agricultural: [
      {
        name: "Farm Finder",
        price: "AED 44",
        originalPrice: "AED 44",
        freePrice: "FREE",
        gst: "+5% VAT",
        badge: "AGRICULTURAL SEARCH",
        badgeColor: "bg-green-600",
        amountPaise: 4400,
        isFree: true,
      },
      {
        name: "Farm Expert", 
        price: "AED 310",
        gst: "+5% VAT",
        badge: "FARM SPECIALIST",
        badgeColor: "bg-emerald-600",
        amountPaise: 31000,
      },
      {
        name: "Farm Premium",
        price: "AED 490",
        gst: "+5% VAT", 
        badge: "PREMIUM FARM",
        badgeColor: "bg-teal-600",
        amountPaise: 49000,
      }
    ]
  };

  const tabPlanDetails = {
    residential: [
      [
        { icon: <Clock className="w-5 h-5" />, text: "45 Days Plan Validity" },
        { icon: <Home className="w-5 h-5" />, text: "View up to 25 Property Contacts" },
        { icon: <UserCheck className="w-5 h-5" />, text: "Complimentary Legal Consultation" },
        { icon: <FileText className="w-5 h-5" />, text: "Loan Assistance Support" }
      ],
      [
        { icon: <Clock className="w-5 h-5" />, text: "45 Days Plan Validity" },
        { icon: <Home className="w-5 h-5" />, text: "View up to 50 Property Contacts" },
        { icon: <UserCheck className="w-5 h-5" />, text: "Complimentary Legal Consultation" },
        { icon: <FileText className="w-5 h-5" />, text: "Loan Assistance Support" },
        { icon: <Users className="w-5 h-5" />, text: "Dedicated Property Expert" },
        { icon: <TrendingUp className="w-5 h-5" />, text: "Expert Negotiates Best Price" }
      ],
      [
        { icon: <Clock className="w-5 h-5" />, text: "45 Days Plan Validity" },
        { icon: <Home className="w-5 h-5" />, text: "Unlimited Property Contacts" },
        { icon: <UserCheck className="w-5 h-5" />, text: "Premium Legal Consultation" },
        { icon: <FileText className="w-5 h-5" />, text: "Priority Loan Assistance" },
        { icon: <Users className="w-5 h-5" />, text: "Personal Property Advisor" },
        { icon: <TrendingUp className="w-5 h-5" />, text: "Expert Handles Everything" },
        { icon: <Globe className="w-5 h-5" />, text: "Premium Visit Scheduling" },
        { icon: <Shield className="w-5 h-5" />, text: "VIP Customer Support" }
      ]
    ],
    commercial: [
      [
        { icon: <Clock className="w-5 h-5" />, text: "45 Days Plan Validity" },
        { icon: <Home className="w-5 h-5" />, text: "View up to 30 Commercial Properties" },
        { icon: <UserCheck className="w-5 h-5" />, text: "Commercial Legal Consultation" },
        { icon: <FileText className="w-5 h-5" />, text: "Business Loan Assistance" }
      ],
      [
        { icon: <Clock className="w-5 h-5" />, text: "45 Days Plan Validity" },
        { icon: <Home className="w-5 h-5" />, text: "View up to 75 Commercial Properties" },
        { icon: <UserCheck className="w-5 h-5" />, text: "Expert Commercial Advisor" },
        { icon: <FileText className="w-5 h-5" />, text: "Priority Business Financing" },
        { icon: <Users className="w-5 h-5" />, text: "Commercial Property Specialist" },
        { icon: <TrendingUp className="w-5 h-5" />, text: "Business Deal Negotiation" }
      ],
      [
        { icon: <Clock className="w-5 h-5" />, text: "45 Days Plan Validity" },
        { icon: <Home className="w-5 h-5" />, text: "Unlimited Commercial Access" },
        { icon: <UserCheck className="w-5 h-5" />, text: "Dedicated Commercial Manager" },
        { icon: <FileText className="w-5 h-5" />, text: "Complete Business Setup Support" },
        { icon: <Users className="w-5 h-5" />, text: "Executive Property Consultant" },
        { icon: <TrendingUp className="w-5 h-5" />, text: "Premium Deal Closure" },
        { icon: <Shield className="w-5 h-5" />, text: "24/7 Business Support" }
      ]
    ],
    industrial: [
      [
        { icon: <Clock className="w-5 h-5" />, text: "45 Days Plan Validity" },
        { icon: <Home className="w-5 h-5" />, text: "View up to 20 Industrial Properties" },
        { icon: <UserCheck className="w-5 h-5" />, text: "Industrial Legal Support" },
        { icon: <FileText className="w-5 h-5" />, text: "Industrial Loan Guidance" }
      ],
      [
        { icon: <Clock className="w-5 h-5" />, text: "45 Days Plan Validity" },
        { icon: <Home className="w-5 h-5" />, text: "View up to 50 Industrial Properties" },
        { icon: <UserCheck className="w-5 h-5" />, text: "Industrial Property Expert" },
        { icon: <FileText className="w-5 h-5" />, text: "Compliance Documentation" },
        { icon: <Users className="w-5 h-5" />, text: "Industrial Specialist" },
        { icon: <Shield className="w-5 h-5" />, text: "Regulatory Assistance" }
      ],
      [
        { icon: <Clock className="w-5 h-5" />, text: "45 Days Plan Validity" },
        { icon: <Home className="w-5 h-5" />, text: "Unlimited Industrial Access" },
        { icon: <UserCheck className="w-5 h-5" />, text: "Senior Industrial Consultant" },
        { icon: <FileText className="w-5 h-5" />, text: "Complete Regulatory Support" },
        { icon: <Users className="w-5 h-5" />, text: "Executive Industrial Advisor" },
        { icon: <Shield className="w-5 h-5" />, text: "Priority Industrial Support" },
        { icon: <TrendingUp className="w-5 h-5" />, text: "Custom Industrial Solutions" }
      ]
    ],
    agricultural: [
      [
        { icon: <Clock className="w-5 h-5" />, text: "45 Days Plan Validity" },
        { icon: <Home className="w-5 h-5" />, text: "View up to 25 Agricultural Properties" },
        { icon: <UserCheck className="w-5 h-5" />, text: "Agricultural Legal Guidance" },
        { icon: <FileText className="w-5 h-5" />, text: "Farm Loan Assistance" }
      ],
      [
        { icon: <Clock className="w-5 h-5" />, text: "45 Days Plan Validity" },
        { icon: <Home className="w-5 h-5" />, text: "View up to 60 Agricultural Properties" },
        { icon: <UserCheck className="w-5 h-5" />, text: "Agricultural Specialist" },
        { icon: <FileText className="w-5 h-5" />, text: "Crop Planning Support" },
        { icon: <Users className="w-5 h-5" />, text: "Farm Development Advisor" },
        { icon: <Shield className="w-5 h-5" />, text: "Soil Quality Assessment" }
      ],
      [
        { icon: <Clock className="w-5 h-5" />, text: "45 Days Plan Validity" },
        { icon: <Home className="w-5 h-5" />, text: "Unlimited Agricultural Access" },
        { icon: <UserCheck className="w-5 h-5" />, text: "Senior Agricultural Consultant" },
        { icon: <FileText className="w-5 h-5" />, text: "Complete Farm Planning" },
        { icon: <Users className="w-5 h-5" />, text: "Executive Farm Advisor" },
        { icon: <Shield className="w-5 h-5" />, text: "Comprehensive Farm Support" },
        { icon: <TrendingUp className="w-5 h-5" />, text: "Agricultural Technology Integration" }
      ]
    ]
  };
  const howItWorks = [
    { 
      title: "We gather your requirements", 
      icon: ClipboardList,
      description: "Tell us your preferences, budget, and location",
      color: "from-blue-500 to-blue-600"
    },
    { 
      title: "Connect you with verified listings", 
      icon: Search,
      description: "Get matched with authentic property listings",
      color: "from-green-500 to-green-600"
    },
    { 
      title: "Schedule property visits", 
      icon: Calendar,
      description: "Book site visits at your convenience",
      color: "from-purple-500 to-purple-600"
    },
    { 
      title: "Help you negotiate price", 
      icon: Handshake,
      description: "Expert assistance in getting the best deal",
      color: "from-orange-500 to-orange-600"
    },
    { 
      title: "Assist in finalizing the deal", 
      icon: FileCheck,
      description: "Complete documentation and legal support",
      color: "from-red-500 to-red-600"
    },
    { 
      title: "Provide city-level property expertise", 
      icon: MapPin,
      description: "Local insights and market knowledge",
      color: "from-indigo-500 to-indigo-600"
    }
  ];
  const faqs = [{
    question: "What does a Property Expert do?",
    answer: "Helps you shortlist, schedule visits, negotiate pricing, and close deals faster."
  }, {
    question: "How does Property Expert/Power Plan compare?",
    answer: "Power is basic assistance. Expert Plans come with dedicated support and more features."
  }, {
    question: "What if I don't find a house after subscribing?",
    answer: "With the MoneyBack Plan, you are eligible for a full refund if we don't deliver."
  }, {
    question: "How soon will I get a house?",
    answer: "Most users find a property within a few days to 2 weeks, depending on availability."
  }, {
    question: "Are there hidden charges?",
    answer: "No. The plans are 100% transparent. You pay only what's shown — currently ₹0."
  }, {
    question: "Can I pay for the plan after I find a house?",
    answer: "For now, it's FREE. Later pricing models may change."
  }];
  return (
    <div className={embedded ? "" : "min-h-screen bg-background"}>
      {!embedded && <Marquee />}
      {!embedded && <Header />}
      
      {/* Hero Section */}
      {!embedded && (
      <section 
        className="relative text-white py-16 px-4 pt-28 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('/lovable-uploads/65ce32d0-061c-4934-8723-62372be4cd91.png')`
        }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-6">
            Choose a Buyer Plan and <span className="text-yellow-400">GET EXPERT</span> Guidance
          </h1>

          <p className="text-lg md:text-xl mb-6 max-w-3xl mx-auto">
            Trusted by 3 Lakh+ Buyers like you. Choose the plan that suits you 
          </p>
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="flex">
              {[1, 2, 3, 4, 5].map(star => <Star key={star} className="w-5 h-5 fill-yellow-400 text-yellow-400" />)}
            </div>
            <span className="ml-2"> 5 Stars Rated</span>
          </div>
          
         
        </div>
      </section>
      )}

      {/* Buyer Plans with Tabs */}
      <section className={embedded ? "py-8 px-4 bg-gray-50" : "py-16 px-4 bg-gray-50"}>
        <div className="max-w-6xl mx-auto">
          <div className={embedded ? "text-center mb-6" : "text-center mb-12"}>
            <h2 className={embedded ? "text-2xl md:text-3xl font-bold text-foreground mb-2" : "text-3xl md:text-4xl font-bold text-foreground mb-4"}>
              Buyer Plans
            </h2>
            <p className={embedded ? "text-sm text-muted-foreground" : "text-lg text-muted-foreground"}>Select the category that best fits your property search needs</p>
          </div>

          <Tabs defaultValue={(new URLSearchParams(window.location.search).get('category') as 'residential'|'commercial'|'industrial'|'agricultural') || 'residential'} className="w-full">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 mb-8 p-1 gap-1 bg-muted rounded-lg h-auto">
              <TabsTrigger value="residential" className="text-xs sm:text-sm md:text-base py-2 sm:py-3 px-2 sm:px-4 data-[state=active]:bg-background data-[state=active]:text-foreground whitespace-nowrap">Residential</TabsTrigger>
              <TabsTrigger value="commercial" className="text-xs sm:text-sm md:text-base py-2 sm:py-3 px-2 sm:px-4 data-[state=active]:bg-background data-[state=active]:text-foreground whitespace-nowrap">Commercial</TabsTrigger>
              <TabsTrigger value="industrial" className="text-xs sm:text-sm md:text-base py-2 sm:py-3 px-2 sm:px-4 data-[state=active]:bg-background data-[state=active]:text-foreground whitespace-nowrap">Industrial</TabsTrigger>
              <TabsTrigger value="agricultural" className="text-xs sm:text-sm md:text-base py-2 sm:py-3 px-2 sm:px-4 data-[state=active]:bg-background data-[state=active]:text-foreground whitespace-nowrap">Agricultural</TabsTrigger>
            </TabsList>

            {Object.entries(tabPlans).map(([tabKey, plans]) => (
              <TabsContent key={tabKey} value={tabKey} className="space-y-8">
                {/* Plan Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {plans.map((plan, index) => (
                    <Card 
                      key={index} 
                      className={`relative cursor-pointer transition-all duration-200 ${
                        selectedPlans[tabKey as keyof typeof selectedPlans] === index ? 'ring-2 ring-brand-red bg-muted' : 'bg-card hover:shadow-md'
                      }`}
                      onClick={() => setSelectedPlans(prev => ({ ...prev, [tabKey]: index }))}
                    >
                      <div className="absolute top-3 left-3 right-3">
                        <Badge className={`${plan.badgeColor} text-white text-xs px-2 py-1 font-medium w-full text-center`}>
                          {plan.badge}
                        </Badge>
                      </div>
                      
                      <CardContent className="pt-16 pb-6 px-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-3">{plan.name}</h3>
                        <div className="mb-6">
                          {plan.isFree ? (
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="text-lg text-gray-400 line-through">{plan.originalPrice}</span>
                                <span className="text-2xl font-bold text-green-600">{plan.freePrice}</span>
                              </div>
                            </div>
                          ) : (
                            <div className="space-y-1">
                              <div className="text-2xl font-bold text-gray-900">{plan.price}</div>
                              <GSTDisplay basePriceInPaise={plan.amountPaise} />
                            </div>
                          )}
                        </div>
                        
                        {plan.isFree ? (
                          <Button 
                            className={`w-full ${
                              selectedPlans[tabKey as keyof typeof selectedPlans] === index 
                                ? 'bg-[#800000] hover:bg-[#700000] text-white' 
                                : 'bg-transparent text-foreground border border-border hover:bg-muted'
                            }`}
                            onClick={() => {
                              // Record the free subscription in the database
                              const recordFreePlan = async () => {
                                try {
                                  const { data: { user } } = await supabase.auth.getUser();
                                  
                                  if (!user) {
                                    // Redirect to auth page if not logged in
                                    window.location.href = '/auth?redirect=plans';
                                    return;
                                  }
                                  
                                  // Calculate current and expiry date
                                  const currentDate = new Date();
                                  const expiryDate = new Date();
                                  expiryDate.setDate(expiryDate.getDate() + 45); // Free plans valid for 45 days
                                  
                                  // Create a random payment ID for free plans
                                  const freePaymentId = `free_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
                                  const invoiceNumber = `INV-FREE-${Date.now()}`;
                                  
                                  // Record the free subscription in payments table
                                  await supabase.from('payments').insert({
                                    user_id: user.id,
                                    payment_id: freePaymentId,
                                    plan_name: `Buyer — ${plan.name} (Free)`,
                                    amount_paise: 0,
                                    amount_rupees: 0,
                                    currency: 'AED',
                                    status: 'success',
                                    payment_method: 'free',
                                    payment_date: currentDate.toISOString(),
                                    invoice_number: invoiceNumber,
                                    plan_type: 'subscription',
                                    plan_duration: '45 days',
                                    expires_at: expiryDate.toISOString(),
                                    metadata: {
                                      notes: { plan: plan.name, category: "buyer", type: tabKey, isFree: true }
                                    }
                                  });
                                  
                                  // Redirect to success page
                                  window.location.href = `/payment/success?payment_id=${freePaymentId}`;
                                } catch (error) {
                                  console.error('Error recording free plan:', error);
                                  // Redirect to success page anyway for better UX
                                  window.location.href = '/payment/success';
                                }
                              };
                              
                              recordFreePlan();
                            }}
                          >
                            Subscribe - FREE
                          </Button>
                        ) : (
                          <PayButton
                            label="Subscribe"
                            planName={`Buyer — ${plan.name}`}
                            amountPaise={calculateTotalWithGST(plan.amountPaise)}
                            notes={{ plan: plan.name, category: "buyer", type: tabKey }}
                            className={`w-full ${
                              selectedPlans[tabKey as keyof typeof selectedPlans] === index 
                                ? 'bg-[#800000] hover:bg-[#700000] text-white' 
                                : 'bg-transparent text-foreground border border-border hover:bg-muted'
                            }`}
                          />
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Plan Details */}
                <div className={`rounded-lg p-8 shadow-sm ${plans[selectedPlans[tabKey as keyof typeof selectedPlans]].badgeColor} bg-opacity-10 border border-opacity-20`} style={{
                  borderColor: plans[selectedPlans[tabKey as keyof typeof selectedPlans]].badgeColor.replace('bg-', ''),
                  backgroundColor: plans[selectedPlans[tabKey as keyof typeof selectedPlans]].badgeColor.replace('bg-', '') + '20'
                }}>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {tabPlanDetails[tabKey as keyof typeof tabPlanDetails][selectedPlans[tabKey as keyof typeof selectedPlans]].map((detail, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="text-brand-red mt-1">
                          {detail.icon}
                        </div>
                        <span className="text-sm text-foreground leading-relaxed">
                          {detail.text}
                        </span>
                      </div>
                    ))}
                  </div>
                  
                  {/* Contact Info inside features section */}
                  <div className="mt-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      {/* Phone number - center aligned */}
                      <div className="text-center sm:text-center sm:flex-1">
                        <span className="text-gray-600">For assistance call us at: </span>
                        <a 
                          href="tel:+918074017388" 
                          className="text-brand-red font-semibold text-base hover:text-brand-red-dark transition-colors cursor-pointer"
                        >
                          +91 80740 17388
                        </a>
                      </div>
                      
                      {/* Terms & Conditions - right aligned */}
                      <div className="text-right">
                        <Dialog open={isTermsModalOpen} onOpenChange={setIsTermsModalOpen}>
                          <DialogTrigger asChild>
                            <span className="text-sm text-gray-500 underline cursor-pointer hover:text-gray-700">
                              Terms & Conditions Apply
                            </span>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle className="text-xl font-bold border-b pb-2">Terms and Conditions</DialogTitle>
                            </DialogHeader>
                            <div className="mt-4 space-y-6">
                              <div className="space-y-4">
                                <h3 className="font-semibold text-lg text-brand-red">Order Summary:</h3>
                                <p className="text-sm leading-relaxed">
                                  Ensure your Order ID, User Name, Plan, and Total Payable are correct before proceeding with payment.
                                </p>
                              </div>

                              <div className="space-y-4">
                                <h3 className="font-semibold text-lg text-brand-red">Accepted Payment Methods:</h3>
                                <p className="text-sm leading-relaxed">
                                  Payments can be made using UPI (Google Pay, PhonePe, Paytm), Credit/Debit Cards, Net Banking, and Wallets.
                                </p>
                              </div>

                              <div className="space-y-4">
                                <h3 className="font-semibold text-lg text-brand-red">Payment Process:</h3>
                                <ul className="space-y-2 text-sm leading-relaxed">
                                  <li className="flex items-start gap-2">
                                    <span className="text-brand-red mt-1">•</span>
                                    <span>Click Proceed to Pay, verify the details, select your payment method, and complete authentication.</span>
                                  </li>
                                  <li className="flex items-start gap-2">
                                    <span className="text-brand-red mt-1">•</span>
                                    <span>Wait for automatic redirection and confirmation.</span>
                                  </li>
                                </ul>
                              </div>

                              <div className="space-y-4">
                                <h3 className="font-semibold text-lg text-brand-red">GST Invoices:</h3>
                                <ul className="space-y-2 text-sm leading-relaxed">
                                  <li className="flex items-start gap-2">
                                    <span className="text-brand-red mt-1">•</span>
                                    <span>All successful payments will receive a GST-compliant invoice.</span>
                                  </li>
                                  <li className="flex items-start gap-2">
                                    <span className="text-brand-red mt-1">•</span>
                                    <span>Provide your GSTIN (if applicable) before payment.</span>
                                  </li>
                                </ul>
                              </div>

                              <div className="space-y-4">
                                <h3 className="font-semibold text-lg text-brand-red">Subscription Auto-Renewal:</h3>
                                <p className="text-sm leading-relaxed">
                                  Subscriptions may auto-renew at the end of the billing cycle. You can cancel auto-renewal anytime from your account settings.
                                </p>
                              </div>

                              <div className="space-y-4">
                                <h3 className="font-semibold text-lg text-brand-red">Refunds & Cancellations:</h3>
                                <ul className="space-y-2 text-sm leading-relaxed">
                                  <li className="flex items-start gap-2">
                                    <span className="text-brand-red mt-1">•</span>
                                    <span>No refunds unless there's a duplicate payment or failed activation. Requests must be submitted within 7 days of the issue.</span>
                                  </li>
                                  <li className="flex items-start gap-2">
                                    <span className="text-brand-red mt-1">•</span>
                                    <span>Submit refund requests to <a href="mailto:support@homehni.com" className="text-brand-red underline hover:text-brand-red-dark">support@homehni.com</a> with proof of payment.</span>
                                  </li>
                                </ul>
                              </div>

                              <div className="space-y-4">
                                <h3 className="font-semibold text-lg text-brand-red">Security & Fraud Protection:</h3>
                                <p className="text-sm leading-relaxed">
                                  Payments are processed via secure, PCI-DSS compliant gateways. Do not share your OTP, CVV, or passwords via email or calls.
                                </p>
                              </div>

                              <div className="space-y-4">
                                <h3 className="font-semibold text-lg text-brand-red">Payment Failures:</h3>
                                <p className="text-sm leading-relaxed">
                                  In case of payment failure, allow up to 2 hours for reconciliation. Contact your bank if the payment is not reversed in 3-5 business days.
                                </p>
                              </div>

                              <div className="space-y-4">
                                <h3 className="font-semibold text-lg text-brand-red">Customer Support:</h3>
                                <p className="text-sm leading-relaxed">
                                  For issues, contact <a href="mailto:support@homehni.com" className="text-brand-red underline hover:text-brand-red-dark">support@homehni.com</a> or call the customer support number.
                                </p>
                              </div>
                              
                              <div className="mt-6 pt-4 border-t text-center">
                                <a 
                                  href="/terms-and-conditions" 
                                  className="text-brand-red underline hover:text-brand-red-dark cursor-pointer"
                                >
                                  Click here for detailed Terms & Conditions
                                </a>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>

        </div>
      </section>

      {/* Disclaimer Banner */}
      

      {/* How Our Assisted Plans Work */}
      <section className={embedded ? "py-8 px-4 bg-gradient-to-br from-gray-50 via-white to-gray-50" : "py-16 px-4 bg-gradient-to-br from-gray-50 via-white to-gray-50"}>
        <div className="max-w-6xl mx-auto">
          <div className={embedded ? "text-center mb-6" : "text-center mb-12"}>
            <div className="inline-flex items-center justify-center mb-4">
              <Sparkles className="w-8 h-8 text-[#800000] mr-2" />
              <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#800000] to-[#700000] bg-clip-text text-transparent">
                Say Hello to Your House-Hunt Assistant
              </h2>
              <Sparkles className="w-8 h-8 text-[#800000] ml-2" />
            </div>
            <p className="text-lg md:text-xl text-muted-foreground">Here's how we help you find your dream home</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {howItWorks.map((step, index) => {
              const IconComponent = step.icon;
              return (
                <Card key={index} className="group relative overflow-hidden border-2 border-transparent hover:border-[#800000]/30 transition-all duration-300 hover:shadow-xl bg-white hover:-translate-y-2">
                  <CardContent className="p-6 md:p-8">
                    {/* Step Number Badge */}
                    <div className="absolute top-4 right-4 w-10 h-10 bg-gradient-to-br from-[#800000]/10 to-[#700000]/10 text-[#800000] rounded-full flex items-center justify-center text-sm font-bold border-2 border-[#800000]/20">
                      {index + 1}
                    </div>
                    
                    {/* Icon Container */}
                    <div className="relative mb-4 flex justify-center">
                      <div className={`w-14 h-14 mx-auto bg-gradient-to-br ${step.color} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 relative`}>
                        <IconComponent className="w-7 h-7 text-white" />
                        {/* Decorative glow effect */}
                        <div className="absolute inset-0 bg-white/20 rounded-xl blur-lg group-hover:blur-xl transition-all duration-300"></div>
                      </div>
                      {/* Decorative circles */}
                      <div className={`absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br ${step.color} rounded-full blur-sm opacity-30 group-hover:opacity-50 transition-opacity`}></div>
                      <div className={`absolute -bottom-1 -left-1 w-3 h-3 bg-gradient-to-br ${step.color} rounded-full blur-sm opacity-30 group-hover:opacity-50 transition-opacity`}></div>
                    </div>
                    
                    {/* Content */}
                    <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-3 group-hover:text-[#800000] transition-colors text-center">
                      {step.title}
                    </h3>
                    <p className="text-sm md:text-base text-gray-600 leading-relaxed text-center">
                      {step.description}
                    </p>
                    
                    {/* Connecting Arrow (for visual flow) */}
                    {index < howItWorks.length - 1 && (
                      <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-[#800000]/30 to-transparent z-10">
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-0 h-0 border-l-4 border-l-[#800000]/30 border-t-2 border-t-transparent border-b-2 border-b-transparent"></div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent>
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>)}
          </Accordion>
        </div>
      </section>

      {/* Final CTA */}
      {/* <section className="py-16 px-4 gradient-red-maroon text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Let's Find You the Perfect Home — With Professional Service!
          </h2>
          <Button className="bg白 text-brand-red hover:bg-gray-100 text-lg px-8 py-3">
            Start Your Free Plan
          </Button>
        </div>
      </section> */}

      {!embedded && <Footer />}
    </div>
  );
};
export default BuyerPlans;

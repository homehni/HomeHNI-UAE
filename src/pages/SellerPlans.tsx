import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import PayButton from '@/components/PayButton';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Star, Phone, Camera, Shield, Users, Megaphone, UserCheck, Zap, CheckCircle, Clock, Globe, Lock, FileText, TrendingUp } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Marquee from "@/components/Marquee";
import { Link } from "react-router-dom";
import GSTDisplay from '@/components/GSTDisplay';
import { calculateTotalWithGST } from '@/utils/gstCalculator';

interface SellerPlansProps { embedded?: boolean }
const SellerPlans: React.FC<SellerPlansProps> = ({ embedded }) => {
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
        price: "₹999",
        originalPrice: "₹999",
        freePrice: "FREE",
        gst: "+18% GST",
        badge: "BASIC PROMOTION",
        badgeColor: "bg-yellow-500",
        amountPaise: 99900,
        isFree: true,
      },
      {
        name: "Gold Plan", 
        price: "₹9,999",
        gst: "+18% GST",
        badge: "SOCIAL BOOST",
        badgeColor: "bg-green-500",
        amountPaise: 999900,
      },
      {
        name: "Platinum Plan",
        price: "₹14,999",
        gst: "+18% GST", 
        badge: "EXPERT GUIDANCE",
        badgeColor: "bg-red-500",
        amountPaise: 1499900,
      },
      {
        name: "Diamond Plan",
        price: "₹20,000",
        gst: "+18% GST",
        badge: "PERSONAL FIELD ASSISTANT", 
        badgeColor: "bg-purple-500",
        amountPaise: 2000000,
      }
    ],
    commercial: [
      {
        name: "Business Silver",
        price: "₹999",
        originalPrice: "₹999",
        freePrice: "FREE",
        gst: "+18% GST",
        badge: "COMMERCIAL MARKETING",
        badgeColor: "bg-blue-500",
        amountPaise: 99900,
        isFree: true,
      },
      {
        name: "Business Gold", 
        price: "₹18,999",
        gst: "+18% GST",
        badge: "PREMIUM BUSINESS BOOST",
        badgeColor: "bg-indigo-500",
        amountPaise: 1899900,
      },
      {
        name: "Business Platinum",
        price: "₹25,999",
        gst: "+18% GST", 
        badge: "BUSINESS EXPERT",
        badgeColor: "bg-purple-600",
        amountPaise: 2599900,
      }
    ],
    industrial: [
      {
        name: "Industrial Basic",
        price: "₹999",
        originalPrice: "₹999",
        freePrice: "FREE",
        gst: "+18% GST",
        badge: "INDUSTRIAL PROMOTION",
        badgeColor: "bg-gray-600",
        isFree: true,
      },
      {
        name: "Industrial Pro", 
        price: "₹28,999",
        gst: "+18% GST",
        badge: "ENTERPRISE MARKETING",
        badgeColor: "bg-slate-700",
      },
      {
        name: "Industrial Elite",
        price: "₹45,999",
        gst: "+18% GST", 
        badge: "INDUSTRIAL EXPERT",
        badgeColor: "bg-zinc-800",
      }
    ],
    agricultural: [
      {
        name: "Farm Silver",
        price: "₹999",
        originalPrice: "₹999",
        freePrice: "FREE",
        gst: "+18% GST",
        badge: "FARM MARKETING",
        badgeColor: "bg-green-600",
        isFree: true,
      },
      {
        name: "Farm Gold", 
        price: "₹14,999",
        gst: "+18% GST",
        badge: "AGRICULTURAL BOOST",
        badgeColor: "bg-emerald-600",
      },
      {
        name: "Farm Platinum",
        price: "₹22,999",
        gst: "+18% GST", 
        badge: "FARM EXPERT",
        badgeColor: "bg-teal-600",
      }
    ]
  };

  const tabPlanDetails = {
    residential: [
      [
        { icon: <Clock className="w-5 h-5" />, text: "90 Days Plan Validity" },
        { icon: <UserCheck className="w-5 h-5" />, text: "Relationship Manager (RM)- Super Fast Closure" },
        { icon: <FileText className="w-5 h-5" />, text: "Sale Agreement Support" }
      ],
      [
        { icon: <Clock className="w-5 h-5" />, text: "90 Days Plan Validity" },
        { icon: <UserCheck className="w-5 h-5" />, text: "Relationship Manager (RM)- Super Fast Closure" },
        { icon: <FileText className="w-5 h-5" />, text: "Sale Agreement Support" },
        { icon: <TrendingUp className="w-5 h-5" />, text: "Top Slot Listing For 5x More Visibility" },
        { icon: <Globe className="w-5 h-5" />, text: "Property Promotion On Website" },
        { icon: <Megaphone className="w-5 h-5" />, text: "Social Media Marketing" }
      ],
      [
        { icon: <Clock className="w-5 h-5" />, text: "120 Days Plan Validity" },
        { icon: <UserCheck className="w-5 h-5" />, text: "Dedicated Relationship Manager" },
        { icon: <FileText className="w-5 h-5" />, text: "Premium Sale Agreement Support" },
        { icon: <TrendingUp className="w-5 h-5" />, text: "Featured Listing Priority" },
        { icon: <Globe className="w-5 h-5" />, text: "Multi-Platform Marketing" },
        { icon: <Megaphone className="w-5 h-5" />, text: "Premium Social Media Campaign" },
        { icon: <Lock className="w-5 h-5" />, text: "Privacy Protection" }
      ],
      [
        { icon: <Clock className="w-5 h-5" />, text: "150 Days Plan Validity" },
        { icon: <UserCheck className="w-5 h-5" />, text: "Personal Field Assistant" },
        { icon: <FileText className="w-5 h-5" />, text: "Complete Legal Documentation" },
        { icon: <TrendingUp className="w-5 h-5" />, text: "Premium Slot Guarantee" },
        { icon: <Globe className="w-5 h-5" />, text: "360° Marketing Campaign" },
        { icon: <Megaphone className="w-5 h-5" />, text: "Expert Marketing Strategy" },
        { icon: <Camera className="w-5 h-5" />, text: "Professional Photography" },
        { icon: <Shield className="w-5 h-5" />, text: "VIP Customer Support" }
      ]
    ],
    commercial: [
      [
        { icon: <Clock className="w-5 h-5" />, text: "120 Days Plan Validity" },
        { icon: <UserCheck className="w-5 h-5" />, text: "Commercial Property Expert" },
        { icon: <FileText className="w-5 h-5" />, text: "Commercial Sale Documentation" },
        { icon: <TrendingUp className="w-5 h-5" />, text: "Business Listing Priority" }
      ],
      [
        { icon: <Clock className="w-5 h-5" />, text: "150 Days Plan Validity" },
        { icon: <UserCheck className="w-5 h-5" />, text: "Dedicated Commercial Manager" },
        { icon: <FileText className="w-5 h-5" />, text: "Complete Commercial Legal Support" },
        { icon: <TrendingUp className="w-5 h-5" />, text: "Premium Business Exposure" },
        { icon: <Globe className="w-5 h-5" />, text: "Multi-Channel Business Marketing" },
        { icon: <Megaphone className="w-5 h-5" />, text: "Corporate Social Media Strategy" }
      ],
      [
        { icon: <Clock className="w-5 h-5" />, text: "180 Days Plan Validity" },
        { icon: <UserCheck className="w-5 h-5" />, text: "Executive Business Consultant" },
        { icon: <FileText className="w-5 h-5" />, text: "Enterprise Documentation Suite" },
        { icon: <TrendingUp className="w-5 h-5" />, text: "Exclusive Business Promotion" },
        { icon: <Globe className="w-5 h-5" />, text: "Corporate Marketing Network" },
        { icon: <Megaphone className="w-5 h-5" />, text: "Premium Business Campaign" },
        { icon: <Shield className="w-5 h-5" />, text: "Priority Business Support" }
      ]
    ],
    industrial: [
      [
        { icon: <Clock className="w-5 h-5" />, text: "150 Days Plan Validity" },
        { icon: <UserCheck className="w-5 h-5" />, text: "Industrial Property Specialist" },
        { icon: <FileText className="w-5 h-5" />, text: "Industrial Sale Documentation" },
        { icon: <TrendingUp className="w-5 h-5" />, text: "Industrial Network Exposure" }
      ],
      [
        { icon: <Clock className="w-5 h-5" />, text: "180 Days Plan Validity" },
        { icon: <UserCheck className="w-5 h-5" />, text: "Senior Industrial Advisor" },
        { icon: <FileText className="w-5 h-5" />, text: "Complete Industrial Legal Support" },
        { icon: <TrendingUp className="w-5 h-5" />, text: "Enterprise-Grade Marketing" },
        { icon: <Globe className="w-5 h-5" />, text: "Industrial Portal Network" },
        { icon: <Shield className="w-5 h-5" />, text: "Compliance Verification Support" }
      ],
      [
        { icon: <Clock className="w-5 h-5" />, text: "240 Days Plan Validity" },
        { icon: <UserCheck className="w-5 h-5" />, text: "Executive Industrial Consultant" },
        { icon: <FileText className="w-5 h-5" />, text: "Complete Regulatory Documentation" },
        { icon: <TrendingUp className="w-5 h-5" />, text: "Custom Industrial Marketing" },
        { icon: <Globe className="w-5 h-5" />, text: "Global Industrial Network" },
        { icon: <Megaphone className="w-5 h-5" />, text: "Specialized Industrial Campaign" },
        { icon: <Shield className="w-5 h-5" />, text: "24/7 Enterprise Support" }
      ]
    ],
    agricultural: [
      [
        { icon: <Clock className="w-5 h-5" />, text: "120 Days Plan Validity" },
        { icon: <UserCheck className="w-5 h-5" />, text: "Agricultural Land Expert" },
        { icon: <FileText className="w-5 h-5" />, text: "Farm Sale Documentation" },
        { icon: <TrendingUp className="w-5 h-5" />, text: "Farming Community Reach" }
      ],
      [
        { icon: <Clock className="w-5 h-5" />, text: "150 Days Plan Validity" },
        { icon: <UserCheck className="w-5 h-5" />, text: "Agricultural Marketing Specialist" },
        { icon: <FileText className="w-5 h-5" />, text: "Complete Farm Documentation" },
        { icon: <TrendingUp className="w-5 h-5" />, text: "Agricultural Network Marketing" },
        { icon: <Globe className="w-5 h-5" />, text: "Farming Portal Network" },
        { icon: <Megaphone className="w-5 h-5" />, text: "Agricultural Social Media" }
      ],
      [
        { icon: <Clock className="w-5 h-5" />, text: "180 Days Plan Validity" },
        { icon: <UserCheck className="w-5 h-5" />, text: "Senior Agricultural Consultant" },
        { icon: <FileText className="w-5 h-5" />, text: "Premium Farm Documentation" },
        { icon: <TrendingUp className="w-5 h-5" />, text: "Premium Agricultural Marketing" },
        { icon: <Globe className="w-5 h-5" />, text: "National Farming Network" },
        { icon: <Megaphone className="w-5 h-5" />, text: "Expert Agricultural Campaign" },
        { icon: <Shield className="w-5 h-5" />, text: "Comprehensive Farm Support" }
      ]
    ]
  };
  const faqs = [{
    question: "What will the Relationship Manager do?",
    answer: "Help you schedule visits, follow up with buyers, and assist with negotiations and closing."
  }, {
    question: "What happens with social media marketing?",
    answer: "Your property gets promoted on platforms like Facebook for better reach."
  }, {
    question: "How is the property promoted?",
    answer: "Through top-listing slots, featured placements, and paid marketing."
  }, {
    question: "Are there any hidden charges?",
    answer: "None. All charges are transparent."
  }, {
    question: "How do I get faster closures?",
    answer: "Subscribe to higher plans with RM & field assistance for quicker results."
  }];
  const workSteps = [{
    icon: <Users className="w-8 h-8" />,
    title: "LOOKING FOR A BUYER?",
    description: "Get verified buyer leads through any one of our assisted plans."
  }, {
    icon: <UserCheck className="w-8 h-8" />,
    title: "THE HELPING HAND",
    description: "A dedicated Relationship Manager to guide and support you."
  }, {
    icon: <Megaphone className="w-8 h-8" />,
    title: "MARKETING & PROMOTION",
    description: "Boost your visibility on listings and via social media promotion."
  }, {
    icon: <Shield className="w-8 h-8" />,
    title: "FREEDOM FROM BOGUS CALLS",
    description: "Your RM handles all incoming calls and filters real buyers."
  }, {
    icon: <CheckCircle className="w-8 h-8" />,
    title: "FILTER QUALIFIED BUYERS",
    description: "Only serious, qualified leads are forwarded to you."
  }, {
    icon: <Zap className="w-8 h-8" />,
    title: "FASTER CLOSURE",
    description: "Sell your property quickly at a fractional cost."
  }];
  return (
    <div className={embedded ? "" : "min-h-screen bg-background"}>
      {!embedded && <Marquee />}
      {!embedded && <Header />}
      
      {/* Hero Section */}
    {!embedded && (
    <section 
      className="py-20 md:py-28 relative bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('/lovable-uploads/b29385fc-1962-44ff-aab9-781b07f0458b.png')`
      }}
    >
  <div className="container mx-auto px-4 text-center max-w-4xl">
    <h1 className="text-3xl md:text-5xl font-bold text-white mb-6">
      Get Buyers Quickly. SAVE LAKHS on Brokerage
    </h1>

    <p className="text-lg md:text-xl mb-6 max-w-3xl mx-auto text-white">
            Trusted by 3 Lakh+ property Seller like you. Choose the plan that suits you 
          </p>
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="flex">
              {[1, 2, 3, 4, 5].map(star => <Star key={star} className="w-5 h-5 fill-yellow-400 text-yellow-400" />)}
            </div>
            <span className="ml-2 text-white">Rated 5 Stars by Sellers</span>
          </div>
  </div>
</section>
)}




      {/* Seller Plans with Tabs */}
      <section className={embedded ? "py-8 px-4 bg-gray-50" : "py-16 px-4 bg-gray-50"}>
        <div className="max-w-6xl mx-auto">
          <div className={embedded ? "text-center mb-6" : "text-center mb-12"}>
            <h2 className={embedded ? "text-2xl md:text-3xl font-bold text-foreground mb-2" : "text-3xl md:text-4xl font-bold text-foreground mb-4"}>
              Seller Plans
            </h2>
            <p className={embedded ? "text-sm text-muted-foreground" : "text-lg text-muted-foreground"}>Select the category that best fits your property selling needs</p>
          </div>

          <Tabs defaultValue="residential" className="w-full">
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
                                ? 'bg-brand-red hover:bg-brand-maroon-dark text-white' 
                                : 'bg-transparent text-foreground border border-border hover:bg-muted'
                            }`}
                          >
                            Get Started - FREE
                          </Button>
                        ) : (
                          <PayButton
                            label="Subscribe"
                            planName={`Seller — ${plan.name}`}
                            amountPaise={calculateTotalWithGST(plan.amountPaise || 0)}
                            notes={{ plan: plan.name, category: "seller", type: tabKey }}
                            className={`w-full ${
                              selectedPlans[tabKey as keyof typeof selectedPlans] === index 
                                ? 'bg-brand-red hover:bg-brand-maroon-dark text-white' 
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

      {/* Disclaimer */}
      

      {/* How It Works */}
      <section className={embedded ? "py-8 bg-background" : "py-16 bg-background"}>
        <div className="container mx-auto px-4">
          <div className={embedded ? "text-center mb-6" : "text-center mb-12"}>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              How Assisted Plans Work
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {workSteps.map((step, index) => <div key={index} className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    {step.icon}
                  </div>
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>)}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => <AccordionItem key={index} value={`item-${index}`} className="bg-card border rounded-lg px-6">
                  <AccordionTrigger className="text-left font-medium hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pt-2 pb-4">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>)}
            </Accordion>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      {/* <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Sell Your Property Fast and Hassle-Free?
          </h2>
          <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-white/90">
            Get Started Now
          </Button>
        </div>
      </section> */}

      {!embedded && <Footer />}
    </div>
  );
};
export default SellerPlans;
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, Check, Phone, Clock, Users, Shield, UserCheck, Globe, Camera, Lock, FileText, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Marquee from '@/components/Marquee';
import PayButton from '@/components/PayButton';

interface OwnerPlansProps { embedded?: boolean }
const OwnerPlans = ({ embedded }: OwnerPlansProps) => {
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
        name: "Silver",
        price: "₹100",
        originalPrice: "₹100",
        freePrice: "FREE",
        gst: "+18% GST",
        badge: "ON CALL ASSISTANCE",
        badgeColor: "bg-yellow-500",
        amountPaise: 10000,
        isFree: true,
      },
      {
        name: "Gold",
        price: "₹5,899", 
        gst: "+18% GST",
        badge: "HOUSE VISIT ASSISTANCE",
        badgeColor: "bg-green-500",
        amountPaise: 589900,
      },
      {
        name: "Platinum",
        price: "₹6,999",
        gst: "+18% GST", 
        badge: "EXPERT GUIDANCE",
        badgeColor: "bg-red-500",
        amountPaise: 699900,
      },
      {
        name: "Diamond",
        price: "₹10,999",
        gst: "+18% GST",
        badge: "PERSONAL FIELD ASSISTANT", 
        badgeColor: "bg-purple-500",
        amountPaise: 1099900,
      }
    ],
    commercial: [
      {
        name: "Business Basic",
        price: "₹999",
        originalPrice: "₹999",
        freePrice: "FREE",
        gst: "+18% GST",
        badge: "COMMERCIAL SUPPORT",
        badgeColor: "bg-blue-500",
        amountPaise: 99900,
        isFree: true,
      },
      {
        name: "Business Pro",
        price: "₹15,999", 
        gst: "+18% GST",
        badge: "PREMIUM MARKETING",
        badgeColor: "bg-indigo-500",
        amountPaise: 1599900,
      },
      {
        name: "Business Elite",
        price: "₹25,999",
        gst: "+18% GST", 
        badge: "DEDICATED MANAGER",
        badgeColor: "bg-purple-600",
        amountPaise: 2599900,
      }
    ],
    industrial: [
      {
        name: "Industrial Starter",
        price: "₹999",
        originalPrice: "₹999",
        freePrice: "FREE",
        gst: "+18% GST",
        badge: "INDUSTRIAL FOCUS",
        badgeColor: "bg-gray-600",
        amountPaise: 99900,
        isFree: true,
      },
      {
        name: "Industrial Growth",
        price: "₹22,999", 
        gst: "+18% GST",
        badge: "ENTERPRISE LEVEL",
        badgeColor: "bg-slate-700",
        amountPaise: 2299900,
      },
      {
        name: "Industrial Premium",
        price: "₹35,999",
        gst: "+18% GST", 
        badge: "CUSTOM SOLUTIONS",
        badgeColor: "bg-zinc-800",
        amountPaise: 3599900,
      }
    ],
    agricultural: [
      {
        name: "Farm Basic",
        price: "₹999",
        originalPrice: "₹999",
        freePrice: "FREE",
        gst: "+18% GST",
        badge: "AGRICULTURAL LAND",
        badgeColor: "bg-green-600",
        amountPaise: 99900,
        isFree: true,
      },
      {
        name: "Farm Pro",
        price: "₹8,999", 
        gst: "+18% GST",
        badge: "CROP ADVISORY",
        badgeColor: "bg-emerald-600",
        amountPaise: 899900,
      },
      {
        name: "Farm Premium",
        price: "₹15,999",
        gst: "+18% GST", 
        badge: "FULL FARM SUPPORT",
        badgeColor: "bg-teal-600",
        amountPaise: 1599900,
      }
    ]
  };

  const tabPlanDetails = {
    residential: [
      [
        { icon: <Clock className="w-5 h-5" />, text: "45 Days Plan Validity" },
        { icon: <UserCheck className="w-5 h-5" />, text: "Relationship Manager" },
        { icon: <FileText className="w-5 h-5" />, text: "Rental Agreement Home Delivered" }
      ],
      [
        { icon: <Clock className="w-5 h-5" />, text: "45 Days Plan Validity" },
        { icon: <UserCheck className="w-5 h-5" />, text: "Relationship Manager" },
        { icon: <FileText className="w-5 h-5" />, text: "Rental Agreement Home Delivered" },
        { icon: <TrendingUp className="w-5 h-5" />, text: "Top Slot Listing For 5x More Visibility" },
        { icon: <Globe className="w-5 h-5" />, text: "Property Promotion On Website" },
        { icon: <Camera className="w-5 h-5" />, text: "Photoshoot Of Your Property" }
      ],
      [
        { icon: <Clock className="w-5 h-5" />, text: "60 Days Plan Validity" },
        { icon: <UserCheck className="w-5 h-5" />, text: "Dedicated Relationship Manager" },
        { icon: <FileText className="w-5 h-5" />, text: "Premium Documentation Support" },
        { icon: <TrendingUp className="w-5 h-5" />, text: "Featured Listing Priority" },
        { icon: <Globe className="w-5 h-5" />, text: "Multi-Platform Marketing" },
        { icon: <Camera className="w-5 h-5" />, text: "Professional Photography" },
        { icon: <Lock className="w-5 h-5" />, text: "Privacy Protection" }
      ],
      [
        { icon: <Clock className="w-5 h-5" />, text: "90 Days Plan Validity" },
        { icon: <UserCheck className="w-5 h-5" />, text: "Personal Field Assistant" },
        { icon: <FileText className="w-5 h-5" />, text: "Complete Legal Support" },
        { icon: <TrendingUp className="w-5 h-5" />, text: "Premium Slot Guarantee" },
        { icon: <Globe className="w-5 h-5" />, text: "360° Marketing Campaign" },
        { icon: <Camera className="w-5 h-5" />, text: "HD Video Tour" },
        { icon: <Users className="w-5 h-5" />, text: "Property Showing Service" },
        { icon: <Shield className="w-5 h-5" />, text: "VIP Customer Support" }
      ]
    ],
    commercial: [
      [
        { icon: <Clock className="w-5 h-5" />, text: "60 Days Plan Validity" },
        { icon: <UserCheck className="w-5 h-5" />, text: "Commercial Property Expert" },
        { icon: <FileText className="w-5 h-5" />, text: "Commercial Documentation" },
        { icon: <TrendingUp className="w-5 h-5" />, text: "Business Listing Priority" }
      ],
      [
        { icon: <Clock className="w-5 h-5" />, text: "90 Days Plan Validity" },
        { icon: <UserCheck className="w-5 h-5" />, text: "Dedicated Commercial Manager" },
        { icon: <FileText className="w-5 h-5" />, text: "Complete Legal Framework" },
        { icon: <TrendingUp className="w-5 h-5" />, text: "Premium Business Exposure" },
        { icon: <Globe className="w-5 h-5" />, text: "Multi-Channel Marketing" },
        { icon: <Camera className="w-5 h-5" />, text: "Professional Space Photography" }
      ],
      [
        { icon: <Clock className="w-5 h-5" />, text: "120 Days Plan Validity" },
        { icon: <UserCheck className="w-5 h-5" />, text: "Executive Account Manager" },
        { icon: <FileText className="w-5 h-5" />, text: "Enterprise Documentation" },
        { icon: <TrendingUp className="w-5 h-5" />, text: "Exclusive Business Promotion" },
        { icon: <Globe className="w-5 h-5" />, text: "Corporate Marketing Suite" },
        { icon: <Camera className="w-5 h-5" />, text: "Virtual Reality Tours" },
        { icon: <Shield className="w-5 h-5" />, text: "Priority Support Hotline" }
      ]
    ],
    industrial: [
      [
        { icon: <Clock className="w-5 h-5" />, text: "90 Days Plan Validity" },
        { icon: <UserCheck className="w-5 h-5" />, text: "Industrial Property Specialist" },
        { icon: <FileText className="w-5 h-5" />, text: "Industrial Compliance Support" },
        { icon: <TrendingUp className="w-5 h-5" />, text: "Industrial Network Exposure" }
      ],
      [
        { icon: <Clock className="w-5 h-5" />, text: "120 Days Plan Validity" },
        { icon: <UserCheck className="w-5 h-5" />, text: "Senior Industrial Advisor" },
        { icon: <FileText className="w-5 h-5" />, text: "Regulatory Documentation" },
        { icon: <TrendingUp className="w-5 h-5" />, text: "Enterprise-Grade Marketing" },
        { icon: <Globe className="w-5 h-5" />, text: "Industrial Portal Listing" },
        { icon: <Shield className="w-5 h-5" />, text: "Compliance Verification" }
      ],
      [
        { icon: <Clock className="w-5 h-5" />, text: "180 Days Plan Validity" },
        { icon: <UserCheck className="w-5 h-5" />, text: "Executive Industrial Consultant" },
        { icon: <FileText className="w-5 h-5" />, text: "Complete Regulatory Support" },
        { icon: <TrendingUp className="w-5 h-5" />, text: "Custom Marketing Solutions" },
        { icon: <Globe className="w-5 h-5" />, text: "Global Industrial Network" },
        { icon: <Camera className="w-5 h-5" />, text: "Detailed Facility Documentation" },
        { icon: <Shield className="w-5 h-5" />, text: "24/7 Enterprise Support" }
      ]
    ],
    agricultural: [
      [
        { icon: <Clock className="w-5 h-5" />, text: "60 Days Plan Validity" },
        { icon: <UserCheck className="w-5 h-5" />, text: "Agricultural Land Expert" },
        { icon: <FileText className="w-5 h-5" />, text: "Land Documentation Support" },
        { icon: <TrendingUp className="w-5 h-5" />, text: "Farming Community Reach" }
      ],
      [
        { icon: <Clock className="w-5 h-5" />, text: "90 Days Plan Validity" },
        { icon: <UserCheck className="w-5 h-5" />, text: "Agricultural Advisor" },
        { icon: <FileText className="w-5 h-5" />, text: "Crop Planning Assistance" },
        { icon: <TrendingUp className="w-5 h-5" />, text: "Agricultural Network Marketing" },
        { icon: <Globe className="w-5 h-5" />, text: "Farming Portal Listing" },
        { icon: <Shield className="w-5 h-5" />, text: "Soil Quality Assessment" }
      ],
      [
        { icon: <Clock className="w-5 h-5" />, text: "120 Days Plan Validity" },
        { icon: <UserCheck className="w-5 h-5" />, text: "Senior Agricultural Consultant" },
        { icon: <FileText className="w-5 h-5" />, text: "Complete Farm Planning" },
        { icon: <TrendingUp className="w-5 h-5" />, text: "Premium Agricultural Marketing" },
        { icon: <Globe className="w-5 h-5" />, text: "National Farming Network" },
        { icon: <Camera className="w-5 h-5" />, text: "Drone Survey Documentation" },
        { icon: <Shield className="w-5 h-5" />, text: "Crop Insurance Guidance" }
      ]
    ]
  };

  const testimonials = [{
    text: "Home HNI's customer service was impressively prompt and friendly. Listing my flat was a memorable experience.",
    hashtag: "#ZeroBrokerage"
  }, {
    text: "The premium plan helped me get the best deal for a PG in a very short time!",
    hashtag: "#ZeroBrokerage"
  }];

  const faqs = [{
    question: "What will the Relationship Manager do?",
    answer: "Help you close deals faster, assist with follow-ups, and coordinate visits."
  }, {
    question: "What about Social Media Marketing?", 
    answer: "We promote your property across platforms like Facebook for wider reach."
  }, {
    question: "How will my property be promoted?",
    answer: "Through website placement, featured listings, and personal visits if needed."
  }, {
    question: "Any hidden charges?",
    answer: "No hidden fees — all charges (if any) will be transparently shared."
  }, {
    question: "How is the rental agreement made?",
    answer: "We deliver the agreement to your doorstep, with home pickup support."
  }, {
    question: "How do I get faster closures?",
    answer: "Use our Super MoneyBack plan — with top slot listings, field assistance, and RM support."
  }];

  return (
    <div className={embedded ? "" : "min-h-screen bg-background"}>
      {!embedded && <Marquee />}
      {!embedded && <Header />}
      
      {/* Hero Section */}
      {!embedded && (
      <section 
        className="relative text-white py-16 px-4 pt-24 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('/lovable-uploads/fbb0d72f-782e-49f5-bbe1-8afc1314b5f7.png')`
        }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-6 pt-8">
            Get Tenants Quickly. Save up to ₹50,000 on Brokerage!
          </h1>
          <p className="text-lg md:text-xl mb-6 max-w-3xl mx-auto">
            Trusted by 3 Lakh+ property owners like you. Choose the plan that suits you 
          </p>
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="flex">
              {[1, 2, 3, 4, 5].map(star => <Star key={star} className="w-5 h-5 fill-yellow-400 text-yellow-400" />)}
            </div>
            <span className="ml-2">Rated 5 Stars by Owners</span>
          </div>
        </div>
      </section>
      )}

      {/* Pricing Plans with Tabs */}
      <section className={embedded ? "p-0 bg-transparent" : "py-16 px-4 bg-gray-50"}>
        <div className={embedded ? "" : "max-w-6xl mx-auto"}>

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
                            <>
                              <span className="text-2xl font-bold text-gray-900">{plan.price}</span>
                              <div className="text-sm text-gray-500">{plan.gst}</div>
                            </>
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
                            planName={`Owner — ${plan.name}`}
                            amountPaise={plan.amountPaise}
                            notes={{ plan: plan.name, category: "owner", type: tabKey }}
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

      {/* Customer Testimonials */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Customer Testimonials</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="p-6">
                <CardContent className="pt-0">
                  <div className="flex mb-4">
                    {[1, 2, 3, 4, 5].map(star => <Star key={star} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)}
                  </div>
                  <p className="text-gray-700 mb-4">"{testimonial.text}"</p>
                  <p className="text-brand-red font-medium">{testimonial.hashtag}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Support Callout */}
      <section className="py-12 px-4 bg-brand-red text-primary-foreground">
        <div className="max-w-4xl mx-auto text-center">
          <Phone className="w-8 h-8 mx-auto mb-4" />
          <h3 className="text-2xl font-bold mb-4">Need Assistance?</h3>
          <p className="text-lg mb-4">For assistance, call us at</p>
          <a href="tel:+918074017388" className="text-2xl font-bold hover:underline">
            +91 80740 17388
          </a>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent>
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {!embedded && <Footer />}
    </div>
  );
};

export default OwnerPlans;
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, Check, Phone, Clock, Users, Shield, UserCheck, Globe, Camera, Lock, FileText, TrendingUp, Target } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

const CommercialOwnerPlans = () => {
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
        badge: "BASIC ASSISTANCE",
        badgeColor: "bg-yellow-500",
        isFree: true,
      },
      {
        name: "Gold Plan",
        price: "₹6,499", 
        gst: "+18% GST",
        badge: "ENHANCED VISIBILITY",
        badgeColor: "bg-green-500",
      },
      {
        name: "Platinum Plan",
        price: "₹7,999",
        gst: "+18% GST", 
        badge: "EXPERT GUIDANCE",
        badgeColor: "bg-red-500",
      },
      {
        name: "Diamond Plan",
        price: "₹11,999",
        gst: "+18% GST",
        badge: "PREMIUM ASSISTANCE", 
        badgeColor: "bg-purple-500",
      }
    ],
    commercial: [
      {
        name: "Business Silver",
        price: "₹999",
        originalPrice: "₹999",
        freePrice: "FREE",
        gst: "+18% GST",
        badge: "COMMERCIAL BASICS",
        badgeColor: "bg-blue-500",
        isFree: true,
      },
      {
        name: "Business Gold",
        price: "₹15,999", 
        gst: "+18% GST",
        badge: "BUSINESS GROWTH",
        badgeColor: "bg-indigo-500",
      },
      {
        name: "Business Platinum",
        price: "₹22,999",
        gst: "+18% GST", 
        badge: "ENTERPRISE LEVEL",
        badgeColor: "bg-purple-600",
      }
    ],
    industrial: [
      {
        name: "Industrial Basic",
        price: "₹999",
        originalPrice: "₹999",
        freePrice: "FREE",
        gst: "+18% GST",
        badge: "INDUSTRIAL START",
        badgeColor: "bg-gray-600",
        isFree: true,
      },
      {
        name: "Industrial Pro",
        price: "₹25,999", 
        gst: "+18% GST",
        badge: "INDUSTRIAL GROWTH",
        badgeColor: "bg-slate-700",
      },
      {
        name: "Industrial Elite",
        price: "₹45,999",
        gst: "+18% GST", 
        badge: "INDUSTRIAL PREMIUM",
        badgeColor: "bg-zinc-800",
      }
    ],
    agricultural: [
      {
        name: "Farm Basic",
        price: "₹999",
        originalPrice: "₹999",
        freePrice: "FREE",
        gst: "+18% GST",
        badge: "FARM ESSENTIALS",
        badgeColor: "bg-green-600",
        isFree: true,
      },
      {
        name: "Farm Pro",
        price: "₹12,999", 
        gst: "+18% GST",
        badge: "FARM GROWTH",
        badgeColor: "bg-emerald-600",
      },
      {
        name: "Farm Premium",
        price: "₹18,999",
        gst: "+18% GST", 
        badge: "FARM PREMIUM",
        badgeColor: "bg-teal-600",
      }
    ]
  };

  const tabPlanDetails = {
    residential: [
      [
        { icon: <Clock className="w-5 h-5" />, text: "Basic tenant matching" },
        { icon: <Users className="w-5 h-5" />, text: "Standard listing visibility" },
        { icon: <UserCheck className="w-5 h-5" />, text: "Email support" },
        { icon: <FileText className="w-5 h-5" />, text: "Property documentation assistance" }
      ],
      [
        { icon: <Clock className="w-5 h-5" />, text: "Priority tenant matching" },
        { icon: <Users className="w-5 h-5" />, text: "Enhanced listing visibility" },
        { icon: <UserCheck className="w-5 h-5" />, text: "Phone & email support" },
        { icon: <FileText className="w-5 h-5" />, text: "Complete documentation support" },
        { icon: <Globe className="w-5 h-5" />, text: "Detailed market analysis" },
        { icon: <Lock className="w-5 h-5" />, text: "Rental agreement assistance" }
      ],
      [
        { icon: <Clock className="w-5 h-5" />, text: "Guaranteed tenant matching" },
        { icon: <Users className="w-5 h-5" />, text: "Premium listing placement" },
        { icon: <UserCheck className="w-5 h-5" />, text: "Personal relationship manager" },
        { icon: <FileText className="w-5 h-5" />, text: "Complete legal documentation" },
        { icon: <TrendingUp className="w-5 h-5" />, text: "Market trend insights" },
        { icon: <Shield className="w-5 h-5" />, text: "Tenant verification services" },
        { icon: <Camera className="w-5 h-5" />, text: "Professional photography" }
      ],
      [
        { icon: <Target className="w-5 h-5" />, text: "Priority guaranteed matching" },
        { icon: <Globe className="w-5 h-5" />, text: "Maximum visibility & promotion" },
        { icon: <UserCheck className="w-5 h-5" />, text: "Dedicated relationship manager" },
        { icon: <Shield className="w-5 h-5" />, text: "Premium legal support" },
        { icon: <TrendingUp className="w-5 h-5" />, text: "Advanced market analytics" },
        { icon: <Users className="w-5 h-5" />, text: "Complete tenant verification" },
        { icon: <Phone className="w-5 h-5" />, text: "Rental negotiation support" },
        { icon: <Camera className="w-5 h-5" />, text: "Premium property showcase" }
      ]
    ],
    commercial: [
      [
        { icon: <Clock className="w-5 h-5" />, text: "Commercial tenant matching" },
        { icon: <Users className="w-5 h-5" />, text: "Business listing visibility" },
        { icon: <UserCheck className="w-5 h-5" />, text: "Business support" },
        { icon: <FileText className="w-5 h-5" />, text: "Commercial documentation" }
      ],
      [
        { icon: <Clock className="w-5 h-5" />, text: "Priority business matching" },
        { icon: <Users className="w-5 h-5" />, text: "Enhanced business exposure" },
        { icon: <UserCheck className="w-5 h-5" />, text: "Dedicated business advisor" },
        { icon: <FileText className="w-5 h-5" />, text: "Complete commercial support" },
        { icon: <Globe className="w-5 h-5" />, text: "Multi-channel marketing" },
        { icon: <Shield className="w-5 h-5" />, text: "Business verification" }
      ],
      [
        { icon: <Target className="w-5 h-5" />, text: "Enterprise-level matching" },
        { icon: <Globe className="w-5 h-5" />, text: "Premium business promotion" },
        { icon: <UserCheck className="w-5 h-5" />, text: "Executive business manager" },
        { icon: <Shield className="w-5 h-5" />, text: "Enterprise legal support" },
        { icon: <TrendingUp className="w-5 h-5" />, text: "Advanced business analytics" },
        { icon: <Camera className="w-5 h-5" />, text: "Professional business showcase" },
        { icon: <Phone className="w-5 h-5" />, text: "24/7 business support" }
      ]
    ],
    industrial: [
      [
        { icon: <Clock className="w-5 h-5" />, text: "Industrial tenant matching" },
        { icon: <Users className="w-5 h-5" />, text: "Industrial listing visibility" },
        { icon: <UserCheck className="w-5 h-5" />, text: "Industrial support" },
        { icon: <FileText className="w-5 h-5" />, text: "Industrial documentation" }
      ],
      [
        { icon: <Clock className="w-5 h-5" />, text: "Priority industrial matching" },
        { icon: <Users className="w-5 h-5" />, text: "Enhanced industrial exposure" },
        { icon: <UserCheck className="w-5 h-5" />, text: "Industrial specialist" },
        { icon: <FileText className="w-5 h-5" />, text: "Complete industrial support" },
        { icon: <Globe className="w-5 h-5" />, text: "Industrial network marketing" },
        { icon: <Shield className="w-5 h-5" />, text: "Compliance assistance" }
      ],
      [
        { icon: <Target className="w-5 h-5" />, text: "Premium industrial matching" },
        { icon: <Globe className="w-5 h-5" />, text: "Maximum industrial promotion" },
        { icon: <UserCheck className="w-5 h-5" />, text: "Executive industrial consultant" },
        { icon: <Shield className="w-5 h-5" />, text: "Complete regulatory support" },
        { icon: <TrendingUp className="w-5 h-5" />, text: "Industrial market analytics" },
        { icon: <Camera className="w-5 h-5" />, text: "Professional facility documentation" },
        { icon: <Phone className="w-5 h-5" />, text: "24/7 industrial support" }
      ]
    ],
    agricultural: [
      [
        { icon: <Clock className="w-5 h-5" />, text: "Farm tenant matching" },
        { icon: <Users className="w-5 h-5" />, text: "Agricultural listing visibility" },
        { icon: <UserCheck className="w-5 h-5" />, text: "Farm support" },
        { icon: <FileText className="w-5 h-5" />, text: "Farm documentation" }
      ],
      [
        { icon: <Clock className="w-5 h-5" />, text: "Priority farm matching" },
        { icon: <Users className="w-5 h-5" />, text: "Enhanced farm exposure" },
        { icon: <UserCheck className="w-5 h-5" />, text: "Agricultural specialist" },
        { icon: <FileText className="w-5 h-5" />, text: "Complete farm support" },
        { icon: <Globe className="w-5 h-5" />, text: "Agricultural network marketing" },
        { icon: <Shield className="w-5 h-5" />, text: "Soil quality assessment" }
      ],
      [
        { icon: <Target className="w-5 h-5" />, text: "Premium farm matching" },
        { icon: <Globe className="w-5 h-5" />, text: "Maximum agricultural promotion" },
        { icon: <UserCheck className="w-5 h-5" />, text: "Senior agricultural consultant" },
        { icon: <Shield className="w-5 h-5" />, text: "Complete farming support" },
        { icon: <TrendingUp className="w-5 h-5" />, text: "Agricultural market analytics" },
        { icon: <Camera className="w-5 h-5" />, text: "Drone survey documentation" },
        { icon: <Phone className="w-5 h-5" />, text: "24/7 agricultural support" }
      ]
    ]
  };

  const keyBenefits = [
  {
    icon: Target,
    title: "Verified Tenant Connect",
    description: "We match your property with pre-screened, high-intent tenants"
  },
  {
    icon: Shield,
    title: "Risk-Free Service",
    description: "No hidden fees — you only pay when we deliver results"
  },
  {
    icon: UserCheck,
    title: "Personal Relationship Manager",
    description: "Dedicated support throughout your journey"
  },
  {
    icon: Check,
    title: "Expert Rental Consultation",
    description: "Professional guidance on pricing and market trends"
  },
  {
    icon: TrendingUp,
    title: "High-Visibility Listings & Promotions",
    description: "Premium placement and marketing for your property"
  }
];


  const pricingPlans = [
    {
      name: "Relax Plan",
      price: "₹3,499",
      gst: "+ GST",
      features: [
        "Basic tenant matching",
        "Standard listing visibility",
        "Email support",
        "Property documentation assistance",
        "Basic market analysis"
      ],
      popular: false
    },
    {
      name: "Super Relax Plan",
      price: "₹6,499",
      gst: "+ GST",
      features: [
        "Priority tenant matching",
        "Enhanced listing visibility",
        "Phone & email support",
        "Complete documentation support",
        "Detailed market analysis",
        "Rental agreement assistance"
      ],
      popular: false
    },
    {
      name: "MoneyBack Plan",
      price: "₹7,999",
      gst: "+ GST",
      features: [
        "Guaranteed tenant matching",
        "Premium listing placement",
        "Personal relationship manager",
        "100% moneyback guarantee",
        "Complete legal documentation",
        "Market trend insights",
        "Tenant verification services"
      ],
      popular: true
    },
    {
      name: "Super MoneyBack Plan",
      price: "₹11,999",
      gst: "+ GST",
      features: [
        "Priority guaranteed matching",
        "Maximum visibility & promotion",
        "Dedicated relationship manager",
        "100% moneyback guarantee",
        "Premium legal support",
        "Advanced market analytics",
        "Complete tenant verification",
        "Rental negotiation support",
        "Post-rental support"
      ],
      popular: false
    }
  ];

  const testimonials = [
    {
      name: "Rajesh Kumar",
      location: "Delhi",
      review: "Found a tenant for my office space within 2 weeks! The team was professional and the process was seamless.",
      rating: 5,
      tag: "#ZeroBrokerage"
    },
    {
      name: "Priya Sharma",
      location: "Mumbai",
      review: "Excellent service! They handled everything from documentation to tenant verification. Highly recommend!",
      rating: 5,
      tag: "#ZeroBrokerage"
    },
    {
      name: "Amit Patel",
      location: "Bangalore",
      review: "The MoneyBack plan gave me confidence. Got a reliable tenant and saved thousands on brokerage fees.",
      rating: 5,
      tag: "#ZeroBrokerage"
    }
  ];

  const faqs = [
    {
      question: "How quickly can you find a tenant for my commercial property?",
      answer: "Typically, we find suitable tenants within 15-30 days depending on your property location, size, and rental expectations. Our MoneyBack plans come with guaranteed timelines."
    },
    {
      question: "What is included in the 100% Moneyback Promise?",
      answer: "If we don't find a verified tenant within the agreed timeline for MoneyBack plans, we provide a full refund of your plan fee. Terms and conditions apply."
    },
    {
      question: "Do you charge any brokerage from tenants?",
      answer: "No, we operate on a zero-brokerage model for tenants. This makes your property more attractive and helps in faster tenant acquisition."
    },
    {
      question: "How do you verify potential tenants?",
      answer: "We conduct comprehensive background checks including credit verification, business validation, reference checks, and legal document verification before recommending any tenant."
    },
    {
      question: "Can I upgrade or downgrade my plan later?",
      answer: "Yes, you can upgrade your plan at any time by paying the difference. Downgrades are subject to terms and conditions and available features."
    },
    {
      question: "What types of commercial properties do you handle?",
      answer: "We handle all types of commercial properties including office spaces, retail shops, warehouses, industrial units, co-working spaces, and mixed-use properties."
    }
  ];

  return (
    <div className="bg-background">
      {/* Commercial Owner Plans with Tabs */}
      <section className="py-8 px-4 bg-gray-50" id="pricing">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-2">
            Choose Your Commercial Owner Plan
          </h2>
          <p className="text-sm text-muted-foreground text-center mb-8">Select the category that best fits your property needs</p>

          <Tabs defaultValue="residential" className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-6">
              <TabsTrigger value="residential" className="text-sm md:text-base">Residential</TabsTrigger>
              <TabsTrigger value="commercial" className="text-sm md:text-base">Commercial</TabsTrigger>
              <TabsTrigger value="industrial" className="text-sm md:text-base">Industrial</TabsTrigger>
              <TabsTrigger value="agricultural" className="text-sm md:text-base">Agricultural</TabsTrigger>
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
                        
                        <Button 
                          className={`w-full ${
                            selectedPlans[tabKey as keyof typeof selectedPlans] === index 
                              ? 'bg-brand-red hover:bg-brand-maroon-dark text-white' 
                              : 'bg-transparent text-foreground border border-border hover:bg-muted'
                          }`}
                        >
                          Subscribe
                        </Button>
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

      {/* Key Benefits Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Why Choose Our Commercial Owner Plans?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {keyBenefits.map((benefit, index) => (
              <Card key={index} className="text-center">
                <CardContent className="pt-6">
                  <benefit.icon className="w-12 h-12 text-brand-red mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                  <p className="text-muted-foreground">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
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
                  <p className="text-gray-700 mb-4">"{testimonial.review}"</p>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                    </div>
                    <Badge variant="secondary" className="text-brand-red">
                      {testimonial.tag}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Frequently Asked Questions
          </h2>
          <div className="max-w-4xl mx-auto">
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
        </div>
      </section>
    </div>
  );
};

export default CommercialOwnerPlans;
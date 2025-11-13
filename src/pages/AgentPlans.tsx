import React, { useState } from 'react';
import { Home, Users, Shield, Headphones, Video, BarChart3, Zap, Bell, Globe, FileText, TrendingUp, CreditCard, Building2, Megaphone, UserCheck, TrendingDown, Sparkles } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import PayButton from '@/components/PayButton';
import GSTDisplay from '@/components/GSTDisplay';
import { calculateTotalWithGST } from '@/utils/gstCalculator';
import { supabase } from '@/integrations/supabase/client';

const AgentPlans = () => {
  const [selectedPlans, setSelectedPlans] = useState({
    basic: 1,
    lifetime: 1
  });
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);

  const tabPlans = {
    basic: [
      {
        name: "Basic Monthly",
        price: "AED 44/month",
        originalPrice: "AED 44/month",
        freePrice: "FREE",
        gst: "+5% VAT",
        badge: "GETTING STARTED",
        badgeColor: "bg-blue-500",
        amountPaise: 4400,
        isFree: true,
      },
      {
        name: "Basic Quarterly", 
        price: "AED 356/quarter",
        gst: "+5% VAT",
        badge: "POPULAR CHOICE",
        badgeColor: "bg-green-500",
        amountPaise: 35600,
      },
      {
        name: "Basic Yearly",
        price: "AED 1,110/year",
        gst: "+5% VAT", 
        badge: "BEST VALUE",
        badgeColor: "bg-purple-500",
        amountPaise: 111000,
      }
    ],
    lifetime: [
      {
        name: "Lifetime Standard",
        price: "AED 3,560",
        gst: "+5% VAT",
        badge: "FOR NEW AGENTS",
        badgeColor: "bg-yellow-500",
        amountPaise: 356000,
      },
      {
        name: "Lifetime Platinum", 
        price: "AED 6,670",
        gst: "+5% VAT",
        badge: "ENHANCED VISIBILITY",
        badgeColor: "bg-green-500",
        amountPaise: 667000,
      },
      {
        name: "Lifetime VIP",
        price: "AED 11,110",
        gst: "+5% VAT", 
        badge: "EXCLUSIVE SERVICES",
        badgeColor: "bg-red-500",
        amountPaise: 1111000,
      }
    ]
  };

  const planDetails = {
    basic: [
      [
        { icon: <Bell className="w-5 h-5" />, text: "Property Alerts & Notifications" },
        { icon: <Home className="w-5 h-5" />, text: "Up to 10 Property Listings" },
        { icon: <Headphones className="w-5 h-5" />, text: "Email Support" },
        { icon: <FileText className="w-5 h-5" />, text: "Basic Marketing Materials" }
      ],
      [
        { icon: <Bell className="w-5 h-5" />, text: "Property Alerts & Notifications" },
        { icon: <Home className="w-5 h-5" />, text: "Up to 50 Property Listings" },
        { icon: <Headphones className="w-5 h-5" />, text: "Phone & Email Support" },
        { icon: <Video className="w-5 h-5" />, text: "Basic Virtual Tour Tools" },
        { icon: <BarChart3 className="w-5 h-5" />, text: "Basic Analytics Dashboard" },
        { icon: <Globe className="w-5 h-5" />, text: "Standard Listing Visibility" }
      ],
      [
        { icon: <Bell className="w-5 h-5" />, text: "Property Alerts & Notifications" },
        { icon: <Home className="w-5 h-5" />, text: "Up to 200 Property Listings" },
        { icon: <Headphones className="w-5 h-5" />, text: "Priority Phone & Email Support" },
        { icon: <Video className="w-5 h-5" />, text: "Advanced Virtual Tour Tools" },
        { icon: <BarChart3 className="w-5 h-5" />, text: "Enhanced Analytics Dashboard" },
        { icon: <Globe className="w-5 h-5" />, text: "Enhanced Listing Visibility" },
        { icon: <Users className="w-5 h-5" />, text: "Lead Generation Tools" },
        { icon: <Zap className="w-5 h-5" />, text: "Photography Credits" }
      ]
    ],
    lifetime: [
      [
        { icon: <Bell className="w-5 h-5" />, text: "Property Alerts & Notifications" },
        { icon: <Home className="w-5 h-5" />, text: "Unlimited Property Listings" },
        { icon: <Headphones className="w-5 h-5" />, text: "Basic Customer Support" },
        { icon: <FileText className="w-5 h-5" />, text: "Standard Marketing Materials" }
      ],
      [
        { icon: <Bell className="w-5 h-5" />, text: "Property Alerts & Notifications" },
        { icon: <Home className="w-5 h-5" />, text: "Unlimited Property Listings" },
        { icon: <Headphones className="w-5 h-5" />, text: "Priority Customer Support" },
        { icon: <Video className="w-5 h-5" />, text: "Virtual Tour Creation Tools" },
        { icon: <BarChart3 className="w-5 h-5" />, text: "Enhanced Marketing Resources" },
        { icon: <Globe className="w-5 h-5" />, text: "Featured Listing Placement" },
        { icon: <Users className="w-5 h-5" />, text: "Lead Generation Support" },
        { icon: <Zap className="w-5 h-5" />, text: "Professional Photography Credits" }
      ],
      [
        { icon: <Zap className="w-5 h-5" />, text: "VIP Concierge Service" },
        { icon: <Home className="w-5 h-5" />, text: "Unlimited Premium Listings" },
        { icon: <BarChart3 className="w-5 h-5" />, text: "Advanced Analytics Dashboard" },
        { icon: <TrendingUp className="w-5 h-5" />, text: "Premium Marketing Campaigns" },
        { icon: <Zap className="w-5 h-5" />, text: "Exclusive Listing Access" },
        { icon: <Headphones className="w-5 h-5" />, text: "24/7 Dedicated Support" },
        { icon: <Video className="w-5 h-5" />, text: "Professional Video Marketing" },
        { icon: <Users className="w-5 h-5" />, text: "Personal Account Manager" },
        { icon: <Globe className="w-5 h-5" />, text: "Multi-Platform Promotion" },
        { icon: <Shield className="w-5 h-5" />, text: "Priority Issue Resolution" }
      ]
    ]
  };

  const bestForDescriptions = {
    basic: [
      "New agents starting their real estate career with limited listings",
      "Growing agents who need more listings and better support for 3 months",
      "Established agents wanting comprehensive features for a full year"
    ],
    lifetime: [
      "New agents or those starting out with moderate exposure needs",
      "Established agents looking for unlimited listings, enhanced visibility, and support",
      "Top-tier agents or agents handling luxury listings, requiring exclusive services and promotions"
    ]
  };

  const howItWorks = [
    { 
      title: "Choose your Agent Plan", 
      icon: CreditCard,
      description: "Select the plan that fits your business needs",
      color: "from-blue-500 to-blue-600"
    },
    { 
      title: "Get unlimited property listings access", 
      icon: Building2,
      description: "Access our complete property database",
      color: "from-green-500 to-green-600"
    },
    { 
      title: "Access marketing tools and resources", 
      icon: Megaphone,
      description: "Use professional marketing materials",
      color: "from-purple-500 to-purple-600"
    },
    { 
      title: "Connect with verified property leads", 
      icon: UserCheck,
      description: "Get quality leads from verified sources",
      color: "from-orange-500 to-orange-600"
    },
    { 
      title: "Grow your agent business exponentially", 
      icon: TrendingUp,
      description: "Scale your real estate business",
      color: "from-red-500 to-red-600"
    },
    { 
      title: "Enjoy lifetime benefits and support", 
      icon: Sparkles,
      description: "Get ongoing support and updates",
      color: "from-indigo-500 to-indigo-600"
    }
  ];

  const faqs = [
    {
      question: "What makes Agent Plans different from regular plans?",
      answer: "Agent Plans provide specialized access to our platform with enhanced marketing tools, priority support, and lead generation features designed specifically for real estate professionals."
    },
    {
      question: "Can I upgrade my plan later?",
      answer: "Yes, you can upgrade to a higher tier plan by paying the difference. Contact our support team for assistance with plan upgrades."
    },
    {
      question: "What kind of support do I get with each plan?",
      answer: "Basic plans include email support, Quarterly/Yearly plans offer phone & email support, and Lifetime plans provide 24/7 dedicated support with personal account management."
    },
    {
      question: "Are there any hidden charges after purchase?",
      answer: "No hidden charges. Basic plans are subscription-based with clear recurring fees, while lifetime plans are one-time payments with no recurring charges."
    },
    {
      question: "How do marketing resources work?",
      answer: "Each plan includes different levels of marketing materials, from basic templates to premium video marketing and multi-platform promotions."
    },
    {
      question: "What happens if I need more listings than my plan allows?",
      answer: "Basic plans have listing limits. You can upgrade to higher plans for more listings or choose lifetime plans for unlimited access."
    }
  ];

  return (
    <div className="bg-background">
      {/* Agent Plans with Tabs */}
      <section className="py-8 px-4 bg-gray-50" id="pricing">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-2">
            Agent Plans
          </h2>
          <p className="text-sm text-muted-foreground text-center mb-8">Select between flexible basic plans or lifetime access</p>

          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6 p-1 gap-1 bg-muted rounded-lg h-auto">
              <TabsTrigger value="basic" className="text-xs sm:text-sm md:text-base py-2 sm:py-3 px-2 sm:px-4 data-[state=active]:bg-background data-[state=active]:text-foreground whitespace-nowrap">Basic Plan</TabsTrigger>
              <TabsTrigger value="lifetime" className="text-xs sm:text-sm md:text-base py-2 sm:py-3 px-2 sm:px-4 data-[state=active]:bg-background data-[state=active]:text-foreground whitespace-nowrap">Lifetime</TabsTrigger>
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
                        <div className="mb-4">
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
                                    plan_name: `Agent — ${plan.name} (Free)`,
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
                                      notes: { plan: plan.name, category: "agent", type: tabKey, isFree: true }
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
                            planName={`Agent — ${plan.name}`}
                            amountPaise={calculateTotalWithGST(plan.amountPaise)}
                            notes={{ plan: plan.name, category: "agent", type: tabKey }}
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

                {/* Selected Plan Details */}
                <div className={`rounded-lg border p-6 ${
                  plans[selectedPlans[tabKey as keyof typeof selectedPlans]].badgeColor === 'bg-blue-500' ? 'bg-blue-50' :
                  plans[selectedPlans[tabKey as keyof typeof selectedPlans]].badgeColor === 'bg-green-500' ? 'bg-green-50' :
                  plans[selectedPlans[tabKey as keyof typeof selectedPlans]].badgeColor === 'bg-purple-500' ? 'bg-purple-50' :
                  plans[selectedPlans[tabKey as keyof typeof selectedPlans]].badgeColor === 'bg-yellow-500' ? 'bg-yellow-50' :
                  plans[selectedPlans[tabKey as keyof typeof selectedPlans]].badgeColor === 'bg-red-500' ? 'bg-red-50' :
                  plans[selectedPlans[tabKey as keyof typeof selectedPlans]].badgeColor === 'bg-indigo-500' ? 'bg-indigo-50' :
                  'bg-white'
                }`}>
                  <h3 className="text-xl font-bold mb-4">
                    {plans[selectedPlans[tabKey as keyof typeof selectedPlans]].name} Features
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {planDetails[tabKey as keyof typeof planDetails][selectedPlans[tabKey as keyof typeof selectedPlans]].map((feature, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="text-brand-red mt-1">
                          {feature.icon}
                        </div>
                        <span className="text-sm text-foreground leading-relaxed">
                          {feature.text}
                        </span>
                      </div>
                    ))}
                  </div>
                  
                  {/* Contact Info inside features section */}
                  <div className="mt-6 pt-6 border-t">
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

      {/* How It Works Section */}
      <section className="py-12 px-4 bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center mb-4">
              <Sparkles className="w-8 h-8 text-[#800000] mr-2" />
              <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-[#800000] to-[#700000] bg-clip-text text-transparent">
                How It Works
              </h2>
              <Sparkles className="w-8 h-8 text-[#800000] ml-2" />
            </div>
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
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

    </div>
  );
};

export default AgentPlans;

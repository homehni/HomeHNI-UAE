import React, { useState } from 'react';
import { Star, Check, Phone, Home, Users, Shield, Clock, UserCheck, Globe, Lock, FileText, TrendingUp, Camera, Bell, Headphones, Video, BarChart3, Crown, Zap, Building, Presentation } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import PayButton from '@/components/PayButton';

const BuilderLifetimePlans = () => {
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
        name: "Lifetime Standard",
        price: "₹1,49,999",
        gst: "+18% GST",
        badge: "PROJECT SHOWCASE",
        badgeColor: "bg-yellow-500",
        amountPaise: 14999900,
      },
      {
        name: "Lifetime Platinum", 
        price: "₹2,49,999",
        gst: "+18% GST",
        badge: "ENHANCED MARKETING",
        badgeColor: "bg-green-500",
        amountPaise: 24999900,
      },
      {
        name: "Lifetime VIP",
        price: "₹3,99,999",
        gst: "+18% GST", 
        badge: "PREMIUM SHOWCASE",
        badgeColor: "bg-red-500",
        amountPaise: 39999900,
      }
    ],
    commercial: [
      {
        name: "Commercial Standard",
        price: "₹2,49,999",
        gst: "+18% GST",
        badge: "COMMERCIAL PROJECTS",
        badgeColor: "bg-blue-500",
        amountPaise: 24999900,
      },
      {
        name: "Commercial Platinum", 
        price: "₹3,49,999",
        gst: "+18% GST",
        badge: "BUSINESS GROWTH",
        badgeColor: "bg-indigo-500",
        amountPaise: 34999900,
      },
      {
        name: "Commercial VIP",
        price: "₹4,99,999",
        gst: "+18% GST", 
        badge: "ENTERPRISE LEVEL",
        badgeColor: "bg-purple-600",
        amountPaise: 49999900,
      }
    ],
    industrial: [
      {
        name: "Industrial Standard",
        price: "₹2,99,999",
        gst: "+18% GST",
        badge: "INDUSTRIAL FOCUS",
        badgeColor: "bg-gray-600",
        amountPaise: 29999900,
      },
      {
        name: "Industrial Platinum", 
        price: "₹3,99,999",
        gst: "+18% GST",
        badge: "ADVANCED SOLUTIONS",
        badgeColor: "bg-slate-700",
        amountPaise: 39999900,
      },
      {
        name: "Industrial VIP",
        price: "₹5,49,999",
        gst: "+18% GST", 
        badge: "PREMIUM INDUSTRIAL",
        badgeColor: "bg-zinc-800",
        amountPaise: 54999900,
      }
    ],
    agricultural: [
      {
        name: "Agricultural Standard",
        price: "₹1,79,999",
        gst: "+18% GST",
        badge: "FARM PROJECTS",
        badgeColor: "bg-green-600",
        amountPaise: 17999900,
      },
      {
        name: "Agricultural Platinum", 
        price: "₹2,59,999",
        gst: "+18% GST",
        badge: "RURAL DEVELOPMENT",
        badgeColor: "bg-emerald-600",
        amountPaise: 25999900,
      },
      {
        name: "Agricultural VIP",
        price: "₹3,79,999",
        gst: "+18% GST", 
        badge: "AGRI-TECH FOCUS",
        badgeColor: "bg-lime-700",
        amountPaise: 37999900,
      }
    ]
  };

  const tabPlanDetails = {
    residential: [
      [
        { icon: <Bell className="w-5 h-5" />, text: "Property Alerts & Notifications" },
        { icon: <Building className="w-5 h-5" />, text: "Limited Project Listings" },
        { icon: <Headphones className="w-5 h-5" />, text: "Basic Customer Support" },
        { icon: <FileText className="w-5 h-5" />, text: "Standard Marketing Materials" }
      ],
      [
        { icon: <Bell className="w-5 h-5" />, text: "Property Alerts & Notifications" },
        { icon: <Building className="w-5 h-5" />, text: "Unlimited Project Listings" },
        { icon: <Headphones className="w-5 h-5" />, text: "Priority Customer Support" },
        { icon: <Video className="w-5 h-5" />, text: "Virtual Tour Creation Tools" },
        { icon: <TrendingUp className="w-5 h-5" />, text: "Enhanced Marketing Resources" },
        { icon: <Globe className="w-5 h-5" />, text: "Featured Project Placement" },
        { icon: <Users className="w-5 h-5" />, text: "Lead Generation Support" },
        { icon: <Camera className="w-5 h-5" />, text: "Professional Photography Credits" }
      ],
      [
        { icon: <Crown className="w-5 h-5" />, text: "VIP Concierge Service" },
        { icon: <Building className="w-5 h-5" />, text: "Unlimited Premium Project Listings" },
        { icon: <BarChart3 className="w-5 h-5" />, text: "Advanced Analytics Dashboard" },
        { icon: <TrendingUp className="w-5 h-5" />, text: "Premium Marketing Campaigns" },
        { icon: <Zap className="w-5 h-5" />, text: "Exclusive Project Access" },
        { icon: <Headphones className="w-5 h-5" />, text: "24/7 Dedicated Support" },
        { icon: <Video className="w-5 h-5" />, text: "Professional Video Marketing" },
        { icon: <Users className="w-5 h-5" />, text: "Personal Account Manager" },
        { icon: <Presentation className="w-5 h-5" />, text: "Multi-Platform Project Promotion" },
        { icon: <Shield className="w-5 h-5" />, text: "Priority Issue Resolution" }
      ]
    ],
    commercial: [
      [
        { icon: <Bell className="w-5 h-5" />, text: "Commercial Project Alerts" },
        { icon: <Building className="w-5 h-5" />, text: "Limited Commercial Projects" },
        { icon: <Headphones className="w-5 h-5" />, text: "Business Hours Support" },
        { icon: <FileText className="w-5 h-5" />, text: "Commercial Marketing Kit" }
      ],
      [
        { icon: <Bell className="w-5 h-5" />, text: "Priority Commercial Alerts" },
        { icon: <Building className="w-5 h-5" />, text: "Unlimited Commercial Projects" },
        { icon: <Headphones className="w-5 h-5" />, text: "Priority Business Support" },
        { icon: <Video className="w-5 h-5" />, text: "Commercial Virtual Tours" },
        { icon: <TrendingUp className="w-5 h-5" />, text: "Business Growth Analytics" },
        { icon: <Globe className="w-5 h-5" />, text: "Featured Commercial Placement" },
        { icon: <Users className="w-5 h-5" />, text: "B2B Lead Generation" },
        { icon: <Camera className="w-5 h-5" />, text: "Commercial Photography Package" }
      ],
      [
        { icon: <Crown className="w-5 h-5" />, text: "VIP Commercial Concierge" },
        { icon: <Building className="w-5 h-5" />, text: "Premium Commercial Portfolio" },
        { icon: <BarChart3 className="w-5 h-5" />, text: "Enterprise Analytics Suite" },
        { icon: <TrendingUp className="w-5 h-5" />, text: "Strategic Marketing Campaigns" },
        { icon: <Zap className="w-5 h-5" />, text: "Exclusive Commercial Access" },
        { icon: <Headphones className="w-5 h-5" />, text: "Dedicated Account Executive" },
        { icon: <Video className="w-5 h-5" />, text: "Professional Commercial Videos" },
        { icon: <Users className="w-5 h-5" />, text: "Corporate Relationship Manager" },
        { icon: <Presentation className="w-5 h-5" />, text: "Multi-Channel Marketing" },
        { icon: <Shield className="w-5 h-5" />, text: "White-Glove Service" }
      ]
    ],
    industrial: [
      [
        { icon: <Bell className="w-5 h-5" />, text: "Industrial Project Alerts" },
        { icon: <Building className="w-5 h-5" />, text: "Limited Industrial Projects" },
        { icon: <Headphones className="w-5 h-5" />, text: "Specialized Support" },
        { icon: <FileText className="w-5 h-5" />, text: "Industrial Documentation Kit" }
      ],
      [
        { icon: <Bell className="w-5 h-5" />, text: "Priority Industrial Alerts" },
        { icon: <Building className="w-5 h-5" />, text: "Unlimited Industrial Projects" },
        { icon: <Headphones className="w-5 h-5" />, text: "Industrial Expert Support" },
        { icon: <Video className="w-5 h-5" />, text: "Industrial Site Tours" },
        { icon: <TrendingUp className="w-5 h-5" />, text: "Industrial Market Analytics" },
        { icon: <Globe className="w-5 h-5" />, text: "Featured Industrial Placement" },
        { icon: <Users className="w-5 h-5" />, text: "Industrial Lead Network" },
        { icon: <Camera className="w-5 h-5" />, text: "Industrial Site Photography" }
      ],
      [
        { icon: <Crown className="w-5 h-5" />, text: "VIP Industrial Specialist" },
        { icon: <Building className="w-5 h-5" />, text: "Premium Industrial Portfolio" },
        { icon: <BarChart3 className="w-5 h-5" />, text: "Industrial Intelligence Suite" },
        { icon: <TrendingUp className="w-5 h-5" />, text: "Strategic Industrial Marketing" },
        { icon: <Zap className="w-5 h-5" />, text: "Exclusive Industrial Access" },
        { icon: <Headphones className="w-5 h-5" />, text: "Industrial Relationship Manager" },
        { icon: <Video className="w-5 h-5" />, text: "Industrial Facility Videos" },
        { icon: <Users className="w-5 h-5" />, text: "Corporate Industrial Network" },
        { icon: <Presentation className="w-5 h-5" />, text: "Multi-Platform Industrial Marketing" },
        { icon: <Shield className="w-5 h-5" />, text: "Priority Industrial Support" }
      ]
    ],
    agricultural: [
      [
        { icon: <Bell className="w-5 h-5" />, text: "Agricultural Project Alerts" },
        { icon: <Building className="w-5 h-5" />, text: "Limited Farm Projects" },
        { icon: <Headphones className="w-5 h-5" />, text: "Rural Development Support" },
        { icon: <FileText className="w-5 h-5" />, text: "Agricultural Documentation" }
      ],
      [
        { icon: <Bell className="w-5 h-5" />, text: "Priority Agricultural Alerts" },
        { icon: <Building className="w-5 h-5" />, text: "Unlimited Agricultural Projects" },
        { icon: <Headphones className="w-5 h-5" />, text: "Agricultural Expert Support" },
        { icon: <Video className="w-5 h-5" />, text: "Farm Virtual Tours" },
        { icon: <TrendingUp className="w-5 h-5" />, text: "Agricultural Market Insights" },
        { icon: <Globe className="w-5 h-5" />, text: "Featured Agricultural Placement" },
        { icon: <Users className="w-5 h-5" />, text: "Farmer Network Access" },
        { icon: <Camera className="w-5 h-5" />, text: "Agricultural Photography" }
      ],
      [
        { icon: <Crown className="w-5 h-5" />, text: "VIP Agricultural Specialist" },
        { icon: <Building className="w-5 h-5" />, text: "Premium Agricultural Portfolio" },
        { icon: <BarChart3 className="w-5 h-5" />, text: "Agricultural Analytics Suite" },
        { icon: <TrendingUp className="w-5 h-5" />, text: "Strategic Agricultural Marketing" },
        { icon: <Zap className="w-5 h-5" />, text: "Exclusive Agricultural Access" },
        { icon: <Headphones className="w-5 h-5" />, text: "Dedicated Agricultural Manager" },
        { icon: <Video className="w-5 h-5" />, text: "Professional Farm Videos" },
        { icon: <Users className="w-5 h-5" />, text: "Agricultural Network Manager" },
        { icon: <Presentation className="w-5 h-5" />, text: "Multi-Channel Agricultural Marketing" },
        { icon: <Shield className="w-5 h-5" />, text: "Priority Agricultural Support" }
      ]
    ]
  };

  const howItWorks = [
    "Choose your Builder Lifetime Plan",
    "Showcase unlimited projects & properties",
    "Access premium marketing tools",
    "Connect with verified buyer leads",
    "Boost project visibility & sales",
    "Enjoy lifetime platform benefits"
  ];

  const faqs = [
    {
      question: "What makes Builder Lifetime Plans different from regular plans?",
      answer: "Builder Lifetime Plans provide unlimited project showcasing with no recurring fees, advanced marketing tools, and priority support designed specifically for real estate developers and builders."
    },
    {
      question: "Can I showcase multiple projects simultaneously?",
      answer: "Yes, Platinum and VIP plans allow unlimited project listings. Standard plan has limited listings but you can upgrade anytime."
    },
    {
      question: "What kind of marketing support do I get?",
      answer: "Each plan includes different levels of marketing resources, from basic materials to premium video marketing, virtual tours, and multi-platform promotions for maximum project visibility."
    },
    {
      question: "Are there any recurring charges after purchase?",
      answer: "No, lifetime plans are one-time investments with no recurring charges. All features mentioned are included for the lifetime of your account."
    },
    {
      question: "How does lead generation work?",
      answer: "Our platform connects you with verified buyers actively searching for properties. Higher tier plans get priority lead access and dedicated support for lead conversion."
    },
    {
      question: "What analytics and reporting do I get?",
      answer: "VIP plan includes advanced analytics dashboard with detailed insights on project performance, visitor engagement, and lead conversion metrics."
    }
  ];

  return (
    <div className="bg-background">
      {/* Builder Lifetime Plans */}
      <section className="py-8 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
              Builder Lifetime Plans
            </h2>
          </div>

          <Tabs defaultValue="residential" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-6">
              <TabsTrigger value="residential">Residential</TabsTrigger>
              <TabsTrigger value="commercial">Commercial</TabsTrigger>
              <TabsTrigger value="industrial">Industrial</TabsTrigger>
              <TabsTrigger value="agricultural">Agricultural</TabsTrigger>
            </TabsList>

            {Object.entries(tabPlans).map(([category, plans]) => (
              <TabsContent key={category} value={category} className="space-y-6">
                {/* Plan Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {plans.map((plan, index) => (
                    <Card 
                      key={index} 
                      className={`relative cursor-pointer transition-all duration-200 ${
                        selectedPlans[category as keyof typeof selectedPlans] === index ? 'ring-2 ring-brand-red bg-muted' : 'bg-card hover:shadow-md'
                      }`}
                      onClick={() => setSelectedPlans(prev => ({ ...prev, [category]: index }))}
                    >
                      <div className="absolute top-3 left-3 right-3">
                        <Badge className={`${plan.badgeColor} text-white text-xs px-2 py-1 font-medium w-full text-center`}>
                          {plan.badge}
                        </Badge>
                      </div>
                      
                      <CardContent className="pt-16 pb-6 px-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-3">{plan.name}</h3>
                        <div className="mb-4">
                          <span className="text-2xl font-bold text-gray-900">{plan.price}</span>
                          <div className="text-sm text-gray-500">{plan.gst}</div>
                        </div>
                        
                        <div className="mb-4 text-sm text-gray-600">
                          <strong>Best For:</strong>
                        </div>
                        
                        <PayButton
                          label="Subscribe"
                          planName={`Builder — ${plan.name}`}
                          amountPaise={plan.amountPaise}
                          notes={{ plan: plan.name, category: "builder", type: category }}
                          className={`w-full ${
                            selectedPlans[category as keyof typeof selectedPlans] === index 
                              ? 'bg-brand-red hover:bg-brand-maroon-dark text-white' 
                              : 'bg-transparent text-foreground border border-border hover:bg-muted'
                          }`}
                        />
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Plan Details */}
                <div className={`mt-6 rounded-lg p-6 shadow-sm ${plans[selectedPlans[category as keyof typeof selectedPlans]].badgeColor} bg-opacity-10 border border-opacity-20`} style={{
                  borderColor: plans[selectedPlans[category as keyof typeof selectedPlans]].badgeColor.replace('bg-', ''),
                  backgroundColor: plans[selectedPlans[category as keyof typeof selectedPlans]].badgeColor.replace('bg-', '') + '20'
                }}>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {tabPlanDetails[category as keyof typeof tabPlanDetails][selectedPlans[category as keyof typeof selectedPlans]].map((detail, index) => (
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

      {/* How Our Builder Plans Work */}
      <section className="py-8 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold mb-2">🏗️ Build Your Success Story</h2>
            <p className="text-sm text-muted-foreground">Here's how our lifetime plans help showcase your projects</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {howItWorks.map((step, index) => (
              <Card key={index} className="p-6 text-center">
                <CardContent className="pt-0">
                  <div className="w-10 h-10 bg-brand-red text-white rounded-full flex items-center justify-center mx-auto mb-3 text-lg font-bold">
                    {index + 1}
                  </div>
                  <p className="font-medium text-sm">{step}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h2>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left text-base">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-sm">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-12 px-4 gradient-red-maroon text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Transform Your Builder Business Today — Choose Your Lifetime Plan!
          </h2>
          <Button className="bg-white text-brand-red hover:bg-gray-100 text-base px-6 py-2">
            Start Building Success
          </Button>
        </div>
      </section>
    </div>
  );
};

export default BuilderLifetimePlans;
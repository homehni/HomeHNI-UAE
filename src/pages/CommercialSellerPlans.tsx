import React, { useState } from 'react';
import { Check, Phone, MessageCircle, Quote, Star, Camera, Shield, Globe, TrendingUp, Users, Zap, CheckCircle, Eye, Share2, FileText, Handshake } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PayButton from '@/components/PayButton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import GSTDisplay from '@/components/GSTDisplay';
import { calculateTotalWithGST } from '@/utils/gstCalculator';

const CommercialSellerPlans = () => {
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
        price: "₹2,999",
        amountPaise: 299900,
        gst: "+18% GST", 
        badge: "ESSENTIAL FEATURES",
        badgeColor: "bg-red-600",
      },
      {
        name: "Gold Plan",
        price: "₹7,999",
        amountPaise: 799900,
        gst: "+18% GST",
        badge: "MOST POPULAR",
        badgeColor: "bg-yellow-500",
      },
      {
        name: "Platinum Plan",
        price: "₹12,999",
        amountPaise: 1299900,
        gst: "+18% GST",
        badge: "PREMIUM FEATURES",
        badgeColor: "bg-purple-600",
      }
    ],
    commercial: [
      {
        name: "Business Silver",
        price: "₹8,999",
        amountPaise: 899900,
        gst: "+18% GST", 
        badge: "BUSINESS ESSENTIALS",
        badgeColor: "bg-blue-500",
      },
      {
        name: "Business Gold",
        price: "₹15,999",
        amountPaise: 1599900,
        gst: "+18% GST",
        badge: "BUSINESS POPULAR",
        badgeColor: "bg-indigo-500",
      },
      {
        name: "Business Platinum",
        price: "₹25,999",
        amountPaise: 2599900,
        gst: "+18% GST",
        badge: "BUSINESS PREMIUM",
        badgeColor: "bg-violet-600",
      }
    ],
    industrial: [
      {
        name: "Industrial Silver",
        price: "₹12,999",
        amountPaise: 1299900,
        gst: "+18% GST", 
        badge: "INDUSTRIAL BASICS",
        badgeColor: "bg-gray-600",
      },
      {
        name: "Industrial Gold",
        price: "₹22,999",
        amountPaise: 2299900,
        gst: "+18% GST",
        badge: "INDUSTRIAL PREMIUM",
        badgeColor: "bg-slate-700",
      },
      {
        name: "Industrial Platinum",
        price: "₹35,999",
        amountPaise: 3599900,
        gst: "+18% GST",
        badge: "INDUSTRIAL ELITE",
        badgeColor: "bg-zinc-800",
      }
    ],
    agricultural: [
      {
        name: "Farm Silver",
        price: "₹4,999",
        amountPaise: 499900,
        gst: "+18% GST", 
        badge: "FARM ESSENTIALS",
        badgeColor: "bg-green-600",
      },
      {
        name: "Farm Gold",
        price: "₹9,999",
        amountPaise: 999900,
        gst: "+18% GST",
        badge: "FARM PREMIUM",
        badgeColor: "bg-emerald-600",
      },
      {
        name: "Farm Platinum",
        price: "₹16,999",
        amountPaise: 1699900,
        gst: "+18% GST",
        badge: "FARM ELITE",
        badgeColor: "bg-teal-600",
      }
    ]
  };

  const tabPlanDetails = {
    residential: [
      [
        { icon: <Camera className="w-5 h-5" />, text: "Photoshoot of your property" },
        { icon: <Shield className="w-5 h-5" />, text: "Privacy of your phone number" },
        { icon: <Globe className="w-5 h-5" />, text: "Property listing on website" },
        { icon: <TrendingUp className="w-5 h-5" />, text: "Basic property promotion" },
        { icon: <Phone className="w-5 h-5" />, text: "Call support from our team" }
      ],
      [
        { icon: <Camera className="w-5 h-5" />, text: "Premium photoshoot" },
        { icon: <Shield className="w-5 h-5" />, text: "Complete privacy protection" },
        { icon: <Globe className="w-5 h-5" />, text: "Featured property listing" },
        { icon: <TrendingUp className="w-5 h-5" />, text: "Enhanced property promotion" },
        { icon: <Phone className="w-5 h-5" />, text: "Priority support" },
        { icon: <Users className="w-5 h-5" />, text: "Relationship Manager (RM)" },
        { icon: <Share2 className="w-5 h-5" />, text: "Social media marketing (FB & Insta)" },
        { icon: <Zap className="w-5 h-5" />, text: "Featured listing & promotion boost" },
        { icon: <Handshake className="w-5 h-5" />, text: "Price negotiation support" }
      ],
      [
        { icon: <Camera className="w-5 h-5" />, text: "Elite photoshoot & video tour" },
        { icon: <Shield className="w-5 h-5" />, text: "Maximum privacy & security" },
        { icon: <Globe className="w-5 h-5" />, text: "Premium featured listing" },
        { icon: <TrendingUp className="w-5 h-5" />, text: "Maximum property promotion" },
        { icon: <Phone className="w-5 h-5" />, text: "24/7 dedicated support" },
        { icon: <Users className="w-5 h-5" />, text: "Senior Relationship Manager" },
        { icon: <Share2 className="w-5 h-5" />, text: "Multi-platform marketing campaign" },
        { icon: <Zap className="w-5 h-5" />, text: "Top listing placement guarantee" },
        { icon: <Handshake className="w-5 h-5" />, text: "Expert negotiation & closing support" },
        { icon: <FileText className="w-5 h-5" />, text: "Legal documentation assistance" },
        { icon: <Eye className="w-5 h-5" />, text: "Market analysis & valuation" }
      ]
    ],
    commercial: [
      [
        { icon: <Camera className="w-5 h-5" />, text: "Commercial property photoshoot" },
        { icon: <Shield className="w-5 h-5" />, text: "Business privacy protection" },
        { icon: <Globe className="w-5 h-5" />, text: "Business listing on website" },
        { icon: <TrendingUp className="w-5 h-5" />, text: "Commercial property promotion" },
        { icon: <Phone className="w-5 h-5" />, text: "Business support team" }
      ],
      [
        { icon: <Camera className="w-5 h-5" />, text: "Premium commercial photoshoot" },
        { icon: <Shield className="w-5 h-5" />, text: "Complete business privacy" },
        { icon: <Globe className="w-5 h-5" />, text: "Featured commercial listing" },
        { icon: <TrendingUp className="w-5 h-5" />, text: "Enhanced commercial promotion" },
        { icon: <Phone className="w-5 h-5" />, text: "Priority business support" },
        { icon: <Users className="w-5 h-5" />, text: "Business Relationship Manager" },
        { icon: <Share2 className="w-5 h-5" />, text: "Business social media marketing" },
        { icon: <Zap className="w-5 h-5" />, text: "Premium business listing boost" },
        { icon: <Handshake className="w-5 h-5" />, text: "Commercial negotiation support" }
      ],
      [
        { icon: <Camera className="w-5 h-5" />, text: "Elite commercial documentation & virtual tour" },
        { icon: <Shield className="w-5 h-5" />, text: "Maximum business security & privacy" },
        { icon: <Globe className="w-5 h-5" />, text: "Premium commercial listing placement" },
        { icon: <TrendingUp className="w-5 h-5" />, text: "Maximum commercial promotion reach" },
        { icon: <Phone className="w-5 h-5" />, text: "24/7 dedicated business support" },
        { icon: <Users className="w-5 h-5" />, text: "Senior Commercial Relationship Manager" },
        { icon: <Share2 className="w-5 h-5" />, text: "Multi-channel business marketing campaign" },
        { icon: <Zap className="w-5 h-5" />, text: "Guaranteed top commercial listing placement" },
        { icon: <Handshake className="w-5 h-5" />, text: "Expert commercial negotiation & deal closure" },
        { icon: <FileText className="w-5 h-5" />, text: "Complete legal & documentation support" },
        { icon: <Eye className="w-5 h-5" />, text: "Commercial market analysis & insights" }
      ]
    ],
    industrial: [
      [
        { icon: <Camera className="w-5 h-5" />, text: "Industrial facility photoshoot" },
        { icon: <Shield className="w-5 h-5" />, text: "Industrial privacy protection" },
        { icon: <Globe className="w-5 h-5" />, text: "Industrial listing on website" },
        { icon: <TrendingUp className="w-5 h-5" />, text: "Industrial property promotion" },
        { icon: <Phone className="w-5 h-5" />, text: "Industrial support team" }
      ],
      [
        { icon: <Camera className="w-5 h-5" />, text: "Premium industrial documentation" },
        { icon: <Shield className="w-5 h-5" />, text: "Complete industrial privacy" },
        { icon: <Globe className="w-5 h-5" />, text: "Featured industrial listing" },
        { icon: <TrendingUp className="w-5 h-5" />, text: "Enhanced industrial promotion" },
        { icon: <Phone className="w-5 h-5" />, text: "Priority industrial support" },
        { icon: <Users className="w-5 h-5" />, text: "Industrial Relationship Manager" },
        { icon: <Share2 className="w-5 h-5" />, text: "Industrial network marketing" },
        { icon: <Zap className="w-5 h-5" />, text: "Premium industrial listing boost" },
        { icon: <Handshake className="w-5 h-5" />, text: "Industrial negotiation support" }
      ],
      [
        { icon: <Camera className="w-5 h-5" />, text: "Elite industrial facility documentation & drone survey" },
        { icon: <Shield className="w-5 h-5" />, text: "Maximum industrial security & confidentiality" },
        { icon: <Globe className="w-5 h-5" />, text: "Premium industrial listing with priority placement" },
        { icon: <TrendingUp className="w-5 h-5" />, text: "Comprehensive industrial promotion strategy" },
        { icon: <Phone className="w-5 h-5" />, text: "24/7 dedicated industrial support" },
        { icon: <Users className="w-5 h-5" />, text: "Senior Industrial Relationship Manager" },
        { icon: <Share2 className="w-5 h-5" />, text: "Industrial network & B2B marketing" },
        { icon: <Zap className="w-5 h-5" />, text: "Guaranteed top industrial listing placement" },
        { icon: <Handshake className="w-5 h-5" />, text: "Expert industrial deal negotiation & closure" },
        { icon: <FileText className="w-5 h-5" />, text: "Complete industrial legal & compliance support" },
        { icon: <Eye className="w-5 h-5" />, text: "Industrial market analysis & feasibility study" }
      ]
    ],
    agricultural: [
      [
        { icon: <Camera className="w-5 h-5" />, text: "Farm property photoshoot" },
        { icon: <Shield className="w-5 h-5" />, text: "Farm privacy protection" },
        { icon: <Globe className="w-5 h-5" />, text: "Agricultural listing on website" },
        { icon: <TrendingUp className="w-5 h-5" />, text: "Farm property promotion" },
        { icon: <Phone className="w-5 h-5" />, text: "Agricultural support team" }
      ],
      [
        { icon: <Camera className="w-5 h-5" />, text: "Premium farm documentation" },
        { icon: <Shield className="w-5 h-5" />, text: "Complete farm privacy" },
        { icon: <Globe className="w-5 h-5" />, text: "Featured agricultural listing" },
        { icon: <TrendingUp className="w-5 h-5" />, text: "Enhanced farm promotion" },
        { icon: <Phone className="w-5 h-5" />, text: "Priority agricultural support" },
        { icon: <Users className="w-5 h-5" />, text: "Agricultural Relationship Manager" },
        { icon: <Share2 className="w-5 h-5" />, text: "Farm network marketing" },
        { icon: <Zap className="w-5 h-5" />, text: "Premium farm listing boost" },
        { icon: <Handshake className="w-5 h-5" />, text: "Farm negotiation support" }
      ],
      [
        { icon: <Camera className="w-5 h-5" />, text: "Elite farm documentation & aerial survey" },
        { icon: <Shield className="w-5 h-5" />, text: "Maximum farm security & privacy protection" },
        { icon: <Globe className="w-5 h-5" />, text: "Premium agricultural listing with top placement" },
        { icon: <TrendingUp className="w-5 h-5" />, text: "Comprehensive farm promotion & marketing" },
        { icon: <Phone className="w-5 h-5" />, text: "24/7 dedicated agricultural support" },
        { icon: <Users className="w-5 h-5" />, text: "Senior Agricultural Relationship Manager" },
        { icon: <Share2 className="w-5 h-5" />, text: "Agricultural network & farming community marketing" },
        { icon: <Zap className="w-5 h-5" />, text: "Guaranteed top agricultural listing placement" },
        { icon: <Handshake className="w-5 h-5" />, text: "Expert farm deal negotiation & closure support" },
        { icon: <FileText className="w-5 h-5" />, text: "Complete agricultural legal & documentation assistance" },
        { icon: <Eye className="w-5 h-5" />, text: "Agricultural market analysis & soil assessment" }
      ]
    ]
  };

  const testimonials = [{
    name: "Rajesh Kumar",
    text: "Their Relationship Manager helped me close my showroom deal in just 12 days!",
    hashtag: "#ProfessionalService",
    rating: 5
  }, {
    name: "Priya Sharma",
    text: "From marketing to legal advice, everything was handled professionally.",
    hashtag: "#ProfessionalService",
    rating: 5
  }, {
    name: "Amit Patel",
    text: "I didn't even have to step out — the team showed my property and kept me updated daily.",
    hashtag: "#ProfessionalService",
    rating: 5
  }];

  const faqs = [{
    question: "What will the Relationship Manager handle?",
    answer: "Your dedicated Relationship Manager will handle property showings, buyer screening, price negotiations, documentation assistance, and regular updates on your property's performance and inquiries."
  }, {
    question: "How does the property get listed and promoted?",
    answer: "We'll conduct a professional photoshoot, create compelling listings across our platform, promote on social media (Facebook & Instagram), and feature your property prominently to attract genuine buyers."
  }, {
    question: "Will I be charged in the future for using the platform?",
    answer: "The free period is for a limited time only. After this promotional period ends, our services will become paid. We'll notify you well in advance before any charges apply."
  }, {
    question: "What if I don't want my number shown publicly?",
    answer: "We protect your privacy completely. Your phone number will never be displayed publicly. All buyer inquiries will be filtered through our team and only genuine, verified buyers will be connected to you."
  }, {
    question: "Can I use these services if I'm still deciding to sell?",
    answer: "Absolutely! You can list your property and gauge market interest without any commitment. Our team will provide market insights and help you make an informed decision about selling."
  }];

  return <div className="bg-background">
      {/* Commercial Seller Plans with Tabs */}
      <section id="pricing" className="py-8 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-2 text-gray-900">
             Commercial Seller Plans
          </h2>
          <p className="text-sm text-muted-foreground text-center mb-8">Select the category that best fits your property selling needs</p>
     
          <Tabs defaultValue={(new URLSearchParams(window.location.search).get('category') as 'residential'|'commercial'|'industrial'|'agricultural') || 'residential'} className="w-full">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 mb-6 p-1 gap-1 bg-muted rounded-lg h-auto">
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
                        <div className="mb-6 space-y-1">
                          <div className="text-2xl font-bold text-gray-900">{plan.price}</div>
                          <GSTDisplay basePriceInPaise={plan.amountPaise} />
                        </div>
                        
                        <PayButton
                          label="Subscribe"
                          amountPaise={calculateTotalWithGST(plan.amountPaise)}
                          planName={`Commercial Seller - ${plan.name}`}
                          className={`w-full ${
                            selectedPlans[tabKey as keyof typeof selectedPlans] === index 
                              ? 'bg-brand-red hover:bg-brand-maroon-dark text-white' 
                              : 'bg-transparent text-foreground border border-border hover:bg-muted'
                          }`}
                        />
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

      {/* Testimonials Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900">
             What Our Sellers Say
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => <Card key={index} className="bg-white shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <Quote className="w-8 h-8 text-blue-600 mb-4" />
                  <p className="text-gray-700 mb-4 italic">"{testimonial.text}"</p>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-gray-900">{testimonial.name}</span>
                    <div className="flex">
                      {[...Array(testimonial.rating)].map((_, i) => <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)}
                    </div>
                  </div>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    {testimonial.hashtag}
                  </Badge>
                </CardContent>
              </Card>)}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900">
             Frequently Asked Questions
          </h2>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left font-semibold text-gray-900">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-700">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>)}
          </Accordion>
        </div>
      </section>
    </div>;
};

export default CommercialSellerPlans;

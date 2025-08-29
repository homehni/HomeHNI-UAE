import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, Check, Phone, Home, Users, Shield, Clock, UserCheck, Globe, Lock, FileText, TrendingUp, Camera, Bell, Headphones, Video, BarChart3, Crown, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Marquee from '@/components/Marquee';
import PayButton from '@/components/PayButton';

const AgentPlans = () => {
  const [selectedPlans, setSelectedPlans] = useState({
    basic: 0,
    lifetime: 0
  });

  const tabPlans = {
    basic: [
      {
        name: "Basic Monthly",
        price: "₹2,999/month",
        gst: "+18% GST",
        badge: "GETTING STARTED",
        badgeColor: "bg-blue-500",
        amountPaise: 299900, // ₹2,999 in paise
      },
      {
        name: "Basic Quarterly", 
        price: "₹7,999/quarter",
        gst: "+18% GST",
        badge: "POPULAR CHOICE",
        badgeColor: "bg-green-500",
        amountPaise: 799900, // ₹7,999 in paise
      },
      {
        name: "Basic Yearly",
        price: "₹24,999/year",
        gst: "+18% GST", 
        badge: "BEST VALUE",
        badgeColor: "bg-purple-500",
        amountPaise: 2499900, // ₹24,999 in paise
      }
    ],
    lifetime: [
      {
        name: "Lifetime Standard",
        price: "₹79,999",
        gst: "+18% GST",
        badge: "FOR NEW AGENTS",
        badgeColor: "bg-yellow-500",
        amountPaise: 7999900, // ₹79,999 in paise
      },
      {
        name: "Lifetime Platinum", 
        price: "₹1,49,999",
        gst: "+18% GST",
        badge: "ENHANCED VISIBILITY",
        badgeColor: "bg-green-500",
        amountPaise: 14999900, // ₹1,49,999 in paise
      },
      {
        name: "Lifetime VIP",
        price: "₹2,49,999",
        gst: "+18% GST", 
        badge: "EXCLUSIVE SERVICES",
        badgeColor: "bg-red-500",
        amountPaise: 24999900, // ₹2,49,999 in paise
      }
    ]
  };

  const planDetails = {
    basic: [
      // Basic Monthly features
      [
        { icon: <Bell className="w-5 h-5" />, text: "Property Alerts & Notifications" },
        { icon: <Home className="w-5 h-5" />, text: "Up to 10 Property Listings" },
        { icon: <Headphones className="w-5 h-5" />, text: "Email Support" },
        { icon: <FileText className="w-5 h-5" />, text: "Basic Marketing Materials" }
      ],
      // Basic Quarterly features
      [
        { icon: <Bell className="w-5 h-5" />, text: "Property Alerts & Notifications" },
        { icon: <Home className="w-5 h-5" />, text: "Up to 50 Property Listings" },
        { icon: <Headphones className="w-5 h-5" />, text: "Phone & Email Support" },
        { icon: <Video className="w-5 h-5" />, text: "Basic Virtual Tour Tools" },
        { icon: <TrendingUp className="w-5 h-5" />, text: "Basic Analytics Dashboard" },
        { icon: <Globe className="w-5 h-5" />, text: "Standard Listing Visibility" }
      ],
      // Basic Yearly features
      [
        { icon: <Bell className="w-5 h-5" />, text: "Property Alerts & Notifications" },
        { icon: <Home className="w-5 h-5" />, text: "Up to 200 Property Listings" },
        { icon: <Headphones className="w-5 h-5" />, text: "Priority Phone & Email Support" },
        { icon: <Video className="w-5 h-5" />, text: "Advanced Virtual Tour Tools" },
        { icon: <TrendingUp className="w-5 h-5" />, text: "Enhanced Analytics Dashboard" },
        { icon: <Globe className="w-5 h-5" />, text: "Enhanced Listing Visibility" },
        { icon: <Users className="w-5 h-5" />, text: "Lead Generation Tools" },
        { icon: <Camera className="w-5 h-5" />, text: "Photography Credits" }
      ]
    ],
    lifetime: [
      // Lifetime Standard features
      [
        { icon: <Bell className="w-5 h-5" />, text: "Property Alerts & Notifications" },
        { icon: <Home className="w-5 h-5" />, text: "Unlimited Property Listings" },
        { icon: <Headphones className="w-5 h-5" />, text: "Basic Customer Support" },
        { icon: <FileText className="w-5 h-5" />, text: "Standard Marketing Materials" }
      ],
      // Lifetime Platinum features
      [
        { icon: <Bell className="w-5 h-5" />, text: "Property Alerts & Notifications" },
        { icon: <Home className="w-5 h-5" />, text: "Unlimited Property Listings" },
        { icon: <Headphones className="w-5 h-5" />, text: "Priority Customer Support" },
        { icon: <Video className="w-5 h-5" />, text: "Virtual Tour Creation Tools" },
        { icon: <TrendingUp className="w-5 h-5" />, text: "Enhanced Marketing Resources" },
        { icon: <Globe className="w-5 h-5" />, text: "Featured Listing Placement" },
        { icon: <Users className="w-5 h-5" />, text: "Lead Generation Support" },
        { icon: <Camera className="w-5 h-5" />, text: "Professional Photography Credits" }
      ],
      // Lifetime VIP features
      [
        { icon: <Crown className="w-5 h-5" />, text: "VIP Concierge Service" },
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
    "Choose your Agent Plan",
    "Get unlimited property listings access",
    "Access marketing tools and resources",
    "Connect with verified property leads",
    "Grow your agent business exponentially",
    "Enjoy lifetime benefits and support"
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
    <div className="min-h-screen bg-background">
      <Marquee />
      <Header />
      
      {/* Hero Section */}
      <section 
        className="relative text-white py-16 px-4 pt-28 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('/lovable-uploads/65ce32d0-061c-4934-8723-62372be4cd91.png')`
        }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-6">
            Choose an Agent Plan and Grow Your <span className="text-yellow-400">REAL ESTATE</span> Business
          </h1>

          <p className="text-lg md:text-xl mb-6 max-w-3xl mx-auto">
            Trusted by thousands of real estate agents. Choose the plan that accelerates your business growth
          </p>
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="flex">
              {[1, 2, 3, 4, 5].map(star => <Star key={star} className="w-5 h-5 fill-yellow-400 text-yellow-400" />)}
            </div>
            <span className="ml-2"> 5 Stars Rated by Agents</span>
          </div>
        </div>
      </section>

      {/* Agent Plans with Tabs */}
      <section className="py-16 px-4 bg-gray-50" id="pricing">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Choose Your Agent Plan
          </h2>
          <p className="text-lg text-muted-foreground text-center mb-12">Select between flexible basic plans or lifetime access</p>

          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="basic" className="text-sm md:text-base">Basic Plan</TabsTrigger>
              <TabsTrigger value="lifetime" className="text-sm md:text-base">Lifetime</TabsTrigger>
            </TabsList>

            {Object.entries(tabPlans).map(([tabKey, plans]) => (
              <TabsContent key={tabKey} value={tabKey} className="space-y-8">
                {/* Plan Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                          <span className="text-2xl font-bold text-gray-900">{plan.price}</span>
                          <div className="text-sm text-gray-500">{plan.gst}</div>
                        </div>
                        
                        <div className="mb-6 text-sm text-gray-600">
                          <strong>Best For:</strong> {bestForDescriptions[tabKey as keyof typeof bestForDescriptions][index]}
                        </div>
                        
                        <PayButton
                          label="Subscribe"
                          planName={`Agent — ${plan.name}`}
                          amountPaise={plan.amountPaise}
                          notes={{ plan: plan.name, category: "agent", type: tabKey }}
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

                {/* Selected Plan Details */}
                <div className="bg-white rounded-lg border p-6">
                  <h3 className="text-xl font-bold mb-4">
                    {plans[selectedPlans[tabKey as keyof typeof selectedPlans]].name} Features
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {planDetails[tabKey as keyof typeof planDetails][selectedPlans[tabKey as keyof typeof selectedPlans]].map((feature, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <div className="text-brand-red">{feature.icon}</div>
                        <span className="text-sm text-gray-700">{feature.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {howItWorks.map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-12 h-12 bg-brand-red text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {index + 1}
                </div>
                <p className="text-gray-700">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Frequently Asked Questions</h2>
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

      {/* Final CTA Section */}
      <section className="py-16 px-4 bg-brand-red text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Transform Your Real Estate Business?
          </h2>
          <p className="text-lg mb-8">
            Join thousands of successful agents who have accelerated their growth with our plans
          </p>
          <Button 
            onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
            className="bg-white text-brand-red hover:bg-gray-100 font-medium px-8 py-3"
          >
            Choose Your Plan Now
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AgentPlans;
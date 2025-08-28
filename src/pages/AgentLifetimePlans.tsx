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

const AgentLifetimePlans = () => {
  const [selectedPlan, setSelectedPlan] = useState(0);

  const plans = [
    {
      name: "Lifetime Standard",
      price: "₹79,999 - ₹1,49,999",
      gst: "+18% GST",
      badge: "FOR NEW AGENTS",
      badgeColor: "bg-yellow-500",
    },
    {
      name: "Lifetime Platinum", 
      price: "₹1,49,999 - ₹2,49,999",
      gst: "+18% GST",
      badge: "ENHANCED VISIBILITY",
      badgeColor: "bg-green-500",
    },
    {
      name: "Lifetime VIP",
      price: "₹2,49,999",
      gst: "+18% GST", 
      badge: "EXCLUSIVE SERVICES",
      badgeColor: "bg-red-500",
    }
  ];

  const planDetails = [
    // Lifetime Standard features
    [
      { icon: <Bell className="w-5 h-5" />, text: "Property Alerts & Notifications" },
      { icon: <Home className="w-5 h-5" />, text: "Limited Property Listings" },
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
  ];

  const bestForDescriptions = [
    "New agents or those starting out with moderate exposure needs",
    "Established agents looking for unlimited listings, enhanced visibility, and support",
    "Top-tier agents or agents handling luxury listings, requiring exclusive services and promotions"
  ];

  const howItWorks = [
    "Choose your Agent Lifetime Plan",
    "Get unlimited property listings access",
    "Access marketing tools and resources",
    "Connect with verified property leads",
    "Grow your agent business exponentially",
    "Enjoy lifetime benefits and support"
  ];

  const faqs = [
    {
      question: "What makes Agent Lifetime Plans different from regular plans?",
      answer: "Agent Lifetime Plans provide unlimited access to our platform with no recurring fees, enhanced marketing tools, and priority support designed specifically for real estate professionals."
    },
    {
      question: "Can I upgrade my plan later?",
      answer: "Yes, you can upgrade to a higher tier plan by paying the difference. Contact our support team for assistance with plan upgrades."
    },
    {
      question: "What kind of support do I get with each plan?",
      answer: "Standard includes basic support, Platinum offers priority support with dedicated channels, and VIP provides 24/7 personal account management."
    },
    {
      question: "Are there any hidden charges after purchase?",
      answer: "No, lifetime plans are one-time payments with no recurring charges. All features mentioned are included for life."
    },
    {
      question: "How do marketing resources work?",
      answer: "Each plan includes different levels of marketing materials, from basic templates to premium video marketing and multi-platform promotions."
    },
    {
      question: "What happens if I need more listings than my plan allows?",
      answer: "Standard plan has limited listings. Platinum and VIP plans offer unlimited listings. You can upgrade anytime to access more features."
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
            Choose an Agent Lifetime Plan and Get <span className="text-yellow-400">UNLIMITED</span> Property Listings
          </h1>

          <p className="text-lg md:text-xl mb-6 max-w-3xl mx-auto">
            Trusted by thousands of real estate agents. Choose the lifetime plan that accelerates your business growth
          </p>
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="flex">
              {[1, 2, 3, 4, 5].map(star => <Star key={star} className="w-5 h-5 fill-yellow-400 text-yellow-400" />)}
            </div>
            <span className="ml-2"> 5 Stars Rated by Agents</span>
          </div>
        </div>
      </section>

      {/* Agent Lifetime Plans */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Agent Lifetime Plans
            </h2>
          </div>

          {/* Plan Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {plans.map((plan, index) => (
              <Card 
                key={index} 
                className={`relative cursor-pointer transition-all duration-200 ${
                  selectedPlan === index ? 'ring-2 ring-brand-red bg-muted' : 'bg-card hover:shadow-md'
                }`}
                onClick={() => setSelectedPlan(index)}
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
                    <strong>Best For:</strong> {bestForDescriptions[index]}
                  </div>
                  
                  <Button 
                    className={`w-full ${
                      selectedPlan === index 
                        ? 'bg-brand-red hover:bg-brand-maroon-dark text-white' 
                        : 'bg-transparent text-foreground border border-border hover:bg-muted'
                    }`}
                  >
                    Choose Plan
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Plan Details */}
          <div className={`mt-8 rounded-lg p-8 shadow-sm ${plans[selectedPlan].badgeColor} bg-opacity-10 border border-opacity-20`} style={{
            borderColor: plans[selectedPlan].badgeColor.replace('bg-', ''),
            backgroundColor: plans[selectedPlan].badgeColor.replace('bg-', '') + '20'
          }}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {planDetails[selectedPlan].map((detail, index) => (
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
          </div>

          {/* Contact Info */}
          <div className="mt-8 text-center">
            <p className="text-gray-600 mb-2">
              For assistance call us at: <span className="text-brand-red font-semibold">+91-92-430-099-80</span>
            </p>
            <p className="text-sm text-gray-500">
              <span className="underline cursor-pointer hover:text-gray-700">Terms & Conditions Apply</span>
            </p>
          </div>
        </div>
      </section>

      {/* How Our Agent Plans Work */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">🚀 Accelerate Your Agent Business</h2>
            <p className="text-lg text-muted-foreground">Here's how our lifetime plans help you succeed</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {howItWorks.map((step, index) => (
              <Card key={index} className="p-6 text-center">
                <CardContent className="pt-0">
                  <div className="w-12 h-12 bg-brand-red text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                    {index + 1}
                  </div>
                  <p className="font-medium">{step}</p>
                </CardContent>
              </Card>
            ))}
          </div>
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

      {/* Final CTA */}
      <section className="py-16 px-4 gradient-red-maroon text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Start Your Agent Success Journey Today — Choose Your Lifetime Plan!
          </h2>
          <Button className="bg-white text-brand-red hover:bg-gray-100 text-lg px-8 py-3">
            Get Started Now
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AgentLifetimePlans;
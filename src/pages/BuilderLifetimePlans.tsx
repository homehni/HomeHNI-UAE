import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, Check, Phone, Home, Users, Shield, Clock, UserCheck, Globe, Lock, FileText, TrendingUp, Camera, Bell, Headphones, Video, BarChart3, Crown, Zap, Building, Presentation } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Marquee from '@/components/Marquee';

const BuilderLifetimePlans = () => {
  const [selectedPlan, setSelectedPlan] = useState(0);

  const plans = [
    {
      name: "Lifetime Standard",
      price: "₹1,49,999 - ₹2,49,999",
      gst: "+18% GST",
      badge: "PROJECT SHOWCASE",
      badgeColor: "bg-yellow-500",
    },
    {
      name: "Lifetime Platinum", 
      price: "₹2,49,999 - ₹3,99,999",
      gst: "+18% GST",
      badge: "ENHANCED MARKETING",
      badgeColor: "bg-green-500",
    },
    {
      name: "Lifetime VIP",
      price: "₹3,99,999",
      gst: "+18% GST", 
      badge: "PREMIUM SHOWCASE",
      badgeColor: "bg-red-500",
    }
  ];

  const planDetails = [
    // Lifetime Standard features
    [
      { icon: <Bell className="w-5 h-5" />, text: "Property Alerts & Notifications" },
      { icon: <Building className="w-5 h-5" />, text: "Limited Project Listings" },
      { icon: <Headphones className="w-5 h-5" />, text: "Basic Customer Support" },
      { icon: <FileText className="w-5 h-5" />, text: "Standard Marketing Materials" }
    ],
    // Lifetime Platinum features
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
    // Lifetime VIP features
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
  ];

  const bestForDescriptions = [
    "New builders or those starting out with moderate project exposure needs",
    "Established builders looking for unlimited listings, enhanced visibility, and marketing support",
    "Top-tier builders or those handling luxury projects, requiring exclusive services and premium promotions"
  ];

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
            Choose a Builder Lifetime Plan and <span className="text-yellow-400">SHOWCASE</span> Your Projects
          </h1>

          <p className="text-lg md:text-xl mb-6 max-w-3xl mx-auto">
            Trusted by leading builders and developers. Choose the lifetime plan that accelerates your project sales
          </p>
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="flex">
              {[1, 2, 3, 4, 5].map(star => <Star key={star} className="w-5 h-5 fill-yellow-400 text-yellow-400" />)}
            </div>
            <span className="ml-2"> 5 Stars Rated by Builders</span>
          </div>
        </div>
      </section>

      {/* Builder Lifetime Plans */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Builder Lifetime Plans
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

      {/* How Our Builder Plans Work */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">🏗️ Build Your Success Story</h2>
            <p className="text-lg text-muted-foreground">Here's how our lifetime plans help showcase your projects</p>
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
            Transform Your Builder Business Today — Choose Your Lifetime Plan!
          </h2>
          <Button className="bg-white text-brand-red hover:bg-gray-100 text-lg px-8 py-3">
            Start Building Success
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default BuilderLifetimePlans;
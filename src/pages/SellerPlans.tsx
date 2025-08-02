import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Star, Phone, Camera, Shield, Users, Megaphone, UserCheck, Zap, CheckCircle, Clock, Globe, Lock, FileText, TrendingUp } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Marquee from "@/components/Marquee";
import { Link } from "react-router-dom";
const SellerPlans: React.FC = () => {
  const [selectedPlan, setSelectedPlan] = useState(0);

  const plans = [
    {
      name: "Silver Plan",
      price: "₹6,499",
      gst: "+18% GST",
      badge: "BASIC PROMOTION",
      badgeColor: "bg-yellow-500",
    },
    {
      name: "Gold Plan", 
      price: "₹9,999",
      gst: "+18% GST",
      badge: "SOCIAL BOOST",
      badgeColor: "bg-green-500",
    },
    {
      name: "Platinum Plan",
      price: "₹14,999",
      gst: "+18% GST", 
      badge: "100% GUARANTEE",
      badgeColor: "bg-red-500",
    },
    {
      name: "Diamond Plan",
      price: "₹20,000",
      gst: "+18% GST",
      badge: "PERSONAL FIELD ASSISTANT", 
      badgeColor: "bg-purple-500",
    }
  ];

  const planDetails = [
    // Basic plan features
    [
      { icon: <Clock className="w-5 h-5" />, text: "90 Days Plan Validity" },
      { icon: <Users className="w-5 h-5" />, text: "Guaranteed Buyers Or 100% Moneyback" },
      { icon: <UserCheck className="w-5 h-5" />, text: "Relationship Manager (RM)- Super Fast Closure" },
      { icon: <FileText className="w-5 h-5" />, text: "Sale Agreement Support" }
    ],
    // Mid plan features (includes Basic features)
    [
      { icon: <Clock className="w-5 h-5" />, text: "90 Days Plan Validity" },
      { icon: <Users className="w-5 h-5" />, text: "Guaranteed Buyers Or 100% Moneyback" },
      { icon: <UserCheck className="w-5 h-5" />, text: "Relationship Manager (RM)- Super Fast Closure" },
      { icon: <FileText className="w-5 h-5" />, text: "Sale Agreement Support" },
      { icon: <TrendingUp className="w-5 h-5" />, text: "Top Slot Listing For 5x More Visibility" },
      { icon: <Globe className="w-5 h-5" />, text: "Property Promotion On Website" },
      { icon: <Megaphone className="w-5 h-5" />, text: "Social Media Marketing" },
      { icon: <Lock className="w-5 h-5" />, text: "Privacy Of Your Phone Number" }
    ],
    // Guaranteed plan features (includes previous features)
    [
      { icon: <Clock className="w-5 h-5" />, text: "90 Days Plan Validity" },
      { icon: <Users className="w-5 h-5" />, text: "Guaranteed Buyers Or 100% Moneyback" },
      { icon: <UserCheck className="w-5 h-5" />, text: "Relationship Manager (RM)- Super Fast Closure" },
      { icon: <FileText className="w-5 h-5" />, text: "Sale Agreement Support" },
      { icon: <TrendingUp className="w-5 h-5" />, text: "Top Slot Listing For 5x More Visibility" },
      { icon: <Globe className="w-5 h-5" />, text: "Property Promotion On Website" },
      { icon: <Megaphone className="w-5 h-5" />, text: "Social Media Marketing" },
      { icon: <Lock className="w-5 h-5" />, text: "Privacy Of Your Phone Number" },
      { icon: <UserCheck className="w-5 h-5" />, text: "Personal Field Assistant" },
      { icon: <Users className="w-5 h-5" />, text: "Showing Property On Your Behalf" },
      { icon: <Camera className="w-5 h-5" />, text: "Professional Photoshoot Of Your Property" }
    ],
    // Elite plan features (includes all previous features)
    [
      { icon: <Clock className="w-5 h-5" />, text: "90 Days Plan Validity" },
      { icon: <Users className="w-5 h-5" />, text: "Guaranteed Buyers Or 100% Moneyback" },
      { icon: <UserCheck className="w-5 h-5" />, text: "Relationship Manager (RM)- Super Fast Closure" },
      { icon: <FileText className="w-5 h-5" />, text: "Sale Agreement Support" },
      { icon: <TrendingUp className="w-5 h-5" />, text: "Top Slot Listing For 5x More Visibility" },
      { icon: <Globe className="w-5 h-5" />, text: "Property Promotion On Website" },
      { icon: <Megaphone className="w-5 h-5" />, text: "Social Media Marketing" },
      { icon: <Lock className="w-5 h-5" />, text: "Privacy Of Your Phone Number" },
      { icon: <UserCheck className="w-5 h-5" />, text: "Personal Field Assistant" },
      { icon: <Users className="w-5 h-5" />, text: "Showing Property On Your Behalf" },
      { icon: <Camera className="w-5 h-5" />, text: "Professional Photoshoot Of Your Property" },
      { icon: <Shield className="w-5 h-5" />, text: "Premium Customer Support" },
      { icon: <FileText className="w-5 h-5" />, text: "Legal Documentation Assistance" }
    ]
  ];
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
    answer: "None. All charges are transparent. Currently, plans are free."
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
    description: "Sell your property quickly at a fractional cost (now ₹0)."
  }];
  return (
    <div className="min-h-screen bg-background">
      <Marquee />
      <Header />
      
      {/* Hero Section */}
    <section className="gradient-red-maroon py-20 md:py-28">
  <div className="container mx-auto px-4 text-center max-w-4xl">
    <h1 className="text-3xl md:text-5xl font-bold text-white mb-6">
      Get Buyers Quickly. SAVE LAKHS on Brokerage
    </h1>
  </div>
</section>





      {/* Pricing Plans */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Seller Plans
            </h2>
          </div>

          {/* Plan Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
                  <div className="mb-6">
                    <span className="text-2xl font-bold text-gray-900">{plan.price}</span>
                    <div className="text-sm text-gray-500">{plan.gst}</div>
                  </div>
                  
                  <Button 
                    className={`w-full ${
                      selectedPlan === index 
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
          <div className="mt-8 bg-card rounded-lg p-8 shadow-sm">
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

      {/* Disclaimer */}
      

      {/* How It Works */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
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
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Sell Your Property Fast and Hassle-Free?
          </h2>
          <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-white/90">
            Get Started for Free
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};
export default SellerPlans;
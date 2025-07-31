import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Star, Phone, Camera, Shield, Users, Megaphone, UserCheck, Zap, CheckCircle } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Marquee from "@/components/Marquee";
import { Link } from "react-router-dom";
const SellerPlans: React.FC = () => {
  const plans = [{
    name: "Relax Plan",
    price: "₹7,499 + GST",
    originalPrice: "₹7,499 + GST",
    description: "Get Buyers Quickly. Save Lakhs on Brokerage.",
    color: "border-green-500 bg-green-50",
    features: ["Plan Validity: 3 Months", "Property promotion on site", "Photoshoot of your property", "Privacy of your phone number"],
    icon: <CheckCircle className="w-6 h-6 text-green-600" />
  }, {
    name: "Super Relax Plan",
    price: "₹13,499 + GST",
    originalPrice: "₹13,499 + GST",
    description: "Leave your house keys and worries to us. Get buyer super-fast.",
    color: "border-blue-500 bg-blue-50",
    features: ["All Relax Plan benefits", "Field Assistant shows property on your behalf", "Facebook marketing of your property", "Relationship Manager for follow-ups"],
    icon: <Users className="w-6 h-6 text-blue-600" />
  }, {
    name: "MoneyBack Plan",
    price: "₹16,499 + GST",
    originalPrice: "₹16,499 + GST",
    description: "Guaranteed buyers or Moneyback. RM for super-fast closure.",
    color: "border-purple-500 bg-purple-50",
    features: ["Guaranteed buyer leads or refund", "Relationship Manager", "High-priority listing and social media push", "3-month validity"],
    icon: <Shield className="w-6 h-6 text-purple-600" />
  }, {
    name: "Super MoneyBack Plan",
    price: "₹20,999 + GST",
    originalPrice: "₹20,999 + GST",
    description: "Guaranteed buyers or Moneyback. Hire Field Assistant for showing your house.",
    color: "border-orange-500 bg-orange-50",
    features: ["Everything in MoneyBack Plan", "Dedicated Field Assistant", "Top slot property visibility", "End-to-end buyer coordination"],
    icon: <Zap className="w-6 h-6 text-orange-600" />
  }];
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
  return <div className="min-h-screen bg-background">
      <Marquee />
      <Header />
      
      {/* Hero Section */}
      <section className="gradient-red-maroon py-16 md:py-24">
        <div className="container mx-auto px-4 text-center max-w-4xl">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Get Buyers Quickly. SAVE LAKHS on Brokerage
          </h1>
          
         
        </div>
      </section>



      {/* Plans Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Seller Plans
            </h2>
           
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {plans.map((plan, index) => <Card key={index} className={`relative ${plan.color} border-2 hover:shadow-lg transition-shadow`}>
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-2 mb-2">
                    {plan.icon}
                    <CardTitle className="text-xl font-bold">{plan.name}</CardTitle>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-foreground mb-1">{plan.price}</div>
                    <div className="text-sm text-muted-foreground line-through">{plan.originalPrice}</div>
                   
                  </div>
                  <CardDescription className="text-center font-medium text-foreground/80 italic">
                    "{plan.description}"
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-2">
                    {plan.features.map((feature, featureIndex) => <li key={featureIndex} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>)}
                  </ul>
                  <Button className="w-full" size="lg">
                    Subscribe Now
                  </Button>
                </CardContent>
              </Card>)}
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
    </div>;
};
export default SellerPlans;
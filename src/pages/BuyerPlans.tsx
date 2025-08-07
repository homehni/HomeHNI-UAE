import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, Check, Phone, Home, Users, Shield, Clock, UserCheck, Globe, Lock, FileText, TrendingUp, Camera } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Marquee from '@/components/Marquee';
const BuyerPlans = () => {
  const [selectedPlan, setSelectedPlan] = useState(0);

  const plans = [
    {
      name: "Silver Plan",
      price: "₹2,399",
      gst: "+18% GST",
      badge: "BASIC SEARCH",
      badgeColor: "bg-yellow-500",
    },
    {
      name: "Gold Plan", 
      price: "₹2,499",
      gst: "+18% GST",
      badge: "EXPERT ASSISTANCE",
      badgeColor: "bg-green-500",
    },
    {
      name: "Platinum Plan",
      price: "₹4,999",
      gst: "+18% GST", 
      badge: "EXCLUSIVE SUPPORT",
      badgeColor: "bg-red-500",
    }
  ];

  const planDetails = [
    // Power plan features
    [
      { icon: <Clock className="w-5 h-5" />, text: "90 Days Plan Validity" },
      { icon: <Home className="w-5 h-5" />, text: "View up to 25 Property Contacts" },
      { icon: <UserCheck className="w-5 h-5" />, text: "Complimentary Legal Consultation" },
      { icon: <FileText className="w-5 h-5" />, text: "Loan Assistance Support" }
    ],
    // Property Expert plan features (includes Power features)
    [
      { icon: <Clock className="w-5 h-5" />, text: "90 Days Plan Validity" },
      { icon: <Home className="w-5 h-5" />, text: "View up to 50 Property Contacts" },
      { icon: <UserCheck className="w-5 h-5" />, text: "Complimentary Legal Consultation" },
      { icon: <FileText className="w-5 h-5" />, text: "Loan Assistance Support" },
      { icon: <Users className="w-5 h-5" />, text: "Dedicated Property Expert" },
      { icon: <TrendingUp className="w-5 h-5" />, text: "Expert Negotiates Best Price" },
      { icon: <Globe className="w-5 h-5" />, text: "Helps Schedule Property Visits" },
      { icon: <Home className="w-5 h-5" />, text: "FREE Interior Consultation" }
    ],
    // MoneyBack plan features (includes previous features)
    [
      { icon: <Clock className="w-5 h-5" />, text: "90 Days Plan Validity" },
      { icon: <Home className="w-5 h-5" />, text: "View up to 50 Property Contacts" },
      { icon: <UserCheck className="w-5 h-5" />, text: "Complimentary Legal Consultation" },
      { icon: <FileText className="w-5 h-5" />, text: "Loan Assistance Support" },
      { icon: <Users className="w-5 h-5" />, text: "Dedicated Property Expert" },
      { icon: <TrendingUp className="w-5 h-5" />, text: "Expert Negotiates Best Price" },
      { icon: <Globe className="w-5 h-5" />, text: "Helps Schedule Property Visits" },
      { icon: <Home className="w-5 h-5" />, text: "FREE Interior Consultation" },
      { icon: <UserCheck className="w-5 h-5" />, text: "Expert Handles Everything" },
      { icon: <TrendingUp className="w-5 h-5" />, text: "Priority Customer Support" }
    ]
  ];
  const howItWorks = ["We gather your requirements", "Connect you with verified listings", "Schedule property visits", "Help you negotiate price", "Assist in finalizing the deal", "Provide city-level property expertise"];
  const faqs = [{
    question: "What does a Property Expert do?",
    answer: "Helps you shortlist, schedule visits, negotiate pricing, and close deals faster."
  }, {
    question: "How does Property Expert/Power Plan compare?",
    answer: "Power is basic assistance. Expert Plans come with dedicated support and more features."
  }, {
    question: "What if I don't find a house after subscribing?",
    answer: "With the MoneyBack Plan, you are eligible for a full refund if we don't deliver."
  }, {
    question: "How soon will I get a house?",
    answer: "Most users find a property within a few days to 2 weeks, depending on availability."
  }, {
    question: "Are there hidden charges?",
    answer: "No. The plans are 100% transparent. You pay only what's shown — currently ₹0."
  }, {
    question: "Can I pay for the plan after I find a house?",
    answer: "For now, it's FREE. Later pricing models may change."
  }];
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
            Choose a Buyer Plan and <span className="text-yellow-400">SAVE LAKHS</span> on Brokerage
          </h1>

          <p className="text-lg md:text-xl mb-6 max-w-3xl mx-auto">
            Trusted by 3 Lakh+ Buyers like you. Choose the plan that suits you 
          </p>
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="flex">
              {[1, 2, 3, 4, 5].map(star => <Star key={star} className="w-5 h-5 fill-yellow-400 text-yellow-400" />)}
            </div>
            <span className="ml-2"> 5 Stars Rated</span>
          </div>
          
         
        </div>
      </section>

      {/* Buyer Plans */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Buyer Plans
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

      {/* Disclaimer Banner */}
      

      {/* How Our Assisted Plans Work */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">👋 Say Hello to Your House-Hunt Assistant</h2>
            <p className="text-lg text-muted-foreground">Here's how we help you find your dream home</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {howItWorks.map((step, index) => <Card key={index} className="p-6 text-center">
                <CardContent className="pt-0">
                  <div className="w-12 h-12 bg-brand-red text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                    {index + 1}
                  </div>
                  <p className="font-medium">{step}</p>
                </CardContent>
              </Card>)}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent>
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>)}
          </Accordion>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 px-4 gradient-red-maroon text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Let's Find You the Perfect Home — At Zero Brokerage!
          </h2>
          <Button className="bg-white text-brand-red hover:bg-gray-100 text-lg px-8 py-3">
            Start Your Free Plan
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};
export default BuyerPlans;
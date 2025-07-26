import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Check, Phone, Home, Users, Shield } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Marquee from '@/components/Marquee';

const BuyerPlans = () => {
  const plans = [
    {
      name: "Power Plan",
      price: "₹0",
      originalPrice: "₹2,399 + 18% GST",
      color: "bg-green-500",
      icon: <Home className="w-6 h-6" />,
      tagline: "Choose your dream home from lots of verified listings",
      features: [
        "View up to 25 property contacts",
        "Complimentary legal consultation with experts",
        "Loan Assistance",
        "On-Demand Support"
      ]
    },
    {
      name: "Property Expert Plan",
      price: "₹0",
      originalPrice: "₹2,499 + 18% GST",
      color: "bg-blue-500",
      icon: <Users className="w-6 h-6" />,
      tagline: "Get FREE Loan Assistance + 100% Cashback on plan amount* + Property Expert",
      features: [
        "Dedicated Property Expert",
        "Expert negotiates to get you the best price",
        "Helps schedule visits and shortlists properties",
        "FREE Loan Assistance",
        "FREE Interior Consultation after finalizing property",
        "View up to 50 property contacts",
        "Complimentary legal consultation"
      ]
    },
    {
      name: "Property Expert MoneyBack Plan",
      price: "₹0",
      originalPrice: "₹4,999 + 18% GST",
      color: "bg-red-500",
      icon: <Shield className="w-6 h-6" />,
      tagline: "Get Guaranteed property or 100% Refund",
      features: [
        "Guaranteed Property or 100% Refund (T&C)",
        "All features of Expert Plan",
        "Dedicated Property Expert",
        "Expert negotiates to get you the best price",
        "FREE Loan Assistance",
        "FREE Interior Design Consultation",
        "View up to 50 property contacts",
        "Expert handles everything from contact to negotiation"
      ]
    }
  ];

  const howItWorks = [
    "We gather your requirements",
    "Connect you with verified listings",
    "Schedule property visits",
    "Help you negotiate price",
    "Assist in finalizing the deal",
    "Provide city-level property expertise"
  ];

  const faqs = [
    {
      question: "What does a Property Expert do?",
      answer: "Helps you shortlist, schedule visits, negotiate pricing, and close deals faster."
    },
    {
      question: "How does Property Expert/Power Plan compare?",
      answer: "Power is basic assistance. Expert Plans come with dedicated support and more features."
    },
    {
      question: "What if I don't find a house after subscribing?",
      answer: "With the MoneyBack Plan, you are eligible for a full refund if we don't deliver."
    },
    {
      question: "How soon will I get a house?",
      answer: "Most users find a property within a few days to 2 weeks, depending on availability."
    },
    {
      question: "Are there hidden charges?",
      answer: "No. The plans are 100% transparent. You pay only what's shown — currently ₹0."
    },
    {
      question: "Can I pay for the plan after I find a house?",
      answer: "For now, it's FREE. Later pricing models may change."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Marquee />
      <Header />
      
      {/* Hero Section */}
      <section className="gradient-red-maroon text-white py-16 px-4 pt-28">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-6">
            Choose a Buyer Plan and <span className="text-yellow-400">SAVE LAKHS</span> on Brokerage
          </h1>
          <p className="text-lg md:text-xl mb-6 max-w-3xl mx-auto">
            All plans are currently FREE for a limited time. Get expert assistance and find your dream home without paying brokerage!
          </p>
         
        </div>
      </section>

      {/* Buyer Plans */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <Card key={index} className="relative overflow-hidden hover:shadow-lg transition-shadow border-2">
                <CardHeader className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <Badge className={`${plan.color} text-white`}>
                      {plan.icon}
                    </Badge>
                    <h3 className="text-xl font-bold">{plan.name}</h3>
                  </div>
                  <div className="mb-4">
                    <div className="text-4xl font-bold text-brand-red">{plan.price}</div>
                    <div className="text-sm text-muted-foreground line-through">
                      Original {plan.originalPrice}
                    </div>
                    <div className="text-sm font-medium text-green-600">
                      Now Free – Limited Time Only
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">{plan.tagline}</p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full">Subscribe Now</Button>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {/* Plan Validity Note */}
          <div className="text-center mt-8">
            <p className="text-muted-foreground">
              All Plans are valid for 3 months. <span className="text-brand-red font-medium">T&C apply.</span>
            </p>
          </div>
        </div>
      </section>

      {/* Disclaimer Banner */}
      <section className="py-8 px-4 bg-yellow-50">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-yellow-100 border border-yellow-300 rounded-lg p-6">
            <p className="text-yellow-800 font-medium">
              <strong>Important:</strong> All plans are currently offered at ₹0 as part of our launch offer. 
              Pricing will be introduced soon. Subscribe early and enjoy the benefits!
            </p>
          </div>
        </div>
      </section>

      {/* How Our Assisted Plans Work */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">👋 Say Hello to Your House-Hunt Assistant</h2>
            <p className="text-lg text-muted-foreground">Here's how we help you find your dream home</p>
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
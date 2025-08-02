import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, Check, Phone, Clock, Users, Shield, UserCheck, Globe, Camera, Lock, FileText, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Marquee from '@/components/Marquee';
const OwnerPlans = () => {
  const [selectedPlan, setSelectedPlan] = useState(0);

  const plans = [
    {
      name: "Silver",
      price: "₹3,399",
      gst: "+18% GST",
      badge: "ON CALL ASSISTANCE",
      badgeColor: "bg-yellow-500",
    },
    {
      name: "Gold",
      price: "₹5,899", 
      gst: "+18% GST",
      badge: "HOUSE VISIT ASSISTANCE",
      badgeColor: "bg-green-500",
    },
    {
      name: "Platinum",
      price: "₹6,999",
      gst: "+18% GST", 
      badge: "EXPERT GUIDANCE",
      badgeColor: "bg-red-500",
    },
    {
      name: "Diamond",
      price: "₹10,999",
      gst: "+18% GST",
      badge: "PERSONAL FIELD ASSISTANT", 
      badgeColor: "bg-purple-500",
    }
  ];

  const planDetails = [
    // Relax plan features
    [
      { icon: <Clock className="w-5 h-5" />, text: "45 Days Plan Validity" },
      { icon: <UserCheck className="w-5 h-5" />, text: "Relationship Manager (RM)- Super Fast Closure" },
      { icon: <FileText className="w-5 h-5" />, text: "Rental Agreement Home Delivered" }
    ],
    // Super Relax plan features (includes Relax features)
    [
      { icon: <Clock className="w-5 h-5" />, text: "45 Days Plan Validity" },
      { icon: <UserCheck className="w-5 h-5" />, text: "Relationship Manager (RM)- Super Fast Closure" },
      { icon: <FileText className="w-5 h-5" />, text: "Rental Agreement Home Delivered" },
      { icon: <TrendingUp className="w-5 h-5" />, text: "Top Slot Listing For 5x More Visibility" },
      { icon: <Globe className="w-5 h-5" />, text: "Property Promotion On Website" },
      { icon: <Camera className="w-5 h-5" />, text: "Photoshoot Of Your Property" },
      { icon: <Lock className="w-5 h-5" />, text: "Privacy Of Your Phone Number" }
    ],
    // MoneyBack plan features (includes previous features)
    [
      { icon: <Clock className="w-5 h-5" />, text: "45 Days Plan Validity" },
      { icon: <UserCheck className="w-5 h-5" />, text: "Relationship Manager (RM)- Super Fast Closure" },
      { icon: <FileText className="w-5 h-5" />, text: "Rental Agreement Home Delivered" },
      { icon: <TrendingUp className="w-5 h-5" />, text: "Top Slot Listing For 5x More Visibility" },
      { icon: <Globe className="w-5 h-5" />, text: "Property Promotion On Website" },
      { icon: <Camera className="w-5 h-5" />, text: "Photoshoot Of Your Property" },
      { icon: <Lock className="w-5 h-5" />, text: "Privacy Of Your Phone Number" },
      { icon: <UserCheck className="w-5 h-5" />, text: "Personal Field Assistant" },
      { icon: <Users className="w-5 h-5" />, text: "Showing Property On Your Behalf" },
      { icon: <TrendingUp className="w-5 h-5" />, text: "Facebook Marketing Of Your Property" }
    ],
    // Super MoneyBack plan features (includes all previous features)
    [
      { icon: <Clock className="w-5 h-5" />, text: "45 Days Plan Validity" },
      { icon: <UserCheck className="w-5 h-5" />, text: "Relationship Manager (RM)- Super Fast Closure" },
      { icon: <FileText className="w-5 h-5" />, text: "Rental Agreement Home Delivered" },
      { icon: <TrendingUp className="w-5 h-5" />, text: "Top Slot Listing For 5x More Visibility" },
      { icon: <Globe className="w-5 h-5" />, text: "Property Promotion On Website" },
      { icon: <Camera className="w-5 h-5" />, text: "Photoshoot Of Your Property" },
      { icon: <Lock className="w-5 h-5" />, text: "Privacy Of Your Phone Number" },
      { icon: <UserCheck className="w-5 h-5" />, text: "Personal Field Assistant" },
      { icon: <Users className="w-5 h-5" />, text: "Showing Property On Your Behalf" },
      { icon: <TrendingUp className="w-5 h-5" />, text: "Facebook Marketing Of Your Property" },
      { icon: <Shield className="w-5 h-5" />, text: "Premium Customer Support" },
      { icon: <FileText className="w-5 h-5" />, text: "Legal Documentation Assistance" }
    ]
  ];

  const testimonials = [{
    text: "NoBroker's customer service was impressively prompt and friendly. Listing my flat was a memorable experience.",
    hashtag: "#ZeroBrokerage"
  }, {
    text: "The premium plan helped me get the best deal for a PG in a very short time!",
    hashtag: "#ZeroBrokerage"
  }];

  const faqs = [{
    question: "What will the Relationship Manager do?",
    answer: "Help you close deals faster, assist with follow-ups, and coordinate visits."
  }, {
    question: "What about Social Media Marketing?", 
    answer: "We promote your property across platforms like Facebook for wider reach."
  }, {
    question: "How will my property be promoted?",
    answer: "Through website placement, featured listings, and personal visits if needed."
  }, {
    question: "Any hidden charges?",
    answer: "No hidden fees — all charges (if any) will be transparently shared."
  }, {
    question: "How is the rental agreement made?",
    answer: "We deliver the agreement to your doorstep, with home pickup support."
  }, {
    question: "How do I get faster closures?",
    answer: "Use our Super MoneyBack plan — with top slot listings, field assistance, and RM support."
  }];

  return (
    <div className="min-h-screen bg-background">
      <Marquee />
      <Header />
      
      {/* Hero Section */}
      <section 
        className="relative text-white py-16 px-4 pt-24 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('/lovable-uploads/fbb0d72f-782e-49f5-bbe1-8afc1314b5f7.png')`
        }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-6 pt-8">
            Get Tenants Quickly. Save up to ₹50,000 on Brokerage!
          </h1>
          <p className="text-lg md:text-xl mb-6 max-w-3xl mx-auto">
            Trusted by 3 Lakh+ property owners like you. Choose the plan that suits you 
          </p>
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="flex">
              {[1, 2, 3, 4, 5].map(star => <Star key={star} className="w-5 h-5 fill-yellow-400 text-yellow-400" />)}
            </div>
            <span className="ml-2">Rated 5 Stars by Owners</span>
          </div>
        </div>
      </section>

      {/* Pricing Plans */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
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

      {/* Customer Testimonials */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Customer Testimonials</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="p-6">
                <CardContent className="pt-0">
                  <div className="flex mb-4">
                    {[1, 2, 3, 4, 5].map(star => <Star key={star} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)}
                  </div>
                  <p className="text-gray-700 mb-4">"{testimonial.text}"</p>
                  <p className="text-brand-red font-medium">{testimonial.hashtag}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Support Callout */}
      <section className="py-12 px-4 bg-brand-red text-primary-foreground">
        <div className="max-w-4xl mx-auto text-center">
          <Phone className="w-8 h-8 mx-auto mb-4" />
          <h3 className="text-2xl font-bold mb-4">Need Assistance?</h3>
          <p className="text-lg mb-4">For assistance, call us at</p>
          <a href="tel:+919243009980" className="text-2xl font-bold hover:underline">
            +91-92-430-099-80
          </a>
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

      <Footer />
    </div>
  );
};

export default OwnerPlans;
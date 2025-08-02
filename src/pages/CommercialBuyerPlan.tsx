import React, { useState } from 'react';
import { Check, Phone, MessageCircle, Quote, Star, Target, Users, Shield, Clock, Bell, FileText, Headphones } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Marquee from '@/components/Marquee';

const CommercialBuyerPlan = () => {
  const [selectedPlan, setSelectedPlan] = useState(1); // Default to Comfort plan (Most Popular)

  const plans = [
    {
      name: "Silver Plan",
      price: "₹1,999",
      gst: "+18% GST",
      badge: "BASIC SUPPORT",
      badgeColor: "bg-red-600",
    },
    {
      name: "Gold Plan", 
      price: "₹4,999",
      gst: "+18% GST",
      badge: "MOST POPULAR",
      badgeColor: "bg-yellow-500",
    },
    {
      name: "Platinum Plan",
      price: "₹8,999",
      gst: "+18% GST",
      badge: "EXPERT GUIDANCE",
      badgeColor: "bg-blue-600",
    }
  ];

  const planDetails = [
    // Power plan features
    [
      { icon: <Target className="w-5 h-5" />, text: "Basic property matching" },
      { icon: <Headphones className="w-5 h-5" />, text: "Email support" },
      { icon: <Bell className="w-5 h-5" />, text: "Standard property alerts" },
      { icon: <FileText className="w-5 h-5" />, text: "Basic documentation help" }
    ],
    // Comfort plan features (includes Power features)
    [
      { icon: <Target className="w-5 h-5" />, text: "Basic property matching" },
      { icon: <Headphones className="w-5 h-5" />, text: "Email support" },
      { icon: <Bell className="w-5 h-5" />, text: "Standard property alerts" },
      { icon: <FileText className="w-5 h-5" />, text: "Basic documentation help" },
      { icon: <Users className="w-5 h-5" />, text: "Priority property matching" },
      { icon: <Shield className="w-5 h-5" />, text: "Dedicated relationship manager" },
      { icon: <MessageCircle className="w-5 h-5" />, text: "Instant WhatsApp support" },
      { icon: <Phone className="w-5 h-5" />, text: "Price negotiation assistance" },
      { icon: <FileText className="w-5 h-5" />, text: "Legal documentation support" }
    ],
    // MoneyBack plan features (includes all previous features)
    [
      { icon: <Target className="w-5 h-5" />, text: "Basic property matching" },
      { icon: <Headphones className="w-5 h-5" />, text: "Email support" },
      { icon: <Bell className="w-5 h-5" />, text: "Standard property alerts" },
      { icon: <FileText className="w-5 h-5" />, text: "Basic documentation help" },
      { icon: <Users className="w-5 h-5" />, text: "Priority property matching" },
      { icon: <Shield className="w-5 h-5" />, text: "Dedicated relationship manager" },
      { icon: <MessageCircle className="w-5 h-5" />, text: "Instant WhatsApp support" },
      { icon: <Phone className="w-5 h-5" />, text: "Price negotiation assistance" },
      { icon: <FileText className="w-5 h-5" />, text: "Legal documentation support" },
      { icon: <Target className="w-5 h-5" />, text: "Premium property matching" },
      { icon: <Clock className="w-5 h-5" />, text: "24/7 dedicated expert" },
      { icon: <Shield className="w-5 h-5" />, text: "Complete legal & loan assistance" },
    ]
  ];

  const benefits = [{
    title: "Priority Access to Verified Listings",
    icon: Target
  }, {
    title: "Property Matchmaking with Dedicated Expert",
    icon: Users
  }, {
    title: "Personalized Assistance for Buying/Leasing",
    icon: Shield
  }, {
    title: "Direct Owner Coordination",
    icon: Phone
  }, {
    title: "Price Negotiation Support",
    icon: Target
  }, {
    title: "Instant Property Alerts",
    icon: Bell
  }, {
    title: "Help with Legal, Loan & Documentation",
    icon: FileText
  }, {
    title: "On-Demand Support via Call or WhatsApp",
    icon: Headphones
}];


  const testimonials = [{
    name: "Rajesh Kumar",
    text: "Found my perfect office space in just 2 weeks. Zero brokerage saved me ₹2 lakhs!",
    hashtag: "#ZeroBrokerage"
  }, {
    name: "Priya Sharma",
    text: "The expert help was amazing. They handled everything from search to documentation.",
    hashtag: "#ExpertSupport"
  }, {
    name: "Amit Patel",
    text: "Best decision ever! Got a prime location at 20% below market rate.",
    hashtag: "#FastDeals"
  }];

  const faqs = [{
    question: "How much does the plan cost?",
    answer: "All our plans are currently FREE for a limited time! Normally priced from ₹1,999 to ₹8,999, but you can access expert commercial property buying assistance at no cost right now."
  }, {
    question: "What happens after I subscribe?",
    answer: "Once you subscribe, you'll be assigned a dedicated property expert who will understand your requirements and start matching properties immediately. You'll receive personalized property recommendations within 24 hours."
  }, {
    question: "Do you guarantee a property match?",
    answer: "Yes! With our MoneyBack plan, we guarantee you'll find a suitable property or get 100% refund. Our other plans also have high success rates with dedicated expert support."
  }, {
    question: "Can I get a property in a specific locality?",
    answer: "Absolutely! Our experts specialize in specific localities and can help you find properties in your preferred areas. We have extensive networks across all major commercial hubs."
  }, {
    question: "Will you help with legal or loan process too?",
    answer: "Yes, our Comfort and MoneyBack plans include complete legal documentation support and loan processing assistance. We partner with leading legal experts and financial institutions."
  }, {
    question: "Are there any hidden charges?",
    answer: "No hidden charges whatsoever! All costs are transparently mentioned upfront with no surprises."
  }];

  const scrollToPricing = () => {
    document.getElementById('pricing')?.scrollIntoView({
      behavior: 'smooth'
    });
  };

  return <div className="min-h-screen bg-background">
      <Header />
      <Marquee />
      
      {/* Hero Section */}
      <section className="bg-brand-red text-white py-20 pt-32">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Get Expert Help to Buy or Lease Commercial Property 
           
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-red-100">
            Trusted by 3 Lakh+ Buyers & Tenants across India
          </p>
          
          <Button onClick={scrollToPricing} size="lg" className="bg-white text-brand-red hover:bg-red-50 px-8 py-4 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all">
            Get Started Now
          </Button>
        </div>
      </section>

     

      {/* Pricing Section */}
      <section id="pricing" className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Choose Your Plan
          </h2>
          
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
              For assistance call us at: <span className="text-brand-red font-semibold">+91-89-059-996-69</span>
            </p>
            <p className="text-sm text-gray-500">
              <span className="underline cursor-pointer hover:text-gray-700">Terms & Conditions Apply</span>
            </p>
          </div>
        </div>
      </section>




     {/* Benefits Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Why Choose Our Commercial Buyer Plan?
          </h2>
          <p className="text-center text-muted-foreground mb-12 text-lg">
            Everything you need to find the perfect commercial property
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => {
            const IconComponent = benefit.icon;
            return <Card key={index} className="text-center p-6 hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <div className="w-12 h-12 bg-brand-red/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <IconComponent className="w-6 h-6 text-brand-red" />
                    </div>
                    <h3 className="font-semibold text-base text-center">{benefit.title}</h3>
                  </CardContent>
                </Card>;
          })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900">
            What Our Customers Say
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => <Card key={index} className="bg-white shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <Quote className="w-8 h-8 text-blue-600 mb-4" />
                  <p className="text-gray-700 mb-4 italic">"{testimonial.text}"</p>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-gray-900">{testimonial.name}</span>
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                      {testimonial.hashtag}
                    </Badge>
                  </div>
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

      <Footer />
    </div>;
};

export default CommercialBuyerPlan;
import React, { useState } from 'react';
import { Check, Phone, MessageCircle, Quote, Star, Camera, Shield, Globe, TrendingUp, Users, Zap, CheckCircle, Eye, Share2, FileText, Handshake } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Marquee from '@/components/Marquee';

const CommercialSellerPlans = () => {
  const [selectedPlans, setSelectedPlans] = useState({
    residential: 0,
    commercial: 0, 
    industrial: 0,
    agricultural: 0
  });

  const tabPlans = {
    residential: [
      {
        name: "Silver Plan",
        price: "₹2,999",
        gst: "+18% GST", 
        badge: "ESSENTIAL FEATURES",
        badgeColor: "bg-red-600",
      },
      {
        name: "Gold Plan",
        price: "₹7,999",
        gst: "+18% GST",
        badge: "MOST POPULAR",
        badgeColor: "bg-yellow-500",
      }
    ],
    commercial: [
      {
        name: "Business Silver",
        price: "₹8,999",
        gst: "+18% GST", 
        badge: "BUSINESS ESSENTIALS",
        badgeColor: "bg-blue-500",
      },
      {
        name: "Business Gold",
        price: "₹15,999",
        gst: "+18% GST",
        badge: "BUSINESS POPULAR",
        badgeColor: "bg-indigo-500",
      }
    ],
    industrial: [
      {
        name: "Industrial Silver",
        price: "₹12,999",
        gst: "+18% GST", 
        badge: "INDUSTRIAL BASICS",
        badgeColor: "bg-gray-600",
      },
      {
        name: "Industrial Gold",
        price: "₹22,999",
        gst: "+18% GST",
        badge: "INDUSTRIAL PREMIUM",
        badgeColor: "bg-slate-700",
      }
    ],
    agricultural: [
      {
        name: "Farm Silver",
        price: "₹4,999",
        gst: "+18% GST", 
        badge: "FARM ESSENTIALS",
        badgeColor: "bg-green-600",
      },
      {
        name: "Farm Gold",
        price: "₹9,999",
        gst: "+18% GST",
        badge: "FARM PREMIUM",
        badgeColor: "bg-emerald-600",
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
      ]
    ]
  };

  const testimonials = [{
    name: "Rajesh Kumar",
    text: "Their Relationship Manager helped me close my showroom deal in just 12 days!",
    hashtag: "#ZeroBrokerage",
    rating: 5
  }, {
    name: "Priya Sharma",
    text: "From marketing to legal advice, everything was handled professionally.",
    hashtag: "#ZeroBrokerage",
    rating: 5
  }, {
    name: "Amit Patel",
    text: "I didn't even have to step out — the team showed my property and kept me updated daily.",
    hashtag: "#ZeroBrokerage",
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

  const scrollToPricing = () => {
    document.getElementById('pricing')?.scrollIntoView({
      behavior: 'smooth'
    });
  };

  return <div className="min-h-screen bg-background">
      <Header />
      <Marquee />
      
      {/* Hero Section */}
      <section 
        className="text-white py-20 pt-32 relative bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('/lovable-uploads/ad6e5d82-c08a-4e73-8459-edb904417654.png')`
        }}
      >
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
             Get Commercial Property Seller Support!
          </h1>
          <p className="text-xl md:text-2xl mb-4 text-red-100">
            ⭐️⭐️⭐️⭐️⭐️ — Trusted by 3 Lacs+ Sellers like you!
          </p>
          <p className="text-lg md:text-xl mb-8 text-red-100">
            List your property confidently with dedicated assistance.
          </p>
          
          <Button onClick={scrollToPricing} size="lg" className="bg-white text-brand-red hover:bg-red-50 px-8 py-4 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all">
            See Seller Plans
          </Button>
        </div>
      </section>

      {/* Commercial Seller Plans with Tabs */}
      <section id="pricing" className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-gray-900">
             Commercial Seller Plans
          </h2>
          <p className="text-lg text-muted-foreground text-center mb-12">Select the category that best fits your property selling needs</p>
      
          <Tabs defaultValue="residential" className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-8">
              <TabsTrigger value="residential" className="text-sm md:text-base">Residential</TabsTrigger>
              <TabsTrigger value="commercial" className="text-sm md:text-base">Commercial</TabsTrigger>
              <TabsTrigger value="industrial" className="text-sm md:text-base">Industrial</TabsTrigger>
              <TabsTrigger value="agricultural" className="text-sm md:text-base">Agricultural</TabsTrigger>
            </TabsList>

            {Object.entries(tabPlans).map(([tabKey, plans]) => (
              <TabsContent key={tabKey} value={tabKey} className="space-y-8">
                {/* Plan Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        <div className="mb-6">
                          <span className="text-2xl font-bold text-gray-900">{plan.price}</span>
                          <div className="text-sm text-gray-500">{plan.gst}</div>
                        </div>
                        
                        <Button 
                          className={`w-full ${
                            selectedPlans[tabKey as keyof typeof selectedPlans] === index 
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
                </div>
              </TabsContent>
            ))}
          </Tabs>

          {/* Contact Info */}
          <div className="mt-8 text-center">
            <p className="text-gray-600 mb-2">
              For assistance call us at: <span className="text-brand-red font-semibold">+91-89-059-998-88</span>
            </p>
            <p className="text-sm text-gray-500">
              <span className="underline cursor-pointer hover:text-gray-700">Terms & Conditions Apply</span>
            </p>
          </div>
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

      <Footer />
    </div>;
};

export default CommercialSellerPlans;
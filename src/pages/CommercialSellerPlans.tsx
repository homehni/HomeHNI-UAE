import React from 'react';
import { Check, Phone, MessageCircle, Quote, Star, Camera, Shield, Globe, TrendingUp, Users, Zap, CheckCircle, Eye, Share2, FileText, Handshake } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Marquee from '@/components/Marquee';
const CommercialSellerPlans = () => {
  const plans = [{
    name: "Basic Plan",
    price: "₹0",
    originalPrice: "₹2,999",
    popular: false,
    color: "bg-red-600",
    features: [{
      text: "Photoshoot of your property",
      icon: Camera
    }, {
      text: "Privacy of your phone number",
      icon: Shield
    }, {
      text: "Property listing on website",
      icon: Globe
    }, {
      text: "Basic property promotion",
      icon: TrendingUp
    }, {
      text: "Call support from our team",
      icon: Phone
    }]
  }, {
    name: "Pro Plan",
    price: "₹0",
    originalPrice: "₹7,999",
    popular: true,
    color: "bg-yellow-500",
    features: [{
      text: "Everything in Basic Plan",
      icon: CheckCircle
    }, {
      text: "Relationship Manager (RM)",
      icon: Users
    }, {
      text: "Property showings on your behalf",
      icon: Users
    }, {
      text: "Premium photoshoot",
      icon: Camera
    }, {
      text: "Social media marketing (FB & Insta)",
      icon: Share2
    }, {
      text: "Featured listing & promotion boost",
      icon: Zap
    }, {
      text: "Verified Buyer Connect",
      icon: Shield
    }, {
      text: "Price negotiation support",
      icon: Handshake
    }, {
      text: "Legal & documentation assistance",
      icon: FileText
    }]
  }];
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
    question: "Are the services really free right now?",
    answer: "Yes! All our premium seller services are currently FREE for a limited time. This includes Relationship Manager support, premium photoshoot, social media marketing, and all documentation assistance."
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
      <section className="bg-brand-red text-white py-20 pt-32">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            🏢 Get Commercial Property Seller Support!
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

      {/* Seller Plans Section */}
      <section id="pricing" className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-gray-900">
            🛍️ Commercial Seller Plans
          </h2>
          <p className="text-center text-xl text-gray-600 mb-12">
            All plans currently <span className="text-green-600 font-bold">FREE</span> for a limited time!
          </p>
          
          <div className="grid md:grid-cols-2 gap-8 mb-8 max-w-5xl mx-auto">
            {plans.map((plan, index) => <Card key={index} className={`relative overflow-hidden border-2 ${plan.popular ? 'border-yellow-500 scale-105' : 'border-gray-200'} hover:shadow-xl transition-all`}>
                {plan.popular && <Badge className="absolute top-4 right-4 bg-yellow-500 text-black font-bold">
                    Most Popular
                  </Badge>}
                <CardHeader className={`${plan.color} text-white text-center py-8`}>
                  <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                  <div className="mt-4">
                    <span className="text-3xl font-bold line-through opacity-75">{plan.originalPrice}</span>
                    <div className="text-4xl font-bold text-green-300 mt-2">Currently FREE</div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, idx) => {
                  const IconComponent = feature.icon;
                  return <li key={idx} className="flex items-start space-x-3">
                          <IconComponent className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{feature.text}</span>
                        </li>;
                })}
                  </ul>
                  <Button className="w-full bg-gray-900 hover:bg-gray-800 text-white">
                    Get Started Now
                  </Button>
                </CardContent>
              </Card>)}
          </div>

          <div className="text-center bg-blue-50 p-6 rounded-lg mb-8">
            <p className="text-gray-700 mb-4">
              All plans are valid for 3 months. Get dedicated help, faster responses, and more visibility for your property.
            </p>
            <div className="flex items-center justify-center space-x-2 text-blue-800">
              <Phone className="w-5 h-5" />
              <span className="font-semibold">For assistance, call us at: +91-89-059-998-88</span>
            </div>
            <p className="text-sm text-gray-600 mt-2">📌 Terms & Conditions Apply</p>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900">
            🌟 What Our Sellers Say
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
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900">
            ❓ Frequently Asked Questions
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
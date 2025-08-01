import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Check, Phone } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Marquee from '@/components/Marquee';
const OwnerPlans = () => {
  const plans = [{
    name: "Relax",
    price: "₹3,399",
    gst: "+18% GST",
    badge: "ON CALL ASSISTANCE",
    badgeColor: "bg-amber-500",
    isPopular: true,
    features: [
      "45 Days Plan Validity",
      "Top Slot Listing For 5x More Visibility",
      "Relationship Manager (RM)- Super Fast Closure",
      "Rental Agreement Home Delivered"
    ]
  }, {
    name: "Super Relax",
    price: "₹5,899",
    gst: "+18% GST",
    badge: "HOUSE VISIT ASSISTANCE",
    badgeColor: "bg-green-500",
    features: [
      "Guaranteed Tenants Or 100% Moneyback",
      "Property Promotion On Website",
      "Photoshoot Of Your Property",
      "Privacy Of Your Phone Number"
    ]
  }, {
    name: "MoneyBack",
    price: "₹6,999",
    gst: "+18% GST",
    badge: "100% GUARANTEE",
    badgeColor: "bg-red-500",
    features: [
      "Personal Field Assistant",
      "Showing Property On Your Behalf",
      "Facebook Marketing Of Your Property"
    ]
  }, {
    name: "Super MoneyBack",
    price: "₹10,999",
    gst: "+18% GST",
    badge: "PERSONAL FIELD ASSISTANT",
    badgeColor: "bg-purple-500",
    features: [
      "All features from previous plans included"
    ]
  }];
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
  return <div className="min-h-screen bg-background">
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
          <h1 className="text-3xl md:text-5xl font-bold mb-6">
            Get Tenants Quickly. Save up to ₹50,000 on Brokerage!
          </h1>
          <p className="text-lg md:text-xl mb-6 max-w-3xl mx-auto">
            Trusted by 3 Lakh+ property owners like you. Choose the plan that suits you — for ₹0 during our limited-time offer!
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
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {plans.map((plan, index) => (
              <Card key={index} className={`relative overflow-hidden hover:shadow-lg transition-shadow border-0 shadow-md ${plan.isPopular ? 'bg-teal-50' : 'bg-white'}`}>
                <div className="absolute top-4 right-4">
                  <Badge className={`${plan.badgeColor} text-white text-xs px-2 py-1 font-medium`}>
                    {plan.badge}
                  </Badge>
                </div>
                <CardHeader className="text-left pt-12 pb-4">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <div className="mb-4">
                    <span className="text-3xl font-bold text-gray-900">{plan.price}</span>
                    <span className="text-sm text-gray-500 ml-1">{plan.gst}</span>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center mt-0.5 flex-shrink-0">
                          <Check className="w-3 h-3 text-gray-600" />
                        </div>
                        <span className="text-sm text-gray-700 leading-relaxed">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className={`w-full ${plan.isPopular ? 'bg-brand-red hover:bg-brand-red-dark text-white' : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'}`}
                  >
                    Subscribe
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {/* Additional Info Section */}
          <div className="mt-12 text-center">
            <p className="text-gray-600 mb-4">
              For assistance call us at: <span className="text-brand-red font-semibold">+91-92-430-099-80</span>
            </p>
            <p className="text-sm text-gray-500">
              <span className="underline">Terms & Conditions Apply</span>
            </p>
          </div>
        </div>
      </section>

      {/* Disclaimer Banner */}
      

      {/* Customer Testimonials */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Customer Testimonials</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => <Card key={index} className="p-6">
                <CardContent className="pt-0">
                  <div className="flex mb-4">
                    {[1, 2, 3, 4, 5].map(star => <Star key={star} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)}
                  </div>
                  <p className="text-gray-700 mb-4">"{testimonial.text}"</p>
                  <p className="text-brand-red font-medium">{testimonial.hashtag}</p>
                </CardContent>
              </Card>)}
          </div>
        </div>
      </section>

      {/* Support Callout */}
      <section className="py-12 px-4 bg-brand-red text-white">
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

      <Footer />
    </div>;
};
export default OwnerPlans;
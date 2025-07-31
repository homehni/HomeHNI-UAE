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
    name: "Relax Plan",
    price: "₹0",
    originalPrice: "₹3,399 + 18% GST",
    color: "bg-green-500",
    features: ["On-call assistance", "Plan validity: 45 days", "Guaranteed tenants or 100% money-back"]
  }, {
    name: "Super Relax Plan",
    price: "₹0",
    originalPrice: "₹5,899 + 18% GST",
    color: "bg-blue-500",
    features: ["Includes everything in Relax Plan", "Property promotion on website", "Top slot listing (5x visibility)", "Personal field assistant"]
  }, {
    name: "MoneyBack Plan",
    price: "₹0",
    originalPrice: "₹6,999 + 18% GST",
    color: "bg-purple-500",
    features: ["100% money-back guarantee", "Relationship Manager (RM)", "Property shown on your behalf", "Photoshoot of your property"]
  }, {
    name: "Super MoneyBack Plan",
    price: "₹0",
    originalPrice: "₹10,999 + 18% GST",
    color: "bg-orange-500",
    features: ["Includes everything above", "Facebook marketing of your property", "Rental agreement home-delivered", "Phone number privacy"]
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
      <section className="gradient-red-maroon text-white py-16 px-4 pt-24">
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
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {plans.map((plan, index) => <Card key={index} className="relative overflow-hidden hover:shadow-lg transition-shadow">
                <CardHeader className="text-center">
                  <Badge className={`${plan.color} text-white w-fit mx-auto mb-4`}>
                    {plan.name}
                  </Badge>
                  <div className="mb-4">
                    <div className="text-4xl font-bold text-brand-red">{plan.price}</div>
                    <div className="text-sm text-muted-foreground line-through">
                      Original {plan.originalPrice}
                    </div>
                    <div className="text-sm font-medium text-green-600">
                      Now Free – Limited Time
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, idx) => <li key={idx} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>)}
                  </ul>
                  <Button className="w-full">Subscribe</Button>
                </CardContent>
              </Card>)}
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
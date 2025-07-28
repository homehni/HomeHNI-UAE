import React from 'react';
import { Check, Phone, MessageCircle, Quote } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const CommercialBuyerPlan = () => {
  const benefits = [
    "100% Free — Limited Time Offer",
    "Property Matchmaking with Dedicated Expert",
    "Personalized Assistance for Buying/Leasing",
    "Direct Owner Coordination",
    "Price Negotiation Support",
    "Instant Property Alerts",
    "Help with Legal, Loan & Documentation",
    "On-Demand Support via Call or WhatsApp"
  ];

  const plans = [
    {
      name: "Power",
      price: "₹1,999",
      originalPrice: "₹1,999",
      popular: false,
      color: "bg-red-600",
      features: [
        "Basic property matching",
        "Email support",
        "Standard property alerts",
        "Basic documentation help"
      ]
    },
    {
      name: "Comfort",
      price: "₹4,999",
      originalPrice: "₹4,999",
      popular: true,
      color: "bg-yellow-500",
      features: [
        "Priority property matching",
        "Dedicated relationship manager",
        "Instant WhatsApp support",
        "Price negotiation assistance",
        "Legal documentation support"
      ]
    },
    {
      name: "MoneyBack",
      price: "₹8,999",
      originalPrice: "₹8,999",
      popular: false,
      color: "bg-blue-600",
      features: [
        "Premium property matching",
        "24/7 dedicated expert",
        "Guaranteed property closure",
        "Complete legal & loan assistance",
        "100% money-back guarantee"
      ]
    }
  ];

  const testimonials = [
    {
      name: "Rajesh Kumar",
      text: "Found my perfect office space in just 2 weeks. Zero brokerage saved me ₹2 lakhs!",
      hashtag: "#ZeroBrokerage"
    },
    {
      name: "Priya Sharma",
      text: "The expert help was amazing. They handled everything from search to documentation.",
      hashtag: "#ExpertSupport"
    },
    {
      name: "Amit Patel",
      text: "Best decision ever! Got a prime location at 20% below market rate.",
      hashtag: "#FastDeals"
    }
  ];

  const faqs = [
    {
      question: "How much does the plan cost?",
      answer: "All our plans are currently FREE for a limited time! Normally priced from ₹1,999 to ₹8,999, but you can access expert commercial property buying assistance at no cost right now."
    },
    {
      question: "What happens after I subscribe?",
      answer: "Once you subscribe, you'll be assigned a dedicated property expert who will understand your requirements and start matching properties immediately. You'll receive personalized property recommendations within 24 hours."
    },
    {
      question: "Do you guarantee a property match?",
      answer: "Yes! With our MoneyBack plan, we guarantee you'll find a suitable property or get 100% refund. Our other plans also have high success rates with dedicated expert support."
    },
    {
      question: "Can I get a property in a specific locality?",
      answer: "Absolutely! Our experts specialize in specific localities and can help you find properties in your preferred areas. We have extensive networks across all major commercial hubs."
    },
    {
      question: "Will you help with legal or loan process too?",
      answer: "Yes, our Comfort and MoneyBack plans include complete legal documentation support and loan processing assistance. We partner with leading legal experts and financial institutions."
    },
    {
      question: "Are there any hidden charges?",
      answer: "No hidden charges whatsoever! During this limited-time offer, everything is completely free. Even after the offer ends, all costs are transparently mentioned upfront with no surprises."
    }
  ];

  const scrollToPricing = () => {
    document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-blue-900 text-white pt-24 pb-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Get Expert Help to Buy or Lease Commercial Property — 
            <span className="text-yellow-400"> Absolutely Free</span> (For Now!)
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100">
            Trusted by 3 Lakh+ Buyers & Tenants across India
          </p>
          <div className="bg-white/10 border border-white/20 rounded-lg p-6 mb-8 backdrop-blur-sm">
            <p className="text-lg md:text-xl font-semibold">
              <span className="text-red-400">NoBrokerage.</span> 
              <span className="text-yellow-400"> No Hidden Fees.</span> 
              <span className="text-white"> Just Expert Help — </span>
              <span className="text-green-400">FREE (for a limited time).</span>
            </p>
          </div>
          <Button 
            onClick={scrollToPricing}
            size="lg" 
            className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all"
          >
            Get Started Now
          </Button>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900">
            Why Choose Our Commercial Buyer Plan?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-start space-x-3 bg-white p-4 rounded-lg shadow-sm">
                <Check className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                <span className="text-gray-800 font-medium">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-gray-900">
            Choose Your Plan
          </h2>
          <p className="text-center text-xl text-gray-600 mb-12">
            All plans currently <span className="text-green-600 font-bold">FREE</span> for a limited time!
          </p>
          
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            {plans.map((plan, index) => (
              <Card key={index} className={`relative overflow-hidden border-2 ${plan.popular ? 'border-yellow-500 scale-105' : 'border-gray-200'} hover:shadow-xl transition-all`}>
                {plan.popular && (
                  <Badge className="absolute top-4 right-4 bg-yellow-500 text-black font-bold">
                    Most Popular
                  </Badge>
                )}
                <CardHeader className={`${plan.color} text-white text-center py-8`}>
                  <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                  <div className="mt-4">
                    <span className="text-3xl font-bold line-through opacity-75">{plan.originalPrice}</span>
                    <div className="text-4xl font-bold text-green-300 mt-2">Currently FREE</div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start space-x-2">
                        <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full bg-gray-900 hover:bg-gray-800 text-white">
                    Subscribe Now
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center bg-blue-50 p-6 rounded-lg">
            <div className="flex items-center justify-center space-x-2 text-blue-800">
              <Phone className="w-5 h-5" />
              <span className="font-semibold">For assistance, call us at: +91-89-059-996-69</span>
            </div>
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
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-white shadow-lg hover:shadow-xl transition-shadow">
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
              </Card>
            ))}
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
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left font-semibold text-gray-900">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-700">
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

export default CommercialBuyerPlan;
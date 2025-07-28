import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { CheckCircle, Users, Shield, UserCheck, MessageCircle, TrendingUp, Phone, Star } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Marquee from "@/components/Marquee";

const CommercialOwnerPlans = () => {
  const benefits = [
    {
      icon: <UserCheck className="w-6 h-6" />,
      title: "Guaranteed Tenant Matching",
      description: "Find verified tenants quickly with our extensive database"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "100% Moneyback Promise",
      description: "Full refund if we don't find you a tenant within the plan period"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Personal Relationship Manager",
      description: "Dedicated support throughout your property rental journey"
    },
    {
      icon: <MessageCircle className="w-6 h-6" />,
      title: "Expert Rental Consultation",
      description: "Professional guidance on pricing, documentation, and market trends"
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "High-Visibility Listings & Promotions",
      description: "Premium placement and marketing to attract quality tenants faster"
    }
  ];

  const plans = [
    {
      name: "Relax Plan",
      price: "₹3,499",
      features: [
        "Property listing for 60 days",
        "Basic tenant verification",
        "Email support",
        "Standard visibility"
      ]
    },
    {
      name: "Super Relax Plan",
      price: "₹6,499",
      features: [
        "Property listing for 90 days",
        "Advanced tenant verification",
        "Phone & email support",
        "Enhanced visibility",
        "Property photography"
      ]
    },
    {
      name: "MoneyBack Plan",
      price: "₹7,999",
      features: [
        "Property listing for 120 days",
        "Premium tenant verification",
        "Dedicated relationship manager",
        "Priority listing",
        "Professional photography",
        "100% moneyback guarantee"
      ],
      popular: true
    },
    {
      name: "Super MoneyBack Plan",
      price: "₹11,999",
      features: [
        "Property listing for 180 days",
        "Comprehensive tenant verification",
        "24/7 dedicated support",
        "Maximum visibility",
        "Professional photography & video",
        "100% moneyback guarantee",
        "Legal documentation assistance"
      ]
    }
  ];

  const testimonials = [
    {
      name: "Rajesh Kumar",
      location: "Mumbai",
      review: "Found a tenant for my commercial space in just 2 weeks! The team was professional and the process was seamless.",
      rating: 5,
      tag: "#ZeroBrokerage"
    },
    {
      name: "Priya Sharma",
      location: "Delhi",
      review: "Excellent service! The relationship manager helped me get the best rental price for my office space.",
      rating: 5,
      tag: "#ZeroBrokerage"
    },
    {
      name: "Amit Patel",
      location: "Bangalore",
      review: "Professional approach and genuine results. Saved thousands on brokerage fees!",
      rating: 5,
      tag: "#ZeroBrokerage"
    }
  ];

  const faqs = [
    {
      question: "How quickly can I find a tenant for my commercial property?",
      answer: "Most of our clients find tenants within 30-45 days. With our premium plans, many properties get multiple inquiries within the first week of listing."
    },
    {
      question: "What if I don't find a tenant within the plan period?",
      answer: "Our MoneyBack and Super MoneyBack plans come with a 100% refund guarantee. If we don't find you a suitable tenant within the plan duration, you get your money back."
    },
    {
      question: "How do you verify tenants?",
      answer: "We conduct comprehensive background checks including business verification, financial assessment, reference checks, and legal document verification to ensure you get reliable tenants."
    },
    {
      question: "Are there any hidden charges or brokerage fees?",
      answer: "No hidden charges! The plan price is all you pay. We don't charge any brokerage from property owners - our revenue comes from the plan subscriptions only."
    },
    {
      question: "Can I upgrade my plan after subscription?",
      answer: "Yes, you can upgrade to a higher plan anytime. The price difference will be adjusted, and you'll get the enhanced features immediately."
    },
    {
      question: "What types of commercial properties do you handle?",
      answer: "We handle all types of commercial properties including office spaces, retail shops, warehouses, showrooms, restaurants, and industrial spaces across major Indian cities."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section with Red Background */}
      <section className="bg-brand-red text-white pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Get a Commercial Tenant Fast — Save ₹50,000 on Brokerage
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              Trusted by 3 Lakh+ property owners across India
            </p>
            <p className="text-lg md:text-xl mb-10 max-w-3xl mx-auto">
              Our Commercial Owner Plans help you close deals faster, with complete support and zero brokerage.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="text-lg px-8 py-3">
                View Plans
              </Button>
<Button
  size="lg"
  variant="outline"
  className="text-lg px-8 py-3 border-white text-white hover:bg-white hover:text-brand-red hover:border-brand-red group"
>
  <span className="flex items-center">
    <Phone className="w-5 h-5 mr-2 text-white group-hover:text-brand-red transition-colors duration-300" />
    Call +91-89-059-998-88
  </span>
</Button>


            </div>
          </div>
        </div>
      </section>


{/* Pricing Plans Section */}
<section className="py-16 bg-gray-50">
  <div className="container mx-auto px-4">
    <div className="max-w-7xl mx-auto">
      {/* Free Notice Banner */}
      <div className="mb-8 text-center">
        <span className="inline-block bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium">
          🎉 All plans are currently free of cost! Pricing will be introduced soon.
        </span>
      </div>

      <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
        Choose Your Commercial Owner Plan
      </h2>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {plans.map((plan, index) => (
          <Card key={index} className={`relative ${plan.popular ? 'border-brand-red shadow-lg scale-105' : ''}`}>
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-brand-red text-white px-4 py-1 rounded-full text-sm font-medium">
                  Most Popular
                </span>
              </div>
            )}
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
              <CardDescription className="text-xl font-semibold text-green-600">
                Free for now
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              <Button 
                className="w-full" 
                variant={plan.popular ? "default" : "outline"}
              >
                Get Started for Free
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  </div>
</section>


      {/* Key Benefits Section */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-foreground">
              Why Choose Our Commercial Owner Plans?
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {benefits.map((benefit, index) => (
                <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                  <CardContent className="p-6 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-red/10 text-brand-red rounded-full mb-4">
                      {benefit.icon}
                    </div>
                    <h3 className="text-xl font-semibold mb-3">{benefit.title}</h3>
                    <p className="text-muted-foreground">{benefit.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      

      {/* CTA Section */}
      <section className="py-16 bg-gradient-red-maroon text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Need Help Choosing the Right Plan?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Our experts are here to guide you to the perfect plan for your commercial property
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <div className="flex items-center gap-2 text-2xl font-bold">
                <Phone className="w-6 h-6" />
                +91-89-059-998-88
              </div>
              <Button size="lg" variant="secondary" className="px-8 py-3">
                Call Now for Plan Assistance
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              What Our Clients Say
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <Card key={index} className="border-0 shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-1 mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <p className="text-muted-foreground mb-4 italic">"{testimonial.review}"</p>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-semibold">{testimonial.name}</p>
                        <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                      </div>
                      <span className="text-brand-red font-medium text-sm">{testimonial.tag}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              Frequently Asked Questions
            </h2>
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="border rounded-lg px-6">
                  <AccordionTrigger className="text-left font-semibold hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pt-2 pb-4">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      <Marquee />
      <Footer />
    </div>
  );
};

export default CommercialOwnerPlans;
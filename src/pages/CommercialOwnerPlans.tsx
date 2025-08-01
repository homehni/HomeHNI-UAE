import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Marquee from '@/components/Marquee';
import { CheckCircle, Phone, Star, Shield, UserCheck, TrendingUp, Target } from 'lucide-react';

const CommercialOwnerPlans = () => {
  const [selectedPlan, setSelectedPlan] = useState('MoneyBack Plan');

  const plans = [
    { id: 'Relax Plan', name: 'Relax Plan', price: '₹3,499', gst: '+ GST' },
    { id: 'Super Relax Plan', name: 'Super Relax Plan', price: '₹6,499', gst: '+ GST' },
    { id: 'MoneyBack Plan', name: 'MoneyBack Plan', price: '₹7,999', gst: '+ GST', popular: true },
    { id: 'Super MoneyBack Plan', name: 'Super MoneyBack Plan', price: '₹11,999', gst: '+ GST' }
  ];

  const planDetails = {
    'Relax Plan': [
      "Basic tenant matching",
      "Standard listing visibility",
      "Email support",
      "Property documentation assistance",
      "Basic market analysis"
    ],
    'Super Relax Plan': [
      "Basic tenant matching",
      "Standard listing visibility", 
      "Email support",
      "Property documentation assistance",
      "Basic market analysis",
      "Priority tenant matching",
      "Enhanced listing visibility",
      "Phone & email support",
      "Complete documentation support",
      "Detailed market analysis",
      "Rental agreement assistance"
    ],
    'MoneyBack Plan': [
      "Basic tenant matching",
      "Standard listing visibility",
      "Email support", 
      "Property documentation assistance",
      "Basic market analysis",
      "Priority tenant matching",
      "Enhanced listing visibility",
      "Phone & email support",
      "Complete documentation support",
      "Detailed market analysis",
      "Rental agreement assistance",
      "Guaranteed tenant matching",
      "Premium listing placement",
      "Personal relationship manager",
      "100% moneyback guarantee",
      "Complete legal documentation",
      "Market trend insights",
      "Tenant verification services"
    ],
    'Super MoneyBack Plan': [
      "Basic tenant matching",
      "Standard listing visibility",
      "Email support",
      "Property documentation assistance", 
      "Basic market analysis",
      "Priority tenant matching",
      "Enhanced listing visibility",
      "Phone & email support",
      "Complete documentation support",
      "Detailed market analysis",
      "Rental agreement assistance",
      "Guaranteed tenant matching",
      "Premium listing placement",
      "Personal relationship manager",
      "100% moneyback guarantee",
      "Complete legal documentation",
      "Market trend insights",
      "Tenant verification services",
      "Priority guaranteed matching",
      "Maximum visibility & promotion",
      "Dedicated relationship manager",
      "Premium legal support",
      "Advanced market analytics",
      "Complete tenant verification",
      "Rental negotiation support",
      "Post-rental support"
    ]
  };

  const keyBenefits = [
    {
      icon: Target,
      title: "Guaranteed Tenant Matching",
      description: "We find the right tenant for your commercial property"
    },
    {
      icon: Shield,
      title: "100% Moneyback Promise",
      description: "Full refund if we don't deliver as promised"
    },
    {
      icon: UserCheck,
      title: "Personal Relationship Manager",
      description: "Dedicated support throughout your journey"
    },
    {
      icon: CheckCircle,
      title: "Expert Rental Consultation",
      description: "Professional guidance on pricing and market trends"
    },
    {
      icon: TrendingUp,
      title: "High-Visibility Listings & Promotions",
      description: "Premium placement and marketing for your property"
    }
  ];

  const pricingPlans = [
    {
      name: "Relax Plan",
      price: "₹3,499",
      gst: "+ GST",
      features: [
        "Basic tenant matching",
        "Standard listing visibility",
        "Email support",
        "Property documentation assistance",
        "Basic market analysis"
      ],
      popular: false
    },
    {
      name: "Super Relax Plan",
      price: "₹6,499",
      gst: "+ GST",
      features: [
        "Priority tenant matching",
        "Enhanced listing visibility",
        "Phone & email support",
        "Complete documentation support",
        "Detailed market analysis",
        "Rental agreement assistance"
      ],
      popular: false
    },
    {
      name: "MoneyBack Plan",
      price: "₹7,999",
      gst: "+ GST",
      features: [
        "Guaranteed tenant matching",
        "Premium listing placement",
        "Personal relationship manager",
        "100% moneyback guarantee",
        "Complete legal documentation",
        "Market trend insights",
        "Tenant verification services"
      ],
      popular: true
    },
    {
      name: "Super MoneyBack Plan",
      price: "₹11,999",
      gst: "+ GST",
      features: [
        "Priority guaranteed matching",
        "Maximum visibility & promotion",
        "Dedicated relationship manager",
        "100% moneyback guarantee",
        "Premium legal support",
        "Advanced market analytics",
        "Complete tenant verification",
        "Rental negotiation support",
        "Post-rental support"
      ],
      popular: false
    }
  ];

  const testimonials = [
    {
      name: "Rajesh Kumar",
      location: "Delhi",
      review: "Found a tenant for my office space within 2 weeks! The team was professional and the process was seamless.",
      rating: 5,
      tag: "#ZeroBrokerage"
    },
    {
      name: "Priya Sharma",
      location: "Mumbai",
      review: "Excellent service! They handled everything from documentation to tenant verification. Highly recommend!",
      rating: 5,
      tag: "#ZeroBrokerage"
    },
    {
      name: "Amit Patel",
      location: "Bangalore",
      review: "The MoneyBack plan gave me confidence. Got a reliable tenant and saved thousands on brokerage fees.",
      rating: 5,
      tag: "#ZeroBrokerage"
    }
  ];

  const faqs = [
    {
      question: "How quickly can you find a tenant for my commercial property?",
      answer: "Typically, we find suitable tenants within 15-30 days depending on your property location, size, and rental expectations. Our MoneyBack plans come with guaranteed timelines."
    },
    {
      question: "What is included in the 100% Moneyback Promise?",
      answer: "If we don't find a verified tenant within the agreed timeline for MoneyBack plans, we provide a full refund of your plan fee. Terms and conditions apply."
    },
    {
      question: "Do you charge any brokerage from tenants?",
      answer: "No, we operate on a zero-brokerage model for tenants. This makes your property more attractive and helps in faster tenant acquisition."
    },
    {
      question: "How do you verify potential tenants?",
      answer: "We conduct comprehensive background checks including credit verification, business validation, reference checks, and legal document verification before recommending any tenant."
    },
    {
      question: "Can I upgrade or downgrade my plan later?",
      answer: "Yes, you can upgrade your plan at any time by paying the difference. Downgrades are subject to terms and conditions and available features."
    },
    {
      question: "What types of commercial properties do you handle?",
      answer: "We handle all types of commercial properties including office spaces, retail shops, warehouses, industrial units, co-working spaces, and mixed-use properties."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Marquee />
      
      {/* Hero Section */}
      <section className="bg-brand-red text-white py-20 pt-32">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Get a Commercial Tenant Fast — Save ₹50,000 on Brokerage
          </h1>
          <p className="text-xl md:text-2xl mb-4 opacity-90">
            Trusted by 3 Lakh+ property owners across India
          </p>
          <p className="text-lg md:text-xl mb-8 max-w-3xl mx-auto opacity-80">
            Our Commercial Owner Plans help you close deals faster, with complete support and zero brokerage.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="text-brand-red bg-white hover:bg-gray-100">
              View Plans
            </Button>
<Button
  size="lg"
  variant="outline"
  className="text-brand-red border-white hover:bg-white hover:text-brand-red transition-all duration-300"
>
  <span className="flex items-center">
    <Phone className="w-5 h-5 mr-2 text-brand-red transition-colors" />
    Call +91-89-059-998-88
  </span>
</Button>


          </div>
        </div>
      </section>

      {/* Key Benefits Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Why Choose Our Commercial Owner Plans?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {keyBenefits.map((benefit, index) => (
              <Card key={index} className="text-center">
                <CardContent className="pt-6">
                  <benefit.icon className="w-12 h-12 text-brand-red mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                  <p className="text-muted-foreground">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Plans Section */}
      <section className="py-16" id="pricing">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Choose Your Perfect Plan
          </h2>
          
          {/* Plan Selection Buttons */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {plans.map((plan) => (
              <Button
                key={plan.id}
                onClick={() => setSelectedPlan(plan.id)}
                variant={selectedPlan === plan.id ? "default" : "outline"}
                size="lg"
                className={`relative ${
                  selectedPlan === plan.id 
                    ? "bg-brand-red text-white hover:bg-brand-red-dark" 
                    : "bg-white text-brand-red border-brand-red hover:bg-brand-red hover:text-white"
                } transition-all duration-300`}
              >
                {plan.popular && selectedPlan === plan.id && (
                  <Badge className="absolute -top-2 -right-2 bg-white text-brand-red text-xs px-2 py-0.5">
                    Popular
                  </Badge>
                )}
                {plan.name}
              </Button>
            ))}
          </div>

          {/* Selected Plan Details */}
          <div className="max-w-2xl mx-auto">
            <Card className="border-brand-red shadow-lg">
              <CardHeader className="text-center bg-brand-red text-white">
                <CardTitle className="text-3xl">
                  {plans.find(p => p.id === selectedPlan)?.name}
                </CardTitle>
                <div className="text-4xl font-bold">
                  {plans.find(p => p.id === selectedPlan)?.price}{' '}
                  <span className="text-lg opacity-80">
                    {plans.find(p => p.id === selectedPlan)?.gst}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="p-8">
                <h3 className="text-xl font-semibold mb-6 text-center">What's Included:</h3>
                <div className="grid grid-cols-1 gap-3">
                  {planDetails[selectedPlan]?.map((feature, index) => (
                    <div key={index} className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-8 text-center">
                  <Button 
                    size="lg" 
                    className="w-full md:w-auto px-12 bg-brand-red hover:bg-brand-red-dark text-white"
                  >
                    Subscribe to {selectedPlan}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-brand-red text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Need Help Choosing the Right Plan?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Our experts are here to guide you to the perfect solution
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Phone className="w-6 h-6" />
            <span className="text-2xl font-semibold">+91-89-059-998-88</span>
            <Button variant="secondary" size="lg" className="text-brand-red">
              Call Now for Plan Assistance
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            What Our Clients Say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index}>
                <CardContent className="pt-6">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4">"{testimonial.review}"</p>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                    </div>
                    <Badge variant="secondary" className="text-brand-red">
                      {testimonial.tag}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Frequently Asked Questions
          </h2>
          <div className="max-w-4xl mx-auto">
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
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default CommercialOwnerPlans;
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, CheckCircle, Phone, Clock, Users, Shield, UserCheck, Globe, Camera, Lock, FileText, TrendingUp, Target } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Marquee from '@/components/Marquee';

const CommercialOwnerPlans = () => {
  const [selectedPlan, setSelectedPlan] = useState(0);

  const plans = [
    {
      name: "Silver Plan",
      price: "₹3,499",
      gst: "+18% GST",
      badge: "BASIC ASSISTANCE",
      badgeColor: "bg-yellow-500",
    },
    {
      name: "Gold Plan",
      price: "₹6,499", 
      gst: "+18% GST",
      badge: "ENHANCED VISIBILITY",
      badgeColor: "bg-green-500",
    },
    {
      name: "Platinum Plan",
      price: "₹7,999",
      gst: "+18% GST", 
      badge: "EXPERT GUIDANCE",
      badgeColor: "bg-red-500",
    },
    {
      name: "Diamond Plan",
      price: "₹11,999",
      gst: "+18% GST",
      badge: "PREMIUM ASSISTANCE", 
      badgeColor: "bg-purple-500",
    }
  ];

  const planDetails = [
    // Relax plan features
    [
      { icon: <Clock className="w-5 h-5" />, text: "Basic tenant matching" },
      { icon: <Users className="w-5 h-5" />, text: "Standard listing visibility" },
      { icon: <UserCheck className="w-5 h-5" />, text: "Email support" },
      { icon: <FileText className="w-5 h-5" />, text: "Property documentation assistance" },
      { icon: <TrendingUp className="w-5 h-5" />, text: "Basic market analysis" }
    ],
    // Super Relax plan features (includes Relax features)
    [
      { icon: <Clock className="w-5 h-5" />, text: "Basic tenant matching" },
      { icon: <Users className="w-5 h-5" />, text: "Standard listing visibility" },
      { icon: <UserCheck className="w-5 h-5" />, text: "Email support" },
      { icon: <FileText className="w-5 h-5" />, text: "Property documentation assistance" },
      { icon: <TrendingUp className="w-5 h-5" />, text: "Basic market analysis" },
      { icon: <Target className="w-5 h-5" />, text: "Priority tenant matching" },
      { icon: <Globe className="w-5 h-5" />, text: "Enhanced listing visibility" },
      { icon: <Phone className="w-5 h-5" />, text: "Phone & email support" },
      { icon: <Shield className="w-5 h-5" />, text: "Complete documentation support" },
      { icon: <Camera className="w-5 h-5" />, text: "Detailed market analysis" },
      { icon: <Lock className="w-5 h-5" />, text: "Rental agreement assistance" }
    ],
    // MoneyBack plan features (includes previous features)
    [
      { icon: <Clock className="w-5 h-5" />, text: "Basic tenant matching" },
      { icon: <Users className="w-5 h-5" />, text: "Standard listing visibility" },
      { icon: <UserCheck className="w-5 h-5" />, text: "Email support" },
      { icon: <FileText className="w-5 h-5" />, text: "Property documentation assistance" },
      { icon: <TrendingUp className="w-5 h-5" />, text: "Basic market analysis" },
      { icon: <Target className="w-5 h-5" />, text: "Priority tenant matching" },
      { icon: <Globe className="w-5 h-5" />, text: "Enhanced listing visibility" },
      { icon: <Phone className="w-5 h-5" />, text: "Phone & email support" },
      { icon: <Shield className="w-5 h-5" />, text: "Complete documentation support" },
      { icon: <Camera className="w-5 h-5" />, text: "Detailed market analysis" },
      { icon: <Lock className="w-5 h-5" />, text: "Rental agreement assistance" },
      { icon: <CheckCircle className="w-5 h-5" />, text: "Guaranteed tenant matching" },
      { icon: <Star className="w-5 h-5" />, text: "Premium listing placement" },
      { icon: <UserCheck className="w-5 h-5" />, text: "Personal relationship manager" },
      { icon: <FileText className="w-5 h-5" />, text: "Complete legal documentation" },
      { icon: <TrendingUp className="w-5 h-5" />, text: "Market trend insights" },
      { icon: <Users className="w-5 h-5" />, text: "Tenant verification services" }
    ],
    // Super MoneyBack plan features (includes all previous features)
    [
      { icon: <Clock className="w-5 h-5" />, text: "Basic tenant matching" },
      { icon: <Users className="w-5 h-5" />, text: "Standard listing visibility" },
      { icon: <UserCheck className="w-5 h-5" />, text: "Email support" },
      { icon: <FileText className="w-5 h-5" />, text: "Property documentation assistance" },
      { icon: <TrendingUp className="w-5 h-5" />, text: "Basic market analysis" },
      { icon: <Target className="w-5 h-5" />, text: "Priority tenant matching" },
      { icon: <Globe className="w-5 h-5" />, text: "Enhanced listing visibility" },
      { icon: <Phone className="w-5 h-5" />, text: "Phone & email support" },
      { icon: <Shield className="w-5 h-5" />, text: "Complete documentation support" },
      { icon: <Camera className="w-5 h-5" />, text: "Detailed market analysis" },
      { icon: <Lock className="w-5 h-5" />, text: "Rental agreement assistance" },
      { icon: <CheckCircle className="w-5 h-5" />, text: "Guaranteed tenant matching" },
      { icon: <Star className="w-5 h-5" />, text: "Premium listing placement" },
      { icon: <UserCheck className="w-5 h-5" />, text: "Personal relationship manager" },
      { icon: <FileText className="w-5 h-5" />, text: "Complete legal documentation" },
      { icon: <TrendingUp className="w-5 h-5" />, text: "Market trend insights" },
      { icon: <Users className="w-5 h-5" />, text: "Tenant verification services" },
      { icon: <Target className="w-5 h-5" />, text: "Priority guaranteed matching" },
      { icon: <Globe className="w-5 h-5" />, text: "Maximum visibility & promotion" },
      { icon: <UserCheck className="w-5 h-5" />, text: "Dedicated relationship manager" },
      { icon: <Shield className="w-5 h-5" />, text: "Premium legal support" },
      { icon: <TrendingUp className="w-5 h-5" />, text: "Advanced market analytics" },
      { icon: <Users className="w-5 h-5" />, text: "Complete tenant verification" },
      { icon: <Phone className="w-5 h-5" />, text: "Rental negotiation support" },
      { icon: <Star className="w-5 h-5" />, text: "Post-rental support" }
    ]
  ];

const keyBenefits = [
  {
    icon: Target,
    title: "Verified Tenant Connect",
    description: "We match your property with pre-screened, high-intent tenants"
  },
  {
    icon: Shield,
    title: "Risk-Free Service",
    description: "No hidden fees — you only pay when we deliver results"
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
      <section 
        className="text-white py-20 pt-32 relative bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('/lovable-uploads/a37b9b71-093e-4303-b129-0e15546b07a8.png')`
        }}
      >
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

      {/* Pricing Plans Section */}
      <section className="py-16 px-4 bg-gray-50" id="pricing">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Choose Your Commercial Owner Plan
          </h2>
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
          <div className={`mt-8 rounded-lg p-8 shadow-sm ${plans[selectedPlan].badgeColor} bg-opacity-10 border border-opacity-20`} style={{
            borderColor: plans[selectedPlan].badgeColor.replace('bg-', ''),
            backgroundColor: plans[selectedPlan].badgeColor.replace('bg-', '') + '20'
          }}>
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
              For assistance call us at: <span className="text-brand-red font-semibold">+91-89-059-998-88</span>
            </p>
            <p className="text-sm text-gray-500">
              <span className="underline cursor-pointer hover:text-gray-700">Terms & Conditions Apply</span>
            </p>
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
                  <p className="text-gray-700 mb-4">"{testimonial.review}"</p>
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

      {/* Support Callout */}
      <section className="py-12 px-4 bg-brand-red text-primary-foreground">
        <div className="max-w-4xl mx-auto text-center">
          <Phone className="w-8 h-8 mx-auto mb-4" />
          <h3 className="text-2xl font-bold mb-4">Need Assistance?</h3>
          <p className="text-lg mb-4">For assistance, call us at</p>
          <a href="tel:+918905999888" className="text-2xl font-bold hover:underline">
            +91-89-059-998-88
          </a>
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
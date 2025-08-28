import React, { useState } from 'react';
import { Check, Phone, MessageCircle, Quote, Star, Target, Users, Shield, Clock, Bell, FileText, Headphones } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Marquee from '@/components/Marquee';

const CommercialBuyerPlan = () => {
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
    ],
    commercial: [
      {
        name: "Business Silver",
        price: "₹4,999",
        gst: "+18% GST",
        badge: "COMMERCIAL SEARCH",
        badgeColor: "bg-blue-500",
      },
      {
        name: "Business Gold", 
        price: "₹8,999",
        gst: "+18% GST",
        badge: "BUSINESS EXPERT",
        badgeColor: "bg-indigo-500",
      },
      {
        name: "Business Platinum",
        price: "₹15,999",
        gst: "+18% GST",
        badge: "VIP COMMERCIAL",
        badgeColor: "bg-purple-600",
      }
    ],
    industrial: [
      {
        name: "Industrial Silver",
        price: "₹7,999",
        gst: "+18% GST",
        badge: "INDUSTRIAL SEARCH",
        badgeColor: "bg-gray-600",
      },
      {
        name: "Industrial Gold", 
        price: "₹15,999",
        gst: "+18% GST",
        badge: "INDUSTRIAL EXPERT",
        badgeColor: "bg-slate-700",
      },
      {
        name: "Industrial Platinum",
        price: "₹25,999",
        gst: "+18% GST",
        badge: "PREMIUM INDUSTRIAL",
        badgeColor: "bg-zinc-800",
      }
    ],
    agricultural: [
      {
        name: "Farm Silver",
        price: "₹2,999",
        gst: "+18% GST",
        badge: "AGRICULTURAL SEARCH",
        badgeColor: "bg-green-600",
      },
      {
        name: "Farm Gold", 
        price: "₹6,999",
        gst: "+18% GST",
        badge: "FARM SPECIALIST",
        badgeColor: "bg-emerald-600",
      },
      {
        name: "Farm Platinum",
        price: "₹12,999",
        gst: "+18% GST",
        badge: "PREMIUM FARM",
        badgeColor: "bg-teal-600",
      }
    ]
  };

  const tabPlanDetails = {
    residential: [
      [
        { icon: <Target className="w-5 h-5" />, text: "Basic property matching" },
        { icon: <Headphones className="w-5 h-5" />, text: "Email support" },
        { icon: <Bell className="w-5 h-5" />, text: "Standard property alerts" },
        { icon: <FileText className="w-5 h-5" />, text: "Basic documentation help" }
      ],
      [
        { icon: <Target className="w-5 h-5" />, text: "Priority property matching" },
        { icon: <Shield className="w-5 h-5" />, text: "Dedicated relationship manager" },
        { icon: <MessageCircle className="w-5 h-5" />, text: "Instant WhatsApp support" },
        { icon: <Phone className="w-5 h-5" />, text: "Price negotiation assistance" },
        { icon: <FileText className="w-5 h-5" />, text: "Legal documentation support" }
      ],
      [
        { icon: <Target className="w-5 h-5" />, text: "Premium property matching" },
        { icon: <Clock className="w-5 h-5" />, text: "24/7 dedicated expert" },
        { icon: <Shield className="w-5 h-5" />, text: "Complete legal & loan assistance" },
        { icon: <Users className="w-5 h-5" />, text: "Personal property advisor" },
        { icon: <Bell className="w-5 h-5" />, text: "Priority property alerts" },
        { icon: <FileText className="w-5 h-5" />, text: "Premium documentation support" }
      ]
    ],
    commercial: [
      [
        { icon: <Target className="w-5 h-5" />, text: "Commercial property matching" },
        { icon: <Headphones className="w-5 h-5" />, text: "Business support" },
        { icon: <Bell className="w-5 h-5" />, text: "Commercial property alerts" },
        { icon: <FileText className="w-5 h-5" />, text: "Business documentation help" }
      ],
      [
        { icon: <Target className="w-5 h-5" />, text: "Priority commercial matching" },
        { icon: <Shield className="w-5 h-5" />, text: "Dedicated business advisor" },
        { icon: <MessageCircle className="w-5 h-5" />, text: "Business WhatsApp support" },
        { icon: <Phone className="w-5 h-5" />, text: "Commercial negotiation" },
        { icon: <FileText className="w-5 h-5" />, text: "Commercial legal support" }
      ],
      [
        { icon: <Target className="w-5 h-5" />, text: "Premium commercial matching" },
        { icon: <Clock className="w-5 h-5" />, text: "24/7 business expert" },
        { icon: <Shield className="w-5 h-5" />, text: "Complete business assistance" },
        { icon: <Users className="w-5 h-5" />, text: "Executive business advisor" },
        { icon: <Bell className="w-5 h-5" />, text: "Priority commercial alerts" },
        { icon: <FileText className="w-5 h-5" />, text: "Premium business documentation" }
      ]
    ],
    industrial: [
      [
        { icon: <Target className="w-5 h-5" />, text: "Industrial property matching" },
        { icon: <Headphones className="w-5 h-5" />, text: "Industrial support" },
        { icon: <Bell className="w-5 h-5" />, text: "Industrial property alerts" },
        { icon: <FileText className="w-5 h-5" />, text: "Industrial documentation help" }
      ],
      [
        { icon: <Target className="w-5 h-5" />, text: "Priority industrial matching" },
        { icon: <Shield className="w-5 h-5" />, text: "Industrial specialist" },
        { icon: <MessageCircle className="w-5 h-5" />, text: "Industrial WhatsApp support" },
        { icon: <Phone className="w-5 h-5" />, text: "Industrial negotiation" },
        { icon: <FileText className="w-5 h-5" />, text: "Industrial legal support" }
      ],
      [
        { icon: <Target className="w-5 h-5" />, text: "Premium industrial matching" },
        { icon: <Clock className="w-5 h-5" />, text: "24/7 industrial expert" },
        { icon: <Shield className="w-5 h-5" />, text: "Complete industrial assistance" },
        { icon: <Users className="w-5 h-5" />, text: "Executive industrial consultant" },
        { icon: <Bell className="w-5 h-5" />, text: "Priority industrial alerts" },
        { icon: <FileText className="w-5 h-5" />, text: "Premium industrial documentation" }
      ]
    ],
    agricultural: [
      [
        { icon: <Target className="w-5 h-5" />, text: "Agricultural property matching" },
        { icon: <Headphones className="w-5 h-5" />, text: "Farm support" },
        { icon: <Bell className="w-5 h-5" />, text: "Agricultural property alerts" },
        { icon: <FileText className="w-5 h-5" />, text: "Farm documentation help" }
      ],
      [
        { icon: <Target className="w-5 h-5" />, text: "Priority farm matching" },
        { icon: <Shield className="w-5 h-5" />, text: "Agricultural specialist" },
        { icon: <MessageCircle className="w-5 h-5" />, text: "Farm WhatsApp support" },
        { icon: <Phone className="w-5 h-5" />, text: "Farm price negotiation" },
        { icon: <FileText className="w-5 h-5" />, text: "Agricultural legal support" }
      ],
      [
        { icon: <Target className="w-5 h-5" />, text: "Premium farm matching" },
        { icon: <Clock className="w-5 h-5" />, text: "24/7 agricultural expert" },
        { icon: <Shield className="w-5 h-5" />, text: "Complete farming assistance" },
        { icon: <Users className="w-5 h-5" />, text: "Senior agricultural consultant" },
        { icon: <Bell className="w-5 h-5" />, text: "Priority farm alerts" },
        { icon: <FileText className="w-5 h-5" />, text: "Premium farm documentation" }
      ]
    ]
  };

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
      <section 
        className="text-white py-20 pt-32 relative bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('/lovable-uploads/ad6e5d82-c08a-4e73-8459-edb904417654.png')`
        }}
      >
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

     

      {/* Commercial Buyer Plans with Tabs */}
      <section id="pricing" className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Choose Your Plan
          </h2>
          <p className="text-lg text-muted-foreground text-center mb-12">Select the category that best fits your property search needs</p>
          
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
              For assistance call us at: <span className="text-brand-red font-semibold">+91-89-059-996-69</span>
            </p>
           <p className="text-sm text-gray-500">
  <Link 
    to="/terms-and-conditions" 
    className="underline cursor-pointer hover:text-gray-700"
  >
    Terms & Conditions Apply
  </Link>
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
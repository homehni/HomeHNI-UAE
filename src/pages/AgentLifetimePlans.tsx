import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, Check, Phone, Home, Users, Shield, Clock, UserCheck, Globe, Lock, FileText, TrendingUp, Camera, Bell, Headphones, Video, BarChart3, Crown, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Marquee from '@/components/Marquee';

const AgentLifetimePlans = () => {
  const [selectedPlans, setSelectedPlans] = useState({
    residential: 0,
    commercial: 0, 
    industrial: 0,
    agricultural: 0
  });

  const tabPlans = {
    residential: [
      {
        name: "Lifetime Standard",
        price: "₹79,999",
        gst: "+18% GST",
        badge: "FOR NEW AGENTS",
        badgeColor: "bg-yellow-500",
      },
      {
        name: "Lifetime Platinum", 
        price: "₹1,49,999",
        gst: "+18% GST",
        badge: "ENHANCED VISIBILITY",
        badgeColor: "bg-green-500",
      },
      {
        name: "Lifetime VIP",
        price: "₹2,49,999",
        gst: "+18% GST", 
        badge: "EXCLUSIVE SERVICES",
        badgeColor: "bg-red-500",
      }
    ],
    commercial: [
      {
        name: "Commercial Standard",
        price: "₹1,49,999",
        gst: "+18% GST",
        badge: "COMMERCIAL FOCUS",
        badgeColor: "bg-blue-500",
      },
      {
        name: "Commercial Platinum", 
        price: "₹2,49,999",
        gst: "+18% GST",
        badge: "BUSINESS GROWTH",
        badgeColor: "bg-indigo-500",
      },
      {
        name: "Commercial VIP",
        price: "₹3,49,999",
        gst: "+18% GST", 
        badge: "ENTERPRISE LEVEL",
        badgeColor: "bg-purple-600",
      }
    ],
    industrial: [
      {
        name: "Industrial Standard",
        price: "₹1,99,999",
        gst: "+18% GST",
        badge: "INDUSTRIAL SPECIALIST",
        badgeColor: "bg-gray-600",
      },
      {
        name: "Industrial Platinum", 
        price: "₹2,99,999",
        gst: "+18% GST",
        badge: "ADVANCED TOOLS",
        badgeColor: "bg-slate-700",
      },
      {
        name: "Industrial VIP",
        price: "₹3,99,999",
        gst: "+18% GST", 
        badge: "PREMIUM SUPPORT",
        badgeColor: "bg-zinc-800",
      }
    ],
    agricultural: [
      {
        name: "Agricultural Standard",
        price: "₹89,999",
        gst: "+18% GST",
        badge: "FARM PROPERTIES",
        badgeColor: "bg-green-600",
      },
      {
        name: "Agricultural Platinum", 
        price: "₹1,59,999",
        gst: "+18% GST",
        badge: "RURAL EXPERTISE",
        badgeColor: "bg-emerald-600",
      },
      {
        name: "Agricultural VIP",
        price: "₹2,29,999",
        gst: "+18% GST", 
        badge: "SPECIALIZED SERVICE",
        badgeColor: "bg-lime-700",
      }
    ]
  };

  const tabPlanDetails = {
    residential: [
      // Lifetime Standard features
      [
        { icon: <Bell className="w-5 h-5" />, text: "Property Alerts & Notifications" },
        { icon: <Home className="w-5 h-5" />, text: "Limited Property Listings" },
        { icon: <Headphones className="w-5 h-5" />, text: "Basic Customer Support" },
        { icon: <FileText className="w-5 h-5" />, text: "Standard Marketing Materials" }
      ],
      // Lifetime Platinum features
      [
        { icon: <Bell className="w-5 h-5" />, text: "Property Alerts & Notifications" },
        { icon: <Home className="w-5 h-5" />, text: "Unlimited Property Listings" },
        { icon: <Headphones className="w-5 h-5" />, text: "Priority Customer Support" },
        { icon: <Video className="w-5 h-5" />, text: "Virtual Tour Creation Tools" },
        { icon: <TrendingUp className="w-5 h-5" />, text: "Enhanced Marketing Resources" },
        { icon: <Globe className="w-5 h-5" />, text: "Featured Listing Placement" },
        { icon: <Users className="w-5 h-5" />, text: "Lead Generation Support" },
        { icon: <Camera className="w-5 h-5" />, text: "Professional Photography Credits" }
      ],
      // Lifetime VIP features
      [
        { icon: <Crown className="w-5 h-5" />, text: "VIP Concierge Service" },
        { icon: <Home className="w-5 h-5" />, text: "Unlimited Premium Listings" },
        { icon: <BarChart3 className="w-5 h-5" />, text: "Advanced Analytics Dashboard" },
        { icon: <TrendingUp className="w-5 h-5" />, text: "Premium Marketing Campaigns" },
        { icon: <Zap className="w-5 h-5" />, text: "Exclusive Listing Access" },
        { icon: <Headphones className="w-5 h-5" />, text: "24/7 Dedicated Support" },
        { icon: <Video className="w-5 h-5" />, text: "Professional Video Marketing" },
        { icon: <Users className="w-5 h-5" />, text: "Personal Account Manager" },
        { icon: <Globe className="w-5 h-5" />, text: "Multi-Platform Promotion" },
        { icon: <Shield className="w-5 h-5" />, text: "Priority Issue Resolution" }
      ]
    ],
    commercial: [
      // Commercial Standard features  
      [
        { icon: <Bell className="w-5 h-5" />, text: "Commercial Property Alerts" },
        { icon: <Home className="w-5 h-5" />, text: "Limited Commercial Listings" },
        { icon: <Headphones className="w-5 h-5" />, text: "Business Hours Support" },
        { icon: <FileText className="w-5 h-5" />, text: "Commercial Marketing Kit" }
      ],
      // Commercial Platinum features
      [
        { icon: <Bell className="w-5 h-5" />, text: "Priority Commercial Alerts" },
        { icon: <Home className="w-5 h-5" />, text: "Unlimited Commercial Listings" },
        { icon: <Headphones className="w-5 h-5" />, text: "Priority Business Support" },
        { icon: <Video className="w-5 h-5" />, text: "Commercial Virtual Tours" },
        { icon: <TrendingUp className="w-5 h-5" />, text: "Business Growth Analytics" },
        { icon: <Globe className="w-5 h-5" />, text: "Featured Commercial Placement" },
        { icon: <Users className="w-5 h-5" />, text: "B2B Lead Generation" },
        { icon: <Camera className="w-5 h-5" />, text: "Commercial Photography Package" }
      ],
      // Commercial VIP features
      [
        { icon: <Crown className="w-5 h-5" />, text: "VIP Commercial Concierge" },
        { icon: <Home className="w-5 h-5" />, text: "Premium Commercial Portfolio" },
        { icon: <BarChart3 className="w-5 h-5" />, text: "Enterprise Analytics Suite" },
        { icon: <TrendingUp className="w-5 h-5" />, text: "Strategic Marketing Campaigns" },
        { icon: <Zap className="w-5 h-5" />, text: "Exclusive Commercial Access" },
        { icon: <Headphones className="w-5 h-5" />, text: "Dedicated Account Executive" },
        { icon: <Video className="w-5 h-5" />, text: "Professional Commercial Videos" },
        { icon: <Users className="w-5 h-5" />, text: "Corporate Relationship Manager" },
        { icon: <Globe className="w-5 h-5" />, text: "Multi-Channel Marketing" },
        { icon: <Shield className="w-5 h-5" />, text: "White-Glove Service" }
      ]
    ],
    industrial: [
      // Industrial Standard features
      [
        { icon: <Bell className="w-5 h-5" />, text: "Industrial Property Alerts" },
        { icon: <Home className="w-5 h-5" />, text: "Limited Industrial Listings" },
        { icon: <Headphones className="w-5 h-5" />, text: "Specialized Support" },
        { icon: <FileText className="w-5 h-5" />, text: "Industrial Documentation Kit" }
      ],
      // Industrial Platinum features
      [
        { icon: <Bell className="w-5 h-5" />, text: "Priority Industrial Alerts" },
        { icon: <Home className="w-5 h-5" />, text: "Unlimited Industrial Listings" },
        { icon: <Headphones className="w-5 h-5" />, text: "Industrial Expert Support" },
        { icon: <Video className="w-5 h-5" />, text: "Industrial Site Tours" },
        { icon: <TrendingUp className="w-5 h-5" />, text: "Industrial Market Analytics" },
        { icon: <Globe className="w-5 h-5" />, text: "Featured Industrial Placement" },
        { icon: <Users className="w-5 h-5" />, text: "Industrial Lead Network" },
        { icon: <Camera className="w-5 h-5" />, text: "Industrial Site Photography" }
      ],
      // Industrial VIP features
      [
        { icon: <Crown className="w-5 h-5" />, text: "VIP Industrial Specialist" },
        { icon: <Home className="w-5 h-5" />, text: "Premium Industrial Portfolio" },
        { icon: <BarChart3 className="w-5 h-5" />, text: "Industrial Intelligence Suite" },
        { icon: <TrendingUp className="w-5 h-5" />, text: "Strategic Industrial Marketing" },
        { icon: <Zap className="w-5 h-5" />, text: "Exclusive Industrial Access" },
        { icon: <Headphones className="w-5 h-5" />, text: "Industrial Relationship Manager" },
        { icon: <Video className="w-5 h-5" />, text: "Industrial Facility Videos" },
        { icon: <Users className="w-5 h-5" />, text: "Corporate Industrial Network" },
        { icon: <Globe className="w-5 h-5" />, text: "Multi-Platform Industrial Marketing" },
        { icon: <Shield className="w-5 h-5" />, text: "Priority Industrial Support" }
      ]
    ],
    agricultural: [
      // Agricultural Standard features
      [
        { icon: <Bell className="w-5 h-5" />, text: "Agricultural Property Alerts" },
        { icon: <Home className="w-5 h-5" />, text: "Limited Farm Listings" },
        { icon: <Headphones className="w-5 h-5" />, text: "Rural Property Support" },
        { icon: <FileText className="w-5 h-5" />, text: "Agricultural Documentation" }
      ],
      // Agricultural Platinum features
      [
        { icon: <Bell className="w-5 h-5" />, text: "Priority Agricultural Alerts" },
        { icon: <Home className="w-5 h-5" />, text: "Unlimited Agricultural Listings" },
        { icon: <Headphones className="w-5 h-5" />, text: "Agricultural Expert Support" },
        { icon: <Video className="w-5 h-5" />, text: "Farm Virtual Tours" },
        { icon: <TrendingUp className="w-5 h-5" />, text: "Agricultural Market Insights" },
        { icon: <Globe className="w-5 h-5" />, text: "Featured Agricultural Placement" },
        { icon: <Users className="w-5 h-5" />, text: "Farmer Network Access" },
        { icon: <Camera className="w-5 h-5" />, text: "Agricultural Photography" }
      ],
      // Agricultural VIP features
      [
        { icon: <Crown className="w-5 h-5" />, text: "VIP Agricultural Specialist" },
        { icon: <Home className="w-5 h-5" />, text: "Premium Agricultural Portfolio" },
        { icon: <BarChart3 className="w-5 h-5" />, text: "Agricultural Analytics Suite" },
        { icon: <TrendingUp className="w-5 h-5" />, text: "Strategic Agricultural Marketing" },
        { icon: <Zap className="w-5 h-5" />, text: "Exclusive Agricultural Access" },
        { icon: <Headphones className="w-5 h-5" />, text: "Dedicated Agricultural Manager" },
        { icon: <Video className="w-5 h-5" />, text: "Professional Farm Videos" },
        { icon: <Users className="w-5 h-5" />, text: "Agricultural Network Manager" },
        { icon: <Globe className="w-5 h-5" />, text: "Multi-Channel Agricultural Marketing" },
        { icon: <Shield className="w-5 h-5" />, text: "Priority Agricultural Support" }
      ]
    ]
  };

  const bestForDescriptions = {
    residential: [
      "New residential agents or those starting out with moderate exposure needs",
      "Established residential agents looking for unlimited listings and enhanced visibility",
      "Top-tier residential agents handling luxury properties requiring exclusive services"
    ],
    commercial: [
      "Commercial agents starting with business property focus",
      "Established commercial agents seeking business growth tools",
      "Enterprise-level commercial agents handling major deals"
    ],
    industrial: [
      "Industrial property specialists starting their practice",
      "Experienced industrial agents with advanced requirements",
      "Premium industrial agents handling complex facility deals"
    ],
    agricultural: [
      "Agricultural property agents focusing on farm sales",
      "Rural property experts with specialized knowledge",
      "Premium agricultural agents handling large farm transactions"
    ]
  };

  const howItWorks = [
    "Choose your Agent Lifetime Plan",
    "Get unlimited property listings access",
    "Access marketing tools and resources",
    "Connect with verified property leads",
    "Grow your agent business exponentially",
    "Enjoy lifetime benefits and support"
  ];

  const faqs = [
    {
      question: "What makes Agent Lifetime Plans different from regular plans?",
      answer: "Agent Lifetime Plans provide unlimited access to our platform with no recurring fees, enhanced marketing tools, and priority support designed specifically for real estate professionals."
    },
    {
      question: "Can I upgrade my plan later?",
      answer: "Yes, you can upgrade to a higher tier plan by paying the difference. Contact our support team for assistance with plan upgrades."
    },
    {
      question: "What kind of support do I get with each plan?",
      answer: "Standard includes basic support, Platinum offers priority support with dedicated channels, and VIP provides 24/7 personal account management."
    },
    {
      question: "Are there any hidden charges after purchase?",
      answer: "No, lifetime plans are one-time payments with no recurring charges. All features mentioned are included for life."
    },
    {
      question: "How do marketing resources work?",
      answer: "Each plan includes different levels of marketing materials, from basic templates to premium video marketing and multi-platform promotions."
    },
    {
      question: "What happens if I need more listings than my plan allows?",
      answer: "Standard plan has limited listings. Platinum and VIP plans offer unlimited listings. You can upgrade anytime to access more features."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Marquee />
      <Header />
      
      {/* Hero Section */}
      <section 
        className="relative text-white py-16 px-4 pt-28 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('/lovable-uploads/65ce32d0-061c-4934-8723-62372be4cd91.png')`
        }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-6">
            Choose an Agent Lifetime Plan and Get <span className="text-yellow-400">UNLIMITED</span> Property Listings
          </h1>

          <p className="text-lg md:text-xl mb-6 max-w-3xl mx-auto">
            Trusted by thousands of real estate agents. Choose the lifetime plan that accelerates your business growth
          </p>
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="flex">
              {[1, 2, 3, 4, 5].map(star => <Star key={star} className="w-5 h-5 fill-yellow-400 text-yellow-400" />)}
            </div>
            <span className="ml-2"> 5 Stars Rated by Agents</span>
          </div>
        </div>
      </section>

      {/* Agent Lifetime Plans */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Agent Lifetime Plans
            </h2>
          </div>

          <Tabs defaultValue="residential" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-8">
              <TabsTrigger value="residential">Residential</TabsTrigger>
              <TabsTrigger value="commercial">Commercial</TabsTrigger>
              <TabsTrigger value="industrial">Industrial</TabsTrigger>
              <TabsTrigger value="agricultural">Agricultural</TabsTrigger>
            </TabsList>

            {Object.entries(tabPlans).map(([category, plans]) => (
              <TabsContent key={category} value={category} className="space-y-8">
                {/* Plan Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {plans.map((plan, index) => (
                    <Card 
                      key={index} 
                      className={`relative cursor-pointer transition-all duration-200 ${
                        selectedPlans[category as keyof typeof selectedPlans] === index ? 'ring-2 ring-brand-red bg-muted' : 'bg-card hover:shadow-md'
                      }`}
                      onClick={() => setSelectedPlans(prev => ({ ...prev, [category]: index }))}
                    >
                      <div className="absolute top-3 left-3 right-3">
                        <Badge className={`${plan.badgeColor} text-white text-xs px-2 py-1 font-medium w-full text-center`}>
                          {plan.badge}
                        </Badge>
                      </div>
                      
                      <CardContent className="pt-16 pb-6 px-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-3">{plan.name}</h3>
                        <div className="mb-4">
                          <span className="text-2xl font-bold text-gray-900">{plan.price}</span>
                          <div className="text-sm text-gray-500">{plan.gst}</div>
                        </div>
                        
                        <div className="mb-6 text-sm text-gray-600">
                          <strong>Best For:</strong> {bestForDescriptions[category as keyof typeof bestForDescriptions][index]}
                        </div>
                        
                        <Button 
                          className={`w-full ${
                            selectedPlans[category as keyof typeof selectedPlans] === index 
                              ? 'bg-brand-red hover:bg-brand-maroon-dark text-white' 
                              : 'bg-transparent text-foreground border border-border hover:bg-muted'
                          }`}
                        >
                          Choose Plan
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Plan Details */}
                <div className={`mt-8 rounded-lg p-8 shadow-sm ${plans[selectedPlans[category as keyof typeof selectedPlans]].badgeColor} bg-opacity-10 border border-opacity-20`} style={{
                  borderColor: plans[selectedPlans[category as keyof typeof selectedPlans]].badgeColor.replace('bg-', ''),
                  backgroundColor: plans[selectedPlans[category as keyof typeof selectedPlans]].badgeColor.replace('bg-', '') + '20'
                }}>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {tabPlanDetails[category as keyof typeof tabPlanDetails][selectedPlans[category as keyof typeof selectedPlans]].map((detail, index) => (
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
              For assistance call us at: <span className="text-brand-red font-semibold">+91-92-430-099-80</span>
            </p>
            <p className="text-sm text-gray-500">
              <span className="underline cursor-pointer hover:text-gray-700">Terms & Conditions Apply</span>
            </p>
          </div>
        </div>
      </section>

      {/* How Our Agent Plans Work */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">🚀 Accelerate Your Agent Business</h2>
            <p className="text-lg text-muted-foreground">Here's how our lifetime plans help you succeed</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {howItWorks.map((step, index) => (
              <Card key={index} className="p-6 text-center">
                <CardContent className="pt-0">
                  <div className="w-12 h-12 bg-brand-red text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                    {index + 1}
                  </div>
                  <p className="font-medium">{step}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
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
      </section>

      {/* Final CTA */}
      <section className="py-16 px-4 gradient-red-maroon text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Start Your Agent Success Journey Today — Choose Your Lifetime Plan!
          </h2>
          <Button className="bg-white text-brand-red hover:bg-gray-100 text-lg px-8 py-3">
            Get Started Now
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AgentLifetimePlans;
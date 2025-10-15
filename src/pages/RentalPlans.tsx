import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import OwnerPlans from './OwnerPlans';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Star, Clock, UserCheck, FileText, TrendingUp, Globe, Camera, Shield, Users } from 'lucide-react';
import PayButton from '@/components/PayButton';
import GSTDisplay from '@/components/GSTDisplay';
import { calculateTotalWithGST } from '@/utils/gstCalculator';
import { supabase } from '@/integrations/supabase/client';

interface RentalPlansProps { 
  embedded?: boolean 
}

type Category = 'residential' | 'commercial' | 'industrial' | 'agricultural';

const RentalPlans = ({ embedded }: RentalPlansProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedTenantPlan, setSelectedTenantPlan] = useState({
    residential: 0,
    commercial: 0,
    industrial: 0,
    agricultural: 0
  });
  
  // Handle free plan subscription
  const handleFreeSubscription = async (planName: string) => {
    try {
      // Get the current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        // If user is not logged in, redirect to login or show login dialog
        // You may want to implement a login dialog here
        alert("Please log in to subscribe to a free plan");
        return;
      }
      
      // Generate a unique payment ID for the free subscription
      const freePaymentId = `free-${Date.now()}-${Math.random().toString(36).substring(2, 10)}`;
      const currentDate = new Date();
      const expiryDate = new Date();
      const invoiceNumber = `INV-FREE-${Date.now()}`;
      
      // Calculate expiry date based on plan type (similar to paid plans)
      if (planName.toLowerCase().includes('lifetime')) {
        expiryDate.setFullYear(expiryDate.getFullYear() + 100); // 100 years for lifetime
      } else if (planName.toLowerCase().includes('year')) {
        expiryDate.setFullYear(expiryDate.getFullYear() + 1);
      } else {
        expiryDate.setMonth(expiryDate.getMonth() + 1); // Default to 1 month
      }
      
      // Record free subscription in the payments table
      const { error: paymentError } = await supabase
        .from('payments')
        .insert({
          user_id: user.id,
          payment_id: freePaymentId,
          plan_name: planName,
          amount_paise: 0, // Free plan has 0 cost
          amount_rupees: 0,
          currency: 'INR',
          status: 'success',
          payment_method: 'free',
          payment_date: currentDate.toISOString(),
          invoice_number: invoiceNumber,
          plan_type: planName.toLowerCase().includes('lifetime') ? 'lifetime' : 'subscription',
          plan_duration: planName.toLowerCase().includes('lifetime') 
            ? 'lifetime' 
            : planName.toLowerCase().includes('year') ? '1 year' : '1 month',
          expires_at: expiryDate.toISOString(),
          metadata: {
            free_plan: true
          }
        });
        
      if (paymentError) {
        console.error('Error recording free subscription:', paymentError);
        alert("There was an error processing your subscription. Please try again.");
        return;
      }
      
      // Redirect to the success page
      navigate(`/payment/success?payment_id=${freePaymentId}`);
      
    } catch (error) {
      console.error('Error in free subscription process:', error);
      alert("There was an error processing your subscription. Please try again.");
    }
  };

  // Derive current tab/category from URL and keep them in sync
  const getParam = (key: string) => new URLSearchParams(location.search).get(key);
  const initialOuter = (getParam('rentalRole') as 'owner' | 'tenant') || 'owner';
  const initialCategory = (getParam('category') as Category) || 'residential';
  const [outerTab, setOuterTab] = useState<'owner' | 'tenant'>(initialOuter);
  const [tenantCategory, setTenantCategory] = useState<Category>(initialCategory);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const role = (params.get('rentalRole') as 'owner' | 'tenant') || 'owner';
    const cat = (params.get('category') as Category) || 'residential';
    setOuterTab(role);
    setTenantCategory(cat);
  }, [location.search]);

  const tenantPlansData = {
    residential: [
      {
        name: "Basic",
        price: "₹99",
        originalPrice: "₹199",
        freePrice: "FREE",
        gst: "+18% GST",
        badge: "SEARCH ASSISTANCE", 
        badgeColor: "bg-blue-500",
        amountPaise: 9900,
        isFree: true,
      },
      {
        name: "Standard", 
        price: "₹499",
        gst: "+18% GST",
        badge: "VISIT COORDINATION",
        badgeColor: "bg-green-500", 
        amountPaise: 49900,
      },
      {
        name: "Premium",
        price: "₹999",
        gst: "+18% GST",
        badge: "EXPERT ASSISTANCE",
        badgeColor: "bg-purple-500",
        amountPaise: 99900,
      }
    ],
    commercial: [
      {
        name: "Business Basic",
        price: "₹1,499",
        gst: "+18% GST",
        badge: "COMMERCIAL SEARCH", 
        badgeColor: "bg-blue-600",
        amountPaise: 149900,
      },
      {
        name: "Business Standard", 
        price: "₹2,499",
        gst: "+18% GST",
        badge: "OFFICE COORDINATION",
        badgeColor: "bg-green-600", 
        amountPaise: 249900,
      },
      {
        name: "Business Premium",
        price: "₹3,999",
        gst: "+18% GST",
        badge: "CORPORATE ASSISTANCE",
        badgeColor: "bg-purple-600",
        amountPaise: 399900,
      }
    ],
    industrial: [
      {
        name: "Industrial Basic",
        price: "₹2,999",
        gst: "+18% GST",
        badge: "FACILITY SEARCH", 
        badgeColor: "bg-gray-600",
        amountPaise: 299900,
      },
      {
        name: "Industrial Standard", 
        price: "₹4,999",
        gst: "+18% GST",
        badge: "SITE COORDINATION",
        badgeColor: "bg-slate-600", 
        amountPaise: 499900,
      },
      {
        name: "Industrial Premium",
        price: "₹7,999",
        gst: "+18% GST",
        badge: "INDUSTRIAL EXPERTISE",
        badgeColor: "bg-zinc-700",
        amountPaise: 799900,
      }
    ],
    agricultural: [
      {
        name: "Farm Basic",
        price: "₹799",
        gst: "+18% GST",
        badge: "LAND SEARCH", 
        badgeColor: "bg-green-700",
        amountPaise: 79900,
      },
      {
        name: "Farm Standard", 
        price: "₹1,299",
        gst: "+18% GST",
        badge: "RURAL COORDINATION",
        badgeColor: "bg-emerald-600", 
        amountPaise: 129900,
      },
      {
        name: "Farm Premium",
        price: "₹1,999",
        gst: "+18% GST",
        badge: "AGRI EXPERTISE",
        badgeColor: "bg-lime-700",
        amountPaise: 199900,
      }
    ]
  };

  const tenantPlanDetailsData = {
    residential: [
      [
        { icon: <Clock className="w-5 h-5" />, text: "30 Days Plan Validity" },
        { icon: <UserCheck className="w-5 h-5" />, text: "Property Search Assistance" },
        { icon: <FileText className="w-5 h-5" />, text: "Basic Documentation Help" }
      ],
      [
        { icon: <Clock className="w-5 h-5" />, text: "60 Days Plan Validity" },
        { icon: <UserCheck className="w-5 h-5" />, text: "Dedicated Tenant Advisor" },
        { icon: <FileText className="w-5 h-5" />, text: "Complete Documentation Support" },
        { icon: <Users className="w-5 h-5" />, text: "Property Visit Coordination" },
        { icon: <Globe className="w-5 h-5" />, text: "Priority Listing Access" }
      ],
      [
        { icon: <Clock className="w-5 h-5" />, text: "90 Days Plan Validity" },
        { icon: <UserCheck className="w-5 h-5" />, text: "Personal Tenant Consultant" },
        { icon: <FileText className="w-5 h-5" />, text: "Legal Documentation Review" },
        { icon: <Users className="w-5 h-5" />, text: "Personalized Property Tours" },
        { icon: <Globe className="w-5 h-5" />, text: "Exclusive Property Access" },
        { icon: <Shield className="w-5 h-5" />, text: "Negotiation Support" },
        { icon: <Camera className="w-5 h-5" />, text: "Virtual Property Tours" }
      ]
    ],
    commercial: [
      [
        { icon: <Clock className="w-5 h-5" />, text: "45 Days Plan Validity" },
        { icon: <UserCheck className="w-5 h-5" />, text: "Commercial Space Search" },
        { icon: <FileText className="w-5 h-5" />, text: "Business Documentation Support" }
      ],
      [
        { icon: <Clock className="w-5 h-5" />, text: "75 Days Plan Validity" },
        { icon: <UserCheck className="w-5 h-5" />, text: "Dedicated Commercial Advisor" },
        { icon: <FileText className="w-5 h-5" />, text: "Legal Commercial Documentation" },
        { icon: <Users className="w-5 h-5" />, text: "Office Visit Coordination" },
        { icon: <Globe className="w-5 h-5" />, text: "Prime Location Access" }
      ],
      [
        { icon: <Clock className="w-5 h-5" />, text: "120 Days Plan Validity" },
        { icon: <UserCheck className="w-5 h-5" />, text: "Corporate Space Consultant" },
        { icon: <FileText className="w-5 h-5" />, text: "Complete Legal Review" },
        { icon: <Users className="w-5 h-5" />, text: "Executive Property Tours" },
        { icon: <Globe className="w-5 h-5" />, text: "Exclusive Commercial Access" },
        { icon: <Shield className="w-5 h-5" />, text: "Business Negotiation Support" },
        { icon: <Camera className="w-5 h-5" />, text: "Virtual Office Tours" }
      ]
    ],
    industrial: [
      [
        { icon: <Clock className="w-5 h-5" />, text: "60 Days Plan Validity" },
        { icon: <UserCheck className="w-5 h-5" />, text: "Industrial Site Search" },
        { icon: <FileText className="w-5 h-5" />, text: "Industrial Documentation" }
      ],
      [
        { icon: <Clock className="w-5 h-5" />, text: "90 Days Plan Validity" },
        { icon: <UserCheck className="w-5 h-5" />, text: "Industrial Facility Advisor" },
        { icon: <FileText className="w-5 h-5" />, text: "Compliance Documentation" },
        { icon: <Users className="w-5 h-5" />, text: "Site Visit Coordination" },
        { icon: <Globe className="w-5 h-5" />, text: "Industrial Zone Access" }
      ],
      [
        { icon: <Clock className="w-5 h-5" />, text: "150 Days Plan Validity" },
        { icon: <UserCheck className="w-5 h-5" />, text: "Industrial Specialist" },
        { icon: <FileText className="w-5 h-5" />, text: "Complete Compliance Review" },
        { icon: <Users className="w-5 h-5" />, text: "Specialized Site Tours" },
        { icon: <Globe className="w-5 h-5" />, text: "Premium Industrial Access" },
        { icon: <Shield className="w-5 h-5" />, text: "Industrial Negotiation" },
        { icon: <Camera className="w-5 h-5" />, text: "Facility Virtual Tours" }
      ]
    ],
    agricultural: [
      [
        { icon: <Clock className="w-5 h-5" />, text: "45 Days Plan Validity" },
        { icon: <UserCheck className="w-5 h-5" />, text: "Agricultural Land Search" },
        { icon: <FileText className="w-5 h-5" />, text: "Land Documentation Help" }
      ],
      [
        { icon: <Clock className="w-5 h-5" />, text: "75 Days Plan Validity" },
        { icon: <UserCheck className="w-5 h-5" />, text: "Agricultural Land Advisor" },
        { icon: <FileText className="w-5 h-5" />, text: "Land Title Verification" },
        { icon: <Users className="w-5 h-5" />, text: "Farm Visit Coordination" },
        { icon: <Globe className="w-5 h-5" />, text: "Rural Area Access" }
      ],
      [
        { icon: <Clock className="w-5 h-5" />, text: "120 Days Plan Validity" },
        { icon: <UserCheck className="w-5 h-5" />, text: "Agricultural Specialist" },
        { icon: <FileText className="w-5 h-5" />, text: "Complete Land Survey" },
        { icon: <Users className="w-5 h-5" />, text: "Agricultural Site Tours" },
        { icon: <Globe className="w-5 h-5" />, text: "Premium Agricultural Land" },
        { icon: <Shield className="w-5 h-5" />, text: "Land Deal Negotiation" },
        { icon: <Camera className="w-5 h-5" />, text: "Aerial Land Surveys" }
      ]
    ]
  };

  return (
    <div className={embedded ? "" : "min-h-screen bg-background"}>
      <div className={embedded ? "py-8 px-4 bg-gray-50" : "py-16 px-4 bg-gray-50"}>
        <div className="max-w-6xl mx-auto">
          <div className={embedded ? "text-center mb-6" : "text-center mb-12"}>
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-2">Rental Plans</h2>
            <p className={embedded ? "text-sm text-muted-foreground" : "text-lg text-muted-foreground"}>Choose between Owner plans for renting out property or Tenant plans for finding rental property</p>
          </div>

          <Tabs value={outerTab} onValueChange={(v) => {
            const value = v as 'owner' | 'tenant';
            setOuterTab(value);
            const url = new URL(window.location.href);
            url.searchParams.set('tab', 'rental');
            url.searchParams.set('rentalRole', value);
            // preserve category when switching tabs
            if (!url.searchParams.get('category')) {
              url.searchParams.set('category', tenantCategory);
            }
            window.history.pushState(null, '', url.toString());
          }} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8 p-1 gap-1 bg-muted rounded-lg h-auto">
              <TabsTrigger value="owner" className="text-xs sm:text-sm md:text-base py-2 sm:py-3 px-2 sm:px-4 data-[state=active]:bg-background data-[state=active]:text-foreground whitespace-nowrap">Owner Plans</TabsTrigger>
              <TabsTrigger value="tenant" className="text-xs sm:text-sm md:text-base py-2 sm:py-3 px-2 sm:px-4 data-[state=active]:bg-background data-[state=active]:text-foreground whitespace-nowrap">Tenant Plans</TabsTrigger>
            </TabsList>

            <TabsContent value="owner" className="space-y-8">
              <OwnerPlans embedded />
            </TabsContent>

            <TabsContent value="tenant" className="space-y-8">
              <Tabs value={tenantCategory} onValueChange={(v) => {
                const value = v as Category;
                setTenantCategory(value);
                const url = new URL(window.location.href);
                url.searchParams.set('tab', 'rental');
                url.searchParams.set('rentalRole', 'tenant');
                url.searchParams.set('category', value);
                window.history.pushState(null, '', url.toString());
              }} className="w-full">
                <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 mb-8 p-1 gap-1 bg-muted rounded-lg h-auto">
                  <TabsTrigger value="residential" className="text-xs sm:text-sm md:text-base py-2 sm:py-3 px-2 sm:px-4 data-[state=active]:bg-background data-[state=active]:text-foreground whitespace-nowrap">Residential</TabsTrigger>
                  <TabsTrigger value="commercial" className="text-xs sm:text-sm md:text-base py-2 sm:py-3 px-2 sm:px-4 data-[state=active]:bg-background data-[state=active]:text-foreground whitespace-nowrap">Commercial</TabsTrigger>
                  <TabsTrigger value="industrial" className="text-xs sm:text-sm md:text-base py-2 sm:py-3 px-2 sm:px-4 data-[state=active]:bg-background data-[state=active]:text-foreground whitespace-nowrap">Industrial</TabsTrigger>
                  <TabsTrigger value="agricultural" className="text-xs sm:text-sm md:text-base py-2 sm:py-3 px-2 sm:px-4 data-[state=active]:bg-background data-[state=active]:text-foreground whitespace-nowrap">Agricultural</TabsTrigger>
                </TabsList>

                {Object.entries(tenantPlansData).map(([category, plans]) => (
                  <TabsContent key={category} value={category} className="space-y-8">
                    {/* Plan Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                      {plans.map((plan, index) => (
                        <Card 
                          key={index}
                          className={`relative cursor-pointer transition-all duration-200 ${
                            selectedTenantPlan[category as keyof typeof selectedTenantPlan] === index ? 'ring-2 ring-brand-red bg-muted' : 'bg-card hover:shadow-md'
                          }`}
                          onClick={() => setSelectedTenantPlan(prev => ({ ...prev, [category]: index }))}
                        >
                          <div className="absolute top-3 left-3 right-3">
                            <Badge className={`${plan.badgeColor} text-white text-xs px-2 py-1 font-medium w-full text-center`}>
                              {plan.badge}
                            </Badge>
                          </div>
                          
                          <CardContent className="pt-16 pb-6 px-6">
                            <h3 className="text-xl font-bold text-gray-900 mb-3">{plan.name}</h3>
                            <div className="mb-6">
                              {plan.isFree ? (
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2">
                                    <span className="text-lg text-gray-400 line-through">{plan.originalPrice}</span>
                                    <span className="text-2xl font-bold text-green-600">{plan.freePrice}</span>
                                  </div>
                                </div>
                              ) : (
                                <div className="space-y-1">
                                  <div className="text-2xl font-bold text-gray-900">{plan.price}</div>
                                  <GSTDisplay basePriceInPaise={plan.amountPaise} />
                                </div>
                              )}
                            </div>
                            
                            {plan.isFree ? (
                              <Button 
                                onClick={() => handleFreeSubscription(`Rental - ${plan.name}`)}
                                className={`w-full ${
                                  selectedTenantPlan[category as keyof typeof selectedTenantPlan] === index 
                                    ? 'bg-brand-red hover:bg-brand-maroon-dark text-white' 
                                    : 'bg-transparent text-foreground border border-border hover:bg-muted'
                                }`}
                              >
                                Subscribe - FREE
                              </Button>
                            ) : (
                              <PayButton
                                label="Subscribe"  
                                planName={`Tenant — ${plan.name}`}
                                amountPaise={calculateTotalWithGST(plan.amountPaise)}
                                className={`w-full ${
                                  selectedTenantPlan[category as keyof typeof selectedTenantPlan] === index 
                                    ? 'bg-brand-red hover:bg-brand-maroon-dark text-white' 
                                    : 'bg-transparent text-foreground border border-border hover:bg-muted'
                                }`}
                              />
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>

                    {/* Plan Details - matching Owner plan structure */}
                    <div className={`rounded-lg p-8 shadow-sm bg-opacity-10 border border-opacity-20 ${plans[selectedTenantPlan[category as keyof typeof selectedTenantPlan]].badgeColor}`} style={{
                      borderColor: plans[selectedTenantPlan[category as keyof typeof selectedTenantPlan]].badgeColor.replace('bg-', ''),
                      backgroundColor: plans[selectedTenantPlan[category as keyof typeof selectedTenantPlan]].badgeColor.replace('bg-', '') + '20'
                    }}>
                      <h3 className="text-xl font-bold mb-6 text-center">What You Get</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {tenantPlanDetailsData[category as keyof typeof tenantPlanDetailsData][selectedTenantPlan[category as keyof typeof selectedTenantPlan]].map((detail, index) => (
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
                      
                      {/* Contact Info inside features section */}
                      <div className="mt-6">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                          {/* Phone number - center aligned */}
                          <div className="text-center sm:text-center sm:flex-1">
                            <span className="text-gray-600">For assistance call us at: </span>
                            <a 
                              href="tel:+918074017388" 
                              className="text-brand-red font-semibold text-base hover:text-brand-red-dark transition-colors cursor-pointer"
                            >
                              +91 80740 17388
                            </a>
                          </div>
                          
                          {/* Terms & Conditions - right aligned */}
                          <div className="text-right">
                            <span className="text-sm text-gray-500 underline cursor-pointer hover:text-gray-700">
                              Terms & Conditions Apply
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                ))}
              </Tabs>

              {/* Testimonials Section */}
              <Card className="bg-card">
                <CardHeader className="pb-4">
                  <h3 className="text-xl font-bold text-center">Customer Testimonials</h3>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-muted p-6 rounded-lg">
                      <div className="flex items-center mb-4">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map(star => <Star key={star} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)}
                        </div>
                      </div>
                      <p className="text-foreground mb-4 italic">
                        "Found my perfect apartment within 2 weeks with their premium assistance. The documentation support was exceptional!"
                      </p>
                      <p className="text-brand-red font-semibold">#FastRental</p>
                    </div>
                    <div className="bg-muted p-6 rounded-lg">
                      <div className="flex items-center mb-4">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map(star => <Star key={star} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)}
                        </div>
                      </div>
                      <p className="text-foreground mb-4 italic">
                        "The property tours were well-coordinated and saved me so much time. Highly recommend their services!"
                      </p>
                      <p className="text-brand-red font-semibold">#ExcellentService</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* FAQs Section with Accordion */}
              <Card className="bg-card">
                <CardHeader className="pb-4">
                  <h3 className="text-xl font-bold text-center">Frequently Asked Questions</h3>
                </CardHeader>
                <CardContent className="pt-0">
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1">
                      <AccordionTrigger>How does the property search assistance work?</AccordionTrigger>
                      <AccordionContent>
                        Our experts help you filter properties based on your requirements, budget, and preferred locations to save your time.
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2">
                      <AccordionTrigger>What documentation support do you provide?</AccordionTrigger>
                      <AccordionContent>
                        We assist with rental agreements, verification documents, and ensure all paperwork is completed properly.
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-3">
                      <AccordionTrigger>Do you help with property visits?</AccordionTrigger>
                      <AccordionContent>
                        Yes, we coordinate property visits, schedule appointments with owners, and can accompany you for premium plans.
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-4">
                      <AccordionTrigger>Are there any hidden charges?</AccordionTrigger>
                      <AccordionContent>
                        No, all charges are transparent. The plan fee is all you pay - no hidden brokerage or additional costs.
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-5">
                      <AccordionTrigger>How quickly can I find a property?</AccordionTrigger>
                      <AccordionContent>
                        Most tenants find suitable properties within 2-4 weeks with our assistance, depending on requirements and location.
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-6">
                      <AccordionTrigger>What if I'm not satisfied with the service?</AccordionTrigger>
                      <AccordionContent>
                        We offer dedicated support throughout your plan validity period and work until you find a suitable property.
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default RentalPlans;
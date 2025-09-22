import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import OwnerPlans from './OwnerPlans';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, Clock, UserCheck, FileText, TrendingUp, Globe, Camera, Shield, Users } from 'lucide-react';
import PayButton from '@/components/PayButton';

interface RentalPlansProps { 
  embedded?: boolean 
}

const RentalPlans = ({ embedded }: RentalPlansProps) => {
  const [selectedTenantPlan, setSelectedTenantPlan] = useState(0);

  const tenantPlans = [
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
  ];

  const tenantPlanDetails = [
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
  ];

  return (
    <div className={embedded ? "" : "min-h-screen bg-background"}>
      <div className={embedded ? "py-8 px-4 bg-gray-50" : "py-16 px-4 bg-gray-50"}>
        <div className="max-w-6xl mx-auto">
          <div className={embedded ? "text-center mb-6" : "text-center mb-12"}>
            <h2 className={embedded ? "text-2xl font-bold mb-2" : "text-3xl font-bold mb-4"}>Rental Plans</h2>
            <p className={embedded ? "text-sm text-muted-foreground" : "text-lg text-muted-foreground"}>Choose between Owner plans for renting out property or Tenant plans for finding rental property</p>
          </div>

          <Tabs defaultValue="owner" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8 p-1 gap-1 bg-muted rounded-lg h-auto">
              <TabsTrigger value="owner" className="text-xs sm:text-sm md:text-base py-2 sm:py-3 px-2 sm:px-4 data-[state=active]:bg-background data-[state=active]:text-foreground whitespace-nowrap">Owner Plans</TabsTrigger>
              <TabsTrigger value="tenant" className="text-xs sm:text-sm md:text-base py-2 sm:py-3 px-2 sm:px-4 data-[state=active]:bg-background data-[state=active]:text-foreground whitespace-nowrap">Tenant Plans</TabsTrigger>
            </TabsList>

            <TabsContent value="owner" className="space-y-8">
              <OwnerPlans embedded />
            </TabsContent>

            <TabsContent value="tenant" className="space-y-8">
              {/* Plan Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {tenantPlans.map((plan, index) => (
                  <Card 
                    key={index}
                    className={`relative cursor-pointer transition-all duration-200 ${
                      selectedTenantPlan === index ? 'ring-2 ring-brand-red bg-muted' : 'bg-card hover:shadow-md'
                    }`}
                    onClick={() => setSelectedTenantPlan(index)}
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
                          <>
                            <span className="text-2xl font-bold text-gray-900">{plan.price}</span>
                            <div className="text-sm text-gray-500">{plan.gst}</div>
                          </>
                        )}
                      </div>
                      
                      {plan.isFree ? (
                        <Button 
                          className={`w-full ${
                            selectedTenantPlan === index 
                              ? 'bg-brand-red hover:bg-brand-maroon-dark text-white' 
                              : 'bg-transparent text-foreground border border-border hover:bg-muted'
                          }`}
                        >
                          Get Started - FREE
                        </Button>
                      ) : (
                        <PayButton
                          label="Subscribe"  
                          planName={`Tenant — ${plan.name}`}
                          amountPaise={plan.amountPaise}
                          className={`w-full ${
                            selectedTenantPlan === index 
                              ? 'bg-brand-red hover:bg-brand-maroon-dark text-white' 
                              : 'bg-transparent text-foreground border border-border hover:bg-muted'
                          }`}
                        />
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Selected Plan Details */}
              <Card className="bg-card">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold mb-6 text-center">
                    {tenantPlans[selectedTenantPlan].name} Plan Features
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {tenantPlanDetails[selectedTenantPlan].map((feature, index) => (
                      <div key={index} className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                        <div className="text-brand-red flex-shrink-0">
                          {feature.icon}
                        </div>
                        <span className="text-sm font-medium text-foreground">{feature.text}</span>
                      </div>
                    ))}
                  </div>
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
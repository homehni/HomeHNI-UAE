import React, { useState } from 'react';
import { Star, Check, Phone, Home, Users, Shield, Clock, UserCheck, Globe, Lock, FileText, TrendingUp, Camera, Bell, Headphones, Video, BarChart3, Crown, Zap, Building, Presentation, Store, Handshake, Target, Award, ArrowRight, Info, ChevronDown } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import PayButton from '@/components/PayButton';
import GSTDisplay from '@/components/GSTDisplay';
import { calculateTotalWithGST } from '@/utils/gstCalculator';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CallbackRequestDialog from '@/components/CallbackRequestDialog';

const BuilderDealerPlans = () => {
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dealer'); // 'dealer' or 'builder'
  const [selectedService, setSelectedService] = useState(null);
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);
  const [isCallbackDialogOpen, setIsCallbackDialogOpen] = useState(false);
  const [pricingForm, setPricingForm] = useState({
    lookingTo: 'sell',
    propertyType: 'residential'
  });
  // CONNECT PRO plan selection state
  const [selectedConnectPlan, setSelectedConnectPlan] = useState<'connect25' | 'connect50' | null>(null);
  const [selectedConnectOption, setSelectedConnectOption] = useState<number | null>(null);

  // Helper function to parse price string to amountPaise (e.g., "AED 587" -> 58700)
  const parsePriceToPaise = (priceString: string): number => {
    // Remove "AED", commas, and spaces, then convert to number and multiply by 100
    const numericValue = parseFloat(priceString.replace(/AED\s*|,/g, '').trim());
    return Math.round(numericValue * 100);
  };

  // Initialize selection when CONNECT PRO modal opens
  const handleConnectProOpen = () => {
    setSelectedConnectPlan('connect50'); // Default to CONNECT 50
    setSelectedConnectOption(2); // Default to 12 months option (index 2)
  };

         const otherServices = [
           {
             title: "Brand Banners",
             description: "Maximize your brand visibility across HomeHNI's platform with strategic banner placements.",
             icon: <div className="w-16 h-16 bg-orange-100 rounded-lg flex items-center justify-center">
               <div className="w-12 h-8 bg-orange-400 rounded flex items-center justify-center">
                 <Home className="w-6 h-6 text-white" />
               </div>
             </div>,
             amountPaise: 4000,
             modalContent: {
               features: [
                 "Strategic banner placement across homepage, search results, and property detail pages",
                 "Targeted campaigns based on location, property type, and buyer preferences",
                 "Flexible duration options to match your marketing budget and goals"
               ]
             }
           },
           {
             title: "Spotlight Listing",
             description: "Ensure your properties get maximum visibility with guaranteed top placement in search results.",
             icon: <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
               <div className="relative">
                 <Home className="w-12 h-12 text-blue-600" />
                 <div className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs px-1 rounded">Spotlight</div>
               </div>
             </div>,
             amountPaise: 6600,
             modalContent: {
               features: [
                 "Guaranteed top 2 positions in locality search results",
                 "Distinctive visual highlighting with special tags",
                 "Customizable targeting for residential/commercial, buy/rent options",
                 "Limited slots available per locality for maximum impact"
               ]
             }
           },
           {
             title: "Project Showcase",
             description: "Perfect solution for developers seeking high-quality buyer leads for new projects.",
             icon: <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
               <div className="relative">
                 <Building className="w-12 h-12 text-blue-600" />
                 <Star className="w-4 h-4 text-yellow-500 absolute -top-1 -right-1" />
               </div>
             </div>,
             amountPaise: 13200,
             modalContent: {
               features: [
                 "Premium project positioning on dedicated listing pages",
                 "Enhanced project visibility with exclusive star badges",
                 "Priority placement in relevant search results",
                 "Dedicated project showcase section for maximum exposure"
               ]
             }
           },
           {
             title: "Elite Listing",
             description: "Transform your property listings with enhanced visuals and animations to capture buyer attention.",
             price: "AED 40 Onwards",
             icon: <div className="w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center">
               <div className="relative">
                 <Home className="w-12 h-12 text-purple-600" />
                 <Crown className="w-4 h-4 text-yellow-500 absolute -top-1 -right-1" />
               </div>
             </div>,
             amountPaise: 4000,
             modalContent: {
               features: [
                 "Enhanced listing display with larger, more prominent positioning",
                 "Interactive animations and visual effects to attract buyers",
                 "Double verification benefits for increased customer trust",
                 "Higher conversion rates with verified listings"
               ]
             }
           }
         ];

         // CONNECT PRO service data for modal
         const connectProService = {
           title: "CONNECT PRO - Broker Owner Network Solution",
           description: "Contact property owners every month & grow business",
           modalContent: {
             features: [
               "Direct access to verified property owner contacts",
               "Choose from flexible plans: 25 or 50 contacts per month",
               "Significant savings on longer-duration plans (up to 21% off)",
               "Maximize your chances of securing owner mandates",
               "Reduce competition and close deals faster with direct connections",
               "Monthly updates with fresh, verified contact information",
               "Priority support for CONNECT PRO subscribers"
             ],
             plans: {
               connect25: {
                 title: "CONNECT 25",
                 subtitle: "25 Contacts Access /month",
                 description: "Starter plan to access contacts",
                 options: [
                   {
                     duration: "3 months",
                     monthlyPrice: "AED 196",
                     totalPrice: "AED 587",
                     contacts: "Access 75 contacts",
                     savings: null
                   },
                   {
                     duration: "6 months",
                     monthlyPrice: "AED 184",
                     totalPrice: "AED 1,106",
                     contacts: "Access 150 contacts",
                     savings: "SAVE 7%"
                   },
                   {
                     duration: "12 months",
                     monthlyPrice: "AED 175",
                     totalPrice: "AED 2,098",
                     contacts: "Access 300 contacts",
                     savings: "SAVE 13%"
                   }
                 ]
               },
               connect50: {
                 title: "CONNECT 50",
                 subtitle: "50 Contacts Access /month",
                 description: "Big saving plan to access contacts",
                 options: [
                   {
                     duration: "1 month",
                     monthlyPrice: "AED 462",
                     totalPrice: "AED 462",
                     contacts: "Access 50 contacts",
                     savings: null
                   },
                   {
                     duration: "6 months",
                     monthlyPrice: "AED 383",
                     totalPrice: "AED 2,300",
                     contacts: "Access 300 contacts",
                     savings: "SAVE 17%",
                     popular: true
                   },
                   {
                     duration: "12 months",
                     monthlyPrice: "AED 366",
                     totalPrice: "AED 4,387",
                     contacts: "Access 600 contacts",
                     savings: "SAVE 21%",
                     selected: true
                   }
                 ]
               }
             }
           }
         };

         const builderServices = [
           {
             title: "Brand Banners",
             description: "Maximize your brand visibility across HomeHNI's platform with strategic banner placements.",
             icon: <div className="w-16 h-16 bg-orange-100 rounded-lg flex items-center justify-center">
               <div className="w-12 h-8 bg-orange-400 rounded flex items-center justify-center">
                 <Home className="w-6 h-6 text-white" />
               </div>
             </div>,
             modalContent: {
               features: [
                 "Strategic banner placement across homepage, search results, and property detail pages",
                 "Targeted campaigns based on location, property type, and buyer preferences",
                 "Flexible duration options to match your marketing budget and goals"
               ]
             }
           },
           {
             title: "Project Showcase",
             description: "Perfect solution for developers seeking high-quality buyer leads for new projects.",
             icon: <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
               <div className="relative">
                 <Building className="w-12 h-12 text-blue-600" />
                 <Star className="w-4 h-4 text-yellow-500 absolute -top-1 -right-1" />
               </div>
             </div>,
             modalContent: {
               features: [
                 "Premium project positioning on dedicated listing pages",
                 "Enhanced project visibility with exclusive star badges",
                 "Priority placement in relevant search results",
                 "Dedicated project showcase section for maximum exposure"
               ]
             }
           },
           {
             title: "Launch Package",
             description: "Entry-level solution for new projects seeking initial market presence and buyer engagement.",
             icon: <div className="w-16 h-16 bg-orange-100 rounded-lg flex items-center justify-center">
               <div className="relative">
                 <Building className="w-12 h-12 text-orange-600" />
                 <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white text-xs px-2 py-1 rounded">NEW</div>
               </div>
             </div>,
             modalContent: {
               features: [
                 "Essential project listing package for new developments",
                 "Basic project visibility on HomeHNI platform",
                 "Core project information display and management",
                 "Cost-effective solution for project launches"
               ]
             }
           },
           {
             title: "Visual Gallery",
             description: "Premium visual presentation package for showcasing project highlights and amenities.",
             icon: <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
               <div className="relative">
                 <Building className="w-12 h-12 text-blue-600" />
               </div>
             </div>,
             modalContent: {
               features: [
                 "Premium project gallery with high-resolution image support",
                 "Advanced video integration for virtual tours",
                 "Interactive project presentation tools",
                 "Enhanced project discovery and engagement features"
               ]
             }
           }
         ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <Header />
      
      {/* Final Prices Ribbon */}
      <div className="fixed top-16 lg:top-24 w-full bg-gradient-to-r from-[#800000] to-[#700000] text-white py-2 sm:py-3 shadow-md z-40">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
          <div className="flex items-center justify-center cursor-pointer hover:from-[#700000] hover:to-[#800000] transition-all duration-300" onClick={() => setIsPricingModalOpen(true)}>
            <Info className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 flex-shrink-0" />
            <span className="text-xs sm:text-sm font-semibold text-center px-1">
              <span className="hidden sm:inline">For Final prices, share property details</span>
              <span className="sm:hidden">Final prices - Share details</span>
            </span>
            <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4 ml-1 sm:ml-2 flex-shrink-0" />
          </div>
        </div>
      </div>
      

      {/* Tab Navigation */}
      <div className="bg-white border-b border-gray-200 pt-24 lg:pt-36">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center mb-8">
            <div className="flex bg-gray-100 rounded-xl p-1.5 shadow-lg border border-gray-200">
              <div 
                className={`flex items-center px-8 py-4 cursor-pointer transition-all duration-300 rounded-lg ${
                  activeTab === 'dealer' 
                    ? 'bg-white text-[#800000] shadow-md transform scale-105 border border-[#800000]/20' 
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                }`}
                onClick={() => setActiveTab('dealer')}
              >
                <Home className={`w-5 h-5 mr-3 ${activeTab === 'dealer' ? 'text-[#800000]' : 'text-gray-500'}`} />
                <span className="font-semibold text-base">Dealer Plans</span>
              </div>
              <div 
                className={`flex items-center px-8 py-4 cursor-pointer transition-all duration-300 rounded-lg ${
                  activeTab === 'builder' 
                    ? 'bg-white text-[#800000] shadow-md transform scale-105 border border-[#800000]/20' 
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                }`}
                onClick={() => setActiveTab('builder')}
              >
                <Building className={`w-5 h-5 mr-3 ${activeTab === 'builder' ? 'text-[#800000]' : 'text-gray-500'}`} />
                <span className="font-semibold text-base">Builder Plans</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dealer' ? (
          <>
            {/* Pick a plan section */}
            <div className="flex flex-col lg:flex-row gap-8 mb-12">
              {/* Left side - Sachet Pack */}
              <div className="lg:w-1/2">
                <Card className="border border-[#800000]/20 bg-white shadow-lg">
                  <CardContent className="p-6">
                     {/* Premium Package Icon */}
                     <div className="w-16 h-16 bg-gradient-to-br from-[#800000] via-[#700000] to-yellow-400 rounded-lg mb-4 flex items-center justify-center relative overflow-hidden">
                       <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
                       <div className="relative z-10 flex items-center justify-center">
                         <div className="w-10 h-10 bg-white/90 rounded-lg flex items-center justify-center shadow-lg">
                           <Zap className="w-6 h-6 text-[#800000]" />
                         </div>
                       </div>
                       <div className="absolute -top-1 -right-1 bg-yellow-400 text-[#800000] text-xs px-2 py-1 rounded-full font-bold shadow-lg">
                         HOT
                       </div>
                     </div>
                     
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">Power Pack Pro</h3>
                            <p className="text-gray-600 mb-4">Supercharge your property sales with our premium multi-listing package designed for maximum impact and faster deals.</p>
                    
                     <div className="mb-4">
                       <div className="flex items-center gap-3">
                         <span className="text-lg font-semibold text-gray-800">25 Premium Listings</span>
                         <div className="bg-gradient-to-r from-[#800000] to-[#700000] text-white text-xs px-3 py-1 rounded-full font-bold shadow-md">
                           BEST VALUE
                         </div>
                       </div>
                     </div>
                    
                    <div className="mb-6">
                      <div className="text-3xl font-bold text-gray-900 mb-1">AED 583 Onwards</div>
                      <GSTDisplay basePriceInPaise={58300} />
                    </div>
                    
                     <PayButton
                       label="Unlock Power Pack Pro"
                       planName="Dealer — Power Pack Pro"
                       amountPaise={calculateTotalWithGST(58300)}
                       notes={{ plan: "Power Pack Pro", category: "dealer", type: "listing-pack" }}
                       className="w-full bg-gradient-to-r from-[#800000] to-[#700000] hover:from-[#700000] hover:to-[#800000] text-white font-semibold py-3 px-6 rounded-lg mb-4 shadow-lg transform hover:scale-105 transition-all duration-200"
                     />
                    
                           <div className="space-y-3">
                             <div className="flex items-center text-sm text-gray-700">
                               <div className="w-5 h-5 bg-[#800000]/10 rounded-full flex items-center justify-center mr-3">
                                 <Check className="w-3 h-3 text-[#800000]" />
                               </div>
                               <span className="font-medium">Up to 5X more qualified leads</span>
                               <Info className="w-3 h-3 text-gray-400 ml-1" />
                             </div>
                             <div className="flex items-center text-sm text-gray-700">
                               <div className="w-5 h-5 bg-[#800000]/10 rounded-full flex items-center justify-center mr-3">
                                 <Check className="w-3 h-3 text-[#800000]" />
                               </div>
                               <span className="font-medium">Complimentary property verification*</span>
                               <Info className="w-3 h-3 text-gray-400 ml-1" />
                             </div>
                             <div className="flex items-center text-sm text-gray-700">
                               <div className="w-5 h-5 bg-[#800000]/10 rounded-full flex items-center justify-center mr-3">
                                 <Check className="w-3 h-3 text-[#800000]" />
                               </div>
                               <span className="font-medium">List residential, commercial & rental properties</span>
                             </div>
                             <div className="text-sm text-[#800000] cursor-pointer hover:text-[#700000] font-medium flex items-center">
                               <span>+ 3 additional advantages</span>
                               <ArrowRight className="w-3 h-3 ml-1" />
                             </div>
                           </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right side - Promotional content */}
              <div className="lg:w-1/2 flex flex-col justify-center">
                       <div className="text-sm text-gray-500 mb-2">DEALER PLANS</div>
                       <h1 className="text-4xl font-bold text-gray-900 mb-8">Choose your success strategy for property sales</h1>
                
                {/* Illustration placeholder */}
                <div className="w-full h-64 bg-gradient-to-r from-[#800000]/10 to-gray-100 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-[#800000]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Users className="w-10 h-10 text-[#800000]" />
                    </div>
                           <p className="text-gray-600">Accelerate Your Property Business</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Exclusive Owner Contact Plans */}
            <div className="mb-12">
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 bg-[#800000]/10 text-[#800000] text-sm font-semibold px-4 py-2 rounded-full mb-4">
                  <Star className="w-4 h-4" />
                  <span>LIMITED TIME OFFER</span>
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-3">Exclusive Owner Contact Plans</h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">Connect with verified property owners and expand your business network with our revolutionary contact solution</p>
              </div>
              
              <Card className="bg-gradient-to-r from-[#800000]/5 via-white to-[#800000]/5 border-2 border-[#800000]/30 shadow-xl hover:shadow-2xl transition-all duration-300">
                <CardContent className="p-8">
                  <div className="flex flex-col lg:flex-row items-center gap-8">
                    {/* Left Side - Icon and Branding */}
                    <div className="flex items-center gap-6">
                      <div className="relative">
                        <div className="w-20 h-20 bg-gradient-to-br from-[#800000] to-[#700000] rounded-xl flex items-center justify-center shadow-lg">
                          <div className="flex gap-1">
                            <Lock className="w-7 h-7 text-white" />
                            <Users className="w-7 h-7 text-white" />
                            <Phone className="w-7 h-7 text-white" />
                          </div>
                        </div>
                        <div className="absolute -top-2 -right-2 bg-yellow-400 text-[#800000] text-xs px-2 py-1 rounded-full font-bold shadow-md">
                          NEW
                        </div>
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-1">Introducing CONNECT PRO</h3>
                        <p className="text-sm text-gray-600 font-medium">BROKER OWNER NETWORK SOLUTION</p>
                        <div className="flex items-center gap-2 mt-2">
                          <div className="w-2 h-2 bg-[#800000] rounded-full"></div>
                          <span className="text-xs text-gray-500">Verified Contacts Only</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Middle Section - Features and Pricing */}
                    <div className="flex-1 text-center lg:text-left">
                      <div className="bg-white/50 rounded-lg p-4 mb-4">
                        <p className="text-gray-700 mb-2 font-medium">Access up to <span className="text-[#800000] font-bold">50 verified property owner contacts</span> monthly</p>
                        <div className="flex items-center justify-center lg:justify-start gap-4">
                          <div className="text-2xl font-bold text-[#800000]">AED 44</div>
                          <div className="text-sm text-gray-600">
                            <div>per month</div>
                            <div className="line-through text-gray-400">AED 66</div>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
                        <div className="bg-[#800000]/10 text-[#800000] text-xs px-3 py-1 rounded-full font-medium">✓ Instant Access</div>
                        <div className="bg-[#800000]/10 text-[#800000] text-xs px-3 py-1 rounded-full font-medium">✓ Verified Contacts</div>
                        <div className="bg-[#800000]/10 text-[#800000] text-xs px-3 py-1 rounded-full font-medium">✓ Monthly Updates</div>
                      </div>
                    </div>
                    
                    {/* Right Side - CTA Button */}
                    <div className="flex flex-col items-center gap-3">
                      <Button 
                        className="bg-gradient-to-r from-[#800000] to-[#700000] hover:from-[#700000] hover:to-[#800000] text-white px-8 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                        onClick={() => {
                          handleConnectProOpen();
                          setSelectedService(connectProService);
                        }}
                      >
                        View Plans
                      </Button>
                      <div className="text-xs text-gray-500 text-center">
                        <div>No setup fees</div>
                        <div>Cancel anytime</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Other Services for Dealers */}
            <div className="mb-12">
                   <h2 className="text-2xl font-bold text-gray-900 mb-2">Premium Dealer Services</h2>
                   <p className="text-gray-600 mb-6">Enhance your property marketing with our specialized solutions</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {otherServices.map((service, index) => (
                  <Card key={index} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0">
                          {service.icon}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">{service.title}</h3>
                          <p className="text-gray-600 mb-4 text-sm leading-relaxed">{service.description}</p>
                          {service.price && (
                            <div className="text-lg font-bold text-gray-900 mb-4">{service.price}</div>
                          )}
                          <div 
                            className="flex items-center text-[#800000] cursor-pointer hover:text-[#700000]"
                            onClick={() => setSelectedService(service)}
                          >
                            <span className="text-sm font-medium">Know More</span>
                            <ArrowRight className="w-4 h-4 ml-1" />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Benefits Section */}
                   <div className="bg-white rounded-lg p-8 shadow-sm">
                     <div className="text-center mb-8">
                       <div className="text-sm text-gray-500 mb-2">WHY CHOOSE HOMEHNI?</div>
                       <h2 className="text-3xl font-bold text-gray-900">Advantages of upgrading your listings on HomeHNI</h2>
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <div className="text-center">
                         <div className="w-16 h-16 bg-[#800000]/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                           <Building className="w-8 h-8 text-[#800000]" />
                         </div>
                         <h3 className="text-lg font-semibold text-gray-900 mb-2">Enhanced Visibility</h3>
                         <p className="text-gray-600 text-sm">Achieve up to 5X more qualified leads with premium positioning</p>
                       </div>

                       <div className="text-center">
                         <div className="w-16 h-16 bg-[#800000]/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                           <BarChart3 className="w-8 h-8 text-[#800000]" />
                         </div>
                         <h3 className="text-lg font-semibold text-gray-900 mb-2">Advanced Analytics</h3>
                         <p className="text-gray-600 text-sm">Monitor performance with comprehensive insights and detailed reporting</p>
                       </div>
                     </div>
                   </div>
          </>
        ) : (
          /* Builder Plans Content */
          <>
                   <div className="text-center mb-12">
                     <h1 className="text-4xl font-bold text-gray-900 mb-4">
                       Builder Marketing Solutions
                     </h1>
                     <p className="text-lg text-gray-600">
                       Tailored services to accelerate your project sales
                     </p>
                   </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {builderServices.map((service, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        {service.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{service.title}</h3>
                        <p className="text-gray-600 mb-4 text-sm leading-relaxed">{service.description}</p>
                        <div 
                          className="flex items-center text-[#800000] cursor-pointer hover:text-[#700000]"
                          onClick={() => setSelectedService(service)}
                        >
                          <span className="text-sm font-medium">Know More</span>
                          <ArrowRight className="w-4 h-4 ml-1" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Service Details Modal */}
      <Dialog open={!!selectedService} onOpenChange={(open) => {
        if (!open) {
          setSelectedService(null);
          // Reset selection when modal closes
          setSelectedConnectPlan(null);
          setSelectedConnectOption(null);
        }
      }}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-900 border-b pb-2">
              {selectedService?.title}
            </DialogTitle>
            {selectedService?.description && (
              <p className="text-gray-600 mt-2">{selectedService.description}</p>
            )}
          </DialogHeader>
          
          <div className="mt-6">
            {selectedService?.modalContent?.plans ? (
              // CONNECT PRO Plans Modal
              <div className="space-y-8">
                {/* Pricing Cards */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* CONNECT 25 Card */}
                  <Card className="border-2 border-gray-200 hover:border-[#800000]/30 transition-colors">
                    <CardContent className="p-6">
                      <div className="text-center mb-6">
                        <h3 className="text-lg font-semibold text-gray-600 mb-1">CONNECT 25</h3>
                        <h4 className="text-2xl font-bold text-gray-900 mb-2">25 Contacts Access /month</h4>
                        <p className="text-gray-600">Starter plan to access contacts</p>
                      </div>
                      
                      <div className="space-y-4">
                        {selectedService.modalContent.plans.connect25.options.map((option, index) => {
                          const isSelected = selectedConnectPlan === 'connect25' && selectedConnectOption === index;
                          return (
                            <div 
                              key={index} 
                              className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                                isSelected ? 'border-[#800000] bg-[#800000]/5' : 'border-gray-200 hover:border-gray-300'
                              }`}
                              onClick={() => {
                                setSelectedConnectPlan('connect25');
                                setSelectedConnectOption(index);
                              }}
                            >
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-3">
                                  <div className={`w-4 h-4 rounded-full border-2 ${
                                    isSelected ? 'border-[#800000] bg-[#800000]' : 'border-gray-300'
                                  }`}></div>
                                  <span className="font-medium">{option.duration}</span>
                                  {option.popular && (
                                    <Badge className="bg-[#800000] text-white text-xs">POPULAR</Badge>
                                  )}
                                </div>
                                {option.savings && (
                                  <Badge className="bg-green-100 text-green-800 text-xs">{option.savings}</Badge>
                                )}
                              </div>
                              <div className="flex justify-between items-center">
                                <div>
                                  <div className="text-lg font-bold text-gray-900">{option.monthlyPrice}/mo.</div>
                                  <div className="text-sm text-gray-600">Total: {option.totalPrice}</div>
                                </div>
                                <div className="text-sm text-gray-600 text-right">{option.contacts}</div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      
                      {selectedConnectPlan === 'connect25' && selectedConnectOption !== null && (() => {
                        const selectedOption = selectedService.modalContent.plans.connect25.options[selectedConnectOption];
                        const baseAmountPaise = parsePriceToPaise(selectedOption.totalPrice);
                        // The price shown is the base price, VAT will be added
                        return (
                          <div className="mt-6">
                            <div className="mb-3">
                              <GSTDisplay basePriceInPaise={baseAmountPaise} />
                            </div>
                            <PayButton
                              label="Buy CONNECT 25"
                              planName={`Dealer — CONNECT 25 — ${selectedOption.duration}`}
                              amountPaise={calculateTotalWithGST(baseAmountPaise)}
                              notes={{ 
                                plan: "CONNECT 25", 
                                category: "dealer", 
                                type: "connect-pro",
                                duration: selectedOption.duration,
                                contacts: selectedOption.contacts
                              }}
                              className="w-full bg-[#800000] hover:bg-[#700000] text-white"
                            />
                          </div>
                        );
                      })()}
                    </CardContent>
                  </Card>

                  {/* CONNECT 50 Card */}
                  <Card className="border-2 border-[#800000]/30 bg-gradient-to-br from-[#800000]/5 to-white">
                    <CardContent className="p-6">
                      <div className="text-center mb-6">
                        <h3 className="text-lg font-semibold text-gray-600 mb-1">CONNECT 50</h3>
                        <h4 className="text-2xl font-bold text-gray-900 mb-2">50 Contacts Access /month</h4>
                        <p className="text-gray-600">Big saving plan to access contacts</p>
                      </div>
                      
                      <div className="space-y-4">
                        {selectedService.modalContent.plans.connect50.options.map((option, index) => {
                          const isSelected = selectedConnectPlan === 'connect50' && selectedConnectOption === index;
                          return (
                            <div 
                              key={index} 
                              className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                                isSelected ? 'border-[#800000] bg-[#800000]/5' : 'border-gray-200 hover:border-gray-300'
                              }`}
                              onClick={() => {
                                setSelectedConnectPlan('connect50');
                                setSelectedConnectOption(index);
                              }}
                            >
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-3">
                                  <div className={`w-4 h-4 rounded-full border-2 ${
                                    isSelected ? 'border-[#800000] bg-[#800000]' : 'border-gray-300'
                                  }`}></div>
                                  <span className="font-medium">{option.duration}</span>
                                  {option.popular && (
                                    <Badge className="bg-[#800000] text-white text-xs">POPULAR</Badge>
                                  )}
                                </div>
                                {option.savings && (
                                  <Badge className="bg-green-100 text-green-800 text-xs">{option.savings}</Badge>
                                )}
                              </div>
                              <div className="flex justify-between items-center">
                                <div>
                                  <div className="text-lg font-bold text-gray-900">{option.monthlyPrice}/mo.</div>
                                  <div className="text-sm text-gray-600">Total: {option.totalPrice}</div>
                                </div>
                                <div className="text-sm text-gray-600 text-right">{option.contacts}</div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      
                      {selectedConnectPlan === 'connect50' && selectedConnectOption !== null && (() => {
                        const selectedOption = selectedService.modalContent.plans.connect50.options[selectedConnectOption];
                        const baseAmountPaise = parsePriceToPaise(selectedOption.totalPrice);
                        // The price shown is the base price, VAT will be added
                        return (
                          <div className="mt-6">
                            <div className="mb-3">
                              <GSTDisplay basePriceInPaise={baseAmountPaise} />
                            </div>
                            <PayButton
                              label={`Buy CONNECT 50 — ${selectedOption.duration}`}
                              planName={`Dealer — CONNECT 50 — ${selectedOption.duration}`}
                              amountPaise={calculateTotalWithGST(baseAmountPaise)}
                              notes={{ 
                                plan: "CONNECT 50", 
                                category: "dealer", 
                                type: "connect-pro",
                                duration: selectedOption.duration,
                                contacts: selectedOption.contacts
                              }}
                              className="w-full bg-[#800000] hover:bg-[#700000] text-white"
                            />
                          </div>
                        );
                      })()}
                    </CardContent>
                  </Card>
                </div>

                {/* Key Benefits Section */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="text-center mb-6">
                    <div className="text-sm text-gray-500 mb-2">KEY BENEFITS</div>
                    <h3 className="text-2xl font-bold text-gray-900">How CONNECT PRO helps dealers like you</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-[#800000]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-[#800000] font-bold text-lg">01</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">Get an edge over competition</h4>
                        <p className="text-sm text-gray-600">Limit competition from local dealers and maximise your chance of securing owner mandates.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-[#800000]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-[#800000] font-bold text-lg">02</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">Enjoy uninterrupted access</h4>
                        <p className="text-sm text-gray-600">Reach out to more relevant owners every month.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-[#800000]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-[#800000] font-bold text-lg">03</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">No middleman brokerage</h4>
                        <p className="text-sm text-gray-600">Get direct access to 600+ active owners without any third-party involvement.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-[#800000]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-[#800000] font-bold text-lg">04</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">Close property deals faster</h4>
                        <p className="text-sm text-gray-600">Connect with high-intent active owners and close deals quickly.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              // Regular Service Modal
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg text-[#800000]">Key Features:</h3>
                  <ul className="space-y-3">
                    {selectedService?.modalContent?.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-[#800000]/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Check className="w-4 h-4 text-[#800000]" />
                        </div>
                        <span className="text-sm text-gray-700 leading-relaxed">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {selectedService?.price && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-lg font-semibold text-gray-900 mb-2">Pricing</div>
                    <div className="text-2xl font-bold text-[#800000]">{selectedService.price}</div>
                  </div>
                )}

                <div className="pt-4">
                  <Button 
                    className="w-full bg-[#800000] hover:bg-[#700000] text-white"
                    onClick={() => {
                      setSelectedService(null);
                      setIsCallbackDialogOpen(true);
                    }}
                  >
                    Get a callback
                  </Button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Pricing Modal */}
      <Dialog open={isPricingModalOpen} onOpenChange={setIsPricingModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-900 text-center">
              For Final prices, share property details
            </DialogTitle>
          </DialogHeader>
          
          <div className="mt-6 space-y-6">
            {/* Looking to Section */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Looking to</h3>
              <div className="grid grid-cols-3 gap-2">
                <button
                  className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    pricingForm.lookingTo === 'sell'
                      ? 'bg-blue-100 text-blue-700 border-2 border-blue-300'
                      : 'bg-gray-100 text-gray-600 border-2 border-gray-200 hover:bg-gray-200'
                  }`}
                  onClick={() => setPricingForm(prev => ({ ...prev, lookingTo: 'sell' }))}
                >
                  Sell
                </button>
                <button
                  className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    pricingForm.lookingTo === 'rent'
                      ? 'bg-blue-100 text-blue-700 border-2 border-blue-300'
                      : 'bg-gray-100 text-gray-600 border-2 border-gray-200 hover:bg-gray-200'
                  }`}
                  onClick={() => setPricingForm(prev => ({ ...prev, lookingTo: 'rent' }))}
                >
                  Rent/Lease
                </button>
                <button
                  className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    pricingForm.lookingTo === 'pg'
                      ? 'bg-blue-100 text-blue-700 border-2 border-blue-300'
                      : 'bg-gray-100 text-gray-600 border-2 border-gray-200 hover:bg-gray-200'
                  }`}
                  onClick={() => setPricingForm(prev => ({ ...prev, lookingTo: 'pg' }))}
                >
                  Paying Guest (PG)
                </button>
              </div>
            </div>

            {/* Property Type Section */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Your Property Type</h3>
              <div className="grid grid-cols-2 gap-3">
                <button
                  className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                    pricingForm.propertyType === 'residential'
                      ? 'bg-blue-100 text-blue-700 border-2 border-blue-300'
                      : 'bg-gray-100 text-gray-600 border-2 border-gray-200 hover:bg-gray-200'
                  }`}
                  onClick={() => setPricingForm(prev => ({ ...prev, propertyType: 'residential' }))}
                >
                  <Home className="w-4 h-4" />
                  Residential
                </button>
                <button
                  className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                    pricingForm.propertyType === 'commercial'
                      ? 'bg-blue-100 text-blue-700 border-2 border-blue-300'
                      : 'bg-gray-100 text-gray-600 border-2 border-gray-200 hover:bg-gray-200'
                  }`}
                  onClick={() => setPricingForm(prev => ({ ...prev, propertyType: 'commercial' }))}
                >
                  <Building className="w-4 h-4" />
                  Commercial
                </button>
              </div>
            </div>

            {/* View Plans Button */}
            <Button 
              className="w-full bg-[#800000] hover:bg-[#700000] text-white py-3 text-lg font-semibold"
              onClick={() => {
                // Handle form submission
                console.log('Pricing form submitted:', pricingForm);
                setIsPricingModalOpen(false);
                // You can add logic here to redirect to pricing page or show specific plans
              }}
            >
              View Plans
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Footer */}
      <Footer />

      {/* Callback Request Dialog */}
      <CallbackRequestDialog 
        isOpen={isCallbackDialogOpen} 
        onClose={() => setIsCallbackDialogOpen(false)} 
      />
    </div>
  );
};

export default BuilderDealerPlans;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Header from '@/components/Header';
import Marquee from '@/components/Marquee';
import Footer from '@/components/Footer';
import { useToast } from '@/hooks/use-toast';
import { useTheme } from '@/contexts/ThemeContext';

export const PostProperty: React.FC = () => {
  const [listingType, setListingType] = useState<'BUY' | 'RENT'>('BUY');
  const [rentFrequency, setRentFrequency] = useState<'Yearly' | 'Monthly'>('Yearly');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState<'Residential' | 'Commercial'>('Residential');
  const [propertyType, setPropertyType] = useState<string>('');
  const [bedrooms, setBedrooms] = useState<string>('');
  const [area, setArea] = useState('');
  const [furnishing, setFurnishing] = useState('');
  const [urgency, setUrgency] = useState<string>('');
  
  const navigate = useNavigate();
  const { toast } = useToast();
  const { theme } = useTheme();

  const propertyTypes = {
    Residential: ['Apartment', 'Villa', 'Townhouse', 'Penthouse', 'Other'],
    Commercial: ['Office', 'Retail', 'Warehouse', 'Land', 'Other']
  };

  const bedroomOptions = ['Studio', '1', '2', '3', '4', '5', '6', '7', '8+'];
  const urgencyOptions = ['This month', 'Within 2 months', 'Flexible'];

  const handleContinue = () => {
    // Validate required fields
    if (!location.trim()) {
      toast({
        title: "Location required",
        description: "Please enter a location",
        variant: "destructive"
      });
      return;
    }

    if (!propertyType) {
      toast({
        title: "Property type required",
        description: "Please select a property type",
        variant: "destructive"
      });
      return;
    }

    if (!bedrooms) {
      toast({
        title: "Bedrooms required",
        description: "Please select number of bedrooms",
        variant: "destructive"
      });
      return;
    }

    // Store form data and navigate to next step
    const formData = {
      listingType,
      rentFrequency: listingType === 'RENT' ? rentFrequency : undefined,
      location,
      category,
      propertyType,
      bedrooms,
      area,
      furnishing,
      urgency
    };

    // Navigate to detailed form or save and continue
    console.log('Form data:', formData);
    toast({
      title: "Form submitted",
      description: "Redirecting to detailed form...",
    });
    
    // TODO: Navigate to next step with form data
    // navigate('/post-property/details', { state: formData });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <Marquee />
      
      <main className="flex-1 pt-8 lg:pt-12 xl:pt-16">
        <div className="container mx-auto px-4 py-6 lg:py-8 xl:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Left Section - Promotional Content */}
            <div className={`order-2 lg:order-1 lg:col-span-2 rounded-xl p-8 lg:p-10 xl:p-14 flex flex-col justify-start relative overflow-hidden ${
              theme === 'green-white' 
                ? 'bg-gradient-to-br from-white to-gray-50' 
                : theme === 'opaque'
                  ? 'bg-gradient-to-br from-gray-50 to-gray-100'
                  : 'bg-gradient-to-br from-[#800000]/5 via-red-50/30 to-[#800000]/10'
            }`}>
              {/* Decorative background elements */}
              {theme !== 'green-white' && (
                <>
                  <div className={`absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl -mr-48 -mt-48 pointer-events-none ${
                    theme === 'opaque' ? 'bg-gray-200/20' : 'bg-[#800000]/5'
                  }`}></div>
                  <div className={`absolute bottom-0 left-0 w-72 h-72 rounded-full blur-2xl -ml-36 -mb-36 pointer-events-none ${
                    theme === 'opaque' ? 'bg-gray-300/20' : 'bg-red-200/20'
                  }`}></div>
                </>
              )}
              
              <div className="relative z-10">
                {/* Badge */}
                <div className={`inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full mb-6 border shadow-sm ${
                  theme === 'green-white' ? 'border-green-600/20' : theme === 'opaque' ? 'border-gray-300/20' : 'border-[#800000]/20'
                }`}>
                  <div className={`w-2 h-2 rounded-full animate-pulse ${
                    theme === 'green-white' ? 'bg-green-600' : theme === 'opaque' ? 'bg-gray-600' : 'bg-[#800000]'
                  }`}></div>
                  <span className={`text-sm font-semibold ${
                    theme === 'green-white' ? 'text-green-600' : theme === 'opaque' ? 'text-gray-700' : 'text-[#800000]'
                  }`}>HomeHNI UAE - Trusted Real Estate Platform</span>
                </div>

                <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 mb-4 leading-tight">
                  List Your Property on <span className={theme === 'green-white' ? 'text-green-600' : theme === 'opaque' ? 'text-gray-700' : 'text-[#800000]'}>HomeHNI</span>
                </h1>
                <p className="text-xl lg:text-2xl text-gray-700 mb-2 leading-relaxed font-medium">
                  Reach thousands of verified buyers and renters across UAE
                </p>
                <p className="text-base lg:text-lg text-gray-600 mb-8">
                  Get expert assistance, professional photography, and maximize your property's visibility
                </p>
                
                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                  <div className={`bg-white/90 backdrop-blur-sm rounded-xl p-4 border shadow-sm hover:shadow-md transition-shadow ${
                    theme === 'green-white' ? 'border-green-600/10' : theme === 'opaque' ? 'border-gray-300/10' : 'border-[#800000]/10'
                  }`}>
                    <div className={`text-3xl lg:text-4xl font-bold mb-1 ${
                      theme === 'green-white' ? 'text-green-600' : theme === 'opaque' ? 'text-gray-700' : 'text-[#800000]'
                    }`}>10K+</div>
                    <div className="text-xs lg:text-sm text-gray-600 font-medium">Active Listings</div>
                  </div>
                  <div className={`bg-white/90 backdrop-blur-sm rounded-xl p-4 border shadow-sm hover:shadow-md transition-shadow ${
                    theme === 'green-white' ? 'border-green-600/10' : theme === 'opaque' ? 'border-gray-300/10' : 'border-[#800000]/10'
                  }`}>
                    <div className={`text-3xl lg:text-4xl font-bold mb-1 ${
                      theme === 'green-white' ? 'text-green-600' : theme === 'opaque' ? 'text-gray-700' : 'text-[#800000]'
                    }`}>50K+</div>
                    <div className="text-xs lg:text-sm text-gray-600 font-medium">Monthly Visitors</div>
                  </div>
                  <div className={`bg-white/90 backdrop-blur-sm rounded-xl p-4 border shadow-sm hover:shadow-md transition-shadow ${
                    theme === 'green-white' ? 'border-green-600/10' : theme === 'opaque' ? 'border-gray-300/10' : 'border-[#800000]/10'
                  }`}>
                    <div className={`text-3xl lg:text-4xl font-bold mb-1 ${
                      theme === 'green-white' ? 'text-green-600' : theme === 'opaque' ? 'text-gray-700' : 'text-[#800000]'
                    }`}>24/7</div>
                    <div className="text-xs lg:text-sm text-gray-600 font-medium">Support</div>
                  </div>
                </div>

                {/* Illustration - UAE Skyline */}
                <div className="relative h-64 lg:h-80 bg-gradient-to-t from-white/70 to-white/40 rounded-xl flex items-end justify-center overflow-visible border border-white/60 shadow-inner mb-6">
                  <div className="absolute inset-0 flex items-end justify-center px-4 pb-6 pt-8">
                    {/* Dubai-style buildings */}
                    <div className="flex items-end gap-3 lg:gap-5">
                      {/* Tall building - Burj Al Arab style */}
                      <div className="bg-gradient-to-t from-[#800000] to-[#a00000] w-10 lg:w-14 h-40 lg:h-48 rounded-t-lg relative shadow-xl">
                        <div className="absolute inset-1 bg-gradient-to-t from-[#900000] to-[#b00000] rounded-t-lg"></div>
                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-white px-4 py-2 rounded-lg shadow-xl flex items-center gap-2 text-xs font-bold border border-[#800000]/20 whitespace-nowrap z-20">
                          <Check className="w-4 h-4 text-[#800000]" />
                          <span className="text-[#800000]">AED 3.5M</span>
                        </div>
                        {/* Windows */}
                        <div className="absolute top-4 left-1.5 right-1.5 grid grid-cols-2 gap-1">
                          {[...Array(8)].map((_, i) => (
                            <div key={i} className="h-4 bg-yellow-300/50 rounded"></div>
                          ))}
                        </div>
                      </div>
                      
                      {/* Medium building */}
                      <div className="bg-gradient-to-t from-[#800000]/90 to-[#800000] w-12 lg:w-16 h-28 lg:h-36 rounded-t-lg relative shadow-xl">
                        <div className="absolute inset-1 bg-gradient-to-t from-[#900000] to-[#a00000] rounded-t-lg"></div>
                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-white px-4 py-2 rounded-lg shadow-xl flex items-center gap-2 text-xs font-bold border border-[#800000]/20 whitespace-nowrap z-20">
                          <Check className="w-4 h-4 text-[#800000]" />
                          <span className="text-[#800000]">AED 95K/yr</span>
                        </div>
                        {/* Windows */}
                        <div className="absolute top-3 left-1.5 right-1.5 grid grid-cols-3 gap-1">
                          {[...Array(12)].map((_, i) => (
                            <div key={i} className="h-3 bg-yellow-300/50 rounded"></div>
                          ))}
                        </div>
                      </div>
                      
                      {/* Tall modern building */}
                      <div className="bg-gradient-to-t from-[#800000] via-[#900000] to-[#800000] w-9 lg:w-12 h-48 lg:h-56 rounded-t-lg relative shadow-xl">
                        <div className="absolute inset-1 bg-gradient-to-t from-[#900000] via-[#a00000] to-[#900000] rounded-t-lg"></div>
                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-white px-4 py-2 rounded-lg shadow-xl flex items-center gap-2 text-xs font-bold border border-[#800000]/20 whitespace-nowrap z-20">
                          <Check className="w-4 h-4 text-[#800000]" />
                          <span className="text-[#800000]">AED 5.2M</span>
                        </div>
                        {/* Vertical windows */}
                        <div className="absolute top-4 left-1.5 right-1.5 space-y-1.5">
                          {[...Array(6)].map((_, i) => (
                            <div key={i} className="h-7 bg-yellow-300/50 rounded"></div>
                          ))}
                        </div>
                      </div>
                      
                      {/* Shorter building */}
                      <div className="bg-gradient-to-t from-[#800000]/80 to-[#800000] w-10 lg:w-14 h-20 lg:h-28 rounded-t-lg relative shadow-xl">
                        <div className="absolute inset-1 bg-gradient-to-t from-[#900000] to-[#a00000] rounded-t-lg"></div>
                        {/* Windows */}
                        <div className="absolute top-2 left-1.5 right-1.5 grid grid-cols-2 gap-1">
                          {[...Array(6)].map((_, i) => (
                            <div key={i} className="h-3 bg-yellow-300/50 rounded"></div>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    {/* Clouds */}
                    <div className="absolute top-8 left-8 w-24 h-12 bg-white/60 rounded-full blur-sm"></div>
                    <div className="absolute top-12 right-16 w-28 h-14 bg-white/60 rounded-full blur-sm"></div>
                    <div className="absolute top-24 left-1/3 w-20 h-10 bg-white/60 rounded-full blur-sm"></div>
                    
                    {/* Sun */}
                    <div className="absolute top-4 right-4 w-16 h-16 bg-yellow-200/60 rounded-full blur-sm"></div>
                  </div>
                </div>
                
                {/* Features */}
                <div className="flex flex-wrap gap-4">
                  <div className={`flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-lg border shadow-sm ${
                    theme === 'green-white' ? 'border-green-600/10' : theme === 'opaque' ? 'border-gray-300/10' : 'border-[#800000]/10'
                  }`}>
                    <Check className={`w-5 h-5 flex-shrink-0 ${
                      theme === 'green-white' ? 'text-green-600' : theme === 'opaque' ? 'text-gray-600' : 'text-[#800000]'
                    }`} />
                    <span className="text-sm font-medium text-gray-700">Free Property Listing</span>
                  </div>
                  <div className={`flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-lg border shadow-sm ${
                    theme === 'green-white' ? 'border-green-600/10' : theme === 'opaque' ? 'border-gray-300/10' : 'border-[#800000]/10'
                  }`}>
                    <Check className={`w-5 h-5 flex-shrink-0 ${
                      theme === 'green-white' ? 'text-green-600' : theme === 'opaque' ? 'text-gray-600' : 'text-[#800000]'
                    }`} />
                    <span className="text-sm font-medium text-gray-700">Verified Buyers & Renters</span>
                  </div>
                  <div className={`flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-lg border shadow-sm ${
                    theme === 'green-white' ? 'border-green-600/10' : theme === 'opaque' ? 'border-gray-300/10' : 'border-[#800000]/10'
                  }`}>
                    <Check className={`w-5 h-5 flex-shrink-0 ${
                      theme === 'green-white' ? 'text-green-600' : theme === 'opaque' ? 'text-gray-600' : 'text-[#800000]'
                    }`} />
                    <span className="text-sm font-medium text-gray-700">Expert Agent Support</span>
                  </div>
                  <div className={`flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-lg border shadow-sm ${
                    theme === 'green-white' ? 'border-green-600/10' : theme === 'opaque' ? 'border-gray-300/10' : 'border-[#800000]/10'
                  }`}>
                    <Check className={`w-5 h-5 flex-shrink-0 ${
                      theme === 'green-white' ? 'text-green-600' : theme === 'opaque' ? 'text-gray-600' : 'text-[#800000]'
                    }`} />
                    <span className="text-sm font-medium text-gray-700">Professional Photography</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Section - Form */}
            <div className="order-1 lg:order-2 lg:col-span-1 flex items-start pt-6 lg:pt-12 xl:pt-16">
              <div className={`bg-white rounded-lg shadow-lg border p-6 lg:p-8 w-full ${
                theme === 'green-white' 
                  ? 'border-green-200' 
                  : theme === 'opaque'
                    ? 'border-gray-300'
                    : 'border-[#800000]/20'
              }`}>
                {/* I am looking to - BUY/RENT Tabs */}
                <div className="mb-6">
                  <label className="text-sm font-medium text-gray-700 mb-2 block">I am looking to</label>
                  <Tabs value={listingType} onValueChange={(value) => setListingType(value as 'BUY' | 'RENT')} className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger 
                        value="BUY" 
                        className={`${
                          theme === 'opaque'
                            ? 'text-black border border-gray-300 data-[state=active]:border-2 data-[state=active]:border-black data-[state=active]:bg-transparent data-[state=active]:text-black data-[state=inactive]:text-black data-[state=inactive]:bg-transparent'
                            : theme === 'green-white'
                              ? 'data-[state=active]:bg-green-600 data-[state=active]:text-white'
                              : 'data-[state=active]:bg-[#800000] data-[state=active]:text-white'
                        }`}
                      >
                        BUY
                      </TabsTrigger>
                      <TabsTrigger 
                        value="RENT" 
                        className={`${
                          theme === 'opaque'
                            ? 'text-black border border-gray-300 data-[state=active]:border-2 data-[state=active]:border-black data-[state=active]:bg-transparent data-[state=active]:text-black data-[state=inactive]:text-black data-[state=inactive]:bg-transparent'
                            : theme === 'green-white'
                              ? 'data-[state=active]:bg-green-600 data-[state=active]:text-white'
                              : 'data-[state=active]:bg-[#800000] data-[state=active]:text-white'
                        }`}
                      >
                        RENT
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>

                {/* Rent Frequency - Only for RENT */}
                {listingType === 'RENT' && (
                  <div className="mb-6">
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Rent Frequency</label>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant={rentFrequency === 'Yearly' ? 'default' : 'outline'}
                        className={`flex-1 ${
                          rentFrequency === 'Yearly' 
                            ? theme === 'opaque'
                              ? 'border-2 border-black bg-transparent text-black hover:bg-gray-100'
                              : theme === 'green-white'
                                ? 'bg-green-600 hover:bg-green-700 text-white'
                                : 'bg-[#800000] hover:bg-[#700000] text-white'
                            : theme === 'opaque'
                              ? 'text-black border-gray-300'
                              : ''
                        }`}
                        onClick={() => setRentFrequency('Yearly')}
                      >
                        Yearly
                      </Button>
                      <Button
                        type="button"
                        variant={rentFrequency === 'Monthly' ? 'default' : 'outline'}
                        className={`flex-1 ${
                          rentFrequency === 'Monthly' 
                            ? theme === 'opaque'
                              ? 'border-2 border-black bg-transparent text-black hover:bg-gray-100'
                              : theme === 'green-white'
                                ? 'bg-green-600 hover:bg-green-700 text-white'
                                : 'bg-[#800000] hover:bg-[#700000] text-white'
                            : theme === 'opaque'
                              ? 'text-black border-gray-300'
                              : ''
                        }`}
                        onClick={() => setRentFrequency('Monthly')}
                      >
                        Monthly
                      </Button>
                    </div>
                  </div>
                )}

                {/* Location */}
                <div className="mb-6">
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Location <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <Input
                      type="text"
                      placeholder="Enter location, building or community"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Category & Type */}
                <div className="mb-6">
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Category & Type <span className="text-red-500">*</span>
                  </label>
                  <Tabs value={category} onValueChange={(value) => {
                    setCategory(value as 'Residential' | 'Commercial');
                    setPropertyType(''); // Reset property type when category changes
                  }} className="w-full">
                    <TabsList className="grid w-full grid-cols-2 mb-4">
                      <TabsTrigger 
                        value="Residential" 
                        className={`${
                          theme === 'opaque'
                            ? 'data-[state=active]:border-2 data-[state=active]:border-black data-[state=active]:bg-transparent data-[state=active]:text-black data-[state=inactive]:text-black'
                            : theme === 'green-white'
                              ? 'data-[state=active]:bg-green-600 data-[state=active]:text-white'
                              : 'data-[state=active]:bg-[#800000] data-[state=active]:text-white'
                        }`}
                      >
                        Residential
                      </TabsTrigger>
                      <TabsTrigger 
                        value="Commercial" 
                        className={`${
                          theme === 'opaque'
                            ? 'data-[state=active]:border-2 data-[state=active]:border-black data-[state=active]:bg-transparent data-[state=active]:text-black data-[state=inactive]:text-black'
                            : theme === 'green-white'
                              ? 'data-[state=active]:bg-green-600 data-[state=active]:text-white'
                              : 'data-[state=active]:bg-[#800000] data-[state=active]:text-white'
                        }`}
                      >
                        Commercial
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                  
                  {/* Property Type Buttons */}
                  <div className="flex flex-wrap gap-2">
                    {propertyTypes[category].map((type) => (
                      <Button
                        key={type}
                        type="button"
                        variant={propertyType === type ? 'default' : 'outline'}
                        className={`${
                          propertyType === type 
                            ? theme === 'opaque'
                              ? 'border-2 border-black bg-transparent text-black hover:bg-gray-100'
                              : theme === 'green-white'
                                ? 'bg-green-600 hover:bg-green-700 text-white'
                                : 'bg-[#800000] hover:bg-[#700000] text-white'
                            : theme === 'opaque'
                              ? 'text-black border-gray-300'
                              : ''
                        }`}
                        onClick={() => setPropertyType(type)}
                      >
                        {type}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Bedrooms */}
                <div className="mb-6">
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Bedrooms <span className="text-red-500">*</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {bedroomOptions.map((option) => (
                      <Button
                        key={option}
                        type="button"
                        variant={bedrooms === option ? 'default' : 'outline'}
                        className={`${
                          bedrooms === option 
                            ? theme === 'opaque'
                              ? 'border-2 border-black bg-transparent text-black hover:bg-gray-100'
                              : theme === 'green-white'
                                ? 'bg-green-600 hover:bg-green-700 text-white'
                                : 'bg-[#800000] hover:bg-[#700000] text-white'
                            : theme === 'opaque'
                              ? 'text-black border-gray-300'
                              : ''
                        }`}
                        onClick={() => setBedrooms(option)}
                      >
                        {option}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Area */}
                <div className="mb-6">
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Area (sqft)</label>
                  <Input
                    type="number"
                    placeholder="Enter area"
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                  />
                </div>

                {/* Furnishing */}
                <div className="mb-6">
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Furnishing</label>
                  <Select value={furnishing} onValueChange={setFurnishing}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Furnished">Furnished</SelectItem>
                      <SelectItem value="Semi-Furnished">Semi-Furnished</SelectItem>
                      <SelectItem value="Unfurnished">Unfurnished</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Urgency */}
                <div className="mb-6">
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Urgency</label>
                  <div className="flex flex-wrap gap-2">
                    {urgencyOptions.map((option) => (
                      <Button
                        key={option}
                        type="button"
                        variant={urgency === option ? 'default' : 'outline'}
                        className={`${
                          urgency === option 
                            ? theme === 'opaque'
                              ? 'border-2 border-black bg-transparent text-black hover:bg-gray-100'
                              : theme === 'green-white'
                                ? 'bg-green-600 hover:bg-green-700 text-white'
                                : 'bg-[#800000] hover:bg-[#700000] text-white'
                            : theme === 'opaque'
                              ? 'text-black border-gray-300'
                              : ''
                        }`}
                        onClick={() => setUrgency(option)}
                      >
                        {option}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Continue Button */}
                <Button
                  type="button"
                  className={`w-full py-6 text-lg font-medium ${
                    theme === 'opaque'
                      ? 'border-2 border-black bg-transparent text-black hover:bg-gray-100'
                      : theme === 'green-white'
                        ? 'bg-green-600 hover:bg-green-700 text-white'
                        : 'bg-[#800000] hover:bg-[#700000] text-white'
                  }`}
                  onClick={handleContinue}
                >
                  Continue
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PostProperty;



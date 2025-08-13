import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useToast } from "@/hooks/use-toast";
import { Building2, Users, CreditCard, Wrench, Camera, FileText, MapPin, Crown, TrendingUp, Clock, CheckCircle, Shield, Star, X, Plus, Minus, Globe, Shield as ShieldCheck, Headphones, Smartphone, Download, Home } from "lucide-react";
import Marquee from "@/components/Marquee";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
const PropManagement = () => {
  const services = [{
    icon: Users,
    title: "Tenant Management",
    description: "End-to-end tenant handling: onboarding, agreements, exit."
  }, {
    icon: CreditCard,
    title: "Rent Collection",
    description: "Timely rent, reminders, payment tracking."
  }, {
    icon: Wrench,
    title: "Maintenance & Repairs",
    description: "Plumbing, electrical, cleaning, and more."
  }, {
    icon: Camera,
    title: "Periodic Property Inspections",
    description: "Photo/video reports delivered remotely."
  }, {
    icon: FileText,
    title: "Legal Support",
    description: "Lease paperwork, renewals, tax, society handling."
  }, {
    icon: Building2,
    title: "Property Marketing",
    description: "Professional listing and promotion services."
  }];
  const targetAudience = [{
    icon: Globe,
    title: "NRIs",
    description: "Looking for remote property management"
  }, {
    icon: Crown,
    title: "HNIs",
    description: "With multiple or high-value homes"
  }, {
    icon: TrendingUp,
    title: "Real Estate Investors",
    description: "Focused on ROI"
  }];
  const comparisonData = [{
    feature: "Professional Property Management",
    homeHNI: true,
    others: false
  }, {
    feature: "Dedicated Relationship Manager",
    homeHNI: true,
    others: false
  }, {
    feature: "Transparent Monthly Reports",
    homeHNI: true,
    others: false
  }, {
    feature: "24/7 Customer Support",
    homeHNI: true,
    others: false
  }, {
    feature: "Legal Compliance & Documentation",
    homeHNI: true,
    others: false
  }, {
    feature: "Verified Vendor Network",
    homeHNI: true,
    others: false
  }, {
    feature: "Technology-Driven Operations",
    homeHNI: true,
    others: false
  }, {
    feature: "Zero Hidden Charges",
    homeHNI: true,
    others: false
  }];
  const testimonials = [{
    name: "Rajesh Kumar",
    role: "NRI Property Owner",
    image: "/lovable-uploads/46a07bb4-9f10-4614-ad52-73dfb2de4f28.png",
    rating: 5,
    text: "Excellent service! They handle everything while I'm abroad. Complete peace of mind."
  }, {
    name: "Priya Sharma",
    role: "Real Estate Investor",
    image: "/lovable-uploads/5b898e4e-d9b6-4366-b58f-176fc3c8a9c3.png",
    rating: 5,
    text: "Professional management with transparent reporting. Highly recommended!"
  }, {
    name: "Amit Patel",
    role: "HNI Client",
    image: "/lovable-uploads/6e6c47cd-700c-49d4-bfee-85a69bb8353f.png",
    rating: 5,
    text: "Best property management service in Hyderabad. Worth every penny!"
  }];
  const faqs = [{
    question: "What is included in property management services?",
    answer: "Our comprehensive package includes tenant management, rent collection, maintenance & repairs, periodic inspections, legal support, and detailed monthly reporting."
  }, {
    question: "How do you handle tenant verification?",
    answer: "We conduct thorough background checks including identity verification, employment verification, credit checks, and reference validation to ensure reliable tenants."
  }, {
    question: "What are your charges for property management?",
    answer: "Our charges are transparent and competitive, typically 8-12% of monthly rent depending on services selected. No hidden fees or surprise costs."
  }, {
    question: "How often do you inspect the property?",
    answer: "We conduct quarterly inspections with detailed photo/video reports. Emergency inspections are done as needed."
  }, {
    question: "Do you provide legal support?",
    answer: "Yes, we handle all legal documentation including rental agreements, renewals, society compliance, and dispute resolution."
  }];
  const {
    toast
  } = useToast();
  useEffect(() => {
    const title = "Property Management Services | Home HNI";
    document.title = title;
    const desc = "End-to-end property management for NRIs & HNIs: tenant search, rent collection, maintenance, and inspections.";
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', 'description');
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', desc);
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', window.location.origin + '/prop-management');
  }, []);
  return <div className="min-h-screen">
      <Marquee />
      <Header />
      
      {/* Hero Section */}
      <section className="relative pt-28 md:pt-32 pb-12 md:pb-16 px-4 md:px-8 text-white overflow-hidden bg-cover bg-center bg-no-repeat" style={{
      backgroundImage: "url('/lovable-uploads/fbb0d72f-782e-49f5-bbe1-8afc1314b5f7.png')"
    }}>
        <div className="absolute inset-0 bg-blue-900/80 pointer-events-none" />

        <div className="relative z-10 container mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 items-start">
            {/* Left: Copy */}
            <div className="max-w-2xl">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
                Comprehensive Property Management Services
                <br className="hidden md:block" />
                <span className="block">in Hyderabad</span>
              </h1>
              <p className="text-lg md:text-xl text-white/90 mb-6">
                From securing verified tenants to regular property maintenance, we handle
                everything for you.
              </p>
            </div>

            {/* Right: Placeholder for form on desktop */}
            <div className="hidden lg:block lg:justify-self-end">
              <div className="w-full max-w-md h-80"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Sticky Form Container for Large Screens */}
      <div className="hidden lg:block fixed top-32 right-8 z-50 w-96">
        <Card className="w-full rounded-xl shadow-2xl bg-background border">
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold text-foreground mb-2">Got a property to be managed?</h3>
            <p className="text-sm text-muted-foreground mb-4">Just fill up the form & we will take care of the rest</p>

            <form className="space-y-4" onSubmit={e => {
            e.preventDefault();
            toast({
              title: "Request received",
              description: "Our team will reach out shortly."
            });
            (e.currentTarget as HTMLFormElement).reset();
          }}>
              <Input id="pm-name" name="name" placeholder="Name" required />

              <div className="flex gap-2">
                <Select defaultValue="+91" name="countryCode">
                  <SelectTrigger className="w-28"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="+91">🇮🇳 +91</SelectItem>
                    <SelectItem value="+1">🇺🇸 +1</SelectItem>
                    <SelectItem value="+44">🇬🇧 +44</SelectItem>
                  </SelectContent>
                </Select>
                <Input id="pm-phone" name="phone" type="tel" placeholder="Phone Number" className="flex-1" required />
              </div>

              <Input id="pm-email" name="email" type="email" placeholder="Email ID" />

              <Select name="city">
                <SelectTrigger id="pm-city"><SelectValue placeholder="City" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Hyderabad">Hyderabad</SelectItem>
                  <SelectItem value="Bengaluru">Bengaluru</SelectItem>
                  <SelectItem value="Mumbai">Mumbai</SelectItem>
                  <SelectItem value="Pune">Pune</SelectItem>
                  <SelectItem value="Chennai">Chennai</SelectItem>
                  <SelectItem value="Delhi NCR">Delhi NCR</SelectItem>
                </SelectContent>
              </Select>

              <Button type="submit" className="w-full">Talk to Us Today!</Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Mobile Form - Static below hero */}
      <section className="lg:hidden px-4 py-8 bg-background">
        <div className="container mx-auto max-w-xl px-4">
          <Card className="w-full rounded-2xl shadow-xl border-0 bg-card">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-foreground mb-3">Got a property to be managed?</h3>
              <p className="text-base text-muted-foreground mb-8">Just fill up the form & we will take care of the rest</p>

              <form className="space-y-5" onSubmit={e => {
                e.preventDefault();
                toast({
                  title: "Request received",
                  description: "Our team will reach out shortly."
                });
                (e.currentTarget as HTMLFormElement).reset();
              }}>
                <Input 
                  id="pm-name-mobile" 
                  name="name" 
                  placeholder="Name" 
                  className="h-12 text-base bg-background"
                  required 
                />

                <div className="flex gap-3">
                  <Select defaultValue="+91" name="countryCode">
                    <SelectTrigger className="w-32 h-12 bg-background">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-background border shadow-lg">
                      <SelectItem value="+91">🇮🇳 +91</SelectItem>
                      <SelectItem value="+1">🇺🇸 +1</SelectItem>
                      <SelectItem value="+44">🇬🇧 +44</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input 
                    id="pm-phone-mobile" 
                    name="phone" 
                    type="tel" 
                    placeholder="Phone Number" 
                    className="flex-1 h-12 text-base bg-background" 
                    required 
                  />
                </div>

                <Input 
                  id="pm-email-mobile" 
                  name="email" 
                  type="email" 
                  placeholder="Email ID" 
                  className="h-12 text-base bg-background"
                />

                <Select name="city">
                  <SelectTrigger id="pm-city-mobile" className="h-12 bg-background">
                    <SelectValue placeholder="City" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border shadow-lg">
                    <SelectItem value="Hyderabad">Hyderabad</SelectItem>
                    <SelectItem value="Bengaluru">Bengaluru</SelectItem>
                    <SelectItem value="Mumbai">Mumbai</SelectItem>
                    <SelectItem value="Pune">Pune</SelectItem>
                    <SelectItem value="Chennai">Chennai</SelectItem>
                    <SelectItem value="Delhi NCR">Delhi NCR</SelectItem>
                  </SelectContent>
                </Select>

                <Button type="submit" className="w-full h-12 text-base font-semibold bg-teal-600 hover:bg-teal-700 text-white mt-6">
                  Talk to Us Today!
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* What's in it for you Section */}
      <section className="py-16 px-4 bg-background">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 items-start">
            <div className="max-w-2xl pr-8">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8">
                What's in it for you?
              </h2>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Home className="w-5 h-5 text-blue-600" />
                  </div>
                  <h3 className="text-base font-semibold text-foreground">
                    Premium Property Listing & Promotion
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Boost your property's visibility by 3x with targeted, high-quality tenant reach
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-blue-600" />
                  </div>
                  <h3 className="text-base font-semibold text-foreground">
                    Lifetime Tenant Search
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Enjoy unlimited tenant searches at a negligible cost
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Shield className="w-5 h-5 text-blue-600" />
                  </div>
                  <h3 className="text-base font-semibold text-foreground">
                    Tenant Background Verification
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Get thorough tenant background checks for secure and reliable occupancy
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-blue-600" />
                  </div>
                  <h3 className="text-base font-semibold text-foreground">
                    Free Rental Agreement
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Get an e-stamped rental agreement delivered to your doorstep
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Camera className="w-5 h-5 text-blue-600" />
                  </div>
                  <h3 className="text-base font-semibold text-foreground">
                    Periodic Home Inspection
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Maintain your property's value with scheduled, professional inspections
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Wrench className="w-5 h-5 text-blue-600" />
                  </div>
                  <h3 className="text-base font-semibold text-foreground">
                    On-demand Repair & Maintenance Services
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Quick, expert repair and maintenance services at your convenience
                  </p>
                </div>
              </div>
            </div>
            
            {/* Right side spacing for sticky form */}
            <div className="hidden lg:block"></div>
          </div>
        </div>
      </section>

      {/* Mobile App Section */}
      


      {/* Property Management Info Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div className="max-w-3xl">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8">
                Property Management in Hyderabad
              </h2>
              <div className="text-muted-foreground space-y-4 text-sm leading-relaxed">
                <p>
                  Property management services in Hyderabad have become a must for property owners who want to 
                  manage their real estate investments efficiently. NoBroker, a trusted name in the industry, offers 
                  comprehensive property management solutions tailored to Hyderabad's unique needs.
                </p>
                <p>
                  From finding reliable tenants to handling maintenance, rent collection, and legal support, NoBroker 
                  ensures that your property is well-managed without any hassles. Whether you own a residential or 
                  commercial property, their professional services help you save time, reduce stress, and get maximum...
                </p>
                <Button variant="link" className="p-0 h-auto text-teal-600 hover:text-teal-700">
                  Read More
                </Button>
              </div>
            </div>
            
            {/* Right side spacing for sticky form */}
            <div className="hidden lg:block"></div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-background">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="max-w-4xl bg-slate-900 text-white rounded-2xl px-8 py-12">
              <div className="grid md:grid-cols-3 gap-8 text-center">
                <div>
                  <div className="w-16 h-16 bg-yellow-400 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Building2 className="w-8 h-8 text-slate-900" />
                  </div>
                  <div className="text-3xl font-bold mb-2">10,000+</div>
                  <div className="text-white/80">Properties Managed</div>
                </div>
                <div>
                  <div className="w-16 h-16 bg-yellow-400 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-slate-900" />
                  </div>
                  <div className="text-3xl font-bold mb-2">5,000+</div>
                  <div className="text-white/80">NRI Property Owners</div>
                </div>
                <div>
                  <div className="w-16 h-16 bg-yellow-400 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Globe className="w-8 h-8 text-slate-900" />
                  </div>
                  <div className="text-3xl font-bold mb-2">50+</div>
                  <div className="text-white/80">Countries Served</div>
                </div>
              </div>
            </div>
            
            {/* Right side spacing for sticky form */}
            <div className="hidden lg:block"></div>
          </div>
        </div>
      </section>

      {/* Comparison Table Section */}
      <section className="py-8 md:py-16 px-2 md:px-4 bg-background">
        <div className="container mx-auto px-0">
          <div className="grid lg:grid-cols-2 gap-4 lg:gap-8 items-start">
            <div className="w-full">
              <h2 className="text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold text-foreground mb-6 md:mb-8 lg:mb-12">
                HomeHNI.com vs Others: What makes us better?
              </h2>
              
              {/* Mobile Table Layout */}
              <Card className="md:hidden overflow-hidden mx-0">
                <CardContent className="p-0">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-slate-900 text-white">
                        <th className="text-left py-2 px-1 font-semibold text-xs w-1/2">Services</th>
                        <th className="text-center py-2 px-1 font-semibold text-xs w-1/4">
                          <span className="text-[10px]">HomeHNI</span>
                        </th>
                        <th className="text-center py-2 px-1 font-semibold text-xs w-1/4">
                          <span className="text-[10px]">Others</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {comparisonData.map((item, index) => (
                        <tr key={index} className={`border-t ${index % 2 === 0 ? 'bg-muted/30' : ''}`}>
                          <td className="py-2 px-1 font-medium text-xs leading-tight">{item.feature}</td>
                          <td className="py-2 px-1 text-center">
                            {item.homeHNI ? (
                              <CheckCircle className="w-3 h-3 text-green-500 mx-auto" />
                            ) : (
                              <X className="w-3 h-3 text-red-500 mx-auto" />
                            )}
                          </td>
                          <td className="py-2 px-1 text-center">
                            {item.others ? (
                              <CheckCircle className="w-3 h-3 text-green-500 mx-auto" />
                            ) : (
                              <X className="w-3 h-3 text-red-500 mx-auto" />
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </CardContent>
              </Card>

              {/* Desktop Table Layout */}
              <Card className="hidden md:block overflow-hidden">
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[600px]">
                      <thead>
                        <tr className="bg-slate-900 text-white">
                          <th className="text-left p-3 md:p-4 font-semibold text-sm md:text-base">Services</th>
                          <th className="text-center p-3 md:p-4 font-semibold text-sm md:text-base">
                            <div className="flex items-center justify-center space-x-2">
                              <span>HomeHNI.com</span>
                            </div>
                          </th>
                          <th className="text-center p-3 md:p-4 font-semibold text-sm md:text-base">
                            Other Property Management Services in India
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {comparisonData.map((item, index) => (
                          <tr key={index} className={`border-t ${index % 2 === 0 ? 'bg-muted/30' : ''}`}>
                            <td className="p-3 md:p-4 font-medium text-sm md:text-base">{item.feature}</td>
                            <td className="p-3 md:p-4 text-center">
                              {item.homeHNI ? (
                                <CheckCircle className="w-5 h-5 md:w-6 md:h-6 text-green-500 mx-auto" />
                              ) : (
                                <X className="w-5 h-5 md:w-6 md:h-6 text-red-500 mx-auto" />
                              )}
                            </td>
                            <td className="p-3 md:p-4 text-center">
                              {item.others ? (
                                <CheckCircle className="w-5 h-5 md:w-6 md:h-6 text-green-500 mx-auto" />
                              ) : (
                                <X className="w-5 h-5 md:w-6 md:h-6 text-red-500 mx-auto" />
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Right side spacing for sticky form */}
            <div className="hidden lg:block"></div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div className="max-w-3xl">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-12">
                Testimonials
              </h2>
              
              <div className="space-y-8">
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <div className="flex items-center space-x-3 mb-4">
                    <img src="/lovable-uploads/46a07bb4-9f10-4614-ad52-73dfb2de4f28.png" alt="Brajesh Kumar" className="w-12 h-12 rounded-full object-cover" />
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="font-semibold">BRAJESH KUMAR,UK</h4>
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      </div>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)}
                        <span className="text-sm text-muted-foreground ml-2">5.0</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    No broker is truly genie in the bottle when it comes to renting your apartment. I like to say thanks to my relationship manager & Field RMs who helped me close the deal. From tenant sourcing to...
                  </p>
                </div>

                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <div className="flex items-center space-x-3 mb-4">
                    <img src="/lovable-uploads/5b898e4e-d9b6-4366-b58f-176fc3c8a9c3.png" alt="Naveen Sahay" className="w-12 h-12 rounded-full object-cover" />
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="font-semibold">NAVEEN SAHAY,USA</h4>
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      </div>
                      <div className="flex">
                        {[...Array(4)].map((_, i) => <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)}
                        <Star className="w-4 h-4 text-gray-300" />
                        <span className="text-sm text-muted-foreground ml-2">4.5</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Really happy with the service! NoBroker rented out my property in less than a month. The tenants were well screened. They complete the needed repairs quickly while being very proactive in...
                  </p>
                </div>
              </div>
            </div>
            
            {/* Right side spacing for sticky form */}
            <div className="hidden lg:block"></div>
          </div>
        </div>
      </section>

      {/* Service Tags Section */}
      <section className="py-16 px-4 bg-background">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div className="max-w-3xl">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8">
                Property Management Services
              </h2>
              
              <div className="space-y-6 mb-8">
                <div className="flex flex-wrap gap-3">
                  <span className="px-4 py-2 bg-muted rounded-full text-sm">Property Management in India</span>
                  <span className="px-4 py-2 bg-muted rounded-full text-sm">Property Management in Bangalore</span>
                  <span className="px-4 py-2 bg-muted rounded-full text-sm">Property Management in Mumbai</span>
                </div>
                <div className="flex flex-wrap gap-3">
                  <span className="px-4 py-2 bg-muted rounded-full text-sm">Property Management in Pune</span>
                  <span className="px-4 py-2 bg-muted rounded-full text-sm">Property Management in Delhi</span>
                  <span className="px-4 py-2 bg-muted rounded-full text-sm">Property Management in Noida</span>
                </div>
                <div className="flex flex-wrap gap-3">
                  <span className="px-4 py-2 bg-muted rounded-full text-sm">Property Management in Gurgaon</span>
                  <span className="px-4 py-2 bg-muted rounded-full text-sm">Property Management in Chennai</span>
                  <span className="px-4 py-2 bg-muted rounded-full text-sm">Property Management in Navi Mumbai</span>
                </div>
                <div className="flex flex-wrap gap-3">
                  <span className="px-4 py-2 bg-muted rounded-full text-sm">Rent Collection Online</span>
                  <span className="px-4 py-2 bg-muted rounded-full text-sm">Rental Property Management</span>
                  <span className="px-4 py-2 bg-muted rounded-full text-sm">Rental Property Management in Bangalore</span>
                </div>
                <div className="flex flex-wrap gap-3">
                  <span className="px-4 py-2 bg-muted rounded-full text-sm">Tenant Management</span>
                </div>
              </div>

              <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-6">
                Property Maintenance Services
              </h3>
              
              <div className="space-y-3 mb-8">
                <div className="flex flex-wrap gap-3">
                  <span className="px-4 py-2 bg-muted rounded-full text-sm">Property Maintenance</span>
                  <span className="px-4 py-2 bg-muted rounded-full text-sm">Property Maintenance in Bangalore</span>
                </div>
              </div>

              <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-6">
                Property Inspection Services
              </h3>
              
              <div className="space-y-3">
                <div className="flex flex-wrap gap-3">
                  <span className="px-4 py-2 bg-muted rounded-full text-sm">Property Inspection</span>
                  <span className="px-4 py-2 bg-muted rounded-full text-sm">Commercial Property Inspection Services</span>
                </div>
                <div className="flex flex-wrap gap-3">
                  <span className="px-4 py-2 bg-muted rounded-full text-sm">Drone Property Inspection Services</span>
                  <span className="px-4 py-2 bg-muted rounded-full text-sm">Home Property Inspection</span>
                </div>
                <div className="flex flex-wrap gap-3">
                  <span className="px-4 py-2 bg-muted rounded-full text-sm">Thermal Imaging Property Inspection</span>
                </div>
              </div>
            </div>
            
            {/* Right side spacing for sticky form */}
            <div className="hidden lg:block"></div>
          </div>
        </div>
      </section>

      {/* Target Audience Section */}
      

      {/* Comparison Table Section */}
      

      {/* Mobile App Section */}
      

      {/* Testimonials Section */}
      

      {/* FAQ Section */}
      

      {/* Property Management Info Section */}
      

      <Footer />
    </div>;
};
export default PropManagement;
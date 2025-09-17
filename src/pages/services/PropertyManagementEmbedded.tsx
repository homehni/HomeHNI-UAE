import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useToast } from "@/hooks/use-toast";
import { Building2, Users, CreditCard, Calculator, TrendingUp, FileText, MapPin, Crown, Clock, CheckCircle, Shield, Star, X, Plus, Minus, Globe, Shield as ShieldCheck, Headphones, Smartphone, Download, Home, UserCheck, Settings, BarChart3, Wrench } from "lucide-react";

const PropertyManagementEmbedded = () => {
  const services = [{
    icon: Users,
    title: "Tenant Management",
    description: "Complete tenant screening, onboarding, and relationship management."
  }, {
    icon: CreditCard,
    title: "Rent Collection",
    description: "Automated rent collection with timely follow-ups and receipts."
  }, {
    icon: Wrench,
    title: "Property Maintenance",
    description: "24/7 maintenance coordination and vendor management."
  }, {
    icon: Shield,
    title: "Legal Compliance",
    description: "Complete legal documentation and regulatory compliance."
  }, {
    icon: TrendingUp,
    title: "Marketing & Leasing",
    description: "Professional marketing to find quality tenants quickly."
  }, {
    icon: BarChart3,
    title: "Financial Reporting",
    description: "Detailed monthly reports and transparent accounting."
  }];

  const targetAudience = [{
    icon: Home,
    title: "Property Owners",
    description: "Multiple property owners seeking professional management"
  }, {
    icon: TrendingUp,
    title: "Real Estate Investors",
    description: "Investors looking to maximize returns with minimal hassle"
  }, {
    icon: Globe,
    title: "NRI Property Owners",
    description: "Non-resident Indians needing remote property management"
  }];

  const comparisonData = [{
    feature: "Professional Tenant Screening",
    homeHNI: true,
    others: false
  }, {
    feature: "Automated Rent Collection",
    homeHNI: true,
    others: false
  }, {
    feature: "24/7 Maintenance Support",
    homeHNI: true,
    others: false
  }, {
    feature: "Legal Compliance Management",
    homeHNI: true,
    others: false
  }, {
    feature: "Digital Financial Reports",
    homeHNI: true,
    others: false
  }, {
    feature: "Property Marketing Services",
    homeHNI: true,
    others: false
  }, {
    feature: "Transparent Fee Structure",
    homeHNI: true,
    others: false
  }, {
    feature: "Dedicated Property Manager",
    homeHNI: true,
    others: false
  }];

  const testimonials = [{
    name: "Rajesh Agarwal",
    role: "Property Owner",
    image: "/lovable-uploads/46a07bb4-9f10-4614-ad52-73dfb2de4f28.png",
    rating: 5,
    text: "Excellent property management service! They handle everything professionally and my rental income has increased significantly."
  }, {
    name: "Priya Sharma",
    role: "NRI Investor",
    image: "/lovable-uploads/5b898e4e-d9b6-4366-b58f-176fc3c8a9c3.png",
    rating: 5,
    text: "Perfect for NRI property management. They take care of everything remotely and provide detailed monthly reports."
  }, {
    name: "Amit Kumar",
    role: "Real Estate Investor",
    image: "/lovable-uploads/6e6c47cd-700c-49d4-bfee-85a69bb8353f.png",
    rating: 5,
    text: "Professional service with excellent tenant screening and maintenance coordination. Highly recommend!"
  }];

  const faqs = [{
    question: "What services are included in property management?",
    answer: "Our property management includes tenant screening, rent collection, property maintenance, legal compliance, marketing & leasing, and detailed financial reporting."
  }, {
    question: "How do you screen tenants?",
    answer: "We conduct comprehensive tenant screening including background checks, income verification, employment verification, and reference checks to ensure quality tenants."
  }, {
    question: "What is your fee structure?",
    answer: "Our fees are transparent and competitive, typically ranging from 8-12% of monthly rent. We provide detailed breakdown of all charges upfront."
  }, {
    question: "Do you handle maintenance issues?",
    answer: "Yes, we provide 24/7 maintenance support with a network of trusted vendors and coordinate all repairs and maintenance work."
  }, {
    question: "How often do you provide financial reports?",
    answer: "We provide detailed monthly financial reports including income, expenses, maintenance costs, and property performance metrics."
  }];

  const { toast } = useToast();

  return (
    <div className="bg-background">
      {/* Hero Section */}
      <section className="relative pt-8 pb-20 md:pb-32 px-4 md:px-8 text-white overflow-hidden bg-cover bg-center bg-no-repeat" style={{
        backgroundImage: "url('/lovable-uploads/fbb0d72f-782e-49f5-bbe1-8afc1314b5f7.png')"
      }}>
        <div className="absolute inset-0 bg-red-900/80 pointer-events-none" />

        <div className="relative z-10 container mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 items-start">
            <div className="max-w-2xl">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
                Professional Property Management
                <br className="hidden md:block" />
                <span className="block">for Maximum Returns</span>
              </h1>
              <p className="text-lg md:text-xl text-white/90 mb-6">
                Complete property management services with tenant screening, rent collection, 
                maintenance coordination, and detailed financial reporting.
              </p>
            </div>
            <div className="hidden lg:block lg:justify-self-end">
              <div className="w-full max-w-md h-80"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile Form */}
      <section className="lg:hidden px-4 py-8 bg-background">
        <div className="container mx-auto max-w-xl">
          <Card className="w-full rounded-2xl shadow-xl border-2 border-primary bg-card">
            <CardContent className="p-6 md:p-8">
              <h3 className="text-xl md:text-2xl font-bold text-foreground mb-3">Got a property to be managed?</h3>
              <p className="text-sm md:text-base text-muted-foreground mb-6 md:mb-8">Just fill up the form & we will take care of the rest</p>

              <form className="space-y-5" onSubmit={e => {
                e.preventDefault();
                const form = e.currentTarget as HTMLFormElement;
                
                if (!form.checkValidity()) {
                  form.reportValidity();
                  toast({
                    title: "Required Fields Missing",
                    description: "Please fill in all required fields before submitting.",
                    variant: "destructive"
                  });
                  return;
                }

                toast({
                  title: "Request received",
                  description: "Our property management expert will contact you shortly."
                });
                form.reset();
              }}>
                <Input id="prop-name-mobile" name="name" placeholder="Name" className="h-10 md:h-12 text-sm md:text-base bg-background" required />

                <div className="flex gap-2 md:gap-3">
                  <Select defaultValue="+91" name="countryCode">
                    <SelectTrigger className="w-24 md:w-32 h-10 md:h-12 bg-background">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-background border shadow-lg">
                      <SelectItem value="+91">🇮🇳 +91</SelectItem>
                      <SelectItem value="+1">🇺🇸 +1</SelectItem>
                      <SelectItem value="+44">🇬🇧 +44</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input id="prop-phone-mobile" name="phone" type="tel" placeholder="Phone Number" className="flex-1 h-10 md:h-12 text-sm md:text-base bg-background" required />
                </div>

                <Input id="prop-email-mobile" name="email" type="email" placeholder="Email ID" className="h-10 md:h-12 text-sm md:text-base bg-background" required />

                <div className="flex flex-col sm:flex-row gap-2 md:gap-3">
                  <Select name="propertyType" required>
                    <SelectTrigger id="prop-type-mobile" className="h-10 md:h-12 bg-background">
                      <SelectValue placeholder="Property Type" />
                    </SelectTrigger>
                    <SelectContent className="bg-background border shadow-lg">
                      <SelectItem value="apartment">Apartment</SelectItem>
                      <SelectItem value="villa">Villa</SelectItem>
                      <SelectItem value="independent-house">Independent House</SelectItem>
                      <SelectItem value="commercial">Commercial Property</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input id="prop-location-mobile" name="location" placeholder="Property Location" className="h-10 md:h-12 text-sm md:text-base bg-background" />
                </div>

                <div className="flex flex-col sm:flex-row gap-2 md:gap-3">
                  <Select name="city" required>
                    <SelectTrigger id="prop-city-mobile" className="h-10 md:h-12 bg-background">
                      <SelectValue placeholder="City" />
                    </SelectTrigger>
                    <SelectContent className="bg-background border shadow-lg">
                      <SelectItem value="bangalore">Bangalore</SelectItem>
                      <SelectItem value="mumbai">Mumbai</SelectItem>
                      <SelectItem value="delhi">Delhi</SelectItem>
                      <SelectItem value="pune">Pune</SelectItem>
                      <SelectItem value="hyderabad">Hyderabad</SelectItem>
                      <SelectItem value="chennai">Chennai</SelectItem>
                      <SelectItem value="kolkata">Kolkata</SelectItem>
                      <SelectItem value="ahmedabad">Ahmedabad</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button type="submit" className="w-full h-10 md:h-12 text-sm md:text-base font-semibold bg-red-600 hover:bg-red-700 text-white mt-4 md:mt-6">
                  Talk to Us Today!
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Our Services */}
      <section className="py-16 px-4 bg-background">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div className="max-w-3xl">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8">
                Our Property Management Services
              </h2>
              <div className="grid gap-6">
                {services.map((service, index) => {
                  const IconComponent = service.icon;
                  return (
                    <div key={index} className="flex gap-4 p-6 bg-card rounded-lg border">
                      <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <IconComponent className="w-6 h-6 text-red-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-foreground mb-2">{service.title}</h3>
                        <p className="text-muted-foreground text-sm">{service.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="hidden lg:block"></div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div className="max-w-3xl">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8">
                Trusted by Thousands
              </h2>
              <div className="grid grid-cols-2 gap-8">
                <div className="text-center">
                  <div className="text-4xl md:text-5xl font-bold text-red-600 mb-2">1K+</div>
                  <p className="text-muted-foreground">Properties Managed</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl md:text-5xl font-bold text-red-600 mb-2">500+</div>
                  <p className="text-muted-foreground">Happy Landlords</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl md:text-5xl font-bold text-red-600 mb-2">24/7</div>
                  <p className="text-muted-foreground">Support Team</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl md:text-5xl font-bold text-red-600 mb-2">95%</div>
                  <p className="text-muted-foreground">Occupancy Rate</p>
                </div>
              </div>
            </div>
            <div className="hidden lg:block"></div>
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-16 px-4 bg-background">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div className="max-w-3xl">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8">
                Why Home HNI is Better
              </h2>
              <div className="bg-card rounded-xl border overflow-hidden">
                <div className="grid grid-cols-3 gap-4 p-4 bg-muted/50 font-semibold text-sm">
                  <div>Features</div>
                  <div className="text-center">Home HNI</div>
                  <div className="text-center">Others</div>
                </div>
                {comparisonData.map((item, index) => (
                  <div key={index} className="grid grid-cols-3 gap-4 p-4 border-t text-sm">
                    <div className="text-foreground">{item.feature}</div>
                    <div className="text-center">
                      {item.homeHNI ? (
                        <CheckCircle className="w-4 h-4 text-red-600 mx-auto" />
                      ) : (
                        <X className="w-4 h-4 text-red-500 mx-auto" />
                      )}
                    </div>
                    <div className="text-center">
                      {item.others ? (
                        <CheckCircle className="w-4 h-4 text-red-600 mx-auto" />
                      ) : (
                        <X className="w-4 h-4 text-red-500 mx-auto" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="hidden lg:block"></div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div className="max-w-3xl">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8">
                What Our Customers Say
              </h2>
              <div className="space-y-6">
                {testimonials.map((testimonial, index) => (
                  <Card key={index} className="p-6">
                    <CardContent className="p-0">
                      <div className="flex items-start gap-4">
                        <img 
                          src={testimonial.image} 
                          alt={testimonial.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-1 mb-2">
                            {[...Array(testimonial.rating)].map((_, i) => (
                              <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            ))}
                          </div>
                          <p className="text-muted-foreground text-sm mb-3">"{testimonial.text}"</p>
                          <div>
                            <p className="font-semibold text-sm">{testimonial.name}</p>
                            <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
            <div className="hidden lg:block"></div>
          </div>
        </div>
      </section>

      {/* Target Audience */}
      <section className="py-16 px-4 bg-background">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div className="max-w-3xl">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8">
                Who We Serve
              </h2>
              <div className="grid gap-6">
                {targetAudience.map((audience, index) => {
                  const IconComponent = audience.icon;
                  return (
                    <div key={index} className="flex gap-4 p-6 bg-card rounded-lg border">
                      <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <IconComponent className="w-6 h-6 text-red-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-foreground mb-2">{audience.title}</h3>
                        <p className="text-muted-foreground text-sm">{audience.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="hidden lg:block"></div>
          </div>
        </div>
      </section>

      {/* Sticky Form Container for Large Screens */}
      <div className="hidden lg:block absolute top-8 right-8 z-50">
        <div className="w-96 sticky top-8">
        <Card className="w-full rounded-xl shadow-2xl bg-background border-2 border-primary">
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold text-foreground mb-2">Got a property to be managed?</h3>
            <p className="text-sm text-muted-foreground mb-4">Just fill up the form & we will take care of the rest</p>

            <form className="space-y-4" onSubmit={e => {
              e.preventDefault();
              const form = e.currentTarget as HTMLFormElement;
              
              if (!form.checkValidity()) {
                form.reportValidity();
                toast({
                  title: "Required Fields Missing",
                  description: "Please fill in all required fields before submitting.",
                  variant: "destructive"
                });
                return;
              }

              toast({
                title: "Request received",
                description: "Our property management expert will contact you shortly."
              });
              form.reset();
            }}>
              <Input id="pm-name" name="name" placeholder="Name" required />

              <div className="flex gap-2">
                <Select defaultValue="+91" name="countryCode">
                  <SelectTrigger className="w-20"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="+91">IN +91</SelectItem>
                    <SelectItem value="+1">US +1</SelectItem>
                    <SelectItem value="+44">UK +44</SelectItem>
                  </SelectContent>
                </Select>
                <Input id="pm-phone" name="phone" type="tel" placeholder="Phone Number" className="flex-1" required />
              </div>

              <Input id="pm-email" name="email" type="email" placeholder="Email ID" required />

              <Select name="propertyType" required>
                <SelectTrigger id="property-type"><SelectValue placeholder="Property Type" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="residential">All Residential</SelectItem>
                  <SelectItem value="flats">Flat/Apartment</SelectItem>
                  <SelectItem value="independent-building">Independent Building/Floor</SelectItem>
                  <SelectItem value="farm-house">Farm House</SelectItem>
                  <SelectItem value="villa">Villa</SelectItem>
                  <SelectItem value="plots">Plots</SelectItem>
                  <SelectItem value="resort">Resort</SelectItem>
                  <SelectItem value="commercial-building">Commercial Building/House</SelectItem>
                  <SelectItem value="agricultural">Agricultural Lands</SelectItem>
                  <SelectItem value="other">Others</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex gap-2">
                <Input id="pm-location" name="location" placeholder="Property Location" className="flex-1" />
                <Select name="managementType" required>
                  <SelectTrigger id="management-type" className="w-40"><SelectValue placeholder="Management Type" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full-management">Full Management</SelectItem>
                    <SelectItem value="tenant-management">Tenant Management</SelectItem>
                    <SelectItem value="maintenance-only">Maintenance Only</SelectItem>
                    <SelectItem value="rent-collection">Rent Collection</SelectItem>
                    <SelectItem value="consultation">Consultation</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2">
                <Select name="country">
                  <SelectTrigger id="pm-country" className="flex-1"><SelectValue placeholder="Country" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="india">India</SelectItem>
                    <SelectItem value="usa">United States</SelectItem>
                    <SelectItem value="uk">United Kingdom</SelectItem>
                    <SelectItem value="canada">Canada</SelectItem>
                    <SelectItem value="australia">Australia</SelectItem>
                  </SelectContent>
                </Select>
                <Select name="state">
                  <SelectTrigger id="pm-state" className="flex-1"><SelectValue placeholder="State" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="andhra-pradesh">Andhra Pradesh</SelectItem>
                    <SelectItem value="karnataka">Karnataka</SelectItem>
                    <SelectItem value="tamil-nadu">Tamil Nadu</SelectItem>
                    <SelectItem value="telangana">Telangana</SelectItem>
                    <SelectItem value="maharashtra">Maharashtra</SelectItem>
                    <SelectItem value="gujarat">Gujarat</SelectItem>
                    <SelectItem value="rajasthan">Rajasthan</SelectItem>
                    <SelectItem value="delhi">Delhi</SelectItem>
                    <SelectItem value="west-bengal">West Bengal</SelectItem>
                    <SelectItem value="uttar-pradesh">Uttar Pradesh</SelectItem>
                  </SelectContent>
                </Select>
                <Select name="city">
                  <SelectTrigger id="pm-city" className="flex-1"><SelectValue placeholder="City" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mumbai">Mumbai</SelectItem>
                    <SelectItem value="delhi">Delhi</SelectItem>
                    <SelectItem value="bangalore">Bangalore</SelectItem>
                    <SelectItem value="pune">Pune</SelectItem>
                    <SelectItem value="hyderabad">Hyderabad</SelectItem>
                    <SelectItem value="chennai">Chennai</SelectItem>
                    <SelectItem value="kolkata">Kolkata</SelectItem>
                    <SelectItem value="ahmedabad">Ahmedabad</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white">Talk to Us Today!</Button>
            </form>
          </CardContent>
        </Card>
        </div>
      </div>

      {/* Mobile Form */}
      <section className="lg:hidden px-4 py-8 bg-background">
        <div className="container mx-auto max-w-xl">
          <Card className="w-full rounded-2xl shadow-xl border-2 border-primary bg-card">
            <CardContent className="p-6 md:p-8">
              <h3 className="text-xl md:text-2xl font-bold text-foreground mb-3">Got a property to be managed?</h3>
              <p className="text-sm md:text-base text-muted-foreground mb-6 md:mb-8">Just fill up the form & we will take care of the rest</p>

              <form className="space-y-5" onSubmit={e => {
                e.preventDefault();
                const form = e.currentTarget as HTMLFormElement;
                
                if (!form.checkValidity()) {
                  form.reportValidity();
                  toast({
                    title: "Required Fields Missing",
                    description: "Please fill in all required fields before submitting.",
                    variant: "destructive"
                  });
                  return;
                }

                toast({
                  title: "Request received",
                  description: "Our property management expert will contact you shortly."
                });
                form.reset();
              }}>
                <Input id="pm-name-mobile" name="name" placeholder="Name" className="h-12 text-base bg-background" required />

                <div className="flex gap-3">
                  <Select defaultValue="+91" name="countryCode">
                    <SelectTrigger className="w-32 h-12 bg-background">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-background border shadow-lg">
                      <SelectItem value="+91">IN +91</SelectItem>
                      <SelectItem value="+1">US +1</SelectItem>
                      <SelectItem value="+44">UK +44</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input id="pm-phone-mobile" name="phone" type="tel" placeholder="Phone Number" className="flex-1 h-12 text-base bg-background" required />
                </div>

                <Input id="pm-email-mobile" name="email" type="email" placeholder="Email ID" className="h-12 text-base bg-background" required />

                <Select name="propertyType" required>
                  <SelectTrigger id="property-type-mobile" className="h-12 bg-background">
                    <SelectValue placeholder="Property Type" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border shadow-lg">
                    <SelectItem value="residential">All Residential</SelectItem>
                    <SelectItem value="flats">Flat/Apartment</SelectItem>
                    <SelectItem value="independent-building">Independent Building/Floor</SelectItem>
                    <SelectItem value="farm-house">Farm House</SelectItem>
                    <SelectItem value="villa">Villa</SelectItem>
                    <SelectItem value="plots">Plots</SelectItem>
                    <SelectItem value="resort">Resort</SelectItem>
                    <SelectItem value="commercial-building">Commercial Building/House</SelectItem>
                    <SelectItem value="agricultural">Agricultural Lands</SelectItem>
                    <SelectItem value="other">Others</SelectItem>
                  </SelectContent>
                </Select>

                <div className="flex gap-3">
                  <Input id="pm-location-mobile" name="location" placeholder="Property Location" className="flex-1 h-12 text-base bg-background" />
                  <Select name="managementType" required>
                    <SelectTrigger id="management-type-mobile" className="w-40 h-12 bg-background">
                      <SelectValue placeholder="Management Type" />
                    </SelectTrigger>
                    <SelectContent className="bg-background border shadow-lg">
                      <SelectItem value="full-management">Full Management</SelectItem>
                      <SelectItem value="tenant-management">Tenant Management</SelectItem>
                      <SelectItem value="maintenance-only">Maintenance Only</SelectItem>
                      <SelectItem value="rent-collection">Rent Collection</SelectItem>
                      <SelectItem value="consultation">Consultation</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-3">
                  <Select name="country">
                    <SelectTrigger id="pm-country-mobile" className="flex-1 h-12 bg-background">
                      <SelectValue placeholder="Country" />
                    </SelectTrigger>
                    <SelectContent className="bg-background border shadow-lg">
                      <SelectItem value="india">India</SelectItem>
                      <SelectItem value="usa">United States</SelectItem>
                      <SelectItem value="uk">United Kingdom</SelectItem>
                      <SelectItem value="canada">Canada</SelectItem>
                      <SelectItem value="australia">Australia</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select name="state">
                    <SelectTrigger id="pm-state-mobile" className="flex-1 h-12 bg-background">
                      <SelectValue placeholder="State" />
                    </SelectTrigger>
                    <SelectContent className="bg-background border shadow-lg">
                      <SelectItem value="andhra-pradesh">Andhra Pradesh</SelectItem>
                      <SelectItem value="karnataka">Karnataka</SelectItem>
                      <SelectItem value="tamil-nadu">Tamil Nadu</SelectItem>
                      <SelectItem value="telangana">Telangana</SelectItem>
                      <SelectItem value="maharashtra">Maharashtra</SelectItem>
                      <SelectItem value="gujarat">Gujarat</SelectItem>
                      <SelectItem value="rajasthan">Rajasthan</SelectItem>
                      <SelectItem value="delhi">Delhi</SelectItem>
                      <SelectItem value="west-bengal">West Bengal</SelectItem>
                      <SelectItem value="uttar-pradesh">Uttar Pradesh</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select name="city">
                    <SelectTrigger id="pm-city-mobile" className="flex-1 h-12 bg-background">
                      <SelectValue placeholder="City" />
                    </SelectTrigger>
                    <SelectContent className="bg-background border shadow-lg">
                      <SelectItem value="mumbai">Mumbai</SelectItem>
                      <SelectItem value="delhi">Delhi</SelectItem>
                      <SelectItem value="bangalore">Bangalore</SelectItem>
                      <SelectItem value="pune">Pune</SelectItem>
                      <SelectItem value="hyderabad">Hyderabad</SelectItem>
                      <SelectItem value="chennai">Chennai</SelectItem>
                      <SelectItem value="kolkata">Kolkata</SelectItem>
                      <SelectItem value="ahmedabad">Ahmedabad</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button type="submit" className="w-full h-12 text-base font-semibold bg-red-600 hover:bg-red-700 text-white mt-6">
                  Talk to Us Today!
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div className="max-w-3xl">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8">
                Frequently Asked Questions
              </h2>
              <Accordion type="single" collapsible className="space-y-4">
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`} className="bg-card border rounded-lg px-6">
                    <AccordionTrigger className="text-left font-semibold text-sm py-4">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground text-sm pb-4">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
            <div className="hidden lg:block"></div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PropertyManagementEmbedded;

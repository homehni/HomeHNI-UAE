import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useToast } from "@/hooks/use-toast";
import { Building2, Users, CreditCard, Calculator, TrendingUp, FileText, MapPin, Crown, Clock, CheckCircle, Shield, Star, X, Plus, Minus, Globe, Shield as ShieldCheck, Headphones, Smartphone, Download, Home, UserCheck, Settings, BarChart3, Wrench } from "lucide-react";
import Marquee from "@/components/Marquee";
import Header from "@/components/Header";

const PropertyManagement = () => {
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
    feature: "24/7 Tenant Support",
    homeHNI: true,
    others: false
  }, {
    feature: "Professional Tenant Screening",
    homeHNI: true,
    others: false
  }, {
    feature: "Guaranteed Rent Collection",
    homeHNI: true,
    others: false
  }, {
    feature: "Emergency Maintenance",
    homeHNI: true,
    others: false
  }, {
    feature: "Legal Documentation",
    homeHNI: true,
    others: false
  }, {
    feature: "Transparent Reporting",
    homeHNI: true,
    others: false
  }, {
    feature: "Market-Rate Optimization",
    homeHNI: true,
    others: false
  }, {
    feature: "Dedicated Property Manager",
    homeHNI: true,
    others: false
  }];

  const testimonials = [{
    name: "Rajesh Sharma",
    role: "Property Owner",
    image: "/lovable-uploads/46a07bb4-9f10-4614-ad52-73dfb2de4f28.png",
    rating: 5,
    text: "My rental income increased by 20% and I don't have to deal with tenant issues anymore!"
  }, {
    name: "Priya Nair",
    role: "NRI Investor",
    image: "/lovable-uploads/5b898e4e-d9b6-4366-b58f-176fc3c8a9c3.png",
    rating: 5,
    text: "Perfect solution for managing my properties from abroad. Completely hassle-free!"
  }, {
    name: "Amit Gupta",
    role: "Real Estate Investor",
    image: "/lovable-uploads/6e6c47cd-700c-49d4-bfee-85a69bb8353f.png",
    rating: 5,
    text: "Professional service with excellent tenant quality. My properties are always occupied."
  }];

  const faqs = [{
    question: "What properties do you manage?",
    answer: "We manage residential and commercial properties including apartments, villas, offices, retail spaces, and warehouses across major Indian cities."
  }, {
    question: "What are your management fees?",
    answer: "Our management fees range from 8-12% of monthly rent depending on property type and services required. We offer transparent pricing with no hidden charges."
  }, {
    question: "How do you screen tenants?",
    answer: "We conduct comprehensive background checks including credit history, employment verification, reference checks, and police verification to ensure quality tenants."
  }, {
    question: "How do you handle maintenance issues?",
    answer: "We have a network of verified vendors and provide 24/7 emergency support. All maintenance is coordinated promptly with owner approval for major repairs."
  }, {
    question: "How often do you provide reports?",
    answer: "Monthly financial reports are provided with rent collection status, expenses, maintenance updates, and property performance metrics."
  }];

  const { toast } = useToast();

  useEffect(() => {
    const title = "Property Management Services | Home HNI";
    document.title = title;
    const desc = "Professional property management services for residential and commercial properties. Tenant management, rent collection, and maintenance solutions.";
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
    canonical.setAttribute('href', window.location.origin + '/property-management');
  }, []);

  return (
    <div className="min-h-screen">
      <Marquee />
      <Header />
      
      {/* Hero Section */}
      <section className="relative pt-28 md:pt-32 pb-20 md:pb-32 px-4 md:px-8 text-white overflow-hidden bg-cover bg-center bg-no-repeat" style={{
        backgroundImage: "url('/lovable-uploads/fbb0d72f-782e-49f5-bbe1-8afc1314b5f7.png')"
      }}>
        <div className="absolute inset-0 bg-red-900/80 pointer-events-none" />

        <div className="relative z-10 container mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 items-start">
            {/* Left: Copy */}
            <div className="max-w-2xl">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
                Professional Property Management
                <br className="hidden md:block" />
                <span className="block">Services You Can Trust</span>
              </h1>
              <p className="text-lg md:text-xl text-white/90 mb-6">
                Maximize your rental income with our comprehensive property management
                solutions. From tenant screening to maintenance, we handle it all.
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
                description: "Our property management expert will contact you shortly."
              });
              (e.currentTarget as HTMLFormElement).reset();
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

              <Input id="pm-email" name="email" type="email" placeholder="Email ID" />

              <Select name="city">
                <SelectTrigger id="pm-city"><SelectValue placeholder="City" /></SelectTrigger>
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

              <Button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white">Talk to Us Today!</Button>
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
                  description: "Our property management expert will contact you shortly."
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
                      <SelectItem value="+91">IN +91</SelectItem>
                      <SelectItem value="+1">US +1</SelectItem>
                      <SelectItem value="+44">UK +44</SelectItem>
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

                <Button type="submit" className="w-full h-12 text-base font-semibold bg-red-600 hover:bg-red-700 text-white mt-6">
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
                Why choose our property management services?
              </h2>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                    <Headphones className="w-5 h-5 text-red-600" />
                  </div>
                  <h3 className="text-base font-semibold text-foreground">
                    24/7 Support
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Round-the-clock support for tenants and property owners
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                    <UserCheck className="w-5 h-5 text-red-600" />
                  </div>
                  <h3 className="text-base font-semibold text-foreground">
                    Professional Tenant Screening
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Comprehensive background checks and verification process
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                    <BarChart3 className="w-5 h-5 text-red-600" />
                  </div>
                  <h3 className="text-base font-semibold text-foreground">
                    Transparent Reporting
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Monthly financial reports with detailed income and expense tracking
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                    <Shield className="w-5 h-5 text-red-600" />
                  </div>
                  <h3 className="text-base font-semibold text-foreground">
                    Legal Protection
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Complete legal documentation and compliance support
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-red-600" />
                  </div>
                  <h3 className="text-base font-semibold text-foreground">
                    Market-Rate Optimization
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Regular market analysis to optimize rental rates and maximize income
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                    <Settings className="w-5 h-5 text-red-600" />
                  </div>
                  <h3 className="text-base font-semibold text-foreground">
                    Hassle-Free Management
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Complete property management with minimal owner involvement
                  </p>
                </div>
              </div>
            </div>
            
            {/* Right side spacing for sticky form */}
            <div className="hidden lg:block"></div>
          </div>
        </div>
      </section>

      {/* Property Management Info Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div className="max-w-3xl">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8">
                Comprehensive Property Management Solutions
              </h2>
              <div className="text-muted-foreground space-y-4 text-sm leading-relaxed">
                <p>
                  Whether you own a single rental property or a diverse real estate portfolio, our comprehensive 
                  property management services are designed to maximize your investment returns while minimizing 
                  your day-to-day involvement. With professional tenant management and transparent reporting, we 
                  ensure your properties are well-maintained and profitable.
                </p>
                <p>
                  Our experienced team handles everything from tenant screening and rent collection to maintenance 
                  coordination and legal compliance. We use advanced technology and proven processes to deliver 
                  exceptional results for property owners across India.
                </p>
                <p>
                  For NRI property owners, we provide specialized services that allow you to manage your Indian 
                  real estate investments remotely with complete peace of mind. Our transparent reporting and 
                  communication keep you informed about your property performance at all times.
                </p>
              </div>
            </div>
            
            {/* Right side spacing for sticky form */}
            <div className="hidden lg:block"></div>
          </div>
        </div>
      </section>

      {/* Our Property Management Services */}
      <section className="py-16 px-4 bg-background">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div className="max-w-3xl">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8">
                Our Property Management Services
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {services.map((service, index) => {
                  const IconComponent = service.icon;
                  return (
                    <Card key={index} className="p-6 bg-card border hover:shadow-lg transition-shadow">
                      <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                        <IconComponent className="w-6 h-6 text-red-600" />
                      </div>
                      <h3 className="text-lg font-semibold text-foreground mb-2">{service.title}</h3>
                      <p className="text-sm text-muted-foreground">{service.description}</p>
                    </Card>
                  );
                })}
              </div>
            </div>
            
            {/* Right side spacing for sticky form */}
            <div className="hidden lg:block"></div>
          </div>
        </div>
      </section>

      {/* Trusted by Thousands Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-12">
            Trusted by Thousands
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-red-600 mb-2">5000+</div>
              <div className="text-sm text-muted-foreground">Properties Managed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-red-600 mb-2">₹50Cr+</div>
              <div className="text-sm text-muted-foreground">Monthly Rent Collected</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-red-600 mb-2">98%</div>
              <div className="text-sm text-muted-foreground">Client Satisfaction</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-red-600 mb-2">10+</div>
              <div className="text-sm text-muted-foreground">Years Experience</div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Home HNI is Better - Comparison Table */}
      <section className="py-16 px-4 bg-background">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div className="max-w-3xl">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8">
                Why Home HNI is Better
              </h2>
              
              <div className="bg-card rounded-xl p-6 shadow-lg border">
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-sm font-medium text-muted-foreground">Features</div>
                  <div className="text-sm font-medium text-center text-red-600">Home HNI</div>
                  <div className="text-sm font-medium text-center text-muted-foreground">Others</div>
                </div>
                
                {comparisonData.map((item, index) => (
                  <div key={index} className="grid grid-cols-3 gap-4 py-3 border-t border-border">
                    <div className="text-sm text-foreground">{item.feature}</div>
                    <div className="text-center">
                      {item.homeHNI ? (
                        <CheckCircle className="w-5 h-5 text-green-600 mx-auto" />
                      ) : (
                        <X className="w-5 h-5 text-red-500 mx-auto" />
                      )}
                    </div>
                    <div className="text-center">
                      {item.others ? (
                        <CheckCircle className="w-5 h-5 text-green-600 mx-auto" />
                      ) : (
                        <X className="w-5 h-5 text-red-500 mx-auto" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Right side spacing for sticky form */}
            <div className="hidden lg:block"></div>
          </div>
        </div>
      </section>

      {/* Customer Testimonials */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div className="max-w-3xl">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8">
                What Our Clients Say
              </h2>
              
              <div className="space-y-6">
                {testimonials.map((testimonial, index) => (
                  <Card key={index} className="p-6 bg-card border">
                    <div className="flex items-start gap-4">
                      <img 
                        src={testimonial.image} 
                        alt={testimonial.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold text-foreground">{testimonial.name}</h4>
                          <span className="text-sm text-muted-foreground">•</span>
                          <span className="text-sm text-muted-foreground">{testimonial.role}</span>
                        </div>
                        <div className="flex items-center gap-1 mb-2">
                          {Array.from({ length: testimonial.rating }).map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                        <p className="text-sm text-muted-foreground">{testimonial.text}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
            
            {/* Right side spacing for sticky form */}
            <div className="hidden lg:block"></div>
          </div>
        </div>
      </section>

      {/* Service Tags */}
      <section className="py-16 px-4 bg-background">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div className="max-w-3xl">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8">
                Property Management Services
              </h2>
              
              <div className="flex flex-wrap gap-3">
                {[
                  "Tenant Management", "Rent Collection", "Property Maintenance", "Legal Compliance",
                  "Marketing & Leasing", "Financial Reporting", "Background Verification", "Tenant Screening",
                  "Emergency Support", "Vendor Management", "Property Inspection", "Market Analysis",
                  "NRI Services", "Commercial Properties", "Residential Properties", "Portfolio Management"
                ].map((tag, index) => (
                  <span key={index} className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            
            {/* Right side spacing for sticky form */}
            <div className="hidden lg:block"></div>
          </div>
        </div>
      </section>

      {/* Who We Serve */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div className="max-w-3xl">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8">
                Who We Serve
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {targetAudience.map((audience, index) => {
                  const IconComponent = audience.icon;
                  return (
                    <Card key={index} className="p-6 bg-card border text-center hover:shadow-lg transition-shadow">
                      <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                        <IconComponent className="w-6 h-6 text-red-600" />
                      </div>
                      <h3 className="text-lg font-semibold text-foreground mb-2">{audience.title}</h3>
                      <p className="text-sm text-muted-foreground">{audience.description}</p>
                    </Card>
                  );
                })}
              </div>
            </div>
            
            {/* Right side spacing for sticky form */}
            <div className="hidden lg:block"></div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 bg-background">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div className="max-w-3xl">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8">
                Frequently Asked Questions
              </h2>
              
              <Accordion type="single" collapsible className="space-y-4">
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`} className="border border-border rounded-lg px-6">
                    <AccordionTrigger className="text-left text-foreground hover:no-underline">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
            
            {/* Right side spacing for sticky form */}
            <div className="hidden lg:block"></div>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-16 px-4 bg-red-600">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Maximize Your Property Returns?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied property owners who trust us with their valuable investments.
          </p>
          <Button 
            size="lg" 
            className="bg-white text-red-600 hover:bg-gray-100 font-semibold px-8 py-3 text-lg"
            onClick={() => document.getElementById('pm-name')?.focus()}
          >
            Get Started Today
          </Button>
        </div>
      </section>
    </div>
  );
};

export default PropertyManagement;
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useToast } from "@/hooks/use-toast";
import { Truck, Package, Shield, Clock, CheckCircle, Star, Users, Building2, Home, Car, Award, Headphones, Globe, TrendingUp, FileText, X, Plus, Minus } from "lucide-react";
import Marquee from "@/components/Marquee";
import Header from "@/components/Header";

const PackersMovers = () => {
  const services = [{
    icon: Home,
    title: "Home Shifting",
    description: "Complete household goods relocation with professional packing."
  }, {
    icon: Building2,
    title: "Office Relocation",
    description: "Business relocation services with minimal downtime."
  }, {
    icon: Truck,
    title: "Interstate Moving",
    description: "Long distance moving with real-time tracking."
  }, {
    icon: Package,
    title: "Packing Services",
    description: "Professional packing with quality materials."
  }, {
    icon: Car,
    title: "Vehicle Transportation",
    description: "Safe car and bike transportation services."
  }, {
    icon: Shield,
    title: "Insurance Coverage",
    description: "Comprehensive insurance for peace of mind."
  }];

  const targetAudience = [{
    icon: Home,
    title: "Homeowners",
    description: "Families relocating to new homes"
  }, {
    icon: Building2,
    title: "Corporate Clients", 
    description: "Businesses requiring office relocation"
  }, {
    icon: Users,
    title: "Students & Professionals",
    description: "Individual relocations for work or study"
  }];

  const comparisonData = [{
    feature: "Professional Packing Team",
    homeHNI: true,
    others: false
  }, {
    feature: "Real-time Tracking",
    homeHNI: true,
    others: false
  }, {
    feature: "Insurance Coverage",
    homeHNI: true,
    others: false
  }, {
    feature: "On-time Delivery Guarantee",
    homeHNI: true,
    others: false
  }, {
    feature: "Quality Packing Materials",
    homeHNI: true,
    others: false
  }, {
    feature: "24/7 Customer Support",
    homeHNI: true,
    others: false
  }, {
    feature: "Affordable Pricing",
    homeHNI: true,
    others: false
  }, {
    feature: "Damage Protection",
    homeHNI: true,
    others: false
  }];

  const testimonials = [{
    name: "Priya Sharma",
    role: "Homeowner",
    image: "/lovable-uploads/46a07bb4-9f10-4614-ad52-73dfb2de4f28.png",
    rating: 5,
    text: "Excellent service! They moved my entire household without any damage. Highly professional team."
  }, {
    name: "Rajesh Kumar",
    role: "Business Owner",
    image: "/lovable-uploads/5b898e4e-d9b6-4366-b58f-176fc3c8a9c3.png",
    rating: 5,
    text: "Office relocation was smooth and completed on time. No business disruption at all!"
  }, {
    name: "Anita Gupta",
    role: "Working Professional",
    image: "/lovable-uploads/6e6c47cd-700c-49d4-bfee-85a69bb8353f.png",
    rating: 5,
    text: "Interstate move from Delhi to Bangalore was handled perfectly. Great value for money!"
  }];

  const faqs = [{
    question: "What types of moving services do you offer?",
    answer: "We offer home shifting, office relocation, interstate moving, packing services, vehicle transportation, and specialized moving for fragile items."
  }, {
    question: "How do you ensure the safety of my belongings?",
    answer: "We use high-quality packing materials, trained professionals, and provide comprehensive insurance coverage for complete protection of your belongings."
  }, {
    question: "How much time does the moving process take?",
    answer: "Local moves typically take 4-8 hours, while interstate moves can take 2-5 days depending on the distance and volume of goods."
  }, {
    question: "Do you provide packing materials?",
    answer: "Yes, we provide all necessary packing materials including boxes, bubble wrap, packing tape, and protective covers as part of our service."
  }, {
    question: "Is insurance included in the moving cost?",
    answer: "Basic insurance coverage is included. We also offer comprehensive insurance plans for high-value items at nominal additional cost."
  }];

  const { toast } = useToast();

  useEffect(() => {
    const title = "Packers and Movers Services | Home HNI";
    document.title = title;
    const desc = "Professional packers and movers for home shifting, office relocation, and interstate moving with insurance coverage and guaranteed on-time delivery.";
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
    canonical.setAttribute('href', window.location.origin + '/packers-movers');
  }, []);

  return (
    <div className="min-h-screen">
      <Marquee />
      <Header />
      
      {/* Hero Section */}
      <section className="relative pt-32 md:pt-40 pb-32 md:pb-40 px-4 md:px-8 text-white overflow-hidden bg-cover bg-center bg-no-repeat" style={{
        backgroundImage: "url('/src/assets/packers-movers-hero.jpg')"
      }}>
        <div className="absolute inset-0 bg-red-900/80 pointer-events-none" />

        <div className="relative z-10 container mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 items-start">
            {/* Left: Copy */}
            <div className="max-w-2xl">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
                Professional Packers & Movers
                <br className="hidden md:block" />
                <span className="block">for Hassle-free Relocation</span>
              </h1>
              <p className="text-lg md:text-xl text-white/90 mb-6">
                Trusted moving services with professional packing, on-time delivery,
                and comprehensive insurance coverage for your peace of mind.
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
            <h3 className="text-xl font-semibold text-foreground mb-2">Need moving services?</h3>
            <p className="text-sm text-muted-foreground mb-4">Fill the form & get instant quote</p>

            <form className="space-y-4" onSubmit={e => {
              e.preventDefault();
              toast({
                title: "Quote request received",
                description: "Our moving expert will contact you shortly."
              });
              (e.currentTarget as HTMLFormElement).reset();
            }}>
              <Input id="moving-name" name="name" placeholder="Name" required />

              <div className="flex gap-2">
                <Select defaultValue="+91" name="countryCode">
                  <SelectTrigger className="w-28"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="+91">🇮🇳 +91</SelectItem>
                    <SelectItem value="+1">🇺🇸 +1</SelectItem>
                    <SelectItem value="+44">🇬🇧 +44</SelectItem>
                  </SelectContent>
                </Select>
                <Input id="moving-phone" name="phone" type="tel" placeholder="Phone Number" className="flex-1" required />
              </div>

              <Input id="moving-email" name="email" type="email" placeholder="Email ID" />

              <div className="flex gap-2">
                <Input id="moving-from" name="movingFrom" placeholder="Moving From (City)" className="flex-1" required />
                <Input id="moving-to" name="movingTo" placeholder="Moving To (City)" className="flex-1" required />
              </div>

              <div className="flex gap-2">
                <Select name="serviceType">
                  <SelectTrigger id="service-type" className="flex-1"><SelectValue placeholder="Service Type" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="home-shifting">Home Shifting</SelectItem>
                    <SelectItem value="office-relocation">Office Relocation</SelectItem>
                    <SelectItem value="interstate-moving">Interstate Moving</SelectItem>
                    <SelectItem value="packing-services">Packing Services</SelectItem>
                    <SelectItem value="vehicle-transport">Vehicle Transportation</SelectItem>
                  </SelectContent>
                </Select>
                <Input id="moving-date" name="movingDate" type="date" placeholder="Preferred Moving Date" className="flex-1" />
              </div>

              <Button type="submit" className="w-full">Get Free Quote!</Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Mobile Form - Static below hero */}
      <section className="lg:hidden px-4 py-8 bg-background">
        <div className="container mx-auto max-w-xl px-4">
          <Card className="w-full rounded-2xl shadow-xl border-0 bg-card">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-foreground mb-3">Need moving services?</h3>
              <p className="text-base text-muted-foreground mb-8">Fill the form & get instant quote</p>

              <form className="space-y-5" onSubmit={e => {
                e.preventDefault();
                toast({
                  title: "Quote request received",
                  description: "Our moving expert will contact you shortly."
                });
                (e.currentTarget as HTMLFormElement).reset();
              }}>
                <Input 
                  id="moving-name-mobile" 
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
                    id="moving-phone-mobile" 
                    name="phone" 
                    type="tel" 
                    placeholder="Phone Number" 
                    className="flex-1 h-12 text-base bg-background" 
                    required 
                  />
                </div>

                <Input 
                  id="moving-email-mobile" 
                  name="email" 
                  type="email" 
                  placeholder="Email ID" 
                  className="h-12 text-base bg-background"
                />

                <div className="flex gap-3">
                  <Input 
                    id="moving-from-mobile" 
                    name="movingFrom" 
                    placeholder="Moving From (City)" 
                    className="flex-1 h-12 text-base bg-background"
                    required 
                  />
                  <Input 
                    id="moving-to-mobile" 
                    name="movingTo" 
                    placeholder="Moving To (City)" 
                    className="flex-1 h-12 text-base bg-background"
                    required 
                  />
                </div>

                <div className="flex gap-3">
                  <Select name="serviceType">
                    <SelectTrigger id="service-type-mobile" className="flex-1 h-12 bg-background">
                      <SelectValue placeholder="Service Type" />
                    </SelectTrigger>
                    <SelectContent className="bg-background border shadow-lg">
                      <SelectItem value="home-shifting">Home Shifting</SelectItem>
                      <SelectItem value="office-relocation">Office Relocation</SelectItem>
                      <SelectItem value="interstate-moving">Interstate Moving</SelectItem>
                      <SelectItem value="packing-services">Packing Services</SelectItem>
                      <SelectItem value="vehicle-transport">Vehicle Transportation</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input 
                    id="moving-date-mobile" 
                    name="movingDate" 
                    type="date" 
                    placeholder="Preferred Moving Date" 
                    className="flex-1 h-12 text-base bg-background"
                  />
                </div>

                <Button type="submit" className="w-full h-12 text-base font-semibold bg-red-600 hover:bg-red-700 text-white mt-6">
                  Get Free Quote!
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
            <div className="max-w-3xl">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8">
                Why choose our packing & moving services?
              </h2>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                    <Package className="w-5 h-5 text-red-600" />
                  </div>
                  <h3 className="text-base font-semibold text-foreground">
                    Professional Packing
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Expert packing with high-quality materials for maximum protection
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-red-600" />
                  </div>
                  <h3 className="text-base font-semibold text-foreground">
                    Trained Moving Team
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Experienced professionals trained in safe handling and transportation
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                    <Shield className="w-5 h-5 text-red-600" />
                  </div>
                  <h3 className="text-base font-semibold text-foreground">
                    Insurance Coverage
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Comprehensive insurance protection for your valuable belongings
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                    <Clock className="w-5 h-5 text-red-600" />
                  </div>
                  <h3 className="text-base font-semibold text-foreground">
                    On-Time Delivery
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Guaranteed timely delivery with real-time tracking updates
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-red-600" />
                  </div>
                  <h3 className="text-base font-semibold text-foreground">
                    Affordable Pricing
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Competitive rates with no hidden charges or extra fees
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                    <Headphones className="w-5 h-5 text-red-600" />
                  </div>
                  <h3 className="text-base font-semibold text-foreground">
                    24/7 Support
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Round-the-clock customer support for all your queries
                  </p>
                </div>
              </div>
            </div>
            
            {/* Right side spacing for sticky form */}
            <div className="hidden lg:block"></div>
          </div>
        </div>
      </section>

      {/* Moving Services Info Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div className="max-w-3xl">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8">
                Comprehensive Moving Solutions
              </h2>
              <div className="text-muted-foreground space-y-4 text-sm leading-relaxed">
                <p>
                  Whether you're relocating your home, shifting your office, or moving to a different city, 
                  our comprehensive packing and moving solutions are designed to make your relocation 
                  stress-free and seamless. With a team of trained professionals and state-of-the-art equipment, 
                  we ensure the safe transportation of your belongings.
                </p>
                <p>
                  Our services include professional packing using high-quality materials, secure loading 
                  and unloading, real-time tracking, and comprehensive insurance coverage. We understand 
                  that every move is unique, which is why we offer customized solutions tailored to your 
                  specific requirements and budget.
                </p>
                <p>
                  From local household shifting to interstate office relocations, vehicle transportation 
                  to storage solutions, we have the expertise and infrastructure to handle moves of any 
                  size and complexity. Our commitment to excellence and customer satisfaction has made 
                  us a trusted choice for thousands of families and businesses across India.
                </p>
              </div>
            </div>
            
            {/* Right side spacing for sticky form */}
            <div className="hidden lg:block"></div>
          </div>
        </div>
      </section>

      {/* Our Moving Services */}
      <section className="py-16 px-4 bg-background">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div className="max-w-3xl">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8">
                Our Packing & Moving Services
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
            
            {/* Right side spacing for sticky form */}
            <div className="hidden lg:block"></div>
          </div>
        </div>
      </section>

      {/* Trusted by Thousands */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div className="max-w-3xl">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8">
                Trusted by Thousands
              </h2>
              <div className="grid grid-cols-2 gap-8">
                <div className="text-center">
                  <div className="text-4xl md:text-5xl font-bold text-red-600 mb-2">10,000+</div>
                  <p className="text-muted-foreground">Successful Moves</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl md:text-5xl font-bold text-red-600 mb-2">50,000+</div>
                  <p className="text-muted-foreground">Happy Customers</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl md:text-5xl font-bold text-red-600 mb-2">100+</div>
                  <p className="text-muted-foreground">Cities Covered</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl md:text-5xl font-bold text-red-600 mb-2">4.8★</div>
                  <p className="text-muted-foreground">Service Rating</p>
                </div>
              </div>
            </div>
            
            {/* Right side spacing for sticky form */}
            <div className="hidden lg:block"></div>
          </div>
        </div>
      </section>

      {/* Why Home HNI is Better */}
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
            
            {/* Right side spacing for sticky form */}
            <div className="hidden lg:block"></div>
          </div>
        </div>
      </section>

      {/* Who We Serve */}
      <section className="py-16 px-4 bg-background">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Who We Serve
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our moving services cater to diverse relocation needs across different customer segments
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {targetAudience.map((audience, index) => (
              <div key={index} className="text-center p-6 bg-card rounded-lg border border-border">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <audience.icon className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{audience.title}</h3>
                <p className="text-muted-foreground">{audience.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-3xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-muted-foreground">
              Get answers to common questions about our packing and moving services
            </p>
          </div>

          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="bg-card border border-border rounded-lg px-6">
                <AccordionTrigger className="text-left font-semibold text-foreground hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Service Tags */}
      <section className="py-12 px-4 bg-background border-t border-border">
        <div className="container mx-auto">
          <div className="text-center mb-8">
            <h3 className="text-xl font-semibold text-foreground mb-4">Our Services</h3>
            <div className="flex flex-wrap justify-center gap-2 max-w-4xl mx-auto">
              {[
                "Packers and Movers", "Home Shifting", "Office Relocation", "Interstate Moving",
                "Local Moving", "Packing Services", "Vehicle Transportation", "Household Shifting",
                "Corporate Relocation", "Furniture Moving", "Bike Transportation", "Car Transportation",
                "Safe Moving", "Professional Packers", "Moving Company", "Relocation Services",
                "Storage Solutions", "Unpacking Services", "Moving Insurance", "Affordable Moving"
              ].map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-muted text-muted-foreground text-sm rounded-full border border-border"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PackersMovers;
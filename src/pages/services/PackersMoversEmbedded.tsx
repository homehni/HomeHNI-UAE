import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useToast } from "@/hooks/use-toast";
import { Truck, Package, Shield, Clock, CheckCircle, Star, Users, Building2, Home, Car, Award, Headphones, Globe, TrendingUp, FileText, X, Plus, Minus } from "lucide-react";

const PackersMoversEmbedded = () => {
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
    feature: "Door-to-Door Service",
    homeHNI: true,
    others: false
  }, {
    feature: "Transparent Pricing",
    homeHNI: true,
    others: false
  }, {
    feature: "Quality Materials",
    homeHNI: true,
    others: false
  }, {
    feature: "24/7 Support",
    homeHNI: true,
    others: false
  }, {
    feature: "Damage Protection",
    homeHNI: true,
    others: false
  }];

  const testimonials = [{
    name: "Sunita Reddy",
    role: "Homeowner",
    image: "/lovable-uploads/46a07bb4-9f10-4614-ad52-73dfb2de4f28.png",
    rating: 5,
    text: "Excellent service! They packed everything carefully and delivered on time. Highly recommend for home shifting."
  }, {
    name: "Vikram Singh",
    role: "Business Owner",
    image: "/lovable-uploads/5b898e4e-d9b6-4366-b58f-176fc3c8a9c3.png",
    rating: 5,
    text: "Professional office relocation service. Minimal downtime and everything arrived safely. Great team!"
  }, {
    name: "Priya Sharma",
    role: "Student",
    image: "/lovable-uploads/6e6c47cd-700c-49d4-bfee-85a69bb8353f.png",
    rating: 5,
    text: "Affordable and reliable service for my interstate move. Real-time tracking was very helpful."
  }];

  const faqs = [{
    question: "What services do you offer?",
    answer: "We offer home shifting, office relocation, interstate moving, packing services, vehicle transportation, and comprehensive insurance coverage for all your moving needs."
  }, {
    question: "Do you provide packing materials?",
    answer: "Yes, we provide all necessary packing materials including boxes, bubble wrap, packing paper, and protective covers at no extra cost."
  }, {
    question: "Is my belongings insured during transit?",
    answer: "Yes, all shipments are covered under comprehensive insurance. We provide full protection against damage or loss during transit."
  }, {
    question: "Can I track my shipment?",
    answer: "Absolutely! We provide real-time tracking so you can monitor your shipment's progress throughout the journey."
  }, {
    question: "What is your service area?",
    answer: "We provide services across all major cities in India and also handle international relocations. Contact us for specific location details."
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
                Professional Packers & Movers
                <br className="hidden md:block" />
                <span className="block">for Safe & Reliable Relocation</span>
              </h1>
              <p className="text-lg md:text-xl text-white/90 mb-6">
                Complete packing and moving services with professional handling, 
                real-time tracking, and comprehensive insurance coverage.
              </p>
            </div>
            <div className="hidden lg:block lg:justify-self-end">
              <div className="w-full max-w-md h-80"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Sticky Form Container for Large Screens */}
      <div className="hidden lg:block fixed top-32 right-8 z-40">
        <div className="w-96 sticky top-32">
        <Card className="w-full rounded-xl shadow-2xl bg-background border-2 border-primary">
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold text-foreground mb-2 text-uniform-center">Need Moving Services?</h3>
            <p className="text-sm text-muted-foreground mb-4 text-uniform-center">Get free quote & consultation</p>

            <form className="space-y-4" onSubmit={e => {
              e.preventDefault();
              const form = e.currentTarget as HTMLFormElement;
              if (!form.checkValidity()) {
                form.reportValidity();
                toast({
                  title: "Required Fields Missing",
                  description: "Please fill in all required fields before submitting your moving request.",
                  variant: "destructive"
                });
                return;
              }
              toast({
                title: "Request received",
                description: "Our moving expert will contact you shortly."
              });
              form.reset();
            }}>
              <Input id="mover-name" name="name" placeholder="Name" required />

              <div className="flex gap-2">
                <Select defaultValue="+91" name="countryCode">
                  <SelectTrigger className="w-28"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="+91">🇮🇳 +91</SelectItem>
                    <SelectItem value="+1">🇺🇸 +1</SelectItem>
                    <SelectItem value="+44">🇬🇧 +44</SelectItem>
                  </SelectContent>
                </Select>
                <Input id="mover-phone" name="phone" type="tel" placeholder="Phone Number" className="flex-1" required />
              </div>

              <div className="flex gap-2">
                <Select defaultValue="India" name="country">
                  <SelectTrigger className="flex-1"><SelectValue placeholder="Country" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="India">India</SelectItem>
                    <SelectItem value="USA">USA</SelectItem>
                    <SelectItem value="UK">UK</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>

                <Select name="serviceType" required>
                  <SelectTrigger className="flex-1"><SelectValue placeholder="Service Type" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="home-shifting">Home Shifting</SelectItem>
                    <SelectItem value="office-relocation">Office Relocation</SelectItem>
                    <SelectItem value="interstate-moving">Interstate Moving</SelectItem>
                    <SelectItem value="packing-services">Packing Services</SelectItem>
                    <SelectItem value="vehicle-transport">Vehicle Transport</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button type="submit" className="w-full">Get Free Moving Quote</Button>
            </form>
          </CardContent>
        </Card>
        </div>
      </div>

      {/* Mobile Form */}
      <section className="lg:hidden px-4 py-8 bg-background">
        <div className="container mx-auto max-w-xl px-4">
          <Card className="w-full rounded-2xl shadow-xl border-2 border-primary bg-card">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-foreground mb-3 text-uniform-center">Need Moving Services?</h3>
              <p className="text-base text-muted-foreground mb-8 text-uniform-center">Get free quote & consultation</p>

              <form className="space-y-5" onSubmit={e => {
                e.preventDefault();
                const form = e.currentTarget as HTMLFormElement;
                if (!form.checkValidity()) {
                  form.reportValidity();
                  toast({
                    title: "Required Fields Missing",
                    description: "Please fill in all required fields before submitting your moving request.",
                    variant: "destructive"
                  });
                  return;
                }
                toast({
                  title: "Request received",
                  description: "Our moving expert will contact you shortly."
                });
                form.reset();
              }}>
                <Input 
                  id="mover-name-mobile" 
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
                    id="mover-phone-mobile" 
                    name="phone" 
                    type="tel" 
                    placeholder="Phone Number" 
                    className="flex-1 h-12 text-base bg-background" 
                    required 
                  />
                </div>

                <Select name="serviceType" required>
                  <SelectTrigger className="h-12 bg-background">
                    <SelectValue placeholder="Service Type" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border shadow-lg">
                    <SelectItem value="home-shifting">Home Shifting</SelectItem>
                    <SelectItem value="office-relocation">Office Relocation</SelectItem>
                    <SelectItem value="interstate-moving">Interstate Moving</SelectItem>
                    <SelectItem value="packing-services">Packing Services</SelectItem>
                    <SelectItem value="vehicle-transport">Vehicle Transport</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>

                <Button type="submit" className="w-full h-12 text-base font-semibold">Get Free Moving Quote</Button>
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
                Our Moving Services
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
                  <div className="text-4xl md:text-5xl font-bold text-red-600 mb-2">10K+</div>
                  <p className="text-muted-foreground">Successful Moves</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl md:text-5xl font-bold text-red-600 mb-2">500+</div>
                  <p className="text-muted-foreground">Cities Covered</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl md:text-5xl font-bold text-red-600 mb-2">24/7</div>
                  <p className="text-muted-foreground">Support Team</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl md:text-5xl font-bold text-red-600 mb-2">99%</div>
                  <p className="text-muted-foreground">Customer Satisfaction</p>
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

export default PackersMoversEmbedded;

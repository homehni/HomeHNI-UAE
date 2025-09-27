import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useToast } from "@/hooks/use-toast";
import { Building2, Users, CreditCard, Calculator, TrendingUp, FileText, MapPin, Crown, Clock, CheckCircle, Shield, Star, X, Plus, Minus, Globe, Shield as ShieldCheck, Headphones, Smartphone, Download, Home, UserCheck, Settings, BarChart3, Wrench } from "lucide-react";

const PropertyManagementEmbedded = () => {
  // Major cities in India
  const majorCities = [
    "Mumbai", "Delhi", "Bangalore", "Hyderabad", "Ahmedabad", "Chennai", "Kolkata", "Surat", "Pune", "Jaipur",
    "Lucknow", "Kanpur", "Nagpur", "Indore", "Thane", "Bhopal", "Visakhapatnam", "Pimpri-Chinchwad", "Patna", "Vadodara",
    "Ghaziabad", "Ludhiana", "Agra", "Nashik", "Faridabad", "Meerut", "Rajkot", "Kalyan-Dombivli", "Vasai-Virar", "Varanasi",
    "Srinagar", "Aurangabad", "Dhanbad", "Amritsar", "Navi Mumbai", "Allahabad", "Ranchi", "Howrah", "Coimbatore", "Jabalpur",
    "Gwalior", "Vijayawada", "Jodhpur", "Madurai", "Raipur", "Kota", "Guwahati", "Chandigarh", "Solapur", "Hubli-Dharwad"
  ];

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
    feature: "Legal Documentation",
    homeHNI: true,
    others: false
  }, {
    feature: "Monthly Financial Reports",
    homeHNI: true,
    others: false
  }, {
    feature: "Digital Property Management",
    homeHNI: true,
    others: false
  }, {
    feature: "Transparent Pricing",
    homeHNI: true,
    others: false
  }, {
    feature: "Owner Dashboard Access",
    homeHNI: true,
    others: false
  }];

  const testimonials = [{
    name: "Rajesh Sharma",
    role: "Property Owner",
    image: "/lovable-uploads/46a07bb4-9f10-4614-ad52-73dfb2de4f28.png",
    rating: 5,
    text: "Excellent property management! They handle everything from tenant screening to maintenance. Hassle-free rental income."
  }, {
    name: "Priya Nair",
    role: "NRI Investor",
    image: "/lovable-uploads/5b898e4e-d9b6-4366-b58f-176fc3c8a9c3.png",
    rating: 5,
    text: "Perfect for NRIs like me. I can manage my India properties remotely with their digital platform. Great service!"
  }, {
    name: "Amit Patel",
    role: "Real Estate Investor",
    image: "/lovable-uploads/6e6c47cd-700c-49d4-bfee-85a69bb8353f.png",
    rating: 5,
    text: "Professional team managing my 5 properties. Regular reports and timely rent collection. Highly recommended!"
  }];

  const faqs = [{
    question: "What services are included in property management?",
    answer: "Our comprehensive property management includes tenant screening, rent collection, property maintenance, legal compliance, marketing, financial reporting, and 24/7 support. We handle everything from finding tenants to property maintenance."
  }, {
    question: "How do you screen potential tenants?",
    answer: "We conduct thorough background checks including employment verification, credit history, previous landlord references, and police verification. Only pre-qualified, reliable tenants are selected for your property."
  }, {
    question: "How is rent collection handled?",
    answer: "We use automated systems for rent collection with multiple payment options. Late payment follow-ups are handled professionally, and you receive regular financial reports with complete transparency."
  }, {
    question: "Do you handle property maintenance issues?",
    answer: "Yes, we have a network of certified vendors and provide 24/7 maintenance coordination. All maintenance requests are handled promptly with prior approval for expenses above agreed limits."
  }, {
    question: "What reports do property owners receive?",
    answer: "Property owners receive detailed monthly reports including rent collection status, maintenance expenses, occupancy rates, market analysis, and financial statements. Everything is available through our online owner portal."
  }];

  const [formMessage, setFormMessage] = useState<{ type: 'success' | 'error' | null; text: string }>({ type: null, text: '' });
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
            {/* Left: Copy */}
            <div className="max-w-2xl">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
                Professional Property Management Services
                <br className="hidden md:block" />
                <span className="block">for Hassle-Free Rentals</span>
              </h1>
              <p className="text-lg md:text-xl text-white/90 mb-6">
                Complete property management solution including tenant screening, rent collection, 
                maintenance, and financial reporting.
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
      <div className="hidden lg:block absolute top-8 right-8 z-40">
        <div className="w-96 sticky top-8">
          <Card className="w-full rounded-xl shadow-2xl bg-background border-2 border-primary">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold text-foreground mb-2 text-uniform-center">Need Property Management?</h3>
              <p className="text-sm text-muted-foreground mb-4 text-uniform-center">Get professional management service</p>

              <form className="space-y-4" onSubmit={e => {
                e.preventDefault();
                const form = e.currentTarget as HTMLFormElement;
                if (!form.checkValidity()) {
                  form.reportValidity();
                  setFormMessage({
                    type: "error",
                    text: "Please fill in all required fields before submitting your property management request."
                  });
                  return;
                }
                setFormMessage({
                  type: "success",
                  text: "Request received! Our property management expert will contact you shortly."
                });
                form.reset();
              }}>
                <Input id="property-name" name="name" placeholder="Name" required />

                <div className="flex gap-2">
                  <Select defaultValue="+91" name="countryCode">
                    <SelectTrigger className="w-28"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="+91">🇮🇳 +91</SelectItem>
                      <SelectItem value="+1">🇺🇸 +1</SelectItem>
                      <SelectItem value="+44">🇬🇧 +44</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input id="property-phone" name="phone" type="tel" placeholder="Phone Number" className="flex-1" required />
                </div>

                <Input id="property-email" name="email" type="email" placeholder="Email ID" required />

                  <Select name="city" required>
                    <SelectTrigger className="flex-1"><SelectValue placeholder="City" /></SelectTrigger>
                    <SelectContent>
                      {majorCities.map((city: string) => (
                        <SelectItem key={city} value={city}>
                          {city}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                <Select name="propertyType" required>
                  <SelectTrigger className="w-full"><SelectValue placeholder="Property Type" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="residential">Residential</SelectItem>
                    <SelectItem value="commercial">Commercial</SelectItem>
                    <SelectItem value="apartment">Apartment</SelectItem>
                    <SelectItem value="villa">Villa/House</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>

                <Button type="submit" className="w-full bg-red-800 hover:bg-red-900 text-white">Get Property Management Quote</Button>
                
                {/* Inline message */}
                {formMessage.type && (
                  <div className={`mt-2 p-3 rounded-lg text-sm ${
                    formMessage.type === 'error'
                      ? 'bg-red-50 text-red-700 border border-red-200'
                      : 'bg-green-50 text-green-700 border border-green-200'
                  }`}>
                    {formMessage.text}
                  </div>
                )}
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Mobile Form - Static below hero */}
      <section className="lg:hidden px-4 py-8 bg-background">
        <div className="container mx-auto max-w-xl px-4">
          <Card className="w-full rounded-2xl shadow-xl border-2 border-primary bg-card">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-foreground mb-3 text-uniform-center">Need Property Management?</h3>
              <p className="text-base text-muted-foreground mb-8 text-uniform-center">Get professional management service</p>

              <form className="space-y-5" onSubmit={e => {
                e.preventDefault();
                const form = e.currentTarget as HTMLFormElement;
                if (!form.checkValidity()) {
                  form.reportValidity();
                  setFormMessage({
                    type: "error",
                    text: "Please fill in all required fields before submitting your property management request."
                  });
                  return;
                }
                setFormMessage({
                  type: "success",
                  text: "Request received! Our property management expert will contact you shortly."
                });
                form.reset();
              }}>
                <Input 
                  id="property-name-mobile" 
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
                    id="property-phone-mobile" 
                    name="phone" 
                    type="tel" 
                    placeholder="Phone Number" 
                    className="flex-1 h-12 text-base bg-background" 
                    required 
                  />
                </div>

                <Input 
                  id="property-email-mobile" 
                  name="email" 
                  type="email" 
                  placeholder="Email ID" 
                  className="h-12 text-base bg-background"
                />

                  <Select name="city" required>
                    <SelectTrigger className="flex-1 h-12 bg-background">
                      <SelectValue placeholder="City" />
                    </SelectTrigger>
                    <SelectContent className="bg-background border shadow-lg">
                      {majorCities.map((city: string) => (
                        <SelectItem key={city} value={city}>
                          {city}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                <Select name="propertyType" required>
                  <SelectTrigger className="h-12 bg-background">
                    <SelectValue placeholder="Property Type" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border shadow-lg">
                    <SelectItem value="residential">Residential</SelectItem>
                    <SelectItem value="commercial">Commercial</SelectItem>
                    <SelectItem value="apartment">Apartment</SelectItem>
                    <SelectItem value="villa">Villa/House</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>

                <Button type="submit" className="w-full h-12 text-base font-semibold bg-red-800 hover:bg-red-900 text-white mt-6">
                  Get Property Management Quote
                </Button>
                
                {/* Inline message */}
                {formMessage.type && (
                  <div className={`mt-2 p-3 rounded-lg text-sm ${
                    formMessage.type === 'error'
                      ? 'bg-red-50 text-red-700 border border-red-200'
                      : 'bg-green-50 text-green-700 border border-green-200'
                  }`}>
                    {formMessage.text}
                  </div>
                )}
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Complete Property Management Solutions
          </h2>
          <p className="text-lg text-muted-foreground mb-12 max-w-2xl mx-auto">
            Professional property management services to maximize your rental income with minimal hassle.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-shadow bg-background border border-border">
                <CardContent className="p-0 text-center">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <service.icon className="w-6 h-6 text-red-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{service.title}</h3>
                  <p className="text-muted-foreground">{service.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 px-4 bg-background">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-12">Why Choose HomeHNI Over Others?</h2>
          
          <div className="max-w-4xl mx-auto">
            <div className="bg-card border border-border rounded-lg overflow-hidden">
              <div className="grid grid-cols-3 bg-muted text-center py-4">
                <div className="font-semibold text-foreground">Features</div>
                <div className="font-semibold text-foreground">HomeHNI</div>
                <div className="font-semibold text-foreground">Others</div>
              </div>
              
              {comparisonData.map((item, index) => (
                <div key={index} className={`grid grid-cols-3 text-center py-3 ${index % 2 === 0 ? 'bg-muted/50' : 'bg-background'}`}>
                  <div className="text-foreground font-medium">{item.feature}</div>
                  <div>{item.homeHNI ? <CheckCircle className="w-5 h-5 text-green-600 mx-auto" /> : <X className="w-5 h-5 text-red-500 mx-auto" />}</div>
                  <div>{item.others ? <CheckCircle className="w-5 h-5 text-green-600 mx-auto" /> : <X className="w-5 h-5 text-red-500 mx-auto" />}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Customer Testimonials Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-12">What Our Customers Say</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="p-6 bg-background border border-border">
                <CardContent className="p-0">
                  <div className="flex items-center mb-4">
                    <img 
                      src={testimonial.image} 
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover mr-4"
                    />
                    <div>
                      <h4 className="font-semibold text-foreground">{testimonial.name}</h4>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                  
                  <div className="flex mb-3">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  
                  <p className="text-muted-foreground">{testimonial.text}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Target Audience Section */}
      <section className="py-16 px-4 bg-background">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Perfect For</h2>
          <p className="text-lg text-muted-foreground mb-12">Our property management services cater to various property owners</p>
          
          <div className="grid md:grid-cols-3 gap-8">
            {targetAudience.map((audience, index) => (
              <div key={index} className="space-y-4">
                <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto">
                  <audience.icon className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-xl font-bold text-foreground">{audience.title}</h3>
                <p className="text-muted-foreground">{audience.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-12">Frequently Asked Questions</h2>
          
          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left font-semibold text-foreground">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* Service Tags Section */}
      <section className="py-12 px-4 bg-background">
        <div className="container mx-auto text-center">
          <div className="flex flex-wrap justify-center gap-3">
            <span className="px-4 py-2 bg-red-100 text-red-700 rounded-full text-sm font-medium">Property Management Mumbai</span>
            <span className="px-4 py-2 bg-red-100 text-red-700 rounded-full text-sm font-medium">Tenant Screening</span>
            <span className="px-4 py-2 bg-red-100 text-red-700 rounded-full text-sm font-medium">Rent Collection</span>
            <span className="px-4 py-2 bg-red-100 text-red-700 rounded-full text-sm font-medium">Property Maintenance</span>
            <span className="px-4 py-2 bg-red-100 text-red-700 rounded-full text-sm font-medium">Legal Compliance</span>
            <span className="px-4 py-2 bg-red-100 text-red-700 rounded-full text-sm font-medium">Financial Reporting</span>
            <span className="px-4 py-2 bg-red-100 text-red-700 rounded-full text-sm font-medium">NRI Property Management</span>
            <span className="px-4 py-2 bg-red-100 text-red-700 rounded-full text-sm font-medium">Professional Service</span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PropertyManagementEmbedded;

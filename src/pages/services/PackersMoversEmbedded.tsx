import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useToast } from "@/hooks/use-toast";
import { Truck, Package, Shield, Clock, CheckCircle, Star, Users, Building2, Home, Car, Award, Headphones, Globe, TrendingUp, FileText, X, Plus, Minus } from "lucide-react";

const PackersMoversEmbedded = () => {
  // Major cities in India
  const majorCities = [
    "Mumbai", "Delhi", "Bangalore", "Hyderabad", "Ahmedabad", "Chennai", "Kolkata", "Surat", "Pune", "Jaipur",
    "Lucknow", "Kanpur", "Nagpur", "Indore", "Thane", "Bhopal", "Visakhapatnam", "Pimpri-Chinchwad", "Patna", "Vadodara",
    "Ghaziabad", "Ludhiana", "Agra", "Nashik", "Faridabad", "Meerut", "Rajkot", "Kalyan-Dombivli", "Vasai-Virar", "Varanasi",
    "Srinagar", "Aurangabad", "Dhanbad", "Amritsar", "Navi Mumbai", "Allahabad", "Ranchi", "Howrah", "Coimbatore", "Jabalpur",
    "Gwalior", "Vijayawada", "Jodhpur", "Madurai", "Raipur", "Kota", "Guwahati", "Chandigarh", "Solapur", "Hubli-Dharwad"
  ];

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
    feature: "Insurance Coverage",
    homeHNI: true,
    others: false
  }, {
    feature: "Real-time Tracking",
    homeHNI: true,
    others: false
  }, {
    feature: "Quality Packing Materials",
    homeHNI: true,
    others: false
  }, {
    feature: "Transparent Pricing",
    homeHNI: true,
    others: false
  }, {
    feature: "24/7 Customer Support",
    homeHNI: true,
    others: false
  }, {
    feature: "Damage Protection",
    homeHNI: true,
    others: false
  }, {
    feature: "On-time Delivery",
    homeHNI: true,
    others: false
  }];

  const testimonials = [{
    name: "Anita Sharma",
    role: "Homeowner",
    image: "/lovable-uploads/5b898e4e-d9b6-4366-b58f-176fc3c8a9c3.png",
    rating: 5,
    text: "Excellent packing and moving service! They handled our fragile items with utmost care. Highly recommend!"
  }, {
    name: "Rajesh Kumar",
    role: "Corporate Manager",
    image: "/lovable-uploads/46a07bb4-9f10-4614-ad52-73dfb2de4f28.png",
    rating: 5,
    text: "Professional office relocation completed without any issues. Team was punctual and efficient."
  }, {
    name: "Priya Patel",
    role: "Software Engineer",
    image: "/lovable-uploads/6e6c47cd-700c-49d4-bfee-85a69bb8353f.png",
    rating: 5,
    text: "Smooth interstate move from Mumbai to Bangalore. Real-time tracking was very helpful!"
  }];

  const faqs = [{
    question: "What type of packing materials do you use?",
    answer: "We use high-quality packing materials including bubble wrap, corrugated boxes, foam sheets, and specialized containers for fragile items. All materials are sourced from certified suppliers to ensure maximum protection."
  }, {
    question: "Do you provide insurance for my belongings?",
    answer: "Yes, we offer comprehensive insurance coverage for all your belongings during transit. Our insurance covers damage, loss, or theft, giving you complete peace of mind during your move."
  }, {
    question: "How do you ensure the safety of fragile items?",
    answer: "Our trained professionals use specialized packing techniques and materials for fragile items. We provide extra cushioning, custom crating, and handle these items separately with utmost care."
  }, {
    question: "Can I track my shipment during transit?",
    answer: "Yes, we provide real-time tracking through our mobile app and website. You'll receive regular updates about your shipment's location and estimated delivery time."
  }, {
    question: "What is your policy for damaged items?",
    answer: "In the rare event of damage, we have a quick claim process. Our insurance covers the full value of damaged items, and we ensure prompt settlement of all genuine claims."
  }];

  const [formMessage, setFormMessage] = useState<{ type: 'success' | 'error' | null; text: string }>({ type: null, text: '' });

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
                Professional Packers & Movers
                <br className="hidden md:block" />
                <span className="block">for Stress-Free Relocation</span>
              </h1>
              <p className="text-lg md:text-xl text-white/90 mb-6">
                Reliable packing and moving services with insurance coverage,
                real-time tracking, and professional handling.
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
              <h3 className="text-xl font-semibold text-foreground mb-2 text-uniform-center">Need Moving Service?</h3>
              <p className="text-sm text-muted-foreground mb-4 text-uniform-center">Get free quote & consultation</p>

              <form className="space-y-4" onSubmit={e => {
                e.preventDefault();
                const form = e.currentTarget as HTMLFormElement;
                if (!form.checkValidity()) {
                  form.reportValidity();
                  setFormMessage({
                    type: "error",
                    text: "Please fill in all required fields before submitting your moving request."
                  });
                  return;
                }
                setFormMessage({
                  type: "success",
                  text: "Request received! Our moving expert will contact you shortly."
                });
                form.reset();
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

                <Input id="moving-email" name="email" type="email" placeholder="Email ID" required />

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
                </div>

                <div className="flex gap-2">
                  <Select name="serviceType" required>
                    <SelectTrigger className="flex-1"><SelectValue placeholder="Service Type" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="home-shifting">Home Shifting</SelectItem>
                      <SelectItem value="office-relocation">Office Relocation</SelectItem>
                      <SelectItem value="interstate-moving">Interstate Moving</SelectItem>
                      <SelectItem value="packing-only">Packing Only</SelectItem>
                      <SelectItem value="vehicle-transport">Vehicle Transport</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button type="submit" className="w-full bg-red-800 hover:bg-red-900 text-white">Get Free Moving Quote</Button>
                
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
              <h3 className="text-2xl font-bold text-foreground mb-3 text-uniform-center">Need Moving Service?</h3>
              <p className="text-base text-muted-foreground mb-8 text-uniform-center">Get free quote & consultation</p>

              <form className="space-y-5" onSubmit={e => {
                e.preventDefault();
                const form = e.currentTarget as HTMLFormElement;
                if (!form.checkValidity()) {
                  form.reportValidity();
                  setFormMessage({
                    type: "error",
                    text: "Please fill in all required fields before submitting your moving request."
                  });
                  return;
                }
                setFormMessage({
                  type: "success",
                  text: "Request received! Our moving expert will contact you shortly."
                });
                form.reset();
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

                <div className="flex flex-col md:flex-row gap-3">
                  <Select defaultValue="India" name="country">
                    <SelectTrigger className="flex-1 h-12 bg-background">
                      <SelectValue placeholder="Country" />
                    </SelectTrigger>
                    <SelectContent className="bg-background border shadow-lg">
                      <SelectItem value="India">India</SelectItem>
                      <SelectItem value="USA">USA</SelectItem>
                      <SelectItem value="UK">UK</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>

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
                </div>

                <Select name="serviceType" required>
                  <SelectTrigger className="h-12 bg-background">
                    <SelectValue placeholder="Service Type" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border shadow-lg">
                    <SelectItem value="home-shifting">Home Shifting</SelectItem>
                    <SelectItem value="office-relocation">Office Relocation</SelectItem>
                    <SelectItem value="interstate-moving">Interstate Moving</SelectItem>
                    <SelectItem value="packing-only">Packing Only</SelectItem>
                    <SelectItem value="vehicle-transport">Vehicle Transport</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>

                <Button type="submit" className="w-full h-12 text-base font-semibold bg-red-800 hover:bg-red-900 text-white mt-6">
                  Get Free Moving Quote
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
            Complete Moving Solutions
          </h2>
          <p className="text-lg text-muted-foreground mb-12 max-w-2xl mx-auto">
            From local shifting to interstate moves, we provide comprehensive packing and moving services.
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
          <p className="text-lg text-muted-foreground mb-12">Our moving services cater to diverse relocation needs</p>
          
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
            <span className="px-4 py-2 bg-red-100 text-red-700 rounded-full text-sm font-medium">Packers Movers Mumbai</span>
            <span className="px-4 py-2 bg-red-100 text-red-700 rounded-full text-sm font-medium">Home Shifting Delhi</span>
            <span className="px-4 py-2 bg-red-100 text-red-700 rounded-full text-sm font-medium">Office Relocation</span>
            <span className="px-4 py-2 bg-red-100 text-red-700 rounded-full text-sm font-medium">Interstate Moving</span>
            <span className="px-4 py-2 bg-red-100 text-red-700 rounded-full text-sm font-medium">Professional Packing</span>
            <span className="px-4 py-2 bg-red-100 text-red-700 rounded-full text-sm font-medium">Vehicle Transport</span>
            <span className="px-4 py-2 bg-red-100 text-red-700 rounded-full text-sm font-medium">Insurance Coverage</span>
            <span className="px-4 py-2 bg-red-100 text-red-700 rounded-full text-sm font-medium">Real-time Tracking</span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PackersMoversEmbedded;

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useToast } from "@/hooks/use-toast";
import { Shield, Camera, Lock, Bell, Smartphone, Home, Clock, CheckCircle, Star, X, Users, Building2, Zap, Headphones, Award, TrendingUp } from "lucide-react";

const HomeSecurityEmbedded = () => {
  const [statesData, setStatesData] = useState<any>(null);
  const [selectedState, setSelectedState] = useState("");
  const [selectedStateDesktop, setSelectedStateDesktop] = useState("");
  const [cities, setCities] = useState<string[]>([]);
  const [citiesDesktop, setCitiesDesktop] = useState<string[]>([]);

  const services = [{
    icon: Camera,
    title: "CCTV Installation",
    description: "Indoor/Outdoor cameras with night vision and AI motion detection."
  }, {
    icon: Lock,
    title: "Digital Door Lock Setup",
    description: "Fingerprint, PIN, smart card, and WiFi-enabled locks."
  }, {
    icon: Bell,
    title: "Alarm & Sensor Systems",
    description: "Smoke, gas, and intrusion alert systems for complete protection."
  }, {
    icon: Smartphone,
    title: "Video Door Phones",
    description: "Advanced intercom systems with video monitoring capabilities."
  }, {
    icon: Home,
    title: "Smart Home Security Integration",
    description: "Connect with Alexa/Google Home for seamless control."
  }];

  const benefits = [{
    icon: CheckCircle,
    title: "Competitive Pricing with Warranty",
    description: "Best rates in the market with comprehensive warranty coverage"
  }, {
    icon: Clock,
    title: "Quick Installation & Setup",
    description: "Professional installation completed within 24-48 hours"
  }, {
    icon: Shield,
    title: "Minimal Maintenance Required",
    description: "Low-maintenance systems designed for long-term reliability"
  }, {
    icon: Users,
    title: "Expert Security Consultation",
    description: "Free consultation to assess your security needs"
  }, {
    icon: Smartphone,
    title: "Smart Technology Integration",
    description: "Mobile app control with AI alerts and notifications"
  }, {
    icon: Headphones,
    title: "24/7 Monitoring Support",
    description: "Round-the-clock technical support and monitoring"
  }];

  const targetAudience = [{
    icon: Home,
    title: "Homeowners",
    description: "Protecting family and property with smart security solutions"
  }, {
    icon: Building2,
    title: "Real Estate Builders",
    description: "Bulk security installations for new projects and societies"
  }, {
    icon: Users,
    title: "Business Owners",
    description: "Commercial security systems for offices and retail spaces"
  }, {
    icon: Building2,
    title: "Housing Societies",
    description: "Community-wide security infrastructure and monitoring"
  }];

  const comparisonData = [{
    feature: "Professional Certified Installers",
    homeHNI: true,
    others: false
  }, {
    feature: "Free Site Assessment",
    homeHNI: true,
    others: false
  }, {
    feature: "Smart Tech Integration",
    homeHNI: true,
    others: false
  }, {
    feature: "Warranty & AMC",
    homeHNI: true,
    others: false
  }, {
    feature: "Transparent Pricing",
    homeHNI: true,
    others: false
  }, {
    feature: "Mobile App Control",
    homeHNI: true,
    others: false
  }, {
    feature: "24/7 Technical Support",
    homeHNI: true,
    others: false
  }, {
    feature: "AI-Powered Alerts",
    homeHNI: true,
    others: false
  }];

  const testimonials = [{
    name: "Rajesh Sharma",
    role: "Homeowner",
    image: "/lovable-uploads/46a07bb4-9f10-4614-ad52-73dfb2de4f28.png",
    rating: 5,
    text: "Excellent CCTV installation! The night vision quality is amazing and the mobile app works perfectly. Feel much safer now."
  }, {
    name: "Priya Nair",
    role: "Housing Society Secretary",
    image: "/lovable-uploads/5b898e4e-d9b6-4366-b58f-176fc3c8a9c3.png",
    rating: 5,
    text: "Professional service for our entire society. Digital locks and intercom system work flawlessly. Highly recommend!"
  }, {
    name: "Amit Patel",
    role: "Business Owner",
    image: "/lovable-uploads/6e6c47cd-700c-49d4-bfee-85a69bb8353f.png",
    rating: 5,
    text: "Smart security system has revolutionized our office security. Quick installation and excellent ongoing support."
  }];

  const faqs = [{
    question: "What type of CCTV cameras do you offer?",
    answer: "We offer a wide range of CCTV cameras including indoor/outdoor cameras, night vision cameras, AI-powered motion detection cameras, 4K Ultra HD cameras, and wireless cameras. All come with mobile app integration for remote monitoring."
  }, {
    question: "Do digital locks work without internet?",
    answer: "Yes, our digital locks work independently without internet. They support multiple access methods including fingerprint, PIN, and smart cards. WiFi connectivity is optional for remote access and notifications."
  }, {
    question: "Can I control my security system from mobile?",
    answer: "Absolutely! All our security systems come with dedicated mobile apps that allow you to monitor cameras, control locks, receive alerts, and manage your entire security setup remotely from anywhere."
  }, {
    question: "Do you provide installation warranty?",
    answer: "Yes, we provide comprehensive warranty on all installations. CCTV systems come with 2-year warranty, digital locks with 1-year warranty, and all installations include 6 months of free service support."
  }, {
    question: "Do you offer Annual Maintenance Contracts (AMC)?",
    answer: "Yes, we offer flexible AMC packages that include regular maintenance, software updates, battery replacements, and 24/7 technical support to ensure your security systems work optimally at all times."
  }];

  const { toast } = useToast();

  // Load states and cities data
  useEffect(() => {
    const loadStatesData = async () => {
      try {
        const response = await fetch('/data/india_states_cities.json');
        const data = await response.json();
        setStatesData(data);
      } catch (error) {
        console.error('Failed to load states data:', error);
      }
    };
    loadStatesData();
  }, []);

  // Update cities when state changes (mobile)
  useEffect(() => {
    if (statesData && selectedState) {
      const cities = statesData[selectedState];
      setCities(cities || []);
    } else {
      setCities([]);
    }
  }, [selectedState, statesData]);

  // Update cities when state changes (desktop)
  useEffect(() => {
    if (statesData && selectedStateDesktop) {
      const cities = statesData[selectedStateDesktop];
      setCitiesDesktop(cities || []);
    } else {
      setCitiesDesktop([]);
    }
  }, [selectedStateDesktop, statesData]);

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
                Smart & Reliable Home Security Solutions
                <br className="hidden md:block" />
                <span className="block">for Your Family's Safety</span>
              </h1>
              <p className="text-lg md:text-xl text-white/90 mb-6">
                Protect your home with CCTV cameras, digital locks, and modern security systems 
                with expert installation and support.
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
              <h3 className="text-xl font-semibold text-foreground mb-2 text-uniform-center">Need Security Solutions?</h3>
              <p className="text-sm text-muted-foreground mb-4 text-uniform-center">Get free consultation & quote</p>

              <form className="space-y-4" onSubmit={e => {
                e.preventDefault();
                const form = e.currentTarget as HTMLFormElement;
                if (!form.checkValidity()) {
                  form.reportValidity();
                  toast({
                    title: "Required Fields Missing",
                    description: "Please fill in all required fields before submitting your security consultation request.",
                    variant: "destructive"
                  });
                  return;
                }
                toast({
                  title: "Request received",
                  description: "Our security expert will contact you shortly."
                });
                form.reset();
              }}>
                <Input id="security-name" name="name" placeholder="Name" required />

                <div className="flex gap-2">
                  <Select defaultValue="+91" name="countryCode">
                    <SelectTrigger className="w-28"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="+91">🇮🇳 +91</SelectItem>
                      <SelectItem value="+1">🇺🇸 +1</SelectItem>
                      <SelectItem value="+44">🇬🇧 +44</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input 
                    id="security-phone" 
                    name="phone" 
                    type="tel" 
                    placeholder="Phone Number" 
                    className="flex-1" 
                    required 
                  />
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

                  <Select name="state" onValueChange={setSelectedStateDesktop}>
                    <SelectTrigger className="flex-1"><SelectValue placeholder="State" /></SelectTrigger>
                    <SelectContent>
                      {statesData && Object.keys(statesData).map((state: string) => (
                        <SelectItem key={state} value={state}>
                          {state}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select name="city">
                    <SelectTrigger className="flex-1"><SelectValue placeholder="City" /></SelectTrigger>
                    <SelectContent>
                      {citiesDesktop.map((city: string) => (
                        <SelectItem key={city} value={city}>
                          {city}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Select name="serviceType" required>
                  <SelectTrigger className="w-full"><SelectValue placeholder="Service Type" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cctv-cameras">CCTV Cameras</SelectItem>
                    <SelectItem value="digital-locks">Digital Locks</SelectItem>
                    <SelectItem value="smart-alarms">Smart Alarms</SelectItem>
                    <SelectItem value="video-door-phones">Video Door Phones</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>

                <Button type="submit" className="w-full">Get Free Security Consultation</Button>
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
              <h3 className="text-2xl font-bold text-foreground mb-3 text-uniform-center">Need Security Solutions?</h3>
              <p className="text-base text-muted-foreground mb-8 text-uniform-center">Get free consultation & quote</p>

              <form className="space-y-5" onSubmit={e => {
                e.preventDefault();
                const form = e.currentTarget as HTMLFormElement;
                if (!form.checkValidity()) {
                  form.reportValidity();
                  toast({
                    title: "Required Fields Missing",
                    description: "Please fill in all required fields before submitting your security consultation request.",
                    variant: "destructive"
                  });
                  return;
                }
                toast({
                  title: "Request received",
                  description: "Our security expert will contact you shortly."
                });
                form.reset();
              }}>
                <Input 
                  id="security-name-mobile" 
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
                    id="security-phone-mobile" 
                    name="phone" 
                    type="tel" 
                    placeholder="Phone Number" 
                    className="flex-1 h-12 text-base bg-background" 
                    required 
                  />
                </div>

                <div className="flex gap-3">
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

                  <Select name="state" onValueChange={setSelectedState}>
                    <SelectTrigger className="flex-1 h-12 bg-background">
                      <SelectValue placeholder="State" />
                    </SelectTrigger>
                    <SelectContent className="bg-background border shadow-lg">
                      {statesData && Object.keys(statesData).map((state: string) => (
                        <SelectItem key={state} value={state}>
                          {state}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select name="city">
                    <SelectTrigger className="flex-1 h-12 bg-background">
                      <SelectValue placeholder="City" />
                    </SelectTrigger>
                    <SelectContent className="bg-background border shadow-lg">
                      {cities.map((city: string) => (
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
                    <SelectItem value="cctv-cameras">CCTV Cameras</SelectItem>
                    <SelectItem value="digital-locks">Digital Locks</SelectItem>
                    <SelectItem value="smart-alarms">Smart Alarms</SelectItem>
                    <SelectItem value="video-door-phones">Video Door Phones</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>

                <Button type="submit" className="w-full h-12 text-base font-semibold">Get Free Security Consultation</Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Why Choose Our Home Security Services */}
      <section className="py-16 px-4 bg-background">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div className="max-w-3xl">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8">
                Why Choose Our Home Security Services?
              </h2>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-red-600" />
                  </div>
                  <h3 className="text-base font-semibold text-foreground">
                    Competitive Pricing with Warranty
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Best rates in the market with comprehensive warranty coverage
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                    <Clock className="w-5 h-5 text-red-600" />
                  </div>
                  <h3 className="text-base font-semibold text-foreground">
                    Quick Installation & Setup
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Professional installation completed within 24-48 hours
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                    <Shield className="w-5 h-5 text-red-600" />
                  </div>
                  <h3 className="text-base font-semibold text-foreground">
                    Minimal Maintenance Required
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Low-maintenance systems designed for long-term reliability
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-red-600" />
                  </div>
                  <h3 className="text-base font-semibold text-foreground">
                    Expert Security Consultation
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Free consultation to assess your security needs
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                    <Smartphone className="w-5 h-5 text-red-600" />
                  </div>
                  <h3 className="text-base font-semibold text-foreground">
                    Smart Technology Integration
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Mobile app control with AI alerts and notifications
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                    <Headphones className="w-5 h-5 text-red-600" />
                  </div>
                  <h3 className="text-base font-semibold text-foreground">
                    24/7 Monitoring Support
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Round-the-clock technical support and monitoring
                  </p>
                </div>
              </div>
            </div>
            
            {/* Right side spacing for sticky form */}
            <div className="hidden lg:block"></div>
          </div>
        </div>
      </section>

      {/* Our Security Services */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div className="max-w-3xl">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8">
                Our Security Services
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

      {/* Stats Section */}
      <section className="py-16 px-4 bg-background">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div className="max-w-3xl">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8">
                Trusted by Thousands
              </h2>
              <div className="grid grid-cols-2 gap-8">
                <div className="text-center">
                  <div className="text-4xl md:text-5xl font-bold text-red-600 mb-2">5,000+</div>
                  <p className="text-muted-foreground">Homes Secured</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl md:text-5xl font-bold text-red-600 mb-2">200+</div>
                  <p className="text-muted-foreground">Corporate Offices Protected</p>
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
            
            {/* Right side spacing for sticky form */}
            <div className="hidden lg:block"></div>
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-16 px-4 bg-muted/30">
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

      {/* Testimonials */}
      <section className="py-16 px-4 bg-background">
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

      {/* Target Audience */}
      <section className="py-16 px-4 bg-muted/30">
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
            
            {/* Right side spacing for sticky form */}
            <div className="hidden lg:block"></div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomeSecurityEmbedded;

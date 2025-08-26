import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useToast } from "@/hooks/use-toast";
import { Shield, Camera, Lock, Bell, Smartphone, Home, Clock, CheckCircle, Star, X, Users, Building2, Zap, Headphones, Award, TrendingUp } from "lucide-react";
import Marquee from "@/components/Marquee";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const HomeSecurityServices = () => {
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

  const securitySolutions = [{
    icon: Camera,
    title: "CCTV Cameras",
    description: "Indoor/Outdoor, Night Vision, AI Motion Detection",
    features: ["4K Ultra HD Recording", "Cloud Storage", "Remote Access", "Mobile Alerts"]
  }, {
    icon: Lock,
    title: "Digital Door Locks",
    description: "Fingerprint, PIN, Smart Card, WiFi enabled",
    features: ["Multiple Access Methods", "Auto-Lock Function", "Battery Backup", "Mobile Integration"]
  }, {
    icon: Bell,
    title: "Smart Alarms & Sensors",
    description: "Smoke, Gas, Intrusion Alerts",
    features: ["Instant Notifications", "Smart Detection", "Battery Powered", "Easy Installation"]
  }, {
    icon: Smartphone,
    title: "Video Door Phones & Intercoms",
    description: "Advanced communication and monitoring",
    features: ["HD Video Quality", "Two-way Audio", "Remote Access", "Visitor Recording"]
  }, {
    icon: Home,
    title: "Smart Home Integration",
    description: "Connect with Alexa/Google Home",
    features: ["Voice Control", "Automation", "Scene Management", "Cross-Device Integration"]
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

  const stats = [{
    icon: Home,
    number: '5,000+',
    label: 'Homes Secured'
  }, {
    icon: Building2,
    number: '200+',
    label: 'Corporate Offices Protected'
  }, {
    icon: Headphones,
    number: '24/7',
    label: 'Support Team'
  }, {
    icon: Award,
    number: '99%',
    label: 'Customer Satisfaction'
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

  useEffect(() => {
    const title = "Home Security Services | CCTV, Digital Locks & Smart Security Systems | Home HNI";
    document.title = title;
    const desc = "Professional home security services including CCTV installation, digital door locks, smart alarms and 24/7 monitoring. Secure your home with expert installation and warranty.";
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
    canonical.setAttribute('href', window.location.origin + '/home-security-services');
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
      <div className="hidden lg:block fixed top-32 right-8 z-40 w-96">
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
                <Input id="security-phone" name="phone" type="tel" placeholder="Phone Number" className="flex-1" required />
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
      <section className="py-16 md:py-24 px-4 md:px-8 bg-background">
        <div className="container mx-auto max-w-7xl">
          <div className="mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Why Choose Our Home Security Services?
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl">
              Comprehensive security solutions with professional installation, smart technology, and 24/7 support.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <Card key={index} className="p-6 hover:shadow-lg transition-shadow border-border">
                  <CardContent className="p-0">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg text-foreground mb-2">{benefit.title}</h3>
                        <p className="text-muted-foreground">{benefit.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Comprehensive Home Security Solutions */}
      <section className="py-16 md:py-24 px-4 md:px-8 bg-muted/30">
        <div className="container mx-auto max-w-7xl">
          <div className="mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Comprehensive Home Security Solutions
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl">
              Complete range of security systems designed to protect your home and family with cutting-edge technology.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {securitySolutions.map((solution, index) => {
              const Icon = solution.icon;
              return (
                <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                  <CardContent className="p-0">
                    <div className="text-uniform-center mb-6">
                      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Icon className="w-8 h-8 text-primary" />
                      </div>
                      <h3 className="font-semibold text-xl text-foreground mb-2">{solution.title}</h3>
                      <p className="text-muted-foreground mb-4">{solution.description}</p>
                    </div>
                    <ul className="space-y-2">
                      {solution.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Our Security Services */}
      <section className="py-16 md:py-24 px-4 md:px-8 bg-background">
        <div className="container mx-auto max-w-7xl">
          <div className="mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Our Security Services
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl">
              Professional installation and setup services for all your home security needs.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <Card key={index} className="p-6 text-uniform-center hover:shadow-lg transition-shadow">
                  <CardContent className="p-0">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="font-semibold text-lg text-foreground mb-2">{service.title}</h3>
                    <p className="text-sm text-muted-foreground">{service.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Trusted by Thousands - Stats */}
      <section className="py-16 gradient-red-maroon">
        <div className="container mx-auto px-4">
          <div className="text-uniform-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Trusted by Thousands
            </h2>
            <p className="text-lg text-white/90 max-w-2xl mx-auto">
              Join thousands of satisfied customers who trust Home HNI for their security needs.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center text-white">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8" />
                  </div>
                  <div className="text-3xl md:text-4xl font-bold mb-2">{stat.number}</div>
                  <div className="text-lg opacity-90">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Home HNI is Better - Comparison */}
      <section className="py-16 md:py-24 px-4 md:px-8 bg-muted/30">
        <div className="container mx-auto max-w-5xl">
          <div className="mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Why Home HNI is Better
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl">
              Compare our professional security services with local vendors and see the difference.
            </p>
          </div>

          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left p-6 font-semibold text-foreground">Features</th>
                    <th className="text-uniform-center p-6 font-semibold text-primary">Home HNI</th>
                    <th className="text-uniform-center p-6 font-semibold text-muted-foreground">Local Vendors</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonData.map((item, index) => (
                    <tr key={index} className="border-b border-border last:border-0">
                      <td className="p-6 text-foreground">{item.feature}</td>
                      <td className="p-6 text-uniform-center">
                        {item.homeHNI ? (
                          <CheckCircle className="w-6 h-6 text-primary mx-auto" />
                        ) : (
                          <X className="w-6 h-6 text-muted-foreground mx-auto" />
                        )}
                      </td>
                      <td className="p-6 text-uniform-center">
                        {item.others ? (
                          <CheckCircle className="w-6 h-6 text-primary mx-auto" />
                        ) : (
                          <X className="w-6 h-6 text-muted-foreground mx-auto" />
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </section>

      {/* Customer Testimonials */}
      <section className="py-16 md:py-24 px-4 md:px-8 bg-background">
        <div className="container mx-auto max-w-7xl">
          <div className="mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Customer Testimonials
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl">
              Hear from our satisfied customers about their experience with our home security services.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="p-6">
                <CardContent className="p-0">
                  <div className="flex items-center gap-4 mb-4">
                    <img 
                      src={testimonial.image} 
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <h4 className="font-semibold text-foreground">{testimonial.name}</h4>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                  <div className="flex gap-1 mb-3">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-muted-foreground italic">"{testimonial.text}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Who We Serve */}
      <section className="py-16 md:py-24 px-4 md:px-8 bg-muted/30">
        <div className="container mx-auto max-w-7xl">
          <div className="mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Who We Serve
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl">
              Our security solutions cater to diverse needs across residential and commercial segments.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {targetAudience.map((audience, index) => {
              const Icon = audience.icon;
              return (
                <Card key={index} className="p-6 text-uniform-center hover:shadow-lg transition-shadow">
                  <CardContent className="p-0">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="font-semibold text-lg text-foreground mb-2">{audience.title}</h3>
                    <p className="text-sm text-muted-foreground">{audience.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 md:py-24 px-4 md:px-8 bg-background">
        <div className="container mx-auto max-w-4xl">
          <div className="mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-muted-foreground">
              Get answers to common questions about our home security services and solutions.
            </p>
          </div>

          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`faq-${index}`} className="border border-border rounded-lg px-6">
                <AccordionTrigger className="text-left font-semibold text-foreground hover:no-underline py-6">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-6">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 md:py-20 px-4 md:px-8 bg-primary text-white">
        <div className="container mx-auto max-w-4xl text-uniform-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Secure Your Home Today with Home HNI Security Experts
          </h2>
          <p className="text-lg mb-8 opacity-90">
            Don't wait for a security incident. Get professional home security solutions installed today 
            and protect what matters most to you.
          </p>
          <Button 
            size="lg" 
            className="bg-white text-primary hover:bg-white/90 font-semibold px-8"
          >
            Get Free Security Consultation
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HomeSecurityServices;
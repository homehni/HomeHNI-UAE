import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/hooks/useProfile";
import { Shield, Camera, Lock, Bell, Smartphone, Home, Clock, CheckCircle, Star, X, Users, Building2, Zap, Headphones, Award, TrendingUp } from "lucide-react";
import { sendServicesApplicationEmail } from "@/services/emailService";

const HomeSecurityEmbedded = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const { profile } = useProfile();
  
  // Auto-fill state for form fields
  const [autoFillData, setAutoFillData] = useState({
    name: '',
    email: ''
  });

  // Auto-fill form data when user is logged in
  useEffect(() => {
    if (user && profile) {
      setAutoFillData({
        name: profile.full_name || '',
        email: user.email || ''
      });
    }
  }, [user, profile]);

  // Major cities in India
  const majorCities = [
    "Mumbai", "Delhi", "Bangalore", "Hyderabad", "Ahmedabad", "Chennai", "Kolkata", "Surat", "Pune", "Jaipur",
    "Lucknow", "Kanpur", "Nagpur", "Indore", "Thane", "Bhopal", "Visakhapatnam", "Pimpri-Chinchwad", "Patna", "Vadodara",
    "Ghaziabad", "Ludhiana", "Agra", "Nashik", "Faridabad", "Meerut", "Rajkot", "Kalyan-Dombivli", "Vasai-Virar", "Varanasi",
    "Srinagar", "Aurangabad", "Dhanbad", "Amritsar", "Navi Mumbai", "Allahabad", "Ranchi", "Howrah", "Coimbatore", "Jabalpur",
    "Gwalior", "Vijayawada", "Jodhpur", "Madurai", "Raipur", "Kota", "Guwahati", "Chandigarh", "Solapur", "Hubli-Dharwad"
  ];

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

              <form className="space-y-4" onSubmit={async (e) => {
                e.preventDefault();
                const form = e.currentTarget as HTMLFormElement;
                if (!form.checkValidity()) {
                  form.reportValidity();
                  toast({
                    title: "Error",
                    description: "Please fill in all required fields before submitting your security consultation request.",
                    variant: "destructive"
                  });
                  return;
                }
                
                const formData = new FormData(form);
                const name = formData.get('name') as string;
                const email = formData.get('email') as string;
                
                try {
                  await sendServicesApplicationEmail(email, name, 'home-security');
                  toast({
                    title: "Request received",
                    description: "Our security expert will contact you shortly.",
                    className: "bg-white border border-green-200 shadow-lg rounded-lg",
                    style: {
                      borderLeft: "12px solid hsl(120, 100%, 25%)",
                    },
                  });
                  form.reset();
                } catch (error) {
                  console.error('Error sending email:', error);
                  toast({
                    title: "Error",
                    description: "Failed to submit your request. Please try again.",
                    variant: "destructive"
                  });
                }
              }}>
                <Input 
                  id="security-name" 
                  name="name" 
                  placeholder="Name" 
                  defaultValue={autoFillData.name}
                  required 
                />

                <Input 
                  id="security-email" 
                  name="email" 
                  type="email" 
                  placeholder="Email" 
                  defaultValue={autoFillData.email}
                  required 
                />

                <div className="flex flex-col sm:flex-row gap-2">
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

                <Button type="submit" className="w-full bg-red-800 hover:bg-red-900 text-white">Get Free Security Consultation</Button>
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

              <form className="space-y-5" onSubmit={async (e) => {
                e.preventDefault();
                const form = e.currentTarget as HTMLFormElement;
                if (!form.checkValidity()) {
                  form.reportValidity();
                  toast({
                    title: "Error",
                    description: "Please fill in all required fields before submitting your security consultation request.",
                    variant: "destructive"
                  });
                  return;
                }
                
                const formData = new FormData(form);
                const name = formData.get('name') as string;
                const email = formData.get('email') as string;
                
                try {
                  await sendServicesApplicationEmail(email, name, 'home-security');
                  toast({
                    title: "Request received",
                    description: "Our security expert will contact you shortly.",
                    className: "bg-white border border-green-200 shadow-lg rounded-lg",
                    style: {
                      borderLeft: "12px solid hsl(120, 100%, 25%)",
                    },
                  });
                  form.reset();
                } catch (error) {
                  console.error('Error sending email:', error);
                  toast({
                    title: "Error",
                    description: "Failed to submit your request. Please try again.",
                    variant: "destructive"
                  });
                }
              }}>
                <Input 
                  id="security-name-mobile" 
                  name="name" 
                  placeholder="Name" 
                  defaultValue={autoFillData.name}
                  className="h-12 text-base bg-background"
                  required 
                />

                <Input 
                  id="security-email-mobile" 
                  name="email" 
                  type="email" 
                  placeholder="Email" 
                  defaultValue={autoFillData.email}
                  className="h-12 text-base bg-background"
                  required 
                />

                <div className="flex flex-col sm:flex-row gap-3">
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

                <Button type="submit" className="w-full h-12 text-base font-semibold bg-red-800 hover:bg-red-900 text-white mt-6">
                  Get Free Security Consultation
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 px-4 bg-background">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 items-start">
            <div className="max-w-2xl pr-8">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8">
                Why choose our security services?
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {benefits.slice(0, 4).map((benefit, index) => (
                  <div key={index} className="space-y-3">
                    <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                      <benefit.icon className="w-5 h-5 text-red-600" />
                    </div>
                    <h3 className="text-base font-semibold text-foreground">
                      {benefit.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {benefit.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-center lg:justify-end">
              <div className="w-full max-w-md aspect-square bg-gradient-to-br from-red-100 to-red-50 rounded-2xl flex items-center justify-center">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto">
                    <Shield className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground">Security Coverage</h3>
                  <p className="text-3xl font-bold text-red-600">24/7</p>
                  <p className="text-muted-foreground">Complete Protection</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Comprehensive Security Solutions
          </h2>
          <p className="text-lg text-muted-foreground mb-12 max-w-2xl mx-auto">
            From CCTV installation to smart home integration, we provide complete security solutions for your peace of mind.
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

      {/* Comparison Table Section */}
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
          <p className="text-lg text-muted-foreground mb-12">Our security solutions are designed for various customer needs</p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
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
            <span className="px-4 py-2 bg-red-100 text-red-700 rounded-full text-sm font-medium">CCTV Installation Mumbai</span>
            <span className="px-4 py-2 bg-red-100 text-red-700 rounded-full text-sm font-medium">Digital Locks Delhi</span>
            <span className="px-4 py-2 bg-red-100 text-red-700 rounded-full text-sm font-medium">Home Security Bangalore</span>
            <span className="px-4 py-2 bg-red-100 text-red-700 rounded-full text-sm font-medium">Smart Alarms</span>
            <span className="px-4 py-2 bg-red-100 text-red-700 rounded-full text-sm font-medium">Video Door Phone</span>
            <span className="px-4 py-2 bg-red-100 text-red-700 rounded-full text-sm font-medium">Security System</span>
            <span className="px-4 py-2 bg-red-100 text-red-700 rounded-full text-sm font-medium">Professional Installation</span>
            <span className="px-4 py-2 bg-red-100 text-red-700 rounded-full text-sm font-medium">24/7 Support</span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomeSecurityEmbedded;

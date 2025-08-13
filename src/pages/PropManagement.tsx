import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useToast } from "@/hooks/use-toast";
import { 
  Building2, Users, CreditCard, Wrench, Camera, FileText, 
  MapPin, Crown, TrendingUp, Clock, CheckCircle, Shield, Star,
  X, Plus, Minus, Globe, Shield as ShieldCheck, Headphones,
  Smartphone, Download, Home
} from "lucide-react";
import Marquee from "@/components/Marquee";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const PropManagement = () => {
  const [isFormSticky, setIsFormSticky] = useState(false);

  const services = [
    {
      icon: Users,
      title: "Tenant Management",
      description: "End-to-end tenant handling: onboarding, agreements, exit."
    },
    {
      icon: CreditCard,
      title: "Rent Collection",
      description: "Timely rent, reminders, payment tracking."
    },
    {
      icon: Wrench,
      title: "Maintenance & Repairs",
      description: "Plumbing, electrical, cleaning, and more."
    },
    {
      icon: Camera,
      title: "Periodic Property Inspections",
      description: "Photo/video reports delivered remotely."
    },
    {
      icon: FileText,
      title: "Legal Support",
      description: "Lease paperwork, renewals, tax, society handling."
    },
    {
      icon: Building2,
      title: "Property Marketing",
      description: "Professional listing and promotion services."
    }
  ];

  const targetAudience = [
    {
      icon: Globe,
      title: "NRIs",
      description: "Looking for remote property management"
    },
    {
      icon: Crown,
      title: "HNIs", 
      description: "With multiple or high-value homes"
    },
    {
      icon: TrendingUp,
      title: "Real Estate Investors",
      description: "Focused on ROI"
    }
  ];

  const comparisonData = [
    {
      feature: "Professional Property Management",
      nobroker: true,
      others: false
    },
    {
      feature: "Dedicated Relationship Manager",
      nobroker: true,
      others: false
    },
    {
      feature: "Transparent Monthly Reports",
      nobroker: true,
      others: false
    },
    {
      feature: "24/7 Customer Support",
      nobroker: true,
      others: false
    },
    {
      feature: "Legal Compliance & Documentation",
      nobroker: true,
      others: false
    },
    {
      feature: "Verified Vendor Network",
      nobroker: true,
      others: false
    },
    {
      feature: "Technology-Driven Operations",
      nobroker: true,
      others: false
    },
    {
      feature: "Zero Hidden Charges",
      nobroker: true,
      others: false
    }
  ];

  const testimonials = [
    {
      name: "Rajesh Kumar",
      role: "NRI Property Owner",
      image: "/lovable-uploads/46a07bb4-9f10-4614-ad52-73dfb2de4f28.png",
      rating: 5,
      text: "Excellent service! They handle everything while I'm abroad. Complete peace of mind."
    },
    {
      name: "Priya Sharma", 
      role: "Real Estate Investor",
      image: "/lovable-uploads/5b898e4e-d9b6-4366-b58f-176fc3c8a9c3.png",
      rating: 5,
      text: "Professional management with transparent reporting. Highly recommended!"
    },
    {
      name: "Amit Patel",
      role: "HNI Client",
      image: "/lovable-uploads/6e6c47cd-700c-49d4-bfee-85a69bb8353f.png",
      rating: 5,
      text: "Best property management service in Hyderabad. Worth every penny!"
    }
  ];

  const faqs = [
    {
      question: "What is included in property management services?",
      answer: "Our comprehensive package includes tenant management, rent collection, maintenance & repairs, periodic inspections, legal support, and detailed monthly reporting."
    },
    {
      question: "How do you handle tenant verification?",
      answer: "We conduct thorough background checks including identity verification, employment verification, credit checks, and reference validation to ensure reliable tenants."
    },
    {
      question: "What are your charges for property management?",
      answer: "Our charges are transparent and competitive, typically 8-12% of monthly rent depending on services selected. No hidden fees or surprise costs."
    },
    {
      question: "How often do you inspect the property?",
      answer: "We conduct quarterly inspections with detailed photo/video reports. Emergency inspections are done as needed."
    },
    {
      question: "Do you provide legal support?",
      answer: "Yes, we handle all legal documentation including rental agreements, renewals, society compliance, and dispute resolution."
    }
  ];

  const { toast } = useToast();

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

    const handleScroll = () => {
      setIsFormSticky(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen">
      <Marquee />
      <Header />
      
      {/* Hero Section */}
      <section
        className="relative pt-28 md:pt-32 pb-20 md:pb-32 px-4 md:px-8 text-white overflow-hidden bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/lovable-uploads/fbb0d72f-782e-49f5-bbe1-8afc1314b5f7.png')" }}
      >
        <div className="absolute inset-0 bg-blue-900/80 pointer-events-none" />

        <div className="relative z-10 container mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 items-start">
            {/* Left: Copy */}
            <div className="max-w-2xl">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                Comprehensive Property Management Services
                <br className="hidden md:block" />
                <span className="block">in Hyderabad</span>
              </h1>
              <p className="text-lg md:text-xl text-white/90 mb-8">
                From securing verified tenants to regular property maintenance, we handle
                everything for you.
              </p>
            </div>

            {/* Right: Form - Sticky on Scroll */}
            <div className={`lg:justify-self-end transition-all duration-300 ${
              isFormSticky ? 'fixed top-20 right-4 z-[100]' : 'relative'
            }`}>
              <Card className="w-full max-w-md rounded-xl shadow-2xl bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/90 border border-white/20">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-foreground">Got a property to be managed?</h3>
                  <p className="text-sm text-muted-foreground mb-4">Just fill up the form & we will take care of the rest</p>

                  <form
                    className="space-y-4"
                    onSubmit={(e) => {
                      e.preventDefault();
                      toast({ title: "Request received", description: "Our team will reach out shortly." });
                      (e.currentTarget as HTMLFormElement).reset();
                    }}
                  >
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
          </div>
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
      <section className="py-16 px-4 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="max-w-2xl">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                Leave the stress behind!
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Manage your property seamlessly with <strong>NoBroker App</strong>
              </p>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>Access a detailed record of all your payments</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>Instantly connect with your dedicated Relationship Manager</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>Raise service tickets for fast and efficient support</span>
                </div>
              </div>

              <div className="flex space-x-4">
                <Button className="flex items-center space-x-2">
                  <Download className="w-4 h-4" />
                  <span>Download for iOS</span>
                </Button>
                <Button variant="outline" className="flex items-center space-x-2">
                  <Download className="w-4 h-4" />
                  <span>Download for Android</span>
                </Button>
              </div>
            </div>
            
            <div className="flex justify-center">
              <img 
                src="/lovable-uploads/Mobile App Preview.png" 
                alt="Mobile App Preview showing property management features" 
                className="max-w-sm w-full"
              />
            </div>
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
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto bg-slate-900 text-white rounded-2xl px-8 py-12">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="max-w-3xl">
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
      <section className="py-16 px-4 bg-background">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div className="max-w-3xl">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-12">
                NoBroker vs Others: What makes us better?
              </h2>
              
              <Card className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-slate-900 text-white">
                          <th className="text-left p-4 font-semibold">Services</th>
                          <th className="text-center p-4 font-semibold">
                            <div className="flex items-center justify-center space-x-2">
                              <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                                <span className="text-white text-xs font-bold">NB</span>
                              </div>
                              <span>NoBroker.com</span>
                            </div>
                          </th>
                          <th className="text-center p-4 font-semibold">
                            Other Property Management Services in India
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-t bg-muted/30">
                          <td className="p-4 font-medium">Professional Photoshoot of the Property</td>
                          <td className="p-4 text-center">
                            <CheckCircle className="w-6 h-6 text-green-500 mx-auto" />
                          </td>
                          <td className="p-4 text-center">
                            <X className="w-6 h-6 text-red-500 mx-auto" />
                          </td>
                        </tr>
                        <tr className="border-t">
                          <td className="p-4 font-medium">Lifetime Tenant Search</td>
                          <td className="p-4 text-center">
                            <CheckCircle className="w-6 h-6 text-green-500 mx-auto" />
                          </td>
                          <td className="p-4 text-center">
                            <X className="w-6 h-6 text-red-500 mx-auto" />
                          </td>
                        </tr>
                        <tr className="border-t bg-muted/30">
                          <td className="p-4 font-medium">Dedicated Property Manager and FRM</td>
                          <td className="p-4 text-center">
                            <CheckCircle className="w-6 h-6 text-green-500 mx-auto" />
                          </td>
                          <td className="p-4 text-center">
                            <X className="w-6 h-6 text-red-500 mx-auto" />
                          </td>
                        </tr>
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
                    <img 
                      src="/lovable-uploads/46a07bb4-9f10-4614-ad52-73dfb2de4f28.png" 
                      alt="Brajesh Kumar"
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="font-semibold">BRAJESH KUMAR,UK</h4>
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      </div>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        ))}
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
                    <img 
                      src="/lovable-uploads/5b898e4e-d9b6-4366-b58f-176fc3c8a9c3.png" 
                      alt="Naveen Sahay"
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="font-semibold">NAVEEN SAHAY,USA</h4>
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      </div>
                      <div className="flex">
                        {[...Array(4)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        ))}
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

      {/* Target Audience Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-12 text-center">
            Who Should Use This?
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {targetAudience.map((audience, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-8">
                  <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <audience.icon className="w-10 h-10 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    {audience.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {audience.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Table Section */}
      <section className="py-16 px-4 bg-background">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-12 text-center">
            NoBroker vs Others
          </h2>
          
          <div className="max-w-4xl mx-auto">
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-muted/50">
                        <th className="text-left p-4 font-semibold">Features</th>
                        <th className="text-center p-4 font-semibold text-blue-600">NoBroker</th>
                        <th className="text-center p-4 font-semibold">Others</th>
                      </tr>
                    </thead>
                    <tbody>
                      {comparisonData.map((item, index) => (
                        <tr key={index} className="border-t">
                          <td className="p-4 font-medium">{item.feature}</td>
                          <td className="p-4 text-center">
                            {item.nobroker ? (
                              <CheckCircle className="w-6 h-6 text-green-500 mx-auto" />
                            ) : (
                              <X className="w-6 h-6 text-red-500 mx-auto" />
                            )}
                          </td>
                          <td className="p-4 text-center">
                            {item.others ? (
                              <CheckCircle className="w-6 h-6 text-green-500 mx-auto" />
                            ) : (
                              <X className="w-6 h-6 text-red-500 mx-auto" />
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
        </div>
      </section>

      {/* Mobile App Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                Leave the stress behind!
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Manage your properties on the go with our mobile app. Get real-time updates, 
                track payments, and stay connected with your property manager.
              </p>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>Real-time property updates</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>Instant payment notifications</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>Direct communication with managers</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>Monthly reports at your fingertips</span>
                </div>
              </div>

              <div className="flex space-x-4">
                <Button className="flex items-center space-x-2">
                  <Download className="w-4 h-4" />
                  <span>Download for iOS</span>
                </Button>
                <Button variant="outline" className="flex items-center space-x-2">
                  <Download className="w-4 h-4" />
                  <span>Download for Android</span>
                </Button>
              </div>
            </div>
            
            <div className="flex justify-center">
              <img 
                src="/lovable-uploads/Mobile App Preview.png" 
                alt="Mobile App Preview" 
                className="max-w-sm w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 px-4 bg-background">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-12 text-center">
            What Our Clients Say
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <img 
                      src={testimonial.image} 
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <h4 className="font-semibold">{testimonial.name}</h4>
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

      {/* FAQ Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-12 text-center">
            Frequently Asked Questions
          </h2>
          
          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent>
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* Property Management Info Section */}
      <section className="py-16 px-4 bg-background">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto prose prose-lg">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8">
              Property Management in Hyderabad
            </h2>
            <div className="text-muted-foreground space-y-4">
              <p>
                Hyderabad's real estate market has witnessed tremendous growth over the past decade, 
                making it one of India's most sought-after investment destinations. With the rise in 
                property investments, the need for professional property management services has become 
                more crucial than ever.
              </p>
              <p>
                Our comprehensive property management services in Hyderabad are designed to take the 
                hassle out of property ownership. Whether you're an NRI looking to manage your property 
                from abroad, an HNI with multiple properties, or a busy professional who values time, 
                our services ensure your property is well-maintained and profitable.
              </p>
              <p>
                We understand the unique challenges of property management in Hyderabad, from dealing 
                with local regulations to finding reliable tenants. Our experienced team handles 
                everything from tenant verification and rent collection to maintenance and legal 
                compliance, giving you complete peace of mind.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default PropManagement;
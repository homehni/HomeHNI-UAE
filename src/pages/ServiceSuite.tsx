import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useToast } from "@/hooks/use-toast";
import { Building2, Users, FileText, Wrench, PaintBucket, Truck, Clock, CheckCircle, Shield, Star, X, Home, Briefcase, Scale, Hammer, Palette, Package } from "lucide-react";
import Marquee from "@/components/Marquee";
import Header from "@/components/Header";
import { CategorizedImageUpload } from "@/components/CategorizedImageUpload";
const ServiceSuite = () => {
  const [statesData, setStatesData] = useState<any>(null);
  const [selectedState, setSelectedState] = useState("");
  const [selectedStateDesktop, setSelectedStateDesktop] = useState("");
  const [cities, setCities] = useState<string[]>([]);
  const [citiesDesktop, setCitiesDesktop] = useState<string[]>([]);
  const [serviceImages, setServiceImages] = useState({
    gstCopy: [] as File[],
    servicePortfolio: [] as File[]
  });
  const [showThankYouModal, setShowThankYouModal] = useState(false);
  const services = [{
    icon: Scale,
    title: "Legal Services",
    description: "Rental agreements, property legal assistance, tenant verification, and more."
  }, {
    icon: Palette,
    title: "Interior Design",
    description: "Complete interior solutions from design to execution."
  }, {
    icon: Building2,
    title: "Architecture Services",
    description: "Professional architectural design and planning services."
  }, {
    icon: Truck,
    title: "Packers & Movers",
    description: "Safe and reliable relocation services across cities."
  }, {
    icon: PaintBucket,
    title: "Painting & Cleaning",
    description: "Professional painting and deep cleaning services."
  }, {
    icon: Briefcase,
    title: "Property Management",
    description: "Complete property management and maintenance solutions."
  }];
  const targetAudience = [{
    icon: Home,
    title: "Property Owners",
    description: "Need comprehensive property-related services"
  }, {
    icon: Building2,
    title: "Real Estate Developers",
    description: "Require professional service partnerships"
  }, {
    icon: Users,
    title: "Tenants & Buyers",
    description: "Looking for reliable service providers"
  }];
  const comparisonData = [{
    feature: "One-Stop Solution",
    homeHNI: true,
    others: false
  }, {
    feature: "Verified Service Providers",
    homeHNI: true,
    others: false
  }, {
    feature: "Competitive Pricing",
    homeHNI: true,
    others: false
  }, {
    feature: "Quality Assurance",
    homeHNI: true,
    others: false
  }, {
    feature: "24/7 Support",
    homeHNI: true,
    others: false
  }, {
    feature: "Digital Documentation",
    homeHNI: true,
    others: false
  }, {
    feature: "Quick Service Delivery",
    homeHNI: true,
    others: false
  }, {
    feature: "End-to-End Management",
    homeHNI: true,
    others: false
  }];
  const testimonials = [{
    name: "Rajesh Sharma",
    role: "Property Owner",
    image: "/lovable-uploads/46a07bb4-9f10-4614-ad52-73dfb2de4f28.png",
    rating: 5,
    text: "Excellent service! Got my rental agreement done within 24 hours. Highly professional team."
  }, {
    name: "Priya Reddy",
    role: "Home Owner",
    image: "/lovable-uploads/5b898e4e-d9b6-4366-b58f-176fc3c8a9c3.png",
    rating: 5,
    text: "Amazing interior design work. They transformed my home completely within budget!"
  }, {
    name: "Amit Kumar",
    role: "Business Owner",
    image: "/lovable-uploads/6e6c47cd-700c-49d4-bfee-85a69bb8353f.png",
    rating: 5,
    text: "Best packers and movers service. They handled everything professionally and safely."
  }];
  const faqs = [{
    question: "What services are included in the Service Suite?",
    answer: "Our Service Suite includes legal services (rental agreements, property verification), interior design, architecture, packers & movers, painting & cleaning, property management, handover services, and more."
  }, {
    question: "How do I choose the right service provider?",
    answer: "All our service providers are pre-verified and rated by customers. You can review their profiles, ratings, and previous work before making a selection."
  }, {
    question: "What documents do I need to provide?",
    answer: "Required documents vary by service. Generally, you'll need to upload your GST copy, service portfolio (if applicable), and capacity documents. Our team will guide you through the specific requirements."
  }, {
    question: "How long does it take to get service provider recommendations?",
    answer: "Once you submit your requirements with all necessary documents, we provide matched service provider recommendations within 24-48 hours."
  }, {
    question: "Is there any guarantee on the services provided?",
    answer: "Yes, all services come with quality assurance and customer satisfaction guarantee. We also provide post-service support for any issues."
  }];
  const {
    toast
  } = useToast();

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
    const title = "Service Suite - Complete Property Services | Home HNI";
    document.title = title;
    const desc = "Get access to all property-related services including legal, interior design, architecture, packers & movers, and more. One platform for all your needs.";
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
    canonical.setAttribute('href', window.location.origin + '/service-suite');
  }, []);
  const handleFormSubmit = (e: React.FormEvent, isMobile = false) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);

    // Check if at least one image is uploaded
    const totalImages = serviceImages.gstCopy.length + serviceImages.servicePortfolio.length;
    if (totalImages === 0) {
      toast({
        title: "Documents required",
        description: "Please upload at least one document to proceed.",
        variant: "destructive"
      });
      return;
    }
    setShowThankYouModal(true);

    // Reset form and images
    (e.currentTarget as HTMLFormElement).reset();
    setServiceImages({
      gstCopy: [],
      servicePortfolio: []
    });
  };
  return <div className="min-h-screen">
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
                Complete Service Suite
                <br className="hidden md:block" />
                <span className="block">for All Your Property Needs</span>
              </h1>
              <p className="text-lg md:text-xl text-white/90 mb-6">
                From legal services to interior design, get access to verified professionals
                for all your property requirements under one roof.
              </p>
            </div>

            {/* Right: Placeholder for form on desktop */}
            <div className="hidden lg:block lg:justify-self-end">
              <div className="w-full max-w-md h-96"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Sticky Form Container for Large Screens */}
      <div className="hidden lg:block fixed top-32 right-8 z-40 w-[420px]">
        <Card className="w-full rounded-xl shadow-2xl bg-background border-2 border-primary">
          <CardContent className="p-4">
            <h3 className="text-lg font-semibold text-foreground mb-1 text-uniform-center">Are you Service Provider?</h3>
            <p className="text-xs text-muted-foreground mb-3 text-uniform-center">Submit your requirements & get matched</p>

            <form className="space-y-3" onSubmit={e => handleFormSubmit(e, false)}>
              <div className="flex gap-2">
                <Select defaultValue="+91" name="countryCode">
                  <SelectTrigger className="w-28"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="+91">🇮🇳 +91</SelectItem>
                    <SelectItem value="+1">🇺🇸 +1</SelectItem>
                    <SelectItem value="+44">🇬🇧 +44</SelectItem>
                  </SelectContent>
                </Select>
                <Input name="phone" type="tel" placeholder="Phone Number" className="flex-1" required />
              </div>

              <Input name="email" type="email" placeholder="Email ID" required />
              <Input name="text" type="CompanyName" placeholder="Company Name" required />

              <Select name="serviceType" required>
                <SelectTrigger><SelectValue placeholder="Select Service Type" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="legal-services">Legal Services</SelectItem>
                  <SelectItem value="interior-design">Interior Design</SelectItem>
                  <SelectItem value="architecture">Architecture Services</SelectItem>
                  <SelectItem value="packers-movers">Packers & Movers</SelectItem>
                  <SelectItem value="painting-cleaning">Painting & Cleaning</SelectItem>
                  <SelectItem value="property-management">Property Management</SelectItem>
                  <SelectItem value="handover-services">Handover Services</SelectItem>
                  <SelectItem value="rent-receipts">Rent Receipts</SelectItem>
                  <SelectItem value="other">Other Services</SelectItem>
                </SelectContent>
              </Select>

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
                    {statesData && Object.keys(statesData).map((state: string) => <SelectItem key={state} value={state}>
                        {state}
                      </SelectItem>)}
                  </SelectContent>
                </Select>

                <Select name="city">
                  <SelectTrigger className="flex-1"><SelectValue placeholder="City" /></SelectTrigger>
                  <SelectContent>
                    {citiesDesktop.map((city: string) => <SelectItem key={city} value={city}>
                        {city}
                      </SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <CategorizedImageUpload images={serviceImages} onImagesChange={setServiceImages} className="mt-2" />

              <Button type="submit" className="w-full h-9 text-sm">Submit Requirements</Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Mobile Form - Static below hero */}
      <section className="lg:hidden px-4 py-8 bg-background">
        <div className="container mx-auto max-w-xl px-4">
          <Card className="w-full rounded-2xl shadow-xl border-2 border-primary bg-card">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-foreground mb-2 text-uniform-center">Need Service Providers?</h3>
              <p className="text-sm text-muted-foreground mb-6 text-uniform-center">Submit your requirements & get matched</p>

              <form className="space-y-4" onSubmit={e => handleFormSubmit(e, true)}>
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
                  <Input name="phone" type="tel" placeholder="Phone Number" className="flex-1 h-12 text-base bg-background" required />
                </div>

                <Input name="email" type="email" placeholder="Email ID" className="h-12 text-base bg-background" required />

                <Select name="serviceType" required>
                  <SelectTrigger className="h-12 bg-background">
                    <SelectValue placeholder="Select Service Type" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border shadow-lg">
                    <SelectItem value="legal-services">Legal Services</SelectItem>
                    <SelectItem value="interior-design">Interior Design</SelectItem>
                    <SelectItem value="architecture">Architecture Services</SelectItem>
                    <SelectItem value="packers-movers">Packers & Movers</SelectItem>
                    <SelectItem value="painting-cleaning">Painting & Cleaning</SelectItem>
                    <SelectItem value="property-management">Property Management</SelectItem>
                    <SelectItem value="handover-services">Handover Services</SelectItem>
                    <SelectItem value="rent-receipts">Rent Receipts</SelectItem>
                    <SelectItem value="other">Other Services</SelectItem>
                  </SelectContent>
                </Select>

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
                      {statesData && Object.keys(statesData).map((state: string) => <SelectItem key={state} value={state}>
                          {state}
                        </SelectItem>)}
                    </SelectContent>
                  </Select>

                  <Select name="city">
                    <SelectTrigger className="flex-1 h-12 bg-background">
                      <SelectValue placeholder="City" />
                    </SelectTrigger>
                    <SelectContent className="bg-background border shadow-lg">
                      {cities.map((city: string) => <SelectItem key={city} value={city}>
                          {city}
                        </SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>

                <CategorizedImageUpload images={serviceImages} onImagesChange={setServiceImages} className="mt-3" />

                <Button type="submit" className="w-full h-11 text-sm font-semibold bg-red-600 hover:bg-red-700 text-white mt-4">
                  Submit Requirements
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
                Why choose our Service Suite?
              </h2>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                    <Shield className="w-5 h-5 text-red-600" />
                  </div>
                  <h3 className="text-base font-semibold text-foreground">
                    Verified Professionals
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    All service providers are pre-verified and background checked
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                    <Clock className="w-5 h-5 text-red-600" />
                  </div>
                  <h3 className="text-base font-semibold text-foreground">
                    Quick Matching
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Get matched with the right service providers within 24 hours
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-red-600" />
                  </div>
                  <h3 className="text-base font-semibold text-foreground">
                    Quality Assurance
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    100% satisfaction guarantee with post-service support
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-red-600" />
                  </div>
                  <h3 className="text-base font-semibold text-foreground">
                    End-to-End Support
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Complete project management from start to finish
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-red-600" />
                  </div>
                  <h3 className="text-base font-semibold text-foreground">
                    Digital Documentation
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Paperless processes with digital contracts and invoicing
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                    <Wrench className="w-5 h-5 text-red-600" />
                  </div>
                  <h3 className="text-base font-semibold text-foreground">
                    One-Stop Solution
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    All property services available under one platform
                  </p>
                </div>
              </div>
            </div>
            
            {/* Right side spacing for sticky form */}
            <div className="hidden lg:block"></div>
          </div>
        </div>
      </section>

      {/* Service Info Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div className="max-w-3xl">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8">
                Complete Property Service Ecosystem
              </h2>
              <div className="text-muted-foreground space-y-4 text-sm leading-relaxed text-justify">
                <p>
                  Whether you need legal documentation, interior design, architectural services, 
                  or reliable packers and movers, our Service Suite connects you with verified 
                  professionals who understand your specific requirements.
                </p>
                <p>
                  Our curated network of service providers undergoes rigorous verification to ensure 
                  quality, reliability, and professionalism. From initial consultation to project 
                  completion, we provide end-to-end support to make your experience seamless.
                </p>
                <p>
                  With transparent pricing, digital documentation, and quality assurance, managing 
                  all your property-related services has never been easier. Join thousands of 
                  satisfied customers who trust our platform for their service needs.
                </p>
              </div>
            </div>
            
            {/* Right side spacing for sticky form */}
            <div className="hidden lg:block"></div>
          </div>
        </div>
      </section>

      {/* Our Services */}
      <section className="py-16 px-4 bg-background">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div className="max-w-3xl">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8">
                Our Service Categories
              </h2>
              <div className="grid gap-6">
                {services.map((service, index) => {
                const IconComponent = service.icon;
                return <div key={index} className="flex gap-4 p-6 bg-card rounded-lg border">
                      <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <IconComponent className="w-6 h-6 text-red-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-foreground mb-2">{service.title}</h3>
                        <p className="text-muted-foreground text-sm">{service.description}</p>
                      </div>
                    </div>;
              })}
              </div>
            </div>
            
            {/* Right side spacing for sticky form */}
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
                  <div className="text-4xl md:text-5xl font-bold text-red-600 mb-2">5000+</div>
                  <p className="text-muted-foreground">Projects Completed</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl md:text-5xl font-bold text-red-600 mb-2">800+</div>
                  <p className="text-muted-foreground">Verified Service Providers</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl md:text-5xl font-bold text-red-600 mb-2">24hrs</div>
                  <p className="text-muted-foreground">Average Response Time</p>
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
      <section className="py-16 px-4 bg-background">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div className="max-w-3xl">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8">
                Why Home HNI Service Suite is Better
              </h2>
              <div className="bg-card rounded-xl border overflow-hidden">
                <div className="grid grid-cols-3 gap-4 p-4 bg-muted/50 font-semibold text-sm">
                  <div>Features</div>
                  <div className="text-center">Home HNI</div>
                  <div className="text-center">Others</div>
                </div>
                {comparisonData.map((item, index) => <div key={index} className="grid grid-cols-3 gap-4 p-4 border-t text-sm">
                    <div className="text-foreground">{item.feature}</div>
                    <div className="text-center">
                      {item.homeHNI ? <CheckCircle className="w-4 h-4 text-red-600 mx-auto" /> : <X className="w-4 h-4 text-red-500 mx-auto" />}
                    </div>
                    <div className="text-center">
                      {item.others ? <CheckCircle className="w-4 h-4 text-red-600 mx-auto" /> : <X className="w-4 h-4 text-red-500 mx-auto" />}
                    </div>
                  </div>)}
              </div>
            </div>
            
            {/* Right side spacing for sticky form */}
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
                {testimonials.map((testimonial, index) => <Card key={index} className="p-6">
                    <CardContent className="p-0">
                      <div className="flex items-start gap-4">
                        <img src={testimonial.image} alt={testimonial.name} className="w-12 h-12 rounded-full object-cover" />
                        <div className="flex-1">
                          <div className="flex items-center gap-1 mb-2">
                            {[...Array(testimonial.rating)].map((_, i) => <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)}
                          </div>
                          <p className="text-muted-foreground text-sm mb-3">"{testimonial.text}"</p>
                          <div>
                            <p className="font-semibold text-sm">{testimonial.name}</p>
                            <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>)}
              </div>
            </div>
            
            {/* Right side spacing for sticky form */}
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
                return <div key={index} className="flex gap-4 p-6 bg-card rounded-lg border">
                      <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <IconComponent className="w-6 h-6 text-red-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-foreground mb-2">{audience.title}</h3>
                        <p className="text-muted-foreground text-sm">{audience.description}</p>
                      </div>
                    </div>;
              })}
              </div>
            </div>
            
            {/* Right side spacing for sticky form */}
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
                {faqs.map((faq, index) => <AccordionItem key={index} value={`item-${index}`} className="bg-card border rounded-lg px-6">
                    <AccordionTrigger className="text-left font-semibold text-sm py-4">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground text-sm pb-4">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>)}
              </Accordion>
            </div>
            
            {/* Right side spacing for sticky form */}
            <div className="hidden lg:block"></div>
          </div>
        </div>
      </section>

      {/* Service Tags Section */}
      <section className="py-16 px-4 bg-background">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div className="max-w-3xl">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8">
                Property Services
              </h2>
              
              <div className="space-y-6 mb-8">
                <div className="flex flex-wrap gap-3">
                  <span className="px-4 py-2 bg-muted rounded-full text-sm">Legal Services in Hyderabad</span>
                  <span className="px-4 py-2 bg-muted rounded-full text-sm">Interior Design in Bangalore</span>
                  <span className="px-4 py-2 bg-muted rounded-full text-sm">Architects in Mumbai</span>
                </div>
                <div className="flex flex-wrap gap-3">
                  <span className="px-4 py-2 bg-muted rounded-full text-sm">Packers Movers in Pune</span>
                  <span className="px-4 py-2 bg-muted rounded-full text-sm">Property Management in Delhi</span>
                  <span className="px-4 py-2 bg-muted rounded-full text-sm">Painting Services in Chennai</span>
                </div>
                <div className="flex flex-wrap gap-3">
                  <span className="px-4 py-2 bg-muted rounded-full text-sm">Rental Agreement Services</span>
                  <span className="px-4 py-2 bg-muted rounded-full text-sm">Home Interior Design</span>
                  <span className="px-4 py-2 bg-muted rounded-full text-sm">Commercial Architecture</span>
                </div>
                <div className="flex flex-wrap gap-3">
                  <span className="px-4 py-2 bg-muted rounded-full text-sm">Residential Packers</span>
                  <span className="px-4 py-2 bg-muted rounded-full text-sm">Deep Cleaning Services</span>
                  <span className="px-4 py-2 bg-muted rounded-full text-sm">Property Maintenance</span>
                </div>
                <div className="flex flex-wrap gap-3">
                  <span className="px-4 py-2 bg-muted rounded-full text-sm">Tenant Verification</span>
                  <span className="px-4 py-2 bg-muted rounded-full text-sm">Office Interior</span>
                  <span className="px-4 py-2 bg-muted rounded-full text-sm">Handover Services</span>
                </div>
              </div>

              {/* <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-6">
                Get Started with Our Service Suite Today
               </h3>
                             <p className="text-muted-foreground mb-8 leading-relaxed">
                Transform your property experience with our comprehensive service suite. 
                Whether you're a homeowner, investor, or business owner, we have the right 
                professionals for all your needs.
               </p>
               <Button className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 text-lg font-semibold">
                Submit Your Requirements Now
               </Button> */}
            </div>
            
            {/* Right side spacing for sticky form */}
            <div className="hidden lg:block"></div>
          </div>
        </div>
      </section>

      {/* Thank You Modal */}
      {showThankYouModal && <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 text-center">
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">Thank You!</h3>
            <p className="text-gray-600 mb-6">
              Your service request has been submitted successfully. Our team will review your requirements and get back to you soon.
            </p>
            <Button onClick={() => setShowThankYouModal(false)} className="bg-red-600 hover:bg-red-700 text-white font-semibold px-8 py-2">
              OK
            </Button>
          </div>
        </div>}
    </div>;
};
export default ServiceSuite;
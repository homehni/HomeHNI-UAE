import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useToast } from "@/hooks/use-toast";
import { Building2, Users, Ruler, Palette, Home, FileText, MapPin, Crown, Clock, CheckCircle, Shield, Star, X, Plus, Minus, Globe, Shield as ShieldCheck, Headphones, Smartphone, Download, PenTool, Compass, DraftingCompass } from "lucide-react";
import Marquee from "@/components/Marquee";
import Header from "@/components/Header";

const Architects = () => {
  // Form state for proper reset functionality
  const [formData, setFormData] = useState({
    countryCode: "+91",
    projectType: "",
    state: "",
    city: ""
  });

  // Mobile form state
  const [mobileFormData, setMobileFormData] = useState({
    countryCode: "+91", 
    projectType: "",
    state: "",
    city: ""
  });
  const majorCities = [
    "Mumbai", "Delhi", "Bangalore", "Hyderabad", "Ahmedabad", "Chennai", "Kolkata", "Surat", "Pune", "Jaipur",
    "Lucknow", "Kanpur", "Nagpur", "Indore", "Thane", "Bhopal", "Visakhapatnam", "Pimpri-Chinchwad", "Patna", "Vadodara",
    "Ghaziabad", "Ludhiana", "Agra", "Nashik", "Faridabad", "Meerut", "Rajkot", "Kalyan-Dombivli", "Vasai-Virar", "Varanasi",
    "Srinagar", "Aurangabad", "Dhanbad", "Amritsar", "Navi Mumbai", "Allahabad", "Ranchi", "Howrah", "Coimbatore", "Jabalpur",
    "Gwalior", "Vijayawada", "Jodhpur", "Madurai", "Raipur", "Kota", "Guwahati", "Chandigarh", "Solapur", "Hubli-Dharwad"
  ];

  const services = [{
    icon: Home,
    title: "Residential Design",
    description: "Custom home designs tailored to your lifestyle and needs."
  }, {
    icon: Building2,
    title: "Commercial Architecture",
    description: "Professional office buildings and commercial spaces."
  }, {
    icon: Ruler,
    title: "Interior Design",
    description: "Complete interior planning and space optimization."
  }, {
    icon: Palette,
    title: "Renovation & Remodeling",
    description: "Transform existing spaces with modern design concepts."
  }, {
    icon: PenTool,
    title: "3D Visualization",
    description: "Photorealistic renderings and virtual walkthroughs."
  }, {
    icon: FileText,
    title: "Project Management",
    description: "End-to-end construction supervision and management."
  }];
  const targetAudience = [{
    icon: Home,
    title: "Homeowners",
    description: "Building their dream homes with professional design"
  }, {
    icon: Building2,
    title: "Real Estate Developers",
    description: "Creating attractive and functional developments"
  }, {
    icon: Users,
    title: "Business Owners",
    description: "Designing commercial spaces that inspire productivity"
  }];
  const comparisonData = [{
    feature: "Personalized Design Consultation",
    homeHNI: true,
    others: false
  }, {
    feature: "3D Modeling & Visualization",
    homeHNI: true,
    others: false
  }, {
    feature: "Sustainable Design Solutions",
    homeHNI: true,
    others: false
  }, {
    feature: "Dedicated Project Manager",
    homeHNI: true,
    others: false
  }, {
    feature: "Building Permit Assistance",
    homeHNI: true,
    others: false
  }, {
    feature: "Cost-Effective Planning",
    homeHNI: true,
    others: false
  }, {
    feature: "On-Site Construction Support",
    homeHNI: true,
    others: false
  }, {
    feature: "Post-Completion Service",
    homeHNI: true,
    others: false
  }];
  const testimonials = [{
    name: "Rahul Sharma",
    role: "Homeowner",
    image: "/lovable-uploads/46a07bb4-9f10-4614-ad52-73dfb2de4f28.png",
    rating: 5,
    text: "Our architect created the perfect family home. The design exceeded our expectations!"
  }, {
    name: "Priya Nair",
    role: "Developer",
    image: "/lovable-uploads/5b898e4e-d9b6-4366-b58f-176fc3c8a9c3.png",
    rating: 5,
    text: "Professional architectural services that delivered our commercial project on time and budget."
  }, {
    name: "Vikram Singh",
    role: "Business Owner",
    image: "/lovable-uploads/6e6c47cd-700c-49d4-bfee-85a69bb8353f.png",
    rating: 5,
    text: "The office design transformed our workspace. Productivity increased significantly!"
  }];
  const faqs = [{
    question: "How much does architectural design cost?",
    answer: "Architectural fees typically range from 8-15% of the construction cost, depending on the project complexity and scope of services required."
  }, {
    question: "How long does the design process take?",
    answer: "Design timelines vary by project size. Residential homes typically take 4-8 weeks, while commercial projects may take 8-16 weeks for complete design development."
  }, {
    question: "Do you provide construction supervision?",
    answer: "Yes, we offer comprehensive construction supervision services to ensure your project is built according to the approved designs and specifications."
  }, {
    question: "Can you help with building permits?",
    answer: "Absolutely! We assist with all necessary approvals including building permits, NOCs, and compliance with local building regulations."
  }, {
    question: "Do you work on renovation projects?",
    answer: "Yes, we specialize in renovation and remodeling projects, helping transform existing spaces with modern design solutions."
  }];
  const {
    toast
  } = useToast();
  useEffect(() => {
    const title = "Professional Architects & Architectural Services | Home HNI";
    document.title = title;
    const desc = "Connect with India's top architects for residential, commercial, and renovation projects. Get custom designs, 3D visualization, and expert consultation.";
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
    canonical.setAttribute('href', window.location.origin + '/architects');
  }, []);
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
                Professional Architectural Services
                <br className="hidden md:block" />
                <span className="block">for Your Dream Project</span>
              </h1>
              <p className="text-lg md:text-xl text-white/90 mb-6">
                Connect with India's top architects for residential, commercial, and renovation projects.
                Get custom designs, 3D visualization, and expert consultation.
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
        <Card className="w-full rounded-xl shadow-2xl bg-background border-2 border-primary">
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold text-foreground mb-2">Need an architect?</h3>
            <p className="text-sm text-muted-foreground mb-4">Fill the form & get a free consultation</p>

            <form className="space-y-4" onSubmit={e => {
            e.preventDefault();
            const form = e.currentTarget as HTMLFormElement;
            toast({
              title: "Request submitted",
              description: "Our architects will contact you within 24 hours.",
              className: "bg-white border border-green-200 shadow-lg rounded-lg",
              style: {
                borderLeft: "12px solid hsl(120, 100%, 25%)",
              },
            });
            
            // Reset form fields
            form.reset();
            
            // Reset controlled select components
            setFormData({
              countryCode: "+91",
              projectType: "",
              state: "",
              city: ""
            });
          }}>
              <Input id="arch-name" name="name" placeholder="Name" required />

              <div className="flex gap-2">
                <Select value={formData.countryCode} onValueChange={(value) => setFormData(prev => ({ ...prev, countryCode: value }))}>
                  <SelectTrigger className="w-28"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="+91">🇮🇳 +91</SelectItem>
                    <SelectItem value="+1">🇺🇸 +1</SelectItem>
                    <SelectItem value="+44">🇬🇧 +44</SelectItem>
                  </SelectContent>
                </Select>
                <Input id="arch-phone" name="phone" type="tel" placeholder="Phone Number" className="flex-1" required />
              </div>

              <Input id="arch-email" name="email" type="email" placeholder="Email ID" required />

              <div className="flex gap-2">
                <Select value={formData.projectType} onValueChange={(value) => setFormData(prev => ({ ...prev, projectType: value }))} required>
                  <SelectTrigger id="arch-project-type" className="flex-1"><SelectValue placeholder="Project Type" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="residential">Residential Design</SelectItem>
                    <SelectItem value="commercial">Commercial Architecture</SelectItem>
                    <SelectItem value="renovation">Renovation & Remodeling</SelectItem>
                    <SelectItem value="interior">Interior Design</SelectItem>
                    <SelectItem value="3d-visualization">3D Visualization</SelectItem>
                    <SelectItem value="project-management">Project Management</SelectItem>
                    <SelectItem value="other">Others</SelectItem>
                  </SelectContent>
                </Select>
                <Input id="arch-location" name="location" placeholder="Project Location" className="flex-1" />
              </div>

              <div className="flex gap-2">
                <Select value={formData.state} onValueChange={(value) => setFormData(prev => ({ ...prev, state: value }))}>
                  <SelectTrigger id="arch-state" className="flex-1"><SelectValue placeholder="State" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="andhra-pradesh">Andhra Pradesh</SelectItem>
                    <SelectItem value="karnataka">Karnataka</SelectItem>
                    <SelectItem value="tamil-nadu">Tamil Nadu</SelectItem>
                    <SelectItem value="telangana">Telangana</SelectItem>
                    <SelectItem value="maharashtra">Maharashtra</SelectItem>
                    <SelectItem value="gujarat">Gujarat</SelectItem>
                    <SelectItem value="rajasthan">Rajasthan</SelectItem>
                    <SelectItem value="delhi">Delhi</SelectItem>
                    <SelectItem value="west-bengal">West Bengal</SelectItem>
                    <SelectItem value="uttar-pradesh">Uttar Pradesh</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={formData.city} onValueChange={(value) => setFormData(prev => ({ ...prev, city: value }))}>
                  <SelectTrigger id="arch-city" className="flex-1"><SelectValue placeholder="City" /></SelectTrigger>
                  <SelectContent>
                    {majorCities.map((city) => (
                      <SelectItem key={city} value={city.toLowerCase()}>{city}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button type="submit" className="w-full bg-red-800 hover:bg-red-900 text-white">Get Free Consultation!</Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Mobile Form - Static below hero */}
      <section className="lg:hidden px-4 py-8 bg-background">
        <div className="container mx-auto max-w-xl px-4">
          <Card className="w-full rounded-2xl shadow-xl border-2 border-primary bg-card">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-foreground mb-3">Need an architect?</h3>
              <p className="text-base text-muted-foreground mb-8">Fill the form & get a free consultation</p>

              <form className="space-y-5" onSubmit={e => {
              e.preventDefault();
              const form = e.currentTarget as HTMLFormElement;
              toast({
                title: "Request submitted",
                description: "Our architects will contact you within 24 hours.",
                className: "bg-white border border-green-200 shadow-lg rounded-lg",
                style: {
                  borderLeft: "12px solid hsl(120, 100%, 25%)",
                },
              });
              
              // Reset form fields
              form.reset();
              
              // Reset controlled select components
              setMobileFormData({
                countryCode: "+91",
                projectType: "",
                state: "",
                city: ""
              });
            }}>
                <Input id="arch-name-mobile" name="name" placeholder="Name" className="h-12 text-base bg-background" required />

                <div className="flex gap-3">
                  <Select value={mobileFormData.countryCode} onValueChange={(value) => setMobileFormData(prev => ({ ...prev, countryCode: value }))}>
                    <SelectTrigger className="w-32 h-12 bg-background">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-background border shadow-lg">
                      <SelectItem value="+91">🇮🇳 +91</SelectItem>
                      <SelectItem value="+1">🇺🇸 +1</SelectItem>
                      <SelectItem value="+44">🇬🇧 +44</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input id="arch-phone-mobile" name="phone" type="tel" placeholder="Phone Number" className="flex-1 h-12 text-base bg-background" required />
                </div>

                <Input id="arch-email-mobile" name="email" type="email" placeholder="Email ID" className="h-12 text-base bg-background" required />

                <div className="flex gap-3">
                  <Select value={mobileFormData.projectType} onValueChange={(value) => setMobileFormData(prev => ({ ...prev, projectType: value }))} required>
                    <SelectTrigger id="arch-project-type-mobile" className="flex-1 h-12 bg-background">
                      <SelectValue placeholder="Project Type" />
                    </SelectTrigger>
                    <SelectContent className="bg-background border shadow-lg">
                      <SelectItem value="residential">Residential Design</SelectItem>
                      <SelectItem value="commercial">Commercial Architecture</SelectItem>
                      <SelectItem value="renovation">Renovation & Remodeling</SelectItem>
                      <SelectItem value="interior">Interior Design</SelectItem>
                      <SelectItem value="3d-visualization">3D Visualization</SelectItem>
                      <SelectItem value="project-management">Project Management</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input id="arch-location-mobile" name="location" placeholder="Project Location" className="flex-1 h-12 text-base bg-background" />
                </div>

                <div className="flex gap-3">
                  <Select value={mobileFormData.state} onValueChange={(value) => setMobileFormData(prev => ({ ...prev, state: value }))}>
                    <SelectTrigger id="arch-state-mobile" className="flex-1 h-12 bg-background">
                      <SelectValue placeholder="State" />
                    </SelectTrigger>
                    <SelectContent className="bg-background border shadow-lg">
                      <SelectItem value="andhra-pradesh">Andhra Pradesh</SelectItem>
                      <SelectItem value="karnataka">Karnataka</SelectItem>
                      <SelectItem value="tamil-nadu">Tamil Nadu</SelectItem>
                      <SelectItem value="telangana">Telangana</SelectItem>
                      <SelectItem value="maharashtra">Maharashtra</SelectItem>
                      <SelectItem value="gujarat">Gujarat</SelectItem>
                      <SelectItem value="rajasthan">Rajasthan</SelectItem>
                      <SelectItem value="delhi">Delhi</SelectItem>
                      <SelectItem value="west-bengal">West Bengal</SelectItem>
                      <SelectItem value="uttar-pradesh">Uttar Pradesh</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={mobileFormData.city} onValueChange={(value) => setMobileFormData(prev => ({ ...prev, city: value }))}>
                    <SelectTrigger id="arch-city-mobile" className="flex-1 h-12 bg-background">
                      <SelectValue placeholder="City" />
                    </SelectTrigger>
                    <SelectContent className="bg-background border shadow-lg">
                      {majorCities.map((city) => (
                        <SelectItem key={city} value={city.toLowerCase()}>{city}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button type="submit" className="w-full h-12 text-base font-semibold bg-red-800 hover:bg-red-900 text-white mt-6">
                  Get Free Consultation!
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
                Why choose our architectural services?
              </h2>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                    <PenTool className="w-5 h-5 text-red-600" />
                  </div>
                  <h3 className="text-base font-semibold text-foreground">
                    Personalized Design
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Custom architectural solutions tailored to your vision and needs
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                    <Compass className="w-5 h-5 text-red-600" />
                  </div>
                  <h3 className="text-base font-semibold text-foreground">
                    3D Visualization
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Photorealistic renderings and virtual walkthroughs before construction
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-red-600" />
                  </div>
                  <h3 className="text-base font-semibold text-foreground">
                    Sustainable Design
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Eco-friendly and energy-efficient architectural solutions
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-red-600" />
                  </div>
                  <h3 className="text-base font-semibold text-foreground">
                    Expert Team
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Experienced architects and project managers at your service
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-red-600" />
                  </div>
                  <h3 className="text-base font-semibold text-foreground">
                    Permit Assistance
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Complete help with building permits and regulatory approvals
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                    <Clock className="w-5 h-5 text-red-600" />
                  </div>
                  <h3 className="text-base font-semibold text-foreground">
                    Timely Delivery
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    On-time project completion with regular progress updates
                  </p>
                </div>
              </div>
            </div>
            
            {/* Right side spacing for sticky form */}
            <div className="hidden lg:block"></div>
          </div>
        </div>
      </section>

      {/* Architectural Services Info Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div className="max-w-3xl">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8">
                Comprehensive Architectural Solutions
              </h2>
              <div className="text-muted-foreground space-y-4 text-sm leading-relaxed">
                <p className="text-justify">
                  Whether you're planning to build your dream home, design a commercial space, or renovate your 
                  existing property, our team of experienced architects is here to bring your vision to life. 
                  With expertise in residential, commercial, and sustainable design, we deliver innovative 
                  architectural solutions that blend functionality with aesthetic appeal.
                </p>
                <p className="text-justify">
                  Our comprehensive services include conceptual design, detailed architectural drawings, 
                  3D visualization, interior planning, and project management. We work closely with you 
                  throughout the entire process, from initial consultation to final construction, ensuring 
                  your project exceeds expectations while staying within budget and timeline.
                </p>
                <p className="text-justify">
                  With a portfolio of 500+ successful projects across India, our architects specialize in 
                  creating spaces that are not only visually stunning but also highly functional and 
                  environmentally conscious. Trust us to transform your architectural dreams into reality.
                </p>
              </div>
            </div>
            
            {/* Right side spacing for sticky form */}
            <div className="hidden lg:block"></div>
          </div>
        </div>
      </section>

      {/* Our Architectural Services Section */}
      <section className="py-16 px-4 bg-background">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div className="max-w-3xl">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8">
                Our Architectural Services
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {services.map((service, index) => <div key={index} className="p-4 border border-border rounded-lg bg-card hover:shadow-md transition-shadow">
                    <service.icon className="w-8 h-8 text-red-600 mb-3" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">{service.title}</h3>
                    <p className="text-sm text-muted-foreground">{service.description}</p>
                  </div>)}
              </div>
            </div>
            
            {/* Right side spacing for sticky form */}
            <div className="hidden lg:block"></div>
          </div>
        </div>
      </section>

      {/* Trusted by Thousands Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div className="max-w-3xl">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8">
                Trusted by Thousands
              </h2>
              <div className="grid grid-cols-2 gap-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-red-600 mb-2">500+</div>
                  <p className="text-sm text-muted-foreground">Projects Completed</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-red-600 mb-2">50+</div>
                  <p className="text-sm text-muted-foreground">Expert Architects</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-red-600 mb-2">15+</div>
                  <p className="text-sm text-muted-foreground">Cities Covered</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-red-600 mb-2">98%</div>
                  <p className="text-sm text-muted-foreground">Client Satisfaction</p>
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
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8">
                Why Choose HomeHNI Architects?
              </h2>
              
              <div className="overflow-x-auto">
                <table className="w-full bg-card rounded-lg border border-border">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left p-4 font-semibold text-foreground">Features</th>
                      <th className="text-center p-4 font-semibold text-red-600">HomeHNI</th>
                      <th className="text-center p-4 font-semibold text-muted-foreground">Others</th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparisonData.map((item, index) => <tr key={index} className="border-b border-border hover:bg-muted/30">
                        <td className="p-4 text-sm text-foreground">{item.feature}</td>
                        <td className="p-4 text-center">
                          {item.homeHNI ? <CheckCircle className="w-5 h-5 text-green-500 mx-auto" /> : <X className="w-5 h-5 text-red-500 mx-auto" />}
                        </td>
                        <td className="p-4 text-center">
                          {item.others ? <CheckCircle className="w-5 h-5 text-green-500 mx-auto" /> : <X className="w-5 h-5 text-red-500 mx-auto" />}
                        </td>
                      </tr>)}
                  </tbody>
                </table>
              </div>
            </div>
            
            {/* Right side spacing for sticky form */}
            <div className="hidden lg:block"></div>
          </div>
        </div>
      </section>

      {/* Customer Testimonials Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div className="max-w-3xl">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8">
                Customer Testimonials
              </h2>
              
              <div className="space-y-6">
                {testimonials.map((testimonial, index) => <div key={index} className="p-6 bg-card rounded-lg border border-border">
                    <div className="flex items-center mb-4">
                      <img src={testimonial.image} alt={testimonial.name} className="w-12 h-12 rounded-full mr-4 object-cover" />
                      <div>
                        <h4 className="font-semibold text-foreground">{testimonial.name}</h4>
                        <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                      </div>
                      <div className="ml-auto flex items-center">
                        {[...Array(testimonial.rating)].map((_, i) => <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />)}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground italic">"{testimonial.text}"</p>
                  </div>)}
              </div>
            </div>
            
            {/* Right side spacing for sticky form */}
            <div className="hidden lg:block"></div>
          </div>
        </div>
      </section>

      {/* Target Audience Section */}
      <section className="py-16 px-4 bg-background">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div className="max-w-3xl">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8">
                Who We Serve
              </h2>
              
              <div className="space-y-6">
                {targetAudience.map((audience, index) => <div key={index} className="flex items-start space-x-4 p-4 bg-card rounded-lg border border-border">
                    <audience.icon className="w-8 h-8 text-red-600 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-2">{audience.title}</h3>
                      <p className="text-sm text-muted-foreground">{audience.description}</p>
                    </div>
                  </div>)}
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
              
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => <AccordionItem key={index} value={`item-${index}`} className="border-b border-border">
                    <AccordionTrigger className="text-left hover:text-red-600 text-foreground">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-sm text-muted-foreground">
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
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8">
                Service Tags
              </h2>
              
              <div className="flex flex-wrap gap-2">
                {["Residential Architecture", "Commercial Design", "Interior Planning", "3D Visualization", "Sustainable Design", "Project Management", "Building Permits", "Construction Supervision", "Renovation Services", "Space Planning", "Architectural Drawings", "Design Consultation", "Green Building", "Modern Architecture", "Traditional Design", "Cost Estimation", "Timeline Planning", "Quality Assurance"].map((tag, index) => <span key={index} className="px-3 py-1 bg-red-100 text-red-700 text-xs rounded-full">
                    {tag}
                  </span>)}
              </div>
            </div>
            
            {/* Right side spacing for sticky form */}
            <div className="hidden lg:block"></div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      

      
    </div>;
};
export default Architects;
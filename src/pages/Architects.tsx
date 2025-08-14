import { useEffect } from "react";
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

  const { toast } = useToast();

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
        <Card className="w-full rounded-xl shadow-2xl bg-background border">
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold text-foreground mb-2">Need an architect?</h3>
            <p className="text-sm text-muted-foreground mb-4">Fill the form & get a free consultation</p>

            <form className="space-y-4" onSubmit={e => {
              e.preventDefault();
              toast({
                title: "Request submitted",
                description: "Our architects will contact you within 24 hours."
              });
              (e.currentTarget as HTMLFormElement).reset();
            }}>
              <Input id="arch-name" name="name" placeholder="Name" required />

              <div className="flex gap-2">
                <Select defaultValue="+91" name="countryCode">
                  <SelectTrigger className="w-28"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="+91">🇮🇳 +91</SelectItem>
                    <SelectItem value="+1">🇺🇸 +1</SelectItem>
                    <SelectItem value="+44">🇬🇧 +44</SelectItem>
                  </SelectContent>
                </Select>
                <Input id="arch-phone" name="phone" type="tel" placeholder="Phone Number" className="flex-1" required />
              </div>

              <Input id="arch-email" name="email" type="email" placeholder="Email ID" />

              <Select name="projectType">
                <SelectTrigger id="arch-project-type"><SelectValue placeholder="Project Type" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="residential">Residential Design</SelectItem>
                  <SelectItem value="commercial">Commercial Architecture</SelectItem>
                  <SelectItem value="renovation">Renovation & Remodeling</SelectItem>
                  <SelectItem value="interior">Interior Design</SelectItem>
                  <SelectItem value="3d-visualization">3D Visualization</SelectItem>
                  <SelectItem value="project-management">Project Management</SelectItem>
                </SelectContent>
              </Select>

              <Input id="arch-location" name="location" placeholder="Project Location" />

              <Button type="submit" className="w-full">Get Free Consultation!</Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Mobile Form - Static below hero */}
      <section className="lg:hidden px-4 py-8 bg-background">
        <div className="container mx-auto max-w-xl px-4">
          <Card className="w-full rounded-2xl shadow-xl border-0 bg-card">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-foreground mb-3">Need an architect?</h3>
              <p className="text-base text-muted-foreground mb-8">Fill the form & get a free consultation</p>

              <form className="space-y-5" onSubmit={e => {
                e.preventDefault();
                toast({
                  title: "Request submitted",
                  description: "Our architects will contact you within 24 hours."
                });
                (e.currentTarget as HTMLFormElement).reset();
              }}>
                <Input 
                  id="arch-name-mobile" 
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
                    id="arch-phone-mobile" 
                    name="phone" 
                    type="tel" 
                    placeholder="Phone Number" 
                    className="flex-1 h-12 text-base bg-background" 
                    required 
                  />
                </div>

                <Input 
                  id="arch-email-mobile" 
                  name="email" 
                  type="email" 
                  placeholder="Email ID" 
                  className="h-12 text-base bg-background"
                />

                <Select name="projectType">
                  <SelectTrigger id="arch-project-type-mobile" className="h-12 bg-background">
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

                <Input 
                  id="arch-location-mobile" 
                  name="location" 
                  placeholder="Project Location" 
                  className="h-12 text-base bg-background"
                />

                <Button type="submit" className="w-full h-12 text-base font-semibold bg-red-600 hover:bg-red-700 text-white mt-6">
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
                <p>
                  Whether you're planning to build your dream home, design a commercial space, or renovate your 
                  existing property, our team of experienced architects is here to bring your vision to life. 
                  With expertise in residential, commercial, and sustainable design, we deliver innovative 
                  architectural solutions that blend functionality with aesthetic appeal.
                </p>
                <p>
                  Our comprehensive services include conceptual design, detailed architectural drawings, 
                  3D visualization, interior planning, and project management. We work closely with you 
                  throughout the entire process, from initial consultation to final construction, ensuring 
                  your project exceeds expectations while staying within budget and timeline.
                </p>
                <p>
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

      {/* Why Choose HomeHNI */}
      <section className="py-16 bg-blue-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">Why Choose HomeHNI Architects?</h2>
          <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            Experience the difference with our professional architectural services and expert guidance.
          </p>
          
          <div className="overflow-x-auto">
            <table className="w-full max-w-4xl mx-auto bg-white rounded-xl shadow-lg">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-6 font-semibold">Features</th>
                  <th className="text-center p-6 font-semibold text-blue-600">HomeHNI Architects</th>
                  <th className="text-center p-6 font-semibold text-gray-500">Other Platforms</th>
                </tr>
              </thead>
              <tbody>
                {comparisonData.map((item, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="p-6">{item.feature}</td>
                    <td className="p-6 text-center">
                      {item.homeHNI ? (
                        <CheckCircle className="w-6 h-6 text-green-500 mx-auto" />
                      ) : (
                        <X className="w-6 h-6 text-red-500 mx-auto" />
                      )}
                    </td>
                    <td className="p-6 text-center">
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
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">What Our Clients Say</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <img 
                      src={testimonial.image} 
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full mr-4 object-cover"
                    />
                    <div>
                      <h4 className="font-semibold">{testimonial.name}</h4>
                      <p className="text-sm text-gray-600">{testimonial.role}</p>
                    </div>
                  </div>
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-600 italic">"{testimonial.text}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          
          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible>
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left hover:text-blue-600">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      {/* <section className="py-16 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your Dream Project?</h2>
          <p className="text-xl mb-8 text-blue-100">
            Connect with our expert architects today and bring your vision to life.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-blue-900 font-semibold px-8 py-3">
              <Smartphone className="w-5 h-5 mr-2" />
              Call +91 80740 17388
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3">
              <Download className="w-5 h-5 mr-2" />
              Download Brochure
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="flex items-center justify-center">
              <Clock className="w-6 h-6 mr-3 text-yellow-400" />
              <div className="text-left">
                <p className="font-semibold">Quick Response</p>
                <p className="text-blue-100">24-hour consultation</p>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <Shield className="w-6 h-6 mr-3 text-yellow-400" />
              <div className="text-left">
                <p className="font-semibold">Trusted Experts</p>
                <p className="text-blue-100">Certified architects</p>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <Crown className="w-6 h-6 mr-3 text-yellow-400" />
              <div className="text-left">
                <p className="font-semibold">Premium Service</p>
                <p className="text-blue-100">End-to-end support</p>
              </div>
            </div>
          </div>
        </div>
      </section> */}

      
    </div>
  );
};

export default Architects;
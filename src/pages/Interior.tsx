import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useToast } from "@/hooks/use-toast";
import { Palette, Lightbulb, Eye, Sofa, Wrench, Target, Users, Clock, CheckCircle, Shield, Star, X, Plus, Minus, Crown, FileText, MapPin, DollarSign, PaintBucket, Home, Sparkles, Layers, Hammer } from "lucide-react";
import Marquee from "@/components/Marquee";
import Header from "@/components/Header";

const Interior = () => {
  const services = [{
    icon: Home,
    title: "Residential Interior Design",
    description: "Complete home makeovers from concept to execution."
  }, {
    icon: Sofa,
    title: "Living Room Design",
    description: "Create stunning spaces for relaxation and entertainment."
  }, {
    icon: PaintBucket,
    title: "Kitchen & Modular Design",
    description: "Functional and beautiful kitchen solutions."
  }, {
    icon: Target,
    title: "Bedroom & Wardrobe Design",
    description: "Personalized spaces for rest and storage."
  }, {
    icon: Palette,
    title: "Office Interior Design",
    description: "Professional workspaces that inspire productivity."
  }, {
    icon: Lightbulb,
    title: "Lighting & Decor Solutions",
    description: "Perfect ambiance with designer lighting and accessories."
  }];

  const targetAudience = [{
    icon: Home,
    title: "Homeowners",
    description: "Looking to redesign their living spaces"
  }, {
    icon: Crown,
    title: "Luxury Villa Owners",
    description: "Seeking premium interior design solutions"
  }, {
    icon: FileText,
    title: "Commercial Spaces",
    description: "Need professional interior design services"
  }];

  const comparisonData = [{
    feature: "Custom Design Solutions",
    homeHNI: true,
    others: false
  }, {
    feature: "3D Visualization",
    homeHNI: true,
    others: false
  }, {
    feature: "End-to-End Execution",
    homeHNI: true,
    others: false
  }, {
    feature: "Dedicated Project Manager",
    homeHNI: true,
    others: false
  }, {
    feature: "Quality Material Sourcing",
    homeHNI: true,
    others: false
  }, {
    feature: "Timely Project Completion",
    homeHNI: true,
    others: false
  }, {
    feature: "Post-Installation Support",
    homeHNI: true,
    others: false
  }, {
    feature: "Design Satisfaction Guarantee",
    homeHNI: true,
    others: false
  }];

  const testimonials = [{
    name: "Priya Sharma",
    role: "Homeowner",
    image: "/lovable-uploads/46a07bb4-9f10-4614-ad52-73dfb2de4f28.png",
    rating: 5,
    text: "Transformed our 3BHK into a dream home! Amazing attention to detail and quality work."
  }, {
    name: "Rajesh Kumar",
    role: "Villa Owner",
    image: "/lovable-uploads/5b898e4e-d9b6-4366-b58f-176fc3c8a9c3.png",
    rating: 5,
    text: "Professional team with creative designs. Our villa looks absolutely stunning now!"
  }, {
    name: "Anita Desai",
    role: "Business Owner",
    image: "/lovable-uploads/6e6c47cd-700c-49d4-bfee-85a69bb8353f.png",
    rating: 5,
    text: "Best interior designers in the city. Office space looks modern and professional."
  }];

  const faqs = [{
    question: "What interior design services do you offer?",
    answer: "We offer complete interior design solutions including residential homes, villas, offices, retail spaces, restaurants, and modular kitchen & wardrobe designs."
  }, {
    question: "How much do your interior design services cost?",
    answer: "Our interior design services start from ₹50,000 and vary based on project scope, space size, and design complexity. We provide detailed quotations after consultation."
  }, {
    question: "How long does an interior design project take?",
    answer: "Project timelines vary from 4-12 weeks depending on the scope. We provide realistic timelines during consultation and ensure timely completion."
  }, {
    question: "Do you provide 3D visualizations?",
    answer: "Yes, we provide detailed 3D visualizations and walkthroughs so you can see your space before execution. This helps in making informed design decisions."
  }, {
    question: "What is included in your design package?",
    answer: "Our packages include design consultation, 3D visualization, material selection, project management, execution, and post-installation support."
  }];

  const { toast } = useToast();

  useEffect(() => {
    const title = "Interior Design Services | Home HNI";
    document.title = title;
    const desc = "Transform your space with expert interior design services. Residential, commercial, and luxury interior solutions with 3D visualization and end-to-end execution.";
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
    canonical.setAttribute('href', window.location.origin + '/interior');
  }, []);

  return (
    <div className="min-h-screen">
      <Marquee />
      <Header />
      
      {/* Hero Section */}
      <section className="relative pt-28 md:pt-32 pb-20 md:pb-32 px-4 md:px-8 text-white overflow-hidden bg-cover bg-center bg-no-repeat" style={{
        backgroundImage: "url('/lovable-uploads/0b9bec0c-64d2-4ff5-8bdb-018ff8463e6c.png')"
      }}>
        <div className="absolute inset-0 bg-red-900/80 pointer-events-none" />

        <div className="relative z-10 container mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 items-start">
            {/* Left: Copy */}
            <div className="max-w-2xl">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
                Transform Your Space with
                <br className="hidden md:block" />
                <span className="block">Expert Interior Design</span>
              </h1>
              <p className="text-lg md:text-xl text-white/90 mb-6">
                From concept to execution, we create stunning interiors that reflect your style
                with 3D visualization and end-to-end project management.
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
            <h3 className="text-xl font-semibold text-foreground mb-2">Need interior design?</h3>
            <p className="text-sm text-muted-foreground mb-4">Fill the form & get a free consultation</p>

            <form className="space-y-4" onSubmit={e => {
              e.preventDefault();
              toast({
                title: "Request received",
                description: "Our design expert will contact you shortly."
              });
              (e.currentTarget as HTMLFormElement).reset();
            }}>
              <Input id="design-name" name="name" placeholder="Name" required />

              <div className="flex gap-2">
                <Select defaultValue="+91" name="countryCode">
                  <SelectTrigger className="w-28"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="+91">🇮🇳 +91</SelectItem>
                    <SelectItem value="+1">🇺🇸 +1</SelectItem>
                    <SelectItem value="+44">🇬🇧 +44</SelectItem>
                  </SelectContent>
                </Select>
                <Input id="design-phone" name="phone" type="tel" placeholder="Phone Number" className="flex-1" required />
              </div>

              <Input id="design-email" name="email" type="email" placeholder="Email ID" />

              <Select name="spaceType">
                <SelectTrigger id="space-type"><SelectValue placeholder="Space Type" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="home">Home Interior</SelectItem>
                  <SelectItem value="villa">Villa Interior</SelectItem>
                  <SelectItem value="apartment">Apartment</SelectItem>
                  <SelectItem value="office">Office Interior</SelectItem>
                  <SelectItem value="retail">Retail Space</SelectItem>
                  <SelectItem value="restaurant">Restaurant</SelectItem>
                </SelectContent>
              </Select>

              <Input id="design-budget" name="budget" placeholder="Budget Range (₹)" />

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
              <h3 className="text-2xl font-bold text-foreground mb-3">Need interior design?</h3>
              <p className="text-base text-muted-foreground mb-8">Fill the form & get a free consultation</p>

              <form className="space-y-5" onSubmit={e => {
                e.preventDefault();
                toast({
                  title: "Request received",
                  description: "Our design expert will contact you shortly."
                });
                (e.currentTarget as HTMLFormElement).reset();
              }}>
                <Input 
                  id="design-name-mobile" 
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
                    id="design-phone-mobile" 
                    name="phone" 
                    type="tel" 
                    placeholder="Phone Number" 
                    className="flex-1 h-12 text-base bg-background" 
                    required 
                  />
                </div>

                <Input 
                  id="design-email-mobile" 
                  name="email" 
                  type="email" 
                  placeholder="Email ID" 
                  className="h-12 text-base bg-background"
                />

                <Select name="spaceType">
                  <SelectTrigger id="space-type-mobile" className="h-12 bg-background">
                    <SelectValue placeholder="Space Type" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border shadow-lg">
                    <SelectItem value="home">Home Interior</SelectItem>
                    <SelectItem value="villa">Villa Interior</SelectItem>
                    <SelectItem value="apartment">Apartment</SelectItem>
                    <SelectItem value="office">Office Interior</SelectItem>
                    <SelectItem value="retail">Retail Space</SelectItem>
                    <SelectItem value="restaurant">Restaurant</SelectItem>
                  </SelectContent>
                </Select>

                <Input 
                  id="design-budget-mobile" 
                  name="budget" 
                  placeholder="Budget Range (₹)" 
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
                Why choose our interior design services?
              </h2>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                    <Target className="w-5 h-5 text-red-600" />
                  </div>
                  <h3 className="text-base font-semibold text-foreground">
                    Custom Design Solutions
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Personalized designs tailored to your lifestyle and preferences
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                    <Eye className="w-5 h-5 text-red-600" />
                  </div>
                  <h3 className="text-base font-semibold text-foreground">
                    3D Visualization
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    See your space before execution with detailed 3D walkthroughs
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                    <Wrench className="w-5 h-5 text-red-600" />
                  </div>
                  <h3 className="text-base font-semibold text-foreground">
                    End-to-End Execution
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Complete project management from design to final installation
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-red-600" />
                  </div>
                  <h3 className="text-base font-semibold text-foreground">
                    Expert Design Team
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Experienced interior designers and project managers
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                    <Palette className="w-5 h-5 text-red-600" />
                  </div>
                  <h3 className="text-base font-semibold text-foreground">
                    Quality Materials
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Premium quality materials and furniture sourcing
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                    <Clock className="w-5 h-5 text-red-600" />
                  </div>
                  <h3 className="text-base font-semibold text-foreground">
                    Timely Completion
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Projects delivered on time with quality workmanship
                  </p>
                </div>
              </div>
            </div>
            
            {/* Right side spacing for sticky form */}
            <div className="hidden lg:block"></div>
          </div>
        </div>
      </section>

      {/* Interior Design Services Info Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div className="max-w-3xl">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8">
                Comprehensive Interior Design Solutions
              </h2>
              <div className="text-muted-foreground space-y-4 text-sm leading-relaxed">
                <p>
                  Whether you're looking to redesign your home, villa, office, or commercial space, our comprehensive 
                  interior design solutions are crafted to transform your vision into reality. From conceptual design 
                  to final execution, we handle every aspect of your interior project.
                </p>
                <p>
                  Our expert team of interior designers, architects, and project managers work closely with you to 
                  create spaces that are not only aesthetically pleasing but also functional and sustainable. We use 
                  the latest design software for 3D visualization, ensuring you can see and approve your design before execution.
                </p>
                <p>
                  With a focus on quality materials, timely execution, and customer satisfaction, we've successfully 
                  completed over 1000+ interior projects across residential and commercial spaces. Our services include 
                  complete home interiors, modular kitchens, wardrobes, office interiors, retail spaces, and luxury villa designs.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mt-8">
                {services.map((service, index) => (
                  <div key={index} className="flex items-start space-x-3 p-4 bg-background rounded-lg border">
                    <service.icon className="w-6 h-6 text-red-600 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-foreground mb-1">{service.title}</h4>
                      <p className="text-sm text-muted-foreground">{service.description}</p>
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

      {/* Trusted by Thousands Section */}
      <section className="py-16 px-4 bg-background">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div className="max-w-3xl">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8">
                Trusted by Thousands of Happy Clients
              </h2>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-foreground mb-2">1000+</div>
                  <div className="text-sm text-muted-foreground">Projects Completed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-foreground mb-2">500+</div>
                  <div className="text-sm text-muted-foreground">Happy Clients</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-foreground mb-2">15+</div>
                  <div className="text-sm text-muted-foreground">Design Awards</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-foreground mb-2">98%</div>
                  <div className="text-sm text-muted-foreground">Satisfaction Rate</div>
                </div>
              </div>

              <p className="text-muted-foreground text-sm leading-relaxed">
                Join thousands of satisfied clients who have transformed their spaces with our expert interior design services. 
                From luxury homes to modern offices, we've delivered exceptional results that exceed expectations.
              </p>
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
                Home HNI vs Others
              </h2>
              
              <div className="bg-background rounded-lg overflow-hidden border">
                <div className="grid grid-cols-3 gap-4 p-4 bg-muted font-medium text-sm">
                  <div>Features</div>
                  <div className="text-center">Home HNI</div>
                  <div className="text-center">Others</div>
                </div>
                
                {comparisonData.map((item, index) => (
                  <div key={index} className="grid grid-cols-3 gap-4 p-4 border-t text-sm">
                    <div className="text-foreground">{item.feature}</div>
                    <div className="text-center">
                      {item.homeHNI ? (
                        <CheckCircle className="w-5 h-5 text-green-600 mx-auto" />
                      ) : (
                        <X className="w-5 h-5 text-red-500 mx-auto" />
                      )}
                    </div>
                    <div className="text-center">
                      {item.others ? (
                        <CheckCircle className="w-5 h-5 text-green-600 mx-auto" />
                      ) : (
                        <X className="w-5 h-5 text-red-500 mx-auto" />
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
                What Our Clients Say
              </h2>
              
              <div className="space-y-6">
                {testimonials.map((testimonial, index) => (
                  <div key={index} className="bg-muted/50 p-6 rounded-lg border">
                    <div className="flex items-start space-x-4">
                      <img 
                        src={testimonial.image} 
                        alt={testimonial.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <div className="flex">
                            {[...Array(testimonial.rating)].map((_, i) => (
                              <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            ))}
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">"{testimonial.text}"</p>
                        <div>
                          <div className="font-medium text-foreground text-sm">{testimonial.name}</div>
                          <div className="text-xs text-muted-foreground">{testimonial.role}</div>
                        </div>
                      </div>
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

      {/* Target Audience */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div className="max-w-3xl">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8">
                Who We Serve
              </h2>
              
              <div className="space-y-4">
                {targetAudience.map((audience, index) => (
                  <div key={index} className="flex items-center space-x-4 p-4 bg-background rounded-lg border">
                    <audience.icon className="w-8 h-8 text-red-600" />
                    <div>
                      <h4 className="font-medium text-foreground">{audience.title}</h4>
                      <p className="text-sm text-muted-foreground">{audience.description}</p>
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

      {/* FAQ Section */}
      <section className="py-16 px-4 bg-background">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div className="max-w-3xl">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8">
                Frequently Asked Questions
              </h2>
              
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
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

      {/* Service Tags */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div className="max-w-3xl">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6">
                Interior Design Keywords
              </h2>
              
              <div className="flex flex-wrap gap-2">
                {[
                  "Interior Design", "Home Decor", "Modern Interior", "Luxury Interior", "3D Visualization",
                  "Modular Kitchen", "Wardrobe Design", "Office Interior", "Villa Interior", "Apartment Design",
                  "Living Room Design", "Bedroom Design", "Bathroom Design", "Contemporary Design", "Custom Furniture",
                  "Space Planning", "Color Consultation", "Lighting Design", "Material Selection", "Project Management"
                ].map((tag, index) => (
                  <span 
                    key={index} 
                    className="px-3 py-1 bg-background text-muted-foreground text-xs rounded-full border"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            
            {/* Right side spacing for sticky form */}
            <div className="hidden lg:block"></div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Interior;
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useToast } from "@/hooks/use-toast";
import { Palette, Lightbulb, Eye, Sofa, Wrench, Target, Users, Clock, CheckCircle, Shield, Star, X, Plus, Minus, Crown, FileText, MapPin, DollarSign, PaintBucket, Home, Sparkles, Layers, Hammer } from "lucide-react";
const InteriorDesignersEmbedded = () => {
  // Major cities in India
  const majorCities = ["Mumbai", "Delhi", "Bangalore", "Hyderabad", "Ahmedabad", "Chennai", "Kolkata", "Surat", "Pune", "Jaipur", "Lucknow", "Kanpur", "Nagpur", "Indore", "Thane", "Bhopal", "Visakhapatnam", "Pimpri-Chinchwad", "Patna", "Vadodara", "Ghaziabad", "Ludhiana", "Agra", "Nashik", "Faridabad", "Meerut", "Rajkot", "Kalyan-Dombivli", "Vasai-Virar", "Varanasi", "Srinagar", "Aurangabad", "Dhanbad", "Amritsar", "Navi Mumbai", "Allahabad", "Ranchi", "Howrah", "Coimbatore", "Jabalpur", "Gwalior", "Vijayawada", "Jodhpur", "Madurai", "Raipur", "Kota", "Guwahati", "Chandigarh", "Solapur", "Hubli-Dharwad"];
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
    feature: "Professional Design Team",
    homeHNI: true,
    others: false
  }, {
    feature: "3D Visualization",
    homeHNI: true,
    others: false
  }, {
    feature: "Complete Project Management",
    homeHNI: true,
    others: false
  }, {
    feature: "Premium Materials & Furniture",
    homeHNI: true,
    others: false
  }, {
    feature: "Custom Design Solutions",
    homeHNI: true,
    others: false
  }, {
    feature: "Budget Optimization",
    homeHNI: true,
    others: false
  }, {
    feature: "Timely Project Delivery",
    homeHNI: true,
    others: false
  }, {
    feature: "Post-Project Support",
    homeHNI: true,
    others: false
  }];
  const testimonials = [{
    name: "Sunita Reddy",
    role: "Homeowner",
    image: "/lovable-uploads/46a07bb4-9f10-4614-ad52-73dfb2de4f28.png",
    rating: 5,
    text: "Amazing interior design service! They transformed my home into a beautiful, functional space. The 3D visualization was incredibly helpful."
  }, {
    name: "Rajesh Kumar",
    role: "Villa Owner",
    image: "/lovable-uploads/5b898e4e-d9b6-4366-b58f-176fc3c8a9c3.png",
    rating: 5,
    text: "Premium interior design for our luxury villa. The attention to detail and quality of work is exceptional. Highly recommend!"
  }, {
    name: "Priya Sharma",
    role: "Business Owner",
    image: "/lovable-uploads/6e6c47cd-700c-49d4-bfee-85a69bb8353f.png",
    rating: 5,
    text: "Professional office interior design. They created a productive and inspiring workspace for our team. Excellent service!"
  }];
  const faqs = [{
    question: "What interior design services do you offer?",
    answer: "We offer residential interior design, living room design, kitchen & modular design, bedroom & wardrobe design, office interior design, and lighting & decor solutions."
  }, {
    question: "Do you provide 3D visualization?",
    answer: "Yes, we provide detailed 3D visualization and virtual walkthroughs to help you visualize your interior design before implementation."
  }, {
    question: "How long does the design process take?",
    answer: "The design process typically takes 2-3 weeks for concept development and 3D visualization, followed by 4-8 weeks for implementation depending on project scope."
  }, {
    question: "Do you handle furniture procurement?",
    answer: "Yes, we handle complete furniture procurement including custom pieces, ensuring quality and timely delivery within your budget."
  }, {
    question: "What is your design approach?",
    answer: "We focus on creating functional, beautiful spaces that reflect your personality and lifestyle while optimizing space utilization and budget efficiency."
  }];
  const [formMessage, setFormMessage] = useState<{
    type: 'success' | 'error' | null;
    text: string;
  }>({
    type: null,
    text: ''
  });
  return <div className="bg-background">
      {/* Hero Section */}
      <section className="relative pt-8 pb-20 md:pb-32 px-4 md:px-8 text-white overflow-hidden bg-cover bg-center bg-no-repeat" style={{
      backgroundImage: "url('/lovable-uploads/fbb0d72f-782e-49f5-bbe1-8afc1314b5f7.png')"
    }}>
        <div className="absolute inset-0 bg-red-900/80 pointer-events-none" />

        <div className="relative z-10 container mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 items-start">
            <div className="max-w-2xl">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
                Professional Interior Design
                <br className="hidden md:block" />
                <span className="block">for Beautiful Living Spaces</span>
              </h1>
              <p className="text-lg md:text-xl text-white/90 mb-6">
                Complete interior design services with 3D visualization, 
                custom solutions, and premium materials for your dream home.
              </p>
            </div>
            <div className="hidden lg:block lg:justify-self-end">
              <div className="w-full max-w-md h-80"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile Form */}
      <section className="lg:hidden px-4 py-8 bg-background">
        <div className="container mx-auto max-w-xl">
          <Card className="w-full rounded-2xl shadow-xl border-2 border-primary bg-card">
            <CardContent className="p-6 md:p-8">
              <h3 className="text-xl md:text-2xl font-bold text-foreground mb-3">Need an interior designer?</h3>
              <p className="text-sm md:text-base text-muted-foreground mb-6 md:mb-8">Fill the form & get a free consultation</p>

              <form className="space-y-5" onSubmit={e => {
              e.preventDefault();
              setFormMessage({
                type: "success",
                text: "Request submitted! Our interior designers will contact you within 24 hours."
              });
              (e.currentTarget as HTMLFormElement).reset();
            }}>
                <Input id="interior-name-mobile" name="name" placeholder="Name" className="h-10 md:h-12 text-sm md:text-base bg-background" required />

                <div className="flex gap-2 md:gap-3">
                  <Select defaultValue="+91" name="countryCode">
                    <SelectTrigger className="w-24 md:w-32 h-10 md:h-12 bg-background">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-background border shadow-lg">
                      <SelectItem value="+91">🇮🇳 +91</SelectItem>
                      <SelectItem value="+1">🇺🇸 +1</SelectItem>
                      <SelectItem value="+44">🇬🇧 +44</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input id="interior-phone-mobile" name="phone" type="tel" placeholder="Phone Number" className="flex-1 h-10 md:h-12 text-sm md:text-base bg-background" required />
                </div>

                <Input id="interior-email-mobile" name="email" type="email" placeholder="Email ID" className="h-10 md:h-12 text-sm md:text-base bg-background" required />

                <div className="flex flex-col sm:flex-row gap-2 md:gap-3">
                  <Select name="projectType" required>
                    <SelectTrigger id="interior-project-type-mobile" className="h-10 md:h-12 bg-background">
                      <SelectValue placeholder="Project Type" />
                    </SelectTrigger>
                    <SelectContent className="bg-background border shadow-lg">
                      <SelectItem value="residential">Residential Interior Design</SelectItem>
                      <SelectItem value="commercial">Commercial Interior Design</SelectItem>
                      <SelectItem value="renovation">Renovation & Remodeling</SelectItem>
                      <SelectItem value="furniture">Furniture Selection</SelectItem>
                      <SelectItem value="lighting">Lighting Design</SelectItem>
                      <SelectItem value="color-consultation">Color Consultation</SelectItem>
                      <SelectItem value="space-planning">Space Planning</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input id="interior-location-mobile" name="location" placeholder="Project Location" className="h-10 md:h-12 text-sm md:text-base bg-background" />
                </div>

                <div className="flex flex-col sm:flex-row gap-2 md:gap-3">
                  <Select defaultValue="india" name="country">
                    <SelectTrigger id="interior-country-mobile" className="h-10 md:h-12 bg-background">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-background border shadow-lg">
                      <SelectItem value="india">India</SelectItem>
                      <SelectItem value="usa">United States</SelectItem>
                      <SelectItem value="uk">United Kingdom</SelectItem>
                      <SelectItem value="canada">Canada</SelectItem>
                      <SelectItem value="australia">Australia</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select name="city">
                    <SelectTrigger id="interior-city-mobile" className="h-10 md:h-12 bg-background">
                      <SelectValue placeholder="Select City" />
                    </SelectTrigger>
                    <SelectContent className="bg-background border shadow-lg">
                      {majorCities.map(city => <SelectItem key={city} value={city.toLowerCase()}>{city}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>

                <Button type="submit" className="w-full h-10 md:h-12 text-sm md:text-base font-semibold bg-red-800 hover:bg-red-900 text-white mt-4 md:mt-6">
                  Get Free Consultation!
                </Button>
                
                {/* Inline message */}
                {formMessage.type && <div className={`mt-2 p-3 rounded-lg text-sm ${formMessage.type === 'error' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'}`}>
                    {formMessage.text}
                  </div>}
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Our Services */}
      <section className="py-16 px-4 bg-background">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div className="max-w-3xl">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8">
                Our Interior Design Services
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
                  <div className="text-4xl md:text-5xl font-bold text-red-600 mb-2">800+</div>
                  <p className="text-muted-foreground">Projects Completed</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl md:text-5xl font-bold text-red-600 mb-2">50+</div>
                  <p className="text-muted-foreground">Cities Covered</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl md:text-5xl font-bold text-red-600 mb-2">10+</div>
                  <p className="text-muted-foreground">Years Experience</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl md:text-5xl font-bold text-red-600 mb-2">98%</div>
                  <p className="text-muted-foreground">Client Satisfaction</p>
                </div>
              </div>
            </div>
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
                Why Home HNI is Better
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
            <div className="hidden lg:block"></div>
          </div>
        </div>
      </section>

      {/* Sticky Form Container for Large Screens */}
      <div className="hidden lg:block absolute top-8 right-8 z-50">
        <div className="w-96 sticky top-8">
        <Card className="w-full rounded-xl shadow-2xl bg-background border-2 border-primary">
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold text-foreground mb-2 text-center">Need an interior designer?</h3>
            <p className="text-sm text-muted-foreground mb-4 text-center">Fill the form & get a free consultation</p>

            <form className="space-y-4" onSubmit={e => {
              e.preventDefault();
              setFormMessage({
                type: "success",
                text: "Request submitted! Our interior designers will contact you within 24 hours."
              });
              (e.currentTarget as HTMLFormElement).reset();
            }}>
              <Input id="interior-name" name="name" placeholder="Name" required />

              <div className="flex gap-2">
                <Select defaultValue="+91" name="countryCode">
                  <SelectTrigger className="w-28"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="+91">🇮🇳 +91</SelectItem>
                    <SelectItem value="+1">🇺🇸 +1</SelectItem>
                    <SelectItem value="+44">🇬🇧 +44</SelectItem>
                  </SelectContent>
                </Select>
                <Input id="interior-phone" name="phone" type="tel" placeholder="Phone Number" className="flex-1" required />
              </div>

              <Input id="interior-email" name="email" type="email" placeholder="Email ID" required />

              <div className="flex gap-2">
                <Select name="projectType" required>
                  <SelectTrigger id="interior-project-type" className="flex-1"><SelectValue placeholder="Project Type" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="residential">Residential Interior Design</SelectItem>
                    <SelectItem value="commercial">Commercial Interior Design</SelectItem>
                    <SelectItem value="renovation">Renovation & Remodeling</SelectItem>
                    <SelectItem value="furniture">Furniture Selection</SelectItem>
                    <SelectItem value="lighting">Lighting Design</SelectItem>
                    <SelectItem value="color-consultation">Color Consultation</SelectItem>
                    <SelectItem value="space-planning">Space Planning</SelectItem>
                    <SelectItem value="other">Others</SelectItem>
                  </SelectContent>
                </Select>
                <Input id="interior-location" name="location" placeholder="Project Location" className="flex-1" />
              </div>

              <div className="flex gap-2">
                <Select defaultValue="india" name="country">
                  <SelectTrigger id="interior-country" className="flex-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="india">India</SelectItem>
                    <SelectItem value="usa">United States</SelectItem>
                    <SelectItem value="uk">United Kingdom</SelectItem>
                    <SelectItem value="canada">Canada</SelectItem>
                    <SelectItem value="australia">Australia</SelectItem>
                  </SelectContent>
                </Select>
                <Select name="city">
                  <SelectTrigger id="interior-city" className="flex-1"><SelectValue placeholder="Select City" /></SelectTrigger>
                  <SelectContent>
                    {majorCities.map(city => <SelectItem key={city} value={city.toLowerCase()}>{city}</SelectItem>)}
                  </SelectContent>
                 </Select>
               </div>

               <Button type="submit" className="w-full bg-red-800 hover:bg-red-900 text-white">Get Free Consultation!</Button>
               
               {/* Inline message */}
               {formMessage.type && <div className={`mt-2 p-3 rounded-lg text-sm ${formMessage.type === 'error' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'}`}>
                   {formMessage.text}
                 </div>}
            </form>
          </CardContent>
        </Card>
        </div>
      </div>


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
            <div className="hidden lg:block"></div>
          </div>
        </div>
      </section>
    </div>;
};
export default InteriorDesignersEmbedded;
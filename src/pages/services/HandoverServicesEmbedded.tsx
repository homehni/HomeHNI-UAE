import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/hooks/useProfile";
import { Building2, Users, FileCheck, Search, Database, Headphones, MapPin, Crown, Clock, CheckCircle, Shield, Star, X, Plus, Minus, Globe, ShieldCheck, Home, Key, Users2, Building } from "lucide-react";
import { sendServicesApplicationEmail } from "@/services/emailService";

const HandoverServicesEmbedded = () => {
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
    icon: FileCheck,
    title: "Complete Documentation Support",
    description: "Handle all legal documents, certificates, and paperwork required for handover."
  }, {
    icon: ShieldCheck,
    title: "Legal Verification & Clearance",
    description: "Ensure all legal aspects are verified and cleared before handover."
  }, {
    icon: Search,
    title: "Technical Property Inspection",
    description: "Thorough technical inspection to identify any issues before handover."
  }, {
    icon: Key,
    title: "Utility Transfer Assistance",
    description: "Help with transferring electricity, water, and other utility connections."
  }, {
    icon: Database,
    title: "Digital Record Management",
    description: "Maintain digital records of all handover documents and certificates."
  }, {
    icon: Headphones,
    title: "Post-Handover Support",
    description: "Continued support for any issues or queries after property handover."
  }];

  const targetAudience = [{
    icon: Home,
    title: "Property Buyers",
    description: "Purchasing their first or investment property"
  }, {
    icon: Building,
    title: "Property Sellers",
    description: "Selling residential or commercial properties"
  }, {
    icon: Users2,
    title: "Landlords & Tenants",
    description: "Renting or leasing properties with proper handover"
  }];

  const comparisonData = [{
    feature: "Complete Documentation Support",
    homeHNI: true,
    others: false
  }, {
    feature: "Legal Verification & Clearance",
    homeHNI: true,
    others: false
  }, {
    feature: "Technical Property Inspection",
    homeHNI: true,
    others: false
  }, {
    feature: "Utility Transfer Assistance",
    homeHNI: true,
    others: false
  }, {
    feature: "Digital Record Management",
    homeHNI: true,
    others: false
  }, {
    feature: "Post-Handover Support",
    homeHNI: true,
    others: false
  }, {
    feature: "Transparent Process",
    homeHNI: true,
    others: false
  }, {
    feature: "Expert Guidance",
    homeHNI: true,
    others: false
  }];

  const testimonials = [{
    name: "Rakesh Agarwal",
    role: "Home Buyer",
    image: "/lovable-uploads/46a07bb4-9f10-4614-ad52-73dfb2de4f28.png",
    rating: 5,
    text: "Smooth handover process! They took care of all documents and legal verification. Stress-free experience."
  }, {
    name: "Kavita Menon", 
    role: "Property Investor",
    image: "/lovable-uploads/5b898e4e-d9b6-4366-b58f-176fc3c8a9c3.png",
    rating: 5,
    text: "Professional service for property handover. All documentation was handled perfectly. Highly recommended!"
  }, {
    name: "Suresh Reddy",
    role: "Landlord",
    image: "/lovable-uploads/6e6c47cd-700c-49d4-bfee-85a69bb8353f.png",
    rating: 5,
    text: "Excellent tenant handover service. They managed everything from inspection to documentation seamlessly."
  }];

  const faqs = [{
    question: "What documents are handled in property handover?",
    answer: "We handle all documents including sale deed, NOCs, completion certificates, utility transfer papers, possession letter, and any other legal documents required for smooth property handover."
  }, {
    question: "Do you provide technical inspection services?",
    answer: "Yes, our certified engineers conduct comprehensive technical inspection covering structural integrity, electrical systems, plumbing, and all fixtures to ensure everything is in perfect condition."
  }, {
    question: "How long does the handover process take?",
    answer: "Typically, the complete handover process takes 3-7 working days depending on the complexity of documentation and any pending clearances. We ensure no delays from our end."
  }, {
    question: "Do you help with utility transfers?",
    answer: "Yes, we assist with transferring all utilities including electricity, water, gas, internet, and cable connections. We coordinate with all service providers to ensure smooth transfers."
  }, {
    question: "What if there are issues found during inspection?",
    answer: "If any issues are identified during inspection, we document them and coordinate with the seller/builder for resolution. We ensure all issues are addressed before final handover."
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
                Professional Property Handover Services
                <br className="hidden md:block" />
                <span className="block">for Seamless Possession</span>
              </h1>
              <p className="text-lg md:text-xl text-white/90 mb-6">
                Complete documentation support, legal verification, and technical inspection 
                for hassle-free property handover.
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
              <h3 className="text-xl font-semibold text-foreground mb-2 text-uniform-center">Need Handover Service?</h3>
              <p className="text-sm text-muted-foreground mb-4 text-uniform-center">Get professional assistance</p>

              <form className="space-y-4" onSubmit={async (e) => {
                e.preventDefault();
                const form = e.currentTarget as HTMLFormElement;
                if (!form.checkValidity()) {
                  form.reportValidity();
                  toast({
                    title: "Error",
                    description: "Please fill in all required fields before submitting your handover service request.",
                    variant: "destructive"
                  });
                  return;
                }
                
                const formData = new FormData(form);
                const name = formData.get('name') as string;
                const email = formData.get('email') as string;
                
                try {
                  await sendServicesApplicationEmail(email, name, 'handover-services');
                  toast({
                    title: "Request received",
                    description: "Our handover expert will contact you shortly.",
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
                  id="handover-name" 
                  name="name" 
                  placeholder="Name" 
                  defaultValue={autoFillData.name}
                  required 
                />

                <div className="flex gap-2">
                  <Select defaultValue="+91" name="countryCode">
                    <SelectTrigger className="w-28"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="+91">🇮🇳 +91</SelectItem>
                      <SelectItem value="+1">🇺🇸 +1</SelectItem>
                      <SelectItem value="+44">🇬🇧 +44</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input id="handover-phone" name="phone" type="tel" placeholder="Phone Number" className="flex-1" required />
                </div>

                <Input 
                  id="handover-email" 
                  name="email" 
                  type="email" 
                  placeholder="Email ID" 
                  defaultValue={autoFillData.email}
                  required 
                />

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
                    <SelectItem value="property-handover">Property Handover</SelectItem>
                    <SelectItem value="documentation">Documentation Support</SelectItem>
                    <SelectItem value="inspection">Technical Inspection</SelectItem>
                    <SelectItem value="utility-transfer">Utility Transfer</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>

                <Button type="submit" className="w-full bg-red-800 hover:bg-red-900 text-white">Get Professional Support</Button>
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
              <h3 className="text-2xl font-bold text-foreground mb-3 text-uniform-center">Need Handover Service?</h3>
              <p className="text-base text-muted-foreground mb-8 text-uniform-center">Get professional assistance</p>

              <form className="space-y-5" onSubmit={async (e) => {
                e.preventDefault();
                const form = e.currentTarget as HTMLFormElement;
                if (!form.checkValidity()) {
                  form.reportValidity();
                  toast({
                    title: "Error",
                    description: "Please fill in all required fields before submitting your handover service request.",
                    variant: "destructive"
                  });
                  return;
                }
                
                const formData = new FormData(form);
                const name = formData.get('name') as string;
                const email = formData.get('email') as string;
                
                try {
                  await sendServicesApplicationEmail(email, name, 'handover-services');
                  toast({
                    title: "Request received",
                    description: "Our handover expert will contact you shortly.",
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
                  id="handover-name-mobile" 
                  name="name" 
                  placeholder="Name" 
                  defaultValue={autoFillData.name}
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
                    id="handover-phone-mobile" 
                    name="phone" 
                    type="tel" 
                    placeholder="Phone Number" 
                    className="flex-1 h-12 text-base bg-background" 
                    required 
                  />
                </div>

                <Input 
                  id="handover-email-mobile" 
                  name="email" 
                  type="email" 
                  placeholder="Email ID" 
                  defaultValue={autoFillData.email}
                  className="h-12 text-base bg-background"
                />

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
                    <SelectItem value="property-handover">Property Handover</SelectItem>
                    <SelectItem value="documentation">Documentation Support</SelectItem>
                    <SelectItem value="inspection">Technical Inspection</SelectItem>
                    <SelectItem value="utility-transfer">Utility Transfer</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>

                <Button type="submit" className="w-full h-12 text-base font-semibold bg-red-800 hover:bg-red-900 text-white mt-6">
                  Get Professional Support
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Complete Handover Solutions
          </h2>
          <p className="text-lg text-muted-foreground mb-12 max-w-2xl mx-auto">
            Professional support for seamless property handover with complete documentation and legal assistance.
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
          <p className="text-lg text-muted-foreground mb-12">Our handover services cater to various property stakeholders</p>
          
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
            <span className="px-4 py-2 bg-red-100 text-red-700 rounded-full text-sm font-medium">Property Handover Mumbai</span>
            <span className="px-4 py-2 bg-red-100 text-red-700 rounded-full text-sm font-medium">Documentation Support</span>
            <span className="px-4 py-2 bg-red-100 text-red-700 rounded-full text-sm font-medium">Legal Verification</span>
            <span className="px-4 py-2 bg-red-100 text-red-700 rounded-full text-sm font-medium">Technical Inspection</span>
            <span className="px-4 py-2 bg-red-100 text-red-700 rounded-full text-sm font-medium">Utility Transfer</span>
            <span className="px-4 py-2 bg-red-100 text-red-700 rounded-full text-sm font-medium">Digital Records</span>
            <span className="px-4 py-2 bg-red-100 text-red-700 rounded-full text-sm font-medium">Post Handover Support</span>
            <span className="px-4 py-2 bg-red-100 text-red-700 rounded-full text-sm font-medium">Professional Service</span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HandoverServicesEmbedded;

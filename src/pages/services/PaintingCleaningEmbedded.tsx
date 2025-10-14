import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/hooks/useProfile";
import { PaintBucket, Sparkles, Home, Building2, Clock, CheckCircle, Shield, Star, Users, Crown, Globe, Headphones, Paintbrush, Droplets, X } from "lucide-react";
import { sendServicesApplicationEmail } from "@/services/emailService";

const PaintingCleaningEmbedded = () => {
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
  const majorCities = ["Mumbai", "Delhi", "Bangalore", "Hyderabad", "Ahmedabad", "Chennai", "Kolkata", "Surat", "Pune", "Jaipur", "Lucknow", "Kanpur", "Nagpur", "Indore", "Thane", "Bhopal", "Visakhapatnam", "Pimpri-Chinchwad", "Patna", "Vadodara", "Ghaziabad", "Ludhiana", "Agra", "Nashik", "Faridabad", "Meerut", "Rajkot", "Kalyan-Dombivli", "Vasai-Virar", "Varanasi", "Srinagar", "Aurangabad", "Dhanbad", "Amritsar", "Navi Mumbai", "Allahabad", "Ranchi", "Howrah", "Coimbatore", "Jabalpur", "Gwalior", "Vijayawada", "Jodhpur", "Madurai", "Raipur", "Kota", "Guwahati", "Chandigarh", "Solapur", "Hubli-Dharwad"];
  const services = [{
    icon: PaintBucket,
    title: "Interior Painting",
    description: "Professional interior wall painting with premium quality paints."
  }, {
    icon: Home,
    title: "Exterior Painting",
    description: "Weather-resistant exterior painting for lasting protection."
  }, {
    icon: Sparkles,
    title: "Deep House Cleaning",
    description: "Comprehensive deep cleaning for every corner of your home."
  }, {
    icon: Droplets,
    title: "Bathroom Cleaning",
    description: "Specialized bathroom sanitization and deep cleaning."
  }, {
    icon: Building2,
    title: "Kitchen Cleaning",
    description: "Complete kitchen degreasing and appliance cleaning."
  }, {
    icon: Paintbrush,
    title: "Sofa & Upholstery Cleaning",
    description: "Professional fabric and leather furniture cleaning."
  }];
  const targetAudience = [{
    icon: Home,
    title: "Homeowners",
    description: "Looking for professional painting and cleaning services"
  }, {
    icon: Building2,
    title: "Tenants",
    description: "Need move-in/move-out cleaning and touch-up painting"
  }, {
    icon: Users,
    title: "Property Managers",
    description: "Require regular maintenance and cleaning services"
  }];
  const comparisonData = [{
    feature: "Professional Quality Work",
    homeHNI: true,
    others: false
  }, {
    feature: "Eco-Friendly Materials",
    homeHNI: true,
    others: false
  }, {
    feature: "Trained & Verified Staff",
    homeHNI: true,
    others: false
  }, {
    feature: "Transparent Pricing",
    homeHNI: true,
    others: false
  }, {
    feature: "Post-Service Support",
    homeHNI: true,
    others: false
  }, {
    feature: "Quality Guarantee",
    homeHNI: true,
    others: false
  }, {
    feature: "Same Day Service",
    homeHNI: true,
    others: false
  }, {
    feature: "Insurance Coverage",
    homeHNI: true,
    others: false
  }];
  const testimonials = [{
    name: "Priya Sharma",
    role: "Homeowner",
    image: "/lovable-uploads/46a07bb4-9f10-4614-ad52-73dfb2de4f28.png",
    rating: 5,
    text: "Excellent painting service! My house looks brand new. The team was professional and completed work on time."
  }, {
    name: "Rajesh Kumar",
    role: "Property Manager",
    image: "/lovable-uploads/5b898e4e-d9b6-4366-b58f-176fc3c8a9c3.png",
    rating: 5,
    text: "Outstanding deep cleaning service. Every corner was spotless. Highly recommend for move-in cleaning!"
  }, {
    name: "Anita Reddy",
    role: "Apartment Owner",
    image: "/lovable-uploads/6e6c47cd-700c-49d4-bfee-85a69bb8353f.png",
    rating: 5,
    text: "Best painting and cleaning service in the city. Eco-friendly materials and professional approach."
  }];
  const faqs = [{
    question: "What painting and cleaning services do you offer?",
    answer: "We offer interior painting, exterior painting, deep house cleaning, bathroom cleaning, kitchen cleaning, and sofa/upholstery cleaning services."
  }, {
    question: "Do you use eco-friendly materials?",
    answer: "Yes, we use only eco-friendly, non-toxic paints and cleaning products that are safe for your family and pets."
  }, {
    question: "How long does the service take?",
    answer: "Service duration varies based on the scope of work. Cleaning services typically take 4-8 hours, while painting can take 1-3 days depending on the area."
  }, {
    question: "Do you provide a warranty on your work?",
    answer: "Yes, we provide a quality guarantee on our painting work and offer post-service support for all our cleaning services."
  }, {
    question: "Are your staff trained and verified?",
    answer: "All our staff are professionally trained, background verified, and insured for your peace of mind."
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
            {/* Left: Copy */}
            <div className="max-w-2xl">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
                Professional Painting & Cleaning
                <br className="hidden md:block" />
                <span className="block">Services You Can Trust</span>
              </h1>
              <p className="text-lg md:text-xl text-white/90 mb-6">
                Transform your space with our expert painting and cleaning services.
                Eco-friendly materials, trained staff, and quality guarantee.
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
      <div className="hidden lg:block absolute top-8 right-8 z-50">
        <div className="w-96 sticky top-8">
        <Card className="w-full rounded-xl shadow-2xl bg-background border-2 border-primary">
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold text-foreground mb-2 text-center">Need painting or cleaning?</h3>
            <p className="text-sm text-muted-foreground mb-4 text-center">Fill the form & get instant quote</p>

            <form className="space-y-4" onSubmit={async (e) => {
              e.preventDefault();
              const form = e.currentTarget as HTMLFormElement;
              const formData = new FormData(form);
              const name = formData.get('name') as string;
              const email = formData.get('email') as string;
              
              try {
                await sendServicesApplicationEmail(email || '', name, 'painting-cleaning');
                toast({
                  title: "Request received",
                  description: "Our team will contact you shortly with a quote.",
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
              (e.currentTarget as HTMLFormElement).reset();
            }}>
              <Input 
                id="painting-name" 
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
                <Input id="painting-phone" name="phone" type="tel" placeholder="Phone Number" className="flex-1" required />
              </div>

              <Input 
                id="painting-email" 
                name="email" 
                type="email" 
                placeholder="Email ID" 
                defaultValue={autoFillData.email}
              />

              <div className="flex gap-2">
                <Select name="serviceType">
                  <SelectTrigger id="service-type" className="flex-1"><SelectValue placeholder="Service Type" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="painting">Painting Services</SelectItem>
                    <SelectItem value="cleaning">Cleaning Services</SelectItem>
                    <SelectItem value="both">Both Painting & Cleaning</SelectItem>
                  </SelectContent>
                </Select>
                <Select name="propertyType">
                  <SelectTrigger id="property-type" className="flex-1"><SelectValue placeholder="Property Type" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="residential">Residential</SelectItem>
                    <SelectItem value="commercial">Commercial</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Select name="city">
                <SelectTrigger id="painting-city" className="flex-1"><SelectValue placeholder="Select City" /></SelectTrigger>
                <SelectContent>
                  {majorCities.map(city => <SelectItem key={city} value={city.toLowerCase()}>{city}</SelectItem>)}
                </SelectContent>
              </Select>

            <Button type="submit" className="w-full bg-red-800 hover:bg-red-900 text-white">Talk to Us Today!</Button>
              
              {/* Inline message */}
              {formMessage.type && <div className={`mt-2 p-3 rounded-lg text-sm ${formMessage.type === 'error' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'}`}>
                  {formMessage.text}
                </div>}
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
              <h3 className="text-2xl font-bold text-foreground mb-3">Need painting or cleaning?</h3>
              <p className="text-base text-muted-foreground mb-8">Fill the form & get instant quote</p>

              <form className="space-y-5" onSubmit={async (e) => {
              e.preventDefault();
              const form = e.currentTarget as HTMLFormElement;
              const formData = new FormData(form);
              const name = formData.get('name') as string;
              const email = formData.get('email') as string;
              
              try {
                await sendServicesApplicationEmail(email || '', name, 'painting-cleaning');
                toast({
                  title: "Request received",
                  description: "Our team will contact you shortly with a quote.",
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
              (e.currentTarget as HTMLFormElement).reset();
            }}>
                <Input 
                  id="painting-name-mobile" 
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
                  <Input id="painting-phone-mobile" name="phone" type="tel" placeholder="Phone Number" className="flex-1 h-12 text-base bg-background" required />
                </div>

                <Input 
                  id="painting-email-mobile" 
                  name="email" 
                  type="email" 
                  placeholder="Email ID" 
                  defaultValue={autoFillData.email}
                  className="h-12 text-base bg-background" 
                />

                <div className="flex flex-col md:flex-row gap-3">
                  <Select name="serviceType">
                    <SelectTrigger id="service-type-mobile" className="flex-1 h-12 bg-background">
                      <SelectValue placeholder="Service Type" />
                    </SelectTrigger>
                    <SelectContent className="bg-background border shadow-lg">
                      <SelectItem value="painting">Painting Services</SelectItem>
                      <SelectItem value="cleaning">Cleaning Services</SelectItem>
                      <SelectItem value="both">Both Painting & Cleaning</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select name="propertyType">
                    <SelectTrigger id="property-type-mobile" className="flex-1 h-12 bg-background">
                      <SelectValue placeholder="Property Type" />
                    </SelectTrigger>
                    <SelectContent className="bg-background border shadow-lg">
                      <SelectItem value="residential">Residential</SelectItem>
                      <SelectItem value="commercial">Commercial</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                  <Select name="city">
                    <SelectTrigger id="painting-city-mobile" className="flex-1 h-12 bg-background">
                      <SelectValue placeholder="Select City" />
                    </SelectTrigger>
                    <SelectContent className="bg-background border shadow-lg">
                      {majorCities.map(city => <SelectItem key={city} value={city.toLowerCase()}>{city}</SelectItem>)}
                    </SelectContent>
                  </Select>

                <Button type="submit" className="w-full h-12 text-base font-semibold bg-red-600 hover:bg-red-700 text-white mt-6">
                  Talk to Us Today!
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

      {/* What's in it for you Section */}
      <section className="py-16 px-4 bg-background">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 items-start">
            <div className="max-w-2xl pr-8">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8">
                Why choose our painting & cleaning services?
              </h2>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-red-600" />
                  </div>
                  <h3 className="text-base font-semibold text-foreground">
                    Professional Quality Work
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Expert craftsmen with years of experience in painting and cleaning
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-red-600" />
                  </div>
                  <h3 className="text-base font-semibold text-foreground">
                    Eco-Friendly Materials
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Non-toxic, eco-friendly paints and cleaning products safe for family
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-red-600" />
                  </div>
                  <h3 className="text-base font-semibold text-foreground">
                    Trained Staff
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Background verified, trained professionals with insurance coverage
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                    <Globe className="w-5 h-5 text-red-600" />
                  </div>
                  <h3 className="text-base font-semibold text-foreground">
                    Transparent Pricing
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    No hidden charges with upfront pricing and detailed quotations
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                    <Headphones className="w-5 h-5 text-red-600" />
                  </div>
                  <h3 className="text-base font-semibold text-foreground">
                    Post-Service Support
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Ongoing support and maintenance guidance after service completion
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                    <Shield className="w-5 h-5 text-red-600" />
                  </div>
                  <h3 className="text-base font-semibold text-foreground">
                    Quality Guarantee
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    100% satisfaction guarantee with warranty on painting work
                  </p>
                </div>
              </div>
            </div>
            
            {/* Right side spacing for sticky form */}
            <div className="hidden lg:block"></div>
          </div>
        </div>
      </section>

      {/* Services Info Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div className="max-w-3xl">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8">
                Comprehensive Painting & Cleaning Solutions
              </h2>
              <div className="text-muted-foreground space-y-4 text-sm leading-relaxed">
                <p>
                  Whether you're looking to refresh your home with a new coat of paint, deep clean your space, 
                  or prepare for a special occasion, our comprehensive painting and cleaning solutions are designed 
                  to meet your unique needs. With eco-friendly materials and professional expertise, we transform 
                  your space while ensuring the safety of your family and environment.
                </p>
                <p>
                  Our team of trained professionals uses only the highest quality, non-toxic paints and 
                  cleaning products. From interior and exterior painting to deep house cleaning and specialized 
                  services like sofa cleaning, we cover all your home maintenance needs under one roof.
                </p>
                <p>
                  We understand that your home is your sanctuary, which is why we provide transparent pricing, 
                  flexible scheduling, and a quality guarantee on all our services. Our background-verified staff 
                  ensures your peace of mind throughout the service process.
                </p>
              </div>
            </div>
            
            {/* Right side spacing for sticky form */}
            <div className="hidden lg:block"></div>
          </div>
        </div>
      </section>

      {/* Our Services Section */}
      <section className="py-16 px-4 bg-background">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div className="max-w-3xl">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8">
                Our Painting & Cleaning Services
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                {services.map((service, index) => <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                      <service.icon className="w-6 h-6 text-red-600" />
                    </div>
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
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-12">
                Trusted by Thousands
              </h2>
              
              <div className="grid grid-cols-2 gap-8">
                <div className="text-center">
                  <div className="text-4xl md:text-5xl font-bold text-red-600 mb-2">5000+</div>
                  <div className="text-sm text-muted-foreground">Projects Completed</div>
                </div>
                
                <div className="text-center">
                  <div className="text-4xl md:text-5xl font-bold text-red-600 mb-2">4.8</div>
                  <div className="text-sm text-muted-foreground">Average Rating</div>
                </div>
                
                <div className="text-center">
                  <div className="text-4xl md:text-5xl font-bold text-red-600 mb-2">25+</div>
                  <div className="text-sm text-muted-foreground">Cities Covered</div>
                </div>
                
                <div className="text-center">
                  <div className="text-4xl md:text-5xl font-bold text-red-600 mb-2">98%</div>
                  <div className="text-sm text-muted-foreground">Customer Satisfaction</div>
                </div>
              </div>
            </div>
            
            {/* Right side spacing for sticky form */}
            <div className="hidden lg:block"></div>
          </div>
        </div>
      </section>

      {/* Why Home HNI is Better Section */}
      <section className="py-16 px-4 bg-background">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div className="max-w-3xl">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8">
                Why Home HNI is Better
              </h2>
              
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="grid grid-cols-3 bg-gray-50 border-b border-gray-200">
                  <div className="p-4 text-sm font-medium text-foreground">Features</div>
                  <div className="p-4 text-sm font-medium text-red-600 text-center border-l border-gray-200">Home HNI</div>
                  <div className="p-4 text-sm font-medium text-muted-foreground text-center border-l border-gray-200">Others</div>
                </div>
                
                {comparisonData.map((item, index) => <div key={index} className="grid grid-cols-3 border-b border-gray-100 last:border-b-0">
                    <div className="p-4 text-sm text-foreground">{item.feature}</div>
                    <div className="p-4 text-center border-l border-gray-100">
                      {item.homeHNI ? <CheckCircle className="w-5 h-5 text-green-500 mx-auto" /> : <span className="text-gray-300">×</span>}
                    </div>
                    <div className="p-4 text-center border-l border-gray-100">
                      {item.others ? <CheckCircle className="w-5 h-5 text-green-500 mx-auto" /> : <span className="text-gray-300">×</span>}
                    </div>
                  </div>)}
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
                What Our Customers Say
              </h2>
              
              <div className="grid gap-6">
                {testimonials.map((testimonial, index) => <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-start gap-4">
                      <img src={testimonial.image} alt={testimonial.name} className="w-12 h-12 rounded-full object-cover" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex">
                            {[...Array(testimonial.rating)].map((_, i) => <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)}
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">"{testimonial.text}"</p>
                        <div>
                          <div className="font-medium text-foreground text-sm">{testimonial.name}</div>
                          <div className="text-xs text-muted-foreground">{testimonial.role}</div>
                        </div>
                      </div>
                    </div>
                  </div>)}
              </div>
            </div>
            
            {/* Right side spacing for sticky form */}
            <div className="hidden lg:block"></div>
          </div>
        </div>
      </section>

      {/* Who We Serve Section */}
      <section className="py-16 px-4 bg-background">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div className="max-w-3xl">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8">
                Who We Serve
              </h2>
              
              <div className="grid gap-6">
                {targetAudience.map((audience, index) => <div key={index} className="flex items-start gap-4 p-6 bg-white rounded-xl border border-gray-100">
                    <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <audience.icon className="w-6 h-6 text-red-600" />
                    </div>
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
                {faqs.map((faq, index) => <AccordionItem key={index} value={`item-${index}`} className="border-b border-gray-200">
                    <AccordionTrigger className="text-left text-sm font-medium text-foreground hover:no-underline py-4">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-sm text-muted-foreground pb-4">
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
      <section className="py-12 px-4 bg-background border-t border-gray-200">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div className="max-w-3xl">
              <h2 className="text-xl font-bold text-foreground mb-6">
                Service Tags
              </h2>
              
              <div className="flex flex-wrap gap-2">
                {["Interior Painting", "Exterior Painting", "House Cleaning", "Deep Cleaning", "Bathroom Cleaning", "Kitchen Cleaning", "Sofa Cleaning", "Wall Painting", "Professional Painters", "Home Cleaning Service", "Eco-friendly Paint", "Residential Cleaning", "Commercial Cleaning", "Move-in Cleaning", "Move-out Cleaning", "Upholstery Cleaning", "Professional Cleaning"].map((tag, index) => <span key={index} className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-full border border-gray-200">
                    {tag}
                  </span>)}
              </div>
            </div>
            
            {/* Right side spacing for sticky form */}
            <div className="hidden lg:block"></div>
          </div>
        </div>
      </section>
    </div>;
};
export default PaintingCleaningEmbedded;
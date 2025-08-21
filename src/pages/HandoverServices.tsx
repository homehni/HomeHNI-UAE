import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useToast } from "@/hooks/use-toast";
import { Building2, Users, FileCheck, Search, Database, Headphones, MapPin, Crown, Clock, CheckCircle, Shield, Star, X, Plus, Minus, Globe, ShieldCheck, Home, Key, Users2, Building } from "lucide-react";
import Marquee from "@/components/Marquee";
import Header from "@/components/Header";
const HandoverServices = () => {
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
    feature: "Legal Verification Process",
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
    feature: "Same-Day Service Available",
    homeHNI: true,
    others: false
  }, {
    feature: "Legal Liability Coverage",
    homeHNI: true,
    others: false
  }];
  const testimonials = [{
    name: "Priya Sharma",
    role: "Property Buyer",
    image: "/lovable-uploads/46a07bb4-9f10-4614-ad52-73dfb2de4f28.png",
    rating: 5,
    text: "Seamless handover process! Every document was verified and explained clearly."
  }, {
    name: "Rajesh Gupta",
    role: "Property Seller",
    image: "/lovable-uploads/5b898e4e-d9b6-4366-b58f-176fc3c8a9c3.png",
    rating: 5,
    text: "Professional service that ensured smooth handover with all legal clearances."
  }, {
    name: "Kavita Reddy",
    role: "Landlord",
    image: "/lovable-uploads/6e6c47cd-700c-49d4-bfee-85a69bb8353f.png",
    rating: 5,
    text: "Best handover service! They handled everything from documentation to utility transfers."
  }];
  const faqs = [{
    question: "What documents are covered in handover services?",
    answer: "We handle all property documents including sale deed, NOCs, completion certificates, possession letter, utility bills, society documents, and any other relevant paperwork."
  }, {
    question: "How long does the handover process take?",
    answer: "Depending on the property type and documentation status, handover typically takes 2-5 working days. We provide expedited services for urgent requirements."
  }, {
    question: "Do you provide technical inspection reports?",
    answer: "Yes, we conduct comprehensive technical inspections covering structural, electrical, plumbing, and other systems. A detailed report is provided highlighting any issues."
  }, {
    question: "What if issues are found during inspection?",
    answer: "Our team provides detailed reports with recommendations. We can coordinate with builders/sellers for resolution or help negotiate terms based on findings."
  }, {
    question: "Do you assist with utility transfers?",
    answer: "Yes, we help transfer electricity, water, gas, internet, and other utility connections from seller to buyer, ensuring seamless transition."
  }];
  const {
    toast
  } = useToast();
  useEffect(() => {
    const title = "Property Handover Services | Professional & Legal Support | Home HNI";
    document.title = title;
    const desc = "Professional property handover services with complete documentation support, legal verification, technical inspection, and utility transfer assistance.";
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
    canonical.setAttribute('href', window.location.origin + '/handover-services');
  }, []);
  return <div className="min-h-screen">
      <Marquee />
      <Header />
      
      {/* Hero Section */}
      <section className="relative pt-36 md:pt-40 pb-28 md:pb-40 px-4 md:px-8 text-white overflow-hidden bg-cover bg-center bg-no-repeat" style={{
      backgroundImage: "url('/lovable-uploads/fbb0d72f-782e-49f5-bbe1-8afc1314b5f7.png')"
    }}>
        <div className="absolute inset-0 bg-red-900/80 pointer-events-none" />

        <div className="relative z-10 container mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 items-start">
            {/* Left: Copy */}
            <div className="max-w-2xl">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
                Seamless Property Handover
                <br className="hidden md:block" />
                <span className="block">Services</span>
              </h1>
              <p className="text-lg md:text-xl text-white/90 mb-6">
                Professional property handover with complete documentation support, 
                legal verification, and technical inspection services.
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
            <h3 className="text-xl font-semibold text-foreground mb-2">Need handover assistance?</h3>
            <p className="text-sm text-muted-foreground mb-4">Fill the form & get expert support</p>

            <form className="space-y-4" onSubmit={e => {
            e.preventDefault();
            toast({
              title: "Request received",
              description: "Our handover expert will contact you shortly."
            });
            (e.currentTarget as HTMLFormElement).reset();
          }}>
              <Input id="handover-name" name="name" placeholder="Name" required />

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

              <Input id="handover-email" name="email" type="email" placeholder="Email ID" />

              <Select name="propertyType">
                <SelectTrigger id="property-type"><SelectValue placeholder="Property Type" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="residential">Residential</SelectItem>
                  <SelectItem value="commercial">Commercial</SelectItem>
                  <SelectItem value="industrial">Industrial</SelectItem>
                  <SelectItem value="agricultural">Agricultural</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex gap-2">
                <Input id="handover-location" name="location" placeholder="Property Location" className="flex-1" />
                <Select name="handoverType">
                  <SelectTrigger id="handover-type" className="w-40"><SelectValue placeholder="Handover Type" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="buying">Buying Property</SelectItem>
                    <SelectItem value="selling">Selling Property</SelectItem>
                    <SelectItem value="rental">Rental Handover</SelectItem>
                    <SelectItem value="possession">New Possession</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2">
                <Select name="country">
                  <SelectTrigger id="handover-country" className="flex-1"><SelectValue placeholder="Country" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="india">India</SelectItem>
                    <SelectItem value="usa">United States</SelectItem>
                    <SelectItem value="uk">United Kingdom</SelectItem>
                    <SelectItem value="canada">Canada</SelectItem>
                    <SelectItem value="australia">Australia</SelectItem>
                  </SelectContent>
                </Select>
                <Select name="state">
                  <SelectTrigger id="handover-state" className="flex-1"><SelectValue placeholder="State" /></SelectTrigger>
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
                <Select name="city">
                  <SelectTrigger id="handover-city" className="flex-1"><SelectValue placeholder="City" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bangalore">Bangalore</SelectItem>
                    <SelectItem value="hyderabad">Hyderabad</SelectItem>
                    <SelectItem value="chennai">Chennai</SelectItem>
                    <SelectItem value="mumbai">Mumbai</SelectItem>
                    <SelectItem value="pune">Pune</SelectItem>
                    <SelectItem value="delhi">Delhi</SelectItem>
                    <SelectItem value="kolkata">Kolkata</SelectItem>
                    <SelectItem value="ahmedabad">Ahmedabad</SelectItem>
                    <SelectItem value="jaipur">Jaipur</SelectItem>
                    <SelectItem value="lucknow">Lucknow</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button type="submit" className="w-full">Get Expert Assistance!</Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Mobile Form - Static below hero */}
      <section className="lg:hidden px-4 py-8 bg-background">
        <div className="container mx-auto max-w-xl px-4">
          <Card className="w-full rounded-2xl shadow-xl border-2 border-primary bg-card">
            <CardContent className="p-8 border-2 border-primary">
              <h3 className="text-2xl font-bold text-foreground mb-3">Need handover assistance?</h3>
              <p className="text-base text-muted-foreground mb-8">Fill the form & get expert support</p>

              <form className="space-y-5" onSubmit={e => {
              e.preventDefault();
              toast({
                title: "Request received",
                description: "Our handover expert will contact you shortly."
              });
              (e.currentTarget as HTMLFormElement).reset();
            }}>
                <Input id="handover-name-mobile" name="name" placeholder="Name" className="h-12 text-base bg-background" required />

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
                  <Input id="handover-phone-mobile" name="phone" type="tel" placeholder="Phone Number" className="flex-1 h-12 text-base bg-background" required />
                </div>

                <Input id="handover-email-mobile" name="email" type="email" placeholder="Email ID" className="h-12 text-base bg-background" />

                <Select name="propertyType">
                  <SelectTrigger id="property-type-mobile" className="h-12 bg-background">
                    <SelectValue placeholder="Property Type" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border shadow-lg">
                    <SelectItem value="residential">Residential</SelectItem>
                    <SelectItem value="commercial">Commercial</SelectItem>
                    <SelectItem value="industrial">Industrial</SelectItem>
                    <SelectItem value="agricultural">Agricultural</SelectItem>
                  </SelectContent>
                </Select>

                <div className="flex gap-3">
                  <Input id="handover-location-mobile" name="location" placeholder="Property Location" className="flex-1 h-12 text-base bg-background" />
                  <Select name="handoverType">
                    <SelectTrigger id="handover-type-mobile" className="w-40 h-12 bg-background">
                      <SelectValue placeholder="Handover Type" />
                    </SelectTrigger>
                    <SelectContent className="bg-background border shadow-lg">
                      <SelectItem value="buying">Buying Property</SelectItem>
                      <SelectItem value="selling">Selling Property</SelectItem>
                      <SelectItem value="rental">Rental Handover</SelectItem>
                      <SelectItem value="possession">New Possession</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-3">
                  <Select name="country">
                    <SelectTrigger id="handover-country-mobile" className="flex-1 h-12 bg-background">
                      <SelectValue placeholder="Country" />
                    </SelectTrigger>
                    <SelectContent className="bg-background border shadow-lg">
                      <SelectItem value="india">India</SelectItem>
                      <SelectItem value="usa">United States</SelectItem>
                      <SelectItem value="uk">United Kingdom</SelectItem>
                      <SelectItem value="canada">Canada</SelectItem>
                      <SelectItem value="australia">Australia</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select name="state">
                    <SelectTrigger id="handover-state-mobile" className="flex-1 h-12 bg-background">
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
                  <Select name="city">
                    <SelectTrigger id="handover-city-mobile" className="flex-1 h-12 bg-background">
                      <SelectValue placeholder="City" />
                    </SelectTrigger>
                    <SelectContent className="bg-background border shadow-lg">
                      <SelectItem value="bangalore">Bangalore</SelectItem>
                      <SelectItem value="hyderabad">Hyderabad</SelectItem>
                      <SelectItem value="chennai">Chennai</SelectItem>
                      <SelectItem value="mumbai">Mumbai</SelectItem>
                      <SelectItem value="pune">Pune</SelectItem>
                      <SelectItem value="delhi">Delhi</SelectItem>
                      <SelectItem value="kolkata">Kolkata</SelectItem>
                      <SelectItem value="ahmedabad">Ahmedabad</SelectItem>
                      <SelectItem value="jaipur">Jaipur</SelectItem>
                      <SelectItem value="lucknow">Lucknow</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button type="submit" className="w-full h-12 text-base font-semibold bg-red-600 hover:bg-red-700 text-white mt-6">
                  Get Expert Assistance!
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
                Why choose our handover services?
              </h2>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                    <FileCheck className="w-5 h-5 text-red-600" />
                  </div>
                  <h3 className="text-base font-semibold text-foreground">
                    Complete Documentation Support
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Handle all legal documents and certificates required for handover
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5 text-red-600" />
                  </div>
                  <h3 className="text-base font-semibold text-foreground">
                    Legal Verification & Clearance
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Ensure all legal aspects are verified and cleared before handover
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                    <Search className="w-5 h-5 text-red-600" />
                  </div>
                  <h3 className="text-base font-semibold text-foreground">
                    Technical Property Inspection
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Thorough technical inspection to identify any issues before handover
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                    <Key className="w-5 h-5 text-red-600" />
                  </div>
                  <h3 className="text-base font-semibold text-foreground">
                    Utility Transfer Assistance
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Help with transferring electricity, water, and other utility connections
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                    <Database className="w-5 h-5 text-red-600" />
                  </div>
                  <h3 className="text-base font-semibold text-foreground">
                    Digital Record Management
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Maintain digital records of all handover documents and certificates
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                    <Headphones className="w-5 h-5 text-red-600" />
                  </div>
                  <h3 className="text-base font-semibold text-foreground">
                    Post-Handover Support
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Continued support for any issues or queries after property handover
                  </p>
                </div>
              </div>
            </div>
            
            {/* Right side spacing for sticky form */}
            <div className="hidden lg:block"></div>
          </div>
        </div>
      </section>

      {/* Handover Services Info Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div className="max-w-3xl">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8">
                Comprehensive Handover Solutions
              </h2>
              <div className="text-muted-foreground space-y-4 text-sm leading-relaxed">
                <p>
                  Whether you're buying your first home, selling an investment property, or managing rental 
                  handovers, our comprehensive handover services ensure every detail is handled professionally. 
                  From documentation to technical inspections, we provide end-to-end support for seamless 
                  property transitions.
                </p>
                <p>
                  Our expert team handles all aspects of property handover including legal verification, 
                  technical inspections, utility transfers, and post-handover support. With years of experience 
                  in the real estate industry, we ensure that your property handover is smooth, legal, and 
                  stress-free.
                </p>
                <p>
                  We work with buyers, sellers, landlords, and tenants across residential, commercial, and 
                  industrial properties. Our digital record management system ensures all documents are 
                  properly maintained and easily accessible whenever needed.
                </p>
              </div>
            </div>
            
            {/* Right side spacing for sticky form */}
            <div className="hidden lg:block"></div>
          </div>
        </div>
      </section>

      {/* Our Handover Services */}
      <section className="py-16 px-4 bg-background">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div className="max-w-3xl">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8">
                Our Handover Services
              </h2>
              
              <div className="grid gap-6">
                {services.map((service, index) => <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <service.icon className="w-6 h-6 text-red-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-foreground mb-2">{service.title}</h3>
                        <p className="text-muted-foreground text-sm">{service.description}</p>
                      </div>
                    </div>
                  </Card>)}
              </div>
            </div>
            
            {/* Right side spacing for sticky form */}
            <div className="hidden lg:block"></div>
          </div>
        </div>
      </section>

      {/* Trusted by Thousands Stats */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div className="max-w-3xl">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8">
                Trusted by Thousands
              </h2>
              
              <div className="grid grid-cols-2 gap-8">
                <div className="text-center">
                  <div className="text-4xl font-bold text-red-600 mb-2">5,000+</div>
                  <div className="text-muted-foreground">Properties Handed Over</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-red-600 mb-2">98%</div>
                  <div className="text-muted-foreground">Happy Clients</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-red-600 mb-2">2-5</div>
                  <div className="text-muted-foreground">Days Average Processing</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-red-600 mb-2">100%</div>
                  <div className="text-muted-foreground">Success Rate</div>
                </div>
              </div>
            </div>
            
            {/* Right side spacing for sticky form */}
            <div className="hidden lg:block"></div>
          </div>
        </div>
      </section>

      {/* Why Home HNI is Better */}
      <section className="py-16 px-4 bg-background">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div className="max-w-3xl">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8">
                Why Choose HomeHNI Handover Services?
              </h2>
              
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 pr-4 font-semibold text-foreground">Features</th>
                      <th className="text-center py-3 px-2 font-semibold text-red-600">HomeHNI</th>
                      <th className="text-center py-3 pl-2 font-semibold text-muted-foreground">Others</th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparisonData.map((item, index) => <tr key={index} className="border-b">
                        <td className="py-3 pr-4 text-sm text-foreground">{item.feature}</td>
                        <td className="text-center py-3 px-2">
                          {item.homeHNI ? <CheckCircle className="w-5 h-5 text-green-600 mx-auto" /> : <X className="w-5 h-5 text-red-500 mx-auto" />}
                        </td>
                        <td className="text-center py-3 pl-2">
                          {item.others ? <CheckCircle className="w-5 h-5 text-green-600 mx-auto" /> : <X className="w-5 h-5 text-red-500 mx-auto" />}
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

      {/* Customer Testimonials */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div className="max-w-3xl">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8">
                Customer Testimonials
              </h2>
              
              <div className="space-y-6">
                {testimonials.map((testimonial, index) => <Card key={index} className="p-6">
                    <div className="flex items-start gap-4">
                      <img src={testimonial.image} alt={testimonial.name} className="w-12 h-12 rounded-full object-cover" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold text-foreground">{testimonial.name}</h4>
                          <span className="text-sm text-muted-foreground">• {testimonial.role}</span>
                        </div>
                        <div className="flex items-center gap-1 mb-3">
                          {[...Array(testimonial.rating)].map((_, i) => <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)}
                        </div>
                        <p className="text-muted-foreground text-sm">{testimonial.text}</p>
                      </div>
                    </div>
                  </Card>)}
              </div>
            </div>
            
            {/* Right side spacing for sticky form */}
            <div className="hidden lg:block"></div>
          </div>
        </div>
      </section>

      {/* Who We Serve */}
      <section className="py-16 px-4 bg-background">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div className="max-w-3xl">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8">
                Who We Serve
              </h2>
              
              <div className="grid gap-6">
                {targetAudience.map((audience, index) => <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <audience.icon className="w-6 h-6 text-red-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-foreground mb-2">{audience.title}</h3>
                        <p className="text-muted-foreground text-sm">{audience.description}</p>
                      </div>
                    </div>
                  </Card>)}
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
                {faqs.map((faq, index) => <AccordionItem key={index} value={`item-${index}`} className="border border-border rounded-lg px-6">
                    <AccordionTrigger className="text-left hover:no-underline py-4">
                      <span className="font-semibold text-foreground">{faq.question}</span>
                    </AccordionTrigger>
                    <AccordionContent className="pb-4 text-muted-foreground text-sm leading-relaxed">
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

      {/* Service Tags */}
      <section className="py-16 px-4 bg-background">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div className="max-w-3xl">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8">
                Service Tags
              </h2>
              
              <div className="flex flex-wrap gap-2">
                {['Property Handover', 'Documentation Support', 'Legal Verification', 'Technical Inspection', 'Utility Transfer', 'Digital Records', 'Post Handover Support', 'Property Possession', 'Buying Handover', 'Selling Handover', 'Rental Handover', 'Mumbai Handover Services', 'Delhi Property Handover', 'Bangalore Handover', 'Pune Property Services', 'Chennai Handover', 'Hyderabad Property', 'Kolkata Handover Services', 'Ahmedabad Property', 'Residential Handover', 'Commercial Handover', 'Industrial Property', 'Property Legal Check', 'Document Verification', 'NOC Services', 'Completion Certificate', 'Property Inspection', 'Handover Checklist', 'Professional Handover'].map((tag, index) => <span key={index} className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                    {tag}
                  </span>)}
              </div>
            </div>
            
            {/* Right side spacing for sticky form */}
            <div className="hidden lg:block"></div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      
    </div>;
};
export default HandoverServices;
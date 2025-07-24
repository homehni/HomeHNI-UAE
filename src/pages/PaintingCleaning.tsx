import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Paintbrush, Sparkles, Shield, Clock, Users, CheckCircle, Upload, Calendar } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Marquee from "@/components/Marquee";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";

const PaintingCleaning = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    location: "",
    service: "",
    requirement: "",
    preferredDate: "",
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Thanks! Our team will reach out to you shortly.",
      description: "We've received your service request.",
    });
    setFormData({
      name: "",
      mobile: "",
      location: "",
      service: "",
      requirement: "",
      preferredDate: "",
    });
  };

  const paintingServices = [
    { icon: <Paintbrush className="h-8 w-8 text-primary" />, title: "Interior Painting", desc: "Transform your home interiors with quality paint" },
    { icon: <Paintbrush className="h-8 w-8 text-primary" />, title: "Exterior Painting", desc: "Weather-resistant exterior painting solutions" },
    { icon: <Paintbrush className="h-8 w-8 text-primary" />, title: "Wall Texturing", desc: "Creative wall textures and designs" },
    { icon: <Paintbrush className="h-8 w-8 text-primary" />, title: "Wood Polishing", desc: "Furniture and wood surface restoration" },
  ];

  const cleaningServices = [
    { icon: <Sparkles className="h-8 w-8 text-primary" />, title: "Deep House Cleaning", desc: "Comprehensive home cleaning services" },
    { icon: <Sparkles className="h-8 w-8 text-primary" />, title: "Kitchen Deep Cleaning", desc: "Thorough kitchen sanitization" },
    { icon: <Sparkles className="h-8 w-8 text-primary" />, title: "Bathroom Cleaning", desc: "Professional bathroom deep cleaning" },
    { icon: <Sparkles className="h-8 w-8 text-primary" />, title: "Post-Construction Cleaning", desc: "Clean-up after renovation work" },
  ];

  const whyChooseUs = [
    { icon: <Shield className="h-12 w-12 text-primary" />, title: "Verified Professionals", desc: "All our service providers are background verified" },
    { icon: <Clock className="h-12 w-12 text-primary" />, title: "Timely Service", desc: "On-time service delivery guaranteed" },
    { icon: <Users className="h-12 w-12 text-primary" />, title: "Experienced Team", desc: "Skilled professionals with years of experience" },
    { icon: <CheckCircle className="h-12 w-12 text-primary" />, title: "Quality Assured", desc: "100% satisfaction guarantee on all services" },
  ];

  const faqs = [
    {
      question: "What areas do you cover in Hyderabad?",
      answer: "We provide painting and cleaning services across all areas of Hyderabad including Gachibowli, Kondapur, Madhapur, Jubilee Hills, Banjara Hills, and more."
    },
    {
      question: "How do you ensure quality of work?",
      answer: "All our professionals are verified and trained. We use quality materials and provide a satisfaction guarantee on all our services."
    },
    {
      question: "What is the typical duration for painting a 2BHK?",
      answer: "A 2BHK apartment typically takes 3-5 days for complete interior painting, depending on the scope of work and number of coats required."
    },
    {
      question: "Do you provide materials or should I arrange them?",
      answer: "We can provide all necessary materials including paint, brushes, and cleaning supplies, or work with materials you've already purchased."
    },
    {
      question: "Is there any warranty on the painting work?",
      answer: "Yes, we provide a 1-year warranty on interior painting work against peeling, cracking, or fading under normal conditions."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Marquee />
      <Header />
      
      {/* Hero Section */}
      <section className="relative h-64 bg-gradient-to-r from-brand-red to-brand-maroon-dark flex items-center justify-center text-center text-white pt-20">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white drop-shadow-lg"
              style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>
            Painting & Cleaning Services
          </h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto text-white drop-shadow-md"
             style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.7)' }}>
            Transform your home with our professional painting and cleaning services. 
            Quality workmanship, trusted professionals, and guaranteed satisfaction for all your home improvement needs.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            
            {/* Painting Services */}
            <section>
              <h2 className="text-3xl font-bold text-foreground mb-8 flex items-center gap-3">
                <Paintbrush className="h-8 w-8 text-primary" />
                Painting Services We Offer
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                {paintingServices.map((service, index) => (
                  <Card key={index} className="hover:shadow-lg transition-shadow">
                    <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                      {service.icon}
                      <CardTitle className="ml-3 text-lg">{service.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{service.desc}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            {/* Cleaning Services */}
            <section>
              <h2 className="text-3xl font-bold text-foreground mb-8 flex items-center gap-3">
                <Sparkles className="h-8 w-8 text-primary" />
                Cleaning Services We Offer
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                {cleaningServices.map((service, index) => (
                  <Card key={index} className="hover:shadow-lg transition-shadow">
                    <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                      {service.icon}
                      <CardTitle className="ml-3 text-lg">{service.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{service.desc}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            {/* Why Choose Home HNI */}
            <section>
              <h2 className="text-3xl font-bold text-foreground mb-8 text-center">
                Why Choose Home HNI?
              </h2>
              <div className="grid md:grid-cols-2 gap-8">
                {whyChooseUs.map((item, index) => (
                  <div key={index} className="flex items-start gap-4 p-6 bg-muted/50 rounded-lg">
                    {item.icon}
                    <div>
                      <h3 className="text-xl font-semibold text-foreground mb-2">{item.title}</h3>
                      <p className="text-muted-foreground">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* FAQs */}
            <section>
              <h2 className="text-3xl font-bold text-foreground mb-8">
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
            </section>
          </div>

          {/* Booking Form Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="text-2xl text-center">Book Your Service</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Input
                      placeholder="Full Name"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div>
                    <Input
                      placeholder="Mobile Number"
                      type="tel"
                      value={formData.mobile}
                      onChange={(e) => setFormData({...formData, mobile: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div>
                    <Input
                      placeholder="Location in Hyderabad"
                      value={formData.location}
                      onChange={(e) => setFormData({...formData, location: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div>
                    <Select value={formData.service} onValueChange={(value) => setFormData({...formData, service: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose Service" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="painting">Painting</SelectItem>
                        <SelectItem value="cleaning">Cleaning</SelectItem>
                        <SelectItem value="both">Both</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Textarea
                      placeholder="Describe your requirement in detail"
                      value={formData.requirement}
                      onChange={(e) => setFormData({...formData, requirement: e.target.value})}
                      rows={3}
                    />
                  </div>
                  
                  <div className="flex items-center gap-2 p-3 border-2 border-dashed border-muted-foreground/25 rounded-lg cursor-pointer hover:border-primary/50 transition-colors">
                    <Upload className="h-5 w-5 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Upload images (optional, max 2MB)</span>
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="h-5 w-5 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Preferred Date</span>
                    </div>
                    <Input
                      type="date"
                      value={formData.preferredDate}
                      onChange={(e) => setFormData({...formData, preferredDate: e.target.value})}
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  
                  <Button type="submit" className="w-full bg-primary hover:bg-primary-glow text-white">
                    Submit Request
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PaintingCleaning;
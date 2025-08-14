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

  const architects = [{
    name: "Ar. Rajesh Kumar",
    specialization: "Residential Architecture",
    experience: "15+ years",
    projects: "200+ homes",
    image: "/lovable-uploads/46a07bb4-9f10-4614-ad52-73dfb2de4f28.png",
    rating: 4.9,
    location: "Bangalore"
  }, {
    name: "Ar. Sunita Patel",
    specialization: "Commercial Design",
    experience: "12+ years",
    projects: "100+ commercial",
    image: "/lovable-uploads/5b898e4e-d9b6-4366-b58f-176fc3c8a9c3.png",
    rating: 4.8,
    location: "Mumbai"
  }, {
    name: "Ar. Amit Gupta",
    specialization: "Sustainable Architecture",
    experience: "18+ years",
    projects: "150+ eco-friendly",
    image: "/lovable-uploads/6e6c47cd-700c-49d4-bfee-85a69bb8353f.png",
    rating: 4.9,
    location: "Delhi"
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

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    projectType: "",
    location: "",
    budget: "",
    timeline: "",
    requirements: ""
  });

  const { toast } = useToast();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Request Submitted!",
      description: "Our architects will contact you within 24 hours.",
    });
    // Reset form
    setFormData({
      name: "",
      phone: "",
      email: "",
      projectType: "",
      location: "",
      budget: "",
      timeline: "",
      requirements: ""
    });
  };

  useEffect(() => {
    // SEO meta tags
    document.title = "Professional Architects & Architectural Services | HomeHNI";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Connect with top architects for residential, commercial, and renovation projects. Get custom designs, 3D visualization, and expert consultation.');
    }

    // Schema markup for architects
    const schema = {
      "@context": "https://schema.org",
      "@type": "Service",
      "name": "Architectural Services",
      "provider": {
        "@type": "Organization",
        "name": "HomeHNI"
      },
      "description": "Professional architectural design services for residential and commercial projects",
      "offers": {
        "@type": "Offer",
        "availability": "https://schema.org/InStock"
      }
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(schema);
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Marquee />
      <Header />
      
      {/* Hero Section */}
      <section className="pt-24 pb-12 bg-gradient-to-r from-blue-800 to-blue-700">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-white">
              <h1 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                Transform Your Vision into 
                <span className="text-yellow-400"> Architectural Reality</span>
              </h1>
              <p className="text-xl mb-8 text-blue-100">
                Connect with India's top architects for residential, commercial, and renovation projects. 
                Get custom designs, 3D visualization, and expert consultation.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Button size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-blue-900 font-semibold px-8 py-3">
                  Get Free Consultation
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-800 px-8 py-3">
                  View Portfolio
                </Button>
              </div>

              <div className="flex items-center space-x-8 text-blue-100">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2 text-green-400" />
                  <span>500+ Projects Completed</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2 text-green-400" />
                  <span>Expert Architects</span>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white rounded-xl shadow-2xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Get Your Design Quote</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  required
                />
                <Input
                  type="tel"
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  required
                />
                <Input
                  type="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  required
                />
                <Select onValueChange={(value) => handleInputChange('projectType', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Project Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="residential">Residential</SelectItem>
                    <SelectItem value="commercial">Commercial</SelectItem>
                    <SelectItem value="renovation">Renovation</SelectItem>
                    <SelectItem value="interior">Interior Design</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  placeholder="Project Location"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  required
                />
                <Select onValueChange={(value) => handleInputChange('budget', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Project Budget" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="under-10L">Under ₹10 Lakhs</SelectItem>
                    <SelectItem value="10-25L">₹10-25 Lakhs</SelectItem>
                    <SelectItem value="25-50L">₹25-50 Lakhs</SelectItem>
                    <SelectItem value="50L-1Cr">₹50 Lakhs - 1 Crore</SelectItem>
                    <SelectItem value="above-1Cr">Above ₹1 Crore</SelectItem>
                  </SelectContent>
                </Select>
                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3">
                  Get Free Consultation
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">Our Architectural Services</h2>
          <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            From concept to construction, we provide comprehensive architectural solutions for all your building needs.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-6 text-center">
                  <service.icon className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-3">{service.title}</h3>
                  <p className="text-gray-600">{service.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Architects */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Featured Architects</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {architects.map((architect, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-6 text-center">
                  <img 
                    src={architect.image} 
                    alt={architect.name}
                    className="w-20 h-20 rounded-full mx-auto mb-4 object-cover"
                  />
                  <h3 className="text-xl font-semibold mb-2">{architect.name}</h3>
                  <p className="text-blue-600 font-medium mb-2">{architect.specialization}</p>
                  <div className="space-y-1 text-sm text-gray-600 mb-4">
                    <p>Experience: {architect.experience}</p>
                    <p>Projects: {architect.projects}</p>
                    <p>Location: {architect.location}</p>
                  </div>
                  <div className="flex items-center justify-center mb-4">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-4 h-4 ${i < Math.floor(architect.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                      ))}
                      <span className="ml-2 text-sm font-medium">{architect.rating}</span>
                    </div>
                  </div>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    View Profile
                  </Button>
                </CardContent>
              </Card>
            ))}
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
      <section className="py-16 bg-blue-600 text-white">
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
      </section>

      
    </div>
  );
};

export default Architects;
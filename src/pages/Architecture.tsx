import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Header from '@/components/Header';
import Marquee from '@/components/Marquee';
import Footer from '@/components/Footer';
import ChatBot from '@/components/ChatBot';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Lightbulb, Building2, Users, Leaf, Clock, CheckCircle, ArrowRight, Eye, MapPin, FileCheck, Hammer, Recycle, FileText } from 'lucide-react';

const consultationSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().min(10, 'Valid phone number is required'),
  projectType: z.string().min(1, 'Please select project type'),
  location: z.string().min(1, 'Location is required'),
  budget: z.string().min(1, 'Please select budget range'),
  message: z.string().optional(),
});

type ConsultationFormValues = z.infer<typeof consultationSchema>;

const Architecture = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<ConsultationFormValues>({
    resolver: zodResolver(consultationSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      projectType: '',
      location: '',
      budget: '',
      message: '',
    },
  });

  const onSubmit = async (values: ConsultationFormValues) => {
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Form submitted:', values);
      toast({
        title: "Consultation Booked!",
        description: "We'll contact you within 24 hours to discuss your project.",
      });
      form.reset();
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const services = [
    {
      icon: Eye,
      title: "Concept Development & 3D Visualization",
      description: "Explore your space before it's built with realistic renders."
    },
    {
      icon: MapPin,
      title: "Site Planning & Feasibility Studies",
      description: "Ensure the best use of space and regulatory alignment."
    },
    {
      icon: Building2,
      title: "Schematic & Detailed Design",
      description: "Functional layouts paired with elegant form."
    },
    {
      icon: Hammer,
      title: "Structural Design Collaboration",
      description: "Partnering with engineers for strong, safe builds."
    },
    {
      icon: Recycle,
      title: "Sustainability Integration",
      description: "Designs that minimize impact and maximize efficiency."
    },
    {
      icon: FileText,
      title: "Regulatory Approvals & Documentation",
      description: "Navigating local laws so you don't have to."
    }
  ];

  const principles = [
    { icon: Users, title: "Human-Centered Design" },
    { icon: Building2, title: "Contextual Relevance" },
    { icon: Leaf, title: "Sustainable Practices" },
    { icon: Clock, title: "Aesthetic Timelessness" },
    { icon: FileCheck, title: "Technical Accuracy" }
  ];

  const whyChooseUs = [
    "Dedicated In-House Architects & Visualizers",
    "Cutting-Edge Software (AutoCAD, Revit, BIM)",
    "Transparent Process, Clear Communication",
    "On-Time Project Delivery, Every Time"
  ];

  const projectShowcase = [
    {
      title: "Modern Office HQ",
      subtitle: "12,000 sq ft | Pune, 2023",
      image: "/lovable-uploads/c996469f-4da3-4235-b9fc-d1152fe010e8.png"
    },
    {
      title: "Luxury Residential Complex",
      subtitle: "8,500 sq ft | Mumbai, 2023",
      image: "/lovable-uploads/4ae8bc66-e5e0-4c61-88f6-cd00789ebc89.png"
    },
    {
      title: "Commercial Shopping Center",
      subtitle: "25,000 sq ft | Delhi, 2022",
      image: "/lovable-uploads/773d41c7-0eec-400e-a369-eaae7c40f9ca.png"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Marquee />
      <Header />
      
      <div className="pt-8">
        {/* Hero Section */}
        <section className="relative py-20 bg-gradient-to-br from-primary/10 via-white to-secondary/5">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
              Innovative Architecture That Shapes the Future
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              From residential spaces to large-scale commercial projects — we design with purpose, precision, and vision.
            </p>
            <Button size="lg" className="bg-brand-red hover:bg-brand-red-dark text-white px-8 py-3">
              Let's Build Together
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </section>

        {/* About Section */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <div className="flex items-center justify-center mb-6">
                <Building2 className="h-8 w-8 text-brand-red mr-3" />
                <h2 className="text-3xl md:text-4xl font-bold text-foreground">About Our Architecture Services</h2>
              </div>
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                At Home HNI, architecture is not just about building structures — it's about designing environments that inspire, function flawlessly, and last generations. Our team of experienced architects and planners combine creativity, technical expertise, and sustainable thinking to turn your ideas into reality.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Whether you're planning a home, a commercial complex, or an institutional space, we ensure every design is personalized, practical, and powerful in impact.
              </p>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">What We Offer</h2>
              <p className="text-lg text-muted-foreground">
                We provide end-to-end architectural services tailored to your needs:
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service, index) => (
                <div key={index} className="bg-background p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
                  <service.icon className="h-12 w-12 text-brand-red mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-3">{service.title}</h3>
                  <p className="text-muted-foreground">{service.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Design Philosophy */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <div className="flex items-center justify-center mb-6">
                <Lightbulb className="h-8 w-8 text-brand-red mr-3" />
                <h2 className="text-3xl md:text-4xl font-bold text-foreground">Our Design Philosophy</h2>
              </div>
              <p className="text-lg text-muted-foreground mb-8 max-w-3xl mx-auto">
                Every great space starts with a deep understanding. We begin by listening to your vision, goals, and constraints — then apply strategic thinking, creativity, and technology to bring that vision to life.
              </p>
            </div>
            <div className="max-w-4xl mx-auto">
              <h3 className="text-2xl font-semibold text-foreground mb-6 text-center">Core Principles:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {principles.map((principle, index) => (
                  <div key={index} className="flex items-center p-4 bg-muted/20 rounded-lg">
                    <principle.icon className="h-8 w-8 text-brand-red mr-4" />
                    <span className="font-medium text-foreground">{principle.title}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Why Choose Us</h2>
            </div>
            <div className="max-w-3xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {whyChooseUs.map((reason, index) => (
                  <div key={index} className="flex items-center p-4 bg-background rounded-lg shadow-sm">
                    <CheckCircle className="h-6 w-6 text-green-600 mr-4 flex-shrink-0" />
                    <span className="text-foreground font-medium">{reason}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Project Showcase */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Project Showcase</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projectShowcase.map((project, index) => (
                <div key={index} className="bg-background rounded-lg shadow-sm border overflow-hidden hover:shadow-md transition-shadow">
                  <img 
                    src={project.image} 
                    alt={project.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-foreground mb-2">{project.title}</h3>
                    <p className="text-muted-foreground">{project.subtitle}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section with Form */}
        <section className="py-16 bg-gradient-to-br from-brand-red/5 to-primary/5">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                  Ready to Build Something Iconic?
                </h2>
                <p className="text-lg text-muted-foreground">
                  Let's turn your vision into a reality. Whether you're starting from scratch or want to reimagine an existing space — we're here to help.
                </p>
              </div>
              
              <div className="bg-background p-8 rounded-lg shadow-lg border">
                <h3 className="text-2xl font-semibold text-foreground mb-6 text-center">Book a Free Consultation</h3>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name *</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter your full name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email Address *</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="Enter your email" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone Number *</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter your phone number" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="location"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Project Location *</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter project location" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="projectType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Project Type *</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select project type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="residential">Residential</SelectItem>
                                <SelectItem value="commercial">Commercial</SelectItem>
                                <SelectItem value="institutional">Institutional</SelectItem>
                                <SelectItem value="industrial">Industrial</SelectItem>
                                <SelectItem value="renovation">Renovation</SelectItem>
                                <SelectItem value="interior">Interior Design</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="budget"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Budget Range *</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select budget range" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="under-10l">Under ₹10 Lakhs</SelectItem>
                                <SelectItem value="10l-25l">₹10 - ₹25 Lakhs</SelectItem>
                                <SelectItem value="25l-50l">₹25 - ₹50 Lakhs</SelectItem>
                                <SelectItem value="50l-1cr">₹50 Lakhs - ₹1 Crore</SelectItem>
                                <SelectItem value="1cr-plus">₹1 Crore+</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Project Details (Optional)</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Tell us more about your project requirements..."
                              className="min-h-[120px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="text-center">
                      <Button 
                        type="submit" 
                        size="lg" 
                        disabled={isSubmitting}
                        className="bg-brand-red hover:bg-brand-red-dark text-white px-8 py-3"
                      >
                        {isSubmitting ? "Booking..." : "Book Free Consultation"}
                        {!isSubmitting && <ArrowRight className="ml-2 h-5 w-5" />}
                      </Button>
                    </div>
                  </form>
                </Form>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </div>
      <ChatBot />
    </div>
  );
};

export default Architecture;
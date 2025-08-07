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
import { 
  Sofa, 
  Palette, 
  Lightbulb, 
  Eye, 
  PaintBucket, 
  Hammer, 
  CheckCircle, 
  ArrowRight, 
  Users, 
  Clock, 
  Star, 
  Target,
  Sparkles,
  Layers,
  Wrench
} from 'lucide-react';

const consultationSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().min(10, 'Valid phone number is required'),
  spaceType: z.string().min(1, 'Please select space type'),
  location: z.string().min(1, 'Location is required'),
  budget: z.string().min(1, 'Please select budget range'),
  message: z.string().optional(),
});

type ConsultationFormValues = z.infer<typeof consultationSchema>;

const Interior = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<ConsultationFormValues>({
    resolver: zodResolver(consultationSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      spaceType: '',
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
        title: "Design Call Scheduled!",
        description: "We'll contact you within 24 hours to discuss your interior design needs.",
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

  const specialties = [
    {
      icon: Target,
      title: "Interior Concept Planning & Styling",
      description: "Unique layouts tailored to your lifestyle or brand."
    },
    {
      icon: Palette,
      title: "Material, Texture & Color Selection",
      description: "Smart palettes that suit mood, light, and space."
    },
    {
      icon: Sofa,
      title: "Modular & Custom Furniture Design",
      description: "Form meets function with every piece."
    },
    {
      icon: Lightbulb,
      title: "Lighting & Decor Consultation",
      description: "Creating ambiance through layered lighting and accents."
    },
    {
      icon: Eye,
      title: "3D Interior Visualization",
      description: "See your space before we bring it to life."
    },
    {
      icon: Wrench,
      title: "Full Turnkey Execution",
      description: "From design boards to final installation."
    }
  ];

  const designProcess = [
    { step: "01", title: "Discovery Call & Briefing", icon: Users },
    { step: "02", title: "Concept Development & Moodboards", icon: Sparkles },
    { step: "03", title: "Design Presentation + Revisions", icon: Layers },
    { step: "04", title: "Finalization & Material Selection", icon: PaintBucket },
    { step: "05", title: "Execution & On-Site Supervision", icon: Hammer },
    { step: "06", title: "Styling & Handover", icon: Star }
  ];

  const whyWorkWithUs = [
    "Personalized Designs – Never Template-Based",
    "Honest Timelines & Budgeting",
    "Trusted Vendor & Artisan Network",
    "End-to-End Project Management",
    "100% Design Satisfaction Guaranteed"
  ];

  const portfolioProjects = [
    {
      title: "Elegant 3BHK in Bandra",
      subtitle: "Modern Minimalism | Completed 2024",
      image: "/lovable-uploads/c996469f-4da3-4235-b9fc-d1152fe010e8.png"
    },
    {
      title: "Luxury Villa Interior",
      subtitle: "Contemporary Classic | Mumbai, 2023",
      image: "/lovable-uploads/4ae8bc66-e5e0-4c61-88f6-cd00789ebc89.png"
    },
    {
      title: "Corporate Office Design",
      subtitle: "Professional & Vibrant | Delhi, 2023",
      image: "/lovable-uploads/773d41c7-0eec-400e-a369-eaae7c40f9ca.png"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Marquee />
      <Header />
      
      <div className="pt-8">
        {/* Hero Section */}
        <section 
          className="relative py-20 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('/lovable-uploads/0b9bec0c-64d2-4ff5-8bdb-018ff8463e6c.png')`
          }}
        >
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Curated Interiors for Inspired Living
            </h1>
            <p className="text-lg md:text-xl text-white/90 mb-8 max-w-3xl mx-auto">
              From concept to execution, we create spaces that reflect who you are — elegant, functional, and full of character.
            </p>
            <Button size="lg" className="bg-brand-red hover:bg-brand-red-dark text-white px-8 py-3">
              Start Your Interior Journey
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </section>

        {/* About Section */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <div className="flex items-center justify-center mb-6">
                <Sofa className="h-8 w-8 text-brand-red mr-3" />
                <h2 className="text-3xl md:text-4xl font-bold text-foreground">About Our Interior Design Services</h2>
              </div>
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                At Home HNI, we believe your interiors should tell your story — not follow a script. Whether it's a cozy home, a luxurious villa, or a high-performing office, we deliver end-to-end interior solutions that blend aesthetics, utility, and comfort.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                With an expert team of interior designers, stylists, and project managers, we handle every detail — from furniture to final touches.
              </p>
            </div>
          </div>
        </section>

        {/* Specialties Section */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Our Specialties</h2>
              <p className="text-lg text-muted-foreground">
                We specialize in both residential and commercial interiors:
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {specialties.map((specialty, index) => (
                <div key={index} className="bg-background p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
                  <specialty.icon className="h-12 w-12 text-brand-red mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-3">{specialty.title}</h3>
                  <p className="text-muted-foreground">{specialty.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Design Process */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">The Design Process</h2>
            </div>
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {designProcess.map((process, index) => (
                  <div key={index} className="relative bg-muted/20 p-6 rounded-lg">
                    <div className="flex items-center mb-4">
                      <div className="bg-brand-red text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">
                        {process.step}
                      </div>
                      <process.icon className="h-6 w-6 text-brand-red" />
                    </div>
                    <h3 className="font-semibold text-foreground">{process.title}</h3>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Why Work With Us */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Why Work With Us</h2>
            </div>
            <div className="max-w-3xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {whyWorkWithUs.map((reason, index) => (
                  <div key={index} className="flex items-center p-4 bg-background rounded-lg shadow-sm">
                    <CheckCircle className="h-6 w-6 text-green-600 mr-4 flex-shrink-0" />
                    <span className="text-foreground font-medium">{reason}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Portfolio Section */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Portfolio</h2>
              <p className="text-lg text-muted-foreground">
                Recent projects that showcase our design expertise
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {portfolioProjects.map((project, index) => (
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
                  Let's Design the Space You've Been Dreaming Of
                </h2>
                <p className="text-lg text-muted-foreground">
                  Get in touch with our expert interior design team and turn your vision into reality.
                </p>
              </div>
              
              <div className="bg-background p-8 rounded-lg shadow-lg border">
                <h3 className="text-2xl font-semibold text-foreground mb-6 text-center">Schedule a Free Design Call</h3>
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
                        name="spaceType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Space Type *</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select space type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="home">Home Interior</SelectItem>
                                <SelectItem value="villa">Villa Interior</SelectItem>
                                <SelectItem value="apartment">Apartment Interior</SelectItem>
                                <SelectItem value="office">Office Interior</SelectItem>
                                <SelectItem value="retail">Retail Space</SelectItem>
                                <SelectItem value="restaurant">Restaurant Interior</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
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
                                <SelectItem value="under-5l">Under ₹5 Lakhs</SelectItem>
                                <SelectItem value="5l-15l">₹5 - ₹15 Lakhs</SelectItem>
                                <SelectItem value="15l-30l">₹15 - ₹30 Lakhs</SelectItem>
                                <SelectItem value="30l-50l">₹30 - ₹50 Lakhs</SelectItem>
                                <SelectItem value="50l-plus">₹50 Lakhs+</SelectItem>
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
                          <FormLabel>Design Requirements (Optional)</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Tell us about your style preferences, specific requirements, or any ideas you have in mind..."
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
                        {isSubmitting ? "Scheduling..." : "Schedule Free Design Call"}
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

export default Interior;
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { 
  Building2, Users, CreditCard, Wrench, Camera, FileText, Sparkles, MapPin, Crown, TrendingUp, Clock, CheckCircle, Shield, Star 
} from "lucide-react";
import Marquee from "@/components/Marquee";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const PropertyManagement = () => {
  const services = [
    {
      icon: Users,
      title: "Tenant Management",
      description: "End-to-end tenant handling: onboarding, agreements, exit."
    },
    {
      icon: CreditCard,
      title: "Rent Collection",
      description: "Timely rent, reminders, payment tracking."
    },
    {
      icon: Wrench,
      title: "Maintenance & Repairs",
      description: "Plumbing, electrical, cleaning, and more."
    },
    {
      icon: Camera,
      title: "Periodic Property Inspections",
      description: "Photo/video reports delivered remotely."
    },
    {
      icon: FileText,
      title: "Legal Support",
      description: "Lease paperwork, renewals, tax, society handling."
    },
    {
      icon: Sparkles,
      title: "Cleaning & Sanitization",
      description: "For pre/post-tenancy handover. (Optional)"
    }
  ];

  const targetAudience = [
    {
      icon: MapPin,
      title: "NRIs",
      description: "Looking for remote property management"
    },
    {
      icon: Crown,
      title: "HNIs",
      description: "With multiple or high-value homes"
    },
    {
      icon: TrendingUp,
      title: "Real Estate Investors",
      description: "Focused on ROI"
    },
    {
      icon: Clock,
      title: "Busy Landlords",
      description: "Who want peace of mind"
    }
  ];

  const benefits = [
    {
      icon: CheckCircle,
      title: "Dedicated Property Managers",
      description: "Personal point of contact for all property needs"
    },
    {
      icon: FileText,
      title: "Transparent Monthly Reports",
      description: "Detailed updates on property status and finances"
    },
    {
      icon: Shield,
      title: "RERA-Compliant Legal Handling",
      description: "All documentation and processes follow regulations"
    },
    {
      icon: Users,
      title: "Trusted Vendor Network",
      description: "Verified professionals for all maintenance needs"
    },
    {
      icon: Star,
      title: "Tenant Replacement Guarantee",
      description: "Quick tenant replacement if issues arise"
    }
  ];

  const { toast } = useToast();

  useEffect(() => {
    const title = "Property Management Services | Home HNI";
    document.title = title;
    const desc = "End-to-end property management for NRIs & HNIs: tenant search, rent collection, maintenance, and inspections.";
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
    canonical.setAttribute('href', window.location.origin + '/property-management');
  }, []);

  return (
    <div className="min-h-screen">
      <Marquee />
      <Header />
      
{/* Hero Section */}
<section
  className="relative pt-28 md:pt-32 pb-10 md:pb-20 px-4 md:px-8 text-white overflow-hidden bg-cover bg-center bg-no-repeat"
  style={{ backgroundImage: "url('/lovable-uploads/fbb0d72f-782e-49f5-bbe1-8afc1314b5f7.png')" }}
>
  <div className="absolute inset-0 bg-black/30 pointer-events-none" />

  <div className="relative z-10 container mx-auto">
    <div className="grid lg:grid-cols-2 gap-8 items-start">
      {/* Left: Copy */}
      <div className="max-w-2xl">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
          Comprehensive Property Management Services
        </h1>
        <p className="text-lg md:text-xl text-white/90">
          From securing verified tenants to regular property maintenance, we handle
          everything for you.
        </p>
      </div>

      {/* Right: Form (scrolls with page, not sticky) */}
      <div className="lg:justify-self-end">
        <Card className="w-full max-w-md rounded-xl shadow-2xl bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/70">
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold text-foreground">Got a property to be managed?</h3>
            <p className="text-sm text-muted-foreground mb-4">Just fill the form and we will contact you.</p>

            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                // Minimal handling for now – you can wire this to Supabase later
                toast({ title: "Request received", description: "Our team will reach out shortly." });
                (e.currentTarget as HTMLFormElement).reset();
              }}
            >
              <div className="space-y-2">
                <Label htmlFor="pm-name">Name</Label>
                <Input id="pm-name" name="name" placeholder="Your name" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="pm-phone">Phone</Label>
                <div className="flex gap-2">
                  <Select defaultValue="+91" name="countryCode">
                    <SelectTrigger className="w-24"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="+91">+91</SelectItem>
                      <SelectItem value="+1">+1</SelectItem>
                      <SelectItem value="+44">+44</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input id="pm-phone" name="phone" type="tel" placeholder="Phone number" className="flex-1" required />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="pm-email">Email</Label>
                <Input id="pm-email" name="email" type="email" placeholder="you@example.com" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="pm-city">City</Label>
                <Input id="pm-city" name="city" placeholder="City" />
              </div>

              <Button type="submit" className="w-full">Talk to us today</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
</section>




      {/* What's Included Section */}
      <section className="py-16 px-4 bg-background">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              What's Included
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Comprehensive property management services designed for premium clients
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <Card key={index} className="h-full hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-brand-red/10 rounded-lg flex items-center justify-center">
                        <service.icon className="w-6 h-6 text-brand-red" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-2">
                        {service.title}
                      </h3>
                      <p className="text-muted-foreground">
                        {service.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Who Needs This Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Who Needs This?
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Perfect for busy property owners who value professional management
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {targetAudience.map((audience, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-brand-red/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <audience.icon className="w-8 h-8 text-brand-red" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {audience.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {audience.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Home HNI Section */}
      <section className="py-16 px-4 bg-background">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Why Choose Home HNI?
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Experience the difference with our premium property management approach
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {benefits.map((benefit, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                        <benefit.icon className="w-6 h-6 text-red-600" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-2">
                        {benefit.title}
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-brand-red to-brand-red-dark text-white">
        <div className="container mx-auto text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Let Us Handle the Hassle
            </h2>
            <p className="text-xl mb-8 text-red-100">
              Focus on what matters. Let Home HNI take care of your property with professionalism and care.
            </p>
            <Button 
              size="lg" 
              className="bg-white text-brand-red hover:bg-gray-100 font-semibold px-8 py-3 text-lg rounded-lg"
            >
              Schedule a Free Consultation
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default PropertyManagement;
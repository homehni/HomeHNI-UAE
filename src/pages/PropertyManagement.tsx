import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Building2, 
  Users, 
  CreditCard, 
  Wrench, 
  Camera, 
  FileText, 
  Sparkles, 
  MapPin, 
  Crown, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  Shield, 
  Star 
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

  return (
    <div className="min-h-screen">
      <Marquee />
      <Header />
      
{/* Hero Section */}
<section className="relative pt-32 pb-20 px-4 md:px-8 bg-red-700 text-white overflow-hidden">
  <div className="absolute inset-0 bg-black/10 pointer-events-none"></div> {/* light overlay */}
  
  <div className="relative z-10 container mx-auto text-center">
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
        🏢 Premium Property Management for HNIs & NRIs
      </h1>
      <p className="text-xl md:text-2xl mb-8 text-red-100 leading-relaxed">
        Get complete peace of mind with our expert-managed, tenant-ready, and fully maintained property solutions — ideal for NRIs, landlords, and investors.
      </p>
      <Button 
        size="lg" 
        className="bg-white text-red-700 hover:bg-gray-100 font-semibold px-8 py-3 text-lg rounded-xl shadow-lg transition duration-300"
      >
        Talk to a Property Manager Today
      </Button>
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
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Home, FileText, Shield, Sparkles, Users, Clock, Star, Eye, Camera, Wrench, MapPin } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Marquee from "@/components/Marquee";

const HandoverServices = () => {
  const services = [
    {
      icon: Eye,
      title: "Detailed Property Inspection",
      description: "Full technical audit: plumbing, electricals, civil work"
    },
    {
      icon: Camera,
      title: "Snag List Generation",
      description: "with images and recommended actions"
    },
    {
      icon: Shield,
      title: "RERA Compliance & Quality Checks",
      description: "Ensure all regulatory standards are met"
    },
    {
      icon: FileText,
      title: "Legal Document Collection",
      description: "OC, Possession Letter, etc."
    },
    {
      icon: Sparkles,
      title: "Deep Cleaning & Sanitization",
      description: "Add-on service for move-in ready homes"
    },
    {
      icon: Wrench,
      title: "Interior Advisory",
      description: "Optional consultation for home setup"
    }
  ];

  const targetAudience = [
    {
      icon: Home,
      title: "Homebuyers",
      description: "First-time and experienced buyers seeking peace of mind"
    },
    {
      icon: MapPin,
      title: "NRIs & Remote Owners",
      description: "Overseas Indians needing local representation"
    },
    {
      icon: Users,
      title: "Real Estate Investors",
      description: "Portfolio owners managing multiple properties"
    },
    {
      icon: Clock,
      title: "Working Professionals",
      description: "Busy individuals who need expert assistance"
    }
  ];

  const whyChooseUs = [
    {
      icon: CheckCircle,
      title: "360° Inspection by Experts",
      description: "Comprehensive technical evaluation by certified professionals"
    },
    {
      icon: Camera,
      title: "Transparent, Photo-backed Reports",
      description: "Detailed visual documentation of all findings"
    },
    {
      icon: Users,
      title: "Builder Coordination for Issue Resolution",
      description: "We handle all communications with builders on your behalf"
    },
    {
      icon: Star,
      title: "Personalized, Ethical Service",
      description: "Tailored solutions with complete transparency"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Marquee />
      <Header />
      
{/* Hero Section */}
<section className="pt-32 pb-16 px-4 bg-red-700 text-white">
  <div className="max-w-6xl mx-auto text-center">
    <h1 className="text-4xl md:text-6xl font-bold mb-6">
      🏠 Premium Handover Services for Homeowners & NRIs
    </h1>
    <p className="text-xl md:text-2xl mb-8 text-red-100 max-w-4xl mx-auto">
      Make your property possession process stress-free with expert inspections, compliance checks, and document support — all managed by Home HNI.
    </p>
    <Button 
      size="lg" 
      className="bg-white text-red-700 hover:bg-gray-100 px-8 py-3 text-lg font-semibold"
    >
      Schedule Handover Service
    </Button>
  </div>
</section>


      {/* Our Handover Services Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Our Handover Services Include
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Comprehensive property handover solutions designed to ensure you receive your home in perfect condition
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <service.icon className="h-12 w-12 text-brand-red mb-4" />
                  <h3 className="text-xl font-semibold mb-3">{service.title}</h3>
                  <p className="text-muted-foreground">{service.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Who Needs This Section */}
      <section className="py-16 px-4 bg-muted/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Who Needs This?
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our handover services are designed for various property stakeholders
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {targetAudience.map((audience, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <audience.icon className="h-16 w-16 text-brand-red mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">{audience.title}</h3>
                  <p className="text-sm text-muted-foreground">{audience.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Home HNI Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Why Choose Home HNI?
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Experience the difference with our professional, transparent, and reliable handover services
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {whyChooseUs.map((benefit, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6 flex items-start space-x-4">
                  <benefit.icon className="h-12 w-12 text-brand-red flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                    <p className="text-muted-foreground">{benefit.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-brand-red to-red-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Book Your Property Handover Now
          </h2>
          <p className="text-xl mb-8 text-red-100">
            Whether you're in India or abroad, our experts ensure you receive your home in perfect condition.
          </p>
          <Button 
            size="lg" 
            className="bg-white text-brand-red hover:bg-gray-100 px-8 py-3 text-lg font-semibold"
          >
            Schedule Handover Service
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HandoverServices;
import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Marquee from '@/components/Marquee';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building, MapPin, Shield, Users, CheckCircle, Star, ArrowRight, Globe, FileText, CreditCard } from 'lucide-react';

const NRIServices = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);

  const scrollToContact = () => {
    setIsFormOpen(true);
  };

  return (
    <div className="min-h-screen bg-white">
      <Marquee />
      <Header />
      
      {/* Hero Section */}
      <section className="relative pt-32 md:pt-36 pb-24 md:pb-28 px-4 md:px-8 text-white overflow-hidden bg-cover bg-center bg-no-repeat" style={{
        backgroundImage: "url('/lovable-uploads/fbb0d72f-782e-49f5-bbe1-8afc1314b5f7.png')"
      }}>
        <div className="absolute inset-0 bg-red-900/80 pointer-events-none" />

        <div className="relative z-10 container mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 items-start">
            {/* Left: Copy */}
            <div className="max-w-2xl">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
                NRI Real Estate
                <br className="hidden md:block" />
                <span className="block">Services</span>
              </h1>
              <p className="text-lg md:text-xl text-white/90 mb-6">
                Comprehensive property solutions for Non-Resident Indians with 
                FEMA compliance, remote assistance, and expert guidance.
              </p>
              <Button 
                onClick={scrollToContact}
                size="lg" 
                className="bg-white text-brand-red hover:bg-gray-100 px-8 py-3 text-lg"
              >
                Get Started Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>

            {/* Right: Placeholder for form on desktop */}
            <div className="hidden lg:block lg:justify-self-end">
              <div className="w-full max-w-md h-64"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Service Highlights */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our NRI Services</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Comprehensive property solutions designed specifically for Non-Resident Indians
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="text-center p-6 hover:shadow-lg transition-shadow border-2 border-primary hover:border-brand-red/20">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-brand-red/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Building className="h-8 w-8 text-brand-red" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Property Investment</h3>
                <p className="text-gray-600">Expert guidance on property investments in India with market insights and legal compliance.</p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 hover:shadow-lg transition-shadow border-2 border-primary hover:border-brand-red/20">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-brand-red/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-brand-red" />
                </div>
                <h3 className="text-xl font-semibold mb-3">FEMA Compliance</h3>
                <p className="text-gray-600">Complete legal documentation support including FEMA compliance and property registration.</p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 hover:shadow-lg transition-shadow border-2 border-primary hover:border-brand-red/20">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-brand-red/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-brand-red" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Property Management</h3>
                <p className="text-gray-600">End-to-end property management services including maintenance and rental management.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Why Choose HomeHNI NRI Services */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose HomeHNI NRI Services?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We understand the unique challenges NRIs face when investing in Indian real estate
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="flex items-start space-x-4">
              <CheckCircle className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold mb-2">FEMA Compliance</h3>
                <p className="text-gray-600">We ensure all your property transactions comply with Foreign Exchange Management Act regulations.</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <CheckCircle className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold mb-2">Remote Assistance</h3>
                <p className="text-gray-600">Complete property buying process can be handled remotely with our trusted representatives.</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <CheckCircle className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold mb-2">Tax Advisory</h3>
                <p className="text-gray-600">Expert tax advisory services to optimize your property investments and returns.</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <CheckCircle className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold mb-2">Transparent Process</h3>
                <p className="text-gray-600">Complete transparency in pricing, documentation, and property transactions.</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <CheckCircle className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold mb-2">Global Support</h3>
                <p className="text-gray-600">24/7 support across different time zones to assist you wherever you are.</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <CheckCircle className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold mb-2">Property Management</h3>
                <p className="text-gray-600">End-to-end property management services including maintenance and rental management.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Coming Soon Services */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Coming Soon</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We're constantly expanding our services to better serve the NRI community
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            <Card className="text-center p-6 border-2 border-dashed border-gray-300">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Globe className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold mb-3">International Banking</h3>
                <p className="text-gray-600">Seamless banking solutions for NRI property transactions</p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 border-2 border-dashed border-gray-300">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Documentation Services</h3>
                <p className="text-gray-600">Complete documentation support for all property-related paperwork</p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 border-2 border-dashed border-gray-300">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CreditCard className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Investment Advisory</h3>
                <p className="text-gray-600">Expert investment advisory services for NRI property portfolios</p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 border-2 border-dashed border-gray-300">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Location Intelligence</h3>
                <p className="text-gray-600">Advanced location analysis and market intelligence for NRI investments</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Customer Testimonials */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">What Our NRI Customers Say</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Trusted by NRIs across the globe for their property investment needs
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="p-6">
              <CardContent>
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-brand-red/10 rounded-full flex items-center justify-center mr-4">
                    <span className="text-brand-red font-bold">R</span>
                  </div>
                  <div>
                    <h4 className="font-semibold">Rajesh Patel</h4>
                    <p className="text-sm text-gray-600">NRI from USA</p>
                  </div>
                </div>
                <div className="flex mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600">"HomeHNI made my property investment in India seamless. Their FEMA compliance expertise saved me months of paperwork."</p>
              </CardContent>
            </Card>

            <Card className="p-6">
              <CardContent>
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-brand-red/10 rounded-full flex items-center justify-center mr-4">
                    <span className="text-brand-red font-bold">P</span>
                  </div>
                  <div>
                    <h4 className="font-semibold">Priya Sharma</h4>
                    <p className="text-sm text-gray-600">NRI from Canada</p>
                  </div>
                </div>
                <div className="flex mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600">"Excellent remote assistance! I bought my dream home in Bangalore without ever visiting India. Highly recommended!"</p>
              </CardContent>
            </Card>

            <Card className="p-6">
              <CardContent>
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-brand-red/10 rounded-full flex items-center justify-center mr-4">
                    <span className="text-brand-red font-bold">A</span>
                  </div>
                  <div>
                    <h4 className="font-semibold">Amit Kumar</h4>
                    <p className="text-sm text-gray-600">NRI from UK</p>
                  </div>
                </div>
                <div className="flex mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600">"Professional service with complete transparency. Their property management services are outstanding."</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-16 bg-brand-red text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Invest in Indian Real Estate?</h2>
          <p className="text-xl mb-8 opacity-90">
            Get expert NRI property investment assistance - anywhere in the world
          </p>
          <Button size="lg" className="bg-white text-brand-red hover:bg-gray-100 px-8 py-3 text-lg" onClick={scrollToContact}>
            Get Started Now
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default NRIServices;
import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Marquee from '@/components/Marquee';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2, Calendar, MapPin, Star, CheckCircle, ArrowRight, Home, TrendingUp, Shield, Users } from 'lucide-react';

const NewProjects = () => {
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
                New Builder
                <br className="hidden md:block" />
                <span className="block">Projects</span>
              </h1>
              <p className="text-lg md:text-xl text-white/90 mb-6">
                Discover the latest residential and commercial projects from top builders 
                with modern amenities and prime locations across India.
              </p>
              <Button 
                onClick={scrollToContact}
                size="lg" 
                className="bg-white text-brand-red hover:bg-gray-100 px-8 py-3 text-lg"
              >
                Explore Projects
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
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our New Projects</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover the latest residential and commercial projects from top builders across India
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="text-center p-6 hover:shadow-lg transition-shadow border-2 border-primary hover:border-brand-red/20">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-brand-red/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Building2 className="h-8 w-8 text-brand-red" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Modern Amenities</h3>
                <p className="text-gray-600">Latest amenities and features designed for modern living with contemporary architecture.</p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 hover:shadow-lg transition-shadow border-2 border-primary hover:border-brand-red/20">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-brand-red/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="h-8 w-8 text-brand-red" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Pre-Launch Offers</h3>
                <p className="text-gray-600">Special pricing and payment plans available for early investors and home buyers.</p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 hover:shadow-lg transition-shadow border-2 border-primary hover:border-brand-red/20">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-brand-red/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="h-8 w-8 text-brand-red" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Prime Locations</h3>
                <p className="text-gray-600">Projects located in developing areas with excellent connectivity and infrastructure.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Why Choose HomeHNI New Projects */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose HomeHNI New Projects?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We partner with the best builders to bring you the finest new projects
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="flex items-start space-x-4">
              <CheckCircle className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold mb-2">Trusted Builders</h3>
                <p className="text-gray-600">Projects from renowned builders with proven track records and quality construction.</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <CheckCircle className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold mb-2">Best Prices</h3>
                <p className="text-gray-600">Competitive pricing with special pre-launch offers and flexible payment plans.</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <CheckCircle className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold mb-2">Legal Compliance</h3>
                <p className="text-gray-600">All projects are legally compliant with proper approvals and documentation.</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <CheckCircle className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold mb-2">Investment Potential</h3>
                <p className="text-gray-600">High growth potential with excellent returns on investment in prime locations.</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <CheckCircle className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold mb-2">Complete Support</h3>
                <p className="text-gray-600">End-to-end support from booking to possession with dedicated relationship managers.</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <CheckCircle className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold mb-2">Transparent Process</h3>
                <p className="text-gray-600">Complete transparency in pricing, documentation, and project timelines.</p>
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
              Exciting new projects and features coming your way
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            <Card className="text-center p-6 border-2 border-dashed border-gray-300">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Home className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Smart Homes</h3>
                <p className="text-gray-600">IoT-enabled smart homes with automated systems and energy efficiency</p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 border-2 border-dashed border-gray-300">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Investment Analytics</h3>
                <p className="text-gray-600">Advanced analytics and market insights for informed investment decisions</p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 border-2 border-dashed border-gray-300">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Builder Verification</h3>
                <p className="text-gray-600">Comprehensive builder verification and project quality assurance</p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 border-2 border-dashed border-gray-300">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Community Features</h3>
                <p className="text-gray-600">Exclusive community features and resident networking opportunities</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Customer Testimonials */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">What Our Customers Say</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Trusted by thousands of home buyers and investors across India
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="p-6">
              <CardContent>
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-brand-red/10 rounded-full flex items-center justify-center mr-4">
                    <span className="text-brand-red font-bold">S</span>
                  </div>
                  <div>
                    <h4 className="font-semibold">Sunita Reddy</h4>
                    <p className="text-sm text-gray-600">Home Buyer, Hyderabad</p>
                  </div>
                </div>
                <div className="flex mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600">"Found my dream home through HomeHNI's new projects. The pre-launch offer saved me lakhs!"</p>
              </CardContent>
            </Card>

            <Card className="p-6">
              <CardContent>
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-brand-red/10 rounded-full flex items-center justify-center mr-4">
                    <span className="text-brand-red font-bold">R</span>
                  </div>
                  <div>
                    <h4 className="font-semibold">Rajesh Kumar</h4>
                    <p className="text-sm text-gray-600">Investor, Mumbai</p>
                  </div>
                </div>
                <div className="flex mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600">"Excellent investment opportunity with great returns. The location and amenities are outstanding."</p>
              </CardContent>
            </Card>

            <Card className="p-6">
              <CardContent>
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-brand-red/10 rounded-full flex items-center justify-center mr-4">
                    <span className="text-brand-red font-bold">A</span>
                  </div>
                  <div>
                    <h4 className="font-semibold">Anita Patel</h4>
                    <p className="text-sm text-gray-600">First-time Buyer, Pune</p>
                  </div>
                </div>
                <div className="flex mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600">"Professional service and transparent process. Got my first home with complete peace of mind."</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-16 bg-brand-red text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Find Your Dream Home?</h2>
          <p className="text-xl mb-8 opacity-90">
            Explore the latest new projects from top builders across India
          </p>
          <Button size="lg" className="bg-white text-brand-red hover:bg-gray-100 px-8 py-3 text-lg" onClick={scrollToContact}>
            Explore Projects Now
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default NewProjects;

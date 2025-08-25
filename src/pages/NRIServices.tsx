import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Marquee from '@/components/Marquee';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building, MapPin, Shield, Users } from 'lucide-react';

const NRIServices = () => {
  return (
    <div className="min-h-screen bg-white">
      <Marquee />
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">NRI Real Estate Services</h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              Comprehensive property solutions for Non-Resident Indians
            </p>
            <Button className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 text-lg">
              Get Started
            </Button>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Our NRI Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card>
              <CardHeader>
                <Building className="w-12 h-12 text-blue-600 mb-4" />
                <CardTitle>Property Investment</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Expert guidance on property investments in India with market insights and legal compliance.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <MapPin className="w-12 h-12 text-green-600 mb-4" />
                <CardTitle>Location Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Detailed location analysis and property valuation services for informed decision making.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Shield className="w-12 h-12 text-purple-600 mb-4" />
                <CardTitle>Legal Support</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Complete legal documentation support including FEMA compliance and property registration.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Users className="w-12 h-12 text-orange-600 mb-4" />
                <CardTitle>Property Management</CardTitle>
              </CardHeader>
              <CardContent>
                <p>End-to-end property management services including maintenance and rental management.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Our NRI Services?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">FEMA Compliance</h3>
              <p className="text-gray-600 mb-6">We ensure all your property transactions comply with Foreign Exchange Management Act regulations.</p>
              
              <h3 className="text-xl font-semibold mb-4">Remote Assistance</h3>
              <p className="text-gray-600 mb-6">Complete property buying process can be handled remotely with our trusted representatives.</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Tax Advisory</h3>
              <p className="text-gray-600 mb-6">Expert tax advisory services to optimize your property investments and returns.</p>
              
              <h3 className="text-xl font-semibold mb-4">Transparent Process</h3>
              <p className="text-gray-600">Complete transparency in pricing, documentation, and property transactions.</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default NRIServices;
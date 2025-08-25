import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Marquee from '@/components/Marquee';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2, Calendar, MapPin, Star } from 'lucide-react';

const NewProjects = () => {
  return (
    <div className="min-h-screen bg-white">
      <Marquee />
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 to-blue-700 text-white py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">New Builder Projects</h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              Discover the latest residential and commercial projects from top builders
            </p>
            <Button className="bg-white text-green-600 hover:bg-gray-100 px-8 py-3 text-lg">
              Explore Projects
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose New Projects?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card>
              <CardHeader>
                <Building2 className="w-12 h-12 text-green-600 mb-4" />
                <CardTitle>Modern Amenities</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Latest amenities and features designed for modern living with contemporary architecture.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Calendar className="w-12 h-12 text-blue-600 mb-4" />
                <CardTitle>Pre-Launch Offers</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Special pricing and payment plans available for early investors and home buyers.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <MapPin className="w-12 h-12 text-purple-600 mb-4" />
                <CardTitle>Prime Locations</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Projects located in developing areas with excellent connectivity and infrastructure.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Star className="w-12 h-12 text-orange-600 mb-4" />
                <CardTitle>Trusted Builders</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Projects from renowned builders with proven track records and quality construction.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Project Types */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Project Categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Residential Projects</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Luxury Apartments</li>
                  <li>• Gated Communities</li>
                  <li>• Independent Villas</li>
                  <li>• Affordable Housing</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Commercial Projects</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Office Spaces</li>
                  <li>• Retail Complexes</li>
                  <li>• IT Parks</li>
                  <li>• Mixed-Use Developments</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Plotted Developments</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Residential Plots</li>
                  <li>• Villa Plots</li>
                  <li>• Farmhouse Plots</li>
                  <li>• Investment Plots</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default NewProjects;
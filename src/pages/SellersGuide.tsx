import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Marquee from '@/components/Marquee';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, Camera, FileText, Handshake } from 'lucide-react';

const SellersGuide = () => {
  return (
    <div className="min-h-screen bg-white">
      <Marquee />
      <Header />
      
      {/* Hero Section */}
      <section 
        className="relative bg-cover bg-center bg-no-repeat text-white py-20 md:py-32" 
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('https://images.unsplash.com/photo-1613490493576-7fde63acd811?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')`
        }}
      >
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Property Sellers Guide</h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              Maximize your property value with our comprehensive selling guide
            </p>
          </div>
        </div>
      </section>

      {/* Key Steps */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Essential Steps to Sell Your Property</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card>
              <CardHeader>
                <TrendingUp className="w-12 h-12 text-orange-600 mb-4" />
                <CardTitle>Market Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Research current market trends and set the right price for your property.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Camera className="w-12 h-12 text-blue-600 mb-4" />
                <CardTitle>Property Presentation</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Stage your property and create attractive listings with professional photography.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <FileText className="w-12 h-12 text-green-600 mb-4" />
                <CardTitle>Documentation</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Prepare all necessary documents and ensure legal compliance for smooth transactions.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Handshake className="w-12 h-12 text-purple-600 mb-4" />
                <CardTitle>Negotiation</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Master negotiation strategies to get the best deal for your property.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Seller Tips */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Pro Selling Tips</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Pricing Strategy</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Research comparable properties</li>
                  <li>• Consider market conditions</li>
                  <li>• Factor in unique features</li>
                  <li>• Price competitively</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Property Enhancement</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Minor repairs and touch-ups</li>
                  <li>• Deep cleaning</li>
                  <li>• Declutter and depersonalize</li>
                  <li>• Improve curb appeal</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Marketing Strategies</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Professional photography</li>
                  <li>• Multiple listing platforms</li>
                  <li>• Social media promotion</li>
                  <li>• Virtual tours</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Legal Preparation</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Title deed verification</li>
                  <li>• NOC from society</li>
                  <li>• Tax clearances</li>
                  <li>• Energy certificate</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Typical Selling Timeline</h2>
          <div className="max-w-4xl mx-auto">
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="bg-orange-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold">1</div>
                <div className="flex-1">
                  <h4 className="font-semibold">Week 1-2: Preparation</h4>
                  <p className="text-gray-600">Property valuation, documentation, and enhancement</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold">2</div>
                <div className="flex-1">
                  <h4 className="font-semibold">Week 3-4: Marketing Launch</h4>
                  <p className="text-gray-600">Professional photography, listings, and marketing campaign</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="bg-green-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold">3</div>
                <div className="flex-1">
                  <h4 className="font-semibold">Week 5-8: Showings & Negotiations</h4>
                  <p className="text-gray-600">Property viewings, buyer interactions, and price negotiations</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="bg-purple-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold">4</div>
                <div className="flex-1">
                  <h4 className="font-semibold">Week 9-12: Closing</h4>
                  <p className="text-gray-600">Agreement signing, legal procedures, and property transfer</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default SellersGuide;

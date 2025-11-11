import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Marquee from '@/components/Marquee';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, CheckCircle, AlertTriangle, Calculator } from 'lucide-react';

const BuyersGuide = () => {
  return (
    <div className="min-h-screen bg-white">
      <Marquee />
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-green-700 text-white py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Property Buyers Guide</h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              Complete guide to buying property in India - from research to registration
            </p>
            <Button className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 text-lg">
              Start Learning
            </Button>
          </div>
        </div>
      </section>

      {/* Guide Sections */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Complete Buyers Journey</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card>
              <CardHeader>
                <BookOpen className="w-12 h-12 text-blue-600 mb-4" />
                <CardTitle>Research Phase</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Learn how to research locations, market trends, and property values effectively.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Calculator className="w-12 h-12 text-green-600 mb-4" />
                <CardTitle>Financial Planning</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Understand budgeting, loan eligibility, and various financing options available.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CheckCircle className="w-12 h-12 text-purple-600 mb-4" />
                <CardTitle>Property Inspection</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Comprehensive checklist for property inspection and quality assessment.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <AlertTriangle className="w-12 h-12 text-orange-600 mb-4" />
                <CardTitle>Legal Verification</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Essential legal checks, document verification, and compliance requirements.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Step-by-Step Guide */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Step-by-Step Buying Process</h2>
          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">1</div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Define Your Requirements</h3>
                      <p className="text-gray-600">Determine your budget, preferred location, property type, and must-have amenities.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">2</div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Secure Financing</h3>
                      <p className="text-gray-600">Get pre-approved for home loans and understand your borrowing capacity.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="bg-purple-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">3</div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Property Search</h3>
                      <p className="text-gray-600">Use online platforms, visit localities, and shortlist properties that meet your criteria.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="bg-orange-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">4</div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Due Diligence</h3>
                      <p className="text-gray-600">Verify legal documents, check property title, and conduct thorough inspections.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">5</div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Negotiation & Agreement</h3>
                      <p className="text-gray-600">Negotiate price, terms, and sign the sale agreement with proper legal guidance.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="bg-indigo-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">6</div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Registration & Handover</h3>
                      <p className="text-gray-600">Complete property registration, transfer utilities, and take possession of your new property.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default BuyersGuide;

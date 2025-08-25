import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Marquee from '@/components/Marquee';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Globe, FileCheck, DollarSign, Shield } from 'lucide-react';

const NRIGuide = () => {
  return (
    <div className="min-h-screen bg-white">
      <Marquee />
      <Header />
      
 {/* Hero Section (Mobile-friendly) */}
<section className="bg-gradient-to-r from-indigo-600 to-blue-700 text-white">
  <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    {/* Taller on mobile, full screen on md+; vertical centering */}
    <div className="flex min-h-[70vh] md:min-h-screen items-center py-16 sm:py-20 md:py-24">
      <div className="w-full text-center">
        <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold leading-tight mb-4 md:mb-6">
          NRI Real Estate Guide
        </h1>

        <p className="text-base sm:text-lg md:text-2xl mb-6 md:mb-8 opacity-90 max-w-2xl mx-auto">
          Complete guide for Non-Resident Indians investing in Indian real estate
        </p>

        {/* Full-width button on mobile, inline on larger screens */}
        <Button className="w-full sm:w-auto bg-white text-indigo-600 hover:bg-gray-100 px-6 sm:px-8 py-3 text-base sm:text-lg">
          Download Guide
        </Button>
      </div>
    </div>
  </div>
</section>


      {/* Guide Categories */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Essential Information for NRIs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card>
              <CardHeader>
                <Globe className="w-12 h-12 text-indigo-600 mb-4" />
                <CardTitle>FEMA Guidelines</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Understand Foreign Exchange Management Act regulations for property investments.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <FileCheck className="w-12 h-12 text-green-600 mb-4" />
                <CardTitle>Documentation</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Complete list of documents required for NRI property transactions in India.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <DollarSign className="w-12 h-12 text-orange-600 mb-4" />
                <CardTitle>Tax Implications</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Comprehensive tax guide including TDS, capital gains, and repatriation rules.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Shield className="w-12 h-12 text-purple-600 mb-4" />
                <CardTitle>Legal Protection</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Legal safeguards and protection mechanisms for NRI property investments.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FEMA Guidelines */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">FEMA Guidelines for NRIs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4 text-green-600">What NRIs Can Buy</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Residential properties</li>
                  <li>• Commercial properties</li>
                  <li>• Plots for construction</li>
                  <li>• Properties inherited from residents</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4 text-red-600">What NRIs Cannot Buy</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Agricultural land</li>
                  <li>• Plantation properties</li>
                  <li>• Farmhouses</li>
                  <li>• Properties in restricted areas</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Investment Process */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">NRI Investment Process</h2>
          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="bg-indigo-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">1</div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Open NRE/NRO Account</h3>
                      <p className="text-gray-600">Open Non-Resident External or Non-Resident Ordinary account with Indian bank.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">2</div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Property Search & Selection</h3>
                      <p className="text-gray-600">Research and select properties through trusted agents or online platforms.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">3</div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Legal Due Diligence</h3>
                      <p className="text-gray-600">Verify property documents and ensure compliance with FEMA regulations.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="bg-orange-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">4</div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Payment & Registration</h3>
                      <p className="text-gray-600">Make payments through proper banking channels and complete registration process.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="bg-purple-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">5</div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Reporting to RBI</h3>
                      <p className="text-gray-600">Submit required reports to RBI within prescribed time limits.</p>
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

export default NRIGuide;
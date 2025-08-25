import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Marquee from '@/components/Marquee';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Home, FileText, Shield, TrendingUp } from 'lucide-react';

const RentalGuide = () => {
  return (
    <div className="min-h-screen bg-white">
      <Marquee />
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-600 to-indigo-700 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Property Rental Guide</h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              Complete guide to renting properties in India - for tenants and landlords
            </p>
            <Button className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-3 text-lg">
              Start Reading
            </Button>
          </div>
        </div>
      </section>

      {/* Guide Categories */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Comprehensive Rental Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card>
              <CardHeader>
                <Home className="w-12 h-12 text-purple-600 mb-4" />
                <CardTitle>Finding Rentals</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Tips and strategies for finding the perfect rental property that meets your needs.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <FileText className="w-12 h-12 text-blue-600 mb-4" />
                <CardTitle>Legal Documentation</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Understanding rental agreements, lease terms, and legal requirements.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Shield className="w-12 h-12 text-green-600 mb-4" />
                <CardTitle>Rights & Responsibilities</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Know your rights and obligations as a tenant or landlord in rental relationships.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <TrendingUp className="w-12 h-12 text-orange-600 mb-4" />
                <CardTitle>Market Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Current rental market trends, pricing strategies, and investment opportunities.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* For Tenants */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Guide for Tenants</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Before Renting</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Define your budget and requirements</li>
                  <li>• Research neighborhoods and amenities</li>
                  <li>• Verify property documents</li>
                  <li>• Check landlord credentials</li>
                  <li>• Inspect property condition</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">During Tenancy</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Pay rent on time</li>
                  <li>• Maintain property condition</li>
                  <li>• Follow society rules</li>
                  <li>• Communicate issues promptly</li>
                  <li>• Keep payment records</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Tenant Rights</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Right to peaceful enjoyment</li>
                  <li>• Protection from illegal eviction</li>
                  <li>• Right to habitable premises</li>
                  <li>• Privacy rights</li>
                  <li>• Fair return of security deposit</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Moving Out</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Give proper notice period</li>
                  <li>• Document property condition</li>
                  <li>• Clear all dues and bills</li>
                  <li>• Coordinate final inspection</li>
                  <li>• Collect security deposit</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* For Landlords */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Guide for Landlords</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Preparing for Rental</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Property maintenance and repairs</li>
                  <li>• Market research for pricing</li>
                  <li>• Legal documentation preparation</li>
                  <li>• Insurance coverage</li>
                  <li>• Professional photography</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Tenant Screening</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Verify identity and employment</li>
                  <li>• Check credit history</li>
                  <li>• Contact previous landlords</li>
                  <li>• Interview potential tenants</li>
                  <li>• Require security deposit</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Landlord Responsibilities</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Maintain property in good condition</li>
                  <li>• Respect tenant privacy</li>
                  <li>• Handle repairs promptly</li>
                  <li>• Follow legal procedures</li>
                  <li>• Return deposits fairly</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Legal Compliance</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Rental agreement registration</li>
                  <li>• TDS compliance</li>
                  <li>• Income tax on rental income</li>
                  <li>• Local authority permissions</li>
                  <li>• Dispute resolution procedures</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Legal Framework */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Legal Framework</h2>
          <div className="max-w-4xl mx-auto">
            <div className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4">Key Laws Governing Rentals</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-2">Central Laws</h4>
                      <ul className="space-y-1 text-gray-600">
                        <li>• Transfer of Property Act, 1882</li>
                        <li>• Registration Act, 1908</li>
                        <li>• Indian Contract Act, 1872</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">State Laws</h4>
                      <ul className="space-y-1 text-gray-600">
                        <li>• Rent Control Acts (state-specific)</li>
                        <li>• Stamp Duty regulations</li>
                        <li>• Local municipal laws</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4">Recent Developments</h3>
                  <p className="text-gray-600 mb-4">
                    The Model Tenancy Act, 2021 aims to create a balanced framework for rental markets across India.
                  </p>
                  <ul className="space-y-2 text-gray-600">
                    <li>• Mandatory rental agreement registration</li>
                    <li>• Rent authority for dispute resolution</li>
                    <li>• Security deposit limitations</li>
                    <li>• Fast-track eviction procedures</li>
                  </ul>
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

export default RentalGuide;
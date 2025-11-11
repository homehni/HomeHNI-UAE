import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Marquee from '@/components/Marquee';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Home, Search, FileText, Shield } from 'lucide-react';

const TenantGuide = () => {
  return (
    <div className="min-h-screen bg-white">
      <Marquee />
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-cyan-600 to-blue-700 text-white py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Tenant Guide</h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              Complete guide for tenants - from house hunting to moving out
            </p>
            <Button className="bg-white text-cyan-600 hover:bg-gray-100 px-8 py-3 text-lg">
              Start Guide
            </Button>
          </div>
        </div>
      </section>

      {/* Guide Sections */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Your Tenant Journey</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card>
              <CardHeader>
                <Search className="w-12 h-12 text-cyan-600 mb-4" />
                <CardTitle>House Hunting</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Find the perfect rental property with our systematic search approach.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <FileText className="w-12 h-12 text-blue-600 mb-4" />
                <CardTitle>Documentation</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Understand rental agreements, required documents, and legal formalities.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Home className="w-12 h-12 text-green-600 mb-4" />
                <CardTitle>Living as Tenant</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Best practices for maintaining good relationships and property care.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Shield className="w-12 h-12 text-purple-600 mb-4" />
                <CardTitle>Rights & Protection</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Know your rights and how to protect yourself as a tenant.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* House Hunting Guide */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">House Hunting Checklist</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Before You Start</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Define your budget (30% of income rule)</li>
                  <li>• List must-have vs nice-to-have features</li>
                  <li>• Research neighborhoods and amenities</li>
                  <li>• Check commute distances</li>
                  <li>• Prepare required documents</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">During Property Visits</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Check water pressure and electricity</li>
                  <li>• Test mobile network coverage</li>
                  <li>• Inspect for damages or repairs needed</li>
                  <li>• Meet neighbors if possible</li>
                  <li>• Take photos and notes</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Questions to Ask Landlord</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• What's included in rent?</li>
                  <li>• Maintenance responsibilities</li>
                  <li>• Guest and pet policies</li>
                  <li>• Parking availability</li>
                  <li>• Lease renewal terms</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Red Flags to Avoid</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Unusually low rent for the area</li>
                  <li>• Reluctance to show documents</li>
                  <li>• Poor property maintenance</li>
                  <li>• Unclear lease terms</li>
                  <li>• Pressure to pay immediately</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Legal Documentation */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Essential Documents & Legal Aspects</h2>
          <div className="max-w-4xl mx-auto">
            <Card className="mb-8">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Documents You'll Need</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-2">Identity Proof</h4>
                    <ul className="space-y-1 text-gray-600">
                      <li>• Aadhar card copy</li>
                      <li>• PAN card copy</li>
                      <li>• Passport size photos</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Income Proof</h4>
                    <ul className="space-y-1 text-gray-600">
                      <li>• Salary slips</li>
                      <li>• Employment letter</li>
                      <li>• Bank statements</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Rental Agreement Essentials</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-2">Must Include</h4>
                    <ul className="space-y-1 text-gray-600">
                      <li>• Monthly rent amount</li>
                      <li>• Security deposit details</li>
                      <li>• Lease duration</li>
                      <li>• Maintenance responsibilities</li>
                      <li>• Termination clauses</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Registration</h4>
                    <ul className="space-y-1 text-gray-600">
                      <li>• Required for leases over 11 months</li>
                      <li>• Stamp duty payment</li>
                      <li>• Registration fees</li>
                      <li>• Both parties must be present</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Tenant Rights */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Your Rights as a Tenant</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4 text-green-600">Fundamental Rights</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Right to peaceful enjoyment</li>
                  <li>• Privacy in your rented space</li>
                  <li>• Protection from illegal eviction</li>
                  <li>• Right to habitable living conditions</li>
                  <li>• Fair return of security deposit</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4 text-blue-600">Maintenance Rights</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Repairs for structural issues</li>
                  <li>• Working utilities (water, electricity)</li>
                  <li>• Safe and secure premises</li>
                  <li>• Proper ventilation and lighting</li>
                  <li>• Pest control when needed</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Best Practices */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Best Practices for Tenants</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Good Communication</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Report issues promptly</li>
                  <li>• Keep written records</li>
                  <li>• Be respectful and professional</li>
                  <li>• Give proper notice for anything</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Property Care</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Keep the property clean</li>
                  <li>• Use appliances properly</li>
                  <li>• Don't make unauthorized changes</li>
                  <li>• Report damages immediately</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Financial Management</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Pay rent on time</li>
                  <li>• Keep payment receipts</li>
                  <li>• Budget for utility bills</li>
                  <li>• Document deposit payments</li>
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

export default TenantGuide;

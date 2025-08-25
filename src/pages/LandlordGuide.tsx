import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Marquee from '@/components/Marquee';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building, Users, FileCheck, Calculator } from 'lucide-react';

const LandlordGuide = () => {
  return (
    <div className="min-h-screen bg-white">
      <Marquee />
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Landlord Guide</h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              Complete guide for property owners on renting, managing, and maximizing returns
            </p>
            <Button className="bg-white text-emerald-600 hover:bg-gray-100 px-8 py-3 text-lg">
              Get Started
            </Button>
          </div>
        </div>
      </section>

      {/* Core Areas */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Essential Areas for Landlords</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card>
              <CardHeader>
                <Building className="w-12 h-12 text-emerald-600 mb-4" />
                <CardTitle>Property Preparation</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Prepare your property for rental with repairs, documentation, and market positioning.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Users className="w-12 h-12 text-blue-600 mb-4" />
                <CardTitle>Tenant Management</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Screen tenants effectively and maintain good landlord-tenant relationships.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <FileCheck className="w-12 h-12 text-purple-600 mb-4" />
                <CardTitle>Legal Compliance</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Understand legal requirements, documentation, and compliance obligations.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Calculator className="w-12 h-12 text-orange-600 mb-4" />
                <CardTitle>Financial Management</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Manage rental income, taxes, expenses, and optimize your investment returns.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Getting Started */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Getting Started as a Landlord</h2>
          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="bg-emerald-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">1</div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Property Assessment</h3>
                      <p className="text-gray-600">Evaluate your property's rental potential, condition, and required improvements.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">2</div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Market Research</h3>
                      <p className="text-gray-600">Research local rental rates, demand patterns, and competitive properties.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="bg-purple-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">3</div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Legal Setup</h3>
                      <p className="text-gray-600">Prepare rental agreements, understand local laws, and ensure compliance.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="bg-orange-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">4</div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Marketing Strategy</h3>
                      <p className="text-gray-600">Create attractive listings, professional photos, and effective marketing campaigns.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Best Practices */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Landlord Best Practices</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Tenant Screening</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Verify employment and income</li>
                  <li>• Check credit history and references</li>
                  <li>• Conduct background checks</li>
                  <li>• Interview potential tenants</li>
                  <li>• Document all interactions</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Property Maintenance</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Regular property inspections</li>
                  <li>• Prompt repair responses</li>
                  <li>• Preventive maintenance schedule</li>
                  <li>• Professional service providers</li>
                  <li>• Maintenance cost budgeting</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Communication</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Clear communication channels</li>
                  <li>• Written documentation</li>
                  <li>• Professional interactions</li>
                  <li>• Timely responses to queries</li>
                  <li>• Regular check-ins with tenants</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Financial Management</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Accurate record keeping</li>
                  <li>• Tax compliance and deductions</li>
                  <li>• Emergency fund maintenance</li>
                  <li>• Regular financial reviews</li>
                  <li>• Professional accounting help</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Common Challenges */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Common Landlord Challenges</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Late Rent Payments</h3>
                <p className="text-gray-600 mb-4">Handling delayed or missed rent payments effectively.</p>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• Clear payment terms in agreement</li>
                  <li>• Automated payment reminders</li>
                  <li>• Late fee policies</li>
                  <li>• Direct communication approach</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Property Damage</h3>
                <p className="text-gray-600 mb-4">Managing wear and tear vs. tenant damage.</p>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• Detailed move-in inspections</li>
                  <li>• Photo documentation</li>
                  <li>• Security deposit guidelines</li>
                  <li>• Insurance coverage</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Difficult Tenants</h3>
                <p className="text-gray-600 mb-4">Dealing with problematic tenant behavior.</p>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• Clear house rules</li>
                  <li>• Written warnings</li>
                  <li>• Legal eviction procedures</li>
                  <li>• Professional mediation</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Legal Obligations */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Legal Obligations</h2>
          <div className="max-w-4xl mx-auto">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Key Legal Requirements</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-2">Documentation</h4>
                    <ul className="space-y-1 text-gray-600">
                      <li>• Registered rental agreement</li>
                      <li>• Property ownership documents</li>
                      <li>• NOC from housing society</li>
                      <li>• Tax compliance certificates</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Responsibilities</h4>
                    <ul className="space-y-1 text-gray-600">
                      <li>• Maintain habitable conditions</li>
                      <li>• Respect tenant privacy</li>
                      <li>• Follow eviction procedures</li>
                      <li>• TDS compliance for rent</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LandlordGuide;
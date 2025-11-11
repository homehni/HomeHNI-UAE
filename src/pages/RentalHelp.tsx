import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Marquee from '@/components/Marquee';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle, FileText, Shield, Users } from 'lucide-react';

const RentalHelp = () => {
  return (
    <div className="min-h-screen bg-white">
      <Marquee />
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 to-teal-700 text-white py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Rental Questions & Support</h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              Get answers to all your rental property questions from our experts
            </p>
            <Button className="bg-white text-green-600 hover:bg-gray-100 px-8 py-3 text-lg">
              Ask a Question
            </Button>
          </div>
        </div>
      </section>

      {/* Support Categories */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How We Can Help</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card>
              <CardHeader>
                <MessageCircle className="w-12 h-12 text-green-600 mb-4" />
                <CardTitle>Quick Answers</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Get instant answers to common rental questions through our knowledge base.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <FileText className="w-12 h-12 text-blue-600 mb-4" />
                <CardTitle>Documentation Help</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Assistance with rental agreements, lease documents, and legal paperwork.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Shield className="w-12 h-12 text-purple-600 mb-4" />
                <CardTitle>Legal Support</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Expert guidance on tenant rights, landlord obligations, and dispute resolution.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Users className="w-12 h-12 text-orange-600 mb-4" />
                <CardTitle>Community Forum</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Connect with other renters and landlords to share experiences and advice.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Common Questions */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Most Asked Questions</h2>
          <div className="max-w-4xl mx-auto space-y-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-2">How much security deposit can a landlord ask for?</h3>
                <p className="text-gray-600">Typically 2-10 months' rent depending on the property type and location. Commercial properties may require higher deposits.</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-2">What should be included in a rental agreement?</h3>
                <p className="text-gray-600">Rent amount, tenure, deposit, maintenance charges, rules and regulations, and termination clauses.</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-2">Can a landlord increase rent during the lease period?</h3>
                <p className="text-gray-600">Only if there's a clause in the agreement allowing rent escalation or with mutual consent of both parties.</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-2">What are tenant rights in case of property issues?</h3>
                <p className="text-gray-600">Tenants have right to habitable premises, privacy, and can demand repairs for structural issues.</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-2">How to handle rental disputes?</h3>
                <p className="text-gray-600">Try negotiation first, then approach local rent control authorities or consumer courts for resolution.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Help Categories */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Support Categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">For Tenants</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Finding rental properties</li>
                  <li>• Understanding lease terms</li>
                  <li>• Security deposit issues</li>
                  <li>• Maintenance requests</li>
                  <li>• Lease renewal process</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">For Landlords</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Tenant screening</li>
                  <li>• Rental pricing strategies</li>
                  <li>• Legal documentation</li>
                  <li>• Property management</li>
                  <li>• Eviction procedures</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Legal Matters</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Rental laws and regulations</li>
                  <li>• Dispute resolution</li>
                  <li>• Contract interpretation</li>
                  <li>• Court procedures</li>
                  <li>• Legal documentation</li>
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

export default RentalHelp;

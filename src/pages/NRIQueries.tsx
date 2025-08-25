import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Marquee from '@/components/Marquee';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare, Phone, Mail, Clock } from 'lucide-react';

const NRIQueries = () => {
  return (
    <div className="min-h-screen bg-white">
      <Marquee />
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-teal-600 to-cyan-700 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">NRI Real Estate Queries</h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              Get expert answers to all your NRI property investment questions
            </p>
            <Button className="bg-white text-teal-600 hover:bg-gray-100 px-8 py-3 text-lg">
              Ask a Question
            </Button>
          </div>
        </div>
      </section>

      {/* Contact Options */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How to Reach Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card>
              <CardHeader>
                <MessageSquare className="w-12 h-12 text-teal-600 mb-4" />
                <CardTitle>Live Chat</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Get instant answers through our live chat support available 24/7.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Phone className="w-12 h-12 text-blue-600 mb-4" />
                <CardTitle>Phone Support</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Call our NRI helpline for personalized assistance with your queries.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Mail className="w-12 h-12 text-green-600 mb-4" />
                <CardTitle>Email Support</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Send detailed queries via email and get comprehensive responses.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Clock className="w-12 h-12 text-orange-600 mb-4" />
                <CardTitle>Scheduled Consultation</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Book a one-on-one consultation with our NRI property experts.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          <div className="max-w-4xl mx-auto space-y-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-2">Can NRIs buy property in India?</h3>
                <p className="text-gray-600">Yes, NRIs can buy residential and commercial properties in India, except agricultural land, plantation properties, and farmhouses.</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-2">What documents are required for NRI property purchase?</h3>
                <p className="text-gray-600">Key documents include passport, visa, PAN card, NRE/NRO account details, and property-related documents.</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-2">How can NRIs fund their property purchase?</h3>
                <p className="text-gray-600">Through NRE/NRO accounts, foreign remittances, or home loans from Indian banks with NRI schemes.</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-2">What are the tax implications for NRI property owners?</h3>
                <p className="text-gray-600">NRIs are subject to TDS on property transactions, capital gains tax, and need to file returns for rental income.</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-2">Can NRIs get home loans in India?</h3>
                <p className="text-gray-600">Yes, most Indian banks offer home loans to NRIs with specific eligibility criteria and documentation requirements.</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-2">Is it mandatory to report property purchase to RBI?</h3>
                <p className="text-gray-600">Yes, NRIs must report property transactions to RBI within prescribed time limits as per FEMA guidelines.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Expert Support */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-6">Need Expert Guidance?</h2>
            <p className="text-xl text-gray-600 mb-8">Our NRI property experts are here to help you navigate the Indian real estate market</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button className="bg-teal-600 hover:bg-teal-700">Schedule Consultation</Button>
              <Button variant="outline">Download NRI Guide</Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default NRIQueries;
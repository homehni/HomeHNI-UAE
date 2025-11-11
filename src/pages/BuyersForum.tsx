import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Marquee from '@/components/Marquee';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle, Users, HelpCircle, Lightbulb } from 'lucide-react';

const BuyersForum = () => {
  return (
    <div className="min-h-screen bg-white">
      <Marquee />
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-600 to-pink-700 text-white py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Property Buyers Forum</h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              Connect with fellow property buyers and share experiences
            </p>
            <Button className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-3 text-lg">
              Join Community
            </Button>
          </div>
        </div>
      </section>

      {/* Forum Features */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Forum Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card>
              <CardHeader>
                <MessageCircle className="w-12 h-12 text-purple-600 mb-4" />
                <CardTitle>Discussion Threads</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Participate in discussions about property markets, investment strategies, and buying tips.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Users className="w-12 h-12 text-blue-600 mb-4" />
                <CardTitle>Community Support</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Get support from experienced buyers and share your knowledge with newcomers.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <HelpCircle className="w-12 h-12 text-green-600 mb-4" />
                <CardTitle>Expert Q&A</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Ask questions to real estate experts and get professional advice on property matters.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Lightbulb className="w-12 h-12 text-orange-600 mb-4" />
                <CardTitle>Tips & Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Share and discover valuable tips, market insights, and property buying strategies.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Popular Topics */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Popular Discussion Topics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Market Analysis</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Current market trends</li>
                  <li>• Price predictions</li>
                  <li>• Best locations to invest</li>
                  <li>• Timing the market</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Legal & Documentation</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Property verification</li>
                  <li>• Legal documentation</li>
                  <li>• Registration process</li>
                  <li>• Title clearance</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Financing Options</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Home loan comparisons</li>
                  <li>• Interest rate discussions</li>
                  <li>• Loan eligibility tips</li>
                  <li>• Down payment strategies</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Property Reviews</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Builder reviews</li>
                  <li>• Project experiences</li>
                  <li>• Locality reviews</li>
                  <li>• Amenities feedback</li>
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

export default BuyersForum;

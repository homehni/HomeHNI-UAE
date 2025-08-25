import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Marquee from '@/components/Marquee';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator, TrendingUp, DollarSign, BarChart } from 'lucide-react';

const RentCalculator = () => {
  const [propertyValue, setPropertyValue] = useState('');
  const [expectedYield, setExpectedYield] = useState('');
  const [location, setLocation] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [calculatedRent, setCalculatedRent] = useState(0);

  const calculateRent = () => {
    if (propertyValue && expectedYield) {
      const value = parseFloat(propertyValue);
      const yield_rate = parseFloat(expectedYield) / 100;
      const monthlyRent = (value * yield_rate) / 12;
      setCalculatedRent(monthlyRent);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Marquee />
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Rent Calculator</h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              Calculate optimal rental prices for your property investment
            </p>
            <Calculator className="w-16 h-16 mx-auto opacity-80" />
          </div>
        </div>
      </section>

      {/* Calculator Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Calculator Form */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Property Rental Calculator</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="propertyValue">Property Value (₹)</Label>
                  <Input
                    id="propertyValue"
                    type="number"
                    placeholder="Enter property value"
                    value={propertyValue}
                    onChange={(e) => setPropertyValue(e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="expectedYield">Expected Annual Yield (%)</Label>
                  <Input
                    id="expectedYield"
                    type="number"
                    placeholder="Enter expected yield (e.g., 3.5)"
                    value={expectedYield}
                    onChange={(e) => setExpectedYield(e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="location">Location</Label>
                  <Select value={location} onValueChange={setLocation}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bangalore">Bangalore</SelectItem>
                      <SelectItem value="mumbai">Mumbai</SelectItem>
                      <SelectItem value="delhi">Delhi</SelectItem>
                      <SelectItem value="pune">Pune</SelectItem>
                      <SelectItem value="hyderabad">Hyderabad</SelectItem>
                      <SelectItem value="chennai">Chennai</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="propertyType">Property Type</Label>
                  <Select value={propertyType} onValueChange={setPropertyType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select property type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="apartment">Apartment</SelectItem>
                      <SelectItem value="villa">Independent House/Villa</SelectItem>
                      <SelectItem value="commercial">Commercial Space</SelectItem>
                      <SelectItem value="plot">Plot/Land</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button onClick={calculateRent} className="w-full">
                  Calculate Rent
                </Button>

                {calculatedRent > 0 && (
                  <Card className="bg-green-50 border-green-200">
                    <CardContent className="p-4">
                      <h3 className="text-lg font-semibold text-green-800 mb-2">Calculated Monthly Rent</h3>
                      <p className="text-2xl font-bold text-green-600">
                        ₹{calculatedRent.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                      </p>
                    </CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>

            {/* Information Panel */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <TrendingUp className="w-8 h-8 text-blue-600 mb-2" />
                  <CardTitle>Market Insights</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Rental yields vary by location and property type. Metro cities typically offer 2-4% annual yields.
                  </p>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Mumbai: 2.5-3.5% average yield</li>
                    <li>• Bangalore: 3-4% average yield</li>
                    <li>• Delhi: 2.5-3.5% average yield</li>
                    <li>• Pune: 3.5-4.5% average yield</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <DollarSign className="w-8 h-8 text-green-600 mb-2" />
                  <CardTitle>Factors Affecting Rent</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-gray-600">
                    <li>• Location and connectivity</li>
                    <li>• Property condition and amenities</li>
                    <li>• Market demand and supply</li>
                    <li>• Seasonal variations</li>
                    <li>• Local infrastructure development</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <BarChart className="w-8 h-8 text-purple-600 mb-2" />
                  <CardTitle>Optimization Tips</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-gray-600">
                    <li>• Research comparable rentals in area</li>
                    <li>• Consider furnishing for higher rent</li>
                    <li>• Factor in maintenance costs</li>
                    <li>• Review and adjust annually</li>
                    <li>• Consider long-term vs short-term rentals</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Additional Features */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Additional Calculations</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="p-6 text-center">
                <Calculator className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">ROI Calculator</h3>
                <p className="text-gray-600">Calculate return on investment for your rental property.</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <TrendingUp className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Market Analysis</h3>
                <p className="text-gray-600">Compare rental rates across different areas and property types.</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <BarChart className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Yield Comparison</h3>
                <p className="text-gray-600">Compare rental yields with other investment options.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default RentCalculator;
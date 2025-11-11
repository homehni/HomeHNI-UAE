import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Ruler, ArrowRightLeft, Calculator } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const AreaConverter = () => {
  const [inputValue, setInputValue] = useState(1000);
  const [fromUnit, setFromUnit] = useState('sqft');
  const [toUnit, setToUnit] = useState('sqm');
  const [result, setResult] = useState(0);

  const units = [
    { value: 'sqft', label: 'Square Feet (sq ft)', factor: 1 },
    { value: 'sqm', label: 'Square Meter (sq m)', factor: 10.764 },
    { value: 'sqyd', label: 'Square Yard (sq yd)', factor: 0.111 },
    { value: 'acre', label: 'Acre', factor: 43560 },
    { value: 'hectare', label: 'Hectare', factor: 107639 },
    { value: 'bigha', label: 'Bigha', factor: 27225 },
    { value: 'katha', label: 'Katha', factor: 1361.25 },
    { value: 'cent', label: 'Cent', factor: 435.6 },
    { value: 'guntha', label: 'Guntha', factor: 1089 },
    { value: 'ground', label: 'Ground', factor: 2400 },
  ];

  const convertArea = () => {
    const fromFactor = units.find(u => u.value === fromUnit)?.factor || 1;
    const toFactor = units.find(u => u.value === toUnit)?.factor || 1;
    
    // Convert to square feet first, then to target unit
    const sqFeetValue = inputValue * fromFactor;
    const convertedValue = sqFeetValue / toFactor;
    
    setResult(convertedValue);
  };

  useEffect(() => {
    convertArea();
  }, [inputValue, fromUnit, toUnit]);

  useEffect(() => {
    document.title = "Area Converter - Property Area Unit Conversion Tool";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Convert property area units easily. Support for square feet, square meters, acres, bigha, guntha, and more area measurements.');
    }
  }, []);

  const swapUnits = () => {
    const tempUnit = fromUnit;
    setFromUnit(toUnit);
    setToUnit(tempUnit);
  };

  const commonConversions = [
    { from: 1000, fromUnit: 'sqft', result: 92.9, toUnit: 'sqm' },
    { from: 1, fromUnit: 'acre', result: 43560, toUnit: 'sqft' },
    { from: 1, fromUnit: 'bigha', result: 27225, toUnit: 'sqft' },
    { from: 1, fromUnit: 'guntha', result: 1089, toUnit: 'sqft' },
    { from: 1, fromUnit: 'ground', result: 2400, toUnit: 'sqft' },
    { from: 1, fromUnit: 'cent', result: 435.6, toUnit: 'sqft' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 pt-24 pb-16">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-primary w-12 h-12 rounded-full flex items-center justify-center mr-4">
              <Ruler className="w-6 h-6 text-primary-foreground" />
            </div>
            <h1 className="text-4xl font-bold text-foreground">Area Converter</h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Convert between different area units used in real estate - from square feet to acres, bigha, guntha and more
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Converter Section */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="w-5 h-5" />
                  Area Conversion Calculator
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <Label>From</Label>
                    <Input
                      type="number"
                      value={inputValue}
                      onChange={(e) => setInputValue(Number(e.target.value))}
                      placeholder="Enter value"
                      className="text-lg"
                    />
                    <Select value={fromUnit} onValueChange={setFromUnit}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {units.map((unit) => (
                          <SelectItem key={unit.value} value={unit.value}>
                            {unit.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-4">
                    <Label>To</Label>
                    <div className="text-lg p-3 bg-muted rounded-md font-medium">
                      {result.toLocaleString('en-IN', { 
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 6 
                      })}
                    </div>
                    <Select value={toUnit} onValueChange={setToUnit}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {units.map((unit) => (
                          <SelectItem key={unit.value} value={unit.value}>
                            {unit.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex justify-center">
                  <Button
                    variant="outline"
                    onClick={swapUnits}
                    className="flex items-center gap-2"
                  >
                    <ArrowRightLeft className="w-4 h-4" />
                    Swap Units
                  </Button>
                </div>

                <div className="bg-primary/5 rounded-lg p-4 text-center">
                  <div className="text-sm text-muted-foreground mb-2">Conversion Result</div>
                  <div className="text-2xl font-bold text-primary">
                    {inputValue.toLocaleString('en-IN')} {units.find(u => u.value === fromUnit)?.label.split('(')[1]?.replace(')', '') || fromUnit}
                    {" = "}
                    {result.toLocaleString('en-IN', { 
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 6 
                    })} {units.find(u => u.value === toUnit)?.label.split('(')[1]?.replace(')', '') || toUnit}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Reference */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Common Conversions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {commonConversions.map((conversion, index) => (
                  <div key={index} className="text-sm">
                    <div className="flex justify-between">
                      <span>1 {conversion.fromUnit}</span>
                      <span className="font-medium">
                        {conversion.result.toLocaleString('en-IN', { maximumFractionDigits: 2 })} {conversion.toUnit}
                      </span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Area Unit Guide</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <div>
                  <strong>Square Feet:</strong> Most common unit for apartments and small plots
                </div>
                <div>
                  <strong>Acre:</strong> Large agricultural land, 1 acre = 43,560 sq ft
                </div>
                <div>
                  <strong>Bigha:</strong> Traditional Indian unit, varies by region (20-40 grounds)
                </div>
                <div>
                  <strong>Guntha:</strong> Common in Maharashtra, 1 guntha = 1,089 sq ft
                </div>
                <div>
                  <strong>Cent:</strong> Used in South India, 1 cent = 435.6 sq ft
                </div>
                <div>
                  <strong>Ground:</strong> Used in Tamil Nadu, 1 ground = 2,400 sq ft
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Pro Tips</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <p>• Always verify local area measurement standards</p>
                <p>• Check property documents for exact measurements</p>
                <p>• Consider carpet area vs super built-up area</p>
                <p>• Factor in common areas for apartments</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AreaConverter;

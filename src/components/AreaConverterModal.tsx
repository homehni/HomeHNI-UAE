import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Ruler, ArrowRightLeft, Calculator } from 'lucide-react';

interface AreaConverterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AreaConverterModal: React.FC<AreaConverterModalProps> = ({
  isOpen,
  onClose
}) => {
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

  const unitGuide = [
    { unit: 'Square Feet', description: 'Most common for apartments' },
    { unit: 'Acre', description: 'Large agricultural land' },
    { unit: 'Bigha', description: 'Traditional Indian unit' },
    { unit: 'Guntha', description: 'Common in Maharashtra' },
    { unit: 'Cent', description: 'Used in South India' },
    { unit: 'Ground', description: 'Used in Tamil Nadu' },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <Ruler className="w-6 h-6 text-primary" />
            Area Converter
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Converter Section */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-6 space-y-6">
                <div className="flex items-center gap-2 mb-4">
                  <Calculator className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold">Area Conversion Calculator</h3>
                </div>
                
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
                  <div className="text-xl font-bold text-primary">
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
              <CardContent className="p-6">
                <h4 className="font-medium text-sm mb-4">Common Conversions</h4>
                <div className="space-y-3">
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
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h4 className="font-medium text-sm mb-4">Area Unit Guide</h4>
                <div className="space-y-3">
                  {unitGuide.map((item, index) => (
                    <div key={index} className="text-xs">
                      <div className="font-medium">{item.unit}</div>
                      <div className="text-muted-foreground">{item.description}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AreaConverterModal;
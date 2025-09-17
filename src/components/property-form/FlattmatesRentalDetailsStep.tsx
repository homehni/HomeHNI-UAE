import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PriceInput } from '@/components/ui/price-input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Calendar } from 'lucide-react';
import { formatPriceDisplay } from '@/utils/priceFormatter';

interface FlattmatesRentalDetails {
  expectedRent: number;
  expectedDeposit: number;
  rentNegotiable: boolean;
  monthlyMaintenance: string;
  availableFrom: string;
  description: string;
}

interface FlattmatesRentalDetailsStepProps {
  initialData?: Partial<FlattmatesRentalDetails>;
  onNext: (data: FlattmatesRentalDetails) => void;
  onBack: () => void;
  currentStep: number;
  totalSteps: number;
  completedSteps: number[];
}

export function FlattmatesRentalDetailsStep({ 
  initialData, 
  onNext, 
  onBack, 
  currentStep, 
  totalSteps,
  completedSteps 
}: FlattmatesRentalDetailsStepProps) {
  const [formData, setFormData] = useState<FlattmatesRentalDetails>({
    expectedRent: 0,
    expectedDeposit: 0,
    rentNegotiable: false,
    monthlyMaintenance: '',
    availableFrom: '',
    description: '',
    ...initialData,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid()) {
      onNext(formData);
    }
  };

  const isFormValid = () => {
    return true; // All fields are now optional
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-2">Rental Details</h2>
        <p className="text-muted-foreground">Set your rental expectations and terms</p>
      </div>

          <Card>
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Expected Rent and Expected Deposit */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expectedRent">Expected Rent</Label>
                    <PriceInput
                      id="expectedRent"
                      value={formData.expectedRent}
                      onChange={(value) => setFormData({ ...formData, expectedRent: value || 0 })}
                      placeholder="Enter Amount"
                      className="h-12"
                    />
                    {/* Expected rent in words display */}
                    {formData.expectedRent && formData.expectedRent > 0 && (
                      <div className="mt-2">
                        <p className="text-sm text-gray-600">
                          {formatPriceDisplay(formData.expectedRent)}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="expectedDeposit">Expected Deposit</Label>
                    <PriceInput
                      id="expectedDeposit"
                      value={formData.expectedDeposit}
                      onChange={(value) => setFormData({ ...formData, expectedDeposit: value || 0 })}
                      placeholder="Enter Amount"
                      className="h-12"
                    />
                    {/* Expected deposit in words display */}
                    {formData.expectedDeposit && formData.expectedDeposit > 0 && (
                      <div className="mt-2">
                        <p className="text-sm text-gray-600">
                          {formatPriceDisplay(formData.expectedDeposit)}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Rent Negotiable Toggle - Full Width */}
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <Label htmlFor="rentNegotiable" className="text-base font-medium">
                      Rent Negotiable
                    </Label>
                  </div>
                  <Switch
                    id="rentNegotiable"
                    checked={formData.rentNegotiable}
                    onCheckedChange={(checked) => setFormData({ ...formData, rentNegotiable: checked })}
                  />
                </div>

                {/* Monthly Maintenance and Available From */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="monthlyMaintenance">Monthly Maintenance</Label>
                    <Select
                      value={formData.monthlyMaintenance}
                      onValueChange={(value) => setFormData({ ...formData, monthlyMaintenance: value })}
                    >
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Included">Included in Rent</SelectItem>
                        <SelectItem value="Extra">Extra</SelectItem>
                        <SelectItem value="Not Applicable">Not Applicable</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="availableFrom">Available From</Label>
                    <div className="relative">
                      <Input
                        id="availableFrom"
                        type="date"
                        value={formData.availableFrom}
                        onChange={(e) => setFormData({ ...formData, availableFrom: e.target.value })}
                        className="h-12 pr-12"
                        min={new Date().toISOString().split('T')[0]}
                        max={new Date(new Date().setMonth(new Date().getMonth() + 2)).toISOString().split('T')[0]}
                      />
                      <Calendar className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    </div>
                  </div>
                </div>


                {/* Description - Full Width */}
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe your property and what makes it special for flatmates..."
                    rows={4}
                  />
                </div>

                <div className="flex justify-between pt-6">
                  <Button type="button" variant="white" onClick={onBack}>
                    Back
                  </Button>
                  <Button type="submit" variant="default">
                    Save & Continue
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
    </div>
  );
}
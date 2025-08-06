import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { FlattmatesSidebar } from './FlattmatesSidebar';
import { Sofa, Car, Calendar } from 'lucide-react';

interface FlattmatesRentalDetails {
  expectedRent: number;
  expectedDeposit: number;
  rentNegotiable: boolean;
  monthlyMaintenance: string;
  availableFrom: string;
  furnishing: string;
  parking: string;
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
    furnishing: '',
    parking: '',
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
    return formData.expectedRent > 0 && 
           formData.expectedDeposit > 0 &&
           formData.availableFrom &&
           formData.furnishing &&
           formData.parking;
  };

  return (
    <div className="flex min-h-screen bg-background">
      <FlattmatesSidebar currentStep={currentStep} completedSteps={completedSteps} />
      
      <div className="flex-1 p-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-2">Rental Details</h2>
            <p className="text-muted-foreground">Set your rental expectations and terms</p>
          </div>

          <Card>
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="expectedRent">Expected Rent *</Label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                      ₹
                    </span>
                    <Input
                      id="expectedRent"
                      type="number"
                      value={formData.expectedRent || ''}
                      onChange={(e) => setFormData({ ...formData, expectedRent: parseInt(e.target.value) || 0 })}
                      placeholder="Enter Amount"
                      className="h-12 pl-8 pr-20"
                      min="1"
                      required
                    />
                    <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                      / Month
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="expectedDeposit">Expected Deposit *</Label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                      ₹
                    </span>
                    <Input
                      id="expectedDeposit"
                      type="number"
                      value={formData.expectedDeposit || ''}
                      onChange={(e) => setFormData({ ...formData, expectedDeposit: parseInt(e.target.value) || 0 })}
                      placeholder="Enter Amount"
                      className="h-12 pl-8"
                      min="0"
                      required
                    />
                  </div>
                </div>

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
                  <Label htmlFor="availableFrom">Available From *</Label>
                  <div className="relative">
                    <Input
                      id="availableFrom"
                      type="date"
                      value={formData.availableFrom}
                      onChange={(e) => setFormData({ ...formData, availableFrom: e.target.value })}
                      className="h-12 pr-12"
                      required
                    />
                    <Calendar className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="furnishing">Furnishing *</Label>
                  <div className="relative">
                    <Select
                      value={formData.furnishing}
                      onValueChange={(value) => setFormData({ ...formData, furnishing: value })}
                    >
                      <SelectTrigger className="h-12 pl-12">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Fully Furnished">Fully Furnished</SelectItem>
                        <SelectItem value="Semi Furnished">Semi Furnished</SelectItem>
                        <SelectItem value="Unfurnished">Unfurnished</SelectItem>
                      </SelectContent>
                    </Select>
                    <Sofa className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="parking">Parking *</Label>
                  <div className="relative">
                    <Select
                      value={formData.parking}
                      onValueChange={(value) => setFormData({ ...formData, parking: value })}
                    >
                      <SelectTrigger className="h-12 pl-12">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="None">None</SelectItem>
                        <SelectItem value="Bike Parking">Bike Parking</SelectItem>
                        <SelectItem value="Car Parking">Car Parking</SelectItem>
                        <SelectItem value="Both">Both Bike & Car</SelectItem>
                      </SelectContent>
                    </Select>
                    <Car className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  </div>
                </div>

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
                  <Button type="button" variant="outline" onClick={onBack}>
                    Back
                  </Button>
                  <Button type="submit" disabled={!isFormValid()}>
                    Save & Continue
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface PgHostelLocalityDetails {
  state: string;
  city: string;
  locality: string;
  pincode: string;
  societyName?: string;
  landmark?: string;
}

interface PgHostelLocalityDetailsStepProps {
  initialData?: Partial<PgHostelLocalityDetails>;
  onNext: (data: PgHostelLocalityDetails) => void;
  onBack: () => void;
  currentStep: number;
  totalSteps: number;
}

export function PgHostelLocalityDetailsStep({ 
  initialData, 
  onNext, 
  onBack, 
  currentStep, 
  totalSteps 
}: PgHostelLocalityDetailsStepProps) {
  const [formData, setFormData] = useState<PgHostelLocalityDetails>({
    state: '',
    city: '',
    locality: '',
    pincode: '',
    societyName: '',
    landmark: '',
    ...initialData,
  });

  const [indiaData, setIndiaData] = useState<any>({});
  const [cities, setCities] = useState<string[]>([]);

  useEffect(() => {
    // Load India states and cities data
    fetch('/data/india_states_cities.json')
      .then(response => response.json())
      .then(data => {
        setIndiaData(data);
      })
      .catch(error => {
        console.error('Error loading states and cities data:', error);
      });
  }, []);

  useEffect(() => {
    if (formData.state && indiaData[formData.state]) {
      setCities(indiaData[formData.state]);
    } else {
      setCities([]);
    }
  }, [formData.state, indiaData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid()) {
      onNext(formData);
    }
  };

  const isFormValid = () => {
    return formData.state && 
           formData.city && 
           formData.locality && 
           formData.pincode;
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-2">Locality Details</h2>
        <p className="text-muted-foreground">Where is your PG/Hostel located?</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Location Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="state">State *</Label>
                <Select
                  value={formData.state}
                  onValueChange={(value) => {
                    setFormData({ ...formData, state: value, city: '' });
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(indiaData).map((state) => (
                      <SelectItem key={state} value={state}>
                        {state}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="city">City *</Label>
                <Select
                  value={formData.city}
                  onValueChange={(value) => setFormData({ ...formData, city: value })}
                  disabled={!formData.state}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select city" />
                  </SelectTrigger>
                  <SelectContent>
                    {cities.map((city) => (
                      <SelectItem key={city} value={city}>
                        {city}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="locality">Locality *</Label>
                <Input
                  id="locality"
                  value={formData.locality}
                  onChange={(e) => setFormData({ ...formData, locality: e.target.value })}
                  placeholder="Enter locality/area"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="pincode">Pincode *</Label>
                <Input
                  id="pincode"
                  value={formData.pincode}
                  onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                  placeholder="Enter pincode"
                  pattern="[0-9]{6}"
                  maxLength={6}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="societyName">Society/Building Name</Label>
                <Input
                  id="societyName"
                  value={formData.societyName}
                  onChange={(e) => setFormData({ ...formData, societyName: e.target.value })}
                  placeholder="Enter society or building name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="landmark">Landmark</Label>
                <Input
                  id="landmark"
                  value={formData.landmark}
                  onChange={(e) => setFormData({ ...formData, landmark: e.target.value })}
                  placeholder="Enter nearby landmark"
                />
              </div>
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
  );
}
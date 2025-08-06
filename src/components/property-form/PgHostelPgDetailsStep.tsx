import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface PgHostelPgDetails {
  roomType: 'single' | 'shared' | 'dormitory';
  genderPreference: 'male' | 'female' | 'any';
  mealOptions: 'included' | 'optional' | 'not-available';
  timingRestrictions?: string;
  houseRules?: string;
}

interface PgHostelPgDetailsStepProps {
  initialData?: Partial<PgHostelPgDetails>;
  onNext: (data: PgHostelPgDetails) => void;
  onBack: () => void;
  currentStep: number;
  totalSteps: number;
}

export function PgHostelPgDetailsStep({ 
  initialData, 
  onNext, 
  onBack, 
  currentStep, 
  totalSteps 
}: PgHostelPgDetailsStepProps) {
  const [formData, setFormData] = useState<PgHostelPgDetails>({
    roomType: 'single',
    genderPreference: 'any',
    mealOptions: 'not-available',
    timingRestrictions: '',
    houseRules: '',
    ...initialData,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid()) {
      onNext(formData);
    }
  };

  const isFormValid = () => {
    return formData.roomType && formData.genderPreference && formData.mealOptions;
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-2">PG Details</h2>
        <p className="text-muted-foreground">PG/Hostel specific information</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>PG/Hostel Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="roomType">Room Type *</Label>
                <Select
                  value={formData.roomType}
                  onValueChange={(value: 'single' | 'shared' | 'dormitory') => 
                    setFormData({ ...formData, roomType: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select room type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="single">Single Occupancy</SelectItem>
                    <SelectItem value="shared">Shared Room (2-3 people)</SelectItem>
                    <SelectItem value="dormitory">Dormitory (4+ people)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="genderPreference">Gender Preference *</Label>
                <Select
                  value={formData.genderPreference}
                  onValueChange={(value: 'male' | 'female' | 'any') => 
                    setFormData({ ...formData, genderPreference: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select preference" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male Only</SelectItem>
                    <SelectItem value="female">Female Only</SelectItem>
                    <SelectItem value="any">Any Gender</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="mealOptions">Meal Options *</Label>
                <Select
                  value={formData.mealOptions}
                  onValueChange={(value: 'included' | 'optional' | 'not-available') => 
                    setFormData({ ...formData, mealOptions: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select meal option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="included">Meals Included in Rent</SelectItem>
                    <SelectItem value="optional">Meals Available (Extra Cost)</SelectItem>
                    <SelectItem value="not-available">No Meal Service</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="timingRestrictions">Timing Restrictions</Label>
                <Textarea
                  id="timingRestrictions"
                  value={formData.timingRestrictions}
                  onChange={(e) => setFormData({ ...formData, timingRestrictions: e.target.value })}
                  placeholder="e.g., Entry allowed till 10 PM, No visitors after 9 PM"
                  rows={3}
                />
                <p className="text-xs text-muted-foreground">
                  Mention any timing restrictions for guests, entry/exit times, etc.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="houseRules">House Rules</Label>
                <Textarea
                  id="houseRules"
                  value={formData.houseRules}
                  onChange={(e) => setFormData({ ...formData, houseRules: e.target.value })}
                  placeholder="e.g., No smoking, No alcohol, Maintain cleanliness, Respect other residents"
                  rows={4}
                />
                <p className="text-xs text-muted-foreground">
                  List important rules and guidelines for residents
                </p>
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
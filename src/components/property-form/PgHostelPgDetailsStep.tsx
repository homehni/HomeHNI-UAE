import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Cigarette, Users, UserX, Wine, UtensilsCrossed } from 'lucide-react';

interface PgHostelPgDetails {
  genderPreference: 'male' | 'female' | 'anyone';
  preferredGuests: 'student' | 'working' | 'any';
  availableFrom: string;
  foodIncluded: 'yes' | 'no';
  rules: {
    noSmoking: boolean;
    noGuardiansStay: boolean;
    noGirlsEntry: boolean;
    noDrinking: boolean;
    noNonVeg: boolean;
  };
  gateClosingTime: string;
  description: string;
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
    genderPreference: 'anyone',
    preferredGuests: 'any',
    availableFrom: '',
    foodIncluded: 'no',
    rules: {
      noSmoking: false,
      noGuardiansStay: false,
      noGirlsEntry: false,
      noDrinking: false,
      noNonVeg: false,
    },
    gateClosingTime: '',
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
    return true;
  };

  const handleRuleChange = (rule: keyof typeof formData.rules, checked: boolean) => {
    setFormData({
      ...formData,
      rules: {
        ...formData.rules,
        [rule]: checked,
      },
    });
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
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="genderPreference">Place is available for</Label>
                <Select
                  value={formData.genderPreference}
                  onValueChange={(value: 'male' | 'female' | 'anyone') => 
                    setFormData({ ...formData, genderPreference: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select preference" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="anyone">Anyone</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="preferredGuests">Preferred Guests</Label>
                <Select
                  value={formData.preferredGuests}
                  onValueChange={(value: 'student' | 'working' | 'any') => 
                    setFormData({ ...formData, preferredGuests: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select preference" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="student">Student</SelectItem>
                    <SelectItem value="working">Working Professional</SelectItem>
                    <SelectItem value="any">Any</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="availableFrom">Available From</Label>
                <Input
                  id="availableFrom"
                  type="date"
                  value={formData.availableFrom}
                  onChange={(e) => setFormData({ ...formData, availableFrom: e.target.value })}
                  placeholder="15/08/2025"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="foodIncluded">Food Included</Label>
                <Select
                  value={formData.foodIncluded}
                  onValueChange={(value: 'yes' | 'no') => 
                    setFormData({ ...formData, foodIncluded: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">Yes</SelectItem>
                    <SelectItem value="no">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label className="text-base font-medium">PG/Hostel Rules</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="noSmoking"
                      checked={formData.rules.noSmoking}
                      onCheckedChange={(checked) => 
                        handleRuleChange('noSmoking', checked as boolean)
                      }
                    />
                    <div className="flex items-center space-x-2">
                      <Cigarette className="w-4 h-4 text-muted-foreground" />
                      <Label htmlFor="noSmoking" className="text-sm">No Smoking</Label>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="noGuardiansStay"
                      checked={formData.rules.noGuardiansStay}
                      onCheckedChange={(checked) => 
                        handleRuleChange('noGuardiansStay', checked as boolean)
                      }
                    />
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      <Label htmlFor="noGuardiansStay" className="text-sm">No Guardians Stay</Label>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="noGirlsEntry"
                      checked={formData.rules.noGirlsEntry}
                      onCheckedChange={(checked) => 
                        handleRuleChange('noGirlsEntry', checked as boolean)
                      }
                    />
                    <div className="flex items-center space-x-2">
                      <UserX className="w-4 h-4 text-muted-foreground" />
                      <Label htmlFor="noGirlsEntry" className="text-sm">No Girl's Entry</Label>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="noDrinking"
                      checked={formData.rules.noDrinking}
                      onCheckedChange={(checked) => 
                        handleRuleChange('noDrinking', checked as boolean)
                      }
                    />
                    <div className="flex items-center space-x-2">
                      <Wine className="w-4 h-4 text-muted-foreground" />
                      <Label htmlFor="noDrinking" className="text-sm">No Drinking</Label>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 md:col-span-2">
                    <Checkbox
                      id="noNonVeg"
                      checked={formData.rules.noNonVeg}
                      onCheckedChange={(checked) => 
                        handleRuleChange('noNonVeg', checked as boolean)
                      }
                    />
                    <div className="flex items-center space-x-2">
                      <UtensilsCrossed className="w-4 h-4 text-muted-foreground" />
                      <Label htmlFor="noNonVeg" className="text-sm">No Non-Veg</Label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="gateClosingTime">Gate Closing Time</Label>
                <Input
                  id="gateClosingTime"
                  type="time"
                  value={formData.gateClosingTime}
                  onChange={(e) => setFormData({ ...formData, gateClosingTime: e.target.value })}
                  placeholder="22:00"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Provide additional details about your PG/Hostel..."
                  rows={4}
                />
              </div>
            </div>

            <div className="flex justify-between pt-6">
              <Button type="button" variant="outline" onClick={onBack}>
                Back
              </Button>
              <Button type="submit">
                Save & Continue
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
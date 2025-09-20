import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Cigarette, Users, UserX, Wine, UtensilsCrossed, CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format, addMonths } from 'date-fns';

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
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto p-8">
        <div className="text-left mb-8">
          <h1 className="text-2xl font-semibold text-primary mb-2">
            PG Details
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Gender Preference */}
          <div className="space-y-4">
            <Label className="text-base font-medium">Gender Preference</Label>
            <div className="flex gap-4">
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="male"
                  name="genderPreference"
                  value="male"
                  checked={formData.genderPreference === 'male'}
                  onChange={(e) => setFormData({ ...formData, genderPreference: e.target.value as 'male' | 'female' | 'anyone' })}
                  className="w-4 h-4 text-primary"
                />
                <Label htmlFor="male" className="text-base cursor-pointer">Male</Label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="female"
                  name="genderPreference"
                  value="female"
                  checked={formData.genderPreference === 'female'}
                  onChange={(e) => setFormData({ ...formData, genderPreference: e.target.value as 'male' | 'female' | 'anyone' })}
                  className="w-4 h-4 text-primary"
                />
                <Label htmlFor="female" className="text-base cursor-pointer">Female</Label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="anyone"
                  name="genderPreference"
                  value="anyone"
                  checked={formData.genderPreference === 'anyone'}
                  onChange={(e) => setFormData({ ...formData, genderPreference: e.target.value as 'male' | 'female' | 'anyone' })}
                  className="w-4 h-4 text-primary"
                />
                <Label htmlFor="anyone" className="text-base cursor-pointer">Anyone</Label>
              </div>
            </div>
          </div>

          {/* Preferred Guests */}
          <div className="space-y-2">
            <Label htmlFor="preferredGuests" className="text-base font-medium">Preferred Guests*</Label>
            <Select
              value={formData.preferredGuests}
              onValueChange={(value: 'student' | 'working' | 'any') => 
                setFormData({ ...formData, preferredGuests: value })
              }
            >
              <SelectTrigger className="h-12">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="working">Working Professional</SelectItem>
                <SelectItem value="student">Student</SelectItem>
                <SelectItem value="any">Both</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Available From */}
          <div className="space-y-2">
            <Label htmlFor="availableFrom" className="text-base font-medium">Available From</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "h-12 w-full justify-start text-left font-normal",
                    !formData.availableFrom && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.availableFrom ? (
                    format(new Date(formData.availableFrom), "dd/MM/yyyy")
                  ) : (
                    <span>dd/mm/yyyy</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-white border shadow-lg z-50" align="start">
                <Calendar
                  mode="single"
                  selected={formData.availableFrom ? new Date(formData.availableFrom) : undefined}
                  onSelect={(date) => {
                    setFormData({ 
                      ...formData, 
                      availableFrom: date ? format(date, "yyyy-MM-dd") : "" 
                    });
                  }}
                  disabled={(date) => {
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    const maxDate = addMonths(today, 2);
                    return date < today || date > maxDate;
                  }}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Rules */}
          <div className="space-y-4">
            <Label className="text-base font-medium">Rules</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <Checkbox
                  id="noSmoking"
                  checked={formData.rules.noSmoking}
                  onCheckedChange={(checked) => handleRuleChange('noSmoking', checked as boolean)}
                />
                <div className="flex items-center space-x-2">
                  <Cigarette className="w-4 h-4 text-muted-foreground" />
                  <Label htmlFor="noSmoking" className="text-sm">No Smoking</Label>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Checkbox
                  id="noGuardiansStay"
                  checked={formData.rules.noGuardiansStay}
                  onCheckedChange={(checked) => handleRuleChange('noGuardiansStay', checked as boolean)}
                />
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <Label htmlFor="noGuardiansStay" className="text-sm">No Guardians Stay</Label>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Checkbox
                  id="noGirlsEntry"
                  checked={formData.rules.noGirlsEntry}
                  onCheckedChange={(checked) => handleRuleChange('noGirlsEntry', checked as boolean)}
                />
                <div className="flex items-center space-x-2">
                  <UserX className="w-4 h-4 text-muted-foreground" />
                  <Label htmlFor="noGirlsEntry" className="text-sm">No Girl's Entry</Label>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Checkbox
                  id="noDrinking"
                  checked={formData.rules.noDrinking}
                  onCheckedChange={(checked) => handleRuleChange('noDrinking', checked as boolean)}
                />
                <div className="flex items-center space-x-2">
                  <Wine className="w-4 h-4 text-muted-foreground" />
                  <Label htmlFor="noDrinking" className="text-sm">No Drinking</Label>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Checkbox
                  id="noNonVeg"
                  checked={formData.rules.noNonVeg}
                  onCheckedChange={(checked) => handleRuleChange('noNonVeg', checked as boolean)}
                />
                <div className="flex items-center space-x-2">
                  <UtensilsCrossed className="w-4 h-4 text-muted-foreground" />
                  <Label htmlFor="noNonVeg" className="text-sm">No Non-Veg</Label>
                </div>
              </div>
            </div>
          </div>

          {/* Gate Closing Time */}
          <div className="space-y-2">
            <Label htmlFor="gateClosingTime" className="text-base font-medium">Gate Closing Time</Label>
            <Input
              id="gateClosingTime"
              type="time"
              value={formData.gateClosingTime}
              onChange={(e) => setFormData({ ...formData, gateClosingTime: e.target.value })}
              placeholder="Gate Closing Time"
              className="h-12"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-base font-medium">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Write a few lines about your property something which is special and makes your property stand out. Please do not mention your contact details in any format"
              rows={4}
              className="resize-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between pt-6">
            <Button type="button" variant="outline" onClick={onBack} className="px-8">
              Back
            </Button>
            <Button type="submit" className="px-8">
              Save & Continue
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
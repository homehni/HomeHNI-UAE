import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';

interface PgHostelSchedule {
  availability: 'everyday' | 'weekday' | 'weekend';
  startTime?: string;
  endTime?: string;
  availableAllDay?: boolean;
  contactPersonName: string;
  contactNumber: string;
  bestTimeToCall: string;
}

interface PgHostelScheduleStepProps {
  initialData?: Partial<PgHostelSchedule>;
  onNext: (data: PgHostelSchedule) => void;
  onBack: () => void;
  currentStep: number;
  totalSteps: number;
}

export function PgHostelScheduleStep({ 
  initialData, 
  onNext, 
  onBack, 
  currentStep, 
  totalSteps 
}: PgHostelScheduleStepProps) {
  const [formData, setFormData] = useState<PgHostelSchedule>({
    availability: 'everyday',
    startTime: '09:00',
    endTime: '18:00',
    availableAllDay: false,
    contactPersonName: '',
    contactNumber: '',
    bestTimeToCall: 'anytime',
    ...initialData,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid()) {
      onNext(formData);
    }
  };

  const isFormValid = () => {
    return formData.availability && 
           formData.contactPersonName && 
           formData.contactNumber &&
           (formData.availableAllDay || (formData.startTime && formData.endTime));
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-2">Schedule & Contact</h2>
        <p className="text-muted-foreground">When can interested visitors contact you?</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Availability Schedule</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="availability">Available Days *</Label>
                <Select
                  value={formData.availability}
                  onValueChange={(value: 'everyday' | 'weekday' | 'weekend') => 
                    setFormData({ ...formData, availability: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select availability" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="everyday">Everyday</SelectItem>
                    <SelectItem value="weekday">Weekdays Only</SelectItem>
                    <SelectItem value="weekend">Weekends Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="availableAllDay"
                  checked={formData.availableAllDay}
                  onCheckedChange={(checked) => 
                    setFormData({ ...formData, availableAllDay: checked as boolean })
                  }
                />
                <Label htmlFor="availableAllDay" className="text-sm">
                  Available all day
                </Label>
              </div>

              {!formData.availableAllDay && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startTime">Start Time *</Label>
                    <Input
                      id="startTime"
                      type="time"
                      value={formData.startTime}
                      onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                      required={!formData.availableAllDay}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="endTime">End Time *</Label>
                    <Input
                      id="endTime"
                      type="time"
                      value={formData.endTime}
                      onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                      required={!formData.availableAllDay}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium text-foreground">Contact Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contactPersonName">Contact Person Name *</Label>
                  <Input
                    id="contactPersonName"
                    value={formData.contactPersonName}
                    onChange={(e) => setFormData({ ...formData, contactPersonName: e.target.value })}
                    placeholder="Enter contact person name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contactNumber">Contact Number *</Label>
                  <Input
                    id="contactNumber"
                    value={formData.contactNumber}
                    onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                    placeholder="Enter contact number"
                    required
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="bestTimeToCall">Best Time to Call</Label>
                  <Select
                    value={formData.bestTimeToCall}
                    onValueChange={(value) => setFormData({ ...formData, bestTimeToCall: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select best time" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="anytime">Anytime</SelectItem>
                      <SelectItem value="morning">Morning (9 AM - 12 PM)</SelectItem>
                      <SelectItem value="afternoon">Afternoon (12 PM - 5 PM)</SelectItem>
                      <SelectItem value="evening">Evening (5 PM - 8 PM)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="text-sm font-medium text-green-900 mb-2">Almost Done!</h4>
              <p className="text-xs text-green-700">
                You're one step away from listing your PG/Hostel. Review all details in the next step.
              </p>
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
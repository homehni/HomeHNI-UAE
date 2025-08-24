import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface PgHostelOwnerInfo {
  fullName: string;
  phoneNumber: string;
  email: string;
  role: 'Owner' | 'Agent' | 'Builder' | 'Tenant';
  city: string;
  whatsappUpdates: boolean;
}

interface PgHostelOwnerInfoStepProps {
  initialData?: Partial<PgHostelOwnerInfo>;
  onNext: (data: PgHostelOwnerInfo) => void;
  currentStep: number;
  totalSteps: number;
}

export function PgHostelOwnerInfoStep({ 
  initialData, 
  onNext, 
  currentStep, 
  totalSteps 
}: PgHostelOwnerInfoStepProps) {
  const [formData, setFormData] = useState<PgHostelOwnerInfo>({
    fullName: '',
    phoneNumber: '',
    email: '',
    role: 'Owner',
    city: '',
    whatsappUpdates: true,
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

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-2">Owner Information</h2>
        <p className="text-muted-foreground">Tell us about yourself</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Personal Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="Enter your full name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input
                  id="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                  placeholder="Enter your phone number"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Enter your email"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">You are</Label>
                <Select
                  value={formData.role}
                  onValueChange={(value: 'Owner' | 'Agent' | 'Builder' | 'Tenant') => 
                    setFormData({ ...formData, role: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Owner">Owner</SelectItem>
                    <SelectItem value="Agent">Agent</SelectItem>
                    <SelectItem value="Builder">Builder</SelectItem>
                    <SelectItem value="Tenant">Tenant</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  placeholder="Enter your city"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2 pt-4">
              <Checkbox
                id="whatsappUpdates"
                checked={formData.whatsappUpdates}
                onCheckedChange={(checked) => 
                  setFormData({ ...formData, whatsappUpdates: checked as boolean })
                }
              />
              <Label htmlFor="whatsappUpdates" className="text-sm">
                Get updates and property related tips on WhatsApp
              </Label>
            </div>

            <div className="flex justify-end pt-6">
              <Button 
                type="submit" 
                disabled={!isFormValid()}
                className="px-8"
              >
                Save & Continue
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
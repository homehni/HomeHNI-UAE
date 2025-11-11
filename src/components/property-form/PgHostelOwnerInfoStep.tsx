import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useProfile } from '@/hooks/useProfile';
import { useAuth } from '@/contexts/AuthContext';

interface PgHostelOwnerInfo {
  fullName: string;
  phoneNumber: string;
  email: string;
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
  const { user } = useAuth();
  const { profile } = useProfile();
  
  const [formData, setFormData] = useState<PgHostelOwnerInfo>({
    fullName: '',
    phoneNumber: '',
    email: '',
    city: '',
    whatsappUpdates: true,
    ...initialData,
  });

  // Auto-fill form with user profile data
  useEffect(() => {
    if (profile && !initialData) {
      setFormData(prev => ({
        ...prev,
        fullName: profile.full_name || prev.fullName,
        email: user?.email || prev.email,
      }));
    }
  }, [profile, user, initialData]);

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
        <h2 className="text-2xl font-semibold text-foreground mb-2">Owner Information</h2>
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

            {/* Action Buttons - Removed, using only sticky buttons */}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

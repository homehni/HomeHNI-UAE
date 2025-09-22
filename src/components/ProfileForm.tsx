import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/useProfile';
import { Shield, MapPin, Bell, MessageCircle, Check } from 'lucide-react';
import { PasswordChangeCard } from '@/components/PasswordChangeCard';

interface ProfileFormData {
  full_name: string;
  phone: string;
  bio: string;
  city: string;
  state: string;
  country: string;
  whatsapp_opted_in: boolean;
  email_notifications: boolean;
}

export const ProfileForm: React.FC = () => {
  const { user } = useAuth();
  const { profile, updating, updateProfile, changeRole } = useProfile();
  const [isChangingRole, setIsChangingRole] = useState(false);

  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<ProfileFormData>();

  // Update form when profile loads
  useEffect(() => {
    if (profile) {
      reset({
        full_name: profile.full_name || '',
        phone: profile.phone || '',
        bio: profile.bio || '',
        city: profile.location?.city || '',
        state: profile.location?.state || '',
        country: profile.location?.country || 'India',
        whatsapp_opted_in: profile.whatsapp_opted_in || false,
        email_notifications: profile.email_notifications !== false,
      });
    }
  }, [profile, reset]);

  const watchedValues = watch();

  const onSubmit = async (data: ProfileFormData) => {
    await updateProfile({
      full_name: data.full_name,
      phone: data.phone,
      bio: data.bio,
      location: {
        city: data.city,
        state: data.state,
        country: data.country,
      },
      whatsapp_opted_in: data.whatsapp_opted_in,
      email_notifications: data.email_notifications,
    });
  };

  const handleRoleChange = async (newRole: 'buyer' | 'seller') => {
    setIsChangingRole(true);
    await changeRole(newRole);
    setIsChangingRole(false);
  };

  if (!profile) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Role Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Account Type</CardTitle>
          <CardDescription>
            Change your account type based on your primary use of HomeHNI
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            <Button
              variant={profile.role === 'buyer' ? 'default' : 'outline'}
              onClick={() => handleRoleChange('buyer')}
              disabled={isChangingRole || profile.role === 'buyer'}
            >
              Property Seeker
            </Button>
            <Button
              variant={profile.role === 'seller' ? 'default' : 'outline'}
              onClick={() => handleRoleChange('seller')}
              disabled={isChangingRole || profile.role === 'seller'}
            >
              Property Owner
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Profile Details Form */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>
            Update your personal information and preferences
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Name Field */}
            <div className="space-y-2">
              <Label htmlFor="full_name" className="text-sm font-medium">Name</Label>
              <Input
                id="full_name"
                {...register('full_name', { required: 'Full name is required' })}
                className="w-full"
              />
              {errors.full_name && (
                <p className="text-sm text-red-600">{errors.full_name.message}</p>
              )}
            </div>

            {/* Email Address Field (Readonly with checkmark) */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Email Address</Label>
              <div className="relative">
                <Input
                  value={user?.email || ''}
                  readOnly
                  className="w-full bg-gray-50 cursor-not-allowed pr-10"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <Check className="h-5 w-5 text-green-600" />
                </div>
              </div>
            </div>

            {/* Mobile Phone Field (with checkmark) */}
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-medium">Mobile Phone</Label>
              <div className="relative">
                <Input
                  id="phone"
                  type="tel"
                  {...register('phone')}
                  placeholder="Enter your phone number"
                  className="w-full pr-10"
                />
                {watchedValues.phone && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <Check className="h-5 w-5 text-green-600" />
                  </div>
                )}
              </div>
            </div>

            {/* WhatsApp Toggle */}
            <div className="flex items-center justify-between py-4">
              <div className="flex items-center gap-3">
                <MessageCircle className="h-5 w-5 text-green-600" />
                <Label htmlFor="whatsapp_opted_in" className="text-sm font-medium">
                  Get Updates on WhatsApp
                </Label>
              </div>
              <Switch
                id="whatsapp_opted_in"
                checked={watchedValues.whatsapp_opted_in}
                onCheckedChange={(checked) => setValue('whatsapp_opted_in', checked)}
              />
            </div>

            {/* Save Profile Button */}
            <div className="flex justify-end pt-4">
              <Button 
                type="submit" 
                disabled={updating}
                className="bg-red-500 hover:bg-red-600 text-white px-8"
              >
                {updating ? 'Saving...' : 'Save Profile'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Password Change Section */}
      <PasswordChangeCard />
    </div>
  );
};
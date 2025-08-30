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
import { Shield, MapPin, Bell, MessageCircle } from 'lucide-react';
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
      {/* Profile Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                {profile.full_name || user?.email}
                {profile.verification_status === 'verified' && (
                  <Badge variant="secondary" className="text-green-600">
                    <Shield className="h-3 w-3 mr-1" />
                    Verified
                  </Badge>
                )}
              </CardTitle>
              <CardDescription>{user?.email}</CardDescription>
            </div>
            <div className="text-right">
              <Badge variant="outline" className="mb-2">
                {profile.role?.charAt(0).toUpperCase() + profile.role?.slice(1)}
              </Badge>
              <div className="text-sm text-muted-foreground">
                Member since {new Date(profile.created_at).toLocaleDateString()}
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

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
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="full_name">Full Name</Label>
                <Input
                  id="full_name"
                  {...register('full_name', { required: 'Full name is required' })}
                />
                {errors.full_name && (
                  <p className="text-sm text-red-600">{errors.full_name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  {...register('phone')}
                  placeholder="+91 98765 43210"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                {...register('bio')}
                placeholder="Tell us about yourself..."
                rows={3}
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <Label>Location</Label>
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    {...register('city')}
                    placeholder="Mumbai"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    {...register('state')}
                    placeholder="Maharashtra"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Select
                    value={watchedValues.country}
                    onValueChange={(value) => setValue('country', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="India">India</SelectItem>
                      <SelectItem value="UAE">UAE</SelectItem>
                      <SelectItem value="USA">USA</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <Label className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                Communication Preferences
              </Label>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="email_notifications">Email Notifications</Label>
                    <div className="text-sm text-muted-foreground">
                      Receive property alerts and updates via email
                    </div>
                  </div>
                  <Switch
                    id="email_notifications"
                    checked={watchedValues.email_notifications}
                    onCheckedChange={(checked) => setValue('email_notifications', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="whatsapp_opted_in" className="flex items-center gap-2">
                      <MessageCircle className="h-4 w-4 text-green-600" />
                      WhatsApp Updates
                    </Label>
                    <div className="text-sm text-muted-foreground">
                      Get instant property notifications on WhatsApp
                    </div>
                  </div>
                  <Switch
                    id="whatsapp_opted_in"
                    checked={watchedValues.whatsapp_opted_in}
                    onCheckedChange={(checked) => setValue('whatsapp_opted_in', checked)}
                  />
                </div>
              </div>
            </div>

            <Button type="submit" disabled={updating} className="w-full">
              {updating ? 'Updating...' : 'Save Changes'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Password Change Section */}
      <PasswordChangeCard />
    </div>
  );
};
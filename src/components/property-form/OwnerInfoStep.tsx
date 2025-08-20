import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ownerInfoSchema, OwnerInfoFormData } from '@/schemas/propertyValidation';
import { OwnerInfo } from '@/types/property';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { MessageCircle } from 'lucide-react';

interface OwnerInfoStepProps {
  initialData: Partial<OwnerInfo>;
  onNext: (data: OwnerInfo) => void;
}

export const OwnerInfoStep: React.FC<OwnerInfoStepProps> = ({
  initialData,
  onNext
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    trigger,
    getValues,
    formState: { errors, touchedFields }
  } = useForm<OwnerInfoFormData>({
    resolver: zodResolver(ownerInfoSchema),
    defaultValues: {
      whatsappUpdates: false,
      propertyType: 'Residential',
      ...initialData,
    },
    mode: 'onTouched' // Only show errors after user interaction
  });

  const selectedRole = watch('role');
  const selectedPropertyType = watch('propertyType');
  const selectedListingType = watch('listingType');
  const whatsappUpdates = watch('whatsappUpdates');
  const formValues = watch();

  // Get available listing types based on property type
  const getListingTypes = () => {
    switch (selectedPropertyType) {
      case 'Commercial':
        return ['Rent', 'Sale'];
      case 'Land/Plot':
        return ['Resale'];
      default: // Residential
        return ['Rent', 'Resale', 'PG/Hostel', 'Flatmates'];
    }
  };

  // Reset listing type when property type changes
  useEffect(() => {
    const availableTypes = getListingTypes();
    if (selectedListingType && !availableTypes.includes(selectedListingType)) {
      setValue('listingType', undefined);
      trigger('listingType');
    }
  }, [selectedPropertyType, selectedListingType, setValue, trigger]);

  // Update form values when initialData changes
  useEffect(() => {
    if (initialData.role && initialData.role !== watch('role')) {
      setValue('role', initialData.role);
      trigger('role');
    }
  }, [initialData.role, setValue, trigger, watch]);

  // Auto-fill detection and validation
  useEffect(() => {
    const detectAutoFill = () => {
      trigger(); // Trigger validation after potential auto-fill
    };

    const timer = setTimeout(detectAutoFill, 100);
    return () => clearTimeout(timer);
  }, [trigger]);

  // Custom validation check for button state
  const isFormValid = () => {
    const values = getValues();
    return !!(values.phoneNumber && values.role && 
             values.city && values.propertyType && values.listingType);
  };

  const handleBlur = () => {
    trigger(); // Validate on blur to catch auto-filled values
  };

  const onSubmit = (data: OwnerInfoFormData) => {
    onNext(data as OwnerInfo);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto border-2 border-brand-red/20 shadow-lg bg-gradient-to-br from-background to-muted/20">
      <CardHeader className="pb-6">
        <CardTitle className="text-center text-brand-red text-2xl font-bold">
          Start Posting Your Ad For FREE
        </CardTitle>
      </CardHeader>
      <CardContent className="px-8 pb-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Personal Information Section */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-foreground">Personal Information</h3>
            

            {/* Mobile Number and City Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Mobile Number *</Label>
                <div className="flex gap-2">
                  <Select defaultValue="+91">
                    <SelectTrigger className="w-20 h-12 rounded-xl border-2 border-brand-red/30 focus:border-brand-red focus:ring-2 focus:ring-brand-red/20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="+91">+91</SelectItem>
                      <SelectItem value="+1">+1</SelectItem>
                      <SelectItem value="+44">+44</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    id="phoneNumber"
                    type="tel"
                    {...register('phoneNumber')}
                    placeholder="Enter your mobile number"
                    className={`flex-1 h-12 rounded-xl border-2 border-brand-red/30 focus:border-brand-red focus:ring-2 focus:ring-brand-red/20 ${errors.phoneNumber && touchedFields.phoneNumber ? 'border-destructive' : ''}`}
                    onBlur={handleBlur}
                    onInput={handleBlur}
                    autoComplete="tel"
                  />
                </div>
                {errors.phoneNumber && touchedFields.phoneNumber && (
                  <p className="text-sm text-destructive">{errors.phoneNumber.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>City *</Label>
                <Select 
                  value={watch('city')} 
                  onValueChange={(value) => setValue('city', value)}
                >
                  <SelectTrigger className={`h-12 rounded-xl border-2 border-brand-red/30 focus:border-brand-red focus:ring-2 focus:ring-brand-red/20 ${errors.city && touchedFields.city ? 'border-destructive' : ''}`}>
                    <SelectValue placeholder="Select your city" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mumbai">Mumbai</SelectItem>
                    <SelectItem value="delhi">Delhi</SelectItem>
                    <SelectItem value="bangalore">Bangalore</SelectItem>
                    <SelectItem value="pune">Pune</SelectItem>
                    <SelectItem value="chennai">Chennai</SelectItem>
                    <SelectItem value="kolkata">Kolkata</SelectItem>
                    <SelectItem value="hyderabad">Hyderabad</SelectItem>
                    <SelectItem value="ahmedabad">Ahmedabad</SelectItem>
                  </SelectContent>
                </Select>
                {errors.city && touchedFields.city && (
                  <p className="text-sm text-destructive">{errors.city.message}</p>
                )}
              </div>
            </div>

            {/* WhatsApp Updates Toggle */}
<div className="flex items-center gap-3">
  <Label className="text-base font-medium text-foreground">Get updates on WhatsApp</Label>
  {/* <span className="text-sm font-medium text-foreground">WhatsApp</span> */}
  <Switch
    defaultChecked // ✅ This makes it checked by default
    onCheckedChange={(checked) => setValue('whatsappUpdates', checked)}
  />
            </div>
          </div>

          {/* Property Type Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Property Type</h3>
            <Tabs 
              value={selectedPropertyType} 
              onValueChange={(value) => {
                setValue('propertyType', value as 'Residential' | 'Commercial' | 'Land/Plot');
                trigger('propertyType');
              }}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-3 h-12 bg-muted/30 rounded-xl border-2 border-brand-red/20">
                <TabsTrigger value="Residential" className="rounded-lg data-[state=active]:bg-brand-red data-[state=active]:text-white">Residential</TabsTrigger>
                <TabsTrigger value="Commercial" className="rounded-lg data-[state=active]:bg-brand-red data-[state=active]:text-white">Commercial</TabsTrigger>
                <TabsTrigger value="Land/Plot" className="relative rounded-lg data-[state=active]:bg-brand-red data-[state=active]:text-white">
                  Land/Plot
                  <Badge variant="secondary" className="ml-2 text-xs">New</Badge>
                </TabsTrigger>
              </TabsList>
            </Tabs>
            {errors.propertyType && touchedFields.propertyType && (
              <p className="text-sm text-destructive">{errors.propertyType.message}</p>
            )}
          </div>

          {/* Property Listing Type Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">I want to</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {getListingTypes().map((type) => (
                <Button
                  key={type}
                  type="button"
                  variant={selectedListingType === type ? "default" : "outline"}
                  className={`h-12 rounded-xl border-2 transition-all duration-200 ${
                    selectedListingType === type 
                      ? 'bg-brand-red border-brand-red text-white shadow-lg hover:bg-brand-red/90' 
                      : 'border-brand-red/30 text-brand-red hover:bg-brand-red/10 hover:border-brand-red'
                  }`}
                  onClick={() => {
                    setValue('listingType', type as any);
                    trigger('listingType');
                  }}
                >
                  {type}
                </Button>
              ))}
            </div>
            {errors.listingType && touchedFields.listingType && (
              <p className="text-sm text-destructive">{errors.listingType.message}</p>
            )}
          </div>

          {/* Role Selection */}
          <div className="space-y-3">
            <Label>I am *</Label>
            <div className="w-48">
              <Select 
                value={selectedRole} 
                onValueChange={(value) => {
                  setValue('role', value as 'Owner' | 'Agent' | 'Builder');
                  trigger('role');
                }}
              >
              <SelectTrigger className={`h-12 rounded-xl border-2 border-brand-red/30 focus:border-brand-red focus:ring-2 focus:ring-brand-red/20 ${errors.role ? 'border-destructive' : ''}`}>
                <SelectValue placeholder="Select your role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Owner">Owner</SelectItem>
                <SelectItem value="Agent">Agent</SelectItem>
                <SelectItem value="Builder">Builder</SelectItem>
              </SelectContent>
              </Select>
            </div>
            {errors.role && touchedFields.role && (
              <p className="text-sm text-destructive">{errors.role.message}</p>
            )}
          </div>

          <div className="flex justify-center pt-8">
            <Button
              type="submit"
              disabled={!isFormValid()}
              className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-gray-900 font-bold px-8 py-3 text-lg rounded-xl border-2 border-yellow-400 shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              size="lg"
            >
              Start Posting Your Ad For FREE
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
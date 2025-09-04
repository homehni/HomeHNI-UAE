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
    <div className="relative w-full max-w-4xl mx-auto mb-8">
      {/* Top Left Corner Decoration */}
      <div className="absolute top-0 left-0 w-16 h-16 z-10">
        <div className="w-full h-full border-l-8 border-t-8 border-brand-red"></div>
      </div>
      
      {/* Bottom Right Corner Decoration */}
      <div className="absolute bottom-0 right-0 w-16 h-16 z-10">
        <div className="w-full h-full border-r-8 border-b-8 border-brand-red"></div>
      </div>

      <Card className="w-full border border-muted rounded-2xl shadow-lg bg-card/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-center text-primary text-2xl font-bold">
            {selectedListingType === 'Rent' || !selectedListingType ? 
              'Start Posting Your Property Today – 100% Free' : 
              'Start Posting Your Property For FREE'
            }
          </CardTitle>
        </CardHeader>
      <CardContent>
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
                    <SelectTrigger className="w-20">
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
                    className={`flex-1 ${errors.phoneNumber && touchedFields.phoneNumber ? 'border-destructive' : ''}`}
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
                  <SelectTrigger className={errors.city && touchedFields.city ? 'border-destructive' : ''}>
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
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="Residential">Residential</TabsTrigger>
                <TabsTrigger value="Commercial">Commercial</TabsTrigger>
                <TabsTrigger value="Land/Plot" className="relative">
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
            <h3 className="text-lg font-semibold text-foreground">
              {selectedPropertyType === 'Residential' ? 'I want to' : 'I want to'}
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {getListingTypes().map((type) => {
                let buttonText = type;
                if (type === 'Rent') {
                  buttonText = 'Rent';
                } else if (type === 'PG/Hostel') {
                  buttonText = 'List PG/Hostel';
                } else if (type === 'Flatmates') {
                  buttonText = 'Flatmates';
                }
                
                return (
                  <Button
                    key={type}
                    type="button"
                    variant={selectedListingType === type ? "default" : "outline"}
                    className="h-12 text-xs md:text-sm"
                    onClick={() => {
                      setValue('listingType', type as any);
                      trigger('listingType');
                    }}
                  >
                    {buttonText}
                  </Button>
                );
              })}
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
                  setValue('role', value as 'Owner' | 'Agent' | 'Builder' | 'Tenant');
                  trigger('role');
                }}
              >
              <SelectTrigger className={errors.role ? 'border-destructive' : ''}>
                <SelectValue placeholder={
                  selectedListingType === 'Rent' ? 
                    "Are you Owner or Tenant?" : 
                    "Select your role"
                } />
              </SelectTrigger>
               <SelectContent>
                {selectedListingType === 'Rent' ? (
                  <>
                    <SelectItem value="Owner">Property Owner</SelectItem>
                    <SelectItem value="Tenant">Tenant (Looking for Rental)</SelectItem>
                    <SelectItem value="Agent">Agent</SelectItem>
                  </>
                ) : selectedListingType === 'PG/Hostel' ? (
                  <>
                    <SelectItem value="Tenant">Tenant (In the PG)</SelectItem>
                    <SelectItem value="Owner">Owner (of Building)</SelectItem>
                    <SelectItem value="Agent">Agent</SelectItem>
                  </>
                ) : selectedListingType === 'Flatmates' ? (
                  <>
                    <SelectItem value="Tenant">Tenant</SelectItem>
                    <SelectItem value="Owner">Owner (of the flat)</SelectItem>
                    <SelectItem value="Agent">Agent</SelectItem>
                  </>
                ) : (
                  <>
                    <SelectItem value="Owner">Owner</SelectItem>
                    <SelectItem value="Agent">Agent</SelectItem>
                    <SelectItem value="Builder">Builder</SelectItem>
                  </>
                )}
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
              className="bg-primary hover:bg-primary/90 px-8 py-3 text-lg font-semibold"
              size="lg"
            >
              {selectedListingType === 'Rent' ? 
                (selectedRole === 'Tenant' ? 'Start Finding Your Dream Rental' : 'List Your Property For FREE') :
                'Start Posting Your Property For FREE'
              }
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
    </div>
  );
};
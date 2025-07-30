import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { propertyInfoSchema, PropertyInfoFormData } from '@/schemas/propertyValidation';
import { PropertyInfo } from '@/types/property';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ImageUpload } from './ImageUpload';
import { VideoUpload } from './VideoUpload';

interface PropertyInfoStepProps {
  initialData: Partial<PropertyInfo>;
  onNext: (data: PropertyInfo) => void;
  onBack: () => void;
}

export const PropertyInfoStep: React.FC<PropertyInfoStepProps> = ({
  initialData,
  onNext,
  onBack
}) => {
  const [images, setImages] = useState<File[]>(initialData.images || []);
  const [video, setVideo] = useState<File | undefined>(initialData.video);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    trigger,
    getValues,
    formState: { errors }
  } = useForm<PropertyInfoFormData>({
    resolver: zodResolver(propertyInfoSchema),
    defaultValues: {
      ...initialData,
      bathrooms: initialData.bathrooms || 0,
      balconies: initialData.balconies || 0,
    },
    mode: 'all' // Enable validation on all events
  });

  useEffect(() => {
    setValue('images', images);
    setValue('video', video);
    trigger(); // Re-validate when images/video change
  }, [images, video, setValue, trigger]);

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
    return !!(values.title && values.propertyType && values.listingType && 
             values.superArea && values.expectedPrice && values.state && 
             values.city && values.locality && values.pincode && 
             images.length >= 3);
  };

  const handleBlur = () => {
    trigger(); // Validate on blur to catch auto-filled values
  };

  const onSubmit = (data: PropertyInfoFormData) => {
    onNext({ ...data, images, video } as PropertyInfo);
  };

  const propertyTypes = [
    'Apartment', 'Villa', 'House', 'Plot', 'Commercial', 'Office Space', 'Shop'
  ];

  const bhkTypes = [
    'Studio', '1 RK', '1 BHK', '2 BHK', '3 BHK', '4 BHK', '5+ BHK'
  ];

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-center text-primary">Property Information</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="title">Property Title *</Label>
              <Input
                id="title"
                {...register('title')}
                placeholder="Spacious 2BHK Apartment in Prime Location"
                className={errors.title ? 'border-destructive' : ''}
                onBlur={handleBlur}
                onInput={handleBlur}
              />
              {errors.title && (
                <p className="text-sm text-destructive">{errors.title.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Property Type *</Label>
              <Select onValueChange={(value) => setValue('propertyType', value)}>
                <SelectTrigger className={errors.propertyType ? 'border-destructive' : ''}>
                  <SelectValue placeholder="Select property type" />
                </SelectTrigger>
                <SelectContent>
                  {propertyTypes.map((type) => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.propertyType && (
                <p className="text-sm text-destructive">{errors.propertyType.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Listing Type *</Label>
              <Select onValueChange={(value) => setValue('listingType', value as 'Sale' | 'Rent')}>
                <SelectTrigger className={errors.listingType ? 'border-destructive' : ''}>
                  <SelectValue placeholder="Sale / Rent" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Sale">Sale</SelectItem>
                  <SelectItem value="Rent">Rent</SelectItem>
                </SelectContent>
              </Select>
              {errors.listingType && (
                <p className="text-sm text-destructive">{errors.listingType.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>BHK Type</Label>
              <Select onValueChange={(value) => setValue('bhkType', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select BHK" />
                </SelectTrigger>
                <SelectContent>
                  {bhkTypes.map((bhk) => (
                    <SelectItem key={bhk} value={bhk}>{bhk}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bathrooms">Bathrooms</Label>
              <Input
                id="bathrooms"
                type="number"
                {...register('bathrooms', { valueAsNumber: true })}
                placeholder="No. of bathrooms"
                min="0"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="balconies">Balconies</Label>
              <Input
                id="balconies"
                type="number"
                {...register('balconies', { valueAsNumber: true })}
                placeholder="No. of balconies"
                min="0"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="superArea">Super Built-up Area (sqft) *</Label>
              <Input
                id="superArea"
                type="number"
                {...register('superArea', { valueAsNumber: true })}
                placeholder="e.g., 1200"
                className={errors.superArea ? 'border-destructive' : ''}
                onBlur={handleBlur}
                onInput={handleBlur}
              />
              {errors.superArea && (
                <p className="text-sm text-destructive">{errors.superArea.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="carpetArea">Carpet Area (sqft)</Label>
              <Input
                id="carpetArea"
                type="number"
                {...register('carpetArea', { valueAsNumber: true })}
                placeholder="e.g., 1000"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="expectedPrice">Expected Price (₹) *</Label>
              <Input
                id="expectedPrice"
                type="number"
                {...register('expectedPrice', { valueAsNumber: true })}
                placeholder="e.g., 5000000"
                className={errors.expectedPrice ? 'border-destructive' : ''}
                onBlur={handleBlur}
                onInput={handleBlur}
              />
              {errors.expectedPrice && (
                <p className="text-sm text-destructive">{errors.expectedPrice.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="state">State *</Label>
              <Input
                id="state"
                {...register('state')}
                placeholder="e.g., Maharashtra"
                className={errors.state ? 'border-destructive' : ''}
                onBlur={handleBlur}
                onInput={handleBlur}
                autoComplete="address-level1"
              />
              {errors.state && (
                <p className="text-sm text-destructive">{errors.state.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="city">City *</Label>
              <Input
                id="city"
                {...register('city')}
                placeholder="e.g., Mumbai"
                className={errors.city ? 'border-destructive' : ''}
                onBlur={handleBlur}
                onInput={handleBlur}
                autoComplete="address-level2"
              />
              {errors.city && (
                <p className="text-sm text-destructive">{errors.city.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="locality">Locality *</Label>
              <Input
                id="locality"
                {...register('locality')}
                placeholder="e.g., Bandra West"
                className={errors.locality ? 'border-destructive' : ''}
                onBlur={handleBlur}
                onInput={handleBlur}
                autoComplete="address-level3"
              />
              {errors.locality && (
                <p className="text-sm text-destructive">{errors.locality.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="pincode">Pincode *</Label>
              <Input
                id="pincode"
                {...register('pincode')}
                placeholder="e.g., 400050"
                className={errors.pincode ? 'border-destructive' : ''}
                onBlur={handleBlur}
                onInput={handleBlur}
                autoComplete="postal-code"
              />
              {errors.pincode && (
                <p className="text-sm text-destructive">{errors.pincode.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Property Description</Label>
            <Textarea
              id="description"
              {...register('description')}
              placeholder="Describe your property in detail..."
              rows={4}
            />
          </div>

          <div className="space-y-4">
            <ImageUpload
              images={images}
              onImagesChange={setImages}
              maxImages={10}
              minImages={3}
            />
            {errors.images && (
              <p className="text-sm text-destructive">{errors.images.message}</p>
            )}
          </div>

          <VideoUpload video={video} onVideoChange={setVideo} />

          <div className="flex justify-between pt-6">
            <Button type="button" variant="outline" onClick={onBack}>
              Back
            </Button>
            <Button
              type="submit"
              disabled={!isFormValid()}
              className="bg-primary hover:bg-primary/90"
            >
              Next
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
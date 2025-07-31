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
  const [statesData, setStatesData] = useState<Record<string, string[]>>({});
  const [availableCities, setAvailableCities] = useState<string[]>([]);
  const [selectedState, setSelectedState] = useState<string>(initialData.state || '');
  const [selectedCity, setSelectedCity] = useState<string>(initialData.city || '');

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    trigger,
    getValues,
    formState: { errors, touchedFields }
  } = useForm<PropertyInfoFormData>({
    resolver: zodResolver(propertyInfoSchema),
    defaultValues: {
      ...initialData,
      bathrooms: initialData.bathrooms || 0,
      balconies: initialData.balconies || 0,
    },
    mode: 'onTouched' // Only show errors after user interaction
  });

  // Load states and cities data
  useEffect(() => {
    const loadStatesData = async () => {
      try {
        const response = await fetch('/data/india_states_cities.json');
        const data = await response.json();
        setStatesData(data);
        
        // If initial state is provided, load its cities
        if (initialData.state && data[initialData.state]) {
          setAvailableCities(data[initialData.state]);
        }
      } catch (error) {
        console.error('Failed to load states data:', error);
      }
    };
    
    loadStatesData();
  }, [initialData.state]);

  useEffect(() => {
    setValue('images', images);
    setValue('video', video);
    setValue('state', selectedState);
    setValue('city', selectedCity);
    trigger(); // Re-validate when images/video change
  }, [images, video, selectedState, selectedCity, setValue, trigger]);

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
    return !!(values.title && values.title.length >= 10 && values.propertyType && values.listingType && 
             values.superArea && values.expectedPrice && values.state && 
             values.city && values.locality && values.pincode && 
             images.length >= 3);
  };

  // Comprehensive validation messages
  const getAllValidationErrors = () => {
    const values = getValues();
    const allErrors: string[] = [];

    // Title validation
    if (!values.title) {
      allErrors.push('Property title is required');
    } else if (values.title.length < 10) {
      allErrors.push('Title must be at least 10 characters long');
    }

    // Property type validation
    if (!values.propertyType) {
      allErrors.push('Please select a property type');
    }

    // Listing type validation
    if (!values.listingType) {
      allErrors.push('Please select listing type (Sale or Rent)');
    }

    // Area validation
    if (!values.superArea) {
      allErrors.push('Super built-up area is required');
    } else if (values.superArea <= 0) {
      allErrors.push('Super built-up area must be greater than 0');
    }

    // Price validation
    if (!values.expectedPrice) {
      allErrors.push('Expected price is required');
    } else if (values.expectedPrice <= 0) {
      allErrors.push('Expected price must be greater than 0');
    }

    // Location validation
    if (!values.state) {
      allErrors.push('State is required');
    }
    if (!values.city) {
      allErrors.push('City is required');
    }
    if (!values.locality) {
      allErrors.push('Locality is required');
    }
    if (!values.pincode) {
      allErrors.push('Pincode is required');
    }

    // Images validation
    if (images.length < 3) {
      allErrors.push('Please upload at least 3 property images');
    }

    return allErrors;
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
                className={errors.title && touchedFields.title ? 'border-destructive' : ''}
                onBlur={handleBlur}
                onInput={handleBlur}
              />
            {errors.title && touchedFields.title && (
              <p className="text-sm text-destructive">{errors.title.message}</p>
            )}
            </div>

            <div className="space-y-2">
              <Label>Property Type *</Label>
              <Select onValueChange={(value) => setValue('propertyType', value)}>
                <SelectTrigger className={errors.propertyType && touchedFields.propertyType ? 'border-destructive' : ''}>
                  <SelectValue placeholder="Select property type" />
                </SelectTrigger>
                <SelectContent>
                  {propertyTypes.map((type) => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            {errors.propertyType && touchedFields.propertyType && (
              <p className="text-sm text-destructive">{errors.propertyType.message}</p>
            )}
            </div>

            <div className="space-y-2">
              <Label>Listing Type *</Label>
              <Select onValueChange={(value) => setValue('listingType', value as 'Sale' | 'Rent')}>
                <SelectTrigger className={errors.listingType && touchedFields.listingType ? 'border-destructive' : ''}>
                  <SelectValue placeholder="Sale / Rent" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Sale">Sale</SelectItem>
                  <SelectItem value="Rent">Rent</SelectItem>
                </SelectContent>
              </Select>
            {errors.listingType && touchedFields.listingType && (
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
                className={errors.superArea && touchedFields.superArea ? 'border-destructive' : ''}
                onBlur={handleBlur}
                onInput={handleBlur}
              />
              {errors.superArea && touchedFields.superArea && (
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
                className={errors.expectedPrice && touchedFields.expectedPrice ? 'border-destructive' : ''}
                onBlur={handleBlur}
                onInput={handleBlur}
              />
              {errors.expectedPrice && touchedFields.expectedPrice && (
                <p className="text-sm text-destructive">{errors.expectedPrice.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>State *</Label>
              <Select 
                value={selectedState} 
                onValueChange={(value) => {
                  setSelectedState(value);
                  setSelectedCity(''); // Reset city when state changes
                  setAvailableCities(statesData[value] || []);
                }}
              >
                <SelectTrigger className={errors.state && touchedFields.state ? 'border-destructive' : ''}>
                  <SelectValue placeholder="— Select State —" />
                </SelectTrigger>
                <SelectContent className="bg-background border border-border shadow-lg z-50 max-h-60 overflow-y-auto">
                  {Object.keys(statesData).sort().map((state) => (
                    <SelectItem key={state} value={state} className="hover:bg-accent hover:text-accent-foreground">
                      {state}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.state && touchedFields.state && (
                <p className="text-sm text-destructive">{errors.state.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>City *</Label>
              <Select 
                value={selectedCity} 
                onValueChange={setSelectedCity}
                disabled={!selectedState || availableCities.length === 0}
              >
                <SelectTrigger className={errors.city && touchedFields.city ? 'border-destructive' : ''}>
                  <SelectValue placeholder={selectedState ? "— Select City —" : "Select state first"} />
                </SelectTrigger>
                <SelectContent className="bg-background border border-border shadow-lg z-50 max-h-60 overflow-y-auto">
                  {availableCities.map((city) => (
                    <SelectItem key={city} value={city} className="hover:bg-accent hover:text-accent-foreground">
                      {city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.city && touchedFields.city && (
                <p className="text-sm text-destructive">{errors.city.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="locality">Locality *</Label>
              <Input
                id="locality"
                {...register('locality')}
                placeholder="e.g., Bandra West"
                className={errors.locality && touchedFields.locality ? 'border-destructive' : ''}
                onBlur={handleBlur}
                onInput={handleBlur}
                autoComplete="address-level3"
              />
              {errors.locality && touchedFields.locality && (
                <p className="text-sm text-destructive">{errors.locality.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="pincode">Pincode *</Label>
              <Input
                id="pincode"
                {...register('pincode')}
                placeholder="e.g., 400050"
                className={errors.pincode && touchedFields.pincode ? 'border-destructive' : ''}
                onBlur={handleBlur}
                onInput={handleBlur}
                autoComplete="postal-code"
              />
              {errors.pincode && touchedFields.pincode && (
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
            {errors.images && touchedFields.images && (
              <p className="text-sm text-destructive">{errors.images.message}</p>
            )}
          </div>

          <VideoUpload video={video} onVideoChange={setVideo} />

          {/* Comprehensive validation errors */}
          {getAllValidationErrors().length > 0 && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
              <h4 className="text-sm font-medium text-destructive mb-2">Please fix the following issues:</h4>
              <ul className="space-y-1">
                {getAllValidationErrors().map((error, index) => (
                  <li key={index} className="text-sm text-destructive flex items-center gap-2">
                    <span className="w-1 h-1 bg-destructive rounded-full"></span>
                    {error}
                  </li>
                ))}
              </ul>
            </div>
          )}

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
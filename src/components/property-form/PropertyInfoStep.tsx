import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ImageUploadComponent } from './ImageUploadComponent';
import { VideoUploadComponent } from './VideoUploadComponent';
import { PropertyDraft } from '@/types/propertyDraft';
import { ArrowLeft } from 'lucide-react';

const propertyInfoSchema = z.object({
  title: z.string().min(1, 'Property title is required'),
  property_type: z.string().min(1, 'Property type is required'),
  listing_type: z.enum(['sale', 'rent']),
  bhk_type: z.string().optional(),
  bathrooms: z.number().min(0).optional(),
  balconies: z.number().min(0).optional(),
  super_area: z.number().min(1, 'Super built-up area is required'),
  carpet_area: z.number().optional(),
  expected_price: z.number().min(1, 'Expected price is required'),
  state: z.string().min(1, 'State is required'),
  city: z.string().min(1, 'City is required'),
  locality: z.string().min(1, 'Locality is required'),
  pincode: z.string().min(6, 'Valid pincode is required'),
  description: z.string().optional()
});

type PropertyInfoFormData = z.infer<typeof propertyInfoSchema>;

interface PropertyInfoStepProps {
  data: Partial<PropertyDraft>;
  onNext: (data: Partial<PropertyDraft>) => void;
  onBack: () => void;
  onImagesChange: (images: string[]) => void;
  onVideosChange: (videos: string[]) => void;
}

export const PropertyInfoStep = ({ data, onNext, onBack, onImagesChange, onVideosChange }: PropertyInfoStepProps) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<PropertyInfoFormData>({
    resolver: zodResolver(propertyInfoSchema),
    defaultValues: {
      title: data.title || '',
      property_type: data.property_type || '',
      listing_type: data.listing_type || 'sale',
      bhk_type: data.bhk_type || '',
      bathrooms: data.bathrooms || 0,
      balconies: data.balconies || 0,
      super_area: data.super_area || 0,
      carpet_area: data.carpet_area || 0,
      expected_price: data.expected_price || 0,
      state: data.state || '',
      city: data.city || '',
      locality: data.locality || '',
      pincode: data.pincode || '',
      description: data.description || ''
    }
  });

  const propertyType = watch('property_type');
  const images = data.images || [];
  const videos = data.videos || [];

  const onSubmit = (formData: PropertyInfoFormData) => {
    if (images.length < 3) {
      return; // ImageUploadComponent will show validation error
    }

    onNext({
      ...formData,
      images,
      videos,
      step_completed: 2
    });
  };

  const handleImagesChange = (newImages: string[]) => {
    onImagesChange(newImages);
  };

  const handleVideosChange = (newVideos: string[]) => {
    onVideosChange(newVideos);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-primary">Property Information</CardTitle>
        <p className="text-muted-foreground">
          Provide detailed information about your property
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Property Title */}
            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="title">Property Title *</Label>
              <Input
                id="title"
                {...register('title')}
                placeholder="Spacious 2BHK Apartment in Prime Location"
                className={errors.title ? 'border-destructive' : ''}
              />
              {errors.title && (
                <p className="text-sm text-destructive">{errors.title.message}</p>
              )}
            </div>

            {/* Property Type */}
            <div className="space-y-2">
              <Label>Property Type *</Label>
              <Select
                value={watch('property_type')}
                onValueChange={(value) => setValue('property_type', value)}
              >
                <SelectTrigger className={errors.property_type ? 'border-destructive' : ''}>
                  <SelectValue placeholder="Select property type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="apartment">Apartment</SelectItem>
                  <SelectItem value="villa">Villa</SelectItem>
                  <SelectItem value="house">House</SelectItem>
                  <SelectItem value="plot">Plot</SelectItem>
                  <SelectItem value="commercial">Commercial</SelectItem>
                </SelectContent>
              </Select>
              {errors.property_type && (
                <p className="text-sm text-destructive">{errors.property_type.message}</p>
              )}
            </div>

            {/* Listing Type */}
            <div className="space-y-2">
              <Label>Listing Type *</Label>
              <Select
                value={watch('listing_type')}
                onValueChange={(value) => setValue('listing_type', value as 'sale' | 'rent')}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select listing type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sale">Sale</SelectItem>
                  <SelectItem value="rent">Rent</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* BHK Type */}
            {propertyType && propertyType !== 'plot' && propertyType !== 'commercial' && (
              <div className="space-y-2">
                <Label>BHK Type</Label>
                <Select
                  value={watch('bhk_type')}
                  onValueChange={(value) => setValue('bhk_type', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select BHK" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1bhk">1 BHK</SelectItem>
                    <SelectItem value="2bhk">2 BHK</SelectItem>
                    <SelectItem value="3bhk">3 BHK</SelectItem>
                    <SelectItem value="4bhk">4 BHK</SelectItem>
                    <SelectItem value="5bhk">5+ BHK</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Bathrooms */}
            {propertyType && propertyType !== 'plot' && (
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
            )}

            {/* Balconies */}
            {propertyType && propertyType !== 'plot' && propertyType !== 'commercial' && (
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
            )}

            {/* Super Built-up Area */}
            <div className="space-y-2">
              <Label htmlFor="super_area">Super Built-up Area (sqft) *</Label>
              <Input
                id="super_area"
                type="number"
                {...register('super_area', { valueAsNumber: true })}
                placeholder="e.g., 1200"
                min="1"
                className={errors.super_area ? 'border-destructive' : ''}
              />
              {errors.super_area && (
                <p className="text-sm text-destructive">{errors.super_area.message}</p>
              )}
            </div>

            {/* Carpet Area */}
            {propertyType && propertyType !== 'plot' && (
              <div className="space-y-2">
                <Label htmlFor="carpet_area">Carpet Area (sqft)</Label>
                <Input
                  id="carpet_area"
                  type="number"
                  {...register('carpet_area', { valueAsNumber: true })}
                  placeholder="e.g., 1000"
                  min="0"
                />
              </div>
            )}

            {/* Expected Price */}
            <div className="space-y-2">
              <Label htmlFor="expected_price">Expected Price (₹) *</Label>
              <Input
                id="expected_price"
                type="number"
                {...register('expected_price', { valueAsNumber: true })}
                placeholder="e.g., 5000000"
                min="1"
                className={errors.expected_price ? 'border-destructive' : ''}
              />
              {errors.expected_price && (
                <p className="text-sm text-destructive">{errors.expected_price.message}</p>
              )}
            </div>

            {/* State */}
            <div className="space-y-2">
              <Label htmlFor="state">State *</Label>
              <Input
                id="state"
                {...register('state')}
                placeholder="e.g., Maharashtra"
                className={errors.state ? 'border-destructive' : ''}
              />
              {errors.state && (
                <p className="text-sm text-destructive">{errors.state.message}</p>
              )}
            </div>

            {/* City */}
            <div className="space-y-2">
              <Label htmlFor="city">City *</Label>
              <Input
                id="city"
                {...register('city')}
                placeholder="e.g., Mumbai"
                className={errors.city ? 'border-destructive' : ''}
              />
              {errors.city && (
                <p className="text-sm text-destructive">{errors.city.message}</p>
              )}
            </div>

            {/* Locality */}
            <div className="space-y-2">
              <Label htmlFor="locality">Locality *</Label>
              <Input
                id="locality"
                {...register('locality')}
                placeholder="e.g., Bandra West"
                className={errors.locality ? 'border-destructive' : ''}
              />
              {errors.locality && (
                <p className="text-sm text-destructive">{errors.locality.message}</p>
              )}
            </div>

            {/* Pincode */}
            <div className="space-y-2">
              <Label htmlFor="pincode">Pincode *</Label>
              <Input
                id="pincode"
                {...register('pincode')}
                placeholder="e.g., 400050"
                className={errors.pincode ? 'border-destructive' : ''}
              />
              {errors.pincode && (
                <p className="text-sm text-destructive">{errors.pincode.message}</p>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Property Description</Label>
            <Textarea
              id="description"
              {...register('description')}
              placeholder="Provide detailed description of your property..."
              rows={4}
            />
          </div>

          {/* Image Upload */}
          <ImageUploadComponent
            images={images}
            onImagesChange={handleImagesChange}
          />

          {/* Video Upload */}
          <VideoUploadComponent
            videos={videos}
            onVideosChange={handleVideosChange}
          />

          {/* Navigation Buttons */}
          <div className="flex justify-between">
            <Button type="button" variant="outline" onClick={onBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <Button type="submit" className="px-8">
              Next
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
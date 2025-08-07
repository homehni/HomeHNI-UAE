import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Badge } from '@/components/ui/badge';
import { CommercialPropertyDetails } from '@/types/property';

const commercialSalePropertyDetailsSchema = z.object({
  title: z.string().min(1, 'Property title is required'),
  spaceType: z.enum(['office', 'retail', 'warehouse', 'showroom', 'restaurant', 'co-working']),
  buildingType: z.string().min(1, 'Building type is required'),
  propertyAge: z.string().min(1, 'Property age is required'),
  floorNo: z.number().min(0, 'Floor number must be 0 or greater'),
  totalFloors: z.number().min(1, 'Total floors must be at least 1'),
  superBuiltUpArea: z.number().min(1, 'Area is required'),
  furnishingStatus: z.string().min(1, 'Furnishing status is required'),
  parkingType: z.string().optional(),
  powerLoad: z.string().optional(),
  ceilingHeight: z.string().optional(),
  entranceWidth: z.string().optional(),
});

type CommercialSalePropertyDetailsFormData = z.infer<typeof commercialSalePropertyDetailsSchema>;

interface CommercialSalePropertyDetailsStepProps {
  initialData?: Partial<CommercialPropertyDetails>;
  onNext: (data: Partial<CommercialPropertyDetails>) => void;
  onBack: () => void;
  currentStep: number;
  totalSteps: number;
}

export const CommercialSalePropertyDetailsStep = ({
  initialData,
  onNext,
  onBack,
  currentStep,
  totalSteps
}: CommercialSalePropertyDetailsStepProps) => {
  const [onMainRoad, setOnMainRoad] = useState(initialData?.onMainRoad || false);
  const [cornerProperty, setCornerProperty] = useState(initialData?.cornerProperty || false);
  const [loadingFacility, setLoadingFacility] = useState(initialData?.loadingFacility || false);

  const form = useForm<CommercialSalePropertyDetailsFormData>({
    resolver: zodResolver(commercialSalePropertyDetailsSchema),
    defaultValues: {
      title: initialData?.title || '',
      spaceType: (initialData?.spaceType as any) || 'office',
      buildingType: initialData?.buildingType || '',
      propertyAge: initialData?.propertyAge || '',
      floorNo: initialData?.floorNo || 0,
      totalFloors: initialData?.totalFloors || 1,
      superBuiltUpArea: initialData?.superBuiltUpArea || 0,
      furnishingStatus: initialData?.furnishingStatus || '',
      parkingType: initialData?.parkingType || '',
      powerLoad: initialData?.powerLoad || '',
      ceilingHeight: initialData?.ceilingHeight || '',
      entranceWidth: initialData?.entranceWidth || '',
    },
  });

  const onSubmit = (data: CommercialSalePropertyDetailsFormData) => {
    const completeData = {
      ...data,
      onMainRoad,
      cornerProperty,
      loadingFacility,
    };
    onNext(completeData);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Commercial Property Details</h2>
        <p className="text-gray-600">Tell us about your commercial space for sale</p>
        <div className="mt-4 text-sm text-gray-500">
          Step {currentStep} of {totalSteps}
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Property Title *</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Prime Commercial Space in Business District" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="spaceType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Space Type *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select space type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="office">Office</SelectItem>
                      <SelectItem value="retail">Retail</SelectItem>
                      <SelectItem value="warehouse">Warehouse</SelectItem>
                      <SelectItem value="showroom">Showroom</SelectItem>
                      <SelectItem value="restaurant">Restaurant</SelectItem>
                      <SelectItem value="co-working">Co-working</SelectItem>
                      <SelectItem value="industrial">Industrial</SelectItem>
                      <SelectItem value="medical">Medical</SelectItem>
                      <SelectItem value="educational">Educational</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="buildingType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Building Type *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select building type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="standalone">Standalone Building</SelectItem>
                      <SelectItem value="mall">Shopping Mall</SelectItem>
                      <SelectItem value="complex">Commercial Complex</SelectItem>
                      <SelectItem value="tower">Office Tower</SelectItem>
                      <SelectItem value="plaza">Plaza</SelectItem>
                      <SelectItem value="market">Market</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FormField
              control={form.control}
              name="propertyAge"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Property Age *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select age" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="0-1">0-1 Years</SelectItem>
                      <SelectItem value="1-5">1-5 Years</SelectItem>
                      <SelectItem value="5-10">5-10 Years</SelectItem>
                      <SelectItem value="10-15">10-15 Years</SelectItem>
                      <SelectItem value="15-20">15-20 Years</SelectItem>
                      <SelectItem value="20+">20+ Years</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="floorNo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Floor Number *</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g., 2" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="totalFloors"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Total Floors *</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g., 10" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="superBuiltUpArea"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Super Built-up Area (sq ft) *</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="e.g., 2000" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="furnishingStatus"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Furnishing Status *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select furnishing" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="unfurnished">Unfurnished</SelectItem>
                      <SelectItem value="semi-furnished">Semi Furnished</SelectItem>
                      <SelectItem value="furnished">Furnished</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="parkingType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Parking</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select parking type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="none">No Parking</SelectItem>
                      <SelectItem value="open">Open Parking</SelectItem>
                      <SelectItem value="covered">Covered Parking</SelectItem>
                      <SelectItem value="reserved">Reserved Parking</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FormField
              control={form.control}
              name="powerLoad"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Power Load</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., 50 KW" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="ceilingHeight"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ceiling Height</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., 12 ft" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="entranceWidth"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Entrance Width</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., 8 ft" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Additional Features</h3>
            <div className="flex flex-wrap gap-3">
              <Badge
                variant={onMainRoad ? "default" : "outline"}
                className="cursor-pointer px-4 py-2"
                onClick={() => setOnMainRoad(!onMainRoad)}
              >
                On Main Road
              </Badge>
              <Badge
                variant={cornerProperty ? "default" : "outline"}
                className="cursor-pointer px-4 py-2"
                onClick={() => setCornerProperty(!cornerProperty)}
              >
                Corner Property
              </Badge>
              <Badge
                variant={loadingFacility ? "default" : "outline"}
                className="cursor-pointer px-4 py-2"
                onClick={() => setLoadingFacility(!loadingFacility)}
              >
                Loading Facility
              </Badge>
            </div>
          </div>

          <div className="flex justify-between pt-6">
            <Button type="button" variant="outline" onClick={onBack}>
              Back
            </Button>
            <Button type="submit">
              Save & Continue
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
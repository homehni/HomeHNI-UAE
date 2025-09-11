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
  title: z.string().optional(), // Made optional - will be auto-generated
  spaceType: z.enum(['office', 'retail', 'warehouse', 'showroom', 'restaurant', 'co-working', 'industrial', 'medical', 'educational']).optional(),
  buildingType: z.string().optional(),
  floorNo: z.string().optional(),
  totalFloors: z.string().optional(),
  superBuiltUpArea: z.string().optional(),
  furnishingStatus: z.string().optional(),
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
      // propertyAge field removed
      floorNo: initialData?.floorNo?.toString() || '0',
      totalFloors: initialData?.totalFloors?.toString() || '1',
      superBuiltUpArea: initialData?.superBuiltUpArea?.toString() || '',
      furnishingStatus: initialData?.furnishingStatus || '',
      powerLoad: initialData?.powerLoad || '',
      ceilingHeight: initialData?.ceilingHeight || '',
      entranceWidth: initialData?.entranceWidth || '',
    },
  });

  const onSubmit = (data: CommercialSalePropertyDetailsFormData) => {
    console.log('Form submission data:', data);
    const completeData = {
      ...data,
      floorNo: parseInt(data.floorNo),
      totalFloors: parseInt(data.totalFloors),
      superBuiltUpArea: parseFloat(data.superBuiltUpArea),
      onMainRoad,
      cornerProperty,
      loadingFacility,
    };
    console.log('Complete data to submit:', completeData);
    onNext(completeData);
  };

  const onError = (errors: any) => {
    console.log('Form validation errors:', errors);
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
        <form onSubmit={form.handleSubmit(onSubmit, onError)} className="space-y-6">
          {/* Property Name */}
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name of Property (Optional)</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Leave empty for auto-generated name based on property details"
                    {...field}
                  />
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
                  <FormLabel>Space Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select space type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="office">Office</SelectItem>
                      <SelectItem value="retail">Retail</SelectItem>
                       <SelectItem value="co-living">Co-Living</SelectItem>
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
                  <FormLabel>Building Type</FormLabel>
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="floorNo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Floor Number</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select floor" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="0">Ground Floor</SelectItem>
                      {Array.from({ length: 99 }, (_, i) => i + 1).map(floor => (
                        <SelectItem key={floor} value={floor.toString()}>
                          {floor === 1 ? '1st Floor' : 
                           floor === 2 ? '2nd Floor' : 
                           floor === 3 ? '3rd Floor' : 
                           `${floor}th Floor`}
                        </SelectItem>
                      ))}
                      <SelectItem value="100">99+ Floor</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="totalFloors"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Total Floors</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select total floors" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Array.from({ length: 99 }, (_, i) => i + 1).map(floors => (
                        <SelectItem key={floors} value={floors.toString()}>
                          {floors} Floor{floors > 1 ? 's' : ''}
                        </SelectItem>
                      ))}
                      <SelectItem value="100">99+ Floors</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="superBuiltUpArea"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Super Built-up Area (sq ft)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="e.g., 2000" 
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="furnishingStatus"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Furnishing Status</FormLabel>
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
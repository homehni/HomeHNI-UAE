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
  spaceType: z.enum(['office', 'retail', 'warehouse', 'showroom', 'restaurant', 'co-working']),
  buildingType: z.string().min(1, 'Building type is required'),
  propertyAge: z.string().min(1, 'Property age is required'),
  floorNo: z.string().min(1, 'Floor number is required'),
  totalFloors: z.string().min(1, 'Total floors is required'),
  superBuiltUpArea: z.number().min(1, 'Area is required'),
  furnishingStatus: z.string().min(1, 'Furnishing status is required'),
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
      spaceType: (initialData?.spaceType as any) || 'office',
      buildingType: initialData?.buildingType || '',
      propertyAge: initialData?.propertyAge || '',
      floorNo: initialData?.floorNo?.toString() || '0',
      totalFloors: initialData?.totalFloors?.toString() || '1',
      superBuiltUpArea: initialData?.superBuiltUpArea || 0,
      furnishingStatus: initialData?.furnishingStatus || '',
      powerLoad: initialData?.powerLoad || '',
      ceilingHeight: initialData?.ceilingHeight || '',
      entranceWidth: initialData?.entranceWidth || '',
    },
  });

  const onSubmit = (data: CommercialSalePropertyDetailsFormData) => {
    const completeData = {
      ...data,
      floorNo: parseInt(data.floorNo),
      totalFloors: parseInt(data.totalFloors),
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
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select floor" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="0">Ground Floor</SelectItem>
                      <SelectItem value="1">1st Floor</SelectItem>
                      <SelectItem value="2">2nd Floor</SelectItem>
                      <SelectItem value="3">3rd Floor</SelectItem>
                      <SelectItem value="4">4th Floor</SelectItem>
                      <SelectItem value="5">5th Floor</SelectItem>
                      <SelectItem value="6">6th Floor</SelectItem>
                      <SelectItem value="7">7th Floor</SelectItem>
                      <SelectItem value="8">8th Floor</SelectItem>
                      <SelectItem value="9">9th Floor</SelectItem>
                      <SelectItem value="10">10th Floor</SelectItem>
                      <SelectItem value="11">11th Floor</SelectItem>
                      <SelectItem value="12">12th Floor</SelectItem>
                      <SelectItem value="13">13th Floor</SelectItem>
                      <SelectItem value="14">14th Floor</SelectItem>
                      <SelectItem value="15">15th Floor</SelectItem>
                      <SelectItem value="16">16th Floor</SelectItem>
                      <SelectItem value="17">17th Floor</SelectItem>
                      <SelectItem value="18">18th Floor</SelectItem>
                      <SelectItem value="19">19th Floor</SelectItem>
                      <SelectItem value="20">20th Floor</SelectItem>
                      <SelectItem value="21">21st Floor</SelectItem>
                      <SelectItem value="22">22nd Floor</SelectItem>
                      <SelectItem value="23">23rd Floor</SelectItem>
                      <SelectItem value="24">24th Floor</SelectItem>
                      <SelectItem value="25">25th Floor</SelectItem>
                      <SelectItem value="26">26th Floor</SelectItem>
                      <SelectItem value="27">27th Floor</SelectItem>
                      <SelectItem value="28">28th Floor</SelectItem>
                      <SelectItem value="29">29th Floor</SelectItem>
                      <SelectItem value="30">30th Floor</SelectItem>
                      <SelectItem value="31">31st Floor and above</SelectItem>
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
                  <FormLabel>Total Floors *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select total floors" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="1">1 Floor</SelectItem>
                      <SelectItem value="2">2 Floors</SelectItem>
                      <SelectItem value="3">3 Floors</SelectItem>
                      <SelectItem value="4">4 Floors</SelectItem>
                      <SelectItem value="5">5 Floors</SelectItem>
                      <SelectItem value="6">6 Floors</SelectItem>
                      <SelectItem value="7">7 Floors</SelectItem>
                      <SelectItem value="8">8 Floors</SelectItem>
                      <SelectItem value="9">9 Floors</SelectItem>
                      <SelectItem value="10">10 Floors</SelectItem>
                      <SelectItem value="11">11 Floors</SelectItem>
                      <SelectItem value="12">12 Floors</SelectItem>
                      <SelectItem value="13">13 Floors</SelectItem>
                      <SelectItem value="14">14 Floors</SelectItem>
                      <SelectItem value="15">15 Floors</SelectItem>
                      <SelectItem value="16">16 Floors</SelectItem>
                      <SelectItem value="17">17 Floors</SelectItem>
                      <SelectItem value="18">18 Floors</SelectItem>
                      <SelectItem value="19">19 Floors</SelectItem>
                      <SelectItem value="20">20 Floors</SelectItem>
                      <SelectItem value="21">21 Floors</SelectItem>
                      <SelectItem value="22">22 Floors</SelectItem>
                      <SelectItem value="23">23 Floors</SelectItem>
                      <SelectItem value="24">24 Floors</SelectItem>
                      <SelectItem value="25">25 Floors</SelectItem>
                      <SelectItem value="26">26 Floors</SelectItem>
                      <SelectItem value="27">27 Floors</SelectItem>
                      <SelectItem value="28">28 Floors</SelectItem>
                      <SelectItem value="29">29 Floors</SelectItem>
                      <SelectItem value="30">30 Floors</SelectItem>
                      <SelectItem value="31">31+ Floors</SelectItem>
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
                  <FormLabel>Super Built-up Area (sq ft) *</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g., 2000" {...field} />
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
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { CommercialPropertyDetails } from '@/types/property';

const commercialPropertyDetailsSchema = z.object({
  title: z.string().min(1, 'Property title is required'),
  propertyType: z.string().min(1, 'Please select property type'),
  spaceType: z.string().min(1, 'Please select space type'),
  buildingType: z.string().min(1, 'Please select building type'),
  propertyAge: z.string().min(1, 'Please select property age'),
  totalFloors: z.union([z.number().min(1, 'Total floors must be at least 1'), z.string().min(1, 'Please select total floors')]),
  floorNo: z.union([z.number().min(0, 'Floor number cannot be negative'), z.string().min(1, 'Please select floor')]),
  furnishingStatus: z.string().min(1, 'Please select furnishing status'),
  superBuiltUpArea: z.number().min(1, 'Super built up area is required'),
  powerLoad: z.string().optional(),
  ceilingHeight: z.string().optional(),
  entranceWidth: z.string().optional(),
  loadingFacility: z.boolean().optional(),
  onMainRoad: z.boolean().optional(),
  cornerProperty: z.boolean().optional(),
});

type CommercialPropertyDetailsFormData = z.infer<typeof commercialPropertyDetailsSchema>;

interface CommercialPropertyDetailsStepProps {
  initialData?: Partial<CommercialPropertyDetails>;
  onNext: (data: CommercialPropertyDetails) => void;
  onBack: () => void;
  currentStep: number;
  totalSteps: number;
}

export const CommercialPropertyDetailsStep: React.FC<CommercialPropertyDetailsStepProps> = ({
  initialData = {},
  onNext,
  onBack,
  currentStep,
  totalSteps
}) => {
  const form = useForm<CommercialPropertyDetailsFormData>({
    resolver: zodResolver(commercialPropertyDetailsSchema),
    defaultValues: {
      title: initialData.title || '',
      propertyType: initialData.propertyType || 'Commercial',
      spaceType: initialData.spaceType || '',
      buildingType: initialData.buildingType || '',
      propertyAge: initialData.propertyAge || '',
      totalFloors: initialData.totalFloors || 1,
      floorNo: initialData.floorNo || 0,
      furnishingStatus: initialData.furnishingStatus || '',
      superBuiltUpArea: initialData.superBuiltUpArea || 0,
      powerLoad: initialData.powerLoad || '',
      ceilingHeight: initialData.ceilingHeight || '',
      entranceWidth: initialData.entranceWidth || '',
      loadingFacility: initialData.loadingFacility || false,
      onMainRoad: initialData.onMainRoad || false,
      cornerProperty: initialData.cornerProperty || false,
    },
  });

  const [onMainRoad, setOnMainRoad] = useState(form.watch('onMainRoad'));
  const [cornerProperty, setCornerProperty] = useState(form.watch('cornerProperty'));
  const [loadingFacility, setLoadingFacility] = useState(form.watch('loadingFacility'));

  const onSubmit = (data: CommercialPropertyDetailsFormData) => {
    onNext({
      ...initialData,
      ...data,
      onMainRoad,
      cornerProperty,
      loadingFacility,
    } as CommercialPropertyDetails);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <h1 className="text-2xl font-semibold text-primary mb-6">Commercial Property Details</h1>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Property Title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">Property Title*</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Modern Office Space in Business District"
                      className="h-12"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Space Type and Building Type */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="spaceType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Space Type*</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-12">
                          <SelectValue placeholder="Select Space Type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="office">Office Space</SelectItem>
                        <SelectItem value="retail">Retail Shop</SelectItem>
                        <SelectItem value="warehouse">Warehouse</SelectItem>
                        <SelectItem value="showroom">Showroom</SelectItem>
                        <SelectItem value="restaurant">Restaurant/Cafe</SelectItem>
                        <SelectItem value="co-working">Co-Working Space</SelectItem>
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
                    <FormLabel className="text-sm font-medium">Building Type*</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-12">
                          <SelectValue placeholder="Select Building Type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Business Park">Business Park</SelectItem>
                        <SelectItem value="Mall">Mall</SelectItem>
                        <SelectItem value="Standalone Building">Standalone Building</SelectItem>
                        <SelectItem value="Independent Shop">Independent Shop</SelectItem>
                        <SelectItem value="IT Park">IT Park</SelectItem>
                        <SelectItem value="Industrial Complex">Industrial Complex</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Age, Floor, Total Floor */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormField
                control={form.control}
                name="propertyAge"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Age of Property*</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-12">
                          <SelectValue placeholder="Select Age" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Less than a Year">Less than a Year</SelectItem>
                        <SelectItem value="1-2 Years">1-2 Years</SelectItem>
                        <SelectItem value="3-5 Years">3-5 Years</SelectItem>
                        <SelectItem value="5-10 Years">5-10 Years</SelectItem>
                        <SelectItem value="10+ Years">10+ Years</SelectItem>
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
                    <FormLabel className="text-sm font-medium">Floor*</FormLabel>
                    <Select
                      onValueChange={(value) =>
                        value === 'full' || value === 'lower' || value === 'upper' || value === '99+'
                          ? field.onChange(value)
                          : field.onChange(parseInt(value))
                      }
                      defaultValue={field.value?.toString()}
                    >
                      <FormControl>
                        <SelectTrigger className="h-12">
                          <SelectValue placeholder="Select Floor" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="lower">Lower Basement</SelectItem>
                        <SelectItem value="upper">Upper Basement</SelectItem>
                        <SelectItem value="0">Ground Floor</SelectItem>
                        <SelectItem value="full">Full Building</SelectItem>
                        {[...Array(99)].map((_, i) => {
                          const floor = i + 1;
                          return (
                            <SelectItem key={floor} value={floor.toString()}>
                              {floor}
                            </SelectItem>
                          );
                        })}
                        <SelectItem value="99+">99+</SelectItem>
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
                    <FormLabel className="text-sm font-medium">Total Floors*</FormLabel>
                    <Select
                      onValueChange={(value) =>
                        value === '99+' ? field.onChange(value) : field.onChange(parseInt(value))
                      }
                      defaultValue={field.value?.toString()}
                    >
                      <FormControl>
                        <SelectTrigger className="h-12">
                          <SelectValue placeholder="Select Total Floors" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="0">Ground</SelectItem>
                        {[...Array(99)].map((_, i) => {
                          const floor = i + 1;
                          return (
                            <SelectItem key={floor} value={floor.toString()}>
                              {floor}
                            </SelectItem>
                          );
                        })}
                        <SelectItem value="99+">99+</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Area and Furnishing */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="superBuiltUpArea"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Super Built Up Area*</FormLabel>
                    <div className="relative">
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="1500"
                          className="h-12 pr-12"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        />
                      </FormControl>
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500">
                        Sq.ft
                      </div>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="furnishingStatus"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Furnishing*</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-12">
                          <SelectValue placeholder="Select Furnishing" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Fully Furnished">Fully Furnished</SelectItem>
                        <SelectItem value="Semi Furnished">Semi Furnished</SelectItem>
                        <SelectItem value="Unfurnished">Unfurnished</SelectItem>
                        <SelectItem value="Bare Shell">Bare Shell</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Commercial Specific Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormField
                control={form.control}
                name="powerLoad"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Power Load</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-12">
                          <SelectValue placeholder="Select Power Load" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="10 KW">10 KW</SelectItem>
                        <SelectItem value="20 KW">20 KW</SelectItem>
                        <SelectItem value="50 KW">50 KW</SelectItem>
                        <SelectItem value="100 KW">100 KW</SelectItem>
                        <SelectItem value="200+ KW">200+ KW</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="ceilingHeight"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Ceiling Height</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., 12 feet"
                        className="h-12"
                        {...field}
                      />
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
                    <FormLabel className="text-sm font-medium">Entrance Width</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., 8 feet"
                        className="h-12"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Other Features */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Other Features</h3>
              <div className="flex gap-4 flex-wrap">
                <Badge
                  variant={onMainRoad ? "default" : "outline"}
                  className="cursor-pointer px-4 py-2 text-sm"
                  onClick={() => setOnMainRoad(!onMainRoad)}
                >
                  On Main Road
                </Badge>
                <Badge
                  variant={cornerProperty ? "default" : "outline"}
                  className="cursor-pointer px-4 py-2 text-sm"
                  onClick={() => setCornerProperty(!cornerProperty)}
                >
                  Corner Property
                </Badge>
                <Badge
                  variant={loadingFacility ? "default" : "outline"}
                  className="cursor-pointer px-4 py-2 text-sm"
                  onClick={() => setLoadingFacility(!loadingFacility)}
                >
                  Loading/Unloading Facility
                </Badge>
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onBack}
                disabled={currentStep === 1}
              >
                Back
              </Button>
              <Button type="submit">
                Save & Continue
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

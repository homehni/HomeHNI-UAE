import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { PropertyDetails } from '@/types/property';
import { ArrowLeft, ArrowRight, Compass } from 'lucide-react';

const resalePropertyDetailsSchema = z.object({
  title: z.string().optional(), // Made optional - will be auto-generated
  propertyType: z.string().min(1, "Property type is required"),
  bhkType: z.string().min(1, "BHK type is required"),
  ownershipType: z.string().min(1, "Ownership type is required"),
  builtUpArea: z.number().min(1, "Built up area is required and must be greater than 0"),
  carpetArea: z.number().optional(),
  propertyAge: z.string().min(1, "Property age is required"),
  facing: z.string().min(1, "Facing is required"),
  floorNo: z.union([z.number(), z.string()]).optional(),
  totalFloors: z.union([z.number(), z.string()]).optional(),
});

type ResalePropertyDetailsFormData = z.infer<typeof resalePropertyDetailsSchema>;

interface ResalePropertyDetailsStepProps {
  initialData?: Partial<PropertyDetails>;
  onNext: (data: PropertyDetails) => void;
  onBack: () => void;
}

export const ResalePropertyDetailsStep: React.FC<ResalePropertyDetailsStepProps> = ({
  initialData = {},
  onNext,
  onBack
}) => {
  const form = useForm<ResalePropertyDetailsFormData>({
    resolver: zodResolver(resalePropertyDetailsSchema),
    defaultValues: {
      title: initialData.title || '',
      propertyType: initialData.propertyType || '',
      bhkType: initialData.bhkType || '',
      ownershipType: (initialData as any).ownershipType || '',
      builtUpArea: initialData.superBuiltUpArea || undefined,
      carpetArea: (initialData as any).carpetArea || undefined,
      propertyAge: (initialData as any).propertyAge || '',
      facing: (initialData as any).facing || '',
      floorNo: initialData.floorNo || 0,
      totalFloors: initialData.totalFloors || 1,
    },
  });

  const [onMainRoad, setOnMainRoad] = useState(initialData.onMainRoad || false);
  const [cornerProperty, setCornerProperty] = useState(initialData.cornerProperty || false);
  
  const watchedPropertyType = form.watch("propertyType");
  const watchedFloorNo = form.watch("floorNo");
  
  // Properties that show floor dropdown (for apartments, penthouses, etc.)
  const showFloorDropdown = ['Apartment', 'Penthouse', 'Gated Community Villa'].includes(watchedPropertyType);
  
  // Properties that show number of floors
  const showNumberOfFloors = ['Independent House', 'Villa', 'Duplex'].includes(watchedPropertyType);
  
  // Get minimum total floors based on selected floor
  const getMinTotalFloors = () => {
    if (typeof watchedFloorNo === 'number' && watchedFloorNo > 0) {
      return watchedFloorNo;
    }
    return 1;
  };

  const onSubmit = (data: ResalePropertyDetailsFormData) => {
    onNext({
      ...initialData,
      title: data.title,
      propertyType: data.propertyType,
      buildingType: data.propertyType, // Use propertyType as buildingType for residential
      bhkType: data.bhkType,
      ownershipType: data.ownershipType,
      superBuiltUpArea: data.builtUpArea,
      builtUpArea: data.builtUpArea,
      carpetArea: data.carpetArea,
      // propertyAge removed from data transformation
      facing: data.facing,
      floorNo: data.floorNo,
      totalFloors: data.totalFloors,
      onMainRoad,
      cornerProperty,
    } as PropertyDetails);
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Property Details</h2>
        <p className="text-gray-600">Tell us about your property specifications</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Property Name */}
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium">Property Name (Optional)</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter Property Name"
                    className="h-12"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Property Type and BHK Type */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="propertyType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">Property Type*</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-white border shadow-lg z-50">
                      <SelectItem value="Apartment">Apartment</SelectItem>
                      <SelectItem value="Co-Living">Co-Living</SelectItem>
                      <SelectItem value="Villa">Villa</SelectItem>
                      <SelectItem value="Independent House">Independent House</SelectItem>
                      <SelectItem value="Builder Floor">Builder Floor</SelectItem>
                      <SelectItem value="Studio Apartment">Studio Apartment</SelectItem>
                      <SelectItem value="Co-Working">Co-Working</SelectItem>
                      <SelectItem value="Penthouse">Penthouse</SelectItem>
                      <SelectItem value="Duplex">Duplex</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bhkType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">BHK Type*</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-white border shadow-lg z-50">
                      <SelectItem value="Studio">Studio</SelectItem>
                      <SelectItem value="1 RK">1 RK</SelectItem>
                      <SelectItem value="1 BHK">1 BHK</SelectItem>
                      <SelectItem value="2 BHK">2 BHK</SelectItem>
                      <SelectItem value="3 BHK">3 BHK</SelectItem>
                      <SelectItem value="4 BHK">4 BHK</SelectItem>
                      <SelectItem value="5 BHK">5 BHK</SelectItem>
                      <SelectItem value="5+ BHK">5+ BHK</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Ownership Type */}
          <FormField
            control={form.control}
            name="ownershipType"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium">Ownership Type*</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-white border shadow-lg z-50">
                    <SelectItem value="Freehold">Freehold</SelectItem>
                    <SelectItem value="Leasehold">Leasehold</SelectItem>
                    <SelectItem value="Co-operative Society">Co-operative Society</SelectItem>
                    <SelectItem value="Power of Attorney">Power of Attorney</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Built Up Area and Carpet Area */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="builtUpArea"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">Built Up Area*</FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Built Up Area"
                        className="h-12 pr-12"
                        {...field}
                        onChange={(e) => {
                          const value = parseInt(e.target.value);
                          if (isNaN(value) || value < 0) {
                            field.onChange(undefined);
                          } else {
                            field.onChange(value);
                          }
                        }}
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
              name="carpetArea"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">Carpet Area</FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Carpet Area"
                        className="h-12 pr-12"
                        {...field}
                        onChange={(e) => {
                          const value = parseInt(e.target.value);
                          if (isNaN(value) || value < 0) {
                            field.onChange(undefined);
                          } else {
                            field.onChange(value);
                          }
                        }}
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
          </div>

          {/* Property Age and Facing */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="propertyAge"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">Property Age*</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-white border shadow-lg z-50">
                      <SelectItem value="Under Construction">Under Construction</SelectItem>
                      <SelectItem value="Ready to Move">Ready to Move</SelectItem>
                      <SelectItem value="0-1 Years">0-1 Years</SelectItem>
                      <SelectItem value="1-3 Years">1-3 Years</SelectItem>
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
              name="facing"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">Facing*</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="h-12">
                        <div className="flex items-center gap-2">
                          <Compass className="h-4 w-4 text-muted-foreground" />
                          <SelectValue placeholder="Select" />
                        </div>
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-white border shadow-lg z-50">
                      <SelectItem value="North">North</SelectItem>
                      <SelectItem value="South">South</SelectItem>
                      <SelectItem value="East">East</SelectItem>
                      <SelectItem value="West">West</SelectItem>
                      <SelectItem value="North-East">North-East</SelectItem>
                      <SelectItem value="North-West">North-West</SelectItem>
                      <SelectItem value="South-East">South-East</SelectItem>
                      <SelectItem value="South-West">South-West</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Floor and Total Floor - Conditional based on property type */}
          {(showFloorDropdown || showNumberOfFloors) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {showFloorDropdown && (
                <FormField
                  control={form.control}
                  name="floorNo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">Floor*</FormLabel>
                        <Select
                          onValueChange={(value) => {
                            if (value === 'ground') {
                              field.onChange(0);
                            } else if (value === 'basement') {
                              field.onChange('basement');
                            } else if (value === 'lower' || value === 'upper' || value === '99+') {
                              field.onChange(value);
                            } else {
                              field.onChange(parseInt(value));
                            }
                          }}
                          value={
                            field.value === undefined ? undefined :
                            field.value === 0 ? 'ground' :
                            field.value === 'basement' ? 'basement' :
                            field.value.toString()
                          }
                        >
                        <FormControl>
                          <SelectTrigger className="h-12">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-white border shadow-lg z-50">
                          <SelectItem value="lower">Lower Basement</SelectItem>
                          <SelectItem value="upper">Upper Basement</SelectItem>
                          <SelectItem value="ground">Ground Floor</SelectItem>
                          {[...Array(50)].map((_, i) => {
                            const floor = i + 1;
                            return (
                              <SelectItem key={floor} value={floor.toString()}>
                                {floor}
                              </SelectItem>
                            );
                          })}
                          <SelectItem value="99+">50+</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {showFloorDropdown ? (
                <FormField
                  control={form.control}
                  name="totalFloors"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">Total Floor*</FormLabel>
                        <Select
                          onValueChange={(value) =>
                            value === '99+' ? field.onChange(value) : field.onChange(parseInt(value))
                          }
                          defaultValue={field.value?.toString()}
                        >
                        <FormControl>
                          <SelectTrigger className="h-12">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-white border shadow-lg z-50">
                          {[...Array(50)].map((_, i) => {
                            const floor = i + 1;
                            const minFloors = getMinTotalFloors();
                            if (floor >= minFloors) {
                              return (
                                <SelectItem key={floor} value={floor.toString()}>
                                  {floor}
                                </SelectItem>
                              );
                            }
                            return null;
                          }).filter(Boolean)}
                          <SelectItem value="99+">50+</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ) : showNumberOfFloors ? (
                <FormField
                  control={form.control}
                  name="totalFloors"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">No. of Floors</FormLabel>
                        <Select
                          onValueChange={(value) => field.onChange(parseInt(value))}
                          defaultValue={field.value?.toString()}
                        >
                        <FormControl>
                          <SelectTrigger className="h-12">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-white border shadow-lg z-50">
                          {[...Array(10)].map((_, i) => {
                            const floor = i + 1;
                            return (
                              <SelectItem key={floor} value={floor.toString()}>
                                {floor}
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ) : null}
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-end pt-6">
            <Button type="submit" className="h-12 px-8">
              Next Step
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
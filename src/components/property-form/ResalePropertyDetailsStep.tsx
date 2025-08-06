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
import { ArrowLeft, ArrowRight } from 'lucide-react';

const resalePropertyDetailsSchema = z.object({
  title: z.string().min(10, 'Title must be at least 10 characters'),
  propertyType: z.string().min(1, 'Please select property type'),
  bhkType: z.string().min(1, 'Please select BHK type'),
  ownershipType: z.string().min(1, 'Please select ownership type'),
  builtUpArea: z.number().min(1, 'Built up area is required'),
  carpetArea: z.number().optional(),
  propertyAge: z.string().min(1, 'Please select property age'),
  facing: z.string().min(1, 'Please select facing direction'),
  floorType: z.string().min(1, 'Please select floor type'),
  floorNo: z.union([z.number().min(0, 'Floor number cannot be negative'), z.string().min(1, 'Please select floor')]),
  totalFloors: z.union([z.number().min(1, 'Total floors must be at least 1'), z.string().min(1, 'Please select total floors')]),
  bathrooms: z.number().min(1, 'At least 1 bathroom is required'),
  balconies: z.number().min(0, 'Balconies cannot be negative'),
  furnishingStatus: z.string().min(1, 'Please select furnishing status'),
  parkingType: z.string().optional(),
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
      builtUpArea: initialData.superBuiltUpArea || 0,
      carpetArea: (initialData as any).carpetArea || 0,
      propertyAge: initialData.propertyAge || '',
      facing: (initialData as any).facing || '',
      floorType: (initialData as any).floorType || '',
      floorNo: initialData.floorNo || 0,
      totalFloors: initialData.totalFloors || 1,
      bathrooms: initialData.bathrooms || 1,
      balconies: initialData.balconies || 0,
      furnishingStatus: initialData.furnishingStatus || '',
      parkingType: initialData.parkingType || '',
    },
  });

  const [onMainRoad, setOnMainRoad] = useState(initialData.onMainRoad || false);
  const [cornerProperty, setCornerProperty] = useState(initialData.cornerProperty || false);

  const onSubmit = (data: ResalePropertyDetailsFormData) => {
    onNext({
      ...initialData,
      title: data.title,
      propertyType: data.propertyType,
      buildingType: data.propertyType, // Use propertyType as buildingType for residential
      bhkType: data.bhkType,
      ownershipType: data.ownershipType,
      superBuiltUpArea: data.builtUpArea,
      carpetArea: data.carpetArea,
      propertyAge: data.propertyAge,
      facing: data.facing,
      floorType: data.floorType,
      floorNo: data.floorNo,
      totalFloors: data.totalFloors,
      bathrooms: data.bathrooms,
      balconies: data.balconies,
      furnishingStatus: data.furnishingStatus,
      parkingType: data.parkingType,
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
          {/* Property Title */}
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium">Property Title*</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g., 3 BHK Apartment in Prime Location"
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
                        <SelectValue placeholder="Select Property Type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Apartment">Apartment</SelectItem>
                      <SelectItem value="Villa">Villa</SelectItem>
                      <SelectItem value="Independent House">Independent House</SelectItem>
                      <SelectItem value="Builder Floor">Builder Floor</SelectItem>
                      <SelectItem value="Studio Apartment">Studio Apartment</SelectItem>
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
                        <SelectValue placeholder="Select BHK Type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
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
                      <SelectValue placeholder="Select Ownership Type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
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
                        placeholder="1200"
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
              name="carpetArea"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">Carpet Area</FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="1000"
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
                        <SelectValue placeholder="Select Property Age" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Under Construction">Under Construction</SelectItem>
                      <SelectItem value="Ready to Move">Ready to Move</SelectItem>
                      <SelectItem value="0-1 Year">0-1 Year</SelectItem>
                      <SelectItem value="1-5 Years">1-5 Years</SelectItem>
                      <SelectItem value="5-10 Years">5-10 Years</SelectItem>
                      <SelectItem value="10-15 Years">10-15 Years</SelectItem>
                      <SelectItem value="15-20 Years">15-20 Years</SelectItem>
                      <SelectItem value="20+ Years">20+ Years</SelectItem>
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
                        <SelectValue placeholder="Select Facing Direction" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
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

          {/* Floor Type, Floor, Total Floor */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FormField
              control={form.control}
              name="floorType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">Floor Type*</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Select Floor Type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Lower Basement">Lower Basement</SelectItem>
                      <SelectItem value="Upper Basement">Upper Basement</SelectItem>
                      <SelectItem value="Ground Floor">Ground Floor</SelectItem>
                      <SelectItem value="Low Rise (1-3)">Low Rise (1-3)</SelectItem>
                      <SelectItem value="Mid Rise (4-9)">Mid Rise (4-9)</SelectItem>
                      <SelectItem value="High Rise (10+)">High Rise (10+)</SelectItem>
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
                      value === 'lower' || value === 'upper' || value === '99+'
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
                        <SelectValue placeholder="Select Total Floors" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="1">1</SelectItem>
                      {[...Array(50)].map((_, i) => {
                        const floor = i + 2;
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
          </div>

          {/* Bathrooms, Balconies, Furnishing */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FormField
              control={form.control}
              name="bathrooms"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">Bathrooms*</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(parseInt(value))}
                    defaultValue={field.value?.toString()}
                  >
                    <FormControl>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Select Bathrooms" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {[...Array(10)].map((_, i) => {
                        const count = i + 1;
                        return (
                          <SelectItem key={count} value={count.toString()}>
                            {count}
                          </SelectItem>
                        );
                      })}
                      <SelectItem value="10">10+</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="balconies"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">Balconies*</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(parseInt(value))}
                    defaultValue={field.value?.toString()}
                  >
                    <FormControl>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Select Balconies" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="0">0</SelectItem>
                      {[...Array(10)].map((_, i) => {
                        const count = i + 1;
                        return (
                          <SelectItem key={count} value={count.toString()}>
                            {count}
                          </SelectItem>
                        );
                      })}
                      <SelectItem value="10">10+</SelectItem>
                    </SelectContent>
                  </Select>
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
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Parking */}
          <FormField
            control={form.control}
            name="parkingType"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium">Parking</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Select Parking Type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="No Parking">No Parking</SelectItem>
                    <SelectItem value="1 Covered">1 Covered</SelectItem>
                    <SelectItem value="2 Covered">2 Covered</SelectItem>
                    <SelectItem value="3 Covered">3 Covered</SelectItem>
                    <SelectItem value="1 Open">1 Open</SelectItem>
                    <SelectItem value="2 Open">2 Open</SelectItem>
                    <SelectItem value="3 Open">3 Open</SelectItem>
                    <SelectItem value="1 Covered + 1 Open">1 Covered + 1 Open</SelectItem>
                    <SelectItem value="2 Covered + 1 Open">2 Covered + 1 Open</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Other Features */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Other Features</h3>
            <div className="flex gap-4">
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
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-6">
            <Button type="button" variant="outline" onClick={onBack} className="h-12 px-8">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
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

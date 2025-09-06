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
import { Phone } from 'lucide-react';

const propertyDetailsSchema = z.object({
  title: z.string().min(1, "Property name is required"),
  propertyType: z.string().optional(),
  bhkType: z.string().optional(),
  buildingType: z.string().optional(),
  propertyAge: z.string().optional(),
  floorType: z.string().optional(),
  totalFloors: z.union([z.number(), z.string()]).optional(),
  floorNo: z.union([z.number(), z.string()]).optional(),
  furnishingStatus: z.string().optional(),
  bathrooms: z.number().optional(),
  balconies: z.number().optional(),
  parkingType: z.string().optional(),
  superBuiltUpArea: z.number().min(1, "Super built up area is required and must be greater than 0"),
  onMainRoad: z.boolean().optional(),
  cornerProperty: z.boolean().optional(),
});

type PropertyDetailsFormData = z.infer<typeof propertyDetailsSchema>;

interface PropertyDetailsStepProps {
  initialData?: Partial<PropertyDetails>;
  onNext: (data: PropertyDetails) => void;
  onBack: () => void;
  currentStep: number;
  totalSteps: number;
}

export const PropertyDetailsStep: React.FC<PropertyDetailsStepProps> = ({
  initialData = {},
  onNext,
  onBack,
  currentStep,
  totalSteps
}) => {
  const form = useForm<PropertyDetailsFormData>({
    resolver: zodResolver(propertyDetailsSchema),
    defaultValues: {
      title: initialData.title || '',
      propertyType: initialData.propertyType || '',
      bhkType: initialData.bhkType || '',
      buildingType: initialData.buildingType || '',
      propertyAge: initialData.propertyAge || '',
      floorType: initialData.floorType || '',
      totalFloors: initialData.totalFloors || 1,
      floorNo: initialData.floorNo || 0,
      furnishingStatus: initialData.furnishingStatus || '',
      bathrooms: initialData.bathrooms || 0,
      balconies: initialData.balconies || 0,
      parkingType: initialData.parkingType || '',
      superBuiltUpArea: initialData.superBuiltUpArea ?? undefined,
      onMainRoad: initialData.onMainRoad || false,
      cornerProperty: initialData.cornerProperty || false,
    },
  });


  const onSubmit = (data: PropertyDetailsFormData) => {
    console.log('PropertyDetailsStep submitting data:', data);
    console.log('Bathrooms value:', data.bathrooms, 'Type:', typeof data.bathrooms);
    
    // Pass the form data merged with initial data to maintain all PropertyDetails fields
    onNext({
      ...initialData, // Keep existing fields like title, bhkType, etc.
      ...data,
      onMainRoad: data.onMainRoad || false,
      cornerProperty: data.cornerProperty || false,
    } as PropertyDetails);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
      <h1 className="text-2xl font-semibold text-primary mb-6">Property Details</h1>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Property Name */}
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium">Name of Property *</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g., Luxury 2BHK Apartment in Prime Location"
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
                  <FormLabel className="text-sm font-medium">Property Type</FormLabel>
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
                  <FormLabel className="text-sm font-medium">BHK Type</FormLabel>
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

          {/* Property Age, Floor, Total Floors */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FormField
              control={form.control}
              name="propertyAge"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">Property Age</FormLabel>
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
                  <FormLabel className="text-sm font-medium">Floor</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      if (value === 'ground') {
                        field.onChange(0);
                      } else if (value === 'basement') {
                        field.onChange('basement');
                      } else {
                        field.onChange(parseInt(value));
                      }
                    }}
                    value={field.value === undefined ? undefined : field.value.toString()}
                  >
                    <FormControl>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Select Floor" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="basement">Basement</SelectItem>
                      <SelectItem value="ground">Ground Floor</SelectItem>
                      {[...Array(50)].map((_, i) => {
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

            <FormField
              control={form.control}
              name="totalFloors"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">Total Floors</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(parseInt(value))}
                    defaultValue={field.value?.toString()}
                  >
                    <FormControl>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Select Total Floors" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {[...Array(50)].map((_, i) => {
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
          </div>

          {/* Super Built Up Area, Bathrooms, Balconies */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FormField
              control={form.control}
              name="superBuiltUpArea"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">Super Built Up Area</FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="1500"
                        className="h-12 pr-12 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]"
                        {...field}
                        onChange={(e) => field.onChange(e.target.value === '' ? undefined : parseInt(e.target.value, 10))}
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
              name="bathrooms"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">Bathrooms</FormLabel>
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
                  <FormLabel className="text-sm font-medium">Balconies</FormLabel>
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
                      {[...Array(6)].map((_, i) => {
                        const count = i;
                        return (
                          <SelectItem key={count} value={count.toString()}>
                            {count}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Furnishing Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="furnishingStatus"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">Furnishing Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Select Furnishing Status" />
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

            <FormField
              control={form.control}
              name="parkingType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">Parking</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Select Parking" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Covered">Covered</SelectItem>
                      <SelectItem value="Open">Open</SelectItem>
                      <SelectItem value="Both">Both</SelectItem>
                      <SelectItem value="None">None</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>


          {/* Help Section */}
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Phone className="h-5 w-5 text-orange-600" />
              <span className="text-sm text-gray-700">Don't want to fill all the details? Let us help you!</span>
            </div>
            <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white">
              I'm interested
            </Button>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-6">
            <Button type="button" variant="outline" onClick={onBack} className="h-12 px-8">
              Back
            </Button>
            <Button type="submit" className="h-12 px-8">
              Save & Continue
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

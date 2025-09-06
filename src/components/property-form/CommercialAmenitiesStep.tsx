import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { CommercialAmenities } from '@/types/property';

const commercialAmenitiesSchema = z.object({
  powerBackup: z.string().optional(),
  lift: z.string().optional(),
  parking: z.string().optional(),
  washrooms: z.string().optional(),
  waterStorageFacility: z.string().optional(),
  security: z.string().optional(),
  currentPropertyCondition: z.string().optional(),
  currentBusiness: z.string().optional(),
  moreSimilarUnits: z.boolean().optional(),
  directionsTip: z.string().optional(),
});

type CommercialAmenitiesForm = z.infer<typeof commercialAmenitiesSchema>;

interface CommercialAmenitiesStepProps {
  initialData?: Partial<CommercialAmenities>;
  onNext: (data: CommercialAmenities) => void;
  onBack: () => void;
  currentStep: number;
  totalSteps: number;
}

export const CommercialAmenitiesStep: React.FC<CommercialAmenitiesStepProps> = ({
  initialData = {},
  onNext,
  onBack,
  currentStep,
  totalSteps
}) => {
  const form = useForm<CommercialAmenitiesForm>({
    resolver: zodResolver(commercialAmenitiesSchema),
    defaultValues: {
      powerBackup: initialData.powerBackup || '',
      lift: initialData.lift || '',
      parking: initialData.parking || '',
      washrooms: initialData.washrooms || '',
      waterStorageFacility: initialData.waterStorageFacility || '',
      security: initialData.security || '',
      currentPropertyCondition: initialData.currentPropertyCondition || '',
      currentBusiness: initialData.currentBusiness || '',
      moreSimilarUnits: initialData.moreSimilarUnits || false,
      directionsTip: initialData.directionsTip || '',
    },
  });

  const onSubmit = (data: CommercialAmenitiesForm) => {
    onNext(data as CommercialAmenities);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <h1 className="text-2xl font-semibold text-primary mb-6">Commercial Amenities & Features</h1>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="powerBackup"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">Power Backup</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-12">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Full">Full Backup</SelectItem>
                          <SelectItem value="Partial">Partial Backup</SelectItem>
                          <SelectItem value="Generator">Generator Available</SelectItem>
                          <SelectItem value="None">No Backup</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="lift"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">Lift</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-12">
                            <SelectValue placeholder="None" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Passenger">Passenger Lift</SelectItem>
                          <SelectItem value="Service">Service Lift</SelectItem>
                          <SelectItem value="Both">Both Available</SelectItem>
                          <SelectItem value="None">None</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="parking"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">Parking</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-12">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Covered">Covered Parking</SelectItem>
                          <SelectItem value="Open">Open Parking</SelectItem>
                          <SelectItem value="Both">Both Available</SelectItem>
                          <SelectItem value="Street">Street Parking</SelectItem>
                          <SelectItem value="None">No Parking</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="washrooms"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">Washroom(s)</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-12">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Private">Private Washrooms</SelectItem>
                          <SelectItem value="Shared">Shared Washrooms</SelectItem>
                          <SelectItem value="Common">Common Washrooms</SelectItem>
                          <SelectItem value="None">None</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="waterStorageFacility"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">Water Storage Facility</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-12">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Overhead Tank">Overhead Tank</SelectItem>
                          <SelectItem value="Underground Tank">Underground Tank</SelectItem>
                          <SelectItem value="Both">Both Available</SelectItem>
                          <SelectItem value="Borewell">Borewell</SelectItem>
                          <SelectItem value="Corporation">Corporation Supply</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="security"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">Security</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-12">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="24x7">24x7 Security</SelectItem>
                          <SelectItem value="Daytime">Daytime Security</SelectItem>
                          <SelectItem value="Access Control">Access Control System</SelectItem>
                          <SelectItem value="None">No Security</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="currentPropertyCondition"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">Current Property Condition?</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-12">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Excellent">Excellent</SelectItem>
                          <SelectItem value="Good">Good</SelectItem>
                          <SelectItem value="Average">Average</SelectItem>
                          <SelectItem value="Needs Renovation">Needs Renovation</SelectItem>
                          <SelectItem value="Under Construction">Under Construction</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="currentBusiness"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">What business is currently running?</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-12">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Office">Office</SelectItem>
                          <SelectItem value="Retail">Retail</SelectItem>
                          <SelectItem value="Restaurant">Restaurant</SelectItem>
                          <SelectItem value="Warehouse">Warehouse</SelectItem>
                          <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                          <SelectItem value="None">No Business Currently</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="moreSimilarUnits"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">Do you have more similar units/properties available?</FormLabel>
                      <div className="flex space-x-4 mt-2">
                        <label className="flex items-center space-x-2">
                          <input
                            type="radio"
                            name="moreSimilarUnits"
                            value="false"
                            checked={field.value === false}
                            onChange={() => field.onChange(false)}
                            className="w-4 h-4"
                          />
                          <span className="text-sm">No</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input
                            type="radio"
                            name="moreSimilarUnits"
                            value="true"
                            checked={field.value === true}
                            onChange={() => field.onChange(true)}
                            className="w-4 h-4"
                          />
                          <span className="text-sm">Yes</span>
                        </label>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="directionsTip"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">
                        Add Directions Tip for your tenants <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">NEW</span>
                      </FormLabel>
                      <p className="text-xs text-gray-500 mb-2">Don't want calls asking location?</p>
                      <p className="text-xs text-gray-600 mb-3">Add directions to reach using landmarks</p>
                      <FormControl>
                        <textarea
                          {...field}
                          placeholder="e.g., Near Metro Station, opposite to shopping mall..."
                          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent min-h-[100px] resize-none"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="flex justify-between pt-6 border-t">
              <Button type="button" variant="outline" onClick={onBack} className="px-8">
                Back
              </Button>
              <Button type="submit" className="px-8">
                Save & Continue ({currentStep}/{totalSteps})
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};
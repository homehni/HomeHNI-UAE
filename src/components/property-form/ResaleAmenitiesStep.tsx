import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { PropertyAmenities } from '@/types/property';

const resaleAmenitiesSchema = z.object({
  powerBackup: z.string().optional(),
  lift: z.string().optional(),
  parking: z.string().optional(),
  waterStorageFacility: z.string().optional(),
  security: z.string().optional(),
  wifi: z.string().optional(),
  currentPropertyCondition: z.string().optional(),
  directionsTip: z.string().optional(),
});

type ResaleAmenitiesForm = z.infer<typeof resaleAmenitiesSchema>;

interface ResaleAmenitiesStepProps {
  initialData?: Partial<PropertyAmenities>;
  onNext: (data: PropertyAmenities) => void;
  onBack: () => void;
}

export const ResaleAmenitiesStep: React.FC<ResaleAmenitiesStepProps> = ({
  initialData = {},
  onNext,
  onBack
}) => {
  const form = useForm<ResaleAmenitiesForm>({
    resolver: zodResolver(resaleAmenitiesSchema),
    defaultValues: {
      powerBackup: initialData.powerBackup || '',
      lift: initialData.lift || '',
      parking: initialData.parking || '',
      waterStorageFacility: initialData.waterStorageFacility || '',
      security: initialData.security || '',
      wifi: initialData.wifi || '',
      currentPropertyCondition: initialData.currentPropertyCondition || '',
      directionsTip: initialData.directionsTip || '',
    },
  });

  const onSubmit = (data: ResaleAmenitiesForm) => {
    onNext(data as PropertyAmenities);
  };

  return (
    <div className="p-6 space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Property Amenities</h2>
        <p className="text-gray-600">Select the amenities available in your property</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="powerBackup"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Power Backup</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select power backup" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="available">Available</SelectItem>
                      <SelectItem value="not-available">Not Available</SelectItem>
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
                  <FormLabel>Lift</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select lift availability" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="available">Available</SelectItem>
                      <SelectItem value="not-available">Not Available</SelectItem>
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
                  <FormLabel>Parking</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select parking" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="covered">Covered</SelectItem>
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="none">No Parking</SelectItem>
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
                  <FormLabel>Water Storage</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select water storage" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="overhead-tank">Overhead Tank</SelectItem>
                      <SelectItem value="underground-tank">Underground Tank</SelectItem>
                      <SelectItem value="both">Both</SelectItem>
                      <SelectItem value="none">None</SelectItem>
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
                  <FormLabel>Security</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select security" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="24x7">24x7 Security</SelectItem>
                      <SelectItem value="daytime">Daytime Security</SelectItem>
                      <SelectItem value="none">No Security</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="wifi"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>WiFi</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select WiFi availability" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="available">Available</SelectItem>
                      <SelectItem value="not-available">Not Available</SelectItem>
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
                  <FormLabel>Property Condition</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select condition" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="excellent">Excellent</SelectItem>
                      <SelectItem value="good">Good</SelectItem>
                      <SelectItem value="average">Average</SelectItem>
                      <SelectItem value="needs-renovation">Needs Renovation</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="directionsTip"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Directions to Property</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Provide helpful directions to reach your property..."
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

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
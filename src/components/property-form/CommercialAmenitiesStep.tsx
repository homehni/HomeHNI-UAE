import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { CommercialAmenities } from '@/types/property';

const commercialAmenitiesSchema = z.object({
  powerBackup: z.string().optional(),
  lift: z.string().optional(),
  parking: z.string().optional(),
  waterStorageFacility: z.string().optional(),
  security: z.string().optional(),
  currentPropertyCondition: z.string().optional(),
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
      waterStorageFacility: initialData.waterStorageFacility || '',
      security: initialData.security || '',
      currentPropertyCondition: initialData.currentPropertyCondition || '',
      directionsTip: initialData.directionsTip || '',
    },
  });

  const onSubmit = (data: CommercialAmenitiesForm) => {
    onNext(data as CommercialAmenities);
  };

  return (
    <div className="bg-background p-6">
      <div className="text-left mb-8">
        <h1 className="text-2xl font-semibold text-red-600 mb-2">Amenities & Features</h1>
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
                        <SelectItem value="covered">Covered Parking</SelectItem>
                        <SelectItem value="open">Open Parking</SelectItem>
                        <SelectItem value="none">No Parking</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="waterStorageFacility"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Water Storage Facility</FormLabel>
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
                        <SelectItem value="24x7-security">24x7 Security</SelectItem>
                        <SelectItem value="daytime-security">Daytime Security</SelectItem>
                        <SelectItem value="none">None</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="currentPropertyCondition"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Property Condition</FormLabel>
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
                        <SelectItem value="below-average">Below Average</SelectItem>
                      </SelectContent>
                    </Select>
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
                </FormItem>
              )}
            />

            <div className="flex justify-between" style={{ visibility: 'hidden' }}>
              <Button type="button" variant="outline" onClick={onBack}>
                Back
              </Button>
              <Button type="submit">
                Next: Gallery ({currentStep + 1}/{totalSteps})
              </Button>
            </div>
          </form>
        </Form>
    </div>
  );
};
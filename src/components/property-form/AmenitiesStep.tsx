import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { PropertyAmenities } from '@/types/property';
import { Minus, Plus, Phone, MapPin } from 'lucide-react';

const amenitiesSchema = z.object({
  bathrooms: z.number().optional(),
  balconies: z.number().optional(),
  waterStorageFacility: z.string().optional(),
  petAllowed: z.boolean().optional(),
  nonVegAllowed: z.boolean().optional(),
  gym: z.boolean().optional(),
  gatedSecurity: z.boolean().optional(),
  whoWillShowProperty: z.string().optional(),
  currentPropertyCondition: z.string().optional(),
  secondaryNumber: z.string().optional(),
  directionsTip: z.string().optional(),
});

interface AmenitiesStepProps {
  initialData?: Partial<PropertyAmenities>;
  onNext: (data: PropertyAmenities) => void;
  onBack: () => void;
  currentStep?: number;
  totalSteps?: number;
}

export const AmenitiesStep: React.FC<AmenitiesStepProps> = ({
  initialData = {},
  onNext,
  onBack,
  currentStep = 5,
  totalSteps = 8
}) => {
  const [bathrooms, setBathrooms] = useState(initialData.bathrooms || 0);
  const [balconies, setBalconies] = useState(initialData.balconies || 0);

  const form = useForm<PropertyAmenities>({
    resolver: zodResolver(amenitiesSchema),
    defaultValues: {
      bathrooms: initialData.bathrooms || 0,
      balconies: initialData.balconies || 0,
      waterStorageFacility: initialData.waterStorageFacility || '',
      petAllowed: initialData.petAllowed || false,
      nonVegAllowed: initialData.nonVegAllowed || false,
      gym: initialData.gym || false,
      gatedSecurity: initialData.gatedSecurity || false,
      whoWillShowProperty: initialData.whoWillShowProperty || '',
      currentPropertyCondition: initialData.currentPropertyCondition || '',
      secondaryNumber: initialData.secondaryNumber || '',
      directionsTip: initialData.directionsTip || '',
    },
  });

  const onSubmit = (data: PropertyAmenities) => {
    console.log('AmenitiesStep submitting data:', data);
    onNext(data);
  };

  return (
    <div className="bg-background rounded-lg border p-8">
      <h1 className="text-2xl font-semibold text-primary mb-6">
        Provide additional details about your property to get maximum visibility
      </h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Bathroom(s) and Balcony */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="bathrooms"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bathroom(s)*</FormLabel>
                  <div className="flex items-center gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="w-8 h-8 p-0"
                      onClick={() => {
                        const newValue = Math.max(0, bathrooms - 1);
                        setBathrooms(newValue);
                        field.onChange(newValue);
                      }}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="min-w-[2rem] text-center font-medium">{bathrooms}</span>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="w-8 h-8 p-0"
                      onClick={() => {
                        const newValue = bathrooms + 1;
                        setBathrooms(newValue);
                        field.onChange(newValue);
                      }}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="balconies"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Balcony</FormLabel>
                  <div className="flex items-center gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="w-8 h-8 p-0"
                      onClick={() => {
                        const newValue = Math.max(0, balconies - 1);
                        setBalconies(newValue);
                        field.onChange(newValue);
                      }}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="min-w-[2rem] text-center font-medium">{balconies}</span>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="w-8 h-8 p-0"
                      onClick={() => {
                        const newValue = balconies + 1;
                        setBalconies(newValue);
                        field.onChange(newValue);
                      }}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Water Supply */}
          <FormField
            control={form.control}
            name="waterStorageFacility"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Water Supply</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="borewell">Borewell</SelectItem>
                    <SelectItem value="corporation">Corporation</SelectItem>
                    <SelectItem value="both">Both</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Directions Tip */}
          <FormField
            control={form.control}
            name="directionsTip"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Add Directions Tip for your tenants <span className="bg-red-500 text-white text-xs px-2 py-1 rounded">NEW</span>
                </FormLabel>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <div className="flex items-start space-x-2">
                    <MapPin className="h-4 w-4 text-blue-600 mt-1" />
                    <div>
                      <p className="text-sm text-blue-800">Don't want calls asking location?</p>
                      <p className="text-sm text-blue-600">Add directions to reach using landmarks</p>
                    </div>
                  </div>
                </div>
                <FormControl>
                  <Textarea
                    placeholder="Eg. Take the road opposite to Amrita College, take right after 300m..."
                    {...field}
                    rows={4}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-between pt-6">
            <Button type="button" variant="outline" onClick={onBack} className="h-12 px-8">
              Back
            </Button>
            <Button type="submit" className="h-12 px-8 bg-red-500 hover:bg-red-600 text-white">
              Save & Continue
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
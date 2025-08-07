import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LocationDetails } from '@/types/property';
import { ArrowLeft, ArrowRight } from 'lucide-react';

const locationDetailsSchema = z.object({
  state: z.string().min(1, 'Please select state'),
  city: z.string().min(1, 'Please select city'),
  locality: z.string().min(1, 'Please enter locality'),
  landmark: z.string().optional(),
});

type LocationDetailsFormData = z.infer<typeof locationDetailsSchema>;

interface LocationDetailsStepProps {
  initialData?: Partial<LocationDetails>;
  onNext: (data: LocationDetails) => void;
  onBack: () => void;
  currentStep: number;
  totalSteps: number;
}

export const LocationDetailsStep: React.FC<LocationDetailsStepProps> = ({
  initialData = {},
  onNext,
  onBack,
  currentStep,
  totalSteps
}) => {
  const [statesData, setStatesData] = useState<any>({});
  const [cities, setCities] = useState<string[]>([]);

  const form = useForm<LocationDetailsFormData>({
    resolver: zodResolver(locationDetailsSchema),
    defaultValues: {
      state: initialData.state || '',
      city: initialData.city || '',
      locality: initialData.locality || '',
      landmark: initialData.landmark || '',
    },
  });

  const selectedState = form.watch('state');

  useEffect(() => {
    const loadStatesData = async () => {
      try {
        const response = await fetch('/data/india_states_cities.json');
        const data = await response.json();
        setStatesData(data);
      } catch (error) {
        console.error('Error loading states data:', error);
      }
    };
    loadStatesData();
  }, []);

  useEffect(() => {
    if (selectedState && statesData[selectedState]) {
      setCities(statesData[selectedState]);
      // Reset city if current city is not in the new state
      const currentCity = form.getValues('city');
      if (currentCity && !statesData[selectedState].includes(currentCity)) {
        form.setValue('city', '');
      }
    } else {
      setCities([]);
    }
  }, [selectedState, statesData, form]);

  const handleStateChange = (value: string) => {
    form.setValue('state', value);
    form.setValue('city', ''); // Reset city when state changes
  };

  const onSubmit = (data: LocationDetailsFormData) => {
    // Convert to LocationDetails format and add missing fields as empty/default values
    const locationData: LocationDetails = {
      ...data,
      pincode: initialData.pincode || '',
      societyName: initialData.societyName || ''
    };
    onNext(locationData);
  };

  const stateNames = Object.keys(statesData);

  return (
    <div className="ml-80 p-6 space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Location Details</h2>
        <p className="text-gray-600">Tell us where your property is located</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* State and City */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="state"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">State*</FormLabel>
                  <Select onValueChange={handleStateChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Select State" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {stateNames.map((state) => (
                        <SelectItem key={state} value={state}>
                          {state}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">City*</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Select City" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {cities.map((city) => (
                        <SelectItem key={city} value={city}>
                          {city}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Locality/Area and Landmark */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="locality"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">Locality/Area*</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Sector 12, Koramangala"
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
              name="landmark"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">Landmark (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Near Metro Station"
                      className="h-12"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-6">
            <Button type="button" variant="outline" onClick={onBack} className="h-12 px-8">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <Button type="submit" className="h-12 px-8">
              Save & Continue
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LocationDetails } from '@/types/property';

const commercialLocationDetailsSchema = z.object({
  state: z.string().min(1, 'Please select a state'),
  city: z.string().min(1, 'Please select a city'),
  locality: z.string().min(1, 'Locality is required'),
  landmark: z.string().optional(),
  pincode: z.string().min(6, 'Enter valid pincode').max(6, 'Enter valid pincode'),
});

type CommercialLocationDetailsForm = z.infer<typeof commercialLocationDetailsSchema>;

interface CommercialLocationDetailsStepProps {
  initialData?: Partial<LocationDetails>;
  onNext: (data: LocationDetails) => void;
  onBack: () => void;
  currentStep: number;
  totalSteps: number;
}

export const CommercialLocationDetailsStep: React.FC<CommercialLocationDetailsStepProps> = ({
  initialData = {},
  onNext,
  onBack,
  currentStep,
  totalSteps
}) => {
  const [statesData, setStatesData] = useState<any>({});
  const [cities, setCities] = useState<string[]>([]);

  const form = useForm<CommercialLocationDetailsForm>({
    resolver: zodResolver(commercialLocationDetailsSchema),
    defaultValues: {
      state: initialData.state || '',
      city: initialData.city || '',
      locality: initialData.locality || '',
      landmark: initialData.landmark || '',
      pincode: initialData.pincode || '',
    },
  });

  // Load states and cities data
  useEffect(() => {
    fetch('/data/india_states_cities.json')
      .then(response => response.json())
      .then(data => {
        setStatesData(data);
      })
      .catch(error => console.error('Error loading states data:', error));
  }, []);

  // Update cities when state changes
  useEffect(() => {
    const selectedState = form.watch('state');
    if (selectedState && statesData[selectedState]) {
      setCities(statesData[selectedState]);
    } else {
      setCities([]);
    }
  }, [form.watch('state'), statesData]);

  const handleStateChange = (value: string) => {
    form.setValue('state', value);
    form.setValue('city', ''); // Reset city when state changes
  };

  const onSubmit = (data: CommercialLocationDetailsForm) => {
    onNext(data as LocationDetails);
  };

  const stateNames = Object.keys(statesData);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <h1 className="text-2xl font-semibold text-primary mb-6">Commercial Location Details</h1>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* State and City */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">State *</FormLabel>
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
                    <FormLabel className="text-sm font-medium">City *</FormLabel>
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
                    <FormLabel className="text-sm font-medium">Locality/Area *</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter locality or area name"
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
                    <FormLabel className="text-sm font-medium">Landmark</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter nearby landmark"
                        className="h-12"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Pincode */}
            <FormField
              control={form.control}
              name="pincode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">Pincode *</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter pincode"
                      className="h-12"
                      maxLength={6}
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^0-9]/g, '');
                        field.onChange(value);
                      }}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={onBack}
                className="px-8 py-2"
              >
                Back
              </Button>
              
              <Button 
                type="submit"
                className="px-8 py-2 bg-primary text-white hover:bg-primary/90"
              >
                Save & Continue
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};
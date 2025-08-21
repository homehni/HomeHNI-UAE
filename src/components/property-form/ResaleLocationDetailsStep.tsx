import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LocationDetails } from '@/types/property';
const resaleLocationSchema = z.object({
  state: z.string().optional(),
  city: z.string().optional(),
  locality: z.string().optional(),
  landmark: z.string().optional()
});

type ResaleLocationData = z.infer<typeof resaleLocationSchema>;

interface ResaleLocationDetailsStepProps {
  initialData?: Partial<LocationDetails>;
  onNext: (data: LocationDetails) => void;
  onBack: () => void;
}
interface StateCity {
  [key: string]: string[];
}
export const ResaleLocationDetailsStep: React.FC<ResaleLocationDetailsStepProps> = ({
  initialData = {},
  onNext,
  onBack
}) => {
  const [statesCities, setStatesCities] = useState<StateCity>({});
  const [selectedState, setSelectedState] = useState<string>(initialData.state || '');
  const form = useForm<ResaleLocationData>({
    resolver: zodResolver(resaleLocationSchema),
    defaultValues: {
      state: initialData.state || '',
      city: initialData.city || '',
      locality: initialData.locality || '',
      landmark: initialData.landmark || ''
    }
  });
  useEffect(() => {
    fetch('/data/india_states_cities.json').then(response => response.json()).then(data => setStatesCities(data)).catch(error => console.error('Error loading states and cities:', error));
  }, []);
  const onSubmit = (data: ResaleLocationData) => {
    // Add required fields with defaults to match LocationDetails interface
    const locationData: LocationDetails = {
      state: data.state || '',
      city: data.city || '',
      locality: data.locality || '',
      landmark: data.landmark || '',
      pincode: '',
      societyName: ''
    };
    onNext(locationData);
  };
  const handleStateChange = (state: string) => {
    setSelectedState(state);
    form.setValue('state', state);
    form.setValue('city', '');
  };
  return <div className="max-w-4xl">
      <div className="bg-background rounded-lg border p-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-2">Property Location</h2>
          <p className="text-muted-foreground">Where is your property located?</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* State */}
              <FormField control={form.control} name="state" render={({
              field
            }) => <FormItem>
                    <FormLabel>State</FormLabel>
                    <Select onValueChange={handleStateChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select State" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.keys(statesCities).map(state => <SelectItem key={state} value={state}>
                            {state}
                          </SelectItem>)}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>} />

              {/* City */}
              <FormField control={form.control} name="city" render={({
              field
            }) => <FormItem>
                    <FormLabel>City</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select City" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {selectedState && statesCities[selectedState]?.map(city => <SelectItem key={city} value={city}>
                            {city}
                          </SelectItem>)}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>} />

              {/* Locality */}
              <FormField control={form.control} name="locality" render={({
              field
            }) => <FormItem>
                    <FormLabel>Locality/Area</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Koramangala, Bandra West" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>} />

              {/* Landmark */}
              <FormField control={form.control} name="landmark" render={({
              field
            }) => <FormItem>
                    <FormLabel>Landmark</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Near City Mall, Metro Station" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>} />
            </div>

            <div className="flex justify-between pt-6">
              <Button type="button" variant="outline" onClick={onBack} className="bg-muted text-muted-foreground">
                Back
              </Button>
              <Button type="submit" className="bg-primary text-primary-foreground">
                Save & Continue
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>;
};
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { LocationDetails } from '@/types/property';

const commercialSaleLocationDetailsSchema = z.object({
  state: z.string().min(1, 'State is required'),
  city: z.string().min(1, 'City is required'),
  locality: z.string().min(1, 'Locality is required'),
  landmark: z.string().optional(),
  pincode: z.string().min(6, 'Valid pincode is required').max(6, 'Pincode must be 6 digits'),
  societyName: z.string().optional(),
});

type CommercialSaleLocationDetailsForm = z.infer<typeof commercialSaleLocationDetailsSchema>;

interface CommercialSaleLocationDetailsStepProps {
  initialData?: Partial<LocationDetails>;
  onNext: (data: Partial<LocationDetails>) => void;
  onBack: () => void;
  currentStep: number;
  totalSteps: number;
}

export const CommercialSaleLocationDetailsStep = ({
  initialData,
  onNext,
  onBack,
  currentStep,
  totalSteps
}: CommercialSaleLocationDetailsStepProps) => {
  const [rawData, setRawData] = useState<Record<string, string[]>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [selectedState, setSelectedState] = useState<string>(initialData?.state || '');

  const form = useForm<CommercialSaleLocationDetailsForm>({
    resolver: zodResolver(commercialSaleLocationDetailsSchema),
    defaultValues: {
      state: initialData?.state || '',
      city: initialData?.city || '',
      locality: initialData?.locality || '',
      landmark: initialData?.landmark || '',
      pincode: initialData?.pincode || '',
      societyName: initialData?.societyName || '',
    },
  });

  // Transform raw JSON data to the format we need
  const statesData = useMemo(() => {
    if (!rawData || Object.keys(rawData).length === 0) return [];
    return Object.keys(rawData).map(stateName => ({
      state: stateName,
      districts: rawData[stateName]
    }));
  }, [rawData]);

  // Get cities for selected state
  const cities = useMemo(() => {
    if (!selectedState || !rawData[selectedState]) return [];
    return rawData[selectedState];
  }, [selectedState, rawData]);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        console.log('Loading states data...');
        const response = await fetch('/data/india_states_cities.json');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Raw data loaded:', data);
        setRawData(data);
      } catch (error) {
        console.error('Error loading states data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const handleStateChange = useCallback((value: string) => {
    console.log('State changed to:', value);
    setSelectedState(value);
    form.setValue('state', value);
    form.setValue('city', ''); // Reset city when state changes
  }, [form]);

  const onSubmit = useCallback((data: CommercialSaleLocationDetailsForm) => {
    console.log('Form submitted with data:', data);
    onNext(data);
  }, [onNext]);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Location Details</h2>
          <p className="text-gray-600">Loading location data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Location Details</h2>
        <p className="text-gray-600">Where is your commercial property located?</p>
        <div className="mt-4 text-sm text-gray-500">
          Step {currentStep} of {totalSteps}
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="state"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>State *</FormLabel>
                  <Select onValueChange={handleStateChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {statesData.map((state) => (
                        <SelectItem key={state.state} value={state.state}>
                          {state.state}
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
                  <FormLabel>City *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select city" />
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

          <FormField
            control={form.control}
            name="locality"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Locality/Area *</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Connaught Place, MG Road" {...field} />
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
                <FormLabel>Landmark (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Near Metro Station, Opposite Mall" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="pincode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pincode *</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., 110001" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="societyName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Building/Complex Name (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Business Plaza, Commercial Complex" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

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
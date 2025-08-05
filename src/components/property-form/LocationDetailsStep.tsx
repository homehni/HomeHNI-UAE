import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LocationDetails } from '@/types/property';
import { Home, MapPin, Building, Sparkles, Camera, FileText, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

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

  const onSubmit = (data: LocationDetailsFormData) => {
    // Convert to LocationDetails format and add missing fields as empty/default values
    const locationData: LocationDetails = {
      ...data,
      pincode: initialData.pincode || '',
      societyName: initialData.societyName || ''
    };
    onNext(locationData);
  };

  const steps = [
    { icon: Home, label: 'Property Details', active: currentStep === 2 },
    { icon: MapPin, label: 'Location Details', active: currentStep === 3 },
    { icon: Building, label: 'Rental Details', active: currentStep === 4 },
    { icon: Sparkles, label: 'Amenities', active: currentStep === 5 },
    { icon: Camera, label: 'Gallery', active: currentStep === 6 },
    { icon: FileText, label: 'Additional Information', active: currentStep === 7 },
    { icon: Calendar, label: 'Schedule', active: currentStep === 8 },
  ];

  const progressPercentage = Math.round((currentStep / totalSteps) * 100);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Home className="h-6 w-6 text-primary" />
            <span className="text-lg font-semibold">PropertyHub</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">{progressPercentage}% Done</span>
            <Button variant="outline" size="sm">Preview</Button>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white border-r border-gray-200 min-h-screen">
          <div className="p-6">
            <nav className="space-y-2">
              {steps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <div
                    key={step.label}
                    className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                      step.active
                        ? 'bg-primary/10 text-primary border-l-4 border-primary'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="text-sm font-medium">{step.label}</span>
                  </div>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
              <h1 className="text-2xl font-semibold text-primary mb-6">Location Details</h1>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="state"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>State</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select state" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {Object.keys(statesData).map((state) => (
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
                          <FormLabel>City</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                            disabled={!selectedState}
                          >
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

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="locality"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Locality/Area</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Sector 12, Koramangala" {...field} />
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
                            <Input placeholder="e.g., Near Metro Station" {...field} />
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
          </div>
        </div>
      </div>
    </div>
  );
};
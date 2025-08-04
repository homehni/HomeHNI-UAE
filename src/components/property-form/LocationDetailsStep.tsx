import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LocationDetails } from '@/types/property';
import { MapPin, Phone, Eye, CheckCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const locationDetailsSchema = z.object({
  state: z.string().min(1, 'Please select state'),
  city: z.string().min(1, 'Please select city'),
  locality: z.string().min(1, 'Please enter locality'),
  pincode: z.string().min(6, 'Please enter valid pincode'),
  societyName: z.string().optional(),
  landmark: z.string().optional(),
});

interface LocationDetailsStepProps {
  initialData?: Partial<LocationDetails>;
  onNext: (data: LocationDetails) => void;
  onBack: () => void;
}

export const LocationDetailsStep: React.FC<LocationDetailsStepProps> = ({
  initialData = {},
  onNext,
  onBack
}) => {
  const [statesData, setStatesData] = useState<any>({});
  const [cities, setCities] = useState<string[]>([]);

  const form = useForm<LocationDetails>({
    resolver: zodResolver(locationDetailsSchema),
    defaultValues: {
      state: initialData.state || '',
      city: initialData.city || '',
      locality: initialData.locality || '',
      pincode: initialData.pincode || '',
      societyName: initialData.societyName || '',
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

  const onSubmit = (data: LocationDetails) => {
    onNext(data);
  };

  const steps = [
    { id: 1, title: "Owner Details", completed: true },
    { id: 2, title: "Property Details", completed: true },
    { id: 3, title: "Location Details", completed: false, current: true },
    { id: 4, title: "Rental Details", completed: false },
    { id: 5, title: "Amenities", completed: false },
    { id: 6, title: "Gallery", completed: false },
    { id: 7, title: "Additional Info", completed: false },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-foreground">Post Property for FREE</h1>
              <div className="text-sm text-muted-foreground">
                Step 3 of 7 • 42% Complete
              </div>
            </div>
            <Button variant="outline" size="sm">
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="flex gap-8">
          {/* Sidebar */}
          <div className="w-80 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Form Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {steps.map((step) => (
                    <div key={step.id} className="flex items-center space-x-3">
                      <div className={`flex h-8 w-8 items-center justify-center rounded-full border-2 ${
                        step.completed 
                          ? 'bg-primary border-primary text-primary-foreground' 
                          : step.current 
                          ? 'border-primary text-primary' 
                          : 'border-muted-foreground text-muted-foreground'
                      }`}>
                        {step.completed ? (
                          <CheckCircle className="h-4 w-4" />
                        ) : (
                          <span className="text-sm font-medium">{step.id}</span>
                        )}
                      </div>
                      <span className={`text-sm ${
                        step.current ? 'font-medium text-foreground' : 'text-muted-foreground'
                      }`}>
                        {step.title}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Help Section */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start space-x-3">
                  <Phone className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <p className="text-sm text-muted-foreground mb-3">
                      Don't want to fill all the details! Let us help you!
                    </p>
                    <Button className="w-full" size="sm">
                      I'm interested
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Location Details</CardTitle>
                <CardDescription>Where is your property located?</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Map Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Mark Locality on Map</h3>
                  <div className="relative">
                    <div className="h-64 bg-muted rounded-lg border-2 border-dashed border-muted-foreground/25 flex items-center justify-center">
                      <div className="text-center">
                        <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                        <p className="text-muted-foreground">Map will be loaded here</p>
                        <p className="text-xs text-muted-foreground">Click to mark your property location</p>
                      </div>
                    </div>
                    <div className="absolute top-4 right-4 bg-card border rounded-lg p-2 max-w-xs">
                      <div className="flex items-start justify-between">
                        <div className="text-xs">
                          <p className="font-medium">269, Phase III, Jubilee Hills</p>
                          <p className="text-muted-foreground">Hyderabad, Telangana 500033</p>
                        </div>
                        <Button variant="ghost" size="sm" className="h-4 w-4 p-0">×</Button>
                      </div>
                    </div>
                  </div>
                </div>

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
                            <FormLabel>Locality</FormLabel>
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
                            <FormLabel>Street/Area</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., Near Metro Station" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="societyName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Society Name (Optional)</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., Prestige Lakeside" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="pincode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Pincode</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., 560034" {...field} />
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
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
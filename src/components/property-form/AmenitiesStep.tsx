import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { PropertyAmenities } from '@/types/property';
import { ProgressIndicator } from './ProgressIndicator';
import { Home, MapPin, Building, Sparkles, Camera, FileText, Calendar, Phone } from 'lucide-react';

const amenitiesSchema = z.object({
  powerBackup: z.string().optional(),
  lift: z.string().optional(),
  parking: z.string().optional(),
  waterStorageFacility: z.string().optional(),
  security: z.string().optional(),
  wifi: z.string().optional(),
  currentPropertyCondition: z.string().optional(),
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
  const form = useForm<PropertyAmenities>({
    resolver: zodResolver(amenitiesSchema),
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

  const onSubmit = (data: PropertyAmenities) => {
    console.log('AmenitiesStep submitting data:', data);
    onNext(data);
  };

  return (
    <div className="bg-background rounded-lg border p-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-2">What You Get</h2>
        <p className="text-muted-foreground">Select the amenities and features included with your property</p>
      </div>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Power Backup */}
                    <FormField
                      control={form.control}
                      name="powerBackup"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Power Backup</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="full">Full Power Backup</SelectItem>
                              <SelectItem value="partial">Partial Power Backup</SelectItem>
                              <SelectItem value="dg-backup">DG Backup</SelectItem>
                              <SelectItem value="no-backup">No Power Backup</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Lift */}
                    <FormField
                      control={form.control}
                      name="lift"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Lift</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="available">Yes</SelectItem>
                              <SelectItem value="not-available">No</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Parking */}
                    <FormField
                      control={form.control}
                      name="parking"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Parking</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="bike">Bike Parking</SelectItem>
                              <SelectItem value="car">Car Parking</SelectItem>
                              <SelectItem value="both">Both</SelectItem>
                              <SelectItem value="none">No Parking</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />


                    {/* Water Storage Facility */}
                    <FormField
                      control={form.control}
                      name="waterStorageFacility"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Water Storage Facility</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="overhead-tank">Overhead Tank</SelectItem>
                              <SelectItem value="underground-tank">Underground Tank</SelectItem>
                              <SelectItem value="both">Both</SelectItem>
                              <SelectItem value="borewell">Borewell</SelectItem>
                              <SelectItem value="none">None</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Security */}
                    <FormField
                      control={form.control}
                      name="security"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Security</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="yes">Yes</SelectItem>
                              <SelectItem value="no">No</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* WiFi */}
                    <FormField
                      control={form.control}
                      name="wifi"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Wifi</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="available">Yes</SelectItem>
                              <SelectItem value="not-available">No</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Current Property Condition */}
                    <FormField
                      control={form.control}
                      name="currentPropertyCondition"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Current Property Condition?</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select" />
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
                            <div className="text-blue-600 mt-1">ℹ️</div>
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
  );
};
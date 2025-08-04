import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PropertyDetails } from '@/types/property';

const propertyDetailsSchema = z.object({
  title: z.string().min(10, 'Title must be at least 10 characters'),
  propertyType: z.string().min(1, 'Please select property type'),
  buildingType: z.string().min(1, 'Please select building type'),
  bhkType: z.string().min(1, 'Please select BHK type'),
  bathrooms: z.number().min(1, 'At least 1 bathroom required'),
  balconies: z.number().min(0, 'Balconies cannot be negative'),
  propertyAge: z.string().min(1, 'Please select property age'),
  totalFloors: z.number().min(1, 'Total floors must be at least 1'),
  floorNo: z.number().min(0, 'Floor number cannot be negative'),
  furnishingStatus: z.string().min(1, 'Please select furnishing status'),
  parkingType: z.string().min(1, 'Please select parking type'),
});

interface PropertyDetailsStepProps {
  initialData?: Partial<PropertyDetails>;
  onNext: (data: PropertyDetails) => void;
  onBack: () => void;
}

export const PropertyDetailsStep: React.FC<PropertyDetailsStepProps> = ({
  initialData = {},
  onNext,
  onBack
}) => {
  const form = useForm<PropertyDetails>({
    resolver: zodResolver(propertyDetailsSchema),
    defaultValues: {
      title: initialData.title || '',
      propertyType: initialData.propertyType || '',
      buildingType: initialData.buildingType || '',
      bhkType: initialData.bhkType || '',
      bathrooms: initialData.bathrooms || 1,
      balconies: initialData.balconies || 0,
      propertyAge: initialData.propertyAge || '',
      totalFloors: initialData.totalFloors || 1,
      floorNo: initialData.floorNo || 0,
      furnishingStatus: initialData.furnishingStatus || '',
      parkingType: initialData.parkingType || '',
    },
  });

  const onSubmit = (data: PropertyDetails) => {
    onNext(data);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Property Details</CardTitle>
        <CardDescription>Tell us more about your property</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Property Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Spacious 3BHK Apartment in Prime Location" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="propertyType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Property Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select property type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Apartment">Apartment</SelectItem>
                        <SelectItem value="Villa">Villa</SelectItem>
                        <SelectItem value="House">House</SelectItem>
                        <SelectItem value="Plot">Plot</SelectItem>
                        <SelectItem value="Office">Office</SelectItem>
                        <SelectItem value="Shop">Shop</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="buildingType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Building Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select building type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="High Rise">High Rise</SelectItem>
                        <SelectItem value="Low Rise">Low Rise</SelectItem>
                        <SelectItem value="Independent">Independent</SelectItem>
                        <SelectItem value="Villa">Villa</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="bhkType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>BHK Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select BHK" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="1 RK">1 RK</SelectItem>
                        <SelectItem value="1 BHK">1 BHK</SelectItem>
                        <SelectItem value="2 BHK">2 BHK</SelectItem>
                        <SelectItem value="3 BHK">3 BHK</SelectItem>
                        <SelectItem value="4 BHK">4 BHK</SelectItem>
                        <SelectItem value="5+ BHK">5+ BHK</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="bathrooms"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bathrooms</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="1" 
                        {...field} 
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="balconies"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Balconies</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="0" 
                        {...field} 
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="propertyAge"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Property Age</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select property age" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Under Construction">Under Construction</SelectItem>
                        <SelectItem value="Ready to Move">Ready to Move</SelectItem>
                        <SelectItem value="1-2 Years">1-2 Years</SelectItem>
                        <SelectItem value="3-5 Years">3-5 Years</SelectItem>
                        <SelectItem value="5-10 Years">5-10 Years</SelectItem>
                        <SelectItem value="10+ Years">10+ Years</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="furnishingStatus"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Furnishing Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select furnishing" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Fully Furnished">Fully Furnished</SelectItem>
                        <SelectItem value="Semi Furnished">Semi Furnished</SelectItem>
                        <SelectItem value="Unfurnished">Unfurnished</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="totalFloors"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Total Floors</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="1" 
                        {...field} 
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="floorNo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Floor Number</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="0" 
                        {...field} 
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="parkingType"
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
                        <SelectItem value="No Parking">No Parking</SelectItem>
                        <SelectItem value="1 Car">1 Car</SelectItem>
                        <SelectItem value="2 Car">2 Car</SelectItem>
                        <SelectItem value="3+ Car">3+ Car</SelectItem>
                        <SelectItem value="2 Wheeler">2 Wheeler</SelectItem>
                        <SelectItem value="Both Car & 2 Wheeler">Both Car & 2 Wheeler</SelectItem>
                      </SelectContent>
                    </Select>
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
                Next: Location Details
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
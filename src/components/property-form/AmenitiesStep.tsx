import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { PropertyAmenities } from '@/types/property';

const amenitiesSchema = z.object({
  basicAmenities: z.array(z.string()),
  societyAmenities: z.array(z.string()),
  locationAdvantages: z.array(z.string()),
});

interface AmenitiesStepProps {
  initialData?: Partial<PropertyAmenities>;
  onNext: (data: PropertyAmenities) => void;
  onBack: () => void;
}

const basicAmenitiesList = [
  'Power Backup', 'Lift', 'Reserved Parking', 'Security/Fire Alarm',
  'Waste Disposal', 'Feng Shui/Vaastu Compliant', 'Internet/Wi-Fi Connectivity',
  'Air Conditioning', 'Balcony', 'High Speed Elevators'
];

const societyAmenitiesList = [
  'Swimming Pool', 'Gymnasium', 'Garden/Park', 'Community Hall',
  'Children Play Area', 'Jogging Track', 'Party Hall', 'Fire Safety',
  'Shopping Centre', 'Gas Pipeline', 'Laundry Service', 'Security Personnel',
  'CCTV Security', 'Maintenance Staff', 'Power Backup', 'Visitor Parking'
];

const locationAdvantagesList = [
  'Close to Metro Station', 'Close to School', 'Close to Hospital',
  'Close to Market', 'Close to Railway Station', 'Close to Airport',
  'Close to Mall', 'Close to Highway', 'Close to Bus Stop'
];

export const AmenitiesStep: React.FC<AmenitiesStepProps> = ({
  initialData = {},
  onNext,
  onBack
}) => {
  const form = useForm<PropertyAmenities>({
    resolver: zodResolver(amenitiesSchema),
    defaultValues: {
      basicAmenities: initialData.basicAmenities || [],
      societyAmenities: initialData.societyAmenities || [],
      locationAdvantages: initialData.locationAdvantages || [],
    },
  });

  const onSubmit = (data: PropertyAmenities) => {
    onNext(data);
  };

  const handleAmenityChange = (
    amenityType: 'basicAmenities' | 'societyAmenities' | 'locationAdvantages',
    amenity: string,
    checked: boolean
  ) => {
    const currentAmenities = form.getValues(amenityType);
    if (checked) {
      form.setValue(amenityType, [...currentAmenities, amenity]);
    } else {
      form.setValue(amenityType, currentAmenities.filter(a => a !== amenity));
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Amenities & Features</CardTitle>
        <CardDescription>Select the amenities available in your property</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Basic Amenities */}
            <FormField
              control={form.control}
              name="basicAmenities"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg font-semibold">Basic Amenities</FormLabel>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                    {basicAmenitiesList.map((amenity) => (
                      <FormItem
                        key={amenity}
                        className="flex flex-row items-start space-x-3 space-y-0"
                      >
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(amenity)}
                            onCheckedChange={(checked) =>
                              handleAmenityChange('basicAmenities', amenity, checked as boolean)
                            }
                          />
                        </FormControl>
                        <FormLabel className="text-sm font-normal">
                          {amenity}
                        </FormLabel>
                      </FormItem>
                    ))}
                  </div>
                </FormItem>
              )}
            />

            {/* Society Amenities */}
            <FormField
              control={form.control}
              name="societyAmenities"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg font-semibold">Society Amenities</FormLabel>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                    {societyAmenitiesList.map((amenity) => (
                      <FormItem
                        key={amenity}
                        className="flex flex-row items-start space-x-3 space-y-0"
                      >
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(amenity)}
                            onCheckedChange={(checked) =>
                              handleAmenityChange('societyAmenities', amenity, checked as boolean)
                            }
                          />
                        </FormControl>
                        <FormLabel className="text-sm font-normal">
                          {amenity}
                        </FormLabel>
                      </FormItem>
                    ))}
                  </div>
                </FormItem>
              )}
            />

            {/* Location Advantages */}
            <FormField
              control={form.control}
              name="locationAdvantages"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg font-semibold">Location Advantages</FormLabel>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                    {locationAdvantagesList.map((amenity) => (
                      <FormItem
                        key={amenity}
                        className="flex flex-row items-start space-x-3 space-y-0"
                      >
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(amenity)}
                            onCheckedChange={(checked) =>
                              handleAmenityChange('locationAdvantages', amenity, checked as boolean)
                            }
                          />
                        </FormControl>
                        <FormLabel className="text-sm font-normal">
                          {amenity}
                        </FormLabel>
                      </FormItem>
                    ))}
                  </div>
                </FormItem>
              )}
            />

            <div className="flex justify-between pt-6">
              <Button type="button" variant="outline" onClick={onBack}>
                Back
              </Button>
              <Button type="submit">
                Next: Gallery
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
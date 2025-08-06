import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { PropertyAmenities } from '@/types/property';

const resaleAmenitiesSchema = z.object({
  powerBackup: z.string().optional(),
  lift: z.string().optional(),
  parking: z.string().optional(),
  waterStorageFacility: z.string().optional(),
  security: z.string().optional(),
  wifi: z.string().optional(),
  currentPropertyCondition: z.string().optional(),
  swimmingPool: z.boolean().optional(),
  gym: z.boolean().optional(),
  clubHouse: z.boolean().optional(),
  garden: z.boolean().optional(),
  playground: z.boolean().optional(),
  intercom: z.boolean().optional(),
  maintenanceStaff: z.boolean().optional(),
  fireSafety: z.boolean().optional(),
  servantRoom: z.boolean().optional(),
  studyRoom: z.boolean().optional(),
  poojaRoom: z.boolean().optional(),
  rainwaterHarvesting: z.boolean().optional(),
  solarPanels: z.boolean().optional(),
  visitorParking: z.boolean().optional(),
});

interface ResaleAmenitiesStepProps {
  initialData?: Partial<PropertyAmenities>;
  onNext: (data: PropertyAmenities) => void;
  onBack: () => void;
}

export const ResaleAmenitiesStep: React.FC<ResaleAmenitiesStepProps> = ({
  initialData = {},
  onNext,
  onBack,
}) => {
  const form = useForm<PropertyAmenities>({
    resolver: zodResolver(resaleAmenitiesSchema),
    defaultValues: {
      powerBackup: initialData.powerBackup || '',
      lift: initialData.lift || '',
      parking: initialData.parking || '',
      waterStorageFacility: initialData.waterStorageFacility || '',
      security: initialData.security || '',
      wifi: initialData.wifi || '',
      currentPropertyCondition: initialData.currentPropertyCondition || '',
      ...initialData,
    },
  });

  const onSubmit = (data: PropertyAmenities) => {
    onNext(data);
  };

  return (
    <div className="max-w-4xl">
      <div className="bg-background rounded-lg border p-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-2">Property Amenities</h2>
          <p className="text-muted-foreground">Select the amenities available in your residential property</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Facilities */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Basic Facilities</h3>
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
                          <SelectItem value="covered">Covered Car Parking</SelectItem>
                          <SelectItem value="open">Open Car Parking</SelectItem>
                          <SelectItem value="bike">Bike Parking Only</SelectItem>
                          <SelectItem value="both">Car & Bike Parking</SelectItem>
                          <SelectItem value="none">No Parking</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Water Storage */}
                <FormField
                  control={form.control}
                  name="waterStorageFacility"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Water Storage</FormLabel>
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
                          <SelectItem value="24x7-security">24x7 Security</SelectItem>
                          <SelectItem value="cctv">CCTV Surveillance</SelectItem>
                          <SelectItem value="both">Security + CCTV</SelectItem>
                          <SelectItem value="gated-community">Gated Community</SelectItem>
                          <SelectItem value="none">No Security</SelectItem>
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
                      <FormLabel>Internet Ready</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="fiber">Fiber Ready</SelectItem>
                          <SelectItem value="broadband">Broadband Ready</SelectItem>
                          <SelectItem value="both">Fiber + Broadband</SelectItem>
                          <SelectItem value="not-available">Not Available</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Property Condition */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Property Status</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="currentPropertyCondition"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Property Condition</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="excellent">Excellent - Move-in Ready</SelectItem>
                          <SelectItem value="good">Good</SelectItem>
                          <SelectItem value="average">Average</SelectItem>
                          <SelectItem value="needs-renovation">Needs Renovation</SelectItem>
                          <SelectItem value="under-construction">Under Construction</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Premium Amenities */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Premium Amenities</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { name: 'swimmingPool', label: 'Swimming Pool' },
                  { name: 'gym', label: 'Gymnasium' },
                  { name: 'clubHouse', label: 'Club House' },
                  { name: 'garden', label: 'Garden/Park' },
                  { name: 'playground', label: 'Children\'s Play Area' },
                  { name: 'intercom', label: 'Intercom' },
                  { name: 'maintenanceStaff', label: 'Maintenance Staff' },
                  { name: 'fireSafety', label: 'Fire Safety' },
                  { name: 'servantRoom', label: 'Servant Room' },
                  { name: 'studyRoom', label: 'Study Room' },
                  { name: 'poojaRoom', label: 'Pooja Room' },
                  { name: 'rainwaterHarvesting', label: 'Rainwater Harvesting' },
                  { name: 'solarPanels', label: 'Solar Panels' },
                  { name: 'visitorParking', label: 'Visitor Parking' },
                ].map((amenity) => (
                  <FormField
                    key={amenity.name}
                    control={form.control}
                    name={amenity.name as keyof PropertyAmenities}
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={!!field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel className="text-sm font-normal cursor-pointer">
                          {amenity.label}
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                ))}
              </div>
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
    </div>
  );
};
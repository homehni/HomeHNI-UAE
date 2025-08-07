import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { CommercialAmenities } from '@/types/property';

const commercialAmenitiesSchema = z.object({
  powerBackup: z.string().optional(),
  lift: z.string().optional(),
  parking: z.string().optional(),
  security: z.string().optional(),
  wifi: z.string().optional(),
  receptionArea: z.boolean().optional(),
  conferenceRoom: z.boolean().optional(),
  cafeteria: z.boolean().optional(),
  restrooms: z.string().optional(),
  hvac: z.string().optional(),
  fireSystem: z.boolean().optional(),
  cctv: z.boolean().optional(),
  internetSpeed: z.string().optional(),
  dedicatedParking: z.number().optional(),
  visitorParking: z.boolean().optional(),
  publicTransport: z.boolean().optional(),
  atm: z.boolean().optional(),
  bank: z.boolean().optional(),
  foodCourt: z.boolean().optional(),
  waterStorageFacility: z.string().optional(),
});

type CommercialAmenitiesForm = z.infer<typeof commercialAmenitiesSchema>;

interface CommercialAmenitiesStepProps {
  initialData?: Partial<CommercialAmenities>;
  onNext: (data: CommercialAmenities) => void;
  onBack: () => void;
  currentStep: number;
  totalSteps: number;
}

export const CommercialAmenitiesStep: React.FC<CommercialAmenitiesStepProps> = ({
  initialData = {},
  onNext,
  onBack,
  currentStep,
  totalSteps
}) => {
  const form = useForm<CommercialAmenitiesForm>({
    resolver: zodResolver(commercialAmenitiesSchema),
    defaultValues: {
      powerBackup: initialData.powerBackup || '',
      lift: initialData.lift || '',
      parking: initialData.parking || '',
      security: initialData.security || '',
      wifi: initialData.wifi || '',
      receptionArea: initialData.receptionArea || false,
      conferenceRoom: initialData.conferenceRoom || false,
      cafeteria: initialData.cafeteria || false,
      restrooms: initialData.restrooms || '',
      hvac: initialData.hvac || '',
      fireSystem: initialData.fireSystem || false,
      cctv: initialData.cctv || false,
      internetSpeed: initialData.internetSpeed || '',
      dedicatedParking: initialData.dedicatedParking || undefined,
      visitorParking: initialData.visitorParking || false,
      publicTransport: initialData.publicTransport || false,
      atm: initialData.atm || false,
      bank: initialData.bank || false,
      foodCourt: initialData.foodCourt || false,
      waterStorageFacility: initialData.waterStorageFacility || '',
    },
  });

  const onSubmit = (data: CommercialAmenitiesForm) => {
    onNext(data as CommercialAmenities);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <h1 className="text-2xl font-semibold text-primary mb-6">Commercial Amenities & Features</h1>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Basic Infrastructure */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Basic Infrastructure</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <FormField
                  control={form.control}
                  name="powerBackup"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">Power Backup</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-12">
                            <SelectValue placeholder="Select Power Backup" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Full">Full Backup</SelectItem>
                          <SelectItem value="Partial">Partial Backup</SelectItem>
                          <SelectItem value="Generator">Generator Available</SelectItem>
                          <SelectItem value="None">No Backup</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="lift"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">Lift/Elevator</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-12">
                            <SelectValue placeholder="Select Lift Type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Passenger">Passenger Lift</SelectItem>
                          <SelectItem value="Service">Service Lift</SelectItem>
                          <SelectItem value="Both">Both Available</SelectItem>
                          <SelectItem value="None">No Lift</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="hvac"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">Air Conditioning</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-12">
                            <SelectValue placeholder="Select AC Type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Central">Central AC</SelectItem>
                          <SelectItem value="Split">Split AC</SelectItem>
                          <SelectItem value="VRV">VRV System</SelectItem>
                          <SelectItem value="Provision">AC Provision</SelectItem>
                          <SelectItem value="None">No AC</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="security"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">Security</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-12">
                            <SelectValue placeholder="Select Security Type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="24x7">24x7 Security</SelectItem>
                          <SelectItem value="Daytime">Daytime Security</SelectItem>
                          <SelectItem value="Access Control">Access Control System</SelectItem>
                          <SelectItem value="None">No Security</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="restrooms"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">Restrooms</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-12">
                            <SelectValue placeholder="Select Restroom Type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Private">Private Restrooms</SelectItem>
                          <SelectItem value="Shared">Shared Restrooms</SelectItem>
                          <SelectItem value="Common">Common Restrooms</SelectItem>
                          <SelectItem value="None">No Restrooms</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="waterStorageFacility"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">Water Storage</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-12">
                            <SelectValue placeholder="Select Water Storage" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Overhead Tank">Overhead Tank</SelectItem>
                          <SelectItem value="Underground Tank">Underground Tank</SelectItem>
                          <SelectItem value="Both">Both Available</SelectItem>
                          <SelectItem value="Borewell">Borewell</SelectItem>
                          <SelectItem value="Corporation">Corporation Supply</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Technology & Connectivity */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Technology & Connectivity</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <FormField
                  control={form.control}
                  name="wifi"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">Internet/WiFi</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-12">
                            <SelectValue placeholder="Select Internet Type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Fiber">Fiber Connection</SelectItem>
                          <SelectItem value="Broadband">Broadband</SelectItem>
                          <SelectItem value="Leased Line">Leased Line</SelectItem>
                          <SelectItem value="Provision">Internet Ready</SelectItem>
                          <SelectItem value="None">No Internet</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="internetSpeed"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">Internet Speed</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-12">
                            <SelectValue placeholder="Select Speed" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="100 Mbps">100 Mbps</SelectItem>
                          <SelectItem value="500 Mbps">500 Mbps</SelectItem>
                          <SelectItem value="1 Gbps">1 Gbps</SelectItem>
                          <SelectItem value="Custom">Custom Speed</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Parking */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Parking</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <FormField
                  control={form.control}
                  name="parking"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">Parking Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-12">
                            <SelectValue placeholder="Select Parking Type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Covered">Covered Parking</SelectItem>
                          <SelectItem value="Open">Open Parking</SelectItem>
                          <SelectItem value="Both">Both Available</SelectItem>
                          <SelectItem value="Street">Street Parking</SelectItem>
                          <SelectItem value="None">No Parking</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="dedicatedParking"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">Dedicated Parking Spaces</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Number of spaces"
                          className="h-12"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || undefined)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Additional Features */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Additional Features</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                <FormField
                  control={form.control}
                  name="receptionArea"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="text-sm">Reception Area</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="conferenceRoom"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="text-sm">Conference Room</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="cafeteria"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="text-sm">Cafeteria</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="fireSystem"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="text-sm">Fire Safety System</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="cctv"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="text-sm">CCTV Surveillance</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="visitorParking"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="text-sm">Visitor Parking</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="publicTransport"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="text-sm">Public Transport Nearby</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="atm"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="text-sm">ATM Nearby</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="bank"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="text-sm">Bank Nearby</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="foodCourt"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="text-sm">Food Court</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onBack}
              >
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
  );
};
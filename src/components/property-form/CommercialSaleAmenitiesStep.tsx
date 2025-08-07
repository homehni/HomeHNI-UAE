import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Key, Plus } from 'lucide-react';
import { CommercialSaleAmenities } from '@/types/property';

const commercialSaleAmenitiesSchema = z.object({
  powerBackup: z.string().min(1, 'Power backup is required'),
  lift: z.string().min(1, 'Lift information is required'),
  parking: z.string().min(1, 'Parking information is required'),
  washrooms: z.string().min(1, 'Washroom information is required'),
  waterStorageFacility: z.string().optional(),
  security: z.boolean().optional(),
  currentPropertyCondition: z.string().optional(),
  currentBusiness: z.string().optional(),
  moreSimilarUnits: z.boolean().optional(),
  directionsTip: z.string().optional(),
});

type CommercialSaleAmenitiesForm = z.infer<typeof commercialSaleAmenitiesSchema>;

interface CommercialSaleAmenitiesStepProps {
  initialData?: Partial<CommercialSaleAmenities>;
  onNext: (data: Partial<CommercialSaleAmenities>) => void;
  onBack: () => void;
  currentStep: number;
  totalSteps: number;
}

export const CommercialSaleAmenitiesStep = ({
  initialData,
  onNext,
  onBack,
  currentStep,
  totalSteps
}: CommercialSaleAmenitiesStepProps) => {
  const form = useForm<CommercialSaleAmenitiesForm>({
    resolver: zodResolver(commercialSaleAmenitiesSchema),
    defaultValues: {
      powerBackup: initialData?.powerBackup || '',
      lift: initialData?.lift || '',
      parking: initialData?.parking || '',
      washrooms: initialData?.washrooms || '',
      waterStorageFacility: initialData?.waterStorageFacility || '',
      security: Boolean(initialData?.security),
      currentPropertyCondition: initialData?.currentPropertyCondition || '',
      currentBusiness: initialData?.currentBusiness || '',
      moreSimilarUnits: initialData?.moreSimilarUnits || false,
      directionsTip: initialData?.directionsTip || '',
    },
  });

  const onSubmit = (data: CommercialSaleAmenitiesForm) => {
    onNext(data);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Amenities & Features</h2>
        <p className="text-gray-600">What amenities does your commercial property offer?</p>
        <div className="mt-4 text-sm text-gray-500">
          Step {currentStep} of {totalSteps}
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="powerBackup"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Key className="h-4 w-4" />
                    Power Backup *
                  </FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="none">No Backup</SelectItem>
                      <SelectItem value="partial">Partial Backup</SelectItem>
                      <SelectItem value="full">Full Backup</SelectItem>
                      <SelectItem value="generator">Generator Available</SelectItem>
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
                  <FormLabel className="flex items-center gap-2">
                    <Key className="h-4 w-4" />
                    Lift *
                  </FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="none">No Lift</SelectItem>
                      <SelectItem value="passenger">Passenger Lift</SelectItem>
                      <SelectItem value="goods">Goods Lift</SelectItem>
                      <SelectItem value="both">Both Available</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="parking"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Key className="h-4 w-4" />
                    Parking *
                  </FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="none">No Parking</SelectItem>
                      <SelectItem value="open">Open Parking</SelectItem>
                      <SelectItem value="covered">Covered Parking</SelectItem>
                      <SelectItem value="basement">Basement Parking</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="washrooms"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Key className="h-4 w-4" />
                    Washroom(s) *
                  </FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="none">No Washrooms</SelectItem>
                      <SelectItem value="shared">Shared Washrooms</SelectItem>
                      <SelectItem value="private">Private Washrooms</SelectItem>
                      <SelectItem value="both">Both Available</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="waterStorageFacility"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Key className="h-4 w-4" />
                    Water Storage Facility
                  </FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="none">No Storage</SelectItem>
                      <SelectItem value="tank">Water Tank</SelectItem>
                      <SelectItem value="borewell">Borewell</SelectItem>
                      <SelectItem value="both">Tank & Borewell</SelectItem>
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
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 pt-8">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Security</FormLabel>
                  </div>
                </FormItem>
              )}
            />
          </div>

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

          <FormField
            control={form.control}
            name="currentBusiness"
            render={({ field }) => (
              <FormItem>
                <FormLabel>What business is currently running?</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="none">No Business</SelectItem>
                    <SelectItem value="restaurant">Restaurant</SelectItem>
                    <SelectItem value="office">Office</SelectItem>
                    <SelectItem value="retail">Retail Store</SelectItem>
                    <SelectItem value="warehouse">Warehouse</SelectItem>
                    <SelectItem value="manufacturing">Manufacturing</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="moreSimilarUnits"
            render={({ field }) => (
              <FormItem className="space-y-4">
                <FormLabel>Do you have more similar units/properties available?</FormLabel>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="no"
                      checked={!field.value}
                      onCheckedChange={(checked) => field.onChange(!checked)}
                    />
                    <label htmlFor="no" className="text-sm font-medium">No</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="yes"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                    <label htmlFor="yes" className="text-sm font-medium">Yes</label>
                  </div>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="directionsTip"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Add Directions Tip for your buyers <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded">NEW</span>
                </FormLabel>
                <div className="text-sm text-gray-600 mb-2">
                  Don't want calls asking location?<br />
                  Add directions to reach using landmarks
                </div>
                <FormControl>
                  <Textarea 
                    placeholder="Provide directions to help visitors find your property easily"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

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
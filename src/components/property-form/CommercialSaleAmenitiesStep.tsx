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
  powerBackup: z.string().optional(),
  lift: z.string().optional(),
  parking: z.string().optional(),
  washrooms: z.string().optional(),
  waterStorageFacility: z.string().optional(),
  security: z.string().optional(),
  currentPropertyCondition: z.string().optional(),
  currentBusiness: z.string().optional(),
  directionsTip: z.string().optional()
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
      security: initialData?.security || '',
      currentPropertyCondition: initialData?.currentPropertyCondition || '',
      currentBusiness: initialData?.currentBusiness || '',
      directionsTip: initialData?.directionsTip || ''
    }
  });
  const onSubmit = (data: CommercialSaleAmenitiesForm) => {
    onNext(data);
  };
  return <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
      <div className="text-left mb-8">
        <h1 className="text-2xl font-semibold text-red-600 mb-2 pt-6 sm:pt-6">Amenities & Features</h1>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField control={form.control} name="powerBackup" render={({
            field
          }) => <FormItem>
                  <FormLabel>Power Backup</FormLabel>
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
                </FormItem>} />

            <FormField control={form.control} name="lift" render={({
            field
          }) => <FormItem>
                  <FormLabel>Lift</FormLabel>
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
                </FormItem>} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField control={form.control} name="parking" render={({
            field
          }) => <FormItem>
                  <FormLabel>Parking</FormLabel>
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
                </FormItem>} />

            <FormField control={form.control} name="washrooms" render={({
            field
          }) => <FormItem>
                  <FormLabel>Washroom(s)</FormLabel>
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
                </FormItem>} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField control={form.control} name="waterStorageFacility" render={({
            field
          }) => <FormItem>
                  <FormLabel>Water Storage Facility</FormLabel>
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
                </FormItem>} />

            <FormField control={form.control} name="security" render={({
            field
          }) => <FormItem>
                  <FormLabel>Security</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="none">No Security</SelectItem>
                      <SelectItem value="guard">Security Guard</SelectItem>
                      <SelectItem value="cctv">CCTV</SelectItem>
                      <SelectItem value="both">Guard & CCTV</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField control={form.control} name="currentPropertyCondition" render={({
            field
          }) => <FormItem>
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
                </FormItem>} />

            <FormField control={form.control} name="currentBusiness" render={({
            field
          }) => <FormItem>
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
                </FormItem>} />
          </div>


          <FormField control={form.control} name="directionsTip" render={({
          field
        }) => <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Add Directions Tip for your buyers <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded">NEW</span>
                </FormLabel>
                <div className="text-sm text-gray-600 mb-2">
                  Don't want calls asking location?<br />
                  Add directions to reach using landmarks
                </div>
                <FormControl>
                  <Textarea placeholder="Provide directions to help visitors find your property easily" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>} />

          {/* Navigation Buttons - Removed, using sticky buttons instead */}
        </form>
      </Form>
    </div>;
};
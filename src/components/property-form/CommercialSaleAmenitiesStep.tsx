import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { CommercialAmenities } from '@/types/property';

const commercialSaleAmenitiesSchema = z.object({
  powerBackup: z.string().optional(),
  lift: z.string().optional(),
  parking: z.string().optional(),
  washrooms: z.string().optional(),
  waterStorageFacility: z.string().optional(),
  security: z.string().optional(),
  wifi: z.string().optional(),
  currentPropertyCondition: z.string().optional(),
  currentBusiness: z.string().optional(),
  moreSimilarUnits: z.boolean().optional(),
  directionsTip: z.string().optional(),
});

type CommercialSaleAmenitiesForm = z.infer<typeof commercialSaleAmenitiesSchema>;

interface CommercialSaleAmenitiesStepProps {
  initialData?: Partial<CommercialAmenities>;
  onNext: (data: Partial<CommercialAmenities>) => void;
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
      wifi: initialData?.wifi || '',
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
                  <FormLabel>Power Backup</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select power backup" />
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
                  <FormLabel>Lift/Elevator</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select lift availability" />
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
                  <FormLabel>Parking</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select parking type" />
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
                  <FormLabel>Washrooms</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select washroom type" />
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
                  <FormLabel>Water Storage</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select water storage" />
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
                <FormItem>
                  <FormLabel>Security</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select security type" />
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
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="wifi"
            render={({ field }) => (
              <FormItem>
                <FormLabel>WiFi/Internet</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select WiFi availability" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="none">No WiFi</SelectItem>
                    <SelectItem value="available">WiFi Available</SelectItem>
                    <SelectItem value="broadband">Broadband Ready</SelectItem>
                    <SelectItem value="fiber">Fiber Connection</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="currentPropertyCondition"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Current Property Condition</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select condition" />
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
                <FormLabel>Current Business (if any)</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Restaurant, Office, Retail Store" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="directionsTip"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Directions/How to Reach</FormLabel>
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
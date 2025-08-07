import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { CommercialSaleDetails } from '@/types/commercialSaleProperty';

const commercialSaleSaleDetailsSchema = z.object({
  listingType: z.literal('Sale'),
  expectedPrice: z.number().min(1, 'Expected price is required'),
  priceNegotiable: z.boolean().optional(),
  pricePerSqFt: z.number().optional(),
  possessionDate: z.string().optional(),
  propertyAge: z.string().min(1, 'Property age is required'),
  registrationStatus: z.enum(['ready_to_move', 'under_construction']),
  homeLoanAvailable: z.boolean().optional(),
  maintenanceCharges: z.number().optional(),
  bookingAmount: z.number().optional(),
  businessType: z.array(z.string()).optional(),
  operatingHours: z.string().optional(),
  restrictedActivities: z.array(z.string()).optional(),
  gst: z.boolean().optional(),
});

type CommercialSaleSaleDetailsForm = z.infer<typeof commercialSaleSaleDetailsSchema>;

interface CommercialSaleSaleDetailsStepProps {
  initialData?: Partial<CommercialSaleDetails>;
  onNext: (data: Partial<CommercialSaleDetails>) => void;
  onBack: () => void;
  currentStep: number;
  totalSteps: number;
}

export const CommercialSaleSaleDetailsStep = ({
  initialData,
  onNext,
  onBack,
  currentStep,
  totalSteps
}: CommercialSaleSaleDetailsStepProps) => {
  const form = useForm<CommercialSaleSaleDetailsForm>({
    resolver: zodResolver(commercialSaleSaleDetailsSchema),
    defaultValues: {
      listingType: 'Sale',
      expectedPrice: initialData?.expectedPrice || 0,
      priceNegotiable: initialData?.priceNegotiable || false,
      pricePerSqFt: initialData?.pricePerSqFt || 0,
      possessionDate: initialData?.possessionDate || '',
      propertyAge: initialData?.propertyAge || '',
      registrationStatus: initialData?.registrationStatus || 'ready_to_move',
      homeLoanAvailable: initialData?.homeLoanAvailable || false,
      maintenanceCharges: initialData?.maintenanceCharges || 0,
      bookingAmount: initialData?.bookingAmount || 0,
      businessType: initialData?.businessType || [],
      operatingHours: initialData?.operatingHours || '',
      restrictedActivities: initialData?.restrictedActivities || [],
      gst: initialData?.gst || false,
    },
  });

  const onSubmit = (data: CommercialSaleSaleDetailsForm) => {
    onNext(data);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Sale Details</h2>
        <p className="text-gray-600">Set your pricing and sale terms</p>
        <div className="mt-4 text-sm text-gray-500">
          Step {currentStep} of {totalSteps}
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="expectedPrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Expected Price (₹) *</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="e.g., 5000000" 
                      value={field.value || ''}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="pricePerSqFt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price per Sq Ft (₹)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="e.g., 2500" 
                      value={field.value || ''}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="propertyAge"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Property Age *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select property age" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="0-1">0-1 Years</SelectItem>
                      <SelectItem value="1-5">1-5 Years</SelectItem>
                      <SelectItem value="5-10">5-10 Years</SelectItem>
                      <SelectItem value="10-15">10-15 Years</SelectItem>
                      <SelectItem value="15-20">15-20 Years</SelectItem>
                      <SelectItem value="20+">20+ Years</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="registrationStatus"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Registration Status *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="ready_to_move">Ready to Move</SelectItem>
                      <SelectItem value="under_construction">Under Construction</SelectItem>
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
              name="possessionDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Possession Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bookingAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Booking Amount (₹)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="e.g., 500000" 
                      value={field.value || ''}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="maintenanceCharges"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Monthly Maintenance Charges (₹)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="e.g., 5000" 
                    value={field.value || ''}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="operatingHours"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Preferred Operating Hours</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., 9 AM to 9 PM" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="businessType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Suitable Business Types (Optional)</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="e.g., Retail, Office, Restaurant, etc. (comma separated)"
                    value={field.value?.join(', ') || ''}
                    onChange={(e) => field.onChange(e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="restrictedActivities"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Restricted Activities (Optional)</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="e.g., No heavy machinery, No loud music, etc. (comma separated)"
                    value={field.value?.join(', ') || ''}
                    onChange={(e) => field.onChange(e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Additional Options</h3>
            
            <FormField
              control={form.control}
              name="priceNegotiable"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Price Negotiable</FormLabel>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="homeLoanAvailable"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Home Loan Available</FormLabel>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="gst"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>GST Applicable</FormLabel>
                  </div>
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
  );
};
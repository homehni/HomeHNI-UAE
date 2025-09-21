import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PriceInput } from '@/components/ui/price-input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { CommercialSaleDetails } from '@/types/commercialSaleProperty';
import { formatPriceDisplay } from '@/utils/priceFormatter';

const commercialSaleSaleDetailsSchema = z.object({
  listingType: z.literal('Sale').optional(),
  expectedPrice: z.number().optional(),
  priceNegotiable: z.boolean().optional(),
  pricePerSqFt: z.number().optional(),
  possessionDate: z.string().optional(),
  ownershipType: z.string().optional(),
  homeLoanAvailable: z.boolean().optional(),
  maintenanceCharges: z.number().optional(),
  bookingAmount: z.number().optional(),
  businessType: z.array(z.string()).optional(),
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
      ownershipType: initialData?.ownershipType || '',
      homeLoanAvailable: initialData?.homeLoanAvailable || false,
      maintenanceCharges: initialData?.maintenanceCharges || 0,
      bookingAmount: initialData?.bookingAmount || 0,
      businessType: initialData?.businessType || [],
      gst: initialData?.gst || false,
    },
  });

  const onSubmit = (data: CommercialSaleSaleDetailsForm) => {
    onNext(data);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
      <h1 className="text-2xl font-semibold text-red-600 mb-6">
        Provide sale details about your commercial property
      </h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="expectedPrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-900">Expected Price (₹)</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <span className="absolute left-3 top-3 text-gray-500">₹</span>
                      <Input 
                        placeholder="Enter Amount"
                        className="h-12 pl-8 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]"
                        type="number"
                        min="1"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        onKeyDown={(e) => { if (['-','+','e','E','.'].includes(e.key)) e.preventDefault(); }}
                        onPaste={(e) => { const text = e.clipboardData.getData('text'); const digits = text.replace(/[^0-9]/g, ''); if (digits !== text) { e.preventDefault(); field.onChange(digits ? Math.max(1, Number(digits)) : undefined); } }}
                        value={field.value || ''}
                        onChange={(e) => field.onChange(e.target.value ? Math.max(1, Number(e.target.value)) : undefined)}
                      />
                    </div>
                  </FormControl>
                  {/* Price in words display */}
                  {field.value && field.value > 0 && (
                    <div className="mt-2">
                      <p className="text-sm text-gray-600">
                        {formatPriceDisplay(field.value)}
                      </p>
                    </div>
                  )}
                  <div className="mt-2">
                    <FormField
                      control={form.control}
                      name="priceNegotiable"
                      render={({ field }) => (
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="priceNegotiable"
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                          <label htmlFor="priceNegotiable" className="text-sm text-gray-600">
                            Price Negotiable
                          </label>
                        </div>
                      )}
                    />
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="ownershipType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-900">Ownership Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-white border shadow-lg z-50">
                      <SelectItem value="freehold">Freehold</SelectItem>
                      <SelectItem value="leasehold">Leasehold</SelectItem>
                      <SelectItem value="cooperative">Cooperative Society</SelectItem>
                      <SelectItem value="power-of-attorney">Power of Attorney</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>


          {/* Possession Date */}
          <FormField
            control={form.control}
            name="possessionDate"
            render={({ field }) => (
              <FormItem className="w-1/2">
                <FormLabel className="text-sm font-medium text-gray-900">Possession Date</FormLabel>
                <FormControl>
                  <Input 
                    type="date" 
                    className="h-12"
                    {...field} 
                    min={new Date().toISOString().split('T')[0]}
                    max={new Date(new Date().setMonth(new Date().getMonth() + 6)).toISOString().split('T')[0]}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Suitable Business Types */}
          <FormField
            control={form.control}
            name="businessType"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-900">Suitable Business Types (Optional)</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="e.g., Retail, Office, Restaurant, etc. (comma separated)"
                    className="min-h-[100px]"
                    value={field.value?.join(', ') || ''}
                    onChange={(e) => field.onChange(e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* <FormField
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
          /> */}

          {/* <div className="space-y-4">
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
          </div> */}

          {/* Navigation Buttons - Removed, using sticky buttons instead */}
        </form>
      </Form>
    </div>
  );
};
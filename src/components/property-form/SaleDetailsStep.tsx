import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PriceInput } from '@/components/ui/price-input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Calendar, CalendarIcon, ArrowLeft, ArrowRight, Phone, Compass } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format, addMonths } from 'date-fns';
import { useIsMobile } from '@/hooks/use-mobile';
import { SaleDetails } from '@/types/saleProperty';
import { formatPriceDisplay } from '@/utils/priceFormatter';

// Helper function to convert number to words
const numberToWords = (num: number): string => {
  if (num === 0) return 'Zero';
  
  const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  
  const convertHundreds = (n: number): string => {
    let result = '';
    
    if (n >= 100) {
      result += ones[Math.floor(n / 100)] + ' Hundred';
      n %= 100;
      if (n > 0) result += ' ';
    }
    
    if (n >= 20) {
      result += tens[Math.floor(n / 10)];
      n %= 10;
      if (n > 0) result += ' ' + ones[n];
    } else if (n >= 10) {
      result += teens[n - 10];
    } else if (n > 0) {
      result += ones[n];
    }
    
    return result;
  };
  
  let result = '';
  
  // Crores
  if (num >= 10000000) {
    const crores = Math.floor(num / 10000000);
    result += convertHundreds(crores) + ' Crore';
    num %= 10000000;
    if (num > 0) result += ' ';
  }
  
  // Lakhs
  if (num >= 100000) {
    const lakhs = Math.floor(num / 100000);
    result += convertHundreds(lakhs) + ' Lakh';
    num %= 100000;
    if (num > 0) result += ' ';
  }
  
  // Thousands
  if (num >= 1000) {
    const thousands = Math.floor(num / 1000);
    result += convertHundreds(thousands) + ' Thousand';
    num %= 1000;
    if (num > 0) result += ' ';
  }
  
  // Hundreds and below
  if (num > 0) {
    result += convertHundreds(num);
  }
  
  return result;
};

// Helper function to format price per sq.ft
const formatPricePerSqFt = (price: number, area: number): string => {
  if (!price || !area || area === 0) return '';
  const pricePerSqFt = Math.round(price / area);
  return pricePerSqFt.toLocaleString();
};

const saleDetailsSchema = z.object({
  expectedPrice: z.union([z.number(), z.nan(), z.undefined()]).optional().transform(val => isNaN(val as number) ? undefined : val),
  priceNegotiable: z.boolean().optional(),
  possessionDate: z.string().optional(),
  registrationStatus: z.enum(['ready_to_move', 'under_construction']).optional(),
  homeLoanAvailable: z.boolean().optional(),
  maintenanceCharges: z.union([z.number(), z.nan(), z.undefined()]).optional().transform(val => isNaN(val as number) ? undefined : val),
  pricePerSqFt: z.union([z.number(), z.nan(), z.undefined()]).optional().transform(val => isNaN(val as number) ? undefined : val),
  bookingAmount: z.union([z.number(), z.nan(), z.undefined()]).optional().transform(val => isNaN(val as number) ? undefined : val),
});

type SaleDetailsForm = z.infer<typeof saleDetailsSchema>;

interface SaleDetailsStepProps {
  initialData: Partial<SaleDetails>;
  propertyDetails?: Partial<import('@/types/property').PropertyDetails>;
  onNext: (data: SaleDetails) => void;
  onBack: () => void;
}

export const SaleDetailsStep: React.FC<SaleDetailsStepProps> = ({
  initialData,
  propertyDetails,
  onNext,
  onBack,
}) => {
  const isMobile = useIsMobile();
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(
    initialData.possessionDate ? new Date(initialData.possessionDate) : undefined
  );
  const [isCalendarOpen, setIsCalendarOpen] = React.useState(false);
  const [showInterestSuccess, setShowInterestSuccess] = React.useState(false);

  const form = useForm<SaleDetailsForm>({
    resolver: zodResolver(saleDetailsSchema),
    defaultValues: {
      expectedPrice: initialData.expectedPrice || undefined,
      priceNegotiable: initialData.priceNegotiable ?? true,
      registrationStatus: initialData.registrationStatus || 'ready_to_move',
      homeLoanAvailable: initialData.homeLoanAvailable ?? true,
      maintenanceCharges: initialData.maintenanceCharges || undefined,
      pricePerSqFt: initialData.pricePerSqFt || undefined,
      bookingAmount: initialData.bookingAmount || undefined,
    },
    mode: 'onChange'
  });

  const watchedValues = form.watch();

  const onSubmit = (data: SaleDetailsForm) => {
    const saleData: SaleDetails = {
      listingType: 'Sale',
      expectedPrice: data.expectedPrice || 0,
      priceNegotiable: data.priceNegotiable,
      possessionDate: selectedDate ? selectedDate.toISOString().split('T')[0] : undefined,
      propertyAge: '', // This will be populated from Step 1 data
      registrationStatus: data.registrationStatus || 'ready_to_move',
      homeLoanAvailable: data.homeLoanAvailable,
      maintenanceCharges: data.maintenanceCharges,
      pricePerSqFt: data.pricePerSqFt,
      bookingAmount: data.bookingAmount,
    };
    onNext(saleData);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Sale Price */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="expectedPrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">
                    Sale Price (₹) <span className="text-muted-foreground">(Optional)</span>
                  </FormLabel>
                  <FormControl>
                    <PriceInput
                      placeholder="Enter Amount"
                      value={field.value}
                      onChange={field.onChange}
                      className="h-10"
                    />
                  </FormControl>
                  {/* Price in words display */}
                  {field.value && field.value > 0 && (
                    <div className="mt-2">
                      <p className="text-sm text-black">
                        ₹ {numberToWords(field.value)}
                        {propertyDetails?.superBuiltUpArea && (
                          <span className="text-gray-600">
                            {' '}(₹ {formatPricePerSqFt(field.value, propertyDetails.superBuiltUpArea)} per sq.ft)
                          </span>
                        )}
                      </p>
                    </div>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="pricePerSqFt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">
                    Price per Sq.Ft (₹) <span className="text-muted-foreground">(Optional)</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="e.g. 4500"
                      min="1"
                      value={
                        watchedValues.expectedPrice && propertyDetails?.superBuiltUpArea
                          ? Math.round(watchedValues.expectedPrice / propertyDetails.superBuiltUpArea)
                          : field.value || ''
                      }
                      onKeyDown={(e) => { if (['-','+','e','E','.'].includes(e.key)) e.preventDefault(); }}
                      onPaste={(e) => { const text = e.clipboardData.getData('text'); const digits = text.replace(/[^0-9]/g, ''); if (digits !== text) { e.preventDefault(); field.onChange(digits ? Math.max(1, Number(digits)) : undefined); } }}
                      onChange={(e) => {
                        const value = e.target.value ? Math.max(1, Number(e.target.value)) : undefined;
                        field.onChange(value);
                      }}
                      className="h-10"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Price Options */}
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
                <Label htmlFor="priceNegotiable" className="text-sm">
                  Price Negotiable
                </Label>
              </div>
            )}
          />

          {/* Registration Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="registrationStatus"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">Availability Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="h-10">
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

          {/* Possession Date */}
          <div>
            <Label className="text-sm font-medium">Possession Date</Label>
            <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal mt-1 h-10",
                    !selectedDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? format(selectedDate, "PPP") : "Select possession date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => {
                    setSelectedDate(date);
                    setIsCalendarOpen(false);
                  }}
                  disabled={(date) => {
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    const maxDate = addMonths(today, 3);
                    return date < today || date > maxDate;
                  }}
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Additional Charges */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="maintenanceCharges"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">
                    Monthly Maintenance (₹) <span className="text-muted-foreground">(Optional)</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="e.g. 2500"
                      min="1"
                      {...field}
                      onKeyDown={(e) => { if (['-','+','e','E','.'].includes(e.key)) e.preventDefault(); }}
                      onPaste={(e) => { const text = e.clipboardData.getData('text'); const digits = text.replace(/[^0-9]/g, ''); if (digits !== text) { e.preventDefault(); field.onChange(digits ? Math.max(1, Number(digits)) : undefined); } }}
                      value={field.value || ''}
                      onChange={(e) => field.onChange(e.target.value ? Math.max(1, Number(e.target.value)) : undefined)}
                      className="h-10"
                    />
                  </FormControl>
                  {watchedValues.maintenanceCharges && (
                    <div className="mt-1">
                      <p className="text-sm text-brand-maroon-light font-medium">
                        {formatPriceDisplay(watchedValues.maintenanceCharges)}
                      </p>
                    </div>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bookingAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">
                    Booking Amount (₹) <span className="text-muted-foreground">(Optional)</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="e.g. 100000"
                      min="1"
                      {...field}
                      onKeyDown={(e) => { if (['-','+','e','E','.'].includes(e.key)) e.preventDefault(); }}
                      onPaste={(e) => { const text = e.clipboardData.getData('text'); const digits = text.replace(/[^0-9]/g, ''); if (digits !== text) { e.preventDefault(); field.onChange(digits ? Math.max(1, Number(digits)) : undefined); } }}
                      value={field.value || ''}
                      onChange={(e) => field.onChange(e.target.value ? Math.max(1, Number(e.target.value)) : undefined)}
                      className="h-10"
                    />
                  </FormControl>
                  {watchedValues.bookingAmount && (
                    <div className="mt-1">
                      <p className="text-sm text-brand-maroon-light font-medium">
                        {formatPriceDisplay(watchedValues.bookingAmount)}
                      </p>
                    </div>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Loan Availability */}
          <FormField
            control={form.control}
            name="homeLoanAvailable"
            render={({ field }) => (
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="homeLoanAvailable"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
                <Label htmlFor="homeLoanAvailable" className="text-sm">
                  Home Loan Available
                </Label>
              </div>
            )}
          />

          {/* Help Section */}
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 flex items-center justify-between">
            {!showInterestSuccess ? (
              <>
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-orange-600" />
                  <span className="text-sm text-gray-700">Don't want to fill all the details? Let us help you!</span>
                </div>
                <Button 
                  variant="outline" 
                  className="border-primary text-primary hover:bg-primary hover:text-white"
                  onClick={() => setShowInterestSuccess(true)}
                >
                  I'm interested
                </Button>
              </>
            ) : (
              <div className="flex items-center space-x-3 w-full">
                <Phone className="h-5 w-5 text-orange-600" />
                <span className="text-sm text-gray-700">Thank you for the interest. Our agent will give you a call shortly.</span>
              </div>
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-4" style={{ visibility: 'hidden' }}>
            <Button type="button" variant="outline" onClick={onBack} className="h-10 px-6">
              {!isMobile && <ArrowLeft className="mr-2 h-4 w-4" />}
              Back
            </Button>
            <Button type="submit" className="h-10 px-6">
              Save & Continue
              {!isMobile && <ArrowRight className="ml-2 h-4 w-4" />}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
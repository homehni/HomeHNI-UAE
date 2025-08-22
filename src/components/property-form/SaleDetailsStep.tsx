import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, CalendarIcon, ArrowLeft, ArrowRight } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { SaleDetails } from '@/types/saleProperty';

const saleDetailsSchema = z.object({
  expectedPrice: z.union([z.number(), z.nan(), z.undefined()]).optional().transform(val => isNaN(val as number) ? undefined : val),
  priceNegotiable: z.boolean().optional(),
  possessionDate: z.string().optional(),
  propertyAge: z.string().optional(),
  registrationStatus: z.enum(['ready_to_move', 'under_construction']).optional(),
  homeLoanAvailable: z.boolean().optional(),
  maintenanceCharges: z.union([z.number(), z.nan(), z.undefined()]).optional().transform(val => isNaN(val as number) ? undefined : val),
  pricePerSqFt: z.union([z.number(), z.nan(), z.undefined()]).optional().transform(val => isNaN(val as number) ? undefined : val),
  bookingAmount: z.union([z.number(), z.nan(), z.undefined()]).optional().transform(val => isNaN(val as number) ? undefined : val),
});

type SaleDetailsForm = z.infer<typeof saleDetailsSchema>;

interface SaleDetailsStepProps {
  initialData: Partial<SaleDetails>;
  onNext: (data: SaleDetails) => void;
  onBack: () => void;
}

export const SaleDetailsStep: React.FC<SaleDetailsStepProps> = ({
  initialData,
  onNext,
  onBack,
}) => {
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(
    initialData.possessionDate ? new Date(initialData.possessionDate) : undefined
  );
  const [isCalendarOpen, setIsCalendarOpen] = React.useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid }
  } = useForm<SaleDetailsForm>({
    resolver: zodResolver(saleDetailsSchema),
    defaultValues: {
      expectedPrice: initialData.expectedPrice || undefined,
      priceNegotiable: initialData.priceNegotiable ?? true,
      propertyAge: initialData.propertyAge || '',
      registrationStatus: initialData.registrationStatus || 'ready_to_move',
      homeLoanAvailable: initialData.homeLoanAvailable ?? true,
      maintenanceCharges: initialData.maintenanceCharges || undefined,
      pricePerSqFt: initialData.pricePerSqFt || undefined,
      bookingAmount: initialData.bookingAmount || undefined,
    },
    mode: 'onChange'
  });

  const watchedValues = watch();

  const onSubmit = (data: SaleDetailsForm) => {
    const saleData: SaleDetails = {
      listingType: 'Sale',
      expectedPrice: data.expectedPrice,
      priceNegotiable: data.priceNegotiable,
      possessionDate: selectedDate ? selectedDate.toISOString().split('T')[0] : undefined,
      propertyAge: data.propertyAge,
      registrationStatus: data.registrationStatus || 'ready_to_move',
      homeLoanAvailable: data.homeLoanAvailable,
      maintenanceCharges: data.maintenanceCharges,
      pricePerSqFt: data.pricePerSqFt,
      bookingAmount: data.bookingAmount,
    };
    onNext(saleData);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Resale Details</h2>
        <p className="text-gray-600">Enter the sale-specific details for your property</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        
        {/* Sale Price */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="expectedPrice" className="text-sm font-medium">
              Sale Price (₹) <span className="text-muted-foreground">(Optional)</span>
            </Label>
            <Input
              id="expectedPrice"
              type="number"
              placeholder="e.g. 5000000"
              {...register('expectedPrice', { valueAsNumber: true })}
              className="mt-1 h-12"
                />
            {errors.expectedPrice && (
              <p className="text-red-500 text-sm mt-1">{errors.expectedPrice.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="pricePerSqFt" className="text-sm font-medium">
              Price per Sq.Ft (₹) <span className="text-muted-foreground">(Optional)</span>
            </Label>
            <Input
              id="pricePerSqFt"
              type="number"
              placeholder="e.g. 4500"
              {...register('pricePerSqFt', { valueAsNumber: true })}
              className="mt-1 h-12"
            />
          </div>
        </div>

        {/* Price Options */}
        <div className="flex items-center space-x-2">
          <Checkbox
            id="priceNegotiable"
            checked={watchedValues.priceNegotiable}
            onCheckedChange={(checked) => setValue('priceNegotiable', checked as boolean)}
          />
          <Label htmlFor="priceNegotiable" className="text-sm">
            Price Negotiable
          </Label>
        </div>

        {/* Property Age and Registration Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="propertyAge" className="text-sm font-medium">
              Property Age
            </Label>
            <Select
              value={watchedValues.propertyAge}
              onValueChange={(value) => setValue('propertyAge', value)}
            >
              <SelectTrigger className="mt-1 h-12">
                <SelectValue placeholder="Select property age" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="new_construction">New Construction</SelectItem>
                <SelectItem value="0-1_years">0-1 Years</SelectItem>
                <SelectItem value="1-5_years">1-5 Years</SelectItem>
                <SelectItem value="5-10_years">5-10 Years</SelectItem>
                <SelectItem value="10-15_years">10-15 Years</SelectItem>
                <SelectItem value="15-20_years">15-20 Years</SelectItem>
                <SelectItem value="20+_years">20+ Years</SelectItem>
              </SelectContent>
            </Select>
            {errors.propertyAge && (
              <p className="text-red-500 text-sm mt-1">{errors.propertyAge.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="registrationStatus" className="text-sm font-medium">
              Registration Status
            </Label>
            <Select
              value={watchedValues.registrationStatus}
              onValueChange={(value) => setValue('registrationStatus', value as 'ready_to_move' | 'under_construction')}
            >
              <SelectTrigger className="mt-1 h-12">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ready_to_move">Ready to Move</SelectItem>
                <SelectItem value="under_construction">Under Construction</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Possession Date */}
        <div>
          <Label className="text-sm font-medium">Possession Date</Label>
          <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal mt-1 h-12",
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
                  setIsCalendarOpen(false); // Close popover after date selection
                }}
                disabled={(date) => date < new Date()}
                initialFocus
                className={cn("p-3 pointer-events-auto")}
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Additional Charges */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="maintenanceCharges" className="text-sm font-medium">
              Monthly Maintenance (₹) <span className="text-muted-foreground">(Optional)</span>
            </Label>
            <Input
              id="maintenanceCharges"
              type="number"
              placeholder="e.g. 2500"
              {...register('maintenanceCharges', { valueAsNumber: true })}
              className="mt-1 h-12"
            />
          </div>

          <div>
            <Label htmlFor="bookingAmount" className="text-sm font-medium">
              Booking Amount (₹) <span className="text-muted-foreground">(Optional)</span>
            </Label>
            <Input
              id="bookingAmount"
              type="number"
              placeholder="e.g. 100000"
              {...register('bookingAmount', { valueAsNumber: true })}
              className="mt-1 h-12"
            />
          </div>
        </div>

        {/* Loan Availability */}
        <div className="flex items-center space-x-2">
          <Checkbox
            id="homeLoanAvailable"
            checked={watchedValues.homeLoanAvailable}
            onCheckedChange={(checked) => setValue('homeLoanAvailable', checked as boolean)}
          />
          <Label htmlFor="homeLoanAvailable" className="text-sm">
            Home Loan Available
          </Label>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-6">
          <Button type="button" variant="outline" onClick={onBack} className="h-12 px-8">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <Button 
            type="submit" 
            className="h-12 px-8"
          >
            Save & Continue
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  );
};
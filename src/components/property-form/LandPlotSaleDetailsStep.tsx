import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PriceInput } from '@/components/ui/price-input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { LandPlotSaleDetails } from '@/types/landPlotProperty';
import { CalendarIcon } from 'lucide-react';
import { format, addMonths } from 'date-fns';
import { cn } from '@/lib/utils';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Textarea } from '@/components/ui/textarea';
import { formatPriceDisplay } from '@/utils/priceFormatter';

const saleDetailsSchema = z.object({
  expectedPrice: z.number().optional().or(z.nan()).transform(val => isNaN(val) ? undefined : val),
  possessionDate: z.date().optional(),
  priceNegotiable: z.boolean().optional(),
  ownershipType: z.enum(['freehold', 'leasehold', 'cooperative_society', 'power_of_attorney']).optional(),
  approvedBy: z.string().optional(),
  clearTitles: z.boolean().optional(),
  description: z.string().optional(),
});

type SaleDetailsForm = z.infer<typeof saleDetailsSchema>;

interface LandPlotSaleDetailsStepProps {
  initialData: Partial<LandPlotSaleDetails> & { description?: string };
  onNext: (data: SaleDetailsForm) => void;
  onBack: () => void;
}

export const LandPlotSaleDetailsStep: React.FC<LandPlotSaleDetailsStepProps> = ({
  initialData,
  onNext,
  onBack,
}) => {
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<SaleDetailsForm>({
    resolver: zodResolver(saleDetailsSchema),
    defaultValues: {
      expectedPrice: initialData.expectedPrice,
      possessionDate: initialData.possessionDate ? new Date(initialData.possessionDate) : undefined,
      priceNegotiable: initialData.priceNegotiable ?? false,
      ownershipType: initialData.ownershipType,
      approvedBy: initialData.approvedBy?.join(', ') || '',
      clearTitles: initialData.clearTitles ?? false,
      description: initialData.description || '',
    }
  });

  // Update form values when initialData changes
  useEffect(() => {
    if (initialData.expectedPrice !== undefined) {
      setValue('expectedPrice', initialData.expectedPrice);
    }
    if (initialData.possessionDate) {
      setValue('possessionDate', new Date(initialData.possessionDate));
    }
    if (initialData.priceNegotiable !== undefined) {
      setValue('priceNegotiable', initialData.priceNegotiable);
    }
    if (initialData.ownershipType) {
      setValue('ownershipType', initialData.ownershipType);
    }
    if (initialData.approvedBy) {
      setValue('approvedBy', initialData.approvedBy.join(', '));
    }
    if (initialData.clearTitles !== undefined) {
      setValue('clearTitles', initialData.clearTitles);
    }
    if (initialData.description) {
      setValue('description', initialData.description);
    }
  }, [initialData, setValue]);

  const selectedDate = watch('possessionDate');
  const [isDatePickerOpen, setIsDatePickerOpen] = React.useState(false);

  const handleFormSubmit = (data: SaleDetailsForm) => {
    // Transform the data to match LandPlotSaleDetails type
    const transformedData = {
      ...data,
      possessionDate: data.possessionDate ? format(data.possessionDate, 'yyyy-MM-dd') : undefined,
      approvedBy: data.approvedBy ? data.approvedBy.split(',').map(s => s.trim()).filter(Boolean) : undefined,
    };
    onNext(transformedData as any);
  };


  return (
    <div className="bg-background p-6">
        <div className="text-left mb-8 pt-4 md:pt-0">
          <h2 className="text-2xl font-semibold text-red-600 mb-2">
            Sale Details
          </h2>
        </div>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          {/* Expected Price and Available From in same row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Expected Price Column */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="expectedPrice" className="text-sm font-medium text-gray-700">
                  Expected Price
                </Label>
                  <PriceInput
                    id="expectedPrice"
                    placeholder="Enter Amount"
                    value={watch('expectedPrice')}
                    onChange={(value) => setValue('expectedPrice', value)}
                  />
                  {/* Price in words display */}
                  {watch('expectedPrice') && watch('expectedPrice')! > 0 && (
                    <div className="mt-2">
                      <p className="text-sm text-gray-600">
                        {formatPriceDisplay(watch('expectedPrice')!)}
                      </p>
                    </div>
                  )}
                {errors.expectedPrice && (
                  <p className="text-red-500 text-sm">{errors.expectedPrice.message}</p>
                )}
              </div>
              
              {/* Price Negotiable under Expected Price */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="priceNegotiable"
                  checked={watch('priceNegotiable')}
                  onCheckedChange={(checked) => setValue('priceNegotiable', !!checked)}
                />
                <Label htmlFor="priceNegotiable" className="text-sm text-gray-700">
                  Price Negotiable
                </Label>
              </div>
            </div>

            {/* Possession Date Column */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">
                  Possession Date
                </Label>
                <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !selectedDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDate ? format(selectedDate, "dd/MM/yyyy") : <span>dd/mm/yyyy</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={(date) => {
                        setValue('possessionDate', date!);
                        setIsDatePickerOpen(false);
                      }}
                      disabled={(date) => {
                        const today = new Date();
                        today.setHours(0, 0, 0, 0);
                        const maxDate = addMonths(today, 6);
                        return date < today || date > maxDate;
                      }}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
                {errors.possessionDate && (
                  <p className="text-red-500 text-sm">{errors.possessionDate.message}</p>
                )}
              </div>
              
              {/* Clear Titles checkbox */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="clearTitles"
                  checked={watch('clearTitles')}
                  onCheckedChange={(checked) => setValue('clearTitles', !!checked)}
                />
                <Label htmlFor="clearTitles" className="text-sm text-gray-700">
                  Clear Titles
                </Label>
              </div>
            </div>
          </div>

          {/* Ownership Section */}
          <div className="space-y-3 sm:space-y-4">
            <Label className="text-sm font-medium text-gray-700">
              Ownership
            </Label>
            <RadioGroup
              value={watch('ownershipType')}
              onValueChange={(value) => setValue('ownershipType', value as any)}
              className="flex flex-col sm:flex-row gap-3 sm:gap-6"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="freehold" id="freehold" />
                <Label htmlFor="freehold" className="text-sm text-gray-700 cursor-pointer">
                  Freehold
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="leasehold" id="leasehold" />
                <Label htmlFor="leasehold" className="text-sm text-gray-700 cursor-pointer">
                  Leasehold
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="power_of_attorney" id="power_of_attorney" />
                <Label htmlFor="power_of_attorney" className="text-sm text-gray-700 cursor-pointer">
                  Power of Attorney
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="cooperative_society" id="cooperative_society" />
                <Label htmlFor="cooperative_society" className="text-sm text-gray-700 cursor-pointer">
                  Cooperative Society
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Authority Approval */}
          <div className="space-y-2">
            <Label htmlFor="approvedBy" className="text-sm font-medium text-gray-700">
              Which authority the property is approved by?
            </Label>
            <Input
              id="approvedBy"
              {...register('approvedBy')}
              placeholder="Enter authority names (comma separated)"
              className="h-12"
            />
            {errors.approvedBy && (
              <p className="text-red-500 text-sm">{errors.approvedBy.message}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium text-gray-700">
              Description
            </Label>
            <Textarea
              id="description"
              {...register('description')}
              placeholder="Write a few lines about your property something which is special and makes your property stand out. Please do not mention your contact details in any format."
              className="min-h-[100px] resize-none"
            />
          </div>

          {/* Navigation Buttons - Removed, using sticky buttons instead */}
        </form>
      </div>
  );
};
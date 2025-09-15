import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PriceInput } from '@/components/ui/price-input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LandPlotSaleDetails } from '@/types/landPlotProperty';
import { CalendarIcon } from 'lucide-react';
import { format, addMonths } from 'date-fns';
import { cn } from '@/lib/utils';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Textarea } from '@/components/ui/textarea';

const saleDetailsSchema = z.object({
  expectedPrice: z.number().optional().or(z.nan()).transform(val => isNaN(val) ? undefined : val),
  availableFrom: z.date().optional(),
  currentlyUnderLoan: z.boolean().optional(),
  priceNegotiable: z.boolean().optional(),
  description: z.string().optional(),
});

type SaleDetailsForm = z.infer<typeof saleDetailsSchema>;

interface LandPlotSaleDetailsStepProps {
  initialData: Partial<LandPlotSaleDetails>;
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
      currentlyUnderLoan: false,
      priceNegotiable: false,
      description: '',
    }
  });

  const selectedDate = watch('availableFrom');
  const [isDatePickerOpen, setIsDatePickerOpen] = React.useState(false);


  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-gray-900">
          Sale Details
        </CardTitle>
        <p className="text-gray-600">
          Enter pricing and ownership details for your land/plot
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onNext)} className="space-y-6">
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
                {errors.expectedPrice && (
                  <p className="text-red-500 text-sm">{errors.expectedPrice.message}</p>
                )}
              </div>
              
              {/* Price Negotiable under Expected Price */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="priceNegotiable"
                  onCheckedChange={(checked) => setValue('priceNegotiable', !!checked)}
                />
                <Label htmlFor="priceNegotiable" className="text-sm text-gray-700">
                  Price Negotiable
                </Label>
              </div>
            </div>

            {/* Available From Column */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">
                  Available From
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
                        setValue('availableFrom', date!);
                        setIsDatePickerOpen(false);
                      }}
                      disabled={(date) => {
                        const today = new Date();
                        today.setHours(0, 0, 0, 0);
                        const maxDate = addMonths(today, 6); // 6 months for plot sale
                        return date < today || date > maxDate;
                      }}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
                {errors.availableFrom && (
                  <p className="text-red-500 text-sm">{errors.availableFrom.message}</p>
                )}
              </div>
              
              {/* Currently Under Loan under Available From */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="currentlyUnderLoan"
                  onCheckedChange={(checked) => setValue('currentlyUnderLoan', !!checked)}
                />
                <Label htmlFor="currentlyUnderLoan" className="text-sm text-gray-700">
                  Currently Under Loan
                </Label>
              </div>
            </div>
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

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={onBack}
            >
              Back
            </Button>
            <Button type="submit" className="bg-red-600 hover:bg-red-700 text-white">
              Next: Amenities & Infrastructure
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
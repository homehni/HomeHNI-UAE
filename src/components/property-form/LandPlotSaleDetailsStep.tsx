import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LandPlotSaleDetails } from '@/types/landPlotProperty';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

const saleDetailsSchema = z.object({
  expectedPrice: z.number().min(1, 'Expected price is required'),
  pricePerUnit: z.number().min(1, 'Price per unit is required'),
  priceNegotiable: z.boolean(),
  // possessionDate: z.string().optional(),
  // ownershipType: z.enum(['freehold', 'leasehold', 'cooperative_society', 'power_of_attorney']),
  // approvedBy: z.array(z.string()).optional(),
  // clearTitles: z.boolean(),
  // registrationCharges: z.number().optional(),
  // stampDutyCharges: z.number().optional(),
  // otherCharges: z.number().optional(),
  // bookingAmount: z.number().optional(),
  // tokenAmount: z.number().optional(),
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
  const [date, setDate] = React.useState<Date>();
  
  const { register, handleSubmit, formState: { errors } } = useForm<SaleDetailsForm>({
    resolver: zodResolver(saleDetailsSchema),
    defaultValues: {
      ...initialData,
      priceNegotiable: initialData.priceNegotiable ?? true,
    }
  });


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
          {/* Price Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="expectedPrice" className="text-sm font-medium text-gray-700">
                Total Expected Price (₹) *
              </Label>
              <Input
                id="expectedPrice"
                type="number"
                {...register('expectedPrice', { valueAsNumber: true })}
                placeholder="e.g., 5000000"
                className="w-full"
              />
              {errors.expectedPrice && (
                <p className="text-red-500 text-sm">{errors.expectedPrice.message}</p>
              )}
            </div>
            {/* <div className="space-y-2">
              <Label htmlFor="pricePerUnit" className="text-sm font-medium text-gray-700">
                Price Per Sq.Ft (₹) *
              </Label>
              <Input
                id="pricePerUnit"
                type="number"
                {...register('pricePerUnit', { valueAsNumber: true })}
                placeholder="e.g., 4000"
                className="w-full"
              />
              {errors.pricePerUnit && (
                <p className="text-red-500 text-sm">{errors.pricePerUnit.message}</p>
              )}
            </div> */}
          </div>

          {/* Ownership Type */}
          {/* <div className="space-y-2">
            <Label htmlFor="ownershipType" className="text-sm font-medium text-gray-700">
              Ownership Type *
            </Label>
            <Select onValueChange={(value) => setValue('ownershipType', value as any)}>
              <SelectTrigger>
                <SelectValue placeholder="Select ownership type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="freehold">Freehold</SelectItem>
                <SelectItem value="leasehold">Leasehold</SelectItem>
                <SelectItem value="cooperative_society">Cooperative Society</SelectItem>
                <SelectItem value="power_of_attorney">Power of Attorney</SelectItem>
              </SelectContent>
            </Select>
          </div> */}

          {/* Approvals */}
          {/* <div className="space-y-3">
            <Label className="text-sm font-medium text-gray-700">
              Approvals (Select all that apply)
            </Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {approvals.map((approval) => (
                <div key={approval} className="flex items-center space-x-2">
                  <Checkbox
                    id={approval}
                    onCheckedChange={(checked) => handleApprovalChange(approval, !!checked)}
                  />
                  <Label htmlFor={approval} className="text-sm text-gray-700">
                    {approval}
                  </Label>
                </div>
              ))}
            </div>
          </div> */}

          {/* Possession Date */}
          {/* <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">
              Available From
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Select date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={handleDateSelect}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div> */}

          {/* Additional Charges */}
          {/* <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Additional Charges (Optional)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="registrationCharges" className="text-sm font-medium text-gray-700">
                  Registration Charges (₹)
                </Label>
                <Input
                  id="registrationCharges"
                  type="number"
                  {...register('registrationCharges', { valueAsNumber: true })}
                  placeholder="e.g., 50000"
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stampDutyCharges" className="text-sm font-medium text-gray-700">
                  Stamp Duty Charges (₹)
                </Label>
                <Input
                  id="stampDutyCharges"
                  type="number"
                  {...register('stampDutyCharges', { valueAsNumber: true })}
                  placeholder="e.g., 100000"
                  className="w-full"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bookingAmount" className="text-sm font-medium text-gray-700">
                  Booking Amount (₹)
                </Label>
                <Input
                  id="bookingAmount"
                  type="number"
                  {...register('bookingAmount', { valueAsNumber: true })}
                  placeholder="e.g., 100000"
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="otherCharges" className="text-sm font-medium text-gray-700">
                  Other Charges (₹)
                </Label>
                <Input
                  id="otherCharges"
                  type="number"
                  {...register('otherCharges', { valueAsNumber: true })}
                  placeholder="e.g., 25000"
                  className="w-full"
                />
              </div>
            </div>
          </div> */}

          {/* Checkboxes */}
          {/* <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="priceNegotiable"
                defaultChecked={initialData.priceNegotiable}
                onCheckedChange={(checked) => setValue('priceNegotiable', !!checked)}
              />
              <Label htmlFor="priceNegotiable" className="text-sm font-medium text-gray-700">
                Price Negotiable
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="clearTitles"
                defaultChecked={initialData.clearTitles}
                onCheckedChange={(checked) => setValue('clearTitles', !!checked)}
              />
              <Label htmlFor="clearTitles" className="text-sm font-medium text-gray-700">
                Clear Titles (No legal disputes)
              </Label>
            </div>
          </div> */}

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
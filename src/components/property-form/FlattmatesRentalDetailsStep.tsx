import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PriceInput } from '@/components/ui/price-input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { CalendarIcon } from 'lucide-react';
import { format, addMonths } from 'date-fns';
import { cn } from '@/lib/utils';
import { formatExactPriceDisplay } from '@/utils/priceFormatter';

interface FlattmatesRentalDetails {
  expectedRent: number;
  expectedDeposit: number;
  rentNegotiable: boolean;
  monthlyMaintenance: string;
  availableFrom: string;
  description: string;
}

interface FlattmatesRentalDetailsStepProps {
  initialData?: Partial<FlattmatesRentalDetails>;
  onNext: (data: FlattmatesRentalDetails) => void;
  onBack: () => void;
  currentStep: number;
  totalSteps: number;
  completedSteps: number[];
  formId?: string;
}

export function FlattmatesRentalDetailsStep({ 
  initialData, 
  onNext, 
  onBack, 
  currentStep, 
  totalSteps,
  completedSteps,
  formId
}: FlattmatesRentalDetailsStepProps) {
  const [formData, setFormData] = useState<FlattmatesRentalDetails>({
    expectedRent: 0,
    expectedDeposit: 0,
    rentNegotiable: false,
    monthlyMaintenance: '',
    availableFrom: '',
    description: '',
    ...initialData,
  });

  const handleSubmit = (e: React.FormEvent) => {
    console.log('FlattmatesRentalDetailsStep handleSubmit called');
    e.preventDefault();
    if (isFormValid()) {
      console.log('Form is valid, calling onNext with data:', formData);
      onNext(formData);
    } else {
      console.log('Form is not valid');
    }
  };

  const isFormValid = () => {
    return true; // All fields are now optional
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-left mb-8">
        <h2 className="text-2xl font-bold text-red-600 mb-2">Rental Details</h2>
      </div>

          <div className="p-8">
            <form id={formId || 'flatmates-step-form'} onSubmit={handleSubmit} className="space-y-6">
                {/* Expected Rent and Expected Deposit */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expectedRent">Expected Rent</Label>
                    <PriceInput
                      id="expectedRent"
                      value={formData.expectedRent}
                      onChange={(value) => setFormData({ ...formData, expectedRent: value || 0 })}
                      placeholder="Enter Amount"
                      className="h-12"
                    />
                    {/* Expected rent in words display */}
                    {formData.expectedRent && formData.expectedRent > 0 && (
                      <div className="mt-2">
                        <p className="text-sm text-gray-600">
                          {formatExactPriceDisplay(formData.expectedRent)}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="expectedDeposit">Expected Deposit</Label>
                    <PriceInput
                      id="expectedDeposit"
                      value={formData.expectedDeposit}
                      onChange={(value) => setFormData({ ...formData, expectedDeposit: value || 0 })}
                      placeholder="Enter Amount"
                      className="h-12"
                    />
                    {/* Expected deposit in words display */}
                    {formData.expectedDeposit && formData.expectedDeposit > 0 && (
                      <div className="mt-2">
                        <p className="text-sm text-gray-600">
                          {formatExactPriceDisplay(formData.expectedDeposit)}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Rent Negotiable Toggle - Full Width */}
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <Label htmlFor="rentNegotiable" className="text-base font-medium">
                      Rent Negotiable
                    </Label>
                  </div>
                  <Switch
                    id="rentNegotiable"
                    checked={formData.rentNegotiable}
                    onCheckedChange={(checked) => setFormData({ ...formData, rentNegotiable: checked })}
                  />
                </div>

                {/* Monthly Maintenance and Available From */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="monthlyMaintenance">Monthly Maintenance</Label>
                    <Select
                      value={formData.monthlyMaintenance}
                      onValueChange={(value) => setFormData({ ...formData, monthlyMaintenance: value })}
                    >
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Included">Included in Rent</SelectItem>
                        <SelectItem value="Extra">Extra</SelectItem>
                        <SelectItem value="Not Applicable">Not Applicable</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="availableFrom">Available From</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "h-12 w-full justify-start text-left font-normal",
                            !formData.availableFrom && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {formData.availableFrom ? (
                            format(new Date(formData.availableFrom), "dd/MM/yyyy")
                          ) : (
                            <span>dd/mm/yyyy</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 bg-white border shadow-lg z-50" align="start">
                        <CalendarComponent
                          mode="single"
                          selected={formData.availableFrom ? new Date(formData.availableFrom) : undefined}
                          onSelect={(date) => {
                            setFormData({ 
                              ...formData, 
                              availableFrom: date ? format(date, "yyyy-MM-dd") : "" 
                            });
                          }}
                          disabled={(date) => {
                            const today = new Date();
                            today.setHours(0, 0, 0, 0);
                            const maxDate = addMonths(today, 2);
                            return date < today || date > maxDate;
                          }}
                          initialFocus
                          className="p-3 pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>


                {/* Description - Full Width */}
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe your property and what makes it special for flatmates..."
                    rows={4}
                  />
                </div>

                <div className="flex justify-between pt-6" style={{ visibility: 'hidden' }}>
                  <Button type="button" variant="white" onClick={onBack}>
                    Back
                  </Button>
                  <Button type="submit" variant="default" className="bg-red-800 hover:bg-red-900 text-white">
                    Save & Continue
                  </Button>
                </div>
              </form>
          </div>
    </div>
  );
}
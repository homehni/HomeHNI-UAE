import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PriceInput } from '@/components/ui/price-input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { CalendarIcon } from 'lucide-react';
import { format, addMonths } from 'date-fns';
import { cn } from '@/lib/utils';
import { formatExactPriceDisplay } from '@/utils/priceFormatter';
import { getCurrentCountryConfig } from '@/services/domainCountryService';

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
  const countryConfig = getCurrentCountryConfig();
  const currencySymbol = countryConfig.currency === 'AED' ? 'AED' : '₹';
  
  const [formData, setFormData] = useState<FlattmatesRentalDetails>({
    expectedRent: 0,
    expectedDeposit: 0,
    rentNegotiable: false,
    monthlyMaintenance: '',
    availableFrom: '',
    description: '',
    ...initialData,
  });

  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  // Sync local state with initialData prop changes
  useEffect(() => {
    if (initialData) {
      console.log('FlattmatesRentalDetailsStep syncing with initialData:', initialData);
      setFormData(prev => ({
        ...prev,
        ...initialData
      }));
    }
  }, [initialData]);

  // Debug: Log formData changes
  useEffect(() => {
    console.log('FlattmatesRentalDetailsStep formData updated:', formData);
  }, [formData]);

  const handleSubmit = (e: React.FormEvent) => {
    console.log('=== FlattmatesRentalDetailsStep handleSubmit called ===');
    console.log('Event:', e);
    console.log('Event type:', e.type);
    console.log('Event target:', e.target);
    console.log('Form data:', formData);
    console.log('onNext function:', onNext);
    console.log('onNext function type:', typeof onNext);
    e.preventDefault();
    if (isFormValid()) {
      console.log('Form is valid, calling onNext with data:', formData);
      console.log('About to call onNext...');
      try {
        onNext(formData);
        console.log('onNext called successfully');
      } catch (error) {
        console.error('Error calling onNext:', error);
      }
    } else {
      console.log('Form is not valid');
    }
    console.log('=== FlattmatesRentalDetailsStep handleSubmit completed ===');
  };

  const isFormValid = () => {
    return true; // All fields are now optional
  };

  return (
    <div className="bg-background p-6">
      <div className="text-left mb-8 pt-4 md:pt-0">
        <h2 className="text-2xl font-semibold text-red-600 mb-2">Rental Details</h2>
      </div>

      <form id={formId || 'flatmates-step-form'} onSubmit={handleSubmit} className="space-y-6">
                {/* Expected Rent and Expected Deposit */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expectedRent">Expected Rent *</Label>
                      <PriceInput
                        id="expectedRent"
                        value={formData.expectedRent}
                        onChange={(value) => setFormData({ ...formData, expectedRent: value || 0 })}
                        placeholder="Enter Amount"
                        className="h-12"
                        currencySymbol={currencySymbol}
                      />
                      {/* Rent Negotiable Checkbox */}
                      <div className="flex items-center space-x-2 mt-2">
                        <Checkbox 
                          id="rentNegotiable"
                          checked={formData.rentNegotiable}
                          onCheckedChange={(checked) => setFormData({ ...formData, rentNegotiable: checked as boolean })}
                        />
                        <label htmlFor="rentNegotiable" className="text-sm text-gray-600">
                          Rent Negotiable
                        </label>
                      </div>
                    </div>

                  <div className="space-y-2">
                    <Label htmlFor="expectedDeposit">Expected Deposit</Label>
                    <PriceInput
                      id="expectedDeposit"
                      value={formData.expectedDeposit}
                      onChange={(value) => setFormData({ ...formData, expectedDeposit: value || 0 })}
                      placeholder="Enter Amount"
                      className="h-12"
                      currencySymbol={currencySymbol}
                    />
                  </div>
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
                    <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
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
                            setIsDatePickerOpen(false);
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

              </form>
    </div>
  );
}
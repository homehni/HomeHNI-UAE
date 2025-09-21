import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format, addMonths } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { PriceInput } from '@/components/ui/price-input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { CommercialRentalDetails } from '@/types/property';
import { formatExactPriceDisplay } from '@/utils/priceFormatter';

const commercialRentalDetailsSchema = z.object({
  listingType: z.enum(['Rent']).optional(),
  expectedPrice: z.number().optional(),
  rentNegotiable: z.boolean().optional(),
  maintenanceExtra: z.boolean().optional(),
  maintenanceCharges: z.number().optional(),
  securityDeposit: z.number().optional(),
  depositNegotiable: z.boolean().optional(),
  leaseDuration: z.string().optional(),
  lockinPeriod: z.string().optional(),
  availableFrom: z.string().optional(),
  businessType: z.array(z.string()).optional(),
  operatingHours: z.string().optional(),
  restrictedActivities: z.array(z.string()).optional(),
  leaseTerm: z.string().optional(),
  escalationClause: z.string().optional(),
}).optional();

type CommercialRentalDetailsForm = z.infer<typeof commercialRentalDetailsSchema>;

interface CommercialRentalDetailsStepProps {
  initialData?: Partial<CommercialRentalDetails>;
  onNext: (data: CommercialRentalDetails) => void;
  onBack: () => void;
  currentStep: number;
  totalSteps: number;
}

export const CommercialRentalDetailsStep: React.FC<CommercialRentalDetailsStepProps> = ({
  initialData = {},
  onNext,
  onBack,
  currentStep,
  totalSteps
}) => {
  const [customBusinessType, setCustomBusinessType] = useState('');
  const [selectedBusinessTypes, setSelectedBusinessTypes] = useState<string[]>(initialData.businessType || []);
  const [customRestriction, setCustomRestriction] = useState('');
  const [selectedRestrictions, setSelectedRestrictions] = useState<string[]>(initialData.restrictedActivities || []);
  const [showMaintenanceInput, setShowMaintenanceInput] = useState(initialData.maintenanceExtra || false);

  const form = useForm<CommercialRentalDetailsForm>({
    resolver: zodResolver(commercialRentalDetailsSchema),
    defaultValues: {
      listingType: initialData.listingType || 'Rent',
      expectedPrice: initialData.expectedPrice || undefined,
      rentNegotiable: initialData.rentNegotiable || false,
      maintenanceExtra: initialData.maintenanceExtra || false,
      maintenanceCharges: initialData.maintenanceCharges || undefined,
      securityDeposit: initialData.securityDeposit || undefined,
      depositNegotiable: initialData.depositNegotiable || false,
      leaseDuration: initialData.leaseDuration || '',
      lockinPeriod: initialData.lockinPeriod || '',
      availableFrom: initialData.availableFrom || '',
      businessType: initialData.businessType || [],
      // operatingHours: initialData.operatingHours || '',
      // restrictedActivities: initialData.restrictedActivities || [],
      leaseTerm: initialData.leaseTerm || '',
      // escalationClause: initialData.escalationClause || '',
      
    },
  });

  const predefinedBusinessTypes = ['Bank', 'Retail', 'ATM', 'Service Center', 'Show Room'];
  // const predefinedRestrictions = ['No Loud Music', 'No Alcohol', 'No Non-Veg Food', 'No Heavy Machinery', 'No Chemical Storage'];

  const toggleBusinessType = (type: string) => {
    const newTypes = selectedBusinessTypes.includes(type)
      ? selectedBusinessTypes.filter(t => t !== type)
      : [...selectedBusinessTypes, type];
    setSelectedBusinessTypes(newTypes);
    form.setValue('businessType', newTypes);
  };

  const addCustomBusinessType = () => {
    if (customBusinessType.trim() && !selectedBusinessTypes.includes(customBusinessType.trim())) {
      const newTypes = [...selectedBusinessTypes, customBusinessType.trim()];
      setSelectedBusinessTypes(newTypes);
      form.setValue('businessType', newTypes);
      setCustomBusinessType('');
    }
  };

  const toggleRestriction = (restriction: string) => {
    const newRestrictions = selectedRestrictions.includes(restriction)
      ? selectedRestrictions.filter(r => r !== restriction)
      : [...selectedRestrictions, restriction];
    setSelectedRestrictions(newRestrictions);
    form.setValue('restrictedActivities', newRestrictions);
  };

  const addCustomRestriction = () => {
    if (customRestriction.trim() && !selectedRestrictions.includes(customRestriction.trim())) {
      const newRestrictions = [...selectedRestrictions, customRestriction.trim()];
      setSelectedRestrictions(newRestrictions);
      form.setValue('restrictedActivities', newRestrictions);
      setCustomRestriction('');
    }
  };

  const onSubmit = (data: CommercialRentalDetailsForm) => {
    const rentalData = {
      ...data,
      businessType: selectedBusinessTypes,
      restrictedActivities: selectedRestrictions,
    };
    onNext(rentalData as CommercialRentalDetails);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
      <h1 className="text-2xl font-semibold text-red-600 mb-6">
        Provide rental details about your commercial property
      </h1>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Expected Rent and Expected Deposit */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="expectedPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-900">Expected Rent</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                        <Input 
                          placeholder="Enter Amount"
                          className="h-12 pl-8 pr-20 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]"
                          type="number"
                          min="1"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          onKeyDown={(e) => { if (['-','+','e','E','.'].includes(e.key)) e.preventDefault(); }}
                          onPaste={(e) => { const text = e.clipboardData.getData('text'); const digits = text.replace(/[^0-9]/g, ''); if (digits !== text) { e.preventDefault(); field.onChange(digits ? Math.max(1, Number(digits)) : undefined); } }}
                          value={field.value || ''}
                          onChange={(e) => field.onChange(e.target.value ? Math.max(1, Number(e.target.value)) : undefined)}
                        />
                        <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500">/ Month</span>
                      </div>
                    </FormControl>
                     {/* Price in words display */}
                     {field.value && field.value > 0 && (
                       <div className="mt-2">
                         <p className="text-sm text-gray-600">
                           {formatExactPriceDisplay(field.value)}
                         </p>
                       </div>
                     )}
                    <div className="mt-2">
                      <FormField
                        control={form.control}
                        name="rentNegotiable"
                        render={({ field }) => (
                          <div className="flex items-center space-x-2">
                            <Checkbox 
                              id="rentNegotiable"
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                            <label htmlFor="rentNegotiable" className="text-sm text-gray-600">
                              Rent Negotiable
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
                name="securityDeposit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-900">Expected Deposit</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
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
                    {/* Security deposit in words display */}
                    {field.value && field.value > 0 && (
                      <div className="mt-2">
                        <p className="text-sm text-gray-600">
                          {formatExactPriceDisplay(field.value)}
                        </p>
                      </div>
                    )}
                    <div className="mt-2">
                      <FormField
                        control={form.control}
                        name="depositNegotiable"
                        render={({ field }) => (
                          <div className="flex items-center space-x-2">
                            <Checkbox 
                              id="depositNegotiable"
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                            <label htmlFor="depositNegotiable" className="text-sm text-gray-600">
                              Deposit Negotiable
                            </label>
                          </div>
                        )}
                      />
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Monthly Maintenance */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="maintenanceExtra"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-900">Monthly Maintenance</FormLabel>
                    <Select onValueChange={(value) => {
                      field.onChange(value === 'extra');
                      setShowMaintenanceInput(value === 'extra');
                      if (value !== 'extra') {
                        form.setValue('maintenanceCharges', 0);
                      }
                    }} defaultValue={field.value ? 'extra' : 'included'}>
                      <FormControl>
                        <SelectTrigger className="h-12">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-white border shadow-lg z-50">
                        <SelectItem value="included">Included in Rent</SelectItem>
                        <SelectItem value="extra">Extra</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {showMaintenanceInput && (
                <FormField
                  control={form.control}
                  name="maintenanceCharges"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-900">Maintenance Amount</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                          <Input 
                            placeholder="Enter Amount"
                            className="h-12 pl-8 pr-20 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]"
                            type="number"
                            min="1"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            onKeyDown={(e) => { if (['-','+','e','E','.'].includes(e.key)) e.preventDefault(); }}
                            onPaste={(e) => { const text = e.clipboardData.getData('text'); const digits = text.replace(/[^0-9]/g, ''); if (digits !== text) { e.preventDefault(); field.onChange(digits ? Math.max(1, Number(digits)) : undefined); } }}
                            value={field.value || ''}
                            onChange={(e) => field.onChange(e.target.value ? Math.max(1, Number(e.target.value)) : undefined)}
                          />
                          <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500">/ Month</span>
                        </div>
                      </FormControl>
                      {/* Maintenance amount in words display */}
                      {field.value && field.value > 0 && (
                        <div className="mt-2">
                          <p className="text-sm text-gray-600">
                            {formatExactPriceDisplay(field.value)}
                          </p>
                        </div>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>

            {/* Lease Duration and Lock-in Period */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="leaseDuration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-900">Lease Duration (Years)</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-12">
                          <SelectValue placeholder="Lease Duration" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-white border shadow-lg z-50">
                        <SelectItem value="1">1 Year</SelectItem>
                        <SelectItem value="2">2 Years</SelectItem>
                        <SelectItem value="3">3 Years</SelectItem>
                        <SelectItem value="5">5 Years</SelectItem>
                        <SelectItem value="10">10 Years</SelectItem>
                        <SelectItem value="15">15 Years</SelectItem>
                        <SelectItem value="20">20 Years</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lockinPeriod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-900">Lock-in Period (Years)</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-12">
                          <SelectValue placeholder="Lock-in Period" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-white border shadow-lg z-50">
                        <SelectItem value="0">No Lock-in</SelectItem>
                        <SelectItem value="1">1 Year</SelectItem>
                        <SelectItem value="2">2 Years</SelectItem>
                        <SelectItem value="3">3 Years</SelectItem>
                        <SelectItem value="5">5 Years</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Operating Hours */}
            {/* <FormField
              control={form.control}
              name="operatingHours"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">Operating Hours</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Select Operating Hours" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="9 AM - 6 PM">9 AM - 6 PM</SelectItem>
                      <SelectItem value="10 AM - 7 PM">10 AM - 7 PM</SelectItem>
                      <SelectItem value="24/7">24/7</SelectItem>
                      <SelectItem value="Flexible">Flexible</SelectItem>
                      <SelectItem value="Custom">Custom Hours</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            /> */}

            {/* Available From */}
            <FormField
              control={form.control}
              name="availableFrom"
              render={({ field }) => {
                const [open, setOpen] = React.useState(false);
                
                return (
                  <FormItem className="flex flex-col w-1/2">
                    <FormLabel className="text-sm font-medium text-gray-900">Available From</FormLabel>
                    <Popover open={open} onOpenChange={setOpen}>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "h-12 pl-3 text-left font-normal justify-start",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value ? (
                              format(new Date(field.value), "dd/MM/yyyy")
                            ) : (
                              <span>dd/mm/yyyy</span>
                            )}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 bg-white border shadow-lg z-50" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value ? new Date(field.value) : undefined}
                          onSelect={(date) => {
                            field.onChange(date ? format(date, "yyyy-MM-dd") : "");
                            setOpen(false);
                          }}
                          disabled={(date) => {
                            const today = new Date();
                            today.setHours(0, 0, 0, 0);
                            const maxDate = addMonths(today, 2); // 2 months for rent
                            return date < today || date > maxDate;
                          }}
                          initialFocus
                          className={cn("p-3 pointer-events-auto")}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />

            {/* Suitable Business Types */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-4">Suitable Business Types</h3>
              <FormField
                control={form.control}
                name="businessType"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="flex flex-wrap gap-4">
                        {predefinedBusinessTypes.map((type) => (
                          <div key={type} className="flex items-center space-x-2">
                            <Checkbox 
                              id={type}
                              checked={selectedBusinessTypes.includes(type)}
                              onCheckedChange={() => toggleBusinessType(type)}
                            />
                            <label htmlFor={type} className="text-sm text-gray-700">
                              {type}
                            </label>
                          </div>
                        ))}
                      </div>
                    </FormControl>
                    <div className="flex space-x-2 mt-4">
                      <Input
                        placeholder="Add custom business type"
                        value={customBusinessType}
                        onChange={(e) => setCustomBusinessType(e.target.value)}
                        className="flex-1"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addCustomBusinessType();
                          }
                        }}
                      />
                      <Button type="button" onClick={addCustomBusinessType} variant="outline">
                        Add
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Restricted Activities */}
            {/* <div className="space-y-4">
              <FormLabel className="text-sm font-medium">Restricted Activities</FormLabel>
              <div className="flex flex-wrap gap-2">
                {predefinedRestrictions.map((restriction) => (
                  <Badge
                    key={restriction}
                    variant={selectedRestrictions.includes(restriction) ? "default" : "outline"}
                    className="cursor-pointer px-3 py-1"
                    onClick={() => toggleRestriction(restriction)}
                  >
                    {restriction}
                  </Badge>
                ))}
              </div>
              <div className="flex space-x-2">
                <Input
                  placeholder="Add custom restriction"
                  value={customRestriction}
                  onChange={(e) => setCustomRestriction(e.target.value)}
                  className="flex-1"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addCustomRestriction();
                    }
                  }}
                />
                <Button type="button" onClick={addCustomRestriction} variant="outline">
                  Add
                </Button>
              </div>
            </div> */}

            {/* Escalation Clause */}
            {/* <FormField
              control={form.control}
              name="escalationClause"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">Escalation Clause</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., 5% annual increase or details about rent escalation"
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            /> */}

            {/* Navigation Buttons */}
            <div className="flex justify-start gap-4 pt-6" style={{ visibility: 'hidden' }}>
              <Button 
                type="button" 
                variant="outline" 
                onClick={onBack}
                className="h-12 px-8"
              >
                Back
              </Button>
              <Button type="submit" className="h-12 px-8">
                Save & Continue
              </Button>
            </div>
          </form>
        </Form>
      </div>
  );
};
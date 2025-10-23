import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format, addMonths } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { RentalDetails } from '@/types/property';
import { formatExactPriceDisplay } from '@/utils/priceFormatter';

const rentalDetailsSchema = z.object({
  propertyAvailableFor: z.string().optional(),
  expectedPrice: z.number().min(0, "Expected rent must be 0 or greater").optional().or(z.literal(0)),
  expectedLeaseAmount: z.number().min(0, "Expected lease amount must be 0 or greater").optional().or(z.literal(0)),
  rentNegotiable: z.boolean().optional(),
  securityDeposit: z.number().min(0, "Security deposit must be 0 or greater").optional().or(z.literal(0)),
  monthlyMaintenance: z.string().optional(),
  maintenanceAmount: z.number().min(0, "Maintenance amount must be 0 or greater").optional().or(z.literal(0)),
  availableFrom: z.string().optional(),
  preferredTenants: z.array(z.string()).optional(),
  furnishing: z.string().optional(),
  parking: z.string().optional(),
});

type RentalDetailsForm = z.infer<typeof rentalDetailsSchema>;

interface RentalDetailsStepProps {
  initialData?: Partial<RentalDetails>;
  initialAmenities?: { furnishing?: string; parking?: string };
  onNext: (data: RentalDetails, amenities?: { furnishing?: string; parking?: string }) => void;
  onBack: () => void;
  currentStep: number;
  totalSteps: number;
}

export const RentalDetailsStep: React.FC<RentalDetailsStepProps> = ({
  initialData = {},
  initialAmenities = {},
  onNext,
  onBack,
  currentStep,
  totalSteps
}) => {
  const form = useForm<RentalDetailsForm>({
    resolver: zodResolver(rentalDetailsSchema),
    defaultValues: {
      propertyAvailableFor: 'rent',
      expectedPrice: initialData.expectedPrice || undefined,
      expectedLeaseAmount: undefined,
      rentNegotiable: initialData.rentNegotiable || false,
      securityDeposit: initialData.securityDeposit || undefined,
      monthlyMaintenance: initialData.maintenanceExtra ? 'extra' : (initialData.maintenanceIncluded ? 'included' : ''),
      maintenanceAmount: initialData.maintenanceCharges || undefined,
      availableFrom: initialData.availableFrom || '',
      preferredTenants: initialData.idealFor || [],
      furnishing: initialAmenities.furnishing || '',
      parking: initialAmenities.parking || '',
    },
  });

  const propertyType = form.watch('propertyAvailableFor');
  const maintenanceType = form.watch('monthlyMaintenance');

  const onSubmit = (data: RentalDetailsForm) => {
    // Convert form data to RentalDetails format
    const rentalData: RentalDetails = {
      listingType: 'Rent',
      expectedPrice: data.expectedPrice || data.expectedLeaseAmount || 0,
      rentNegotiable: data.rentNegotiable || false,
      maintenanceExtra: data.monthlyMaintenance === 'extra',
      maintenanceIncluded: data.monthlyMaintenance === 'included',
      maintenanceCharges: data.maintenanceAmount || 0,
      securityDeposit: data.securityDeposit || 0,
      depositNegotiable: false,
      leaseDuration: '',
      lockinPeriod: '',
      availableFrom: data.availableFrom || '',
      idealFor: data.preferredTenants || [],
    };
    
    // Extract amenities-related fields
    const amenitiesData = {
      furnishing: data.furnishing,
      parking: data.parking,
    };
    
    onNext(rentalData, amenitiesData);
  };

  return (
    <div className="bg-background p-6">
      <div className="text-left mb-8 pt-4 md:pt-0">
        <h1 className="text-2xl font-semibold text-red-600 mb-2">
          Provide rental details about your property
        </h1>
      </div>
      
      <Form {...form}>
        <form id="rental-details-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Property Available For */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Property available for</h3>
            <FormField
              control={form.control}
              name="propertyAvailableFor"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value || 'rent'}
                      className="flex space-x-6"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="rent" id="rent" />
                        <Label htmlFor="rent">Only rent</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="lease" id="lease" />
                        <Label htmlFor="lease">Only lease</Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Expected Rent/Lease and Deposit - Conditional based on property type */}
          {propertyType === 'rent' ? (
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
                    {/* Expected rent in words display */}
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
                    {/* Security deposit in words display */}
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
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="expectedLeaseAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-900">Expected Lease Amount</FormLabel>
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
                    {/* Expected lease amount in words display */}
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
              <div></div> {/* Empty div to maintain grid structure */}
            </div>
          )}

          {/* Monthly Maintenance and Available From */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="monthlyMaintenance"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-900">Monthly Maintenance</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
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

            <FormField
              control={form.control}
              name="availableFrom"
              render={({ field }) => {
                const [open, setOpen] = React.useState(false);
                
                return (
                  <FormItem className="flex flex-col">
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
          </div>

          {/* Maintenance Amount - shown separately when extra is selected */}
          {maintenanceType === 'extra' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="maintenanceAmount"
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
              <div></div> {/* Empty div to maintain grid structure */}
            </div>
          )}

          {/* Preferred Tenants */}
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-4">Preferred Tenants</h3>
            <FormField
              control={form.control}
              name="preferredTenants"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="flex flex-wrap gap-4">
                      {['Anyone', 'Family', 'Bachelor Female', 'Bachelor Male', 'Company'].map((tenant) => (
                        <div key={tenant} className="flex items-center space-x-2">
                          <Checkbox 
                            id={tenant}
                            checked={field.value?.includes(tenant) || false}
                            onCheckedChange={(checked) => {
                              const currentTenants = field.value || [];
                              if (checked) {
                                field.onChange([...currentTenants, tenant]);
                              } else {
                                field.onChange(currentTenants.filter(t => t !== tenant));
                              }
                            }}
                          />
                          <label htmlFor={tenant} className="text-sm text-gray-700">
                            {tenant}
                          </label>
                        </div>
                      ))}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Furnishing and Parking */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-20">
            <FormField
              control={form.control}
              name="furnishing"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-900">Furnishing</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-white border shadow-lg z-50">
                      <SelectItem value="fully-furnished">Fully Furnished</SelectItem>
                      <SelectItem value="semi-furnished">Semi Furnished</SelectItem>
                      <SelectItem value="unfurnished">Unfurnished</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="parking"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-900">Parking</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-white border shadow-lg z-50">
                      <SelectItem value="car">Car Parking</SelectItem>
                      <SelectItem value="bike">Bike Parking</SelectItem>
                      <SelectItem value="both">Car + Bike Parking</SelectItem>
                      <SelectItem value="none">No Parking</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

        </form>
      </Form>
      
      {/* Hidden submit button for sticky bar */}
      <button type="submit" form="rental-details-form" className="hidden" />
    </div>
  );
};
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
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <h1 className="text-2xl font-semibold text-primary mb-6">Commercial Rental Details</h1>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Expected Rent */}
            <div>
              <FormField
                control={form.control}
                name="expectedPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Expected Rent</FormLabel>
                    <div className="flex items-center space-x-4">
                       <div className="flex-1">
                         <FormControl>
                           <PriceInput 
                             placeholder="Enter Amount"
                             className="h-12"
                             value={field.value}
                             onChange={field.onChange}
                           />
                          </FormControl>
                        </div>
                     </div>
                     {/* Price in words display */}
                     {field.value && field.value > 0 && (
                       <div className="mt-2">
                         <p className="text-sm text-gray-600">
                           {formatExactPriceDisplay(field.value)}
                         </p>
                       </div>
                     )}
                    <div className="flex items-center space-x-6 mt-2">
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
                            <label htmlFor="rentNegotiable" className="text-sm text-gray-600">Rent Negotiable</label>
                          </div>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="maintenanceExtra"
                        render={({ field }) => (
                          <div className="flex items-center space-x-2">
                            <Checkbox 
                              id="maintenanceExtra"
                              checked={field.value}
                              onCheckedChange={(checked) => {
                                field.onChange(checked);
                                setShowMaintenanceInput(!!checked);
                                if (!checked) {
                                  form.setValue('maintenanceCharges', 0);
                                }
                              }}
                            />
                            <label htmlFor="maintenanceExtra" className="text-sm text-gray-600">Maintenance Extra</label>
                          </div>
                        )}
                      />
                    </div>
                    {showMaintenanceInput && (
                      <div className="mt-4">
                        <FormField
                          control={form.control}
                          name="maintenanceCharges"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium">Maintenance Amount (₹/month)</FormLabel>
                               <FormControl>
                                 <PriceInput 
                                   placeholder="Enter maintenance amount"
                                   className="h-12"
                                   value={field.value}
                                   onChange={field.onChange}
                                 />
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
                      </div>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Deposit and Duration */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormField
                control={form.control}
                name="securityDeposit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Security Deposit (INR)</FormLabel>
                     <FormControl>
                       <PriceInput 
                         placeholder="Enter Amount"
                         className="h-12"
                         value={field.value}
                         onChange={field.onChange}
                       />
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
                            <label htmlFor="depositNegotiable" className="text-sm text-gray-600">Deposit Negotiable</label>
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
                name="leaseDuration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Lease Duration (Years)</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-12">
                          <SelectValue placeholder="Lease Duration" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
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
                    <FormLabel className="text-sm font-medium">Lock-in Period (Years)</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-12">
                          <SelectValue placeholder="Lock-in Period" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
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
                  <FormItem className="flex flex-col">
                    <FormLabel className="text-sm font-medium">Available From</FormLabel>
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
                          {field.value ? format(new Date(field.value), "PPP") : <span>Pick a date</span>}
                        </Button>
                      </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value ? new Date(field.value) : undefined}
                          onSelect={(date) => {
                            if (date) {
                              field.onChange(format(date, "yyyy-MM-dd"));
                              setOpen(false);
                            }
                          }}
                          disabled={(date) => {
                            const today = new Date();
                            today.setHours(0, 0, 0, 0);
                            const maxDate = addMonths(today, 2); // 2 months for rent
                            return date < today || date > maxDate;
                          }}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />

            {/* Suitable Business Types */}
            <div className="space-y-4">
              <FormLabel className="text-sm font-medium">Suitable Business Types</FormLabel>
              <div className="flex flex-wrap gap-2">
                {predefinedBusinessTypes.map((type) => (
                  <Badge
                    key={type}
                    variant={selectedBusinessTypes.includes(type) ? "default" : "outline"}
                    className="cursor-pointer px-3 py-1"
                    onClick={() => toggleBusinessType(type)}
                  >
                    {type}
                  </Badge>
                ))}
              </div>
              <div className="flex space-x-2">
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
            <div className="flex justify-between pt-6">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onBack}
              >
                Back
              </Button>
              <Button type="submit">
                Save & Continue
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};
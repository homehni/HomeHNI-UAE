import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { RentalDetails } from '@/types/property';
import { Home, MapPin, Building, Sparkles, Camera, FileText, Calendar as CalendarStep } from 'lucide-react';

const rentalDetailsSchema = z.object({
  listingType: z.enum(['Sale', 'Rent']),
  expectedPrice: z.number().min(1, 'Expected rent is required'),
  rentNegotiable: z.boolean().optional(),
  maintenanceExtra: z.boolean().optional(),
  maintenanceCharges: z.number().optional(),
  securityDeposit: z.number().min(1, 'Deposit is required'),
  depositNegotiable: z.boolean().optional(),
  leaseDuration: z.string().min(1, 'Please select lease duration'),
  lockinPeriod: z.string().min(1, 'Please select lockin period'),
  availableFrom: z.string().min(1, 'Please select available from date'),
  idealFor: z.array(z.string()).optional(),
}).refine((data) => {
  // If maintenanceExtra is true, maintenanceCharges must be provided
  if (data.maintenanceExtra && (!data.maintenanceCharges || data.maintenanceCharges <= 0)) {
    return false;
  }
  return true;
}, {
  message: "Maintenance amount is required when Maintenance Extra is selected",
  path: ["maintenanceCharges"],
});

type RentalDetailsForm = z.infer<typeof rentalDetailsSchema>;

interface RentalDetailsStepProps {
  initialData?: Partial<RentalDetails>;
  onNext: (data: RentalDetails) => void;
  onBack: () => void;
  currentStep: number;
  totalSteps: number;
}

export const RentalDetailsStep: React.FC<RentalDetailsStepProps> = ({
  initialData = {},
  onNext,
  onBack,
  currentStep,
  totalSteps
}) => {
  const [customTag, setCustomTag] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>(initialData.idealFor || []);

  const [showMaintenanceInput, setShowMaintenanceInput] = useState(initialData.maintenanceExtra || false);

  const form = useForm<RentalDetailsForm>({
    resolver: zodResolver(rentalDetailsSchema),
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
      idealFor: initialData.idealFor || [],
    },
  });

  const predefinedTags = ['Bank', 'Service Center', 'Show Room', 'ATM', 'Retail'];


  const toggleTag = (tag: string) => {
    const newTags = selectedTags.includes(tag)
      ? selectedTags.filter(t => t !== tag)
      : [...selectedTags, tag];
    setSelectedTags(newTags);
    form.setValue('idealFor', newTags);
  };

  const addCustomTag = () => {
    if (customTag.trim() && !selectedTags.includes(customTag.trim())) {
      const newTags = [...selectedTags, customTag.trim()];
      setSelectedTags(newTags);
      form.setValue('idealFor', newTags);
      setCustomTag('');
    }
  };

  const onSubmit = (data: RentalDetailsForm) => {
    // Convert form data to RentalDetails format
    const rentalData: RentalDetails = {
      ...data,
      idealFor: selectedTags,
    };
    onNext(rentalData);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
      <h1 className="text-2xl font-semibold text-primary mb-6">Provide rental details about your property</h1>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  {/* Expected Rent */}
                  <div>
                    <FormField
                      control={form.control}
                      name="expectedPrice"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">Expected Rent *</FormLabel>
                          <div className="flex items-center space-x-4">
                            <div className="flex-1 relative">
                              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                              <FormControl>
                                <Input 
                                  type="text" 
                                  placeholder="Enter Amount"
                                  className="pl-8 h-12"
                                 onChange={(e) => {
                                   const value = e.target.value.replace(/[^0-9]/g, '');
                                   field.onChange(value ? parseInt(value) : undefined);
                                 }}
                                 value={field.value ? String(field.value) : ''}
                                />
                              </FormControl>
                              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">/ Month</span>
                            </div>
                          </div>
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
                                    <div className="relative">
                                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                                      <FormControl>
                                        <Input 
                                          type="text" 
                                          placeholder="Enter maintenance amount"
                                          className="pl-8 h-12"
                                         onChange={(e) => {
                                           const value = e.target.value.replace(/[^0-9]/g, '');
                                           field.onChange(value ? parseInt(value) : undefined);
                                         }}
                                         value={field.value ? String(field.value) : ''}
                                        />
                                      </FormControl>
                                    </div>
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
                          <FormLabel className="text-sm font-medium">Deposit Amount (INR) *</FormLabel>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                            <FormControl>
                              <Input 
                                type="text" 
                                placeholder="Enter Amount"
                                className="pl-8 h-12"
                                 onChange={(e) => {
                                   const value = e.target.value.replace(/[^0-9]/g, '');
                                   field.onChange(value ? parseInt(value) : undefined);
                                 }}
                                 value={field.value ? String(field.value) : ''}
                              />
                            </FormControl>
                          </div>
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
                          <FormLabel className="text-sm font-medium">Lockin Period (Years)</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="h-12">
                                <SelectValue placeholder="Lockin Period" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="0">No Lock-in</SelectItem>
                              <SelectItem value="1">1 Year</SelectItem>
                              <SelectItem value="2">2 Years</SelectItem>
                              <SelectItem value="3">3 Years</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="availableFrom"
                    render={({ field }) => {
                      const [open, setOpen] = React.useState(false);
                      
                      return (
                        <FormItem className="flex flex-col">
                          <FormLabel className="text-sm font-medium">Available From *</FormLabel>
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
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value ? new Date(field.value) : undefined}
                              onSelect={(date) => {
                                field.onChange(date ? format(date, "yyyy-MM-dd") : "");
                                setOpen(false);
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


                   {/* Ideal For */}
                   <div>
                     <FormLabel className="text-sm font-medium">Ideal For</FormLabel>
                    <div className="mt-2 space-y-4">
                      <div className="flex flex-wrap gap-2">
                        {predefinedTags.map((tag) => (
                          <Badge
                            key={tag}
                            variant={selectedTags.includes(tag) ? "default" : "outline"}
                            className="cursor-pointer px-4 py-2"
                            onClick={() => toggleTag(tag)}
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Input
                          type="text"
                          placeholder="Add other tags"
                          value={customTag}
                          onChange={(e) => setCustomTag(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && addCustomTag()}
                          className="flex-1"
                        />
                        <Button
                          type="button"
                          variant="link"
                          onClick={addCustomTag}
                          className="text-primary"
                        >
                          create new tag
                        </Button>
                      </div>

                      {selectedTags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {selectedTags.map((tag) => (
                            <Badge
                              key={tag}
                              variant="default"
                              className="cursor-pointer"
                              onClick={() => toggleTag(tag)}
                            >
                              {tag} ×
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-between pt-6">
                    <Button type="button" variant="outline" onClick={onBack} className="px-8">
                      Back
                    </Button>
                    <Button type="submit" className="px-8 bg-red-500 hover:bg-red-600">
                      Save & Continue
                    </Button>
                  </div>
                  </form>
                </Form>
    </div>
  );
};
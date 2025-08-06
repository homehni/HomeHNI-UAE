import React from 'react';
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
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { SaleDetails } from '@/types/saleProperty';
import { Home, MapPin, Building, Sparkles, Camera, FileText, Calendar as CalendarStep } from 'lucide-react';

const saleDetailsSchema = z.object({
  listingType: z.enum(['Sale', 'Resale']),
  expectedPrice: z.number().min(1, 'Expected price is required'),
  priceNegotiable: z.boolean().optional(),
  possessionDate: z.string().optional(),
  ageOfProperty: z.string().optional(),
  registrationStatus: z.string().optional(),
  homeLoanAvailable: z.boolean().optional(),
  brokerageType: z.string().optional(),
  currentPropertyCondition: z.string().optional(),
  flooringType: z.string().optional(),
  facingDirection: z.string().optional(),
});

type SaleDetailsForm = z.infer<typeof saleDetailsSchema>;

interface SaleDetailsStepProps {
  initialData?: Partial<SaleDetails>;
  onNext: (data: SaleDetails) => void;
  onBack: () => void;
  currentStep: number;
  totalSteps: number;
}

export const SaleDetailsStep: React.FC<SaleDetailsStepProps> = ({
  initialData = {},
  onNext,
  onBack,
  currentStep,
  totalSteps
}) => {
  const form = useForm<SaleDetailsForm>({
    resolver: zodResolver(saleDetailsSchema),
    defaultValues: {
      listingType: initialData.listingType || 'Resale',
      expectedPrice: initialData.expectedPrice || undefined,
      priceNegotiable: initialData.priceNegotiable || false,
      possessionDate: initialData.possessionDate || '',
      ageOfProperty: initialData.ageOfProperty || '',
      registrationStatus: initialData.registrationStatus || '',
      homeLoanAvailable: initialData.homeLoanAvailable || false,
      brokerageType: initialData.brokerageType || '',
      currentPropertyCondition: initialData.currentPropertyCondition || '',
      flooringType: initialData.flooringType || '',
      facingDirection: initialData.facingDirection || '',
    },
  });

  const steps = [
    { icon: Home, label: 'Property Details', active: currentStep === 2 },
    { icon: MapPin, label: 'Location Details', active: currentStep === 3 },
    { icon: Building, label: 'Sale Details', active: currentStep === 4 },
    { icon: Sparkles, label: 'Amenities', active: currentStep === 5 },
    { icon: Camera, label: 'Gallery', active: currentStep === 6 },
    { icon: FileText, label: 'Additional Information', active: currentStep === 7 },
    { icon: CalendarStep, label: 'Schedule', active: currentStep === 8 },
  ];

  const progressPercentage = Math.round((currentStep / totalSteps) * 100);

  const onSubmit = (data: SaleDetailsForm) => {
    const saleData: SaleDetails = {
      ...data,
    };
    onNext(saleData);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Home className="h-6 w-6 text-primary" />
            <span className="text-lg font-semibold">PropertyHub</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">{progressPercentage}% Done</span>
            <Button variant="outline" size="sm">Preview</Button>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white border-r border-gray-200 min-h-screen">
          <div className="p-6">
            <nav className="space-y-2">
              {steps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <div
                    key={step.label}
                    className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                      step.active
                        ? 'bg-primary/10 text-primary border-l-4 border-primary'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="text-sm font-medium">{step.label}</span>
                  </div>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
              <h1 className="text-2xl font-semibold text-primary mb-6">Provide sale details about your property</h1>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  {/* Expected Price */}
                  <div>
                    <FormField
                      control={form.control}
                      name="expectedPrice"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">Expected Price *</FormLabel>
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
                            </div>
                          </div>
                          <div className="flex items-center space-x-6 mt-2">
                            <FormField
                              control={form.control}
                              name="priceNegotiable"
                              render={({ field }) => (
                                <div className="flex items-center space-x-2">
                                  <Checkbox 
                                    id="priceNegotiable"
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                  <label htmlFor="priceNegotiable" className="text-sm text-gray-600">Price Negotiable</label>
                                </div>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="homeLoanAvailable"
                              render={({ field }) => (
                                <div className="flex items-center space-x-2">
                                  <Checkbox 
                                    id="homeLoanAvailable"
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                  <label htmlFor="homeLoanAvailable" className="text-sm text-gray-600">Home Loan Available</label>
                                </div>
                              )}
                            />
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Property Age and Registration Status */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="ageOfProperty"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">Age of Property</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="h-12">
                                <SelectValue placeholder="Select Age" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="0-1">0-1 Years (New)</SelectItem>
                              <SelectItem value="1-5">1-5 Years</SelectItem>
                              <SelectItem value="5-10">5-10 Years</SelectItem>
                              <SelectItem value="10-15">10-15 Years</SelectItem>
                              <SelectItem value="15+">15+ Years</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="registrationStatus"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">Registration Status</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="h-12">
                                <SelectValue placeholder="Select Status" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="ready-to-move">Ready to Move</SelectItem>
                              <SelectItem value="under-construction">Under Construction</SelectItem>
                              <SelectItem value="new-launch">New Launch</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Possession Date */}
                  <FormField
                    control={form.control}
                    name="possessionDate"
                    render={({ field }) => {
                      const [open, setOpen] = React.useState(false);
                      
                      return (
                        <FormItem className="flex flex-col">
                          <FormLabel className="text-sm font-medium">Possession Date</FormLabel>
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
                                  format(new Date(field.value), "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                              </Button>
                            </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value ? new Date(field.value) : undefined}
                                onSelect={(date) => {
                                  field.onChange(date ? format(date, 'yyyy-MM-dd') : '');
                                  setOpen(false);
                                }}
                                disabled={(date) =>
                                  date < new Date()
                                }
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      );
                    }}
                  />

                  {/* Property Condition and Features */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="currentPropertyCondition"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">Property Condition</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="h-12">
                                <SelectValue placeholder="Select Condition" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="excellent">Excellent</SelectItem>
                              <SelectItem value="good">Good</SelectItem>
                              <SelectItem value="average">Average</SelectItem>
                              <SelectItem value="needs-renovation">Needs Renovation</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="facingDirection"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">Facing Direction</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="h-12">
                                <SelectValue placeholder="Select Direction" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="north">North</SelectItem>
                              <SelectItem value="south">South</SelectItem>
                              <SelectItem value="east">East</SelectItem>
                              <SelectItem value="west">West</SelectItem>
                              <SelectItem value="north-east">North-East</SelectItem>
                              <SelectItem value="north-west">North-West</SelectItem>
                              <SelectItem value="south-east">South-East</SelectItem>
                              <SelectItem value="south-west">South-West</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="flooringType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">Flooring Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-12">
                              <SelectValue placeholder="Select Flooring" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="marble">Marble</SelectItem>
                            <SelectItem value="tiles">Tiles</SelectItem>
                            <SelectItem value="granite">Granite</SelectItem>
                            <SelectItem value="wooden">Wooden</SelectItem>
                            <SelectItem value="cement">Cement</SelectItem>
                            <SelectItem value="mosaic">Mosaic</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Navigation Buttons */}
                  <div className="flex justify-between pt-6">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={onBack}
                      className="px-8"
                    >
                      Back
                    </Button>
                    <Button
                      type="submit"
                      className="px-8"
                    >
                      Save & Continue
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PriceInput } from '@/components/ui/price-input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Calendar, CalendarIcon, ArrowLeft, ArrowRight, Phone, Compass } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format, addMonths } from 'date-fns';
import { useIsMobile } from '@/hooks/use-mobile';
import { SaleDetails } from '@/types/saleProperty';

// Helper function to convert number to words
const numberToWords = (num: number): string => {
  if (num === 0) return 'Zero';
  
  const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  
  const convertHundreds = (n: number): string => {
    let result = '';
    
    if (n >= 100) {
      result += ones[Math.floor(n / 100)] + ' Hundred';
      n %= 100;
      if (n > 0) result += ' ';
    }
    
    if (n >= 20) {
      result += tens[Math.floor(n / 10)];
      n %= 10;
      if (n > 0) result += ' ' + ones[n];
    } else if (n >= 10) {
      result += teens[n - 10];
    } else if (n > 0) {
      result += ones[n];
    }
    
    return result;
  };
  
  let result = '';
  
  // Crores
  if (num >= 10000000) {
    const crores = Math.floor(num / 10000000);
    result += convertHundreds(crores) + ' Crore';
    num %= 10000000;
    if (num > 0) result += ' ';
  }
  
  // Lakhs
  if (num >= 100000) {
    const lakhs = Math.floor(num / 100000);
    result += convertHundreds(lakhs) + ' Lakh';
    num %= 100000;
    if (num > 0) result += ' ';
  }
  
  // Thousands
  if (num >= 1000) {
    const thousands = Math.floor(num / 1000);
    result += convertHundreds(thousands) + ' Thousand';
    num %= 1000;
    if (num > 0) result += ' ';
  }
  
  // Hundreds and below
  if (num > 0) {
    result += convertHundreds(num);
  }
  
  return result;
};

// Helper function to format price per sq.ft
const formatPricePerSqFt = (price: number, area: number): string => {
  if (!price || !area || area === 0) return '';
  const pricePerSqFt = Math.round(price / area);
  return pricePerSqFt.toLocaleString();
};

const saleDetailsSchema = z.object({
  title: z.string().optional(),
  propertyType: z.string().optional(),
  bhkType: z.string().optional(),
  buildingType: z.string().optional(),
  propertyAge: z.string().min(1, "Property age is required"),
  facing: z.string().optional(),
  floorType: z.string().optional(),
  totalFloors: z.union([z.number(), z.string()]).optional(),
  floorNo: z.union([z.number(), z.string()]).optional(),
  superBuiltUpArea: z.number().min(1, "Super built up area is required and must be greater than 0"),
  onMainRoad: z.boolean().optional(),
  cornerProperty: z.boolean().optional(),
  expectedPrice: z.union([z.number(), z.nan(), z.undefined()]).optional().transform(val => isNaN(val as number) ? undefined : val),
  priceNegotiable: z.boolean().optional(),
  possessionDate: z.string().optional(),
  registrationStatus: z.enum(['ready_to_move', 'under_construction']).optional(),
  homeLoanAvailable: z.boolean().optional(),
  maintenanceCharges: z.union([z.number(), z.nan(), z.undefined()]).optional().transform(val => isNaN(val as number) ? undefined : val),
  pricePerSqFt: z.union([z.number(), z.nan(), z.undefined()]).optional().transform(val => isNaN(val as number) ? undefined : val),
  bookingAmount: z.union([z.number(), z.nan(), z.undefined()]).optional().transform(val => isNaN(val as number) ? undefined : val),
});

type SaleDetailsForm = z.infer<typeof saleDetailsSchema>;

interface SaleDetailsStepProps {
  initialData: Partial<SaleDetails>;
  propertyDetails?: Partial<import('@/types/property').PropertyDetails>;
  onNext: (data: SaleDetails) => void;
  onBack: () => void;
}

export const SaleDetailsStep: React.FC<SaleDetailsStepProps> = ({
  initialData,
  propertyDetails,
  onNext,
  onBack,
}) => {
  const isMobile = useIsMobile();
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(
    initialData.possessionDate ? new Date(initialData.possessionDate) : undefined
  );
  const [isCalendarOpen, setIsCalendarOpen] = React.useState(false);
  const [onMainRoad, setOnMainRoad] = useState(false);
  const [cornerProperty, setCornerProperty] = useState(false);

  const form = useForm<SaleDetailsForm>({
    resolver: zodResolver(saleDetailsSchema),
    defaultValues: {
      title: (initialData as any)?.title || '',
      propertyType: (initialData as any)?.propertyType || '',
      bhkType: (initialData as any)?.bhkType || '',
      buildingType: (initialData as any)?.buildingType || '',
      propertyAge: initialData.propertyAge || '',
      facing: (initialData as any)?.facing || '',
      floorType: (initialData as any)?.floorType || '',
      totalFloors: (initialData as any)?.totalFloors || 1,
      floorNo: (initialData as any)?.floorNo || 0,
      superBuiltUpArea: (initialData as any)?.superBuiltUpArea ?? undefined,
      onMainRoad: (initialData as any)?.onMainRoad || false,
      cornerProperty: (initialData as any)?.cornerProperty || false,
      expectedPrice: initialData.expectedPrice || undefined,
      priceNegotiable: initialData.priceNegotiable ?? true,
      registrationStatus: initialData.registrationStatus || 'ready_to_move',
      homeLoanAvailable: initialData.homeLoanAvailable ?? true,
      maintenanceCharges: initialData.maintenanceCharges || undefined,
      pricePerSqFt: initialData.pricePerSqFt || undefined,
      bookingAmount: initialData.bookingAmount || undefined,
    },
    mode: 'onChange'
  });

  const watchedValues = form.watch();
  const watchedPropertyType = form.watch("propertyType");
  const watchedFloorNo = form.watch("floorNo");
  
  // Properties that show floor dropdown (for apartments, penthouses, etc.)
  const showFloorDropdown = ['Apartment', 'Penthouse', 'Gated Community Villa'].includes(watchedPropertyType);
  
  // Properties that show number of floors
  const showNumberOfFloors = ['Independent House', 'Villa', 'Duplex'].includes(watchedPropertyType);
  
  // Get minimum total floors based on selected floor
  const getMinTotalFloors = () => {
    if (typeof watchedFloorNo === 'number' && watchedFloorNo > 0) {
      return watchedFloorNo;
    }
    return 1;
  };

  const onSubmit = (data: SaleDetailsForm) => {
    const saleData: SaleDetails = {
      listingType: 'Sale',
      expectedPrice: data.expectedPrice || 0,
      priceNegotiable: data.priceNegotiable,
      possessionDate: selectedDate ? selectedDate.toISOString().split('T')[0] : undefined,
      propertyAge: data.propertyAge || '',
      registrationStatus: data.registrationStatus || 'ready_to_move',
      homeLoanAvailable: data.homeLoanAvailable,
      maintenanceCharges: data.maintenanceCharges,
      pricePerSqFt: data.pricePerSqFt,
      bookingAmount: data.bookingAmount,
    };
    onNext(saleData);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
      <h1 className="text-2xl font-semibold text-teal-600 mb-6">
        Provide sale details about your property
      </h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Property Name and Built Up Area */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">Property Name</FormLabel>
                  <FormControl>
                    <Input
                      className="h-10"
                      placeholder="Enter Property Name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="superBuiltUpArea"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">Built Up Area*</FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="943"
                        className="h-10 pr-12 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]"
                        {...field}
                        onChange={(e) => field.onChange(e.target.value === '' ? undefined : parseInt(e.target.value, 10))}
                      />
                    </FormControl>
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-muted-foreground">
                      Sq.ft
                    </div>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Property Type and BHK Type */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="propertyType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">Property Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="h-10">
                        <SelectValue placeholder="Select Property Type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Apartment">Apartment</SelectItem>
                      <SelectItem value="Villa">Villa</SelectItem>
                      <SelectItem value="Independent House">Independent House</SelectItem>
                      <SelectItem value="Penthouse">Penthouse</SelectItem>
                      <SelectItem value="Duplex">Duplex</SelectItem>
                      <SelectItem value="Gated Community Villa">Gated Community Villa</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bhkType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">BHK Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="h-10">
                        <SelectValue placeholder="Select BHK Type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Studio">Studio</SelectItem>
                      <SelectItem value="1 RK">1 RK</SelectItem>
                      <SelectItem value="1 BHK">1 BHK</SelectItem>
                      <SelectItem value="2 BHK">2 BHK</SelectItem>
                      <SelectItem value="3 BHK">3 BHK</SelectItem>
                      <SelectItem value="4 BHK">4 BHK</SelectItem>
                      <SelectItem value="5 BHK">5 BHK</SelectItem>
                      <SelectItem value="5+ BHK">5+ BHK</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Property Age and Facing */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="propertyAge"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">Property Age*</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="h-10">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Under Construction">Under Construction</SelectItem>
                      <SelectItem value="Ready to Move">Ready to Move</SelectItem>
                      <SelectItem value="0-1 Years">0-1 Years</SelectItem>
                      <SelectItem value="1-3 Years">1-3 Years</SelectItem>
                      <SelectItem value="3-5 Years">3-5 Years</SelectItem>
                      <SelectItem value="5-10 Years">5-10 Years</SelectItem>
                      <SelectItem value="10+ Years">10+ Years</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="facing"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">Facing</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="h-10">
                        <div className="flex items-center gap-2">
                          <Compass className="h-4 w-4 text-muted-foreground" />
                          <SelectValue placeholder="Select" />
                        </div>
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="North">North</SelectItem>
                      <SelectItem value="South">South</SelectItem>
                      <SelectItem value="East">East</SelectItem>
                      <SelectItem value="West">West</SelectItem>
                      <SelectItem value="North-East">North-East</SelectItem>
                      <SelectItem value="North-West">North-West</SelectItem>
                      <SelectItem value="South-East">South-East</SelectItem>
                      <SelectItem value="South-West">South-West</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Floor, Total Floors / No. of Floors */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {showFloorDropdown && (
              <FormField
                control={form.control}
                name="floorNo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Floor*</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        if (value === 'ground') {
                          field.onChange(0);
                        } else if (value === 'basement') {
                          field.onChange('basement');
                        } else {
                          field.onChange(parseInt(value));
                        }
                      }}
                      value={
                        field.value === undefined ? undefined : 
                        field.value === 0 ? 'ground' :
                        field.value === 'basement' ? 'basement' :
                        field.value.toString()
                      }
                    >
                      <FormControl>
                        <SelectTrigger className="h-10">
                          <SelectValue placeholder="Select Floor" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="basement">Basement</SelectItem>
                        <SelectItem value="ground">Ground Floor</SelectItem>
                        {[...Array(50)].map((_, i) => {
                          const floor = i + 1;
                          return (
                            <SelectItem key={floor} value={floor.toString()}>
                              {floor}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {showFloorDropdown ? (
              <FormField
                control={form.control}
                name="totalFloors"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Total Floor*</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(parseInt(value))}
                      defaultValue={field.value?.toString()}
                    >
                      <FormControl>
                        <SelectTrigger className="h-10">
                          <SelectValue placeholder="Select Total Floors" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {[...Array(50)].map((_, i) => {
                          const floor = i + 1;
                          const minFloors = getMinTotalFloors();
                          if (floor >= minFloors) {
                            return (
                              <SelectItem key={floor} value={floor.toString()}>
                                {floor}
                              </SelectItem>
                            );
                          }
                          return null;
                        }).filter(Boolean)}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ) : showNumberOfFloors ? (
              <FormField
                control={form.control}
                name="totalFloors"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">No. of Floors</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(parseInt(value))}
                      defaultValue={field.value?.toString()}
                    >
                      <FormControl>
                        <SelectTrigger className="h-10">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {[...Array(10)].map((_, i) => {
                          const floor = i + 1;
                          return (
                            <SelectItem key={floor} value={floor.toString()}>
                              {floor}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ) : null}
          </div>

          {/* Additional Features */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Additional Features</h3>
            <div className="flex flex-wrap gap-3">
              <Badge
                variant={onMainRoad ? "default" : "outline"}
                className="cursor-pointer px-4 py-2"
                onClick={() => setOnMainRoad(!onMainRoad)}
              >
                On Main Road
              </Badge>
              <Badge
                variant={cornerProperty ? "default" : "outline"}
                className="cursor-pointer px-4 py-2"
                onClick={() => setCornerProperty(!cornerProperty)}
              >
                Corner Property
              </Badge>
            </div>
          </div>
          {/* Sale Price */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="expectedPrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">
                    Sale Price (₹) <span className="text-muted-foreground">(Optional)</span>
                  </FormLabel>
                  <FormControl>
                    <PriceInput
                      placeholder="Enter Amount"
                      value={field.value}
                      onChange={field.onChange}
                      className="h-10"
                    />
                  </FormControl>
                  {/* Price in words display */}
                  {field.value && field.value > 0 && (
                    <div className="mt-2">
                      <p className="text-sm text-black">
                        ₹ {numberToWords(field.value)}
                        {watchedValues.superBuiltUpArea && (
                          <span className="text-gray-600">
                            {' '}(₹ {formatPricePerSqFt(field.value, watchedValues.superBuiltUpArea)} per sq.ft)
                          </span>
                        )}
                      </p>
                    </div>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="pricePerSqFt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">
                    Price per Sq.Ft (₹) <span className="text-muted-foreground">(Optional)</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="e.g. 4500"
                      value={
                        watchedValues.expectedPrice && watchedValues.superBuiltUpArea
                          ? Math.round(watchedValues.expectedPrice / watchedValues.superBuiltUpArea)
                          : field.value || ''
                      }
                      onChange={(e) => {
                        const value = e.target.value ? Number(e.target.value) : undefined;
                        field.onChange(value);
                      }}
                      className="h-10"
                    />
                  </FormControl>
                  {/* Auto-calculated price per sq.ft display */}
                  {watchedValues.expectedPrice && watchedValues.superBuiltUpArea && (
                    <div className="mt-2">
                      <p className="text-sm text-gray-700">
                        Built-up Area: ₹{formatPricePerSqFt(watchedValues.expectedPrice, watchedValues.superBuiltUpArea)} per sq.ft
                      </p>
                    </div>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Price Options */}
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
                <Label htmlFor="priceNegotiable" className="text-sm">
                  Price Negotiable
                </Label>
              </div>
            )}
          />

          {/* Registration Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="registrationStatus"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">Availability Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="h-10">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="ready_to_move">Ready to Move</SelectItem>
                      <SelectItem value="under_construction">Under Construction</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Possession Date */}
          <div>
            <Label className="text-sm font-medium">Possession Date</Label>
            <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal mt-1 h-10",
                    !selectedDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? format(selectedDate, "PPP") : "Select possession date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => {
                    setSelectedDate(date);
                    setIsCalendarOpen(false);
                  }}
                  disabled={(date) => {
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    const maxDate = addMonths(today, 6);
                    return date < today || date > maxDate;
                  }}
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Additional Charges */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="maintenanceCharges"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">
                    Monthly Maintenance (₹) <span className="text-muted-foreground">(Optional)</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="e.g. 2500"
                      {...field}
                      onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                      className="h-10"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bookingAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">
                    Booking Amount (₹) <span className="text-muted-foreground">(Optional)</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="e.g. 100000"
                      {...field}
                      onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                      className="h-10"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Loan Availability */}
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
                <Label htmlFor="homeLoanAvailable" className="text-sm">
                  Home Loan Available
                </Label>
              </div>
            )}
          />

          {/* Help Section */}
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Phone className="h-5 w-5 text-orange-600" />
              <span className="text-sm text-gray-700">Don't want to fill all the details? Let us help you!</span>
            </div>
            <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white">
              I'm interested
            </Button>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-4">
            <Button type="button" variant="outline" onClick={onBack} className="h-10 px-6">
              {!isMobile && <ArrowLeft className="mr-2 h-4 w-4" />}
              Back
            </Button>
            <Button type="submit" className="h-10 px-6">
              Save & Continue
              {!isMobile && <ArrowRight className="ml-2 h-4 w-4" />}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
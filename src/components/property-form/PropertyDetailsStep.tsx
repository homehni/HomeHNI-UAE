import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { PropertyDetails } from '@/types/property';
import { Phone, Compass } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
const propertyDetailsSchema = z.object({
  title: z.string().optional(),
  // Made optional - will be auto-generated
  propertyType: z.string().optional(),
  bhkType: z.string().optional(),
  buildingType: z.string().optional(),
  propertyAge: z.string().min(1, "Property age is required"),
  facing: z.string().optional(),
  floorType: z.string().optional(),
  totalFloors: z.union([z.number(), z.string()]).optional(),
  floorNo: z.union([z.number(), z.string()]).optional(),
  superBuiltUpArea: z.number().min(1, "Super built up area is required and must be at least 1"),
  onMainRoad: z.boolean().optional(),
  cornerProperty: z.boolean().optional()
});
type PropertyDetailsFormData = z.infer<typeof propertyDetailsSchema>;
interface PropertyDetailsStepProps {
  initialData?: Partial<PropertyDetails>;
  onNext: (data: PropertyDetails) => void;
  onBack: () => void;
  currentStep: number;
  totalSteps: number;
}
export const PropertyDetailsStep: React.FC<PropertyDetailsStepProps> = ({
  initialData = {},
  onNext,
  onBack,
  currentStep,
  totalSteps
}) => {
  const {
    toast
  } = useToast();
  const [isInterested, setIsInterested] = useState(false);
  const form = useForm<PropertyDetailsFormData>({
    resolver: zodResolver(propertyDetailsSchema),
    defaultValues: {
      title: initialData.title || '',
      propertyType: initialData.propertyType || '',
      bhkType: initialData.bhkType || '',
      buildingType: initialData.buildingType || '',
      propertyAge: initialData.propertyAge || '',
      facing: initialData.facing || '',
      // propertyAge removed - not part of the schema
      floorType: initialData.floorType || '',
      totalFloors: initialData.totalFloors || 1,
      floorNo: initialData.floorNo || 0,
      superBuiltUpArea: initialData.superBuiltUpArea ?? undefined,
      onMainRoad: initialData.onMainRoad || false,
      cornerProperty: initialData.cornerProperty || false
    }
  });
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
  const onSubmit = (data: PropertyDetailsFormData) => {
    console.log('PropertyDetailsStep submitting data:', data);

    // Pass the form data merged with initial data to maintain all PropertyDetails fields
    onNext({
      ...initialData,
      // Keep existing fields like title, bhkType, etc.
      ...data,
      onMainRoad: data.onMainRoad || false,
      cornerProperty: data.cornerProperty || false
    } as PropertyDetails);
  };
  return <div className="flex flex-col h-full">
      {/* Form Content - Scrollable */}
      <div className="flex-1 overflow-y-auto p-6">
        <h1 className="text-2xl mb-6 font-semibold text-red-600">Property Details</h1>
        
        <Form {...form}>
          <form id="property-details-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Property Name and Built Up Area */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField control={form.control} name="title" render={({
              field
            }) => <FormItem>
                    <FormLabel className="text-sm font-medium">Property Name</FormLabel>
                    <FormControl>
                      <Input className="h-10" placeholder="Enter Property Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>} />

              <FormField control={form.control} name="superBuiltUpArea" render={({
              field
            }) => <FormItem>
                    <FormLabel className="text-sm font-medium">Built Up Area</FormLabel>
                    <div className="relative">
                      <FormControl>
                        <Input type="number" placeholder="" min="1" className="h-10 pr-12 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]" {...field} onKeyDown={e => {
                    if (['-', '+', 'e', 'E', '.'].includes(e.key)) e.preventDefault();
                  }} onPaste={e => {
                    const text = e.clipboardData.getData('text');
                    const digits = text.replace(/[^0-9]/g, '');
                    if (digits !== text) {
                      e.preventDefault();
                      field.onChange(digits ? Math.max(1, Number(digits)) : undefined);
                    }
                  }} value={field.value || ''} onChange={e => field.onChange(e.target.value ? Math.max(1, Number(e.target.value)) : undefined)} />
                      </FormControl>
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-muted-foreground">
                        Sq.ft
                      </div>
                    </div>
                    <FormMessage />
                  </FormItem>} />
            </div>

            {/* Property Type and BHK Type */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField control={form.control} name="propertyType" render={({
              field
            }) => <FormItem>
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
                  </FormItem>} />

              <FormField control={form.control} name="bhkType" render={({
              field
            }) => <FormItem>
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
                  </FormItem>} />
            </div>

            {/* Property Age and Facing */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField control={form.control} name="propertyAge" render={({
              field
            }) => <FormItem>
                    <FormLabel className="text-sm font-medium">Property Age</FormLabel>
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
                  </FormItem>} />

              <FormField control={form.control} name="facing" render={({
              field
            }) => <FormItem>
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
                  </FormItem>} />
            </div>

            {/* Floor, Total Floors / No. of Floors */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {showFloorDropdown && <FormField control={form.control} name="floorNo" render={({
              field
            }) => <FormItem>
                      <FormLabel className="text-sm font-medium">Floor</FormLabel>
                      <Select onValueChange={value => {
                if (value === 'ground') {
                  field.onChange(0);
                } else if (value === 'basement') {
                  field.onChange('basement');
                } else {
                  field.onChange(parseInt(value));
                }
              }} value={field.value === undefined ? undefined : field.value === 0 ? 'ground' : field.value === 'basement' ? 'basement' : field.value.toString()}>
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
                    return <SelectItem key={floor} value={floor.toString()}>
                                {floor}
                              </SelectItem>;
                  })}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>} />}

              {showFloorDropdown ? <FormField control={form.control} name="totalFloors" render={({
              field
            }) => <FormItem>
                      <FormLabel className="text-sm font-medium">Total Floor</FormLabel>
                      <Select onValueChange={value => field.onChange(parseInt(value))} defaultValue={field.value?.toString()}>
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
                      return <SelectItem key={floor} value={floor.toString()}>
                                  {floor}
                                </SelectItem>;
                    }
                    return null;
                  }).filter(Boolean)}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>} /> : showNumberOfFloors ? <FormField control={form.control} name="totalFloors" render={({
              field
            }) => <FormItem>
                      <FormLabel className="text-sm font-medium">No. of Floors</FormLabel>
                      <Select onValueChange={value => field.onChange(parseInt(value))} defaultValue={field.value?.toString()}>
                        <FormControl>
                          <SelectTrigger className="h-10">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {[...Array(10)].map((_, i) => {
                    const floor = i + 1;
                    return <SelectItem key={floor} value={floor.toString()}>
                                {floor}
                              </SelectItem>;
                  })}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>} /> : null}
            </div>


            {/* Help Section */}
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-orange-600" />
                <span className="text-sm text-gray-700">
                  {isInterested ? "Thank you for the interest. Our agent will give you a call shortly." : "Don't want to fill all the details? Let us help you!"}
                </span>
              </div>
              {!isInterested && <Button type="button" variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white" onClick={() => setIsInterested(true)}>
                  I'm interested
                </Button>}
            </div>
          </form>
        </Form>
        
        {/* Hidden submit button for sticky bar */}
        <button type="submit" form="property-details-form" className="hidden" />
      </div>

    </div>;
};
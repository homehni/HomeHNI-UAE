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
import { ArrowLeft, ArrowRight, Compass } from 'lucide-react';
const resalePropertyDetailsSchema = z.object({
  title: z.string().optional(),
  // Made optional - will be auto-generated
  propertyType: z.string().optional(),
  bhkType: z.string().min(1, "BHK Type is required"),
  ownershipType: z.string().optional(),
  builtUpArea: z.number().min(0, "Built up area must be 0 or greater").optional().or(z.literal(0)),
  carpetArea: z.number().optional(),
  propertyAge: z.string().optional(),
  facing: z.string().optional(),
  floorNo: z.union([z.number(), z.string()]).optional(),
  totalFloors: z.union([z.number(), z.string()]).optional()
});
type ResalePropertyDetailsFormData = z.infer<typeof resalePropertyDetailsSchema>;
interface ResalePropertyDetailsStepProps {
  initialData?: Partial<PropertyDetails>;
  onNext: (data: PropertyDetails) => void;
  onBack: () => void;
  formId?: string;
}
export const ResalePropertyDetailsStep: React.FC<ResalePropertyDetailsStepProps> = ({
  initialData = {},
  onNext,
  onBack,
  formId
}) => {
  const form = useForm<ResalePropertyDetailsFormData>({
    resolver: zodResolver(resalePropertyDetailsSchema),
    defaultValues: {
      title: initialData.title || '',
      propertyType: initialData.propertyType || '',
      bhkType: initialData.bhkType || '',
      ownershipType: (initialData as any).ownershipType || '',
      builtUpArea: initialData.superBuiltUpArea || undefined,
      carpetArea: (initialData as any).carpetArea || undefined,
      propertyAge: (initialData as any).propertyAge || '',
      facing: (initialData as any).facing || '',
      floorNo: initialData.floorNo || 0,
      totalFloors: initialData.totalFloors || 1
    }
  });
  const [onMainRoad, setOnMainRoad] = useState(initialData.onMainRoad || false);
  const [cornerProperty, setCornerProperty] = useState(initialData.cornerProperty || false);
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
  const onSubmit = (data: ResalePropertyDetailsFormData) => {
    console.log('✅ ResalePropertyDetailsStep onSubmit called with data:', data);
    console.log('Form validation state:', form.formState);
    console.log('Form errors:', form.formState.errors);
    console.log('Form is valid:', form.formState.isValid);
    onNext({
      ...initialData,
      title: data.title || '',
      propertyType: data.propertyType,
      buildingType: data.propertyType,
      // Use propertyType as buildingType for residential
      bhkType: data.bhkType || '',
      ownershipType: data.ownershipType || '',
      superBuiltUpArea: data.builtUpArea || 0,
      builtUpArea: data.builtUpArea || 0,
      carpetArea: data.carpetArea || 0,
      propertyAge: data.propertyAge || '',
      facing: data.facing || '',
      floorNo: data.floorNo || 0,
      totalFloors: data.totalFloors || 1,
      onMainRoad,
      cornerProperty
    } as PropertyDetails);
  };
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
      <h1 className="text-2xl mb-6 font-semibold text-[#22c55e]">Property Details</h1>

      <Form {...form}>
        <form id={formId} onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Property Type and BHK Type */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField control={form.control} name="propertyType" render={({
            field
          }) => <FormItem>
                  <FormLabel className="text-sm font-medium">Property Type</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-white border shadow-lg z-50">
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
                  <FormLabel className="text-sm font-medium">BHK Type *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-white border shadow-lg z-50">
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

          {/* Property Name and Ownership Type */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField control={form.control} name="title" render={({
            field
          }) => <FormItem>
                  <FormLabel className="text-sm font-medium">Property Name (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter Property Name" className="h-12" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>} />

            <FormField control={form.control} name="ownershipType" render={({
            field
          }) => <FormItem>
                  <FormLabel className="text-sm font-medium">Ownership Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-white border shadow-lg z-50">
                      <SelectItem value="Freehold">Self Owned</SelectItem>
                      <SelectItem value="Leasehold">Leasehold</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>} />
          </div>

          {/* Built Up Area and Carpet Area */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField control={form.control} name="builtUpArea" render={({
            field
          }) => <FormItem>
                  <FormLabel className="text-sm font-medium">Built Up Area</FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input type="number" placeholder="Built Up Area" min="1" className="h-12 pr-12 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]" {...field} onKeyDown={e => {
                  if (['-', '+', 'e', 'E', '.'].includes(e.key)) e.preventDefault();
                }} onPaste={e => {
                  const text = e.clipboardData.getData('text');
                  const digits = text.replace(/[^0-9]/g, '');
                  if (digits !== text) {
                    e.preventDefault();
                    field.onChange(digits ? Math.max(1, Number(digits)) : undefined);
                  }
                }} value={field.value || ''} onChange={e => {
                  const value = parseInt(e.target.value);
                  if (isNaN(value) || value < 1) {
                    field.onChange(undefined);
                  } else {
                    field.onChange(value);
                  }
                }} />
                    </FormControl>
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500">
                      Sq.ft
                    </div>
                  </div>
                </FormItem>} />

            <FormField control={form.control} name="carpetArea" render={({
            field
          }) => <FormItem>
                  <FormLabel className="text-sm font-medium">Carpet Area</FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input type="number" placeholder="Carpet Area" min="1" className="h-12 pr-12 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]" {...field} onKeyDown={e => {
                  if (['-', '+', 'e', 'E', '.'].includes(e.key)) e.preventDefault();
                }} onPaste={e => {
                  const text = e.clipboardData.getData('text');
                  const digits = text.replace(/[^0-9]/g, '');
                  if (digits !== text) {
                    e.preventDefault();
                    field.onChange(digits ? Math.max(1, Number(digits)) : undefined);
                  }
                }} value={field.value || ''} onChange={e => {
                  const value = parseInt(e.target.value);
                  if (isNaN(value) || value < 1) {
                    field.onChange(undefined);
                  } else {
                    field.onChange(value);
                  }
                }} />
                    </FormControl>
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500">
                      Sq.ft
                    </div>
                  </div>
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
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-white border shadow-lg z-50">
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
                      <SelectTrigger className="h-12">
                        <div className="flex items-center gap-2">
                          <Compass className="h-4 w-4 text-muted-foreground" />
                          <SelectValue placeholder="Select" />
                        </div>
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-white border shadow-lg z-50">
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

          {/* Floor and Total Floor - Conditional based on property type */}
          {(showFloorDropdown || showNumberOfFloors) && <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {showFloorDropdown && <FormField control={form.control} name="floorNo" render={({
            field
          }) => <FormItem>
                      <FormLabel className="text-sm font-medium">Floor</FormLabel>
                        <Select onValueChange={value => {
              if (value === 'ground') {
                field.onChange(0);
              } else if (value === 'basement') {
                field.onChange('basement');
              } else if (value === 'lower' || value === 'upper' || value === '99+') {
                field.onChange(value);
              } else {
                field.onChange(parseInt(value));
              }
            }} value={field.value === undefined ? undefined : field.value === 0 ? 'ground' : field.value === 'basement' ? 'basement' : field.value.toString()}>
                        <FormControl>
                          <SelectTrigger className="h-12">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-white border shadow-lg z-50">
                          <SelectItem value="lower">Lower Basement</SelectItem>
                          <SelectItem value="upper">Upper Basement</SelectItem>
                          <SelectItem value="ground">Ground Floor</SelectItem>
                          {[...Array(50)].map((_, i) => {
                  const floor = i + 1;
                  return <SelectItem key={floor} value={floor.toString()}>
                                {floor}
                              </SelectItem>;
                })}
                          <SelectItem value="99+">50+</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>} />}

              {showFloorDropdown ? <FormField control={form.control} name="totalFloors" render={({
            field
          }) => <FormItem>
                      <FormLabel className="text-sm font-medium">Total Floor</FormLabel>
                        <Select onValueChange={value => value === '99+' ? field.onChange(value) : field.onChange(parseInt(value))} defaultValue={field.value?.toString()}>
                        <FormControl>
                          <SelectTrigger className="h-12">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-white border shadow-lg z-50">
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
                          <SelectItem value="99+">50+</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>} /> : showNumberOfFloors ? <FormField control={form.control} name="totalFloors" render={({
            field
          }) => <FormItem>
                      <FormLabel className="text-sm font-medium">No. of Floors</FormLabel>
                        <Select onValueChange={value => field.onChange(parseInt(value))} defaultValue={field.value?.toString()}>
                        <FormControl>
                          <SelectTrigger className="h-12">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-white border shadow-lg z-50">
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
            </div>}
        </form>
      </Form>
    </div>
  );
};
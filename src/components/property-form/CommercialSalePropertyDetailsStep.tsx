import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Badge } from '@/components/ui/badge';
import { CommercialPropertyDetails } from '@/types/property';
const STORAGE_KEY = 'commercialSalePropertyDetails';
const commercialSalePropertyDetailsSchema = z.object({
  title: z.string().optional(),
  // Made optional - will be auto-generated
  propertyType: z.string().optional(),
  spaceType: z.enum(['office', 'retail', 'warehouse', 'showroom', 'restaurant', 'co-working', 'industrial']).optional(),
  buildingType: z.string().optional(),
  propertyAge: z.string().optional(),
  facing: z.string().optional(),
  floorNo: z.string().optional(),
  totalFloors: z.string().optional(),
  superBuiltUpArea: z.number().min(0, "Super built up area must be 0 or greater").optional().or(z.literal(0)),
  furnishingStatus: z.string().optional(),
  powerLoad: z.string().optional(),
  ceilingHeight: z.string().optional(),
  entranceWidth: z.string().optional()
});
type CommercialSalePropertyDetailsFormData = z.infer<typeof commercialSalePropertyDetailsSchema>;
interface CommercialSalePropertyDetailsStepProps {
  initialData?: Partial<CommercialPropertyDetails>;
  onNext: (data: Partial<CommercialPropertyDetails>) => void;
  onBack: () => void;
  currentStep: number;
  totalSteps: number;
}
export const CommercialSalePropertyDetailsStep = ({
  initialData,
  onNext,
  onBack,
  currentStep,
  totalSteps
}: CommercialSalePropertyDetailsStepProps) => {
  const [onMainRoad, setOnMainRoad] = useState(initialData?.onMainRoad || false);
  const [cornerProperty, setCornerProperty] = useState(initialData?.cornerProperty || false);
  const [loadingFacility, setLoadingFacility] = useState(initialData?.loadingFacility || false);
  const form = useForm<CommercialSalePropertyDetailsFormData>({
    resolver: zodResolver(commercialSalePropertyDetailsSchema),
    defaultValues: {
      title: initialData?.title || '',
      propertyType: initialData?.propertyType || 'Commercial',
      spaceType: initialData?.spaceType as any || 'office',
      buildingType: initialData?.buildingType || '',
      propertyAge: (initialData as any)?.propertyAge || '',
      facing: (initialData as any)?.facing || '',
      floorNo: initialData?.floorNo?.toString() || '0',
      totalFloors: initialData?.totalFloors?.toString() || '1',
      superBuiltUpArea: initialData?.superBuiltUpArea || undefined,
      furnishingStatus: (initialData as any)?.furnishingStatus || '',
      powerLoad: initialData?.powerLoad || '',
      ceilingHeight: initialData?.ceilingHeight || '',
      entranceWidth: initialData?.entranceWidth || ''
    }
  });

  // Persist furnishingStatus immediately when it changes to avoid losing state on navigation
  useEffect(() => {
    const subscription = form.watch((value, info) => {
      if (info?.name === 'furnishingStatus') {
        try {
          const savedRaw = typeof window !== 'undefined' ? sessionStorage.getItem(STORAGE_KEY) : null;
          const saved = savedRaw ? JSON.parse(savedRaw) : {};
          const next = { ...saved, furnishingStatus: (value as any)?.furnishingStatus ?? '' };
          if (typeof window !== 'undefined') {
            sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
          }
        } catch {}
      }
    });
    return () => subscription?.unsubscribe?.();
  }, [form]);

  // Use ref to track actual initialData changes
  const initialDataRef = React.useRef(initialData);
  
  useEffect(() => {
    const savedRaw = typeof window !== 'undefined' ? sessionStorage.getItem(STORAGE_KEY) : null;
    const saved = savedRaw ? JSON.parse(savedRaw) : null;

    // Deep-compare to avoid resetting while typing when parent passes new object refs
    const prev = initialDataRef.current;
    const hasMeaningfulData = !!initialData && Object.keys(initialData).length > 0 && Object.values(initialData).some((v) => v !== undefined && v !== null && v !== '');
    const changed = JSON.stringify(initialData ?? {}) !== JSON.stringify(prev ?? {});
    
    if (hasMeaningfulData && changed) {
      initialDataRef.current = initialData;
      
      // Merge saved data with initialData, but only overwrite with initialData if values are actually present
      let src: any = saved || {};
      if (initialData) {
        Object.keys(initialData).forEach((key) => {
          const value = (initialData as any)[key];
          if (value !== undefined && value !== null && value !== '') {
            src[key] = value;
          }
        });
      }

      form.reset({
        title: src.title || '',
        propertyType: src.propertyType || 'Commercial',
        spaceType: (src.spaceType as any) || 'office',
        buildingType: src.buildingType || '',
        propertyAge: (src as any)?.propertyAge || '',
        facing: (src as any)?.facing || '',
        floorNo: src.floorNo !== undefined ? String(src.floorNo) : '0',
        totalFloors: src.totalFloors !== undefined ? String(src.totalFloors) : '1',
        superBuiltUpArea: src.superBuiltUpArea || undefined,
        furnishingStatus: src.furnishingStatus || '',
        powerLoad: src.powerLoad || '',
        ceilingHeight: src.ceilingHeight || '',
        entranceWidth: src.entranceWidth || ''
      });
      setOnMainRoad(Boolean(src.onMainRoad));
      setCornerProperty(Boolean(src.cornerProperty));
      setLoadingFacility(Boolean(src.loadingFacility));
    }
  }, [initialData, form]);

  const onSubmit = (data: CommercialSalePropertyDetailsFormData) => {
    console.log('Form submission data:', data);
    const completeData: Partial<CommercialPropertyDetails> = {
      ...initialData,
      ...data,
      floorNo: parseInt(data.floorNo),
      totalFloors: parseInt(data.totalFloors),
      superBuiltUpArea: data.superBuiltUpArea,
      // Map superBuiltUpArea to builtUpArea for compatibility with PropertyDraftService
      builtUpArea: data.superBuiltUpArea,
      onMainRoad,
      cornerProperty,
      loadingFacility
    };
    try {
      if (typeof window !== 'undefined') {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(completeData));
      }
    } catch {}
    console.log('Complete data to submit:', completeData);
    onNext(completeData);
  };
  const onError = (errors: any) => {
    console.log('Form validation errors:', errors);
  };
  return <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
      <div className="text-left mb-8">
        <h1 className="text-2xl font-semibold text-[#ef4444] mb-2 pt-6 sm:pt-6">Commercial Property Details</h1>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit, onError)} className="space-y-4">
          {/* Property Name and Space Type */}
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

            <FormField control={form.control} name="spaceType" render={({
            field
          }) => <FormItem>
                  <FormLabel className="text-sm font-medium">Space Type</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-white border shadow-lg z-50">
                      <SelectItem value="office">Office</SelectItem>
                      <SelectItem value="retail">Retail</SelectItem>
                      <SelectItem value="warehouse">Warehouse</SelectItem>
                      <SelectItem value="showroom">Showroom</SelectItem>
                      <SelectItem value="restaurant">Restaurant</SelectItem>
                      <SelectItem value="co-working">Co-working</SelectItem>
                      <SelectItem value="industrial">Industrial</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>} />
          </div>

          {/* Building Type and Floor Number */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField control={form.control} name="buildingType" render={({
            field
          }) => <FormItem>
                  <FormLabel className="text-sm font-medium">Building Type</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-white border shadow-lg z-50">
                      <SelectItem value="standalone">Standalone Building</SelectItem>
                      <SelectItem value="mall">Shopping Mall</SelectItem>
                      <SelectItem value="complex">Commercial Complex</SelectItem>
                      <SelectItem value="tower">Office Tower</SelectItem>
                      <SelectItem value="plaza">Plaza</SelectItem>
                      <SelectItem value="market">Market</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>} />

            <FormField control={form.control} name="floorNo" render={({
            field
          }) => <FormItem>
                  <FormLabel className="text-sm font-medium">Floor</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-white border shadow-lg z-50">
                      <SelectItem value="lower">Lower Basement</SelectItem>
                      <SelectItem value="upper">Upper Basement</SelectItem>
                      <SelectItem value="0">Ground Floor</SelectItem>
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
                </FormItem>} />
          </div>

          {/* Total Floors */}
          <FormField control={form.control} name="totalFloors" render={({
          field
        }) => <FormItem className="w-1/2">
                <FormLabel className="text-sm font-medium">Total Floor</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-white border shadow-lg z-50">
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
                </FormItem>} />

          {/* Super Built-up Area and Furnishing Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField control={form.control} name="superBuiltUpArea" render={({
            field
          }) => <FormItem>
                  <FormLabel className="text-sm font-medium">Super Built-up Area</FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input type="number" placeholder="Super Built-up Area" min="1" className="h-12 pr-12 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]" {...field} onKeyDown={e => {
                  if (['-', '+', 'e', 'E', '.'].includes(e.key)) e.preventDefault();
                }} onPaste={e => {
                  const text = e.clipboardData.getData('text');
                  const digits = text.replace(/[^0-9]/g, '');
                  if (digits !== text) {
                    e.preventDefault();
                    const numValue = parseInt(digits);
                    field.onChange(digits ? Math.max(1, numValue) : undefined);
                  }
                }} value={field.value || ''} onChange={e => {
                  const value = e.target.value;
                  if (value === '') {
                    field.onChange(undefined);
                  } else {
                    const numValue = parseInt(value);
                    if (!isNaN(numValue) && numValue > 0) {
                      field.onChange(numValue);
                    }
                  }
                }} />
                    </FormControl>
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500">
                      Sq.ft
                    </div>
                  </div>
                </FormItem>} />

            <FormField control={form.control} name="furnishingStatus" render={({
            field
          }) => <FormItem>
                  <FormLabel className="text-sm font-medium">Furnishing Status</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-white border shadow-lg z-50">
                      <SelectItem value="unfurnished">Unfurnished</SelectItem>
                      <SelectItem value="semi-furnished">Semi Furnished</SelectItem>
                      <SelectItem value="furnished">Furnished</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>} />
          </div>

          {/* Navigation Buttons - Removed Next Step button, using sticky buttons instead */}
        </form>
      </Form>
    </div>;
};

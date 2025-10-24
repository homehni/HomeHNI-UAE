import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Compass } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { CommercialPropertyDetails } from '@/types/property';

const commercialPropertyDetailsSchema = z.object({
  propertyType: z.string().optional(),
  spaceType: z.string().optional(),
  buildingType: z.string().optional(),
  propertyAge: z.string().optional(),
  facing: z.string().optional(),
  totalFloors: z.union([z.number(), z.string()]).optional(),
  floorNo: z.union([z.number(), z.string()]).optional(),
  furnishingStatus: z.string().optional(),
  superBuiltUpArea: z.number().min(0, "Super built up area must be 0 or greater").optional().or(z.literal(0)),
  powerLoad: z.string().optional(),
  ceilingHeight: z.string().optional(),
  entranceWidth: z.string().optional(),
  loadingFacility: z.boolean().optional(),
  onMainRoad: z.boolean().optional(),
  cornerProperty: z.boolean().optional(),
});

type CommercialPropertyDetailsFormData = z.infer<typeof commercialPropertyDetailsSchema>;

interface CommercialPropertyDetailsStepProps {
  initialData?: Partial<CommercialPropertyDetails>;
  onNext: (data: CommercialPropertyDetails) => void;
  onBack: () => void;
  currentStep: number;
  totalSteps: number;
}

export const CommercialPropertyDetailsStep: React.FC<CommercialPropertyDetailsStepProps> = ({
  initialData = {},
  onNext,
  onBack,
  currentStep,
  totalSteps
}) => {
  const form = useForm<CommercialPropertyDetailsFormData>({
    resolver: zodResolver(commercialPropertyDetailsSchema),
    defaultValues: {
      propertyType: initialData.propertyType || 'Commercial',
      spaceType: initialData.spaceType || '',
      buildingType: initialData.buildingType || '',
      propertyAge: initialData.propertyAge || '',
      facing: (initialData as any).facing || '',
      totalFloors: initialData.totalFloors || 1,
      floorNo: initialData.floorNo || 0,
      superBuiltUpArea: initialData.superBuiltUpArea || undefined,
      powerLoad: initialData.powerLoad || '',
      ceilingHeight: initialData.ceilingHeight || '',
      entranceWidth: initialData.entranceWidth || '',
      loadingFacility: initialData.loadingFacility || false,
      onMainRoad: initialData.onMainRoad || false,
      cornerProperty: initialData.cornerProperty || false,
    },
  });

  const [onMainRoad, setOnMainRoad] = useState(form.watch('onMainRoad'));
  const [cornerProperty, setCornerProperty] = useState(form.watch('cornerProperty'));
  const [loadingFacility, setLoadingFacility] = useState(form.watch('loadingFacility'));

  // Reset form when initialData changes (for draft loading)
  React.useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      console.log('CommercialPropertyDetailsStep: Resetting form with initialData:', initialData);
      form.reset({
        propertyType: initialData.propertyType || 'Commercial',
        spaceType: initialData.spaceType || '',
        buildingType: initialData.buildingType || '',
        propertyAge: initialData.propertyAge || '',
        facing: (initialData as any).facing || '',
        totalFloors: initialData.totalFloors || 1,
        floorNo: initialData.floorNo || 0,
        superBuiltUpArea: initialData.superBuiltUpArea || undefined,
        powerLoad: initialData.powerLoad || '',
        ceilingHeight: initialData.ceilingHeight || '',
        entranceWidth: initialData.entranceWidth || '',
        loadingFacility: initialData.loadingFacility || false,
        onMainRoad: initialData.onMainRoad || false,
        cornerProperty: initialData.cornerProperty || false,
      });
      
      // Update state variables
      setOnMainRoad(initialData.onMainRoad || false);
      setCornerProperty(initialData.cornerProperty || false);
      setLoadingFacility(initialData.loadingFacility || false);
    }
  }, [initialData, form]);

  const onSubmit = (data: CommercialPropertyDetailsFormData) => {
    console.log('=== PROPERTY DETAILS STEP SUBMIT ===');
    console.log('Form data:', data);
    console.log('onMainRoad:', onMainRoad);
    console.log('cornerProperty:', cornerProperty);
    console.log('loadingFacility:', loadingFacility);
    
    onNext({
      ...initialData,
      ...data,
      // Map superBuiltUpArea to builtUpArea for compatibility with PropertyDraftService
      builtUpArea: data.superBuiltUpArea,
      onMainRoad,
      cornerProperty,
      loadingFacility,
    } as CommercialPropertyDetails);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
      <h1 className="text-2xl font-semibold text-primary mb-6 pt-4 md:pt-0">Commercial Property Details</h1>
      
      <Form {...form}>
        <form onSubmit={(e) => {
          console.log('=== PROPERTY DETAILS FORM SUBMIT EVENT ===');
          console.log('Form submit event triggered');
          console.log('Form errors:', form.formState.errors);
          console.log('Form is valid:', form.formState.isValid);
          form.handleSubmit(onSubmit)(e);
        }} className="space-y-6">
          {/* Space Type and Building Type */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="spaceType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">Space Type</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Select Space Type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="office">Office Space</SelectItem>
                      <SelectItem value="retail">Retail Shop</SelectItem>
                      <SelectItem value="co-living">Co-Living</SelectItem>
                      <SelectItem value="warehouse">Warehouse</SelectItem>
                      <SelectItem value="showroom">Showroom</SelectItem>
                      <SelectItem value="restaurant">Restaurant/Cafe</SelectItem>
                      <SelectItem value="co-working">Co-Working Space</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="buildingType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">Building Type</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Select Building Type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Business Park">Business Park</SelectItem>
                      <SelectItem value="Mall">Mall</SelectItem>
                      <SelectItem value="Standalone Building">Standalone Building</SelectItem>
                      <SelectItem value="Independent Shop">Independent Shop</SelectItem>
                      <SelectItem value="IT Park">IT Park</SelectItem>
                      <SelectItem value="Industrial Complex">Industrial Complex</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Age, Facing */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="propertyAge"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">Age of Property</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Select Age" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Less than a Year">Less than a Year</SelectItem>
                      <SelectItem value="1-2 Years">1-2 Years</SelectItem>
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
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="h-12">
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

          {/* Floor, Total Floor */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="floorNo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">Floor</FormLabel>
                  <Select
                    onValueChange={(value) =>
                      value === 'full' || value === 'lower' || value === 'upper' || value === '99+'
                        ? field.onChange(value)
                        : field.onChange(parseInt(value))
                    }
                    value={field.value?.toString()}
                  >
                    <FormControl>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Select Floor" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="lower">Lower Basement</SelectItem>
                      <SelectItem value="upper">Upper Basement</SelectItem>
                      <SelectItem value="0">Ground Floor</SelectItem>
                      <SelectItem value="full">Full Building</SelectItem>
                      {[...Array(99)].map((_, i) => {
                        const floor = i + 1;
                        return (
                          <SelectItem key={floor} value={floor.toString()}>
                            {floor}
                          </SelectItem>
                        );
                      })}
                      <SelectItem value="99+">99+</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="totalFloors"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">Total Floors</FormLabel>
                  <Select
                    onValueChange={(value) =>
                      value === '99+' ? field.onChange(value) : field.onChange(parseInt(value))
                    }
                    value={field.value?.toString()}
                  >
                    <FormControl>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Select Total Floors" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="0">Ground</SelectItem>
                      {[...Array(99)].map((_, i) => {
                        const floor = i + 1;
                        return (
                          <SelectItem key={floor} value={floor.toString()}>
                            {floor}
                          </SelectItem>
                        );
                      })}
                      <SelectItem value="99+">99+</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Area and Furnishing */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="superBuiltUpArea"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">Super Built Up Area</FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter your Super Built up Area"
                        min="1"
                        className="h-12 pr-12 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]"
                        {...field}
                        onKeyDown={(e) => { if (['-','+','e','E','.'].includes(e.key)) e.preventDefault(); }}
                        onPaste={(e) => { const text = e.clipboardData.getData('text'); const digits = text.replace(/[^0-9]/g, ''); if (digits !== text) { e.preventDefault(); field.onChange(digits ? Math.max(1, Number(digits)) : undefined); } }}
                        value={field.value || ''}
                        onChange={(e) => field.onChange(e.target.value ? Math.max(1, parseInt(e.target.value)) : undefined)}
                      />
                    </FormControl>
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500">
                      Sq.ft
                    </div>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="furnishingStatus"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">Furnishing</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Select Furnishing" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Fully Furnished">Fully Furnished</SelectItem>
                      <SelectItem value="Semi Furnished">Semi Furnished</SelectItem>
                      <SelectItem value="Unfurnished">Unfurnished</SelectItem>
                      <SelectItem value="Bare Shell">Bare Shell</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          

          {/* Other Features */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Other Features</h3>
            <div className="flex gap-4 flex-wrap">
              <Badge
                variant={onMainRoad ? "default" : "outline"}
                className="cursor-pointer px-4 py-2 text-sm"
                onClick={() => setOnMainRoad(!onMainRoad)}
              >
                On Main Road
              </Badge>
              <Badge
                variant={cornerProperty ? "default" : "outline"}
                className="cursor-pointer px-4 py-2 text-sm"
                onClick={() => setCornerProperty(!cornerProperty)}
              >
                Corner Property
              </Badge>
              
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-6" style={{ visibility: 'hidden' }}>
            <Button 
              type="button" 
              variant="outline" 
              onClick={onBack}
              disabled={true}
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
  );
};

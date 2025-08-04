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
import { Home, MapPin, Building, Sparkles, Camera, FileText, Calendar, Phone } from 'lucide-react';

const propertyDetailsSchema = z.object({
  propertyType: z.string().min(1, 'Please select property type'),
  buildingType: z.string().min(1, 'Please select building type'),
  propertyAge: z.string().min(1, 'Please select property age'),
  totalFloors: z.union([z.number().min(1, 'Total floors must be at least 1'), z.string().min(1, 'Please select total floors')]),
  floorNo: z.union([z.number().min(0, 'Floor number cannot be negative'), z.string().min(1, 'Please select floor')]),
  furnishingStatus: z.string().min(1, 'Please select furnishing status'),
  parkingType: z.string().optional(),
  superBuiltUpArea: z.number().min(1, 'Super built up area is required'),
  onMainRoad: z.boolean().optional(),
  cornerProperty: z.boolean().optional(),
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
  const form = useForm<PropertyDetailsFormData>({
    resolver: zodResolver(propertyDetailsSchema),
    defaultValues: {
      propertyType: initialData.propertyType || '',
      buildingType: initialData.buildingType || '',
      propertyAge: initialData.propertyAge || '',
      totalFloors: initialData.totalFloors || 1,
      floorNo: initialData.floorNo || 0,
      furnishingStatus: initialData.furnishingStatus || '',
      parkingType: initialData.parkingType || '',
      superBuiltUpArea: initialData.superBuiltUpArea || 0,
      onMainRoad: initialData.onMainRoad || false,
      cornerProperty: initialData.cornerProperty || false,
    },
  });

  const [onMainRoad, setOnMainRoad] = useState(form.watch('onMainRoad'));
  const [cornerProperty, setCornerProperty] = useState(form.watch('cornerProperty'));

  const onSubmit = (data: PropertyDetailsFormData) => {
    // Pass the form data merged with initial data and toggle states to maintain all PropertyDetails fields
    onNext({
      ...initialData, // Keep existing fields like title, bhkType, etc.
      ...data,
      onMainRoad,
      cornerProperty,
    } as PropertyDetails);
  };

  const steps = [
    { icon: Home, label: 'Property Details', active: currentStep === 2 },
    { icon: MapPin, label: 'Location Details', active: currentStep === 3 },
    { icon: Building, label: 'Rental Details', active: currentStep === 4 },
    { icon: Sparkles, label: 'Amenities', active: currentStep === 5 },
    { icon: Camera, label: 'Gallery', active: currentStep === 6 },
    { icon: FileText, label: 'Additional Information', active: currentStep === 7 },
    { icon: Calendar, label: 'Schedule', active: currentStep === 8 },
  ];

  const progressPercentage = Math.round((currentStep / totalSteps) * 100);

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
        <div className="w-52 bg-white border-r border-gray-200 min-h-screen">
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
        <div className="flex-1 px-4 py-3">
          <div className="w-full">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 px-4 py-4">
              <h1 className="text-2xl font-semibold text-primary mb-6">Property Details</h1>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  {/* Property Type and Building Type */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <FormField
                      control={form.control}
                      name="propertyType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">Property Type*</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="h-12">
                                <SelectValue placeholder="Co-Working" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Co-Working">Co-Working</SelectItem>
                              <SelectItem value="Office">Office Space</SelectItem>
                              <SelectItem value="Shop">Shop</SelectItem>
                              <SelectItem value="Showroom">Showroom</SelectItem>
                              <SelectItem value="Godown">Godown/Warehouse</SelectItem>
                              <SelectItem value="Industrial-Shed">Industrial Shed</SelectItem>
                              <SelectItem value="Industrial-Building">Industrial Building</SelectItem>
                              <SelectItem value="Restaurant-Cafe">Restaurant/Cafe</SelectItem>
                              <SelectItem value="Other-Business">Other Business</SelectItem>
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
                          <FormLabel className="text-sm font-medium">Building Type*</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="h-12">
                                <SelectValue placeholder="Mall" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                               <SelectItem value="Independent House">Independent House</SelectItem>
                              <SelectItem value="Business Park">Business Park</SelectItem>
                              <SelectItem value="Mall">Mall</SelectItem>                              
                              <SelectItem value="Standalone Building">Standalone Building</SelectItem>                              
                              <SelectItem value="Independent Shop">Independent Shop</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Age of Property, Floor, Total Floor */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <FormField
                      control={form.control}
                      name="propertyAge"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">Age of Property*</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="h-12">
                                <SelectValue placeholder="Less than a Year" />
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
  name="floorNo"
  render={({ field }) => (
    <FormItem>
      <FormLabel className="text-sm font-medium">Floor*</FormLabel>
      <Select
        onValueChange={(value) =>
          value === 'full' || value === 'lower' || value === 'upper' || value === '99+'
            ? field.onChange(value)
            : field.onChange(parseInt(value))
        }
        defaultValue={field.value?.toString()}
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
      <FormLabel className="text-sm font-medium">Total Floors*</FormLabel>
      <Select
        onValueChange={(value) =>
          value === '99+' ? field.onChange(value) : field.onChange(parseInt(value))
        }
        defaultValue={field.value?.toString()}
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

                  {/* Super Built Up Area and Furnishing */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <FormField
                      control={form.control}
                      name="superBuiltUpArea"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">Super Built Up Area*</FormLabel>
                          <div className="relative">
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="1500"
                                className="h-12 pr-12 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]"
                                {...field}
                                onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                              />

                            </FormControl>
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500">
                              Sq.ft
                            </div>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="furnishingStatus"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">Furnishing*</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="h-12">
                                <SelectValue placeholder="Semi Furnished" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Fully Furnished">Fully Furnished</SelectItem>
                              <SelectItem value="Semi Furnished">Semi Furnished</SelectItem>
                              <SelectItem value="Unfurnished">Unfurnished</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* <FormField
                      control={form.control}
                      name="parkingType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">Parking*</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="h-12">
                                <SelectValue placeholder="Select Parking Type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="1 Covered">1 Covered</SelectItem>
                              <SelectItem value="2 Covered">2 Covered</SelectItem>
                              <SelectItem value="1 Open">1 Open</SelectItem>
                              <SelectItem value="2 Open">2 Open</SelectItem>
                              <SelectItem value="No Parking">No Parking</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    /> */}
                  </div>

                  {/* Other Features */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Other Features</h3>
                    <div className="flex gap-4">
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

                  {/* Save & Continue Button */}
                  <div className="flex justify-center pt-6">
                    <Button type="submit" className="px-8 py-3 bg-red-500 hover:bg-red-600 text-white font-medium">
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
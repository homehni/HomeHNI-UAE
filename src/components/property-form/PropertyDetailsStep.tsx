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
  title: z.string().min(10, 'Title must be at least 10 characters'),
  propertyType: z.string().min(1, 'Please select property type'),
  buildingType: z.string().min(1, 'Please select building type'),
  bhkType: z.string().min(1, 'Please select BHK type'),
  bathrooms: z.number().min(1, 'At least 1 bathroom required'),
  balconies: z.number().min(0, 'Balconies cannot be negative'),
  propertyAge: z.string().min(1, 'Please select property age'),
  totalFloors: z.number().min(1, 'Total floors must be at least 1'),
  floorNo: z.number().min(0, 'Floor number cannot be negative'),
  furnishingStatus: z.string().min(1, 'Please select furnishing status'),
  parkingType: z.string().min(1, 'Please select parking type'),
  superBuiltUpArea: z.number().min(1, 'Super built up area is required'),
  onMainRoad: z.boolean(),
  cornerProperty: z.boolean(),
});

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
  const form = useForm<PropertyDetails>({
    resolver: zodResolver(propertyDetailsSchema),
    defaultValues: {
      title: initialData.title || '',
      propertyType: initialData.propertyType || '',
      buildingType: initialData.buildingType || '',
      bhkType: initialData.bhkType || '',
      bathrooms: initialData.bathrooms || 1,
      balconies: initialData.balconies || 0,
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

  const onSubmit = (data: PropertyDetails) => {
    onNext({
      ...data,
      onMainRoad,
      cornerProperty,
    });
  };

  const steps = [
    { icon: Home, label: 'Property Details', active: currentStep === 1 },
    { icon: MapPin, label: 'Location Details', active: currentStep === 2 },
    { icon: Building, label: 'Rental Details', active: currentStep === 3 },
    { icon: Sparkles, label: 'Amenities', active: currentStep === 4 },
    { icon: Camera, label: 'Gallery', active: currentStep === 5 },
    { icon: FileText, label: 'Additional Information', active: currentStep === 6 },
    { icon: Calendar, label: 'Schedule', active: currentStep === 7 },
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
              <h1 className="text-2xl font-semibold text-primary mb-6">Property Details</h1>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  {/* Property Type and Building Type */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                              <SelectItem value="Office">Office</SelectItem>
                              <SelectItem value="Shop">Shop</SelectItem>
                              <SelectItem value="Warehouse">Warehouse</SelectItem>
                              <SelectItem value="Showroom">Showroom</SelectItem>
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
                              <SelectItem value="Mall">Mall</SelectItem>
                              <SelectItem value="IT Park">IT Park</SelectItem>
                              <SelectItem value="Commercial Complex">Commercial Complex</SelectItem>
                              <SelectItem value="Independent Building">Independent Building</SelectItem>
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
                          <Select onValueChange={(value) => field.onChange(parseInt(value))} defaultValue={field.value?.toString()}>
                            <FormControl>
                              <SelectTrigger className="h-12">
                                <SelectValue placeholder="2" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="0">Ground Floor</SelectItem>
                              <SelectItem value="1">1st Floor</SelectItem>
                              <SelectItem value="2">2nd Floor</SelectItem>
                              <SelectItem value="3">3rd Floor</SelectItem>
                              <SelectItem value="4">4th Floor</SelectItem>
                              <SelectItem value="5">5th Floor</SelectItem>
                              <SelectItem value="6">6th Floor</SelectItem>
                              <SelectItem value="7">7th Floor</SelectItem>
                              <SelectItem value="8">8th Floor</SelectItem>
                              <SelectItem value="9">9th Floor</SelectItem>
                              <SelectItem value="10">10+ Floor</SelectItem>
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
                          <FormLabel className="text-sm font-medium">Total Floor*</FormLabel>
                          <Select onValueChange={(value) => field.onChange(parseInt(value))} defaultValue={field.value?.toString()}>
                            <FormControl>
                              <SelectTrigger className="h-12">
                                <SelectValue placeholder="5" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="1">1</SelectItem>
                              <SelectItem value="2">2</SelectItem>
                              <SelectItem value="3">3</SelectItem>
                              <SelectItem value="4">4</SelectItem>
                              <SelectItem value="5">5</SelectItem>
                              <SelectItem value="6">6</SelectItem>
                              <SelectItem value="7">7</SelectItem>
                              <SelectItem value="8">8</SelectItem>
                              <SelectItem value="9">9</SelectItem>
                              <SelectItem value="10">10</SelectItem>
                              <SelectItem value="15">15</SelectItem>
                              <SelectItem value="20">20+</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Super Built Up Area and Furnishing */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                                className="h-12 pr-12"
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
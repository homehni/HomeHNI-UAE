import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { 
  Bath, Wind, Building2, UtensilsCrossed, Cigarette, Wine, 
  Dumbbell, Shield, Wifi, Zap, Building, Car, Droplets, ShieldCheck
} from 'lucide-react';

const amenitiesSchema = z.object({
  // Room Details
  attachedBathroom: z.boolean().optional(),
  acRoom: z.boolean().optional(),
  balcony: z.boolean().optional(),
  
  // Flatmate Preference
  nonVegAllowed: z.boolean().optional(),
  smokingAllowed: z.boolean().optional(),
  drinkingAllowed: z.boolean().optional(),
  
  // Additional Details
  gym: z.boolean().optional(),
  gatedSecurity: z.boolean().optional(),
  
  // Other fields
  whoWillShow: z.string().optional(),
  currentPropertyCondition: z.string().optional(),
  secondaryNumber: z.string().optional(),
  moreSimilarUnits: z.boolean().optional(),
  directionsTip: z.string().optional(),
  
  // Amenities - using strings for consistency
  lift: z.string().optional(),
  powerBackup: z.string().optional(),
  waterStorageFacility: z.string().optional(),
  security: z.string().optional(),
  wifi: z.string().optional(),
});

type FlattmatesAmenitiesFormData = z.infer<typeof amenitiesSchema>;

interface FlattmatesAmenities {
  // Room Details
  attachedBathroom?: boolean;
  acRoom?: boolean;
  balcony?: boolean;
  
  // Flatmate Preference
  nonVegAllowed?: boolean;
  smokingAllowed?: boolean;
  drinkingAllowed?: boolean;
  
  // Additional Details
  gym?: boolean;
  gatedSecurity?: boolean;
  
  // Other fields
  whoWillShow?: string;
  currentPropertyCondition?: string;
  secondaryNumber?: string;
  moreSimilarUnits?: boolean;
  directionsTip?: string;
  lift?: string;
  powerBackup?: string;
  waterStorageFacility?: string;
  security?: string;
  wifi?: string;
}

interface FlattmatesAmenitiesStepProps {
  initialData?: Partial<FlattmatesAmenities>;
  onNext: (data: FlattmatesAmenities) => void;
  onBack: () => void;
  formId?: string;
}

export const FlattmatesAmenitiesStep: React.FC<FlattmatesAmenitiesStepProps> = ({
  initialData = {},
  onNext,
  onBack,
  formId
}) => {
  const form = useForm<FlattmatesAmenitiesFormData>({
    resolver: zodResolver(amenitiesSchema),
    defaultValues: {
      // Room Details
      attachedBathroom: initialData.attachedBathroom || false,
      acRoom: initialData.acRoom || false,
      balcony: initialData.balcony || false,
      
      // Flatmate Preference
      nonVegAllowed: initialData.nonVegAllowed || false,
      smokingAllowed: initialData.smokingAllowed || false,
      drinkingAllowed: initialData.drinkingAllowed || false,
      
      // Additional Details
      gym: initialData.gym || false,
      gatedSecurity: initialData.gatedSecurity || false,
      
      // Other fields
      whoWillShow: initialData.whoWillShow || '',
      currentPropertyCondition: initialData.currentPropertyCondition || '',
      secondaryNumber: initialData.secondaryNumber || '',
      moreSimilarUnits: initialData.moreSimilarUnits || false,
      directionsTip: initialData.directionsTip || '',
      lift: initialData.lift || 'Not Available',
      powerBackup: initialData.powerBackup || 'Not Available',
      waterStorageFacility: initialData.waterStorageFacility || 'Not Available',
      security: initialData.security || 'Not Available',
      wifi: initialData.wifi || 'Not Available',
    },
  });

  const onSubmit = (data: FlattmatesAmenitiesFormData) => {
    console.log('FlattmatesAmenitiesStep submitting data:', data);
    onNext(data);
  };

  return (
    <div className="bg-background p-6">
      <div className="text-left mb-8">
        <h2 className="text-2xl font-bold text-primary mb-2">Provide additional details about your property to get maximum visibility</h2>
      </div>

      <Form {...form}>
        <form id={formId || 'flatmates-step-form'} onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          
          {/* Room Details Section */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-red-600 mb-4">Room Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Attached Bathroom */}
              <FormField
                control={form.control}
                name="attachedBathroom"
                render={({ field }) => (
                  <FormItem className="border rounded-lg p-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <Bath className="w-5 h-5 text-muted-foreground" />
                      <FormLabel className="text-sm font-medium">Attached Bathroom</FormLabel>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        type="button"
                        variant={field.value === false ? "default" : "outline"}
                        size="sm"
                        onClick={() => field.onChange(false)}
                        className="flex-1"
                      >
                        No
                      </Button>
                      <Button
                        type="button"
                        variant={field.value === true ? "default" : "outline"}
                        size="sm"
                        onClick={() => field.onChange(true)}
                        className="flex-1"
                      >
                        Yes
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* AC Room */}
              <FormField
                control={form.control}
                name="acRoom"
                render={({ field }) => (
                  <FormItem className="border rounded-lg p-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <Wind className="w-5 h-5 text-muted-foreground" />
                      <FormLabel className="text-sm font-medium">AC Room</FormLabel>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        type="button"
                        variant={field.value === false ? "default" : "outline"}
                        size="sm"
                        onClick={() => field.onChange(false)}
                        className="flex-1"
                      >
                        No
                      </Button>
                      <Button
                        type="button"
                        variant={field.value === true ? "default" : "outline"}
                        size="sm"
                        onClick={() => field.onChange(true)}
                        className="flex-1"
                      >
                        Yes
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Balcony */}
              <FormField
                control={form.control}
                name="balcony"
                render={({ field }) => (
                  <FormItem className="border rounded-lg p-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <Building2 className="w-5 h-5 text-muted-foreground" />
                      <FormLabel className="text-sm font-medium">Balcony</FormLabel>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        type="button"
                        variant={field.value === false ? "default" : "outline"}
                        size="sm"
                        onClick={() => field.onChange(false)}
                        className="flex-1"
                      >
                        No
                      </Button>
                      <Button
                        type="button"
                        variant={field.value === true ? "default" : "outline"}
                        size="sm"
                        onClick={() => field.onChange(true)}
                        className="flex-1"
                      >
                        Yes
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Flatmate Preference Section */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-red-600 mb-4">Flatmate Preference</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Non-Veg Allowed */}
              <FormField
                control={form.control}
                name="nonVegAllowed"
                render={({ field }) => (
                  <FormItem className="border rounded-lg p-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <UtensilsCrossed className="w-5 h-5 text-muted-foreground" />
                      <FormLabel className="text-sm font-medium">Non-Veg Allowed</FormLabel>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        type="button"
                        variant={field.value === false ? "default" : "outline"}
                        size="sm"
                        onClick={() => field.onChange(false)}
                        className="flex-1"
                      >
                        No
                      </Button>
                      <Button
                        type="button"
                        variant={field.value === true ? "default" : "outline"}
                        size="sm"
                        onClick={() => field.onChange(true)}
                        className="flex-1"
                      >
                        Yes
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Smoking Allowed */}
              <FormField
                control={form.control}
                name="smokingAllowed"
                render={({ field }) => (
                  <FormItem className="border rounded-lg p-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <Cigarette className="w-5 h-5 text-muted-foreground" />
                      <FormLabel className="text-sm font-medium">Smoking Allowed</FormLabel>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        type="button"
                        variant={field.value === false ? "default" : "outline"}
                        size="sm"
                        onClick={() => field.onChange(false)}
                        className="flex-1"
                      >
                        No
                      </Button>
                      <Button
                        type="button"
                        variant={field.value === true ? "default" : "outline"}
                        size="sm"
                        onClick={() => field.onChange(true)}
                        className="flex-1"
                      >
                        Yes
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Drinking Allowed */}
              <FormField
                control={form.control}
                name="drinkingAllowed"
                render={({ field }) => (
                  <FormItem className="border rounded-lg p-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <Wine className="w-5 h-5 text-muted-foreground" />
                      <FormLabel className="text-sm font-medium">Drinking Allowed</FormLabel>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        type="button"
                        variant={field.value === false ? "default" : "outline"}
                        size="sm"
                        onClick={() => field.onChange(false)}
                        className="flex-1"
                      >
                        No
                      </Button>
                      <Button
                        type="button"
                        variant={field.value === true ? "default" : "outline"}
                        size="sm"
                        onClick={() => field.onChange(true)}
                        className="flex-1"
                      >
                        Yes
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Additional Details Section */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-red-600 mb-4">Additional Details for maximum visibility</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Gym */}
              <FormField
                control={form.control}
                name="gym"
                render={({ field }) => (
                  <FormItem className="border rounded-lg p-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <Dumbbell className="w-5 h-5 text-muted-foreground" />
                      <FormLabel className="text-sm font-medium">Gym</FormLabel>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        type="button"
                        variant={field.value === false ? "default" : "outline"}
                        size="sm"
                        onClick={() => field.onChange(false)}
                        className="flex-1"
                      >
                        No
                      </Button>
                      <Button
                        type="button"
                        variant={field.value === true ? "default" : "outline"}
                        size="sm"
                        onClick={() => field.onChange(true)}
                        className="flex-1"
                      >
                        Yes
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Gated Security */}
              <FormField
                control={form.control}
                name="gatedSecurity"
                render={({ field }) => (
                  <FormItem className="border rounded-lg p-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <Shield className="w-5 h-5 text-muted-foreground" />
                      <FormLabel className="text-sm font-medium">Gated Security</FormLabel>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        type="button"
                        variant={field.value === false ? "default" : "outline"}
                        size="sm"
                        onClick={() => field.onChange(false)}
                        className="flex-1"
                      >
                        No
                      </Button>
                      <Button
                        type="button"
                        variant={field.value === true ? "default" : "outline"}
                        size="sm"
                        onClick={() => field.onChange(true)}
                        className="flex-1"
                      >
                        Yes
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Who will show property and Property condition */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Who will show the property */}
            <FormField
              control={form.control}
              name="whoWillShow"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Who will show the property?</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-background border shadow-lg z-50">
                      <SelectItem value="need-help">Need help</SelectItem>
                      <SelectItem value="i-will-show">I will show</SelectItem>
                      <SelectItem value="neighbours">Neighbours</SelectItem>
                      <SelectItem value="friends-relatives">Friends/Relatives</SelectItem>
                      <SelectItem value="security">Security</SelectItem>
                      <SelectItem value="tenants">Tenants</SelectItem>
                      <SelectItem value="others">Others</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Current Property Condition */}
            <FormField
              control={form.control}
              name="currentPropertyCondition"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Property Condition?</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
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
          </div>

          {/* Secondary Number */}
          <FormField
            control={form.control}
            name="secondaryNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Secondary Number</FormLabel>
                <div className="flex">
                  <div className="flex items-center px-3 border border-r-0 rounded-l-md bg-muted">
                    <img src="https://flagcdn.w16/in.png" alt="India" className="w-4 h-3 mr-2" />
                    <span className="text-sm">+91</span>
                  </div>
                  <FormControl>
                    <Input
                      placeholder="Secondary Number"
                      {...field}
                      className="rounded-l-none"
                    />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* More similar units */}
          <FormField
            control={form.control}
            name="moreSimilarUnits"
            render={({ field }) => (
              <FormItem>
                <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-4">
                  <FormLabel>Do you have more similar <strong>units/properties</strong> available ?</FormLabel>
                   <div className="flex space-x-2 justify-center sm:justify-start">
                     <Button
                       type="button"
                       variant={field.value === false ? "default" : "outline"}
                       size="sm"
                       onClick={() => field.onChange(false)}
                     >
                       No
                     </Button>
                     <Button
                       type="button"
                       variant={field.value === true ? "default" : "outline"}
                       size="sm"
                       onClick={() => field.onChange(true)}
                     >
                       Yes
                     </Button>
                   </div>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Directions Tip */}
          <FormField
            control={form.control}
            name="directionsTip"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Add Directions Tip for your tenants <span className="bg-red-500 text-white text-xs px-2 py-1 rounded ml-2">NEW</span>
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Eg. Take the road opposite to Amrita College, take right after 300m..."
                    {...field}
                    rows={4}
                    className="mt-2"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Available Amenities */}
          <div className="mt-4 sm:mt-8">
            <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-red-600">Select the available amenities</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4">
              {/* Lift */}
              <FormField
                control={form.control}
                name="lift"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center space-x-2">
                      <Building className="w-4 h-4 text-muted-foreground" />
                      <FormLabel className="text-sm">Lift</FormLabel>
                    </div>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-10">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Available">Available</SelectItem>
                        <SelectItem value="Not Available">Not Available</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Power Backup */}
              <FormField
                control={form.control}
                name="powerBackup"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center space-x-2">
                      <Zap className="w-4 h-4 text-muted-foreground" />
                      <FormLabel className="text-sm">Power Backup</FormLabel>
                    </div>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-10">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Available">Available</SelectItem>
                        <SelectItem value="Not Available">Not Available</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Water Storage */}
              <FormField
                control={form.control}
                name="waterStorageFacility"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center space-x-2">
                      <Droplets className="w-4 h-4 text-muted-foreground" />
                      <FormLabel className="text-sm">Water Storage</FormLabel>
                    </div>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-10">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Available">Available</SelectItem>
                        <SelectItem value="Not Available">Not Available</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Security */}
              <FormField
                control={form.control}
                name="security"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center space-x-2">
                      <ShieldCheck className="w-4 h-4 text-muted-foreground" />
                      <FormLabel className="text-sm">Security</FormLabel>
                    </div>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-10">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Available">Available</SelectItem>
                        <SelectItem value="Not Available">Not Available</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* WiFi */}
              <FormField
                control={form.control}
                name="wifi"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center space-x-2">
                      <Wifi className="w-4 h-4 text-muted-foreground" />
                      <FormLabel className="text-sm">WiFi</FormLabel>
                    </div>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-10">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Available">Available</SelectItem>
                        <SelectItem value="Not Available">Not Available</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="flex justify-between pt-6" style={{ visibility: 'hidden' }}>
            <Button type="button" variant="outline" onClick={onBack} className="bg-muted text-muted-foreground">
              Back
            </Button>
            <Button type="submit" className="bg-primary text-primary-foreground">
              Save & Continue
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
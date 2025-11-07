import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { PropertyAmenities } from '@/types/property';
import { ProgressIndicator } from './ProgressIndicator';
import { Home, MapPin, Building, Sparkles, Camera, FileText, Calendar, Phone, Plus, Minus, PawPrint, Dumbbell, UtensilsCrossed, Shield, MoveUp, Wifi, AirVent, MessageCircle, Users, Waves, Flame, Car, Building2, Droplets, Wrench, Trees, Trash2, Tv, Zap, ShieldCheck, ShoppingCart, Accessibility, Bath, PersonStanding } from 'lucide-react';
const amenitiesSchema = z.object({
  bathrooms: z.number().optional(),
  balconies: z.number().optional(),
  waterSupply: z.string().optional(),
  petAllowed: z.boolean().optional(),
  gym: z.boolean().optional(),
  nonVegAllowed: z.boolean().optional(),
  gatedSecurity: z.boolean().optional(),
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
  internetServices: z.string().optional(),
  airConditioner: z.string().optional(),
  clubHouse: z.string().optional(),
  intercom: z.string().optional(),
  swimmingPool: z.string().optional(),
  childrenPlayArea: z.string().optional(),
  fireSafety: z.string().optional(),
  servantRoom: z.string().optional(),
  shoppingCenter: z.string().optional(),
  gasPipeline: z.string().optional(),
  park: z.string().optional(),
  rainWaterHarvesting: z.string().optional(),
  sewageTreatmentPlant: z.string().optional(),
  houseKeeping: z.string().optional(),
  visitorParking: z.string().optional()
});
type AmenitiesFormData = z.infer<typeof amenitiesSchema>;
interface AmenitiesStepProps {
  initialData?: Partial<AmenitiesFormData>;
  onNext: (data: AmenitiesFormData) => void;
  onBack: () => void;
  currentStep?: number;
  totalSteps?: number;
}
export const AmenitiesStep: React.FC<AmenitiesStepProps> = ({
  initialData = {},
  onNext,
  onBack,
  currentStep = 5,
  totalSteps = 8
}) => {
  const form = useForm<AmenitiesFormData>({
    resolver: zodResolver(amenitiesSchema),
    mode: 'onSubmit',
    defaultValues: {
      bathrooms: initialData.bathrooms ?? 0,
      balconies: initialData.balconies ?? 0,
      waterSupply: initialData.waterSupply ?? '',
      petAllowed: initialData.petAllowed ?? false,
      gym: initialData.gym ?? false,
      nonVegAllowed: initialData.nonVegAllowed ?? false,
      gatedSecurity: initialData.gatedSecurity ?? false,
      whoWillShow: initialData.whoWillShow ?? '',
      currentPropertyCondition: initialData.currentPropertyCondition ?? '',
      secondaryNumber: initialData.secondaryNumber ?? '',
      moreSimilarUnits: initialData.moreSimilarUnits ?? false,
      directionsTip: initialData.directionsTip ?? '',
      lift: initialData.lift || 'Not Available',
      internetServices: initialData.internetServices || 'Not Available',
      airConditioner: initialData.airConditioner || 'Not Available',
      clubHouse: initialData.clubHouse || 'Not Available',
      intercom: initialData.intercom || 'Not Available',
      swimmingPool: initialData.swimmingPool || 'Not Available',
      childrenPlayArea: initialData.childrenPlayArea || 'Not Available',
      fireSafety: initialData.fireSafety || 'Not Available',
      servantRoom: initialData.servantRoom || 'Not Available',
      shoppingCenter: initialData.shoppingCenter || 'Not Available',
      gasPipeline: initialData.gasPipeline || 'Not Available',
      park: initialData.park || 'Not Available',
      rainWaterHarvesting: initialData.rainWaterHarvesting || 'Not Available',
      sewageTreatmentPlant: initialData.sewageTreatmentPlant || 'Not Available',
      houseKeeping: initialData.houseKeeping || 'Not Available',
      powerBackup: initialData.powerBackup || 'Not Available',
      visitorParking: initialData.visitorParking || 'Not Available'
    }
  });
  const onSubmit = (data: AmenitiesFormData) => {
    console.log('AmenitiesStep submitting data:', data);
    onNext(data);
  };
  return <div className="bg-background rounded-lg border p-6">
      <div className="text-left mb-8 pt-4 md:pt-0">
        <h2 className="text-2xl text-primary mb-6 font-semibold">Provide additional details about your property to get maximum visibility</h2>
      </div>

      <Form {...form}>
        <form id="amenities-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          
          {/* Bathrooms, Balcony, Water Supply Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Bathrooms */}
            <FormField control={form.control} name="bathrooms" render={({
            field
          }) => <FormItem>
                  <FormLabel>Bathroom(s)</FormLabel>
                  <div className="flex items-center space-x-2">
                    <Button type="button" variant="outline" size="sm" onClick={() => field.onChange(Math.max(0, field.value - 1))} className="w-8 h-8 p-0">
                      <Minus className="w-4 h-4" />
                    </Button>
                    <div className="w-16 text-center py-2 border rounded">{field.value}</div>
                    <Button type="button" variant="outline" size="sm" onClick={() => field.onChange(field.value + 1)} className="w-8 h-8 p-0">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>} />

            {/* Balcony */}
            <FormField control={form.control} name="balconies" render={({
            field
          }) => <FormItem>
                  <FormLabel>Balcony</FormLabel>
                  <div className="flex items-center space-x-2">
                    <Button type="button" variant="outline" size="sm" onClick={() => field.onChange(Math.max(0, field.value - 1))} className="w-8 h-8 p-0">
                      <Minus className="w-4 h-4" />
                    </Button>
                    <div className="w-16 text-center py-2 border rounded">{field.value}</div>
                    <Button type="button" variant="outline" size="sm" onClick={() => field.onChange(field.value + 1)} className="w-8 h-8 p-0">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>} />

            {/* Water Supply */}
            <FormField control={form.control} name="waterSupply" render={({
            field
          }) => <FormItem>
                  <FormLabel>Water Supply</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="corporation">Corporation</SelectItem>
                      <SelectItem value="borewell">Borewell</SelectItem>
                      <SelectItem value="both">Both</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>} />
          </div>

          {/* Yes/No Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Pet Allowed */}
            <FormField control={form.control} name="petAllowed" render={({
            field
          }) => <FormItem>
                  <div className="flex items-center space-x-3">
                    <PawPrint className="w-5 h-5 text-muted-foreground hidden sm:inline" />
                    <FormLabel>Pet Allowed</FormLabel>
                  </div>
                   <div className="flex space-x-2">
                     <Button type="button" variant={field.value === false ? "default" : "outline"} size="sm" onClick={() => field.onChange(false)} className="flex-1">
                       No
                     </Button>
                     <Button type="button" variant={field.value === true ? "default" : "outline"} size="sm" onClick={() => field.onChange(true)} className="flex-1">
                       Yes
                     </Button>
                   </div>
                  <FormMessage />
                </FormItem>} />

            {/* Gym */}
            <FormField control={form.control} name="gym" render={({
            field
          }) => <FormItem>
                  <div className="flex items-center space-x-3">
                    <Dumbbell className="w-5 h-5 text-muted-foreground hidden sm:inline" />
                    <FormLabel>Gym</FormLabel>
                  </div>
                   <div className="flex space-x-2">
                     <Button type="button" variant={field.value === false ? "default" : "outline"} size="sm" onClick={() => field.onChange(false)} className="flex-1">
                       No
                     </Button>
                     <Button type="button" variant={field.value === true ? "default" : "outline"} size="sm" onClick={() => field.onChange(true)} className="flex-1">
                       Yes
                     </Button>
                   </div>
                  <FormMessage />
                </FormItem>} />

            {/* Non-Veg Allowed */}
            <FormField control={form.control} name="nonVegAllowed" render={({
            field
          }) => <FormItem>
                  <div className="flex items-center space-x-3">
                    <UtensilsCrossed className="w-5 h-5 text-muted-foreground hidden sm:inline" />
                    <FormLabel>Non-Veg Allowed</FormLabel>
                  </div>
                   <div className="flex space-x-2">
                     <Button type="button" variant={field.value === false ? "default" : "outline"} size="sm" onClick={() => field.onChange(false)} className="flex-1">
                       No
                     </Button>
                     <Button type="button" variant={field.value === true ? "default" : "outline"} size="sm" onClick={() => field.onChange(true)} className="flex-1">
                       Yes
                     </Button>
                   </div>
                  <FormMessage />
                </FormItem>} />

            {/* Gated Security */}
            <FormField control={form.control} name="gatedSecurity" render={({
            field
          }) => <FormItem>
                  <div className="flex items-center space-x-3">
                    <Shield className="w-5 h-5 text-muted-foreground hidden sm:inline" />
                    <FormLabel>Gated Security</FormLabel>
                  </div>
                   <div className="flex space-x-2">
                     <Button type="button" variant={field.value === false ? "default" : "outline"} size="sm" onClick={() => field.onChange(false)} className="flex-1">
                       No
                     </Button>
                     <Button type="button" variant={field.value === true ? "default" : "outline"} size="sm" onClick={() => field.onChange(true)} className="flex-1">
                       Yes
                     </Button>
                   </div>
                  <FormMessage />
                </FormItem>} />
          </div>

          {/* Who will show property and Property condition */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Who will show the property */}
            <FormField control={form.control} name="whoWillShow" render={({
            field
          }) => <FormItem>
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
                </FormItem>} />

            {/* Current Property Condition */}
            <FormField control={form.control} name="currentPropertyCondition" render={({
            field
          }) => <FormItem>
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
                </FormItem>} />
          </div>

          {/* Secondary Number */}
          <FormField control={form.control} name="secondaryNumber" render={({
          field
        }) => <FormItem>
                <FormLabel>Secondary Number</FormLabel>
                <div className="flex">
                  <div className="flex items-center px-3 border border-r-0 rounded-l-md bg-muted">
                    <img src="https://flagcdn.w16/in.png" alt="India" className="w-4 h-3 mr-2" />
                    <span className="text-sm">+91</span>
                  </div>
                  <FormControl>
                    <Input placeholder="Secondary Number" {...field} className="rounded-l-none" />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>} />

          {/* More similar units */}
          <FormField control={form.control} name="moreSimilarUnits" render={({
          field
        }) => <FormItem>
                <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-4">
                  <FormLabel>Do you have more similar <strong>units/properties</strong> available ?</FormLabel>
                   <div className="flex space-x-2 justify-center sm:justify-start">
                     <Button type="button" variant={field.value === false ? "default" : "outline"} size="sm" onClick={() => field.onChange(false)}>
                       No
                     </Button>
                     <Button type="button" variant={field.value === true ? "default" : "outline"} size="sm" onClick={() => field.onChange(true)}>
                       Yes
                     </Button>
                   </div>
                </div>
                <FormMessage />
              </FormItem>} />

          {/* Directions Tip */}
          <FormField control={form.control} name="directionsTip" render={({
          field
        }) => <FormItem>
                <FormLabel>
                  Add Directions Tip for your tenants <span className="bg-red-500 text-white text-xs px-2 py-1 rounded ml-2">NEW</span>
                </FormLabel>
                <FormControl>
                  <Textarea placeholder="Eg. Take the road opposite to Amrita College, take right after 300m..." {...field} rows={4} className="mt-2" />
                </FormControl>
                <FormMessage />
              </FormItem>} />

          {/* Available Amenities */}
          <div className="mt-4 sm:mt-8">
            <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-muted-foreground">Select the available amenities</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4">
              
              {/* Lift */}
              <FormField control={form.control} name="lift" render={({
              field
            }) => <FormItem className="flex items-center space-x-2 sm:space-x-3 p-2 sm:p-3 border rounded-lg">
                    <FormControl>
                      <Checkbox checked={field.value === 'Available'} onCheckedChange={checked => field.onChange(checked ? 'Available' : 'Not Available')} />
                    </FormControl>
                    <MoveUp className="w-5 h-5 text-muted-foreground hidden sm:inline" />
                    <FormLabel className="font-normal cursor-pointer">Lift</FormLabel>
                  </FormItem>} />

              {/* Internet Services */}
              <FormField control={form.control} name="internetServices" render={({
              field
            }) => <FormItem className="flex items-center space-x-2 sm:space-x-3 p-2 sm:p-3 border rounded-lg">
                    <FormControl>
                      <Checkbox checked={field.value === 'Available'} onCheckedChange={checked => field.onChange(checked ? 'Available' : 'Not Available')} />
                    </FormControl>
                    <Wifi className="w-5 h-5 text-muted-foreground hidden sm:inline" />
                    <FormLabel className="font-normal cursor-pointer">Internet Services</FormLabel>
                  </FormItem>} />

              {/* Air Conditioner */}
              <FormField control={form.control} name="airConditioner" render={({
              field
            }) => <FormItem className="flex items-center space-x-2 sm:space-x-3 p-2 sm:p-3 border rounded-lg">
                    <FormControl>
                      <Checkbox checked={field.value === 'Available'} onCheckedChange={checked => field.onChange(checked ? 'Available' : 'Not Available')} />
                    </FormControl>
                    <AirVent className="w-5 h-5 text-muted-foreground hidden sm:inline" />
                    <FormLabel className="font-normal cursor-pointer">Air Conditioner</FormLabel>
                  </FormItem>} />

              {/* Club House */}
              <FormField control={form.control} name="clubHouse" render={({
              field
            }) => <FormItem className="flex items-center space-x-2 sm:space-x-3 p-2 sm:p-3 border rounded-lg">
                    <FormControl>
                      <Checkbox checked={field.value === 'Available'} onCheckedChange={checked => field.onChange(checked ? 'Available' : 'Not Available')} />
                    </FormControl>
                    <Users className="w-5 h-5 text-muted-foreground hidden sm:inline" />
                    <FormLabel className="font-normal cursor-pointer">Club House</FormLabel>
                  </FormItem>} />

              {/* Intercom */}
              <FormField control={form.control} name="intercom" render={({
              field
            }) => <FormItem className="flex items-center space-x-2 sm:space-x-3 p-2 sm:p-3 border rounded-lg">
                    <FormControl>
                      <Checkbox checked={field.value === 'Available'} onCheckedChange={checked => field.onChange(checked ? 'Available' : 'Not Available')} />
                    </FormControl>
                    <MessageCircle className="w-5 h-5 text-muted-foreground hidden sm:inline" />
                    <FormLabel className="font-normal cursor-pointer">Intercom</FormLabel>
                  </FormItem>} />

              {/* Swimming Pool */}
              <FormField control={form.control} name="swimmingPool" render={({
              field
            }) => <FormItem className="flex items-center space-x-2 sm:space-x-3 p-2 sm:p-3 border rounded-lg">
                    <FormControl>
                      <Checkbox checked={field.value === 'Available'} onCheckedChange={checked => field.onChange(checked ? 'Available' : 'Not Available')} />
                    </FormControl>
                    <Waves className="w-5 h-5 text-muted-foreground hidden sm:inline" />
                    <FormLabel className="font-normal cursor-pointer">Swimming Pool</FormLabel>
                  </FormItem>} />

              {/* Children Play Area */}
              <FormField control={form.control} name="childrenPlayArea" render={({
              field
            }) => <FormItem className="flex items-center space-x-2 sm:space-x-3 p-2 sm:p-3 border rounded-lg">
                    <FormControl>
                      <Checkbox checked={field.value === 'Available'} onCheckedChange={checked => field.onChange(checked ? 'Available' : 'Not Available')} />
                    </FormControl>
                    <Accessibility className="w-5 h-5 text-muted-foreground hidden sm:inline" />
                    <FormLabel className="font-normal cursor-pointer">Children Play Area</FormLabel>
                  </FormItem>} />

              {/* Fire Safety */}
              <FormField control={form.control} name="fireSafety" render={({
              field
            }) => <FormItem className="flex items-center space-x-2 sm:space-x-3 p-2 sm:p-3 border rounded-lg">
                    <FormControl>
                      <Checkbox checked={field.value === 'Available'} onCheckedChange={checked => field.onChange(checked ? 'Available' : 'Not Available')} />
                    </FormControl>
                    <Flame className="w-5 h-5 text-muted-foreground hidden sm:inline" />
                    <FormLabel className="font-normal cursor-pointer">Fire Safety</FormLabel>
                  </FormItem>} />

              {/* Servant Room */}
              <FormField control={form.control} name="servantRoom" render={({
              field
            }) => <FormItem className="flex items-center space-x-2 sm:space-x-3 p-2 sm:p-3 border rounded-lg">
                    <FormControl>
                      <Checkbox checked={field.value === 'Available'} onCheckedChange={checked => field.onChange(checked ? 'Available' : 'Not Available')} />
                    </FormControl>
                    <PersonStanding className="w-5 h-5 text-muted-foreground hidden sm:inline" />
                    <FormLabel className="font-normal cursor-pointer">Servant Room</FormLabel>
                  </FormItem>} />

              {/* Shopping Center */}
              <FormField control={form.control} name="shoppingCenter" render={({
              field
            }) => <FormItem className="flex items-center space-x-2 sm:space-x-3 p-2 sm:p-3 border rounded-lg">
                    <FormControl>
                      <Checkbox checked={field.value === 'Available'} onCheckedChange={checked => field.onChange(checked ? 'Available' : 'Not Available')} />
                    </FormControl>
                    <ShoppingCart className="w-5 h-5 text-muted-foreground hidden sm:inline" />
                    <FormLabel className="font-normal cursor-pointer">Shopping Center</FormLabel>
                  </FormItem>} />

              {/* Gas Pipeline */}
              <FormField control={form.control} name="gasPipeline" render={({
              field
            }) => <FormItem className="flex items-center space-x-2 sm:space-x-3 p-2 sm:p-3 border rounded-lg">
                    <FormControl>
                      <Checkbox checked={field.value === 'Available'} onCheckedChange={checked => field.onChange(checked ? 'Available' : 'Not Available')} />
                    </FormControl>
                    <Flame className="w-5 h-5 text-muted-foreground hidden sm:inline" />
                    <FormLabel className="font-normal cursor-pointer">Gas Pipeline</FormLabel>
                  </FormItem>} />

              {/* Park */}
              <FormField control={form.control} name="park" render={({
              field
            }) => <FormItem className="flex items-center space-x-2 sm:space-x-3 p-2 sm:p-3 border rounded-lg">
                    <FormControl>
                      <Checkbox checked={field.value === 'Available'} onCheckedChange={checked => field.onChange(checked ? 'Available' : 'Not Available')} />
                    </FormControl>
                    <Trees className="w-5 h-5 text-muted-foreground hidden sm:inline" />
                    <FormLabel className="font-normal cursor-pointer">Park</FormLabel>
                  </FormItem>} />

              {/* Rain Water Harvesting */}
              <FormField control={form.control} name="rainWaterHarvesting" render={({
              field
            }) => <FormItem className="flex items-center space-x-2 sm:space-x-3 p-2 sm:p-3 border rounded-lg">
                    <FormControl>
                      <Checkbox checked={field.value === 'Available'} onCheckedChange={checked => field.onChange(checked ? 'Available' : 'Not Available')} />
                    </FormControl>
                    <Droplets className="w-5 h-5 text-muted-foreground hidden sm:inline" />
                    <FormLabel className="font-normal cursor-pointer">Rain Water Harvesting</FormLabel>
                  </FormItem>} />

              {/* Sewage Treatment Plant */}
              <FormField control={form.control} name="sewageTreatmentPlant" render={({
              field
            }) => <FormItem className="flex items-center space-x-2 sm:space-x-3 p-2 sm:p-3 border rounded-lg">
                    <FormControl>
                      <Checkbox checked={field.value === 'Available'} onCheckedChange={checked => field.onChange(checked ? 'Available' : 'Not Available')} />
                    </FormControl>
                    <Building2 className="w-5 h-5 text-muted-foreground hidden sm:inline" />
                    <FormLabel className="font-normal cursor-pointer">Sewage Treatment Plant</FormLabel>
                  </FormItem>} />

              {/* House Keeping */}
              <FormField control={form.control} name="houseKeeping" render={({
              field
            }) => <FormItem className="flex items-center space-x-2 sm:space-x-3 p-2 sm:p-3 border rounded-lg">
                    <FormControl>
                      <Checkbox checked={field.value === 'Available'} onCheckedChange={checked => field.onChange(checked ? 'Available' : 'Not Available')} />
                    </FormControl>
                    <Sparkles className="w-5 h-5 text-muted-foreground hidden sm:inline" />
                    <FormLabel className="font-normal cursor-pointer">House Keeping</FormLabel>
                  </FormItem>} />

              {/* Power Backup */}
              <FormField control={form.control} name="powerBackup" render={({
              field
            }) => <FormItem className="flex items-center space-x-2 sm:space-x-3 p-2 sm:p-3 border rounded-lg">
                    <FormControl>
                      <Checkbox checked={field.value === 'Available'} onCheckedChange={checked => field.onChange(checked ? 'Available' : 'Not Available')} />
                    </FormControl>
                    <Zap className="w-5 h-5 text-muted-foreground hidden sm:inline" />
                    <FormLabel className="font-normal cursor-pointer">Power Backup</FormLabel>
                  </FormItem>} />

              {/* Visitor Parking */}
              <FormField control={form.control} name="visitorParking" render={({
              field
            }) => <FormItem className="flex items-center space-x-2 sm:space-x-3 p-2 sm:p-3 border rounded-lg">
                    <FormControl>
                      <Checkbox checked={field.value === 'Available'} onCheckedChange={checked => field.onChange(checked ? 'Available' : 'Not Available')} />
                    </FormControl>
                    <Car className="w-5 h-5 text-muted-foreground hidden sm:inline" />
                    <FormLabel className="font-normal cursor-pointer">Visitor Parking</FormLabel>
                  </FormItem>} />

            </div>
          </div>

        </form>
      </Form>
      
      {/* Hidden submit button for sticky bar */}
      <button type="submit" form="amenities-form" className="hidden" />
    </div>;
};
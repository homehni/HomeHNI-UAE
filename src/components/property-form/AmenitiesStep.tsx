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
import { 
  Home, MapPin, Building, Sparkles, Camera, FileText, Calendar, Phone, 
  Plus, Minus, PawPrint, Dumbbell, UtensilsCrossed, Shield, MoveUp,
  Wifi, AirVent, MessageCircle, Users, Waves, Flame, Car, Building2,
  Droplets, Wrench, Trees, Trash2, Tv, Zap
} from 'lucide-react';

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
  
  // Amenities
  lift: z.boolean().optional(),
  internetServices: z.boolean().optional(),
  airConditioner: z.boolean().optional(),
  clubHouse: z.boolean().optional(),
  intercom: z.boolean().optional(),
  swimmingPool: z.boolean().optional(),
  childrenPlayArea: z.boolean().optional(),
  fireSafety: z.boolean().optional(),
  servantRoom: z.boolean().optional(),
  shoppingCenter: z.boolean().optional(),
  gasPipeline: z.boolean().optional(),
  park: z.boolean().optional(),
  rainWaterHarvesting: z.boolean().optional(),
  sewageTreatmentPlant: z.boolean().optional(),
  houseKeeping: z.boolean().optional(),
  powerBackup: z.boolean().optional(),
  visitorParking: z.boolean().optional(),
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
    defaultValues: {
      bathrooms: initialData.bathrooms || 0,
      balconies: initialData.balconies || 0,
      waterSupply: initialData.waterSupply || '',
      petAllowed: initialData.petAllowed || false,
      gym: initialData.gym || false,
      nonVegAllowed: initialData.nonVegAllowed || false,
      gatedSecurity: initialData.gatedSecurity || false,
      whoWillShow: initialData.whoWillShow || '',
      currentPropertyCondition: initialData.currentPropertyCondition || '',
      secondaryNumber: initialData.secondaryNumber || '',
      moreSimilarUnits: initialData.moreSimilarUnits || false,
      directionsTip: initialData.directionsTip || '',
      lift: initialData.lift || false,
      internetServices: initialData.internetServices || false,
      airConditioner: initialData.airConditioner || false,
      clubHouse: initialData.clubHouse || false,
      intercom: initialData.intercom || false,
      swimmingPool: initialData.swimmingPool || false,
      childrenPlayArea: initialData.childrenPlayArea || false,
      fireSafety: initialData.fireSafety || false,
      servantRoom: initialData.servantRoom || false,
      shoppingCenter: initialData.shoppingCenter || false,
      gasPipeline: initialData.gasPipeline || false,
      park: initialData.park || false,
      rainWaterHarvesting: initialData.rainWaterHarvesting || false,
      sewageTreatmentPlant: initialData.sewageTreatmentPlant || false,
      houseKeeping: initialData.houseKeeping || false,
      powerBackup: initialData.powerBackup || false,
      visitorParking: initialData.visitorParking || false,
    },
  });

  const onSubmit = (data: AmenitiesFormData) => {
    console.log('AmenitiesStep submitting data:', data);
    onNext(data);
  };

  return (
    <div className="bg-background rounded-lg border p-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-primary mb-2">Provide additional details about your property to get maximum visibility</h2>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          
          {/* Bathrooms, Balcony, Water Supply Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Bathrooms */}
            <FormField
              control={form.control}
              name="bathrooms"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bathroom(s)*</FormLabel>
                  <div className="flex items-center space-x-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => field.onChange(Math.max(0, field.value - 1))}
                      className="w-8 h-8 p-0"
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <div className="w-16 text-center py-2 border rounded">{field.value}</div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => field.onChange(field.value + 1)}
                      className="w-8 h-8 p-0"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Balcony */}
            <FormField
              control={form.control}
              name="balconies"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Balcony</FormLabel>
                  <div className="flex items-center space-x-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => field.onChange(Math.max(0, field.value - 1))}
                      className="w-8 h-8 p-0"
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <div className="w-16 text-center py-2 border rounded">{field.value}</div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => field.onChange(field.value + 1)}
                      className="w-8 h-8 p-0"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Water Supply */}
            <FormField
              control={form.control}
              name="waterSupply"
              render={({ field }) => (
                <FormItem>
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
                </FormItem>
              )}
            />
          </div>

          {/* Yes/No Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Pet Allowed */}
            <FormField
              control={form.control}
              name="petAllowed"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center space-x-3">
                    <PawPrint className="w-5 h-5 text-muted-foreground" />
                    <FormLabel>Pet Allowed*</FormLabel>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      type="button"
                      variant={field.value === false ? "outline" : "secondary"}
                      size="sm"
                      onClick={() => field.onChange(false)}
                      className="flex-1"
                    >
                      No
                    </Button>
                    <Button
                      type="button"
                      variant={field.value === true ? "outline" : "secondary"}
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

            {/* Gym */}
            <FormField
              control={form.control}
              name="gym"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center space-x-3">
                    <Dumbbell className="w-5 h-5 text-muted-foreground" />
                    <FormLabel>Gym*</FormLabel>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      type="button"
                      variant={field.value === false ? "outline" : "secondary"}
                      size="sm"
                      onClick={() => field.onChange(false)}
                      className="flex-1"
                    >
                      No
                    </Button>
                    <Button
                      type="button"
                      variant={field.value === true ? "outline" : "secondary"}
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

            {/* Non-Veg Allowed */}
            <FormField
              control={form.control}
              name="nonVegAllowed"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center space-x-3">
                    <UtensilsCrossed className="w-5 h-5 text-muted-foreground" />
                    <FormLabel>Non-Veg Allowed*</FormLabel>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      type="button"
                      variant={field.value === false ? "outline" : "secondary"}
                      size="sm"
                      onClick={() => field.onChange(false)}
                      className="flex-1"
                    >
                      No
                    </Button>
                    <Button
                      type="button"
                      variant={field.value === true ? "outline" : "secondary"}
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
                <FormItem>
                  <div className="flex items-center space-x-3">
                    <Shield className="w-5 h-5 text-muted-foreground" />
                    <FormLabel>Gated Security*</FormLabel>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      type="button"
                      variant={field.value === false ? "outline" : "secondary"}
                      size="sm"
                      onClick={() => field.onChange(false)}
                      className="flex-1"
                    >
                      No
                    </Button>
                    <Button
                      type="button"
                      variant={field.value === true ? "outline" : "secondary"}
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

          {/* Who will show property and Property condition */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Who will show the property */}
            <FormField
              control={form.control}
              name="whoWillShow"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Who will show the property?*</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="owner">Owner</SelectItem>
                      <SelectItem value="broker">Broker</SelectItem>
                      <SelectItem value="agent">Agent</SelectItem>
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
                <div className="flex items-center space-x-4">
                  <FormLabel>Do you have more similar <strong>units/properties</strong> available ?</FormLabel>
                  <div className="flex space-x-2">
                    <Button
                      type="button"
                      variant={field.value === false ? "outline" : "secondary"}
                      size="sm"
                      onClick={() => field.onChange(false)}
                    >
                      No
                    </Button>
                    <Button
                      type="button"
                      variant={field.value === true ? "outline" : "secondary"}
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
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-4 text-muted-foreground">Select the available amenities</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              
              {/* Lift */}
              <FormField
                control={form.control}
                name="lift"
                render={({ field }) => (
                  <FormItem className="flex flex-col items-center space-y-2">
                    <FormControl>
                      <div className="flex flex-col items-center space-y-2">
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                        <div className="flex items-center space-x-2">
                          <MoveUp className="w-5 h-5" />
                          <FormLabel className="font-normal">Lift</FormLabel>
                        </div>
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* Internet Services */}
              <FormField
                control={form.control}
                name="internetServices"
                render={({ field }) => (
                  <FormItem className="flex flex-col items-center space-y-2">
                    <FormControl>
                      <div className="flex flex-col items-center space-y-2">
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                        <div className="flex items-center space-x-2">
                          <Wifi className="w-5 h-5" />
                          <FormLabel className="font-normal">Internet Services</FormLabel>
                        </div>
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* Air Conditioner */}
              <FormField
                control={form.control}
                name="airConditioner"
                render={({ field }) => (
                  <FormItem className="flex flex-col items-center space-y-2">
                    <FormControl>
                      <div className="flex flex-col items-center space-y-2">
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                        <div className="flex items-center space-x-2">
                          <AirVent className="w-5 h-5" />
                          <FormLabel className="font-normal">Air Conditioner</FormLabel>
                        </div>
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* Club House */}
              <FormField
                control={form.control}
                name="clubHouse"
                render={({ field }) => (
                  <FormItem className="flex flex-col items-center space-y-2">
                    <FormControl>
                      <div className="flex flex-col items-center space-y-2">
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                        <div className="flex items-center space-x-2">
                          <Users className="w-5 h-5" />
                          <FormLabel className="font-normal">Club House</FormLabel>
                        </div>
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* Intercom */}
              <FormField
                control={form.control}
                name="intercom"
                render={({ field }) => (
                  <FormItem className="flex flex-col items-center space-y-2">
                    <FormControl>
                      <div className="flex flex-col items-center space-y-2">
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                        <div className="flex items-center space-x-2">
                          <MessageCircle className="w-5 h-5" />
                          <FormLabel className="font-normal">Intercom</FormLabel>
                        </div>
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* Swimming Pool */}
              <FormField
                control={form.control}
                name="swimmingPool"
                render={({ field }) => (
                  <FormItem className="flex flex-col items-center space-y-2">
                    <FormControl>
                      <div className="flex flex-col items-center space-y-2">
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                        <div className="flex items-center space-x-2">
                          <Waves className="w-5 h-5" />
                          <FormLabel className="font-normal">Swimming Pool</FormLabel>
                        </div>
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* Children Play Area */}
              <FormField
                control={form.control}
                name="childrenPlayArea"
                render={({ field }) => (
                  <FormItem className="flex flex-col items-center space-y-2">
                    <FormControl>
                      <div className="flex flex-col items-center space-y-2">
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                        <div className="flex items-center space-x-2">
                          <Trees className="w-5 h-5" />
                          <FormLabel className="font-normal">Children Play Area</FormLabel>
                        </div>
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* Fire Safety */}
              <FormField
                control={form.control}
                name="fireSafety"
                render={({ field }) => (
                  <FormItem className="flex flex-col items-center space-y-2">
                    <FormControl>
                      <div className="flex flex-col items-center space-y-2">
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                        <div className="flex items-center space-x-2">
                          <Flame className="w-5 h-5" />
                          <FormLabel className="font-normal">Fire Safety</FormLabel>
                        </div>
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* Servant Room */}
              <FormField
                control={form.control}
                name="servantRoom"
                render={({ field }) => (
                  <FormItem className="flex flex-col items-center space-y-2">
                    <FormControl>
                      <div className="flex flex-col items-center space-y-2">
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                        <div className="flex items-center space-x-2">
                          <Home className="w-5 h-5" />
                          <FormLabel className="font-normal">Servant Room</FormLabel>
                        </div>
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* Shopping Center */}
              <FormField
                control={form.control}
                name="shoppingCenter"
                render={({ field }) => (
                  <FormItem className="flex flex-col items-center space-y-2">
                    <FormControl>
                      <div className="flex flex-col items-center space-y-2">
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                        <div className="flex items-center space-x-2">
                          <Building2 className="w-5 h-5" />
                          <FormLabel className="font-normal">Shopping Center</FormLabel>
                        </div>
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* Gas Pipeline */}
              <FormField
                control={form.control}
                name="gasPipeline"
                render={({ field }) => (
                  <FormItem className="flex flex-col items-center space-y-2">
                    <FormControl>
                      <div className="flex flex-col items-center space-y-2">
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                        <div className="flex items-center space-x-2">
                          <Wrench className="w-5 h-5" />
                          <FormLabel className="font-normal">Gas Pipeline</FormLabel>
                        </div>
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* Park */}
              <FormField
                control={form.control}
                name="park"
                render={({ field }) => (
                  <FormItem className="flex flex-col items-center space-y-2">
                    <FormControl>
                      <div className="flex flex-col items-center space-y-2">
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                        <div className="flex items-center space-x-2">
                          <Trees className="w-5 h-5" />
                          <FormLabel className="font-normal">Park</FormLabel>
                        </div>
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* Rain Water Harvesting */}
              <FormField
                control={form.control}
                name="rainWaterHarvesting"
                render={({ field }) => (
                  <FormItem className="flex flex-col items-center space-y-2">
                    <FormControl>
                      <div className="flex flex-col items-center space-y-2">
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                        <div className="flex items-center space-x-2">
                          <Droplets className="w-5 h-5" />
                          <FormLabel className="font-normal">Rain Water Harvesting</FormLabel>
                        </div>
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* Sewage Treatment Plant */}
              <FormField
                control={form.control}
                name="sewageTreatmentPlant"
                render={({ field }) => (
                  <FormItem className="flex flex-col items-center space-y-2">
                    <FormControl>
                      <div className="flex flex-col items-center space-y-2">
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                        <div className="flex items-center space-x-2">
                          <Trash2 className="w-5 h-5" />
                          <FormLabel className="font-normal">Sewage Treatment Plant</FormLabel>
                        </div>
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* House Keeping */}
              <FormField
                control={form.control}
                name="houseKeeping"
                render={({ field }) => (
                  <FormItem className="flex flex-col items-center space-y-2">
                    <FormControl>
                      <div className="flex flex-col items-center space-y-2">
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                        <div className="flex items-center space-x-2">
                          <Home className="w-5 h-5" />
                          <FormLabel className="font-normal">House Keeping</FormLabel>
                        </div>
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* Power Backup */}
              <FormField
                control={form.control}
                name="powerBackup"
                render={({ field }) => (
                  <FormItem className="flex flex-col items-center space-y-2">
                    <FormControl>
                      <div className="flex flex-col items-center space-y-2">
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                        <div className="flex items-center space-x-2">
                          <Zap className="w-5 h-5" />
                          <FormLabel className="font-normal">Power Backup</FormLabel>
                        </div>
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* Visitor Parking */}
              <FormField
                control={form.control}
                name="visitorParking"
                render={({ field }) => (
                  <FormItem className="flex flex-col items-center space-y-2">
                    <FormControl>
                      <div className="flex flex-col items-center space-y-2">
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                        <div className="flex items-center space-x-2">
                          <Car className="w-5 h-5" />
                          <FormLabel className="font-normal">Visitor Parking</FormLabel>
                        </div>
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />

            </div>
          </div>

          <div className="flex justify-between pt-6">
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

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Minus, Plus } from 'lucide-react';

const resaleAmenitiesSchema = z.object({
  bathrooms: z.number().min(1).optional(),
  balcony: z.number().min(0).optional(),
  waterSupply: z.string().optional(),
  powerBackup: z.string().optional(),
  gym: z.string().optional(),
  gatedSecurity: z.string().optional(),
  whoWillShow: z.string().optional(),
  currentPropertyCondition: z.string().optional(),
  secondaryNumber: z.string().optional(),
  moreSimilarUnits: z.string().optional(),
  directions: z.string().optional(),
  swimmingPool: z.boolean().optional(),
  clubHouse: z.boolean().optional(),
  lift: z.boolean().optional(),
  fireSafety: z.boolean().optional(),
  intercom: z.boolean().optional(),
  playground: z.boolean().optional(),
  shoppingCenter: z.boolean().optional(),
  park: z.boolean().optional(),
  sewageTreatmentPlant: z.boolean().optional(),
  visitorParking: z.boolean().optional(),
  gasPipeline: z.boolean().optional(),
  internetProvider: z.boolean().optional(),
});

type ResaleAmenitiesData = z.infer<typeof resaleAmenitiesSchema>;

interface ResaleAmenitiesStepProps {
  initialData?: Partial<ResaleAmenitiesData>;
  onNext: (data: ResaleAmenitiesData) => void;
  onBack: () => void;
}

export const ResaleAmenitiesStep: React.FC<ResaleAmenitiesStepProps> = ({
  initialData = {},
  onNext,
  onBack,
}) => {
  const form = useForm<ResaleAmenitiesData>({
    resolver: zodResolver(resaleAmenitiesSchema),
    defaultValues: {
      bathrooms: initialData.bathrooms || 1,
      balcony: initialData.balcony || 0,
      waterSupply: initialData.waterSupply || '',
      powerBackup: initialData.powerBackup || '',
      gym: initialData.gym || '',
      gatedSecurity: initialData.gatedSecurity || '',
      whoWillShow: initialData.whoWillShow || '',
      currentPropertyCondition: initialData.currentPropertyCondition || '',
      secondaryNumber: initialData.secondaryNumber || '',
      moreSimilarUnits: initialData.moreSimilarUnits || '',
      directions: initialData.directions || '',
      ...initialData,
    },
  });

  const onSubmit = (data: ResaleAmenitiesData) => {
    onNext(data);
  };

  const incrementValue = (fieldName: 'bathrooms' | 'balcony') => {
    const currentValue = form.getValues(fieldName);
    form.setValue(fieldName, currentValue + 1);
  };

  const decrementValue = (fieldName: 'bathrooms' | 'balcony') => {
    const currentValue = form.getValues(fieldName);
    if (fieldName === 'bathrooms' && currentValue > 1) {
      form.setValue(fieldName, currentValue - 1);
    } else if (fieldName === 'balcony' && currentValue > 0) {
      form.setValue(fieldName, currentValue - 1);
    }
  };

  return (
    <div className="max-w-4xl">
      <div className="bg-background rounded-lg border p-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-2">Provide additional details about your property to get maximum visibility</h2>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Details Row 1 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Bathrooms */}
              <FormField
                control={form.control}
                name="bathrooms"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bathroom(s)</FormLabel>
                    <div className="flex items-center space-x-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => decrementValue('bathrooms')}
                        className="h-8 w-8 p-0"
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <Input
                        type="number"
                        value={field.value}
                        readOnly
                        className="text-center w-16"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => incrementValue('bathrooms')}
                        className="h-8 w-8 p-0"
                      >
                        <Plus className="h-4 w-4" />
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
                  <FormItem>
                    <FormLabel>Balcony</FormLabel>
                    <div className="flex items-center space-x-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => decrementValue('balcony')}
                        className="h-8 w-8 p-0"
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <Input
                        type="number"
                        value={field.value}
                        readOnly
                        className="text-center w-16"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => incrementValue('balcony')}
                        className="h-8 w-8 p-0"
                      >
                        <Plus className="h-4 w-4" />
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
                          <SelectValue placeholder="Borewell" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="borewell">Borewell</SelectItem>
                        <SelectItem value="corporation">Corporation</SelectItem>
                        <SelectItem value="both">Both</SelectItem>
                        <SelectItem value="tanker">Tanker</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Basic Details Row 2 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Power Backup */}
              <FormField
                control={form.control}
                name="powerBackup"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Power Backup</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Partial" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="partial">Partial</SelectItem>
                        <SelectItem value="full">Full Power Backup</SelectItem>
                        <SelectItem value="dg-backup">DG Backup</SelectItem>
                        <SelectItem value="no-backup">No Power Backup</SelectItem>
                      </SelectContent>
                    </Select>
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
                    <FormLabel>Gym</FormLabel>
                    <div className="flex space-x-2">
                      <Button
                        type="button"
                        variant={field.value === 'no' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => field.onChange('no')}
                        className="flex-1"
                      >
                        No
                      </Button>
                      <Button
                        type="button"
                        variant={field.value === 'yes' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => field.onChange('yes')}
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
                    <FormLabel>Gated Security</FormLabel>
                    <div className="flex space-x-2">
                      <Button
                        type="button"
                        variant={field.value === 'no' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => field.onChange('no')}
                        className="flex-1"
                      >
                        No
                      </Button>
                      <Button
                        type="button"
                        variant={field.value === 'yes' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => field.onChange('yes')}
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

            {/* Property Details Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Who will show */}
              <FormField
                control={form.control}
                name="whoWillShow"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Who will show the property?</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Neighbours" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="neighbours">Neighbours</SelectItem>
                        <SelectItem value="myself">I will show</SelectItem>
                        <SelectItem value="tenant">Current Tenant</SelectItem>
                        <SelectItem value="security">Security Guard</SelectItem>
                        <SelectItem value="agent">Property Agent</SelectItem>
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
                          <SelectValue placeholder="Self Occupied" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="self-occupied">Self Occupied</SelectItem>
                        <SelectItem value="tenant-occupied">Tenant Occupied</SelectItem>
                        <SelectItem value="vacant">Vacant</SelectItem>
                        <SelectItem value="under-construction">Under Construction</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Secondary Number */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="secondaryNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Secondary Number</FormLabel>
                    <FormControl>
                      <div className="flex">
                        <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-muted-foreground text-sm">
                          🇮🇳 +91
                        </span>
                        <Input
                          placeholder="8639404429"
                          {...field}
                          className="rounded-l-none"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* More Similar Units */}
            <div>
              <FormField
                control={form.control}
                name="moreSimilarUnits"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Do you have more similar units/properties available?</FormLabel>
                    <div className="flex space-x-4">
                      <Button
                        type="button"
                        variant={field.value === 'no' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => field.onChange('no')}
                      >
                        No
                      </Button>
                      <Button
                        type="button"
                        variant={field.value === 'yes' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => field.onChange('yes')}
                      >
                        Yes
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Directions */}
            <div>
              <FormField
                control={form.control}
                name="directions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Add Directions Tip for your buyers <span className="bg-red-500 text-white px-2 py-1 rounded text-xs">NEW</span>
                    </FormLabel>
                    <div className="bg-blue-50 p-4 rounded-lg mb-2">
                      <div className="flex items-start space-x-2">
                        <div className="text-blue-600 mt-1">📍</div>
                        <div>
                          <p className="text-blue-800 font-medium">Don't want calls asking location?</p>
                          <p className="text-blue-600 text-sm">Add directions to reach using landmarks</p>
                        </div>
                        <button type="button" className="text-blue-400 ml-auto">×</button>
                      </div>
                    </div>
                    <FormControl>
                      <Textarea
                        placeholder="Eg. Take the road opposite to Amrita College, take right after 300m..."
                        {...field}
                        rows={4}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Select Available Amenities */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Select the available amenities</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { name: 'clubHouse', label: 'Club House' },
                  { name: 'swimmingPool', label: 'Swimming Pool' },
                  { name: 'lift', label: 'Lift' },
                  { name: 'fireSafety', label: 'Fire Safety' },
                  { name: 'intercom', label: 'Intercom' },
                  { name: 'playground', label: 'Children Play Area' },
                  { name: 'shoppingCenter', label: 'Shopping Center' },
                  { name: 'park', label: 'Park' },
                  { name: 'sewageTreatmentPlant', label: 'Sewage Treatment Plant' },
                  { name: 'visitorParking', label: 'Visitor Parking' },
                  { name: 'gasPipeline', label: 'Gas Pipeline' },
                  { name: 'internetProvider', label: 'Internet Provider' },
                ].map((amenity) => (
                  <FormField
                    key={amenity.name}
                    control={form.control}
                    name={amenity.name as keyof ResaleAmenitiesData}
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={!!field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel className="text-sm font-normal cursor-pointer">
                          {amenity.label}
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                ))}
              </div>
            </div>

            <div className="flex justify-between pt-6">
              <Button type="button" variant="outline" onClick={onBack}>
                Back
              </Button>
              <Button type="submit" className="bg-red-500 text-white hover:bg-red-600">
                Save & Continue
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};
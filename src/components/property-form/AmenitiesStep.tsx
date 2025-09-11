import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { PropertyAmenities } from '@/types/property';
import { Minus, Plus, Phone, MapPin, X } from 'lucide-react';

const amenitiesSchema = z.object({
  bathrooms: z.number().optional(),
  balconies: z.number().optional(),
  waterStorageFacility: z.string().optional(),
  petAllowed: z.boolean().optional(),
  nonVegAllowed: z.boolean().optional(),
  gym: z.boolean().optional(),
  gatedSecurity: z.boolean().optional(),
  whoWillShowProperty: z.string().optional(),
  currentPropertyCondition: z.string().optional(),
  secondaryNumber: z.string().optional(),
  moreSimilarUnits: z.boolean().optional(),
  directionsTip: z.string().optional(),
  // Available amenities
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

interface AmenitiesStepProps {
  initialData?: Partial<PropertyAmenities>;
  onNext: (data: PropertyAmenities) => void;
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
  const [bathrooms, setBathrooms] = useState(initialData.bathrooms || 0);
  const [balconies, setBalconies] = useState(initialData.balconies || 0);

  const form = useForm<PropertyAmenities>({
    resolver: zodResolver(amenitiesSchema),
    defaultValues: {
      bathrooms: initialData.bathrooms || 0,
      balconies: initialData.balconies || 0,
      waterStorageFacility: initialData.waterStorageFacility || '',
      petAllowed: initialData.petAllowed || false,
      nonVegAllowed: initialData.nonVegAllowed || false,
      gym: initialData.gym || false,
      gatedSecurity: initialData.gatedSecurity || false,
      whoWillShowProperty: initialData.whoWillShowProperty || '',
      currentPropertyCondition: initialData.currentPropertyCondition || '',
      secondaryNumber: initialData.secondaryNumber || '',
      moreSimilarUnits: initialData.moreSimilarUnits || false,
      directionsTip: initialData.directionsTip || '',
      // Available amenities
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

  const onSubmit = (data: PropertyAmenities) => {
    console.log('AmenitiesStep submitting data:', data);
    onNext(data);
  };

  return (
    <div className="bg-background rounded-lg border p-8">
      <h1 className="text-2xl font-semibold text-primary mb-6">
        Provide additional details about your property to get maximum visibility
      </h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Bathroom(s) and Balcony */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FormField
              control={form.control}
              name="bathrooms"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bathroom(s)*</FormLabel>
                  <div className="flex items-center gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="w-8 h-8 p-0"
                      onClick={() => {
                        const newValue = Math.max(0, bathrooms - 1);
                        setBathrooms(newValue);
                        field.onChange(newValue);
                      }}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="min-w-[2rem] text-center font-medium">{bathrooms}</span>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="w-8 h-8 p-0"
                      onClick={() => {
                        const newValue = bathrooms + 1;
                        setBathrooms(newValue);
                        field.onChange(newValue);
                      }}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="balconies"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Balcony</FormLabel>
                  <div className="flex items-center gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="w-8 h-8 p-0"
                      onClick={() => {
                        const newValue = Math.max(0, balconies - 1);
                        setBalconies(newValue);
                        field.onChange(newValue);
                      }}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="min-w-[2rem] text-center font-medium">{balconies}</span>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="w-8 h-8 p-0"
                      onClick={() => {
                        const newValue = balconies + 1;
                        setBalconies(newValue);
                        field.onChange(newValue);
                      }}
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
              name="waterStorageFacility"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Water Supply</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="borewell">Borewell</SelectItem>
                      <SelectItem value="corporation">Corporation</SelectItem>
                      <SelectItem value="both">Both</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Pet/Gym/Non-Veg/Security Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="petAllowed"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center space-x-4">
                      <span className="text-2xl">🐾</span>
                      <div className="flex-1">
                        <FormLabel>Pet Allowed*</FormLabel>
                      </div>
                      <div className="flex space-x-2">
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

              <FormField
                control={form.control}
                name="nonVegAllowed"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center space-x-4">
                      <span className="text-2xl">🍖</span>
                      <div className="flex-1">
                        <FormLabel>Non-Veg Allowed*</FormLabel>
                      </div>
                      <div className="flex space-x-2">
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
            </div>

            <div className="space-y-4">
              <FormField
                control={form.control}
                name="gym"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center space-x-4">
                      <span className="text-2xl">💪</span>
                      <div className="flex-1">
                        <FormLabel>Gym*</FormLabel>
                      </div>
                      <div className="flex space-x-2">
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

              <FormField
                control={form.control}
                name="gatedSecurity"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center space-x-4">
                      <span className="text-2xl">🔒</span>
                      <div className="flex-1">
                        <FormLabel>Gated Security*</FormLabel>
                      </div>
                      <div className="flex space-x-2">
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
            </div>
          </div>

          {/* Who will show property and Current condition */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="whoWillShowProperty"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Who will show the property?*</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="owner">Owner</SelectItem>
                      <SelectItem value="tenant">Tenant</SelectItem>
                      <SelectItem value="agent">Agent</SelectItem>
                      <SelectItem value="security">Security</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="currentPropertyCondition"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Property Condition?</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="excellent">Excellent</SelectItem>
                      <SelectItem value="good">Good</SelectItem>
                      <SelectItem value="average">Average</SelectItem>
                      <SelectItem value="poor">Poor</SelectItem>
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
                  <div className="flex items-center px-3 border border-r-0 border-gray-300 bg-gray-50 rounded-l-md">
                    <span className="text-sm">🇮🇳 +91</span>
                  </div>
                  <FormControl>
                    <Input
                      placeholder="Secondary Number"
                      className="rounded-l-none h-12"
                      {...field}
                    />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Similar units question */}
          <FormField
            control={form.control}
            name="moreSimilarUnits"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <FormLabel className="text-sm">
                    Do you have more similar <strong>units/properties</strong> available?
                  </FormLabel>
                  <div className="flex space-x-2">
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
                  Add Directions Tip for your tenants <span className="bg-red-500 text-white text-xs px-2 py-1 rounded">NEW</span>
                </FormLabel>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <div className="flex items-start space-x-2">
                    <MapPin className="h-4 w-4 text-blue-600 mt-1" />
                    <div className="flex-1">
                      <p className="text-sm text-blue-800">Don't want calls asking location?</p>
                      <p className="text-sm text-blue-600">Add directions to reach using landmarks</p>
                    </div>
                    <Button type="button" variant="ghost" size="sm" className="p-1">
                      <X className="h-4 w-4" />
                    </Button>
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

          {/* Available Amenities */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Select the available amenities</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <FormField
                  control={form.control}
                  name="lift"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <input
                          type="checkbox"
                          checked={field.value}
                          onChange={(e) => field.onChange(e.target.checked)}
                          className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                        />
                      </FormControl>
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">🏗️</span>
                        <FormLabel className="font-normal">Lift</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="airConditioner"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <input
                          type="checkbox"
                          checked={field.value}
                          onChange={(e) => field.onChange(e.target.checked)}
                          className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                        />
                      </FormControl>
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">❄️</span>
                        <FormLabel className="font-normal">Air Conditioner</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="intercom"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <input
                          type="checkbox"
                          checked={field.value}
                          onChange={(e) => field.onChange(e.target.checked)}
                          className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                        />
                      </FormControl>
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">📞</span>
                        <FormLabel className="font-normal">Intercom</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="childrenPlayArea"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <input
                          type="checkbox"
                          checked={field.value}
                          onChange={(e) => field.onChange(e.target.checked)}
                          className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                        />
                      </FormControl>
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">🏀</span>
                        <FormLabel className="font-normal">Children Play Area</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="servantRoom"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <input
                          type="checkbox"
                          checked={field.value}
                          onChange={(e) => field.onChange(e.target.checked)}
                          className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                        />
                      </FormControl>
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">🏠</span>
                        <FormLabel className="font-normal">Servant Room</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="gasPipeline"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <input
                          type="checkbox"
                          checked={field.value}
                          onChange={(e) => field.onChange(e.target.checked)}
                          className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                        />
                      </FormControl>
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">🔥</span>
                        <FormLabel className="font-normal">Gas Pipeline</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="rainWaterHarvesting"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <input
                          type="checkbox"
                          checked={field.value}
                          onChange={(e) => field.onChange(e.target.checked)}
                          className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                        />
                      </FormControl>
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">🌧️</span>
                        <FormLabel className="font-normal">Rain Water Harvesting</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="houseKeeping"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <input
                          type="checkbox"
                          checked={field.value}
                          onChange={(e) => field.onChange(e.target.checked)}
                          className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                        />
                      </FormControl>
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">🧹</span>
                        <FormLabel className="font-normal">House Keeping</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="visitorParking"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <input
                          type="checkbox"
                          checked={field.value}
                          onChange={(e) => field.onChange(e.target.checked)}
                          className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                        />
                      </FormControl>
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">🅿️</span>
                        <FormLabel className="font-normal">Visitor Parking</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-3">
                <FormField
                  control={form.control}
                  name="internetServices"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <input
                          type="checkbox"
                          checked={field.value}
                          onChange={(e) => field.onChange(e.target.checked)}
                          className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                        />
                      </FormControl>
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">📶</span>
                        <FormLabel className="font-normal">Internet Services</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="clubHouse"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <input
                          type="checkbox"
                          checked={field.value}
                          onChange={(e) => field.onChange(e.target.checked)}
                          className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                        />
                      </FormControl>
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">🏛️</span>
                        <FormLabel className="font-normal">Club House</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="swimmingPool"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <input
                          type="checkbox"
                          checked={field.value}
                          onChange={(e) => field.onChange(e.target.checked)}
                          className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                        />
                      </FormControl>
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">🏊</span>
                        <FormLabel className="font-normal">Swimming Pool</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="fireSafety"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <input
                          type="checkbox"
                          checked={field.value}
                          onChange={(e) => field.onChange(e.target.checked)}
                          className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                        />
                      </FormControl>
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">🔥</span>
                        <FormLabel className="font-normal">Fire Safety</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="shoppingCenter"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <input
                          type="checkbox"
                          checked={field.value}
                          onChange={(e) => field.onChange(e.target.checked)}
                          className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                        />
                      </FormControl>
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">🛒</span>
                        <FormLabel className="font-normal">Shopping Center</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="park"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <input
                          type="checkbox"
                          checked={field.value}
                          onChange={(e) => field.onChange(e.target.checked)}
                          className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                        />
                      </FormControl>
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">🌳</span>
                        <FormLabel className="font-normal">Park</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="sewageTreatmentPlant"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <input
                          type="checkbox"
                          checked={field.value}
                          onChange={(e) => field.onChange(e.target.checked)}
                          className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                        />
                      </FormControl>
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">♻️</span>
                        <FormLabel className="font-normal">Sewage Treatment Plant</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="powerBackup"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <input
                          type="checkbox"
                          checked={field.value}
                          onChange={(e) => field.onChange(e.target.checked)}
                          className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                        />
                      </FormControl>
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">🔋</span>
                        <FormLabel className="font-normal">Power Backup</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-between pt-6">
            <Button type="button" variant="outline" onClick={onBack} className="h-12 px-8">
              Back
            </Button>
            <Button type="submit" className="h-12 px-8 bg-red-500 hover:bg-red-600 text-white">
              Save & Continue
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
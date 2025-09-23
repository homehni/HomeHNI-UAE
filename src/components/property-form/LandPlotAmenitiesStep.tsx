import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { LandPlotAmenities } from '@/types/landPlotProperty';

const amenitiesSchema = z.object({
  waterSupply: z.enum(['municipal', 'borewell', 'tank', 'none']).optional(),
  electricityConnection: z.enum(['available', 'nearby', 'none']).optional(),
  sewageConnection: z.enum(['connected', 'septic_tank', 'none']).optional(),
  roadWidth: z.number().optional().or(z.nan()).transform(val => isNaN(val) ? undefined : val),
  
  gatedSecurity: z.boolean().optional(),
  directionsToProperty: z.string().optional(),
});

type AmenitiesForm = z.infer<typeof amenitiesSchema>;

interface LandPlotAmenitiesStepProps {
  initialData: Partial<LandPlotAmenities>;
  onNext: (data: AmenitiesForm) => void;
  onBack: () => void;
  listingType?: 'Industrial land' | 'Agricultural Land' | 'Commercial land';
}

export const LandPlotAmenitiesStep: React.FC<LandPlotAmenitiesStepProps> = ({
  initialData,
  onNext,
  onBack,
  listingType,
}) => {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<AmenitiesForm>({
    resolver: zodResolver(amenitiesSchema),
    defaultValues: {
      waterSupply: 'municipal',
      electricityConnection: 'available',
      sewageConnection: 'connected',
      roadWidth: undefined,
      gatedSecurity: false,
      directionsToProperty: '',
    }
  });

  return (
    <div className="bg-background p-6">
        <div className="text-left mb-8">
          <h2 className="text-2xl font-semibold text-red-600 mb-2">
            Infrastructure & Amenities
          </h2>
        </div>
        <form onSubmit={handleSubmit(onNext)} className="space-y-6">
          {/* Water Supply and Electricity Connection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Water Supply</Label>
              <Select onValueChange={(value) => setValue('waterSupply', value as any)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent className="bg-white z-50">
                  <SelectItem value="municipal">Municipal Supply</SelectItem>
                  <SelectItem value="borewell">Borewell</SelectItem>
                  <SelectItem value="tank">Water Tank</SelectItem>
                  <SelectItem value="none">None</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Electricity Connection</Label>
              <Select onValueChange={(value) => setValue('electricityConnection', value as any)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent className="bg-white z-50">
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="nearby">Nearby</SelectItem>
                  <SelectItem value="none">None</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Sewage Connection and Road Width */}
          <div className={`grid grid-cols-1 ${listingType === 'Agricultural Land' ? 'md:grid-cols-1' : 'md:grid-cols-2'} gap-6`}>
            {listingType !== 'Agricultural Land' && (
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Sewage Connection</Label>
                <Select onValueChange={(value) => setValue('sewageConnection', value as any)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent className="bg-white z-50">
                    <SelectItem value="connected">Connected</SelectItem>
                    <SelectItem value="septic_tank">Septic Tank</SelectItem>
                    <SelectItem value="none">None</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="roadWidth" className="text-sm font-medium text-gray-700">
                Width of Facing Road (ft.)
              </Label>
              <Input
                id="roadWidth"
                type="number"
                min="1"
                {...register('roadWidth', { 
                  valueAsNumber: true,
                  min: { value: 1, message: "Road width must be at least 1" }
                })}
                onKeyDown={(e) => { if (['-','+','e','E','.'].includes(e.key)) e.preventDefault(); }}
                onPaste={(e) => { const text = e.clipboardData.getData('text'); const digits = text.replace(/[^0-9]/g, ''); if (digits !== text) { e.preventDefault(); } }}
                placeholder="Width of facing road"
                className="w-full [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]"
              />
              {errors.roadWidth && (
                <p className="text-red-500 text-sm">{errors.roadWidth.message}</p>
              )}
            </div>
          </div>


          {/* Gated Security */}
          <div className="space-y-4">
            <Label className="text-sm font-medium text-gray-700">
              Gated Security
            </Label>
            <div className="flex space-x-4">
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="gatedSecurity-no"
                  name="gatedSecurity"
                  value="false"
                  onChange={() => setValue('gatedSecurity', false)}
                  className="w-4 h-4 text-red-600"
                />
                <Label htmlFor="gatedSecurity-no" className="text-sm text-gray-700">
                  No
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="gatedSecurity-yes"
                  name="gatedSecurity"
                  value="true"
                  onChange={() => setValue('gatedSecurity', true)}
                  className="w-4 h-4 text-red-600"
                />
                <Label htmlFor="gatedSecurity-yes" className="text-sm text-gray-700">
                  Yes
                </Label>
              </div>
            </div>
          </div>

          {/* Directions */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Label htmlFor="directionsToProperty" className="text-sm font-medium text-gray-700">
                Add Directions Tip for your buyers
              </Label>
              <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full font-semibold">
                NEW
              </span>
            </div>
            <p className="text-sm text-gray-500 mb-2">
              Don't want calls asking location?
            </p>
            <p className="text-sm text-gray-600 mb-3">
              Add directions to reach using landmarks
            </p>
            <Textarea
              id="directionsToProperty"
              {...register('directionsToProperty')}
              placeholder="Eg. Take the road opposite to Amrita College, take right after 300m..."
              className="min-h-[100px] resize-none"
            />
          </div>

          {/* Navigation Buttons - Removed, using sticky buttons instead */}
        </form>
      </div>
  );
};
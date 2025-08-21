import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LandPlotLocationDetails } from '@/types/landPlotProperty';

const locationDetailsSchema = z.object({
  state: z.string().optional(),
  city: z.string().optional(),
  locality: z.string().optional(),
  societyName: z.string().optional(),
});

type LocationDetailsForm = z.infer<typeof locationDetailsSchema>;

interface LandPlotLocationDetailsStepProps {
  initialData: Partial<LandPlotLocationDetails>;
  onNext: (data: LocationDetailsForm) => void;
  onBack: () => void;
}

export const LandPlotLocationDetailsStep: React.FC<LandPlotLocationDetailsStepProps> = ({
  initialData,
  onNext,
  onBack,
}) => {
  const [statesData, setStatesData] = useState<any>({});
  const [cities, setCities] = useState<string[]>([]);

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<LocationDetailsForm>({
    resolver: zodResolver(locationDetailsSchema),
    defaultValues: initialData,
  });

  const selectedState = watch('state');

  // Load states and cities data
  useEffect(() => {
    const loadStatesData = async () => {
      try {
        const response = await fetch('/data/india_states_cities.json');
        const data = await response.json();
        setStatesData(data);
      } catch (error) {
        console.error('Error loading states data:', error);
      }
    };
    loadStatesData();
  }, []);

  // Update cities when state changes
  useEffect(() => {
    if (selectedState && statesData[selectedState]) {
      setCities(statesData[selectedState]);
      // Clear city selection when state changes
      setValue('city', '');
    }
  }, [selectedState, statesData, setValue]);

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-gray-900">
          Location Details
        </CardTitle>
        <p className="text-gray-600">
          Provide the complete location information for your land/plot
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onNext)} className="space-y-6">
          {/* State and City */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="state" className="text-sm font-medium text-gray-700">
                State
              </Label>
              <Select onValueChange={(value) => setValue('state', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select state" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(statesData).map((state) => (
                    <SelectItem key={state} value={state}>
                      {state}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.state && (
                <p className="text-red-500 text-sm">{errors.state.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="city" className="text-sm font-medium text-gray-700">
                City
              </Label>
              <Select onValueChange={(value) => setValue('city', value)} disabled={!selectedState}>
                <SelectTrigger>
                  <SelectValue placeholder="Select city" />
                </SelectTrigger>
                <SelectContent>
                  {cities.map((city) => (
                    <SelectItem key={city} value={city}>
                      {city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.city && (
                <p className="text-red-500 text-sm">{errors.city.message}</p>
              )}
            </div>
          </div>

          {/* Locality and Society */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="locality" className="text-sm font-medium text-gray-700">
                Locality/Area
              </Label>
              <Input
                id="locality"
                {...register('locality')}
                placeholder="e.g., Sector 18, JP Nagar"
                className="w-full"
              />
              {errors.locality && (
                <p className="text-red-500 text-sm">{errors.locality.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="societyName" className="text-sm font-medium text-gray-700">
                Society/Project Name
              </Label>
              <Input
                id="societyName"
                {...register('societyName')}
                placeholder="e.g., Green Valley Plots"
                className="w-full"
              />
            </div>
          </div>

          {/* Pincode and Landmark */}
          {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="pincode" className="text-sm font-medium text-gray-700">
                Pincode *
              </Label>
              <Input
                id="pincode"
                {...register('pincode')}
                placeholder="e.g., 560078"
                maxLength={6}
                className="w-full"
              />
              {errors.pincode && (
                <p className="text-red-500 text-sm">{errors.pincode.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="landmark" className="text-sm font-medium text-gray-700">
                Landmark
              </Label>
              <Input
                id="landmark"
                {...register('landmark')}
                placeholder="e.g., Near Metro Station"
                className="w-full"
              />
            </div>
          </div> */}

          {/* Full Address */}
          {/* <div className="space-y-2">
            <Label htmlFor="address" className="text-sm font-medium text-gray-700">
              Complete Address *
            </Label>
            <Textarea
              id="address"
              {...register('address')}
              placeholder="Enter the complete address of the plot"
              rows={3}
              className="w-full"
            />
            {errors.address && (
              <p className="text-red-500 text-sm">{errors.address.message}</p>
            )}
          </div> */}

          {/* Nearby Places */}
          {/* <div className="space-y-2">
            <Label htmlFor="nearbyPlaces" className="text-sm font-medium text-gray-700">
              Nearby Places (Optional)
            </Label>
            <Textarea
              id="nearbyPlaces"
              {...register('nearbyPlaces')}
              placeholder="e.g., 2 km from main market, 500m from school, adjacent to park"
              rows={2}
              className="w-full"
            />
            <p className="text-gray-500 text-xs">
              Mention important places like schools, hospitals, markets, transportation hubs nearby
            </p>
          </div> */}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={onBack}
            >
              Back
            </Button>
            <Button type="submit" className="bg-red-600 hover:bg-red-700 text-white">
              Next: Sale Details
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
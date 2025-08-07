import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LandPlotAmenities } from '@/types/landPlotProperty';

const amenitiesSchema = z.object({
  waterConnection: z.enum(['yes', 'no', 'borewell', 'municipal']),
  electricityConnection: z.enum(['yes', 'no', 'nearby']),
  sewerageConnection: z.enum(['yes', 'no', 'septic_tank']),
  gasConnection: z.enum(['yes', 'no', 'pipeline']),
  internetConnectivity: z.enum(['yes', 'no', 'fiber', 'broadband']),
  roadConnectivity: z.enum(['excellent', 'good', 'average', 'poor']),
  publicTransport: z.enum(['yes', 'no', 'nearby']),
  streetLights: z.boolean(),
  drainage: z.enum(['good', 'average', 'poor', 'none']),
  soilType: z.enum(['black_cotton', 'red', 'alluvial', 'sandy', 'clay', 'loam']).optional(),
  waterLevel: z.enum(['high', 'medium', 'low']).optional(),
  floodProne: z.boolean(),
});

type AmenitiesForm = z.infer<typeof amenitiesSchema>;

interface LandPlotAmenitiesStepProps {
  initialData: Partial<LandPlotAmenities>;
  onNext: (data: AmenitiesForm) => void;
  onBack: () => void;
}

export const LandPlotAmenitiesStep: React.FC<LandPlotAmenitiesStepProps> = ({
  initialData,
  onNext,
  onBack,
}) => {
  const { handleSubmit, setValue, formState: { errors } } = useForm<AmenitiesForm>({
    resolver: zodResolver(amenitiesSchema),
    defaultValues: {
      ...initialData,
      streetLights: initialData.streetLights || false,
      floodProne: initialData.floodProne || false,
    }
  });

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-gray-900">
          Infrastructure & Amenities
        </CardTitle>
        <p className="text-gray-600">
          Provide details about available infrastructure and amenities
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onNext)} className="space-y-6">
          {/* Basic Utilities */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Basic Utilities</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Water Connection *</Label>
                <Select onValueChange={(value) => setValue('waterConnection', value as any)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select water connection" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">Yes - Direct Connection</SelectItem>
                    <SelectItem value="municipal">Municipal Supply</SelectItem>
                    <SelectItem value="borewell">Borewell Available</SelectItem>
                    <SelectItem value="no">No Connection</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Electricity Connection *</Label>
                <Select onValueChange={(value) => setValue('electricityConnection', value as any)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select electricity status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">Yes - Connected</SelectItem>
                    <SelectItem value="nearby">Available Nearby</SelectItem>
                    <SelectItem value="no">Not Available</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Sewerage Connection *</Label>
                <Select onValueChange={(value) => setValue('sewerageConnection', value as any)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select sewerage option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">Yes - Connected</SelectItem>
                    <SelectItem value="septic_tank">Septic Tank</SelectItem>
                    <SelectItem value="no">Not Available</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Gas Connection *</Label>
                <Select onValueChange={(value) => setValue('gasConnection', value as any)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select gas connection" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pipeline">Pipeline Available</SelectItem>
                    <SelectItem value="yes">LPG Connection</SelectItem>
                    <SelectItem value="no">Not Available</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Connectivity */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Connectivity</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Road Connectivity *</Label>
                <Select onValueChange={(value) => setValue('roadConnectivity', value as any)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select road connectivity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="excellent">Excellent (Tar Road)</SelectItem>
                    <SelectItem value="good">Good (Paved Road)</SelectItem>
                    <SelectItem value="average">Average (Kutcha Road)</SelectItem>
                    <SelectItem value="poor">Poor (Dirt Road)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Public Transport *</Label>
                <Select onValueChange={(value) => setValue('publicTransport', value as any)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select transport availability" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">Easily Available</SelectItem>
                    <SelectItem value="nearby">Available Nearby</SelectItem>
                    <SelectItem value="no">Not Available</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Internet Connectivity *</Label>
              <Select onValueChange={(value) => setValue('internetConnectivity', value as any)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select internet connectivity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fiber">Fiber Optic Available</SelectItem>
                  <SelectItem value="broadband">Broadband Available</SelectItem>
                  <SelectItem value="yes">Basic Connection</SelectItem>
                  <SelectItem value="no">Not Available</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Infrastructure */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Infrastructure</h3>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Drainage System *</Label>
              <Select onValueChange={(value) => setValue('drainage', value as any)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select drainage quality" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="good">Good - Proper Drainage</SelectItem>
                  <SelectItem value="average">Average - Basic Drainage</SelectItem>
                  <SelectItem value="poor">Poor - Limited Drainage</SelectItem>
                  <SelectItem value="none">No Drainage System</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="streetLights"
                onCheckedChange={(checked) => setValue('streetLights', !!checked)}
              />
              <Label htmlFor="streetLights" className="text-sm font-medium text-gray-700">
                Street Lights Available
              </Label>
            </div>
          </div>

          {/* Land Characteristics */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Land Characteristics (Optional)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Soil Type</Label>
                <Select onValueChange={(value) => setValue('soilType', value as any)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select soil type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="black_cotton">Black Cotton</SelectItem>
                    <SelectItem value="red">Red Soil</SelectItem>
                    <SelectItem value="alluvial">Alluvial</SelectItem>
                    <SelectItem value="sandy">Sandy</SelectItem>
                    <SelectItem value="clay">Clay</SelectItem>
                    <SelectItem value="loam">Loam</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Water Level</Label>
                <Select onValueChange={(value) => setValue('waterLevel', value as any)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select water level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">High (0-20 feet)</SelectItem>
                    <SelectItem value="medium">Medium (20-50 feet)</SelectItem>
                    <SelectItem value="low">Low (50+ feet)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="floodProne"
                onCheckedChange={(checked) => setValue('floodProne', !!checked)}
              />
              <Label htmlFor="floodProne" className="text-sm font-medium text-gray-700">
                Flood Prone Area
              </Label>
            </div>
          </div>

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
              Next: Photos & Videos
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};